package com.onnongwa.back_end.domain.farm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onnongwa.back_end.domain.farm.entity.Farm;

public interface FarmRepository extends JpaRepository<Farm, Long> {
}
