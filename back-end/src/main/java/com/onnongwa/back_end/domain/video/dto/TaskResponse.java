package com.onnongwa.back_end.domain.video.dto;

import java.util.Map;

public record TaskResponse(String id, String status, String outputUrl, Map<String, Object> raw) {}
