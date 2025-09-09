package com.onnongwa.back_end.domain.experience.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExperienceSchedule {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String time;       // ex: "09:00~12:00"
	private String activity;   // ex: "감자 캐기 체험"

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "experience_id")
	private Experience experience;

	public ExperienceSchedule(String time, String activity) {
		this.time = time;
		this.activity = activity;
	}

	void setExperience(Experience experience) {
		this.experience = experience;
	}
}