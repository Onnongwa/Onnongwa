package com.onnongwa.back_end.domain.video.service;

import com.onnongwa.back_end.domain.video.config.MediaProperties;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoJobStatus;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoComposerService {

	private final VideoJobRepository jobRepo;
	private final VideoSceneRepository sceneRepo;

	private final WebClient.Builder webClientBuilder; // 다운로드 용
	private final MediaProperties mediaProps;

	private static final int TARGET_AUDIO_SEC = 15; // 15초 고정

	/**
	 * 모든 Scene이 DONE이면 최종 합성한다.
	 * - 작업 디렉토리: {baseDir}/jobs/{jobId}/
	 * - 각 씬 mp4 다운로드 → concat → (선택) TTS 오디오 입힘
	 * - 최종 파일은 {baseDir}/jobs/{jobId}/final.mp4 로 저장
	 * - video_job.final_video_url 에는 file:// 절대경로를 기록(임시)
	 *
	 * @return 최종 산출물의 로컬 파일 URL (file://...), 아직 준비 안 되었으면 null
	 */
	@Transactional
	public String composeIfReady(Long jobId) {
		VideoJob job = jobRepo.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));

		// 모든 씬 DONE인지 확인
		List<VideoScene> scenes = sceneRepo.findByJobOrderBySceneIndexAsc(job);
		if (scenes.isEmpty() || scenes.stream().anyMatch(s -> s.getState() != VideoSceneState.DONE)) {
			log.info("Job {} not ready to compose (scenes not DONE).", jobId);
			return null;
		}

		try {
			// 작업 디렉토리 준비
			Path jobDir = Paths.get(mediaProps.getBaseDir(), "jobs", String.valueOf(jobId));
			Files.createDirectories(jobDir);

			// 1. 각 씬 비디오 다운로드
			List<Path> partFiles = downloadAll(scenes, jobDir);

			// 2. concat 리스트 파일 작성 (ffmpeg concat demuxer)
			Path listFile = jobDir.resolve("list.txt");
			try (BufferedWriter bw = Files.newBufferedWriter(listFile)) {
				for (Path p : partFiles) {
					bw.write("file '" + p.toAbsolutePath().toString().replace("'", "\\'") + "'");
					bw.newLine();
				}
			}

			// 3. TTS 다운로드 및 15초 정규화
			Path tts15 = null;
			if (job.getTtsUrl() != null && !job.getTtsUrl().isBlank()) {
				Path ttsRaw = jobDir.resolve("tts_src");
				downloadToFile(job.getTtsUrl(), ttsRaw);
				tts15 = jobDir.resolve("tts_15s.wav");
				boolean okAudio = runFfmpeg(new String[]{
					mediaProps.getFfmpegPath(), "-y",
					"-i", ttsRaw.toAbsolutePath().toString(),
					"-af", "apad=pad_dur=" + TARGET_AUDIO_SEC + ",atrim=0:" + TARGET_AUDIO_SEC + ",asetpts=N/SR/TB",
					tts15.toAbsolutePath().toString()
				});
				if (!okAudio) {
					log.warn("TTS normalize failed; proceeding without audio. jobId={}", jobId);
					tts15 = null; // 오디오 없이 진행
				}
			}

			// 4. ffmpeg 합성 → {baseDir}/jobs/{jobId}/final.mp4
			Path outFile = jobDir.resolve("final.mp4");
			boolean ok;

			if (tts15 == null) {
				ok = runFfmpeg(new String[]{
					mediaProps.getFfmpegPath(), "-y",
					"-safe", "0",
					"-f", "concat",
					"-i", listFile.toAbsolutePath().toString(),
					"-c", "copy",
					outFile.toAbsolutePath().toString()
				});
				if (!ok) {
					log.warn("Fast concat failed. Trying re-encode fallback...");
					ok = runFfmpeg(new String[]{
						mediaProps.getFfmpegPath(), "-y",
						"-safe", "0",
						"-f", "concat",
						"-i", listFile.toAbsolutePath().toString(),
						"-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
						"-an", // 오디오 없음
						outFile.toAbsolutePath().toString()
					});
				}
			} else {
				// 비디오 concat + TTS 오디오 입히기 (길이 안 맞으면 shortest)
				ok = runFfmpeg(new String[]{
					mediaProps.getFfmpegPath(), "-y",
					"-safe", "0",
					"-f", "concat", "-i", listFile.toAbsolutePath().toString(),
					"-i", tts15.toAbsolutePath().toString(),
					"-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
					"-c:a", "aac", "-b:a", "192k",
					"-shortest",
					outFile.toAbsolutePath().toString()
				});
				if (!ok) {
					// 마지막 수단: 호환성 높여 재인코드
					log.warn("Concat+audio failed. Trying more compatible re-encode...");
					ok = runFfmpeg(new String[]{
						mediaProps.getFfmpegPath(), "-y",
						"-safe", "0",
						"-f", "concat", "-i", listFile.toAbsolutePath().toString(),
						"-i", tts15.toAbsolutePath().toString(),
						"-vf", "format=yuv420p",
						"-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
						"-c:a", "aac", "-b:a", "192k",
						"-shortest",
						outFile.toAbsolutePath().toString()
					});
				}
			}

			if (!ok) throw new IllegalStateException("ffmpeg failed to compose video.");

			// 5. 퍼블릭 폴더 복사/URL 생성 단계 제거
			String fileUrl = outFile.toUri().toString();
			job.setFinalVideoUrl(fileUrl);
			job.setStatus(VideoJobStatus.DONE);

			log.info("Composed final video for job {} -> {}", jobId, fileUrl);
			return fileUrl;

		} catch (Exception e) {
			log.error("Compose failed for job {}: {}", jobId, e.toString(), e);
			job.setStatus(VideoJobStatus.FAILED);
			throw new RuntimeException(e);
		}
	}

	private List<Path> downloadAll(List<VideoScene> scenes, Path jobDir) {
		return scenes.stream().map(s -> {
			try {
				String url = s.getResultUrl();
				if (url == null || url.isBlank())
					throw new IllegalStateException("Scene " + s.getId() + " has no result_url");
				Path target = jobDir.resolve("part_" + String.format(Locale.ROOT, "%02d", s.getSceneIndex()) + ".mp4");
				downloadToFile(url, target);
				return target;
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}).collect(Collectors.toList());
	}

	private void downloadToFile(String url, Path target) throws IOException {
		byte[] data = webClientBuilder.build()
			.get().uri(url)
			.retrieve()
			.bodyToMono(byte[].class)
			.block();
		if (data == null || data.length == 0)
			throw new IOException("Empty download: " + url);
		Files.write(target, data);
	}

	private boolean runFfmpeg(String[] cmd) throws IOException, InterruptedException {
		ProcessBuilder pb = new ProcessBuilder(cmd);
		pb.redirectErrorStream(true);
		Process p = pb.start();
		try (BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
			String line;
			while ((line = r.readLine()) != null) log.debug("[ffmpeg] {}", line);
		}
		int code = p.waitFor();
		log.info("ffmpeg exit code={}", code);
		return code == 0;
	}

	// 최종 산출물 파일 리소스 로드 - 컨트롤러 반환용
	public FileSystemResource loadFinalFile(Long jobId) {
		Path out = Paths.get(mediaProps.getBaseDir(), "jobs", String.valueOf(jobId), "final.mp4");
		return Files.exists(out) ? new FileSystemResource(out) : null;
	}
}
