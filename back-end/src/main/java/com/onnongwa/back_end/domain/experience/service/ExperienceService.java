package com.onnongwa.back_end.domain.experience.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpDetailDto;
import com.onnongwa.back_end.domain.experience.controller.dto.ExpListDto;
import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDto;
import com.onnongwa.back_end.domain.experience.elasticsearch.document.ExperienceDocument;
import com.onnongwa.back_end.domain.experience.elasticsearch.repository.ExperienceElasticRepository;
import com.onnongwa.back_end.domain.experience.entity.Experience;
import com.onnongwa.back_end.domain.experience.entity.ExperienceSchedule;
import com.onnongwa.back_end.domain.experience.repository.ExperienceRepository;
import com.onnongwa.back_end.domain.farm.entity.Farm;
import com.onnongwa.back_end.domain.farm.repository.FarmRepository;
import com.onnongwa.back_end.open_api.service.OpenApiService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExperienceService {

	private final ExperienceRepository experienceRepository;
	private final ExperienceElasticRepository experienceElasticRepository;
	private final FarmRepository farmRepository;

	private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
	private final String IMAGE_BASE_URL = "/uploads/";

	@Transactional
	public void registerExperience(ExpRegisterDto dto){

		Farm farm = farmRepository.findById(1L).orElseThrow(() -> new EntityNotFoundException("Farm not found with id : 1L"));

		Experience experience = experienceRepository.save(Experience.from(dto,farm));;

		experienceElasticRepository.save(ExperienceDocument.from(experience));
	}

	@Transactional
	public ExpDetailDto getExperienceById(Long id) {
		Experience experience = experienceRepository.findById(id)
			.orElseThrow(() ->  new EntityNotFoundException(  "Farm not found with id : " + id));

		experience.increaseViewCount();

		return experience.toDetailDto();
	}


	public List<ExpListDto> getTop3ExperiencesByViewCount() {

		List<Experience> top3s = experienceRepository.findTop3ByViewCount();

		List<ExpListDto> dtos = new ArrayList<>();
		for(Experience e: top3s){
			dtos.add(e.toListDto());
		}

		return dtos;
	}

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

		return IMAGE_BASE_URL + savedFileName;
	}
}
