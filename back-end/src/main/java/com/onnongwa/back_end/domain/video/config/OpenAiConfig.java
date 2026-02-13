package com.onnongwa.back_end.domain.video.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class OpenAiConfig {

	@Bean(name = "openAiWebClient")
	public WebClient openAiWebClient(WebClient.Builder builder,
		@Value("${openai.api.key}") String apiKey) {
		return builder
			.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
			.build();
	}
}