package com.onnongwa.back_end.domain.recommend.service;

import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendRequestDTO;
import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendResponseDTO;
import com.onnongwa.back_end.domain.recommend.repository.RecommendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final RecommendRepository recommendRepository;
    private final PythonCollectDataService pythonCollectDataService;


    public void createRecommend(RecommendRequestDTO recommendReqDTO) {
        List<String> crops = pythonCollectDataService.normalizeToCrops(recommendReqDTO.relatedCrops());
        List<String> words = pythonCollectDataService.collectData(crops);
        for (String word : words) {
            System.out.print(word + " ");
        }
    }
}
