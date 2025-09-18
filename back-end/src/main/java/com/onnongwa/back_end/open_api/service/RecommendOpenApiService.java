package com.onnongwa.back_end.open_api.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendRequestDTO;
import com.onnongwa.back_end.open_api.dto.ChatRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.onnongwa.back_end.open_api.dto.ChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendOpenApiService {

    @Value("${openai.api.key}")
    private String apiKey;
    @Value("${openai.api.url}")
    private String apiUrl;
    @Value("${openai.api.model}")
    private String model;

    private final RestClient restClient;

    public String requestRecommendJson(List<String> words, RecommendRequestDTO recommendReqDTO) {
        String csv = String.join(", ", words);
        String inputs = """
                {
                  "experienceName": "%s",
                  "address":        "%s",
                  "mainCrop":       "%s",
                  "targetFee":      "%s",
                  "minParticipants":"%s",
                  "maxParticipants":"%s",
                  "farmName":       "%s",
                  "keywords":       "%s"
                }
                """.formatted(
                nz(recommendReqDTO.experienceName()), nz(recommendReqDTO.address()), nz(recommendReqDTO.relatedCrops()),
                nz(recommendReqDTO.participationFee()), nz(recommendReqDTO.minParticipants()), nz(recommendReqDTO.maxParticipants()),
                nz(recommendReqDTO.farmName()), csv
        );

        String prompt = """
        너는 농촌 체험 기획 전문가다. 아래 Inputs를 참고해 결과를 만든다.
        Inputs:
        %s
        
        [품질 규칙]
        - 평가형/일반화/추측형 표현 금지: “~많다”, “적절하다”, “충분하다”, “흔하다”.
        - 지역 일반화 금지. 입력 address/keywords에 없는 지명/기관/시기 금지.
        - 모든 불릿은 8~15자, 명사형 단답식으로 작성.
        - description은 1~2문장, 최대 80자.
        - features, considerations는 배열 형태, 각 항목 8~15자.
        
        [출력 형식]
        - 순수 JSON만 반환.
        - 숫자는 JSON number.
        - programs는 정확히 3개.
        - totalTime은 schedule 합계(정수)와 일치.
        
        [전처리/분류 규칙]
        - targetFee 문자열이면 숫자만 추출.
        - capitalAreaAccess: GOOD(서울/경기/인천), FAIR(대전/세종/충북/충남/강원), POOR(그 외).
        
        [시장·농장 분석 작성 규칙]
        marketComment:
        {
          "summary": "요약 문장",
          "insight": ["통찰1","통찰2","통찰3"],
          "consideration": ["고려1","고려2"],
          "caution": ["유의1"]
        }
        
        farmComment:
        {
          "summary": "요약 문장",
          "strength": ["역량1","역량2","역량3"],
          "improvement": ["개선1","개선2"],
          "risk": ["리스크1"]
        }
        
        [프로그램 추천 작성 규칙]
        - 입력: words, mainCrop, targetFee(옵션), minParticipants/maxParticipants.
        - 원칙:
          1) words에서 주제/콘셉트를 3개 추출해 프로그램을 만든다.
          2) 부족하면 보조 카테고리("쿠킹클래스","잼 만들기","과학 놀이","뷰티") 활용.
          3) 프로그램 개수는 정확히 3개.
          4) 각 프로그램 필수 필드:
          {
            "title": "프로그램 이름(≤20자)",
            "description": "매력 포인트 중심(≤80자, words/보조카테고리 포함)",
            "totalTime": 3,
            "price": 30000,
            "schedule": ["HH:mm 활동","HH:mm 활동","HH:mm 활동"],
            "features": ["특징1","특징2","특징3"],
            "considerations": ["고려1","고려2"],
            "locationType": "INDOOR | OUTDOOR",
          }
        - description 또는 considerations 중 하나에 '권장 a~b명' 형식으로 적정 운영 인원을 반드시 1회 언급(min/max 기반).
        
        [출력 스키마(JSON)]
        {
          "marketComment": { ... },
          "farmComment": { ... },
          "item": "핵심 아이템",
          "purpose": "기획 목적",
          "requirement": "운영/인허가/안전 요구사항",
          "programs": [
            { ... },
            { ... },
            { ... }
          ]
        }
        """.formatted(inputs);



        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", "요구 스키마에 맞는 순수 JSON만 반환하라."),
                Map.of("role", "user", "content", prompt)
        );

        ChatRequest body = new ChatRequest(
                model,
                messages,
                2048,
                1.0
        );

        ChatResponse res = restClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(ChatResponse.class);

        String text = (res != null) ? res.outputText() : null;
        if (text == null || text.isBlank()) {
            throw new IllegalStateException("빈 응답");
        }
        return text; // 파서에서 DTO로 역직렬화
    }

    private String nz(String s) {
        return Objects.toString(s, "");
    }
}

