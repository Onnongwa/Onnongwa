package com.onnongwa.back_end.domain.video.entity;

public enum VideoJobStatus {
	CREATED,        // 생성됨 (프롬프트/tts 준비 단계)
	RENDERING,      // 씬 렌더링 중 (Runway)
	COMPOSITING,    // 합성(ffmpeg) 중
	DONE,           // 최종 완료
	FAILED          // 실패
}
