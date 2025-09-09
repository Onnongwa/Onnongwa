package com.onnongwa.back_end.domain.experience.entity;

import java.util.ArrayList;
import java.util.List;

import com.onnongwa.back_end.domain.experience.controller.dto.ExpRegisterDto;
import com.onnongwa.back_end.domain.farm.entity.Farm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 기본 정보
    private String title;           // 제목
    private String description;     // 설명
    private String location;        // 지역 (ex: 강원도 평창군)
    private String duration;        // 총 소요 시간 (ex: "약 5시간")
    private int price;              // 가격
    private String address;         // 주소
    private String placeType;       // 실내/실외
    private String regionType;      // 농촌/어촌
    private String crops;           // 주요 작물 (콤마 구분)

    // 운영 정보
    private String operatingHours;  // 운영 시간 (ex: "09:00 - 18:00")
    private int minParticipants;    // 최소 인원
    private int maxParticipants;    // 최대 인원
    private String imageUrl;        // 대표 이미지 URL

    private int viewCount; // 조회수

    @ElementCollection
    @CollectionTable(name = "experience_closed_days", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "day")
    private List<String> closedDays = new ArrayList<>(); // 휴무일


    // 하이라이트
    @ElementCollection
    @CollectionTable(name = "experience_highlights", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();

    // 포함 사항
    @ElementCollection
    @CollectionTable(name = "experience_inclusions", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "inclusion")
    private List<String> inclusions = new ArrayList<>();

    // 해시태그
    @ElementCollection
    @CollectionTable(name = "experience_hashtags", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "hashtag")
    private List<String> hashtags = new ArrayList<>();

    // 일정
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ExperienceSchedule> schedule = new ArrayList<>();

    // 담당자 정보 (Host)
    private String hostName;
    private String hostPhone;
    private String hostEmail;
    private String hostFarmName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;


    public static Experience from(ExpRegisterDto dto, Farm farm){
        Experience experience = Experience.builder()
            .title(dto.title())
            .description(dto.description())
            .location(dto.location())
            .duration(dto.duration())
            .price(dto.price())
            .address(dto.address())
            .placeType(dto.placeType())
            .regionType(dto.regionType())
            .crops(dto.crops())
            .operatingHours(dto.operatingHours())
            .minParticipants(dto.minParticipants())
            .maxParticipants(dto.maxParticipants())
            .imageUrl(dto.imageUrl())
            .viewCount(0)
            .closedDays(dto.closedDays())
            .highlights(dto.highlights())
            .inclusions(dto.inclusions())
            .hashtags(dto.hashtags())
            .hostName(dto.host().name())
            .hostPhone(dto.host().phone())
            .hostEmail(dto.host().email())
            .hostFarmName(dto.host().farmName())
            .farm(farm)
            .build();

        // 스케줄 추가
        dto.schedule().forEach(s -> {
            ExperienceSchedule schedule = new ExperienceSchedule(s.time(), s.activity());
            experience.addSchedule(schedule);
        });

        return experience;
    }

    public void addSchedule(ExperienceSchedule schedule) {
        this.schedule.add(schedule);
        schedule.setExperience(this);
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

}
