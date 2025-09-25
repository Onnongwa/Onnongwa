package com.onnongwa.back_end.open_api.dto;

import java.util.List;

public record AiOnboardingDTO(
	String title,
	String region,
	String address,
	String placeType,               // 추가
	String regionType,              // 추가
	String description,
	String duration,
	String crops,
	int price,
	List<String> scheduleItems,
	List<String> highlights,        // 추가
	List<String> inclusions,        // 추가
	List<String> hashtags,          // 추가
	String startTime,               // 추가
	String endTime,                 // 추가
	List<String> selectedClosedDays,// 추가
	int minParticipants,
	int maxParticipants,
	String hostName,
	String hostPhone,
	String hostEmail,
	String farmName,
	String imageUrl
) {
}
