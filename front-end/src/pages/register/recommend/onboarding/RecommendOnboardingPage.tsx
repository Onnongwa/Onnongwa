import React, { useMemo, useRef, useState } from "react";
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

async function fileToBase64(file: File | null): Promise<string> {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

export default function RecommendOnboardingPage() {
  const navigate = useNavigate();

  const totalSteps = 7;
  // 조합 플래그는 렌더를 유발하지 않도록 ref로 관리
  const isComposingRef = useRef(false);
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

  // ✅ onChange는 항상 업데이트 (IME 중에도)
  const handleInputChange =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // 조합 중이어도 value는 그대로 반영 (리셋/트림 같은 변형 없음)
      setFormData((p) => ({ ...p, [key]: e.target.value }));
    };

  // ✅ 조합 상태만 관리 (필요시 조합 끝에 한 번 더 동기화)
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };
  const handleCompositionEnd =
    (key: keyof FormData) =>
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      isComposingRef.current = false;
      // 조합 종료 시 최종 문자열로 한 번 더 동기화 (안전빵)
      const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      setFormData((p) => ({ ...p, [key]: target.value }));
    };

  const handleSubmit = async () => {
    const imageBase64 = await fileToBase64(formData.representativeImage);
    const payload = {
      experienceName: formData.experienceName,
      image: imageBase64,
      address: `${formData.location} ${formData.address}`,
      relatedCrops: formData.relatedCrops,
      participationFee: formData.participationFee,
      minParticipants: formData.minParticipants,
      maxParticipants: formData.maxParticipants,
      farmName: formData.farmName,
    };
    try {
      // 2. 백엔드로 요청
      const res = await fetch("http://localhost:8080/api/v1/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("서버 요청 실패");
      }

      const dto = await res.json();

      // 3. 결과 페이지로 이동 (dto를 state로 전달)
      navigate("/register/ai-recommend", { state: { dto } });
    } catch (err) {
      console.error(err);
      alert("추천 요청 중 오류가 발생했습니다.");
    }
  };

  // Step JSX를 메모화해 입력 중 불필요한 재생성/리마운트 방지
  const Step = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium">
              1. 체험 이름은 무엇인가요?
            </label>
            <div className="flex gap-2 items-center">
              <input
                placeholder="예: 감자 수확 체험, 딸기 따기 체험"
                className="flex-1 border rounded px-3 py-2"
                value={formData.experienceName}
                onChange={handleInputChange("experienceName")}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd("experienceName")}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="border rounded p-2" aria-label="음성 입력">
                <Mic className="h-5 w-5" />
              </button>
            </div>
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
                onChange={handleInputChange("location")}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd("location")}
                autoComplete="off"
                spellCheck={false}
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
                onChange={handleInputChange("address")}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd("address")}
                autoComplete="off"
                spellCheck={false}
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
      // case 4:
      //     return (
      //         <div className="space-y-4">
      //             <label className="block text-lg font-medium">
      //                 4. 체험을 소개하는 설명을 입력해주세요. (간단히 작성하면 AI가 다듬어요)
      //             </label>
      //             <div className="flex gap-2 items-start">
      //   <textarea
      //       rows={5}
      //       placeholder="예: 직접 감자를 수확하고 요리해보는 체험입니다."
      //       className="flex-1 border rounded px-3 py-2"
      //       value={formData.description}
      //       onChange={(e) =>
      //           setFormData((p) => ({ ...p, description: e.target.value }))
      //       }
      //   />
      //                 <button className="border rounded p-2" aria-label="음성 입력">
      //                     <Mic className="h-5 w-5" />
      //                 </button>
      //             </div>
      //         </div>
      //     );
      case 4:
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium">
              4. 체험과 관련된 작물은 무엇인가요?
            </label>
            <div className="flex gap-2 items-center">
              <input
                placeholder="예: 감자, 고구마, 옥수수 (쉼표로 구분)"
                className="flex-1 border rounded px-3 py-2"
                value={formData.relatedCrops}
                onChange={handleInputChange("relatedCrops")}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd("relatedCrops")}
                autoComplete="off"
                spellCheck={false}
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
              5. 참가비는 얼마인가요?
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="예: 25000"
                className="flex-1 border rounded px-3 py-2"
                value={formData.participationFee}
                onChange={handleInputChange("participationFee")}
                // 숫자 입력은 IME 조합이 없지만 일관성 위해 유지
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd("participationFee")}
                inputMode="numeric"
              />
              <button className="border rounded p-2" aria-label="음성 입력">
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      // case 7:
      //     return (
      //         <div className="space-y-4">
      //             <label className="block text-lg font-medium">7. 체험 일정은 어떻게 되나요?</label>
      //             <div className="flex gap-2 items-center">
      //                 <input
      //                     placeholder="예: 매주 토/일, 평일 예약 가능"
      //                     className="flex-1 border rounded px-3 py-2"
      //                     value={formData.schedule}
      //                     onChange={(e) =>
      //                         setFormData((p) => ({ ...p, schedule: e.target.value }))
      //                     }
      //                 />
      //                 <button className="border rounded p-2" aria-label="음성 입력">
      //                     <Mic className="h-5 w-5" />
      //                 </button>
      //             </div>
      //         </div>
      //     );
      // case 8:
      //     return (
      //         <div className="space-y-4">
      //             <label className="block text-lg font-medium">
      //                 8. 시작시간, 휴무일, 끝나는 시간을 알려주세요.
      //             </label>
      //             <div className="grid grid-cols-2 gap-4">
      //                 <div className="flex flex-col gap-2">
      //                     <span className="text-sm">시작 시간</span>
      //                     <input
      //                         type="time"
      //                         className="border rounded px-3 py-2"
      //                         value={formData.startTime}
      //                         onChange={(e) =>
      //                             setFormData((p) => ({ ...p, startTime: e.target.value }))
      //                         }
      //                     />
      //                 </div>
      //                 <div className="flex flex-col gap-2">
      //                     <span className="text-sm">종료 시간</span>
      //                     <input
      //                         type="time"
      //                         className="border rounded px-3 py-2"
      //                         value={formData.endTime}
      //                         onChange={(e) =>
      //                             setFormData((p) => ({ ...p, endTime: e.target.value }))
      //                         }
      //                     />
      //                 </div>
      //             </div>
      //             <div className="flex flex-col gap-2">
      //                 <span className="text-sm">휴무일</span>
      //                 <div className="flex gap-2 items-center">
      //                     <input
      //                         placeholder="예: 매주 월요일, 화요일"
      //                         className="flex-1 border rounded px-3 py-2"
      //                         value={formData.closedDays}
      //                         onChange={(e) =>
      //                             setFormData((p) => ({ ...p, closedDays: e.target.value }))
      //                         }
      //                     />
      //                     <button className="border rounded p-2" aria-label="음성 입력">
      //                         <Mic className="h-5 w-5" />
      //                     </button>
      //                 </div>
      //             </div>
      //         </div>
      //     );
      case 6:
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium">
              6. 참가 인원 (최소/최대)은 몇 명인가요?
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
                    onChange={handleInputChange("minParticipants")}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd("minParticipants")}
                    inputMode="numeric"
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
                    onChange={handleInputChange("maxParticipants")}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd("maxParticipants")}
                    inputMode="numeric"
                  />
                  <button className="border rounded p-2" aria-label="음성 입력">
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium">
              7. 농장 이름을 알려주세요.
            </label>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <input
                  placeholder="농장명"
                  className="flex-1 border rounded px-3 py-2"
                  value={formData.farmName}
                  onChange={handleInputChange("farmName")}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd("farmName")}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button className="border rounded p-2" aria-label="음성 입력">
                  <Mic className="h-5 w-5" />
                </button>
              </div>
              {/* ... 그대로 유지된 주석 ... */}
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [
    currentStep,
    formData.experienceName,
    formData.location,
    formData.address,
    formData.relatedCrops,
    formData.participationFee,
    formData.minParticipants,
    formData.maxParticipants,
    formData.farmName,
  ]);

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
          {Step}

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
