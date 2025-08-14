// src/pages/register/generate/AiGeneratePage.tsx
// 파일명이 다르면 경로/이름만 맞춰서 저장하세요.
import React, { useState } from "react";
import {
    Edit, CheckCircle, MapPin, Clock, Users, Calendar, Tag,
    Mail, Phone, Sparkles
} from "lucide-react";

// (임시) 등록 API — 나중에 실제 백엔드 연동으로 교체
async function registerExperience(payload: unknown): Promise<{success:boolean; message:string}> {
    try {
        // 실제 연동 시:
        // const res = await fetch(`${process.env.REACT_APP_API_URL}/experiences`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload),
        // });
        // if (!res.ok) return { success: false, message: await res.text() };
        // return { success: true, message: "등록 완료!" };

        console.log("mock registerExperience payload:", payload);
        return { success: true, message: "(mock) 등록 완료!" };
    } catch (e: any) {
        return { success: false, message: e?.message ?? "알 수 없는 오류" };
    }
}

type ScheduleItem = { time: string; activity: string };
type ExperienceData = {
    title: string;
    aiPromotionalText: string;
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

const initialData: ExperienceData = {
    title: "AI 추천: 숲속 힐링 명상 & 차담 체험 🧘‍♀️🍵",
    aiPromotionalText: `바쁜 일상에 지친 당신을 위한 완벽한 휴식! 🌿
고요한 숲속에서 자연의 소리를 들으며 깊은 명상에 잠기고,
향긋한 전통차와 함께 마음을 나누는 차담 시간을 가져보세요.
몸과 마음의 균형을 되찾고, 새로운 에너지를 충전할 수 있습니다.
도심을 벗어나 진정한 나를 만나는 특별한 경험을 선사합니다.`,
    location: "경기도 가평",
    address: "가평군 상면 수목원로 123",
    placeType: "실외",
    regionType: "농촌",
    crops: "차, 허브",
    price: "45,000원",
    duration: "약 2시간",
    availableDates: "매주 주말 (사전 예약 필수)",
    operatingHours: "10:00 - 17:00",
    closedDays: ["월요일", "공휴일"],
    minParticipants: 1,
    maxParticipants: 10,
    schedule: [
        { time: "10:00", activity: "✅ 농장 도착 및 환영" },
        { time: "10:30", activity: "🛠️ 명상 도구 설명 및 안전 교육" },
        { time: "11:00", activity: "🧘‍♀️ 숲속 명상 체험" },
        { time: "12:00", activity: "🍽️ 전통차 시음 및 다과" },
        { time: "12:30", activity: "🗣️ 자유로운 차담 시간" },
        { time: "13:00", activity: "👋 체험 마무리 및 기념품 증정" },
    ],
    highlights: [
        "전문가와 함께하는 숲속 명상",
        "다도 체험 및 전통차 시음",
        "자연 속에서 얻는 깊은 평화와 안정",
        "소규모 그룹으로 프라이빗한 경험",
    ],
    inclusions: ["명상 도구 대여", "전통차 및 다과", "전문가 가이드", "기념품"],
    hashtags: ["#숲속명상", "#차담", "#힐링체험", "#자연치유", "#가평여행"],
    host: {
        name: "김철수",
        phone: "010-1234-5678",
        email: "kim.chulsoo@example.com",
        farmName: "가평 힐링 숲 농장",
    },
    imageUrl: "/placeholder.svg?height=400&width=600",
};

export default function AiGenerateReviewPage() {
    const [data] = useState<ExperienceData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 편집 토글
    const [editPromo, setEditPromo] = useState(false);
    const [promoText, setPromoText] = useState(data.aiPromotionalText);
    const [editBasic, setEditBasic] = useState(false);
    const [editDetails, setEditDetails] = useState(false);
    const [editSchedule, setEditSchedule] = useState(false);
    const [editHighlights, setEditHighlights] = useState(false);
    const [editInclusions, setEditInclusions] = useState(false);
    const [editHashtags, setEditHashtags] = useState(false);
    const [editHost, setEditHost] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const payload = { ...data, aiPromotionalText: promoText };
        const result = await registerExperience(payload);
        alert(`${result.success ? "✅" : "❌"} ${result.message}`);
        setIsSubmitting(false);
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
                                <Sparkles className="h-6 w-6 text-primary" />
                                AI가 작성한 홍보글
                            </h3>
                            <button
                                className="px-3 py-1.5 rounded border text-sm"
                                onClick={() => setEditPromo(!editPromo)}
                            >
                                <Edit className="h-4 w-4 inline mr-1" />
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
                                <MapPin className="h-6 w-6 text-primary" />
                                기본 정보
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditBasic(!editBasic)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editBasic ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editBasic ? (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <input className="border rounded px-2 py-1" placeholder="위치" defaultValue={data.location} />
                                <input className="border rounded px-2 py-1" placeholder="기간" defaultValue={data.duration} />
                                <input className="border rounded px-2 py-1" placeholder="가격" defaultValue={data.price} />
                                <input className="border rounded px-2 py-1" placeholder="이용 가능 날짜" defaultValue={data.availableDates} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <MapPin className="h-6 w-6 mb-2" /><span className="font-medium">{data.location}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Clock className="h-6 w-6 mb-2" /><span className="font-medium">{data.duration}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Users className="h-6 w-6 mb-2" /><span className="font-medium">{data.price}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                                    <Calendar className="h-6 w-6 mb-2" /><span className="font-medium">{data.availableDates}</span>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 상세 정보 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                체험 상세 정보
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditDetails(!editDetails)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editDetails ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editDetails ? (
                            <ul className="space-y-2 text-base">
                                <li><span className="font-medium">주소:</span> <input className="border rounded px-2 py-1 w-full" defaultValue={data.address} /></li>
                                <li><span className="font-medium">장소 유형:</span> <input className="border rounded px-2 py-1" defaultValue={data.placeType} /></li>
                                <li><span className="font-medium">지역 유형:</span> <input className="border rounded px-2 py-1" defaultValue={data.regionType} /></li>
                                <li><span className="font-medium">관련 작물:</span> <input className="border rounded px-2 py-1" defaultValue={data.crops} /></li>
                                <li><span className="font-medium">운영 시간:</span> <input className="border rounded px-2 py-1" defaultValue={data.operatingHours} /></li>
                                <li><span className="font-medium">휴무일:</span> <input className="border rounded px-2 py-1 w-full" defaultValue={data.closedDays.join(", ")} /></li>
                                <li><span className="font-medium">참가 인원:</span> 최소 <input type="number" defaultValue={data.minParticipants} className="border rounded px-2 py-1 w-20 inline-block" /> 명 ~ 최대 <input type="number" defaultValue={data.maxParticipants} className="border rounded px-2 py-1 w-20 inline-block" /> 명</li>
                            </ul>
                        ) : (
                            <ul className="space-y-2 text-base">
                                <li><span className="font-medium">주소:</span> {data.address}</li>
                                <li><span className="font-medium">장소 유형:</span> {data.placeType}</li>
                                <li><span className="font-medium">지역 유형:</span> {data.regionType}</li>
                                <li><span className="font-medium">관련 작물:</span> {data.crops}</li>
                                <li><span className="font-medium">운영 시간:</span> {data.operatingHours}</li>
                                <li><span className="font-medium">휴무일:</span> {data.closedDays.join(", ")}</li>
                                <li><span className="font-medium">참가 인원:</span> 최소 {data.minParticipants}명 ~ 최대 {data.maxParticipants}명</li>
                            </ul>
                        )}
                    </section>

                    {/* 일정 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary" />
                                체험 일정
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditSchedule(!editSchedule)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editSchedule ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editSchedule ? (
                            <>
                <textarea
                    defaultValue={data.schedule.map(s => `${s.time}: ${s.activity}`).join("\n")}
                    rows={data.schedule.length + 2}
                    className="w-full p-3 rounded border"
                    placeholder="각 줄에 '시간: 일정' 형식으로 입력"
                />
                                <p className="text-sm text-gray-500 mt-1">각 줄에 '시간: 일정' 형식으로 입력하세요.</p>
                            </>
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

                    {/* 하이라이트 */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Tag className="h-6 w-6 text-primary" />
                                체험 하이라이트
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditHighlights(!editHighlights)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editHighlights ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editHighlights ? (
                            <textarea
                                defaultValue={data.highlights.join("\n")}
                                rows={data.highlights.length + 2}
                                className="w-full p-3 rounded border"
                            />
                        ) : (
                            <ul className="space-y-2">
                                {data.highlights.map((h, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
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
                                <Tag className="h-6 w-6 text-primary" />
                                포함 사항
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditInclusions(!editInclusions)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editInclusions ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editInclusions ? (
                            <textarea
                                defaultValue={data.inclusions.join(", ")}
                                className="w-full p-3 rounded border"
                                placeholder="쉼표로 구분하여 입력"
                            />
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
                                <Tag className="h-6 w-6 text-primary" />
                                해시태그
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditHashtags(!editHashtags)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editHashtags ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editHashtags ? (
                            <textarea
                                defaultValue={data.hashtags.join(", ")}
                                className="w-full p-3 rounded border"
                                placeholder="쉼표로 구분하여 입력"
                            />
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
                                <Users className="h-6 w-6 text-primary" />
                                담당자 정보
                            </h3>
                            <button className="px-3 py-1.5 rounded border text-sm" onClick={() => setEditHost(!editHost)}>
                                <Edit className="h-4 w-4 inline mr-1" />
                                {editHost ? "수정 완료" : "수정하기"}
                            </button>
                        </div>
                        {editHost ? (
                            <div className="space-y-2">
                                <input className="border rounded px-2 py-1 w-full" placeholder="이름" defaultValue={data.host.name} />
                                <input className="border rounded px-2 py-1 w-full" placeholder="전화번호" defaultValue={data.host.phone} />
                                <input className="border rounded px-2 py-1 w-full" placeholder="이메일" defaultValue={data.host.email} />
                                <input className="border rounded px-2 py-1 w-full" placeholder="농장명" defaultValue={data.host.farmName} />
                            </div>
                        ) : (
                            <p>
                                <span className="font-medium">{data.host.name}</span> ({data.host.farmName})
                                <br />
                                <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />문의: {data.host.phone}</span>
                                <br />
                                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4" />
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
