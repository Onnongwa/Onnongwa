package com.onnongwa.back_end.domain.video.entity;

public enum VideoSceneState {
	QUEUED,         // 큐에 등록
	RENDERING,      // 렌더링 중
	DONE,           // 완료
	FAILED          // 실패
}
