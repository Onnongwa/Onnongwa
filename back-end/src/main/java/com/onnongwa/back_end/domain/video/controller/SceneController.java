package com.onnongwa.back_end.domain.video.controller;

import com.onnongwa.back_end.domain.video.dto.SceneResponse;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-jobs/{jobId}/scenes")
@RequiredArgsConstructor
public class SceneController {

	private final VideoJobRepository jobRepository;
	private final VideoSceneRepository sceneRepository;

	@GetMapping
	public ResponseEntity<List<SceneResponse>> getScenes(@PathVariable Long jobId) {
		VideoJob job = jobRepository.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));

		List<VideoScene> scenes = sceneRepository.findByJobOrderBySceneIndexAsc(job);

		List<SceneResponse> body = scenes.stream()
			.map(s -> new SceneResponse(
				s.getId(),
				s.getSceneIndex(),
				s.getState().name(),
				s.getImageIndex(),  // imageIndex 유지
				s.getDurationSec(),
				s.getTaskId(),      // runwayTaskId 대신 taskId
				s.getResultUrl()
			))
			.toList();

		return ResponseEntity.ok(body);
	}
}