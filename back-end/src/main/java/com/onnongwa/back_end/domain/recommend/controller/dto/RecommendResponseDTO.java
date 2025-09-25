package com.onnongwa.back_end.domain.recommend.controller.dto;

import javax.swing.border.TitledBorder;

public record RecommendResponseDTO(String marketComment,
                                   String farmComment,
                                   String feature,
                                   String consideration,
                                   String schedule,
                                   String title,
                                   String description) {
}
