package com.onnongwa.back_end.domain.video.dto;

public record GenerateVideoRequest(
	String title,
	String templateVersion
) {}