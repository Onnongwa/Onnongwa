package com.onnongwa.back_end.domain.experience.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.onnongwa.back_end.domain.experience.elasticsearch.document.ExperienceDocument;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExperienceSearchService {

	private final ElasticsearchClient elasticsearchClient;

	public Page<ExperienceDocument> findAutoCompleteSuggestionByKeyword(String title, String keyword, int page, int size){
		Pageable pageable = PageRequest.of(page,size);
		try{
			Query query = buildSeaarchQuery(title,keyword);

			SearchRequest searchRequest = new SearchRequest.Builder()
				.index("experience")
				.query(query)
				.from(page * size)
				.size(size)
				.build();

			SearchResponse<ExperienceDocument> searchRes = elasticsearchClient.search(searchRequest,
				ExperienceDocument.class);

			List<ExperienceDocument> expList = searchRes.hits().hits().stream()
				.map(Hit ::source)
				.toList();

			return new PageImpl<>(expList, pageable, searchRes.hits().total().value());
		} catch (IOException e) {
			return Page.empty();
		}
	}

	private Query buildSeaarchQuery(String title, String keyword) {
		BoolQuery.Builder builder = new BoolQuery.Builder();

		if (title != null){
			builder.should(s ->s
				.match(m -> m
					.field("title")
					.query(title)
				)
			);
		};

		if (keyword != null){
			builder.should(s -> s
				.multiMatch(m -> m
					.fields("description", "location","crops")
					.query(keyword)
				)
			);
		}

		if (!StringUtils.hasText(title) && !StringUtils.hasText(keyword)) {
			return new Query.Builder().matchAll(m -> m).build();
		}

		return new Query.Builder()
			.bool(builder.minimumShouldMatch("1").build())
			.build();
	}

}
