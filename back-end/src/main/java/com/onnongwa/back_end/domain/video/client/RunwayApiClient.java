package com.onnongwa.back_end.domain.video.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import com.onnongwa.back_end.domain.video.dto.CreateResponse;
import com.onnongwa.back_end.domain.video.dto.TaskResponse;

@Slf4j
@Component
public class RunwayApiClient {

	private final WebClient runwayWebClient;
	private final String createUrl;   // ex) https://api.dev.runwayml.com/v1/image_to_video
	private final String getUrlTmpl;  // ex) https://api.dev.runwayml.com/v1/tasks/{id}
	private final boolean mock;
	private final Map<String, Long> mockTasks = new ConcurrentHashMap<>();

	public RunwayApiClient(@Qualifier("runwayWebClient") WebClient runwayWebClient,
		@Value("${runway.api.create-url}") String createUrl,
		@Value("${runway.api.get-url}") String getUrlTmpl,
		@Value("${runway.api.mock:false}") boolean mock) {
		this.runwayWebClient = runwayWebClient;
		this.createUrl = createUrl;
		this.getUrlTmpl = getUrlTmpl;
		this.mock = mock;
	}

	/**
	 * 이미지+텍스트 기반 비디오 생성
	 * @param ratio 예: "768:1280" (세로) / "1280:768" (가로)
	 */
	public CreateResponse createGeneration(String model, String promptText, String ratio, int durationSec, String promptImageUrl) {
		if (mock) {
			String id = UUID.randomUUID().toString();
			mockTasks.put(id, System.currentTimeMillis() + 10_000L);
			return new CreateResponse(id, "queued", Map.of("mock", true));
		}

		Map<String, Object> body = Map.of(
			"model", model,
			"promptImage", promptImageUrl, // 공개 S3 URL
			"promptText", promptText,
			"ratio", ratio,                // "768:1280" or "1280:768"
			"duration", durationSec
		);

		// 요청 바디도 참고 로그(필요 시 주석 해제)
		log.info("[Runway][create] POST {} body={}", createUrl, body);

		Map<String, Object> resp = runwayWebClient.post()
			.uri(createUrl)
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(body)
			.retrieve()
			// ★ 4xx/5xx에서 에러 본문까지 로그
			.onStatus(sc -> sc.is4xxClientError() || sc.is5xxServerError(),
				cr -> cr.bodyToMono(String.class).flatMap(msg -> {
					log.error("[Runway][create] {} body={}", cr.statusCode(), msg);
					return Mono.error(new IllegalStateException("Runway error " + cr.statusCode() + ": " + msg));
				})
			)
			.bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
			.block();

		if (resp == null) throw new IllegalStateException("Runway create response is null");

		String id = (String) resp.get("id");
		String status = String.valueOf(resp.getOrDefault("status", "PENDING"));
		log.info("[Runway] createGeneration -> id={}, status={}", id, status);
		return new CreateResponse(id, status, resp);
	}

	/** 작업 상태 조회 */
	public TaskResponse getGeneration(String id) {
		if (mock) {
			Long readyAt = mockTasks.get(id);
			boolean done = readyAt != null && System.currentTimeMillis() >= readyAt;
			String url = done ? ("https://example.com/mock/" + id + ".mp4") : null;
			return new TaskResponse(id, done ? "SUCCEEDED" : "PROCESSING", url, Map.of("mock", true));
		}

		String urlBuilt = getUrlTmpl.replace("{id}", id);
		log.info("[Runway][get] GET {}", urlBuilt);

		Map<String, Object> resp = runwayWebClient.get()
			.uri(urlBuilt)
			.accept(MediaType.APPLICATION_JSON)
			.retrieve()
			.onStatus(sc -> sc.is4xxClientError() || sc.is5xxServerError(),
				cr -> cr.bodyToMono(String.class).flatMap(msg -> {
					log.error("[Runway][get] {} body={}", cr.statusCode(), msg);
					return Mono.error(new IllegalStateException("Runway error " + cr.statusCode() + ": " + msg));
				})
			)
			.bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
			.block();

		if (resp == null) throw new IllegalStateException("Runway task response is null");

		String status = String.valueOf(resp.getOrDefault("status", "UNKNOWN"));

		// 결과 URL 추출
		String outputUrl = null;
		Object outputObj = resp.get("output");
		if (outputObj instanceof List<?> list && !list.isEmpty()) {
			Object first = list.get(0);
			if (first instanceof String s) outputUrl = s;
			else if (first instanceof Map<?,?> m && m.get("url") instanceof String u) outputUrl = u;
		}
		if (outputUrl == null && resp.get("outputs") instanceof List<?> list2) {
			for (Object o : list2) {
				if (o instanceof Map<?, ?> m && m.get("url") instanceof String u) { outputUrl = u; break; }
			}
		}

		log.info("[Runway] getTask -> id={}, status={}, outputUrl={}", id, status, outputUrl);
		return new TaskResponse(id, status, outputUrl, resp);
	}
}
