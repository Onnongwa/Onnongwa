package com.onnongwa.back_end.domain.video.controller;

import com.onnongwa.back_end.domain.video.dto.CreateJobResponse;
import com.onnongwa.back_end.domain.video.dto.GenerateVideoRequest;
import com.onnongwa.back_end.domain.video.dto.JobStatusResponse;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import com.onnongwa.back_end.domain.video.service.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/video-jobs")
@RequiredArgsConstructor
public class JobController {

	private final PromptService promptService;
	private final VideoJobRepository jobRepository;
	private final VideoSceneRepository sceneRepository;

	// 대본 생성
	// job / scene 저장
	@PostMapping("/experiences/{experienceId}")
	public ResponseEntity<CreateJobResponse> createJob(
		@PathVariable Long experienceId,
		@RequestParam Long userId,
		@RequestBody(required = false) GenerateVideoRequest req
	) {
		Long jobId = promptService.generateAndPersist(
			experienceId,
			userId,
			(req == null ? null : req.title()),
			(req == null ? null : req.templateVersion())
		);
		return ResponseEntity.status(HttpStatus.CREATED).body(new CreateJobResponse(jobId));
	}

	// job 상태 / 진행률 조회
	@GetMapping("/{jobId}")
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
				(int) queued,
				job.getFinalVideoUrl()
			)
		);
	}
}