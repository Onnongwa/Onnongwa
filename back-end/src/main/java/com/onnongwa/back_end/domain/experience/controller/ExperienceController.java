package com.onnongwa.back_end.domain.experience.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDTO;
import com.onnongwa.back_end.domain.experience.service.ExperienceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/experience")
public class ExperienceController {

	private final ExperienceService experienceService;

	@PostMapping("/onboarding")
	public ResponseEntity<?> generateExperienceContent(@RequestBody ExpRegisterDTO dto){

		experienceService.generateExperienceContent(dto);

		return ResponseEntity.ok(null);

	}


	@PostMapping("/imgupload")
	public ResponseEntity<?> imageUpload(@RequestParam("file")MultipartFile file) throws IOException {

		String url = experienceService.saveImageAndGetUrl(file);

		return ResponseEntity.status(HttpStatus.OK)
			.body(Map.of("url", url));
	}


}
