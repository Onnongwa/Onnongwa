package com.onnongwa.back_end.domain.video.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "video_job")
public class VideoJob {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "experience_id", nullable = false)
	private Long experienceId;

	@Column(name = "user_id")
	private Long userId;

	@Column(name = "title", nullable = false, length = 255)
	private String title;

	@Column(name = "template_version", nullable = false, length = 32)
	private String templateVersion;

	@Lob
	@Column(name = "promo_text", nullable = false, columnDefinition = "TEXT")
	private String promoText;

	@Setter
	@Column(name = "tts_url", length = 1000)
	private String ttsUrl;

	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private VideoJobStatus status;

	@Column(name = "error_message", length = 1000)
	private String errorMessage;

	@Setter
	@Column(name = "final_video_url", length = 1000)
	private String finalVideoUrl;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sceneIndex ASC")
	private List<VideoScene> scenes = new ArrayList<>();

	@PrePersist
	protected void onCreate() {
		java.time.LocalDateTime now = java.time.LocalDateTime.now();
		if (createdAt == null) createdAt = now;
		if (updatedAt == null) updatedAt = now;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = java.time.LocalDateTime.now();
	}

}