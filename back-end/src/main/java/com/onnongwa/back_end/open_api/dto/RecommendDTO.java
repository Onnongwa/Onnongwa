package com.onnongwa.back_end.open_api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // json 파싱할 때 없는 필드 무시
public record RecommendDTO(
        MarketComment marketComment,
        FarmComment farmComment,
        String item,
        String purpose,
        String requirement,
        List<ProgramDTO> programs
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MarketComment(
            String summary,
            List<String> insight,
            List<String> consideration,
            List<String> caution
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FarmComment(
            String summary,
            List<String> strength,
            List<String> improvement,
            List<String> risk
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ProgramDTO(
            String title,
            String description,
            Integer totalTime,
            Integer price,
            List<String> schedule,
            List<String> features,
            List<String> considerations,
            String locationType
    ) {}
}