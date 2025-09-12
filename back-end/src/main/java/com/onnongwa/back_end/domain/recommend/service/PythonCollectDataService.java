package com.onnongwa.back_end.domain.recommend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PythonCollectDataService {
    private final WebClient webClientConfig;

    // 문자열 -> 리스트 정규화
    public List<String> normalizeToCrops(String crop) {
        if (crop == null) return List.of();
        // 쉼표, 파이프, 슬래시, 공백 다수 구분자 처리
        String[] crops = crop.split("[,|/]+|\\s{2,}");
        return Arrays.stream(crops)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }

    public List<String> collectData(List<String> crops) {
        if (crops == null || crops.isEmpty()) return List.of();

        Map<String, Object> body = Map.of("crops", crops); // {"crops":[...]}
        return webClientConfig.post()
                .uri("/collect-data-list")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .timeout(Duration.ofSeconds(500))
                .block();
    }
}
