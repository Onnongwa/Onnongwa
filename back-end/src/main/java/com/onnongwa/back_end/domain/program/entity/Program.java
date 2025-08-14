package com.onnongwa.back_end.domain.program.entity;

import com.onnongwa.back_end.domain.recommend.entity.Recommend;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int totalTime;
    private int price;
    private String schedule;
    private String feature;
    private String note;
    private Location locationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommend_id", nullable = false)
    private Recommend recommend;
}
