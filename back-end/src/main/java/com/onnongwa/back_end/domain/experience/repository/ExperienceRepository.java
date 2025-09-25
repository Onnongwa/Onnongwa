package com.onnongwa.back_end.domain.experience.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.onnongwa.back_end.domain.experience.entity.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

	@Query(value = "SELECT * FROM experience ORDER BY view_count DESC LIMIT 3", nativeQuery = true)
	List<Experience> findTop3ByViewCount();

}
