package com.onnongwa.back_end.domain.recommend.repository;

import com.onnongwa.back_end.domain.recommend.entity.Recommend;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendRepository extends JpaRepository<Recommend, Long> {
}
