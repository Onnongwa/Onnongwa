package com.onnongwa.back_end.domain.farm.service;

import org.springframework.stereotype.Service;

import com.onnongwa.back_end.domain.farm.controller.dto.FarmRegisterDto;
import com.onnongwa.back_end.domain.farm.controller.dto.FarmResponseDto;
import com.onnongwa.back_end.domain.farm.entity.Farm;
import com.onnongwa.back_end.domain.farm.repository.FarmRepository;
import com.onnongwa.back_end.domain.user.entity.User;
import com.onnongwa.back_end.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FarmService {

	private final FarmRepository farmRepository;
	private final UserRepository userRepository;

	public void registerFarm(FarmRegisterDto dto) {

		// jwt가 없어서 임시로 User 삽입
		User user = userRepository.findById(1L).orElseThrow();

		farmRepository.save(Farm.builder()
			.name(dto.name())
			.description(dto.description())
			.address(dto.address())
			.businessNumber(dto.businessNumber())
			.user(user)
			.build());
	}

	public FarmResponseDto getFarmById(Long id) {

		Farm farm = farmRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("Farm not found: " + id));

		return FarmResponseDto.from(farm);
	}
}
