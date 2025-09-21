package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ExpListDto(
	@JsonProperty("id") Long id,
	@JsonProperty("imageUrl") String imageUrl,
	@JsonProperty("title") String title,
	@JsonProperty("description") String description,
	@JsonProperty("location") String location,
	@JsonProperty("price") int price,
	@JsonProperty("hashTag") List<String> hashTag
) {
}
