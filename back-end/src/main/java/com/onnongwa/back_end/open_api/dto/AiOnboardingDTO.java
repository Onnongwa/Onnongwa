package com.onnongwa.back_end.open_api.dto;

import java.util.List;

public record AiOnboardingDTO(
	String title,
	String region,
	String address,
	String description,
	String crops,
	int price,
	List<String> scheduleItems, // scheduleItems=10:00-농장 도착... ; 10:30-...
	int minParticipants,
	int maxParticipants,
	String hostName,
	String hostPhone,
	String hostEmail,
	String farmName,
	String imageUrl
) {
}
