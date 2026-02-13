package com.onnongwa.back_end.domain.video.dto;

public record JobStatusResponse(
	Long jobId,
	String title,
	String jobStatus,  // CREATED/RENDERING/COMPOSITING/DONE/FAILED
	Integer totalScenes,
	Integer doneScenes,
	Integer renderingScenes,
	Integer failedScenes,
	Integer queuedScenes, // ← 기존 promptedScenes 위치
	String finalVideoUrl
) {}