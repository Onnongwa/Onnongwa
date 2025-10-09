package com.onnongwa.back_end.open_api.service;

import com.onnongwa.back_end.open_api.dto.RecommendDTO;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;


@Service
public class RecommendChatResponseParser {

    private final ObjectMapper mapper;

    public RecommendChatResponseParser() {
        this.mapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    /**
     * GPT 원문(content)에서 JSON 본문만 추출 → RecommendDTO로 역직렬화
     */
    public RecommendDTO parse(String content) {
        String json = extractJson(content);
        try {
            return mapper.readValue(json, RecommendDTO.class);
        } catch (Exception e) {
            throw new IllegalStateException("GPT JSON 파싱 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 모델이 앞/뒤에 설명을 덧붙여도 첫 '{' ~ 마지막 '}'만 잘라내어 JSON 본문 확보
     */
    private String extractJson(String text) {
        int s = text.indexOf('{');
        int e = text.lastIndexOf('}');
        if (s >= 0 && e > s) return text.substring(s, e + 1);
        return text;
    }
}
