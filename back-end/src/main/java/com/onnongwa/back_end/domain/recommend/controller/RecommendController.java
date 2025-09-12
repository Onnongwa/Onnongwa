package com.onnongwa.back_end.domain.recommend.controller;

import com.onnongwa.back_end.domain.recommend.controller.dto.RecommendRequestDTO;
import com.onnongwa.back_end.domain.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/recommend")
public class RecommendController {
    private final RecommendService recommendService;

    @PostMapping
    public ResponseEntity<?> createRecommend(@RequestBody RecommendRequestDTO recommendReqDTO){
        recommendService.createRecommend(recommendReqDTO);
        return ResponseEntity.ok().build();
    }
}
