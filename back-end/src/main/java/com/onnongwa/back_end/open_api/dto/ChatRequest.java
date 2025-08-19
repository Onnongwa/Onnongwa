package com.onnongwa.back_end.open_api.dto;

import java.util.List;
import java.util.Map;

public record ChatRequest(
	String model,
	List<Map<String, String>> messages,
	Integer max_completion_tokens,
	Double top_p
){}