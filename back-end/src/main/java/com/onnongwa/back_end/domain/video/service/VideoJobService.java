package com.onnongwa.back_end.domain.video.service;

import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoJobStatus;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoJobService {

	private final VideoJobRepository jobRepo;
	private final VideoSceneRepository sceneRepo;

	@Transactional
	public Long createJobWithScenes(Long experienceId,
		Long userId,
		String title,
		String templateVersion,
		String promoText) {

		String finalTitle = (title == null || title.isBlank()) ? "홍보 영상" : title;
		String finalTemplate = (templateVersion == null || templateVersion.isBlank()) ? "v1" : templateVersion;
		String finalPromo = (promoText == null) ? "" : promoText;

		// 1. Job 생성
		VideoJob job = VideoJob.builder()
			.experienceId(experienceId)
			.userId(userId)
			.title(finalTitle)
			.templateVersion(finalTemplate)
			.promoText(finalPromo)
			.status(VideoJobStatus.CREATED)
			.build();
		VideoJob saved = jobRepo.save(job);

		// 2. Scene 3개 생성 (임시)
		List<VideoScene> scenes = new ArrayList<>(3);
		for (int i = 0; i < 3; i++) {
			scenes.add(VideoScene.builder()
				.job(saved)
				.sceneIndex(i)
				.imageIndex(i)          // Experience.image 의 해당 인덱스를 사용
				.durationSec(5)         // 고정 5초
				.state(VideoSceneState.QUEUED)
				.build());
		}
		sceneRepo.saveAll(scenes);

		log.info("Created VideoJob id={}, scenes=3, title='{}'", saved.getId(), finalTitle);
		return saved.getId();
	}

	@Transactional
	public Long createJob(Long experienceId,
		Long userId,
		String title,
		String templateVersion,
		String promoText,
		int sceneCount,
		int durationSec) {
		int count = (sceneCount <= 0) ? 3 : sceneCount;
		int dur = (durationSec <= 0) ? 5 : durationSec;

		VideoJob job = VideoJob.builder()
			.experienceId(experienceId)
			.userId(userId)
			.title((title == null || title.isBlank()) ? "홍보 영상" : title)
			.templateVersion((templateVersion == null || templateVersion.isBlank()) ? "v1" : templateVersion)
			.promoText(promoText == null ? "" : promoText)
			.status(VideoJobStatus.CREATED)
			.build();
		VideoJob saved = jobRepo.save(job);

		List<VideoScene> scenes = new ArrayList<>(count);
		for (int i = 0; i < count; i++) {
			scenes.add(VideoScene.builder()
				.job(saved)
				.sceneIndex(i)
				.imageIndex(i)
				.durationSec(dur)
				.state(VideoSceneState.QUEUED)
				.build());
		}
		sceneRepo.saveAll(scenes);

		log.info("Created VideoJob id={}, scenes={}, title='{}'", saved.getId(), count, job.getTitle());
		return saved.getId();
	}
}
