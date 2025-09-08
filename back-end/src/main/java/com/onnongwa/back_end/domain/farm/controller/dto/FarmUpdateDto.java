package com.onnongwa.back_end.domain.farm.controller.dto;

public record FarmUpdateDto(
	String name,
	String address,
	String description,
	String businessNumber // 사업자 번호
) {
}
