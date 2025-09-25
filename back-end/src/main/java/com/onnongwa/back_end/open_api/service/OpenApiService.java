package com.onnongwa.back_end.open_api.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.onnongwa.back_end.open_api.dto.AiOnboardingDTO;
import com.onnongwa.back_end.open_api.dto.ChatRequest;
import com.onnongwa.back_end.open_api.dto.ChatResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
public class OpenApiService {

	@Value("${openai.api.key}")
	private String apiKey;

	@Value("${openai.api.url}")
	private String apiUrl;

	@Value("${openai.api.model}")
	private String model;

	private final RestClient restClient;

	public AiOnboardingDTO getChatCompletion(String prompt){

		List<Map<String, String>> messages = List.of(
			Map.of("role", "system", "content",
				"당신은 농촌 체험 마케팅 전문가입니다.\n"
				+ "사용자가 전달한 체험 정보를 바탕으로, 각 속성을 **흥미롭고 재밌게, 사람들의 관심을 유발하도록 리브랜딩**합니다.\n"
				+ "- 체험 내용 자체는 변경하지 않습니다.\n"
				+ "- 말투와 표현만 바꾸어, 노동이 아닌 **힐링과 즐거움을 느낄 수 있는 느낌**을 강조합니다.\n"
				+ "- 출력 형식은 **key=value**, 속성별로 한 줄씩 반드시 작성합니다.\n"
				+ "- ScheduleItems는 한 줄에 `시간-활동` 형태로 `;`로 구분하여 작성합니다.\n"
				+ "- title, description, ScheduleItems 이 세가지만 리브랜딩해주고 나머지는 그대로 정돈만해줘!"
				+ "- description 의 내용은 좀 더 풍부하게 해줘 500자 이하로\n"
				+ "- 무조건 예시의 양식대로 작성해줘\n"
				+ "- 정리된 ScheduleItems을 토대로 총 체험이 몇시간 걸리는지 숫자만 적어줘 예) duration=3"
				+ "- 온보딩 된 내용을 토대로 이 체험의 highlights 4가지 작성해줘 highlights는 ,로 분리해줘 예) 전문가와 함께하는 숲속 명상, 다도 체험 및 전통차 시음"
				+ "- 온보딩 된 내용을 토대로 이 체험의 inclusions도 1~3 가지 정도 작성해줘 inclusions는 ,로 분리해줘 예 ) 명상 도구 대여, 전문가 가이드"
				+ "- 최종적으로 모든 내용을 가지고 hashtags를 추출해서 4가지 정도 작성해줘 hashtags는 ,로 분리해줘 예 ) #숲속명상, #차담, #힐링체험"
				+ "예:\n"
				+ "title=...\n"
				+ "region=...\n"
				+ "address=...\n"
				+ "placeType=...\n"
				+ "duration=...\n"
				+ "regionType=...\n"
				+ "description=...\n"
				+ "crops=...\n"
				+ "price=...\n"
				+ "scheduleItems=...\n"
				+ "highlights=... \n"
				+ "inclusions=...\n"
				+ "hashtags=...\n"
				+ "startTime=...\n"
				+ "endTime=...\n"
				+ "selectedClosedDays=...\n"
				+ "minParticipants=...\n"
				+ "maxParticipants=...\n"
				+ "hostName=...\n"
				+ "hostPhone=...\n"
				+ "hostEmail=...\n"
				+ "farmName=...\n"
				+ "imageUrl=..."),
			Map.of("role", "user", "content", prompt)
		);

		ChatRequest body = new ChatRequest(
			model,
			messages,
			1024,
			1.0
		);

		try{
			ChatResponse res = restClient.post()
				.uri(apiUrl)
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
				.contentType(MediaType.APPLICATION_JSON)
				.body(body)
				.retrieve()
				.body(ChatResponse.class);

			if (res == null || res.outputText() == null){
				throw new RuntimeException("빈 응답");
			}

			System.out.println("결과 양식 \n" + res.outputText());

			return ChatResponseParser.parse(res.outputText());
		} catch(Exception e){
			throw new RuntimeException("Open API 호출 실패 : " +  e.getMessage());
		}
	}
}
