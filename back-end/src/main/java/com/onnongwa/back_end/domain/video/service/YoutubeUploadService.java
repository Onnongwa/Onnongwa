package com.onnongwa.back_end.domain.video.service;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.ClientParametersAuthentication;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleRefreshTokenRequest;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatus;
import com.onnongwa.back_end.domain.experience.entity.Experience;
import com.onnongwa.back_end.domain.experience.repository.ExperienceRepository;
import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.repository.VideoJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class YoutubeUploadService {

	private final VideoJobRepository jobRepo;
	private final ExperienceRepository expRepo;

	@Value("${youtube.clientId}")
	private String clientId;
	@Value("${youtube.clientSecret}")
	private String clientSecret;
	@Value("${youtube.refreshToken}")
	private String refreshToken;
	@Value("${youtube.appName:onnongwa-uploader}")
	private String appName;
	@Value("${youtube.notifySubscribers:false}")
	private boolean notifySubscribers;
	@Value("${youtube.defaultPrivacy:unlisted}")
	private String defaultPrivacy;

	@Transactional(readOnly = true)
	public String uploadVideo(Long jobId, Path finalMp4Path) {
		VideoJob job = jobRepo.findById(jobId)
			.orElseThrow(() -> new IllegalArgumentException("VideoJob not found: " + jobId));
		Experience exp = expRepo.findById(job.getExperienceId())
			.orElseThrow(() -> new IllegalArgumentException("Experience not found: " + job.getExperienceId()));

		File file = finalMp4Path.toFile();
		if (!file.exists() || !file.isFile()) {
			throw new IllegalArgumentException("Video file not found: " + finalMp4Path);
		}

		int categoryId = (job.getCategoryId() == null) ? 22 : job.getCategoryId();
		String title = nz(job.getTitle(), nz(exp.getTitle(), "온농와 체험 홍보 영상"));
		String description = buildDescription(exp);
		List<String> tags = buildTags(exp);

		try {
			YouTube yt = buildYouTubeClient();

			VideoSnippet snippet = new VideoSnippet();
			snippet.setTitle(title);
			snippet.setDescription(description);
			snippet.setTags(tags);
			snippet.setCategoryId(String.valueOf(categoryId));

			VideoStatus status = new VideoStatus();
			status.setPrivacyStatus(defaultPrivacy);

			Video body = new Video();
			body.setSnippet(snippet);
			body.setStatus(status);

			InputStreamContent media =
				new InputStreamContent("video/*", new BufferedInputStream(new FileInputStream(file)));
			media.setLength(file.length());

			YouTube.Videos.Insert insert = yt.videos()
				.insert(List.of("snippet", "status"), body, media);
			insert.setNotifySubscribers(notifySubscribers);
			insert.getMediaHttpUploader().setDirectUploadEnabled(false); // resumable

			Video resp = insert.execute();
			String videoId = resp.getId();
			log.info("YouTube upload success. jobId={}, videoId={}", jobId, videoId);
			return videoId;

		} catch (Exception e) {
			log.error("YouTube upload failed. jobId={}, err={}", jobId, e.toString());
			throw new RuntimeException(e);
		}
	}


	private YouTube buildYouTubeClient() throws GeneralSecurityException, java.io.IOException {
		var http = GoogleNetHttpTransport.newTrustedTransport();
		var json = GsonFactory.getDefaultInstance();
		
		var tokenResponse = new GoogleRefreshTokenRequest(
			http, json, refreshToken, clientId, clientSecret
		).execute();

		// Access Token + Refresh Token 세팅
		Credential credential = new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
			.setTransport(http)
			.setJsonFactory(json)
			.setClientAuthentication(new ClientParametersAuthentication(clientId, clientSecret))
			.setTokenServerUrl(new GenericUrl("https://oauth2.googleapis.com/token"))
			.build()
			.setFromTokenResponse(tokenResponse);

		credential.setRefreshToken(refreshToken);

		return new YouTube.Builder(http, json, credential)
			.setApplicationName(appName)
			.build();
	}

	private String buildDescription(Experience exp) {
		StringBuilder sb = new StringBuilder();
		if (notBlank(exp.getDescription())) {
			sb.append(exp.getDescription()).append("\n\n");
		}
		if (notBlank(exp.getUrl())) {
			sb.append("예약: ").append(exp.getUrl()).append("\n");
		}
		return sb.toString().trim();
	}

	private List<String> buildTags(Experience exp) {
		if (notBlank(exp.getHashTag())) {
			String[] raw = exp.getHashTag().split("[,\\s]+");
			return Arrays.stream(raw)
				.filter(s -> s != null && !s.isBlank())
				.map(s -> s.replaceAll("^#", ""))
				.limit(15) // 유튜브 태그는 최대 15개
				.toList();
		}
		return List.of();
	}

	private boolean notBlank(String s) { return s != null && !s.isBlank(); }
	private String nz(String a, String b) { return (a == null || a.isBlank()) ? b : a; }
}