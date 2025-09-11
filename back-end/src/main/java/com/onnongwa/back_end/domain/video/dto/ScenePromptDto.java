package com.onnongwa.back_end.domain.video.dto;

public record ScenePromptDto(
	Integer index,
	String promptText,
	String negativeText,
	Integer durationSec
) {}