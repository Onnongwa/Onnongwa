package com.onnongwa.back_end.domain.experience.entity;

import java.util.ArrayList;
import java.util.List;

import com.onnongwa.back_end.domain.farm.entity.Farm;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String image; // 대표 이미지 URL
    private int totalTime; // 체험 시간 예) "09:00 - 12:00"
    private int price;
    private String schedule;
    private int minCapacity;
    private int maxCapacity;
    private String url;
    private String hashTag;

    @Enumerated(EnumType.STRING)
    private Location locationType;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExperienceSchedule> scheduleItems = new ArrayList<>();
}
