package com.onnongwa.back_end.domain.video.service;

import com.onnongwa.back_end.domain.experience.entity.Experience;
import com.onnongwa.back_end.domain.experience.repository.ExperienceRepository;
import com.onnongwa.back_end.domain.video.client.RunwayApiClient;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RunwayService {

	private static final Set<String> ALLOWED_RATIOS = Set.of(
		"1280:720", "720:1280", "1104:832", "832:1104", "960:960", "1584:672"
	);
	private static final String RATIO_SHORTS = "720:1280";
	private static final int DURATION_SEC = 5;

	private static final String DEFAULT_PROMPT_KO =
		"당신은 Runway 비디오 생성을 위한 영상 연출자입니다. 각 장면(scene)마다 하나의 정지 이미지를 참고 이미지로 제공합니다.\n" +
			"목표:\n" +
			"- 주어진 이미지를 기반으로 5초짜리 영상을 만듭니다.\n" +
			"- 이미지를 그대로 살리되, 카메라 움직임이나 자연스러운 물리적 변화 같은 ‘미세한 모션’을 통해 영상처럼 보이도록 합니다.\n\n" +
			"전제:\n" +
			"- 각 장면은 외부에서 전달되는 이미지(promptImage)를 사용합니다.\n" +
			"- 프롬프트는 반드시 이미지 속 요소를 바탕으로 움직임을 묘사해야 합니다.\n" +
			"- 새로운 장면이나 존재하지 않는 오브젝트를 추가하지 마십시오.";

	private final VideoJobRepository jobRepo;
	private final VideoSceneRepository sceneRepo;
	private final ExperienceRepository experienceRepository;
	private final RunwayApiClient runway;
	private final VideoComposerService videoComposerService;

	@Value("${runway.model:gen4_turbo}")
	private String runwayModel;

	@Transactional
	public void enqueueScenes(Long jobId) {
		if (!ALLOWED_RATIOS.contains(RATIO_SHORTS)) {
			throw new IllegalStateException("Invalid ratio=" + RATIO_SHORTS +
				" (allowed: " + String.join(", ", ALLOWED_RATIOS) + ")");
		}

		VideoJob job = jobRepo.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));

		List<VideoScene> scenes = sceneRepo.findByJobOrderBySceneIndexAsc(job);
		if (scenes.isEmpty()) {
			log.warn("enqueueScenes: scenes not found (jobId={})", jobId);
			return;
		}

		// Experience.image 파싱 + HTTPS만 사용
		List<String> images = loadExperienceImages(job.getExperienceId()).stream()
			.map(String::trim)
			.filter(s -> !s.isEmpty())
			.filter(s -> s.toLowerCase(Locale.ROOT).startsWith("https://"))
			.distinct()
			.toList();

		if (images.isEmpty()) {
			throw new IllegalStateException(
				"Experience.image 에 HTTPS 이미지 URL이 1개 이상 필요합니다. " +
					"퍼블릭 S3 URL(https://...amazonaws.com/...)을 넣어주세요. experienceId=" + job.getExperienceId()
			);
		}

		for (VideoScene s : scenes) {
			if (s.getState() != VideoSceneState.QUEUED) continue;

			int idx = safeIndex(s.getImageIndex(), images.size());
			String imageUrl = images.get(idx);

			try {
				log.info("[Runway][enqueue] jobId={}, sceneId={}, model={}, ratio={}, duration={}, imageUrl={}",
					jobId, s.getId(), runwayModel, RATIO_SHORTS, DURATION_SEC, imageUrl);

				var create = runway.createGeneration(
					runwayModel,
					DEFAULT_PROMPT_KO,
					RATIO_SHORTS,
					DURATION_SEC,
					imageUrl
				);

				String taskId = create.id();
				if (taskId == null || taskId.isBlank()) {
					throw new IllegalStateException("Runway returned no taskId (sceneId=" + s.getId() + ")");
				}

				s.markRendering(taskId);
				log.info("Runway queued: jobId={}, sceneId={}, taskId={}, imageIndex={}", jobId, s.getId(), taskId, idx);

				try { Thread.sleep(120L); } catch (InterruptedException ignored) {}

			} catch (Exception e) {
				log.error("Runway enqueue failed: jobId={}, sceneId={}, err={}", jobId, s.getId(), e.getMessage(), e);
				s.markFailed();
			}
		}
	}

	/** 모든 RENDERING 씬 폴링 → result_url 저장 */
	@Transactional
	public void pollAllRendering() {
		// 1. RENDERING 씬 가져오기
		List<VideoScene> rendering = sceneRepo.findAll().stream()
			.filter(s -> s.getState() == VideoSceneState.RENDERING)
			.toList();

		// 2. 각 씬 상태 갱신 (result_url 채워짐)
		for (VideoScene s : rendering) updateSceneFromTask(s);

		// 3. jobId별로 모두 DONE인지 확인 후 합치기
		Map<VideoJob, List<VideoScene>> byJob = sceneRepo.findAll().stream()
			.collect(Collectors.groupingBy(VideoScene::getJob));

		for (Map.Entry<VideoJob, List<VideoScene>> e : byJob.entrySet()) {
			VideoJob job = e.getKey();
			List<VideoScene> scenes = e.getValue();
			boolean allDone = !scenes.isEmpty() && scenes.stream().allMatch(sc -> sc.getState() == VideoSceneState.DONE);

			if (allDone && (job.getFinalVideoUrl() == null || job.getFinalVideoUrl().isBlank())) {
				try {
					String finalUrl = videoComposerService.composeIfReady(job.getId());
					log.info("Composed final video. jobId={}, finalUrl={}", job.getId(), finalUrl);
				} catch (Exception ex) {
					log.error("composeIfReady failed. jobId={}, err={}", job.getId(), ex.getMessage(), ex);
				}
			}
		}
	}

	// 씬 업데이트
	private void updateSceneFromTask(VideoScene s) {
		try {
			var tr = runway.getGeneration(s.getTaskId());
			String status = tr.status();

			if (isSucceeded(status)) {
				String url = tr.outputUrl();
				if (url == null || url.isBlank()) {
					log.warn("Runway succeeded but no URL: sceneId={}, taskId={}", s.getId(), s.getTaskId());
					return;
				}
				s.markDone(url); // ★ DB: result_url 채움 + state=DONE
				log.info("Runway done: sceneId={}, url={}", s.getId(), url);

			} else if (isFailed(status)) {
				s.markFailed();
				log.warn("Runway failed: sceneId={}, taskId={}", s.getId(), s.getTaskId());
			}

		} catch (Exception e) {
			log.error("Runway poll failed: sceneId={}, err={}", s.getId(), e.getMessage(), e);
		}
	}

	private List<String> loadExperienceImages(Long experienceId) {
		Experience exp = experienceRepository.findById(experienceId)
			.orElseThrow(() -> new IllegalArgumentException("Experience not found: " + experienceId));

		String raw = exp.getImage();
		if (raw == null || raw.isBlank()) return List.of();

		String t = raw.trim();
		List<String> out = new ArrayList<>();

		if (t.startsWith("[") && t.endsWith("]")) {
			String inner = t.substring(1, t.length() - 1);
			Arrays.stream(inner.split(","))
				.map(s -> s.replace("\"", "").trim())
				.filter(s -> !s.isEmpty())
				.forEach(out::add);
		} else {
			Arrays.stream(t.split("[,;\\s]+"))
				.map(String::trim)
				.filter(s -> !s.isEmpty())
				.forEach(out::add);
		}
		return out.stream().distinct().limit(3).toList();
	}

	private int safeIndex(Integer idx, int size) {
		if (idx == null || idx < 0) return 0;
		return Math.min(idx, size - 1);
	}

	private boolean isSucceeded(String s) {
		if (s == null) return false;
		s = s.toLowerCase(Locale.ROOT);
		return s.equals("succeeded") || s.equals("completed") || s.equals("done") || s.equals("success");
	}

	private boolean isFailed(String s) {
		if (s == null) return false;
		s = s.toLowerCase(Locale.ROOT);
		return s.equals("failed") || s.equals("error");
	}
}
