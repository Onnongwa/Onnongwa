package com.onnongwa.back_end.domain.experience.controller.dto;

import java.util.List;

public record ExpDetailDto(
	String title,
	String region,
	String address,
	String placeType,
	String regionType,
	String description,
	String crops,
	String price,
	List<ScheduleItemDTO> scheduleItems,
	String startTime,
	String endTime,
	List<String> selectedClosedDays,
	int minParticipants,
	int maxParticipants,
	Host host,
	String imageUrl,
	int viewCount
) {
	public record ScheduleItemDTO(
		String time,
		String activity
	) {}
	public record Host(
		String hostName,
		String hostPhone,
		String hostEmail,
		String farmName) {}
}