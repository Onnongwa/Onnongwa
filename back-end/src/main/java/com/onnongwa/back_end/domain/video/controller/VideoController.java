package com.onnongwa.back_end.domain.video.controller;

import com.onnongwa.back_end.domain.video.dto.CreateJobResponse;
import com.onnongwa.back_end.domain.video.dto.GenerateVideoRequest;
import com.onnongwa.back_end.domain.video.dto.JobStatusResponse;
import com.onnongwa.back_end.domain.video.dto.SceneResponse;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import com.onnongwa.back_end.domain.video.service.PromptService;
import com.onnongwa.back_end.domain.video.service.RunwayService;
import com.onnongwa.back_end.domain.video.service.VideoComposerService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

	private final PromptService promptService;
	private final RunwayService runwayService;
	private final VideoComposerService composerService;

	private final VideoJobRepository jobRepository;
	private final VideoSceneRepository sceneRepository;

	/**
	 * [POST] /api/videos/experiences/{experienceId}/generate
	 * - 요청: GenerateVideoRequest(title, templateVersion)  // (aspectRatio, sceneCount는 무시)
	 * - 동작: 대본 생성 + Job/Scene 저장 + 즉시 Runway 제출
	 * - 응답: 생성된 jobId
	 */
	@PostMapping("/experiences/{experienceId}/generate")
	public ResponseEntity<CreateJobResponse> generate(
		@PathVariable Long experienceId,
		@RequestParam Long userId,
		@RequestBody(required = false) GenerateVideoRequest req
	) {
		// 1) 대본 생성 + Job/Scene 저장
		Long jobId = promptService.generateAndPersist(
			experienceId,
			userId,
			(req == null ? null : req.title()),
			(req == null ? null : req.templateVersion())
		);

		// 2) Runway 제출 (씬 3개)
		runwayService.enqueueScenes(jobId);

		return ResponseEntity.ok(new CreateJobResponse(jobId));
	}

	/**
	 * [GET] /api/videos/jobs/{jobId}
	 * - 잡 상태/진행률 조회
	 */
	@GetMapping("/jobs/{jobId}")
	public ResponseEntity<JobStatusResponse> getJob(@PathVariable Long jobId) {
		VideoJob job = jobRepository.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));

		long done    = sceneRepository.countByJobAndState(job, VideoSceneState.DONE);
		long failed  = sceneRepository.countByJobAndState(job, VideoSceneState.FAILED);
		long running = sceneRepository.countByJobAndState(job, VideoSceneState.RENDERING);
		long queued  = sceneRepository.countByJobAndState(job, VideoSceneState.QUEUED);

		int total = sceneRepository.findByJobOrderBySceneIndexAsc(job).size(); // 보통 3

		return ResponseEntity.ok(
			new JobStatusResponse(
				job.getId(),
				job.getTitle(),
				job.getStatus() == null ? null : job.getStatus().name(),
				total,
				(int) done,
				(int) running,
				(int) failed,
				(int) queued,          // ← 기존 'prompted' 자리에 'queued' 매핑
				job.getFinalVideoUrl()
			)
		);
	}

	/**
	 * [GET] /api/videos/jobs/{jobId}/scenes
	 * - 씬 상세 목록
	 */
	@GetMapping("/jobs/{jobId}/scenes")
	public ResponseEntity<List<SceneResponse>> getScenes(@PathVariable Long jobId) {
		VideoJob job = jobRepository.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));

		List<VideoScene> scenes = sceneRepository.findByJobOrderBySceneIndexAsc(job);

		// SceneResponse 필드 변경: promptText/negativeText/runwayTaskId 제거 → imageIndex/taskId 로 단순화
		List<SceneResponse> body = scenes.stream()
			.map(s -> new SceneResponse(
				s.getId(),
				s.getSceneIndex(),
				s.getState().name(),
				s.getImageIndex(),   // ← 추가
				s.getDurationSec(),
				s.getTaskId(),       // ← runwayTaskId 대신 taskId
				s.getResultUrl()
			))
			.toList();

		return ResponseEntity.ok(body);
	}

	/**
	 * [GET] /api/videos/jobs/{jobId}/file
	 * - 최종 합성본 파일 스트리밍
	 * - 아직 합성이 안 됐다면 404
	 */
	@GetMapping("/jobs/{jobId}/file")
	public ResponseEntity<FileSystemResource> streamFinal(@PathVariable Long jobId) {
		FileSystemResource res = composerService.loadFinalFile(jobId);
		if (res == null || !res.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaTypeFactory.getMediaType(res.getFilename())
			.orElse(MediaType.APPLICATION_OCTET_STREAM));
		headers.setContentDisposition(
			ContentDisposition.inline().filename(res.getFilename()).build()
		);
		return new ResponseEntity<>(res, headers, HttpStatus.OK);
	}
}
