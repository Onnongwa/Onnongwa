package com.onnongwa.back_end.domain.video.repository;

import com.onnongwa.back_end.domain.video.entity.VideoJob;
import com.onnongwa.back_end.domain.video.entity.VideoScene;
import com.onnongwa.back_end.domain.video.entity.VideoSceneState;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideoSceneRepository extends JpaRepository<VideoScene, Long> {
	List<VideoScene> findByJobOrderBySceneIndexAsc(VideoJob job);
	List<VideoScene> findByJobAndState(VideoJob job, VideoSceneState state);

	long countByJobAndState(VideoJob job, VideoSceneState state);

	long countByJob(VideoJob job);
}
