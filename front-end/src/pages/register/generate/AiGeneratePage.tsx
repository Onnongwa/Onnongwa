// src/pages/register/generate/AiGeneratePage.tsx
// 파일명이 다르면 경로/이름만 맞춰서 저장하세요.
import React, { useState } from "react";
import {
    Edit, CheckCircle, MapPin, Clock, Users, Calendar, Tag,
    Mail, Phone, Sparkles
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const API_BASE = "http://localhost:8080/api/v1/experience"

type ScheduleItem = { time: string; activity: string };
type ExperienceData = {
    title: string;
    description: string;
    location: string;
    address: string;
    placeType: string;
    regionType: string;
    crops: string;
    price: string;
    duration: string;
    availableDates: string;
    operatingHours: string;
    closedDays: string[];
    minParticipants: number;
    maxParticipants: number;
    schedule: ScheduleItem[];
    highlights: string[];
    inclusions: string[];
    hashtags: string[];
    host: { name: string; phone: string; email: string; farmName: string };
    imageUrl?: string;
};

export default function AiGenerateReviewPage() {

    const location = useLocation();
    const { result } = location.state || {}; // 안전하게 구조 분해

    useEffect(() => {
        console.log("이전 페이지에서 받은 데이터:", result);
    }, [result]);

    const [data, setData] = useState<ExperienceData>(() => {
        if (!result) return {} as ExperienceData;

        // placeType, regionType 한국어 변환
        const placeTypeMap: Record<string, string> = { indoor: "실내", outdoor: "실외" };
        const regionTypeMap: Record<string, string> = { rural: "농촌", fishing: "어촌" };

        // scheduleItems 변환
        const schedule = (result.scheduleItems || []).map((s: string) => {
            const [time, ...rest] = s.split("-");
            return { time: time.trim(), activity: rest.join("-").trim() };
        });

        return {
            title: result.title,
            description: result.description || "",
            location: result.region,
            address: result.address,
            placeType: placeTypeMap[result.placeType] || "실내",
            regionType: regionTypeMap[result.regionType] || "농촌",
            crops: result.crops,
            price: String(result.price),
            duration: "약 " + result.duration + "시간", // 운영 시간은 추후 입력
            availableDates: result.selectedClosedDays ,
            operatingHours: `${result.startTime || ""} - ${result.endTime || ""}`,
            closedDays: result.selectedClosedDays ,
            minParticipants: result.minParticipants,
            maxParticipants: result.maxParticipants,
            schedule,
            highlights: result.highlights,
            inclusions: result.inclusions,
            hashtags: result.hashtags,
            host: {
                name: result.hostName,
                phone: result.hostPhone,
                email: result.hostEmail,
                farmName: result.farmName
            },
            imageUrl: result.imageUrl
        };
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 편집 토글
    const [editPromo, setEditPromo] = useState(false);
    const [promoText, setPromoText] = useState(data.description);
    const [editBasic, setEditBasic] = useState(false);
    const [editDetails, setEditDetails] = useState(false);
    const [editSchedule, setEditSchedule] = useState(false);
    const [editHighlights, setEditHighlights] = useState(false);
    const [editInclusions, setEditInclusions] = useState(false);
    const [editHashtags, setEditHashtags] = useState(false);
    const [editHost, setEditHost] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const response = await fetch(API_BASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("등록 실패");

            // const result = await response.json();
            //
            // // alert 출력
            // alert(`${result.success ? "✅" : "❌"} ${result.message}`);
        } catch (error) {
            console.error(error);
            alert("❌ 등록 실패. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto rounded border bg-white shadow-lg overflow-hidden">
                <img
                    src={data.imageUrl || "/placeholder.svg"}
                    alt={data.title}
                    className="w-full aspect-video object-cover"
                />
                <div className="p-6 space-y-8">
                    <h1 className="text-3xl font-bold">{data.title}</h1>

                    {/* AI 홍보글 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-primary"/>
                                AI가 작성한 홍보글
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditPromo(!editPromo)}
                            >
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editPromo ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        <textarea
                            rows={8}
                            value={promoText}
                            onChange={(e) => setPromoText(e.target.value)}
                            readOnly={!editPromo}
                            className={`w-full p-3 rounded border ${editPromo ? "border-primary" : "border-gray-200"} bg-background`}
                        />
                    </section>

                    {/* 기본 정보 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-primary"/>
                                기본 정보
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm"
                                    onClick={() => setEditBasic(!editBasic)}>
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editBasic ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editBasic ? (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <input
                                    className="border rounded px-2 py-1"
                                    placeholder="위치"
                                    value={data.location}
                                    onChange={(e) => setData({...data, location: e.target.value})}
                                />
                                <input
                                    className="border rounded px-2 py-1"
                                    placeholder="기간"
                                    value={data.duration}
                                    onChange={(e) => setData({...data, duration: e.target.value})}
                                />
                                <input
                                    className="border rounded px-2 py-1"
                                    placeholder="가격"
                                    value={data.price}
                                    onChange={(e) => setData({...data, price: e.target.value})}
                                />
                                <input
                                    className="border rounded px-2 py-1"
                                    placeholder="이용 가능 날짜"
                                    value={data.availableDates}
                                    onChange={(e) => setData({...data, availableDates: e.target.value})}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <MapPin className="h-6 w-6 mb-2"/><span
                                    className="font-medium">{data.location}</span>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Clock className="h-6 w-6 mb-2"/><span
                                    className="font-medium">{data.duration}</span>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Users className="h-6 w-6 mb-2"/><span className="font-medium">{data.price}</span>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Calendar className="h-6 w-6 mb-2"/>
                                    <span className="font-medium">
        {Array.isArray(data.availableDates)
            ? data.availableDates.join(", ")  // 배열이면 ,로 연결
            : data.availableDates.split(/[,]/).join(", ")} {/* 문자열이면 , 기준으로 split */}
    </span>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 상세 정보 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-primary"/>
                                체험 상세 정보
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm"
                                    onClick={() => setEditDetails(!editDetails)}>
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editDetails ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editDetails ? (
                            <ul className="space-y-2 text-base">
                                <li>
                                    <span className="font-medium">주소:</span>
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={data.address}
                                        onChange={(e) => setData({...data, address: e.target.value})}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">장소 유형:</span>
                                    <input
                                        className="border rounded px-2 py-1"
                                        value={data.placeType}
                                        onChange={(e) => setData({...data, placeType: e.target.value})}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">지역 유형:</span>
                                    <input
                                        className="border rounded px-2 py-1"
                                        value={data.regionType}
                                        onChange={(e) => setData({...data, regionType: e.target.value})}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">관련 작물:</span>
                                    <input
                                        className="border rounded px-2 py-1"
                                        value={data.crops}
                                        onChange={(e) => setData({...data, crops: e.target.value})}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">운영 시간:</span>
                                    <input
                                        className="border rounded px-2 py-1"
                                        value={data.operatingHours}
                                        onChange={(e) => setData({...data, operatingHours: e.target.value})}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">휴무일:</span>
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={data.closedDays.join(", ")} // 보기용 문자열
                                        onChange={(e) => {
                                            // 입력값을 쉼표 또는 줄바꿈 기준으로 나누고
                                            // 공백 제거, 빈 문자열 제거
                                            const cleaned = e.target.value
                                                .split(/,|\n/)        // 쉼표나 줄바꿈 기준으로 분리
                                                .map(s => s.trim())    // 공백 제거
                                                .filter(s => s.length > 0); // 빈 문자열 제거
                                            setData({...data, closedDays: cleaned});
                                        }}
                                    />
                                </li>
                                <li>
                                    <span className="font-medium">참가 인원:</span>
                                    최소{" "}
                                    <input
                                        type="number"
                                        className="border rounded px-2 py-1 w-20 inline-block"
                                        value={data.minParticipants}
                                        onChange={(e) =>
                                            setData({...data, minParticipants: parseInt(e.target.value) || 1})
                                        }
                                    />{" "}
                                    명 ~ 최대{" "}
                                    <input
                                        type="number"
                                        className="border rounded px-2 py-1 w-20 inline-block"
                                        value={data.maxParticipants}
                                        onChange={(e) =>
                                            setData({...data, maxParticipants: parseInt(e.target.value) || 1})
                                        }
                                    />{" "}
                                    명
                                </li>
                            </ul>
                        ) : (
                            <ul className="space-y-2 text-base">
                                <li><span className="font-medium">주소:</span> {data.address}</li>
                                <li><span className="font-medium">장소 유형:</span> {data.placeType}</li>
                                <li><span className="font-medium">지역 유형:</span> {data.regionType}</li>
                                <li><span className="font-medium">관련 작물:</span> {data.crops}</li>
                                <li><span className="font-medium">운영 시간:</span> {data.operatingHours}</li>
                                <li><span className="font-medium">휴무일:</span> {data.closedDays.join(", ")}</li>
                                <li><span className="font-medium">참가 인원:</span> 최소 {data.minParticipants}명 ~
                                    최대 {data.maxParticipants}명
                                </li>
                            </ul>
                        )}
                    </section>

                    {/* 일정 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary"/>
                                체험 일정
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm"
                                    onClick={() => setEditSchedule(!editSchedule)}>
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editSchedule ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editSchedule ? (
                            <div className="space-y-2">
                                {data.schedule.map((s, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 w-24"
                                            value={s.time}
                                            onChange={(e) => {
                                                const newSchedule = [...data.schedule];
                                                newSchedule[i].time = e.target.value;
                                                setData({...data, schedule: newSchedule});
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 flex-1"
                                            value={s.activity}
                                            onChange={(e) => {
                                                const newSchedule = [...data.schedule];
                                                newSchedule[i].activity = e.target.value;
                                                setData({...data, schedule: newSchedule});
                                            }}
                                        />
                                    </div>
                                ))}
                                <button
                                    className="mt-2 px-3 py-1 rounded border text-sm"
                                    onClick={() => setData({
                                        ...data,
                                        schedule: [...data.schedule, {time: "", activity: ""}]
                                    })}
                                >
                                    + 일정 추가
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.schedule.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                                        <span className="font-semibold w-16 flex-shrink-0">{s.time}</span>
                                        <span>{s.activity}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Tag className="h-6 w-6 text-primary"/>
                                체험 하이라이트
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditHighlights(!editHighlights)}
                            >
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editHighlights ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editHighlights ? (
                            <div className="space-y-2">
                                {data.highlights.map((h, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 flex-1"
                                            value={h}
                                            onChange={(e) => {
                                                const newHighlights = [...data.highlights];
                                                newHighlights[i] = e.target.value;
                                                setData({...data, highlights: newHighlights});
                                            }}
                                        />
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => {
                                                const newHighlights = data.highlights.filter((_, index) => index !== i);
                                                setData({...data, highlights: newHighlights});
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="mt-2 px-3 py-1 rounded border text-sm"
                                    onClick={() =>
                                        setData({...data, highlights: [...data.highlights, ""]})
                                    }
                                >
                                    + 하이라이트 추가
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {data.highlights.map((h, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary"/>
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* 포함 사항 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Tag className="h-6 w-6 text-primary"/>
                                포함 사항
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditInclusions(!editInclusions)}
                            >
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editInclusions ? "수정 완료" : "수정하기"}
                            </button>
                        </div>

                        {editInclusions ? (
                            <div className="space-y-2">
                                {data.inclusions.map((inc, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 flex-1"
                                            value={inc}
                                            onChange={(e) => {
                                                const newInclusions = [...data.inclusions];
                                                newInclusions[i] = e.target.value;
                                                setData({ ...data, inclusions: newInclusions });
                                            }}
                                        />
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => {
                                                const newInclusions = data.inclusions.filter((_, index) => index !== i);
                                                setData({ ...data, inclusions: newInclusions });
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="mt-2 px-3 py-1 rounded border text-sm"
                                    onClick={() =>
                                        setData({ ...data, inclusions: [...data.inclusions, ""] })
                                    }
                                >
                                    + 포함 사항 추가
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {data.inclusions.map((inc, i) => (
                                    <span key={i} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          {inc}
        </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 해시태그 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Tag className="h-6 w-6 text-primary"/>
                                해시태그
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditHashtags(!editHashtags)}
                            >
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editHashtags ? "수정 완료" : "수정하기"}
                            </button>
                        </div>

                        {editHashtags ? (
                            <div className="space-y-2">
                                {data.hashtags.map((tag, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 flex-1"
                                            value={tag}
                                            onChange={(e) => {
                                                const newTags = [...data.hashtags];
                                                newTags[i] = e.target.value;
                                                setData({ ...data, hashtags: newTags });
                                            }}
                                        />
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => {
                                                const newTags = data.hashtags.filter((_, index) => index !== i);
                                                setData({ ...data, hashtags: newTags });
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="mt-2 px-3 py-1 rounded border text-sm"
                                    onClick={() =>
                                        setData({ ...data, hashtags: [...data.hashtags, ""] })
                                    }
                                >
                                    + 해시태그 추가
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {data.hashtags.map((t, i) => (
                                    <span key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
          {t}
        </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 담당자 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary"/>
                                담당자 정보
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditHost(!editHost)}
                            >
                                <Edit className="h-4 w-4 inline mr-1"/>
                                {editHost ? "수정 완료" : "수정하기"}
                            </button>
                        </div>

                        {editHost ? (
                            <div className="space-y-2">
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="이름"
                                    value={data.host.name}
                                    onChange={(e) =>
                                        setData({ ...data, host: { ...data.host, name: e.target.value } })
                                    }
                                />
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="전화번호"
                                    value={data.host.phone}
                                    onChange={(e) =>
                                        setData({ ...data, host: { ...data.host, phone: e.target.value } })
                                    }
                                />
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="이메일"
                                    value={data.host.email}
                                    onChange={(e) =>
                                        setData({ ...data, host: { ...data.host, email: e.target.value } })
                                    }
                                />
                                <input
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="농장명"
                                    value={data.host.farmName}
                                    onChange={(e) =>
                                        setData({ ...data, host: { ...data.host, farmName: e.target.value } })
                                    }
                                />
                            </div>
                        ) : (
                            <p>
                                <span className="font-medium">{data.host.name}</span> ({data.host.farmName})
                                <br/>
                                <span className="inline-flex items-center gap-1">
        <Phone className="h-4 w-4"/>
        문의: {data.host.phone}
      </span>
                                <br/>
                                <span className="inline-flex items-center gap-1">
        <Mail className="h-4 w-4"/>
        <a href={`mailto:${data.host.email}`} className="hover:underline">{data.host.email}</a>
      </span>
                            </p>
                        )}
                    </section>

                    <div className="pt-4 border-t flex justify-center">
                        <button
                            className="w-full max-w-xs bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 rounded"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "등록 중..." : "최종 등록하기"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
