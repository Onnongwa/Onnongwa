package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

public record ExpListDto(
	Long id,
	String imageUrl,
	String title,
	String description,
	String location,
	int price,
	List<String> hashTag
) {
}
