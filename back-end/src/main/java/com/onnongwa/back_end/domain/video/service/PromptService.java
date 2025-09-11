package com.onnongwa.back_end.domain.video.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onnongwa.back_end.domain.experience.entity.Experience;
import com.onnongwa.back_end.domain.experience.repository.ExperienceRepository;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoJobStatus;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import com.onnongwa.back_end.domain.video.repository.VideoSceneRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PromptService {

	private final WebClient openAiWebClient;
	private final ObjectMapper objectMapper;
	private final String openAiModel;
	private final String chatUrl;

	private final ExperienceRepository experienceRepository;

	private final VideoJobRepository jobRepo;
	private final VideoSceneRepository sceneRepo;

	public PromptService(
		@Qualifier("openAiWebClient") WebClient openAiWebClient,
		ObjectMapper objectMapper,
		@Value("${openai.api.model:gpt-4o-mini}") String openAiModel,
		@Value("${openai.api.url}") String chatUrl,
		ExperienceRepository experienceRepository,
		VideoJobRepository jobRepo,
		VideoSceneRepository sceneRepo
	) {
		this.openAiWebClient = openAiWebClient;
		this.objectMapper = objectMapper;
		this.openAiModel = openAiModel;
		this.chatUrl = chatUrl;
		this.experienceRepository = experienceRepository;
		this.jobRepo = jobRepo;
		this.sceneRepo = sceneRepo;
	}

	/**
	 * ✅ 새 파이프라인 엔트리:
	 * - OpenAI로 15초 홍보 멘트 1개 생성
	 * - VideoJob 생성(상태 CREATED) + VideoScene 3개(0,1,2) 생성(상태 QUEUED)
	 * - 반환: 생성된 VideoJob ID
	 */
	@Transactional
	public Long generateAndPersist(Long experienceId,
		Long userId,
		String title,
		String templateVersion
	) {
		Experience exp = experienceRepository.findById(experienceId)
			.orElseThrow(() -> new IllegalArgumentException("Experience not found: " + experienceId));

		String finalTitle = (title == null || title.isBlank()) ? nz(exp.getTitle()) : title;
		String finalTemplate = (templateVersion == null || templateVersion.isBlank()) ? "v1" : templateVersion;

		// 1. 홍보 멘트 생성
		String promoText = generatePromoText(exp, finalTitle);

		// 2. Job 생성
		VideoJob job = VideoJob.builder()
			.experienceId(exp.getId())
			.userId(userId)
			.title(finalTitle)
			.templateVersion(finalTemplate)
			.promoText(promoText)
			.status(VideoJobStatus.CREATED)
			.build();
		job = jobRepo.save(job);

		// 3. Scene 3개 생성
		for (int i = 0; i < 3; i++) {
			VideoScene scene = VideoScene.builder()
				.job(job)
				.sceneIndex(i)
				.imageIndex(i)
				.durationSec(5)
				.state(VideoSceneState.QUEUED)
				.build();
			sceneRepo.save(scene);
		}

		log.info("Created VideoJob with 3 scenes. jobId={}, title='{}'", job.getId(), finalTitle);
		return job.getId();
	}

	public String generatePromoText(Experience exp, String finalTitle) {
		String system = """
                당신은 한국어 광고 카피라이터입니다.
                목표:
                - 주어진 체험 정보를 바탕으로 **15초 내**로 낭독 가능한 홍보 멘트 1개를 작성합니다.
                - 구글 TTS에 바로 사용할 수 있도록 문장부호/발음이 자연스럽게 하세요.
                - 과장된 표현/허위 정보/특수문자 남용 금지, 숫자는 한글/숫자 혼용 가능(예: 3가지, 15분).
                
                형식:
                - JSON 객체로만 응답: { "promoText": "..." }
                - 줄바꿈은 최소화하고 하나의 문단으로 작성
                """;

		// 15초 분량 가이드: 한국어 보통 1초당 10~12음절 -> 대략 140~180자 권장
		String user = """
                체험 정보:
                - 제목: %s
                - 설명: %s
                - 위치 유형: %s
                - 소요 시간: %d분
                - 참가비: %d원
                - 일정: %s
                - 해시태그: %s

                제약:
                - 전체 길이: 약 140~180자 내외
                - 콜투액션(지금 예약/신청/문의 등) 1회 포함
                - 체험의 감각(시각/미각/향/손맛 등) 1가지 이상 구체화
                """.formatted(
			nz(finalTitle),
			nz(exp.getDescription()),
			exp.getLocationType() == null ? "" : exp.getLocationType().name(),
			exp.getTotalTime(),
			exp.getPrice(),
			nz(exp.getSchedule()),
			nz(exp.getHashTag())
		);

		Map<String, Object> payload = new HashMap<>();
		payload.put("model", openAiModel);
		payload.put("messages", List.of(
			Map.of("role", "system", "content", system),
			Map.of("role", "user", "content", user)
		));
		payload.put("temperature", 0.7);

		try {
			Map<String, Object> resp = openAiWebClient.post()
				.uri(chatUrl)
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(payload)
				.retrieve()
				.bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
				.block();

			String content = extractContent(resp);
			if (content == null || content.isBlank()) return fallbackPromo(finalTitle);

			try {
				JsonNode node = objectMapper.readTree(content.trim());
				if (node.isObject() && node.has("promoText")) {
					String txt = node.path("promoText").asText();
					return txt == null || txt.isBlank() ? fallbackPromo(finalTitle) : txt.trim();
				}
			} catch (Exception ignored) {
			}
			return content.trim();

		} catch (Exception e) {
			log.warn("OpenAI promo generation failed. cause={}", e.toString());
			return fallbackPromo(finalTitle);
		}
	}

	private String extractContent(Map<String, Object> resp) {
		if (resp == null) return null;
		Object choicesObj = resp.get("choices");
		if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) return null;
		Object msgObj = ((Map<?, ?>) choices.get(0)).get("message");
		if (!(msgObj instanceof Map<?, ?> msg)) return null;
		Object c = msg.get("content");
		return c == null ? null : String.valueOf(c);
	}

	private String fallbackPromo(String title) { // 홍보 문구 생성 실패 시
		return (title == null || title.isBlank())
			? "싱그러운 자연 속에서 특별한 체험을 만나보세요. 신선한 풍미와 손끝의 즐거움, 가족과 함께 추억을 만듭니다. 지금 바로 예약하고 소중한 주말을 더 맛있게 채워보세요."
			: "%s, 자연이 건네는 싱그러움 속에서 특별한 시간을 만끽해보세요. 신선한 풍미와 손끝의 즐거움, 가족과 함께 추억을 채우는 15초. 지금 바로 예약하세요.".formatted(title);
	}

	private String nz(String s) {
		return s == null ? "" : s;
	}
}
