package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

public record ExpDetailDto(
	// 기본 정보
	String title,
	String region,
	String description,
	String price,
	String imageUrl,
	int viewCount,

	// 상세 정보
	String address,
	String placeType,
	String regionType,
	String crops,
	String startTime,
	String endTime,
	List<String> selectedClosedDays,
	int minParticipants,
	int maxParticipants,

	// 일정
	List<ScheduleItemDTO> scheduleItems,

	List<String> highlights,

	List<String> inclusions,

	List<String> hashtags,

	// 운영자 정보
	Host host
) {
	public record ScheduleItemDTO(
		String time,
		String activity
	) {}

	public record Host(
		String hostName,
		String hostPhone,
		String hostEmail,
		String farmName
	) {}
}