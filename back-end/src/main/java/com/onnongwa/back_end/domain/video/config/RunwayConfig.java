package com.onnongwa.back_end.domain.video.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class RunwayConfig {

	@Bean(name = "runwayWebClient")
	public WebClient runwayWebClient(
		WebClient.Builder builder,
		@Value("${runway.api.key}") String apiKey, // ★ Dev API Secret을 여기에 넣으세요
		@Value("${runway.api.version:2024-11-06}") String apiVersion
	) {
		HttpClient httpClient = HttpClient.create().wiretap(true);

		return builder
			.clientConnector(new ReactorClientHttpConnector(httpClient))
			.filter(logRequest())
			.filter(logResponse())
			.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
			.defaultHeader("X-Runway-Version", apiVersion)
			.build();
	}

	private ExchangeFilterFunction logRequest() {
		return ExchangeFilterFunction.ofRequestProcessor(req -> {
			String method = req.method().name();
			String url = req.url().toString();
			System.out.println("[Runway] → " + method + " " + url);
			req.headers().forEach((k, v) -> {
				if (!k.equalsIgnoreCase(HttpHeaders.AUTHORIZATION)) {
					System.out.println("[Runway]   " + k + ": " + String.join(",", v));
				} else {
					System.out.println("[Runway]   Authorization: Bearer ****");
				}
			});
			return reactor.core.publisher.Mono.just(req);
		});
	}

	private ExchangeFilterFunction logResponse() {
		return ExchangeFilterFunction.ofResponseProcessor(res -> {
			System.out.println("[Runway] ← status: " + res.statusCode());
			return reactor.core.publisher.Mono.just(res);
		});
	}
}