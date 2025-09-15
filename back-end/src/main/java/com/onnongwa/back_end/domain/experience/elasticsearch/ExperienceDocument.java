package com.onnongwa.back_end.domain.experience.elasticsearch;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

import com.onnongwa.back_end.domain.experience.entity.Experience;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Setting(settingPath = "elasticsearch/experience-setting.json")
@Mapping(mappingPath = "elasticsearch/experience-mapping.json")
@Document(indexName = "Experience", createIndex = true)
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

	@Field(type = FieldType.Text)
	private String placeType;       // 실내/실외

	@Field(type = FieldType.Text)
	private String regionType;      // 농촌/어촌

	@Builder
	public ExperienceDocument(Long id, String title, String description, String location, String placeType, String regionType ){
		this.id = id;
		this.title = title;
		this.description = description;
		this.location = location;
		this.placeType = placeType;
		this.regionType = regionType;
	}


	public ExperienceDocument from(Experience experience){
		return new ExperienceDocument(
			experience.getId(),
			experience.getTitle(),
			experience.getDescription(),
			experience.getLocation(),
			experience.getPlaceType(),
			experience.getRegionType()
		);
	}
}
