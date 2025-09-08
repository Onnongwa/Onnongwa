package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

import com.onnongwa.back_end.domain.experience.entity.ExperienceSchedule;

public record ExpRegisterDto(
	// 기본 정보
	String title,
	String location,
	String duration,
	Integer price,
	List<String> availableDates,
	String description,
	String imageUrl,

	// 상세 정보
	String address,
	String placeType,
	String regionType,
	String crops,
	String operatingHours,
	List<String> closedDays,
	int minParticipants,
	int maxParticipants,

	// 일정
	List<ScheduleDto> schedule,

	// 하이라이트
	List<String> highlights,

	// 포함 사항
	List<String> inclusions,

	// 해시태그
	List<String> hashtags,

	// 담당자
	HostInfo host

) {

	public record ScheduleDto(
		String time,
		String activity
	) {}

	public record HostInfo(
		String name,
		String phone,
		String email,
		String farmName
	) {}
}
