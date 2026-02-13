package com.onnongwa.back_end.domain.video.service;

import com.google.cloud.texttospeech.v1.*;
import com.onnongwa.back_end.domain.video.config.MediaProperties;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.*;

@Service
@RequiredArgsConstructor
public class JobTtsService {

	private final VideoJobRepository jobRepo;
	private final MediaProperties mediaProps;
	private final TextToSpeechClient ttsClient;

	@PreDestroy
	public void close() {
		try { ttsClient.close(); } catch (Exception ignored) {}
	}

	@Transactional
	public void ensureLocalTtsFile(Long jobId) {
		var job = jobRepo.findById(jobId).orElseThrow();
		if (job.getPromoText() == null || job.getPromoText().isBlank()) {
			throw new IllegalStateException("promo_text가 없습니다. jobId=" + jobId);
		}

		var jobDir = Paths.get(mediaProps.getBaseDir(), "jobs", String.valueOf(jobId));
		try { Files.createDirectories(jobDir); } catch (Exception ignored) {}

		var ttsMp3 = jobDir.resolve("tts_src.mp3");
		if (Files.exists(ttsMp3) && job.getTtsUrl() != null && !job.getTtsUrl().isBlank()) {
			return; // 이미 있음
		}

		byte[] mp3 = synthesizeKoMp3(job.getPromoText());
		try { Files.write(ttsMp3, mp3); }
		catch (Exception e) { throw new RuntimeException("TTS 파일 저장 실패", e); }

		job.setTtsUrl(ttsMp3.toUri().toString());
	}


	private byte[] synthesizeKoMp3(String text) {
		try {
			var input = SynthesisInput.newBuilder().setText(text).build();
			var voice = VoiceSelectionParams.newBuilder()
				.setName("ko-KR-Neural2-C")
				.setLanguageCode("ko-KR")
				.build();
			var audio = AudioConfig.newBuilder()
				.setAudioEncoding(AudioEncoding.MP3)
				.setSpeakingRate(1.02)
				.setPitch(0.0)
				.build();

			var request = SynthesizeSpeechRequest.newBuilder()
				.setInput(input).setVoice(voice).setAudioConfig(audio).build();

			var response = ttsClient.synthesizeSpeech(request);
			return response.getAudioContent().toByteArray();
		} catch (Exception e) {
			throw new RuntimeException("TTS 합성 실패", e);
		}
	}
}