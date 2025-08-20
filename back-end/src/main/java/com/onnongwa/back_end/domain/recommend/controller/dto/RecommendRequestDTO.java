package com.onnongwa.back_end.domain.recommend.controller.dto;

public record RecommendRequestDTO(String experienceName,
                                  String image,
                                  String address,
                                  String relatedCrops,
                                  String participationFee,
                                  String minParticipants,
                                  String maxParticipants,
                                  String farmName) {
}
/*
front는 아래와 같은 형태로 되어있음
불필요하다고 생각 되는 것은 일단 제외함
    experienceName: string;
    representativeImage: File | null;
    location: string;
    address: string;
    description: string;
    relatedCrops: string;
    participationFee: string;
    schedule: string;
    startTime: string;
    endTime: string;
    closedDays: string;
    minParticipants: string;
    maxParticipants: string;
    contactPhone: string;
    contactName: string;
    contactEmail: string;
    farmName: string;
 */
