package com.onnongwa.back_end.domain.video.dto;

public record SceneResponse(
	Long sceneId,
	Integer sceneIndex,
	String state,        // QUEUED/RENDERING/DONE/FAILED
	Integer imageIndex,  // 0,1,2 (Experience.image의 인덱스)
	Integer durationSec, // 5
	String taskId,       // Runway Task ID
	String resultUrl     // 생성된 5초 mp4
) {}