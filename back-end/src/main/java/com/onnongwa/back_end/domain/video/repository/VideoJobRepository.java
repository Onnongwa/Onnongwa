package com.onnongwa.back_end.domain.video.repository;

import com.onnongwa.back_end.domain.video.entity.VideoJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoJobRepository extends JpaRepository<VideoJob, Long> {
}
