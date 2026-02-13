package com.onnongwa.back_end.domain.video.controller;

import com.onnongwa.back_end.domain.video.service.VideoComposerService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/video-jobs/{jobId}/file")
@RequiredArgsConstructor
public class FinalFileController {

	private final VideoComposerService composerService;

	// 최종 합성 파일
	@GetMapping
	public ResponseEntity<FileSystemResource> streamFinal(@PathVariable Long jobId) {
		FileSystemResource res = composerService.loadFinalFile(jobId);
		if (res == null || !res.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaTypeFactory.getMediaType(res.getFilename())
			.orElse(MediaType.APPLICATION_OCTET_STREAM));
		headers.setContentDisposition(ContentDisposition.inline().filename(res.getFilename()).build());
		return new ResponseEntity<>(res, headers, HttpStatus.OK);
	}
}