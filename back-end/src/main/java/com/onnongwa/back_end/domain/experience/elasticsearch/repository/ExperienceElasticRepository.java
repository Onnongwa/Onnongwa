package com.onnongwa.back_end.domain.experience.elasticsearch.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.onnongwa.back_end.domain.experience.elasticsearch.document.ExperienceDocument;

public interface ExperienceElasticRepository extends ElasticsearchRepository<ExperienceDocument, Long> {
	List<ExperienceDocument> findByTitle(String keyword);
}
