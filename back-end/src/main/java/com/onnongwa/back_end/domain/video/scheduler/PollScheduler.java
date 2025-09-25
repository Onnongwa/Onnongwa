package com.onnongwa.back_end.domain.video.scheduler;

import com.onnongwa.back_end.domain.video.service.RunwayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class PollScheduler {

	private final RunwayService runwayService;

	// 5초마다 전체 RENDERING 씬 상태 갱신 → result_url 채움 → 모두 끝나면 합성
	@Scheduled(fixedDelay = 15000)
	public void pollAll() {
		try {
			runwayService.pollAllRendering();
		} catch (Exception e) {
			log.error("pollAllRendering error: {}", e.getMessage(), e);
		}
	}
}