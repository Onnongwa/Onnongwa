package com.onnongwa.back_end.domain.experience.entity;

import com.onnongwa.back_end.domain.farm.entity.Farm;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String image;
    private int totalTime;
    private int price;
    private String schedule;
    @Enumerated(EnumType.STRING)
    private Location locationType;
    private int minCapacity;
    private int maxCapacity;
    private String url;
    private String hashTag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;
}
