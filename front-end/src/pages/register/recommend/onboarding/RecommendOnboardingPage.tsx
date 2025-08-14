import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mic,
    ChevronLeft,
    ChevronRight,
    Search,
    Image as ImageIcon,
} from "lucide-react";

type FormData = {
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
};

export default function RecommendOnboardingPage() {
    const navigate = useNavigate();

    const totalSteps = 10;
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        experienceName: "",
        representativeImage: null,
        location: "",
        address: "",
        description: "",
        relatedCrops: "",
        participationFee: "",
        schedule: "",
        startTime: "",
        endTime: "",
        closedDays: "",
        minParticipants: "",
        maxParticipants: "",
        contactPhone: "",
        contactName: "",
        contactEmail: "",
        farmName: "",
    });

    const progress = (currentStep / totalSteps) * 100;

    const handleNext = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
    const handlePrevious = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const handleSubmit = () => {
        // TODO: formData 저장/전송 로직
        navigate("/register/ai-recommend"); // 결과 페이지로 이동
    };

    const Step = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">1. 체험 이름은 무엇인가요?</label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 감자 수확 체험, 딸기 따기 체험"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.experienceName}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, experienceName: e.target.value }))
                                }
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <button
                            className="w-full bg-primary text-primary-foreground rounded px-4 py-2"
                            type="button"
                        >
                            AI에게 추천 받기
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            2. 체험의 대표 이미지를 등록해주세요.
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="w-full sm:w-64 h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-500">
                                <ImageIcon className="h-10 w-10" />
                                <span className="sr-only">이미지 미리보기</span>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <label
                                    htmlFor="imageUpload"
                                    className="inline-block text-center border rounded px-4 py-2 cursor-pointer"
                                >
                                    이미지 선택
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            representativeImage: e.target.files?.[0] || null,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            3. 체험이 진행되는 지역과 주소는 어디인가요?
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 강원도 평창군"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, location: e.target.value }))
                                }
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="상세 주소 입력"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, address: e.target.value }))
                                }
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 border rounded px-4 py-2"
                        >
                            <Search className="h-4 w-4" />
                            우편 번호 검색
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            4. 체험을 소개하는 설명을 입력해주세요. (간단히 작성하면 AI가 다듬어요)
                        </label>
                        <div className="flex gap-2 items-start">
              <textarea
                  rows={5}
                  placeholder="예: 직접 감자를 수확하고 요리해보는 체험입니다."
                  className="flex-1 border rounded px-3 py-2"
                  value={formData.description}
                  onChange={(e) =>
                      setFormData((p) => ({ ...p, description: e.target.value }))
                  }
              />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            5. 체험과 관련된 작물은 무엇인가요?
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 감자, 고구마, 옥수수 (쉼표로 구분)"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.relatedCrops}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, relatedCrops: e.target.value }))
                                }
                            />
                            <button className="border rounded p-2" aria-label="음성 입력">
                                <Mic className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">6. 참가비는 얼마인가요?</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="예: 25000"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.participationFee}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, participationFee: e.target.value }))
                                }
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
                        <label className="block text-lg font-medium">7. 체험 일정은 어떻게 되나요?</label>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="예: 매주 토/일, 평일 예약 가능"
                                className="flex-1 border rounded px-3 py-2"
                                value={formData.schedule}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, schedule: e.target.value }))
                                }
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
                        <label className="block text-lg font-medium">
                            8. 시작시간, 휴무일, 끝나는 시간을 알려주세요.
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">시작 시간</span>
                                <input
                                    type="time"
                                    className="border rounded px-3 py-2"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, startTime: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">종료 시간</span>
                                <input
                                    type="time"
                                    className="border rounded px-3 py-2"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, endTime: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm">휴무일</span>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="예: 매주 월요일, 화요일"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={formData.closedDays}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, closedDays: e.target.value }))
                                    }
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 9:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">
                            9. 참가 인원 (최소/최대)은 몇 명인가요?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">최소 인원</span>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="예: 2"
                                        className="flex-1 border rounded px-3 py-2"
                                        value={formData.minParticipants}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, minParticipants: e.target.value }))
                                        }
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
                                        value={formData.maxParticipants}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, maxParticipants: e.target.value }))
                                        }
                                    />
                                    <button className="border rounded p-2" aria-label="음성 입력">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 10:
                return (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium">10. 담당자 정보를 알려주세요.</label>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="농장명"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={formData.farmName}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, farmName: e.target.value }))
                                    }
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="담당자 이름"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={formData.contactName}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, contactName: e.target.value }))
                                    }
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="전화번호"
                                    className="flex-1 border rounded px-3 py-2"
                                    value={formData.contactPhone}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, contactPhone: e.target.value }))
                                    }
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
                                    value={formData.contactEmail}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, contactEmail: e.target.value }))
                                    }
                                />
                                <button className="border rounded p-2" aria-label="음성 입력">
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        // ✅ Layout이 header/footer를 렌더링하므로 여기서는 본문만
        <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
            <div className="w-full max-w-2xl mx-auto rounded border bg-white shadow-sm p-6">
                <div className="text-center mb-4">
                    <div className="text-2xl font-bold mb-2">
                        체험 정보 입력 ({currentStep}/{totalSteps})
                    </div>
                    <p className="text-gray-600">
                        AI가 맞춤형 체험 아이디어를 추천할 수 있도록 정보를 입력해주세요.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
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

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="inline-flex items-center gap-2 border rounded px-4 py-2 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            이전
                        </button>
                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-2 rounded px-4 py-2 bg-primary text-primary-foreground"
                            >
                                다음
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2 rounded px-4 py-2 bg-primary text-primary-foreground"
                            >
                                AI 추천받기
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
