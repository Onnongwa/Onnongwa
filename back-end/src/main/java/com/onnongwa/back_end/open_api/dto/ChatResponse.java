package com.onnongwa.back_end.open_api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChatResponse(
	String id,
	String object,
	long created,
	String model,
	List<Choice> choices,
	Usage usage
) {

	public record Choice(
		int index,
		Message message,
		@JsonProperty("finish_reason")
		String finishReason
	) {}

	public record Message(
		String role,
		String content
	) {}

	public record Usage(
		@JsonProperty("prompt_tokens")
		int promptTokens,
		@JsonProperty("completion_tokens")
		int completionTokens,
		@JsonProperty("total_tokens")
		int totalTokens
	) {}

	// 편의 메서드: 첫 번째 응답 텍스트 가져오기
	public String outputText() {
		if (choices != null && !choices.isEmpty() && choices.get(0).message() != null) {
			return choices.get(0).message().content();
		}
		return null;
	}
}
