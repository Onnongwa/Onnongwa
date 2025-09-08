package com.onnongwa.back_end.domain.experience.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDto;
import com.onnongwa.back_end.domain.experience.entity.Experience;
import com.onnongwa.back_end.domain.experience.entity.ExperienceSchedule;
import com.onnongwa.back_end.domain.experience.repository.ExperienceRepository;
import com.onnongwa.back_end.domain.farm.entity.Farm;
import com.onnongwa.back_end.domain.farm.repository.FarmRepository;
import com.onnongwa.back_end.open_api.service.OpenApiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExperienceService {

	private final ExperienceRepository experienceRepository;
	private final FarmRepository farmRepository;

	private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
	private final String IMAGE_BASE_URL = "/uploads/";

	public void registerExperience(ExpRegisterDto dto){

		Farm farm = farmRepository.findById(1L).orElseThrow();

		Experience experience = Experience.builder()
			.title(dto.title())
			.description(dto.description())
			.location(dto.location())
			.duration(dto.duration())
			.price(dto.price())
			.address(dto.address())
			.placeType(dto.placeType())
			.regionType(dto.regionType())
			.crops(dto.crops())
			.operatingHours(dto.operatingHours())
			.minParticipants(dto.minParticipants())
			.maxParticipants(dto.maxParticipants())
			.imageUrl(dto.imageUrl())
			.closedDays(dto.closedDays())
			.highlights(dto.highlights())
			.inclusions(dto.inclusions())
			.hashtags(dto.hashtags())
			.hostName(dto.host().name())
			.hostPhone(dto.host().phone())
			.hostEmail(dto.host().email())
			.hostFarmName(dto.host().farmName())
			.farm(farm)
			.build();

		// 스케줄 추가
		dto.schedule().forEach(s -> {
			ExperienceSchedule schedule = new ExperienceSchedule(s.time(), s.activity(), experience);
			experience.addSchedule(schedule);
		});

		experienceRepository.save(experience);
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

		System.out.println(IMAGE_BASE_URL + savedFileName);


		return IMAGE_BASE_URL + savedFileName;
	}

}
