package com.onnongwa.back_end.domain.video.dto;

import java.util.Map;

public record CreateResponse(String id, String status, Map<String, Object> raw) {}
