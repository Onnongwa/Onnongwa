package com.onnongwa.back_end.domain.farm.controller.dto;

import com.onnongwa.back_end.domain.farm.entity.Farm;

public record FarmResponseDto(
	Long id,
	String name,
	String address,
	String description,
	String businessNumber // 사업자 번호
) {
	public static FarmResponseDto from(Farm farm) {
		return new FarmResponseDto(
			farm.getId(),
			farm.getName(),
			farm.getAddress(),
			farm.getDescription(),
			farm.getBusinessNumber()
		);
	}
}
