package com.onnongwa.back_end.domain.video.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(
	name = "video_scene",
	uniqueConstraints = @UniqueConstraint(
		name = "ux_scene_job_idx",
		columnNames = {"job_id", "scene_index"}
	)
)
public class VideoScene {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id", nullable = false)
	private VideoJob job;

	@Column(name = "scene_index", nullable = false)
	private Integer sceneIndex;

	@Column(name = "image_index", nullable = false)
	private Integer imageIndex;

	@Column(name = "duration_sec", nullable = false)
	private Integer durationSec;

	@Column(name = "task_id", length = 128)
	private String taskId;

	@Enumerated(EnumType.STRING)
	@Column(name = "state", nullable = false, length = 20)
	private VideoSceneState state;

	@Column(name = "result_url", length = 1000)
	private String resultUrl;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

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

	public void markRendering(String taskId) {
		this.state = VideoSceneState.RENDERING;
		this.taskId = taskId;
	}

	public void markDone(String resultUrl) {
		this.state = VideoSceneState.DONE;
		this.resultUrl = resultUrl;
	}

	public void markFailed() {
		this.state = VideoSceneState.FAILED;
	}
}