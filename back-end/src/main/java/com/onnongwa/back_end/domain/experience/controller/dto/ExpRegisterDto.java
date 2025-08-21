package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

public record ExpRegisterDto(
	// 기본 정보
	String title,
	String location,
	String duration,
	String price,
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
	List<ScheduleItem> schedule,

	// 하이라이트
	List<String> highlights,

	// 포함 사항
	List<String> inclusions,

	// 해시태그
	List<String> hashtags,

	// 담당자
	HostInfo host

) {
	public record ScheduleItem(
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
