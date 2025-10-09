package com.onnongwa.back_end.domain.recommend.service;

import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendRequestDTO;
import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendResponseDTO;
import com.onnongwa.back_end.domain.recommend.repository.RecommendRepository;
import com.onnongwa.back_end.open_api.dto.RecommendDTO;
import com.onnongwa.back_end.open_api.service.RecommendChatResponseParser;
import com.onnongwa.back_end.open_api.service.RecommendOpenApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final RecommendRepository recommendRepository;
    private final PythonCollectDataService pythonCollectDataService;
    private final RecommendOpenApiService recommendOpenApiService;
    private final RecommendChatResponseParser recommendChatResponseParser;


    public RecommendDTO createRecommend(RecommendRequestDTO recommendReqDTO) {
        List<String> crops = pythonCollectDataService.normalizeToCrops(recommendReqDTO.relatedCrops());
        List<String> words = pythonCollectDataService.collectData(crops);
        StringBuilder stringBuilder = new StringBuilder();
        for (String word : words) {
            stringBuilder.append(word).append(", ");
        }
        // GPT API로 넘기는 로직
        String json = recommendOpenApiService.requestRecommendJson(words, recommendReqDTO);
        return recommendChatResponseParser.parse(json);
    }
}
