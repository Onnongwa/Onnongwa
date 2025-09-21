package com.onnongwa.back_end.domain.experience.elasticsearch.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.onnongwa.back_end.domain.experience.entity.Experience;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Setting(settingPath = "elasticsearch/experience-setting.json")
@Mapping(mappingPath = "elasticsearch/experience-mapping.json")
@Document(indexName = "experience", createIndex = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class ExperienceDocument {

	@Id
	@Field(type = FieldType.Long)
	private Long id;

	@Field(type = FieldType.Text)
	private String title;           // 제목

	@Field(type = FieldType.Text)
	private String description;     // 설명

	@Field(type = FieldType.Text)
	private String location;        // 지역 (ex: 강원도 평창군)

	@Field(type = FieldType.Keyword)
	private int price;

	@Field(type = FieldType.Text)
	private List<String> hashTag;

	@Field(type = FieldType.Text)
	private String imageUrl;

	@Builder
	public ExperienceDocument(Long id, String title, String description, String location, int price, List<String> hashTag, String imageUrl ){
		this.id = id;
		this.title = title;
		this.description = description;
		this.location = location;
		this.price = price;
		this.hashTag = hashTag;
		this.imageUrl = imageUrl;
	}


	public static ExperienceDocument from(Experience experience){
		return new ExperienceDocument(
			experience.getId(),
			experience.getTitle(),
			experience.getDescription(),
			experience.getLocation(),
			experience.getPrice(),
			experience.getHashtags(),
			experience.getImageUrl()
		);
	}
}
