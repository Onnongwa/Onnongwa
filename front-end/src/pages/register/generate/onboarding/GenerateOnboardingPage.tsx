// src/pages/register/GenerateOnboardingPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mic, ChevronLeft, ChevronRight, Search, Sparkles,
    Image as ImageIcon
} from "lucide-react";

type ScheduleItem = { time: string; activity: string };

export default function GenerateOnboardingPage() {
    const navigate = useNavigate();

    const API_BASE = "http://localhost:8080/api/v1"
    const IMAGE_SERVER_BASE = "http://localhost:8080";
    // 진행 단계
    const totalSteps = 12;
    const [currentStep, setCurrentStep] = useState(1);

    // 폼 상태
    // step 1
    const [title, setTitle] = useState("");
    // step 2
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    // step 3
    const [region, setRegion] = useState(""); // 도 시 군
    const [address, setAddress] = useState(""); // 상세 주소
    // step 4
    const [placeType, setPlaceType] = useState<"indoor" | "outdoor">("indoor"); // 실내 or 실외
    // step 5
    const [regionType, setRegionType] = useState<"rural" | "fishing">("rural"); // 농촌 or 어촌
    // step 6
    const [description, setDescription] = useState(""); //체험 소개 설명
    // step 7
    const [crops, setCrops] = useState(""); // 체험과 관련된 상품
    // step 8
    const [price, setPrice] = useState<string>(""); // 참가비
    // step 9
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]); // 보내질 스케줄
    const [newScheduleTime, setNewScheduleTime] = useState(""); // 키로 사용된 일정 시간
    const [newScheduleActivity, setNewScheduleActivity] = useState(""); // 값 일정 내용
    // step 10
    const [startTime, setStartTime] = useState(""); // 운영 시작 시간
    const [endTime, setEndTime] = useState(""); // 운영 마지막 시간
    const [selectedClosedDays, setSelectedClosedDays] = useState<string[]>([]); // 휴무일
    // step 11
    const [minParticipants, setMinParticipants] = useState<number | "">(""); // 참가 최소 인원
    const [maxParticipants, setMaxParticipants] = useState<number | "">(""); // 참가 최대 인원
    // step 12
    const [hostName, setHostName] = useState(""); // 농장주명
    const [hostPhone, setHostPhone] = useState(""); // 연락처
    const [hostEmail, setHostEmail] = useState(""); // 이메일
    const [farmName, setFarmName] = useState(""); // 농장명

    const progress = (currentStep / totalSteps) * 100;


    // 유효성 검사
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return title.trim() !== "";
            case 2:
                // 이미지 업로드 기능 미구현 → 예시로는 통과시킴
                return true;
            case 3:
                return region.trim() !== "" && address.trim() !== "";
            case 4:
                return placeType === "indoor" || placeType === "outdoor";
            case 5:
                return regionType === "rural" || regionType === "fishing";
            case 6:
                return description.trim() !== "";
            case 7:
                return crops.trim() !== "";
            case 8:
                return price.trim() !== "" && !isNaN(Number(price));
            case 9:
                return scheduleItems.length > 0;
            case 10:
                return startTime.trim() !== "" && endTime.trim() !== "";
            case 11:
                return (
                    minParticipants !== "" &&
                    maxParticipants !== "" &&
                    Number(minParticipants) > 0 &&
                    Number(maxParticipants) >= Number(minParticipants)
                );
            case 12:
                return (
                    hostName.trim() !== "" &&
                    hostPhone.trim() !== "" &&
                    hostEmail.trim() !== "" &&
                    farmName.trim() !== ""
                );
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }
        setCurrentStep((s) => Math.min(s + 1, totalSteps));
    }
    const handlePrevious = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const handleAddSchedule = () => {
        if (!newScheduleTime || !newScheduleActivity) return;
        setScheduleItems((prev) => [...prev, { time: newScheduleTime, activity: newScheduleActivity }]);
        setNewScheduleTime("");
        setNewScheduleActivity("");
    };

    const toggleClosedDay = (day: string) => {
        setSelectedClosedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    const daysOfWeek = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];


    // 폼데이터로 전송할 수 없기에 이미지 등록시 서버에 이미지를 먼저 저장하고 url을 json으로 보내는 방식 채택
    // step2. 이미지 업로드 함수
    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE}/experience/imgupload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("이미지 업로드 실패:", errorText);
                alert("이미지 업로드에 실패했습니다.");
                return null;
            }

            const data = await response.json();
            // 서버에서 반환된 이미지 URL
            return data.url;
        } catch (error) {
            console.error("이미지 업로드 중 오류:", error);
            alert("이미지 업로드 중 오류가 발생했습니다.");
            return null;
        }
    };

    const finish = async ()  => {

        const payload = {
            title,imageUrl, region, address, placeType, regionType, description, crops, price,
            scheduleItems, startTime, endTime, selectedClosedDays,
            minParticipants, maxParticipants, host: { hostName, hostPhone, hostEmail, farmName },
        };
        console.log("onboarding payload:", payload);

        try {
            const response = await fetch("/api/v1/experience/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // JSON 형식임을 명시
                },
                body: JSON.stringify(payload), // 객체를 JSON 문자열로 변환
            });

            if (!response.ok) {
                // 200~299 범위가 아닌 경우 에러 처리
                const errorText = await response.text();
                console.error("서버 응답 오류:", errorText);
                alert("체험 등록에 실패했습니다.");
                return;
            }

            const result = await response.json();
            console.log("서버 응답:", result);

            // 성공 시 다음 페이지로 이동
            navigate("/register/ai-generate/review");
        } catch (error) {
            console.error("요청 실패:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }

        // navigate("/register/ai-generate/review");
    };

    const Step = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <label htmlFor="experience-name" className="block text-lg font-medium">1. 체험 이름은 무엇인가요?</label>
                        <div className="flex gap-2 items-center">
                            <input
                                id="experience-name"
                                placeholder="예: 땅속 보물 찾기, 감자 명상"
                                className="flex-1 border rounded px-3 py-2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <button className="w-full border rounded px-4 py-2 flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4" /> AI에게 추천 받기
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">2. 체험 대표 이미지를 등록해주세요.</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* 이미지 미리보기 */}
                            <div className="w-full sm:w-64 h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-500 overflow-hidden">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="대표 이미지"
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <>
                                        <ImageIcon className="h-10 w-10" />
                                        <span className="sr-only">이미지 미리보기</span>
                                    </>
                                )}
                            </div>

                            {/* 이미지 선택 버튼 */}
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <label className="border rounded px-4 py-2 cursor-pointer text-center">
                                    이미지 선택
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={ async ( e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const uploadedUrl = await uploadImage(file);
                                            if (!uploadedUrl) return;

                                            const url =`${IMAGE_SERVER_BASE}${uploadedUrl}`;
                                            setImageUrl(url);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">3. 체험이 진행되는 지역과 주소를 입력해주세요.</label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 강원도 평창군"
                                className="flex-1 border rounded px-3 py-2"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="상세 주소 입력"
                                className="flex-1 border rounded px-3 py-2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <button className="w-full border rounded px-4 py-2 flex items-center gap-2 justify-center">
                            <Search className="h-4 w-4" /> 우편 번호 검색
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">4. 체험 장소 유형을 선택해주세요.</label>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="placeType"
                                    value="indoor"
                                    checked={placeType === "indoor"}
                                    onChange={() => setPlaceType("indoor")}
                                />
                                <span>실내</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="placeType"
                                    value="outdoor"
                                    checked={placeType === "outdoor"}
                                    onChange={() => setPlaceType("outdoor")}
                                />
                                <span>실외</span>
                            </label>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">5. 지역 유형을 선택해주세요.</label>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="regionType"
                                    value="rural"
                                    checked={regionType === "rural"}
                                    onChange={() => setRegionType("rural")}
                                />
                                <span>농촌</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="regionType"
                                    value="fishing"
                                    checked={regionType === "fishing"}
                                    onChange={() => setRegionType("fishing")}
                                />
                                <span>어촌</span>
                            </label>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            6. 체험을 소개하는 설명을 입력해주세요. (간단히 작성하면 AI가 다듬어요)
                        </label>
                        <div className="flex gap-2 items-start">
              <textarea
                  rows={5}
                  placeholder="예: 흙 내음 가득한 밭에서 감자를 캐는 체험입니다."
                  className="flex-1 border rounded px-3 py-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">7. 체험과 관련된 작물을 입력해주세요.</label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 감자, 고구마, 딸기 (쉼표로 구분)"
                                className="flex-1 border rounded px-3 py-2"
                                value={crops}
                                onChange={(e) => setCrops(e.target.value)}
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">8. 참가비는 얼마인가요?</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="예: 50000"
                                className="flex-1 border rounded px-3 py-2"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            case 9:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">9. 체험 일정을 알려주세요.</label>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="시간 (예: 10:00)"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={newScheduleTime}
                                    onChange={(e) => setNewScheduleTime(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="일정 (예: 농장 도착 및 환영)"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={newScheduleActivity}
                                    onChange={(e) => setNewScheduleActivity(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddSchedule}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
                            >
                                일정 추가
                            </button>
                        </div>
                        {scheduleItems.length > 0 && (
                            <div className="mt-4 space-y-2 text-left">
                                <h4 className="text-md font-semibold">등록된 일정:</h4>
                                <ul className="list-disc pl-5 text-gray-600">
                                    {scheduleItems.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="font-medium">{item.time}</span>: {item.activity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            case 10:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">10. 운영 시간을 알려주세요.</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">시작 시간</span>
                                <div className="flex gap-2 items-center">
                                    <input type="time" className="flex-1 border rounded px-3 py-2" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    <button className="border rounded p-2" aria-label="음성 입력">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">종료 시간</span>
                                <div className="flex gap-2 items-center">
                                    <input type="time" className="flex-1 border rounded px-3 py-2" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                    <button className="border rounded p-2" aria-label="음성 입력">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm">휴무일</span>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleClosedDay(day)}
                                        className={`px-3 py-1.5 rounded border ${selectedClosedDays.includes(day) ? "bg-primary text-primary-foreground" : ""}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => toggleClosedDay("공휴일")}
                                    className={`px-3 py-1.5 rounded border ${selectedClosedDays.includes("공휴일") ? "bg-primary text-primary-foreground" : ""}`}
                                >
                                    공휴일
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 11:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">11. 참가 인원 제한이 있나요?</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">최소 인원</span>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="예: 1"
                                        className="flex-1 border rounded px-3 py-2"
                                        value={minParticipants}
                                        onChange={(e) => setMinParticipants(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                    <button className="border rounded p-2" aria-label="음성 입력">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">최대 인원</span>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="예: 20"
                                        className="flex-1 border rounded px-3 py-2"
                                        value={maxParticipants}
                                        onChange={(e) => setMaxParticipants(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                    <button className="border rounded p-2" aria-label="음성 입력">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 12:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">12. 담당자(농장주) 정보를 입력해주세요.</label>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="이름"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={hostName}
                                    onChange={(e) => setHostName(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="전화번호"
                                    type="tel"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={hostPhone}
                                    onChange={(e) => setHostPhone(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="이메일"
                                    type="email"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={hostEmail}
                                    onChange={(e) => setHostEmail(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="농장명"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2 mt-6"
                            onClick={finish}
                        >
                            체험 등록 완료하기
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto rounded border bg-white shadow-sm p-6">
            <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2">체험 정보 입력 ({currentStep}/{totalSteps})</div>
                <p className="text-gray-600">AI가 매력적인 홍보글을 작성할 수 있도록 정보를 입력해주세요.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4" aria-label="progress">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={currentStep}
                        aria-valuemin={1}
                        aria-valuemax={totalSteps}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <Step />

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="inline-flex items-center gap-2 border rounded px-4 py-2 disabled:opacity-40"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        이전
                    </button>
                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center gap-2 rounded px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            다음
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={finish}
                            className="inline-flex items-center gap-2 rounded px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            등록 완료
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
