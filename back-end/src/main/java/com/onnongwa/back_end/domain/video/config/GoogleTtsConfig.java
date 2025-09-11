package com.onnongwa.back_end.domain.video.config;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.TextToSpeechSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Configuration
public class GoogleTtsConfig {
	@Bean
	public TextToSpeechClient textToSpeechClient(
		@Value("${gcp.tts.sa-key-path:}") String saKeyPath
	) throws Exception {
		if (saKeyPath != null && !saKeyPath.isBlank()) {
			var creds = ServiceAccountCredentials.fromStream(new FileInputStream(saKeyPath));
			var settings = TextToSpeechSettings.newBuilder()
				.setCredentialsProvider(FixedCredentialsProvider.create(creds))
				.build();
			return TextToSpeechClient.create(settings);
		}
		return TextToSpeechClient.create(); // GOOGLE_APPLICATION_CREDENTIALS 사용
	}
}