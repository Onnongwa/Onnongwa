package com.onnongwa.back_end.domain.experience.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onnongwa.back_end.domain.experience.entity.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, Long> { }
