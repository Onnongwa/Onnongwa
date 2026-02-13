package com.onnongwa.back_end.domain.video.controller;

import com.onnongwa.back_end.domain.video.service.RunwayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/video-jobs/{jobId}/render")
@RequiredArgsConstructor
public class RenderController {

	private final RunwayService runwayService;

	// scene 렌터 큐에 등록
	@PostMapping
	public ResponseEntity<Void> enqueue(@PathVariable Long jobId) {
		runwayService.enqueueScenes(jobId);
		return ResponseEntity.accepted().build(); // 202
	}
}