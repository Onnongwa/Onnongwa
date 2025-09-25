package com.onnongwa.back_end.domain.experience.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpOnboardingDto;
import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDto;
import com.onnongwa.back_end.domain.experience.elasticsearch.document.ExperienceDocument;
import com.onnongwa.back_end.domain.experience.service.ExperienceSearchService;
import com.onnongwa.back_end.domain.experience.service.ExperienceService;
import com.onnongwa.back_end.open_api.service.OpenApiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/experience")
public class ExperienceController {

	private final ExperienceService experienceService;
	private final ExperienceSearchService experienceSearchService;
	private final OpenApiService openApiService;


	@GetMapping("/search")
	public ResponseEntity<Page<ExperienceDocument>> experienceSearch(
		@RequestParam(required = false) String title,
		@RequestParam(required = false) String keyword,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size){
		return ResponseEntity.status(HttpStatus.OK)
			.body(experienceSearchService.findAutoCompleteSuggestionByKeyword(title,keyword,page,size));
	}

	@PostMapping
	public ResponseEntity<?> registerExperience(@RequestBody ExpRegisterDto dto){
		experienceService.registerExperience(dto);
		return ResponseEntity
			.status(HttpStatus.OK)
			.build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getExperienceById(@PathVariable("id") Long id ){
		return ResponseEntity
			.status(HttpStatus.OK)
			.body(experienceService.getExperienceById(id));
	}

	@GetMapping("/popular")
	public ResponseEntity<?> getTop3ExperiencesByViewCount() {
		return ResponseEntity.status(HttpStatus.OK)
			.body(experienceService.getTop3ExperiencesByViewCount());
	}

	@PostMapping("/onboarding")
	public ResponseEntity<?> generateExperienceContent(@RequestBody ExpOnboardingDto dto){
		return ResponseEntity.ok(openApiService.getChatCompletion(dto.toString()));

	}

	@PostMapping("/imgupload")
	public ResponseEntity<?> imageUpload(@RequestParam("file")MultipartFile file) throws IOException {

		String url = experienceService.saveImageAndGetUrl(file);
		return ResponseEntity.status(HttpStatus.OK)
			.body(Map.of("url", url));
	}
}
