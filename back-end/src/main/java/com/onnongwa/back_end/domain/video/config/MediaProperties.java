package com.onnongwa.back_end.domain.video.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "media")
public class MediaProperties {
	private String baseDir = "./media";

	// ffmpeg 실행 경로
	private String ffmpegPath = "ffmpeg";
}
