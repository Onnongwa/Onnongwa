package com.onnongwa.back_end.domain.experience.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDTO;
import com.onnongwa.back_end.open_api.dto.AiOnboardingDTO;
import com.onnongwa.back_end.open_api.service.OpenApiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExperienceService {

	private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
	private final String IMAGE_BASE_URL = "/uploads/";

	private final OpenApiService openApiService;

	public String saveImageAndGetUrl(MultipartFile file) throws IOException{
		if (file.isEmpty()){
			throw new IllegalAccessError("이미지가 존재하지 않습니다.");
		}

		// 업로드 디렉토리 경로
		Path uploadPath = Paths.get(UPLOAD_DIR);
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath); // 디렉토리가 없으면 생성
		}

		String originImageName = file.getOriginalFilename();
		String savedFileName = UUID.randomUUID() + "_" + originImageName;
		Path path = Paths.get(UPLOAD_DIR + savedFileName);

		Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

		System.out.println(IMAGE_BASE_URL + savedFileName);


		return IMAGE_BASE_URL + savedFileName;
	}

}
