package com.onnongwa.back_end.open_api.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.onnongwa.back_end.open_api.dto.AiOnboardingDTO;

@Service
public class ChatResponseParser {
	public static AiOnboardingDTO parse(String content) {
		Map<String, String> map = Arrays.stream(content.split("\n"))
			.map(line -> line.split("=", 2)) // 2개만 split (key, value)
			.filter(arr -> arr.length == 2)
			.collect(Collectors.toMap(
				arr -> arr[0].trim(),
				arr -> arr[1].trim()
			));

		// scheduleItems는 ;로 분리
		List<String> scheduleItems = new ArrayList<>();
		if (map.containsKey("scheduleItems")) {
			scheduleItems = Arrays.stream(map.get("scheduleItems").split(";"))
				.map(String::trim)
				.collect(Collectors.toList());
		}

		return new AiOnboardingDTO(
			map.getOrDefault("title", ""),
			map.getOrDefault("region", ""),
			map.getOrDefault("address", ""),
			map.getOrDefault("description", ""),
			map.getOrDefault("crops", ""),
			Integer.parseInt(map.getOrDefault("price", "0")),
			scheduleItems,
			Integer.parseInt(map.getOrDefault("minParticipants", "0")),
			Integer.parseInt(map.getOrDefault("maxParticipants", "0")),
			map.getOrDefault("hostName", ""),
			map.getOrDefault("hostPhone", ""),
			map.getOrDefault("hostEmail", ""),
			map.getOrDefault("farmName", ""),
			map.getOrDefault("imageUrl", "")
		);
	}
}
