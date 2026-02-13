package com.onnongwa.back_end.domain.video.controller;

import java.nio.file.Path;
import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onnongwa.back_end.domain.video.service.YoutubeUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video-jobs")
public class VideoUploadController {

	private final YoutubeUploadService youTubeUploadService;

	@PostMapping("/{jobId}/youtube-upload")
	public Map<String, String> upload(@PathVariable Long jobId,
		@RequestParam String filePath) {
		String videoId = youTubeUploadService.uploadVideo(jobId, Path.of(filePath));
		return Map.of("videoId", videoId, "link", "https://youtu.be/" + videoId);
	}

}