import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles, RefreshCw, CheckCircle, Lightbulb, BarChart, Sprout, Phone,
} from "lucide-react";

type TabsData = {
    highlights: string[];
    considerations: string[];
    schedule: { time: string; activity: string }[];
};

type Rec =
    | { id: string; type: "analysis"; category: string; title: string; description: string; icon: React.ComponentType<{className?: string}>; tabs: TabsData }
    | { id: string; type: "program";  category: string; title: string; description: string; icon: React.ComponentType<{className?: string}>; tabs: TabsData };

const aiRecommendations: Rec[] = [
    {
        id: "market-analysis",
        type: "analysis",
        category: "시장 분석",
        title: "웰니스 관광 트렌드 분석",
        description:
            "최근 도시민들은 건강과 휴식을 동시에 추구하는 웰니스 관광에 대한 관심이 폭발적으로 증가하고 있습니다.",
        icon: BarChart,
        tabs: {
            highlights: [
                "코로나19 이후 건강 및 면역력 증진 관심 증대",
                "스트레스 해소 및 정신 건강 관리 수요 증가",
                "개별화되고 프라이빗한 소규모 체험 선호",
                "친환경, 지속 가능한 여행에 대한 가치 소비 확산",
            ],
            considerations: [
                "타겟 고객층(연령, 관심사) 명확화 필요",
                "경쟁 체험과의 차별화 전략 수립",
                "온라인 마케팅 및 예약 시스템 구축 중요",
                "안전 및 위생 관리 철저",
            ],
            schedule: [{ time: "N/A", activity: "시장 분석은 특정 일정이 없습니다." }],
        },
    },
    {
        id: "farm-analysis",
        type: "analysis",
        category: "농장 분석",
        title: "평창 감자 농장의 잠재력 분석",
        description:
            "평창 감자 농장은 청정한 자연환경과 풍부한 감자 생산량을 바탕으로 높은 체험 잠재력을 가지고 있습니다.",
        icon: Sprout,
        tabs: {
            highlights: [
                "우수한 품질의 평창 감자 생산",
                "아름다운 자연경관과 맑은 공기",
                "기존 농업 인프라 활용 가능성",
                "서울 및 수도권에서의 접근성 양호",
            ],
            considerations: [
                "계절성으로 인한 비수기 프로그램 개발 필요",
                "체험 시설 및 편의시설 확충 검토",
                "체험 운영 역량 강화 (교육 등)",
                "지역 관광 자원과의 연계 방안 모색",
            ],
            schedule: [{ time: "N/A", activity: "농장 분석은 특정 일정이 없습니다." }],
        },
    },
    {
        id: "program-1",
        type: "program",
        category: "추천 프로그램 1",
        title: "피부 힐링, 감자팩 만들기 🥔✨",
        description:
            "갓 수확한 신선한 감자로 나만의 천연 감자팩을 만들고, 자연의 영양을 피부에 선물하세요. 피부 진정, 보습에 탁월한 감자의 효능을 직접 경험하며 힐링하는 시간입니다.",
        icon: Lightbulb,
        tabs: {
            highlights: ["신선한 유기농 감자 사용", "피부 진정 및 보습 효과", "천연 재료로 직접 만드는 즐거움", "만든 감자팩 가져가기"],
            considerations: ["알레르기 유무 사전 확인", "위생적인 재료 준비 및 보관", "체험 후 피부 관리 안내", "소규모 그룹 체험으로 집중도 높이기"],
            schedule: [
                { time: "10:00", activity: "✅ 농장 도착 및 환영" },
                { time: "10:30", activity: "감자의 효능 및 감자팩 재료 소개" },
                { time: "11:00", activity: "🥔 나만의 감자팩 만들기 실습" },
                { time: "12:00", activity: "💆‍♀️ 감자팩 적용 및 휴식 (피부 힐링)" },
                { time: "12:30", activity: "🎁 만든 감자팩 포장 및 마무리" },
            ],
        },
    },
    {
        id: "program-2",
        type: "program",
        category: "추천 프로그램 2",
        title: "과학 놀이, 감자 배터리 실험 💡🥔",
        description:
            "감자로 전기를 만들 수 있을까요? 아이들과 함께 감자의 숨겨진 과학 원리를 탐구하고, 직접 감자 배터리를 만들어 작은 전구를 켜보는 신나는 과학 실험 체험입니다.",
        icon: Lightbulb,
        tabs: {
            highlights: ["감자의 과학적 원리 학습", "직접 만드는 감자 배터리", "전구 켜기 성공의 성취감", "창의력과 탐구력 증진"],
            considerations: ["안전한 실험 환경 조성", "연령별 맞춤 교육 내용 구성", "실험 재료의 충분한 확보", "결과물에 대한 설명 및 응용 방안 제시"],
            schedule: [
                { time: "14:00", activity: "✅ 농장 도착 및 환영" },
                { time: "14:30", activity: "감자 배터리 원리 설명 및 재료 소개" },
                { time: "15:00", activity: "🔬 감자 배터리 만들기 실습" },
                { time: "16:00", activity: "💡 감자 배터리로 전구 켜기 성공!" },
                { time: "16:30", activity: "👋 실험 마무리 및 질의응답" },
            ],
        },
    },
    {
        id: "program-3",
        type: "program",
        category: "추천 프로그램 3",
        title: "나만의 감성, 감자 에코백 만들기 🎨🛍️",
        description:
            "친환경 에코백에 감자 스탬프를 활용하여 세상에 하나뿐인 나만의 디자인을 만들어보세요. 환경 보호의 의미를 되새기며 예술적 감각을 발휘하는 즐거운 시간입니다.",
        icon: Lightbulb,
        tabs: {
            highlights: ["친환경 에코백 제작", "감자 스탬프 디자인의 독창성", "환경 보호 교육 병행", "실용적인 나만의 작품 소장"],
            considerations: ["다양한 크기와 색상의 에코백 준비", "물감 및 도구의 안전성 확인", "건조 시간 고려한 일정 배분", "단체 체험 시 공간 및 재료 충분히 확보"],
            schedule: [
                { time: "10:00", activity: "✅ 농장 도착 및 환영" },
                { time: "10:30", activity: "환경 보호 및 에코백의 중요성 교육" },
                { time: "11:00", activity: "🎨 감자 스탬프 디자인 및 에코백 제작" },
                { time: "12:00", activity: "📸 작품 감상 및 기념 촬영" },
                { time: "12:30", activity: "👋 체험 마무리 및 에코백 증정" },
            ],
        },
    },
];

const governmentSupportPrograms = [
    {
        title: "농림축산식품부 농촌융복합산업 지원사업",
        description:
            "농촌의 유무형 자원을 활용하여 1차(농업)과 2차(제조·가공), 3차(유통·관광) 산업을 연계하는 사업을 지원합니다.",
        contact: "044-123-4567",
        link: "#",
    },
    {
        title: "농촌진흥청 농업기술 지원사업",
        description:
            "새로운 농업 기술 개발 및 보급, 농업인 교육을 통해 농업 생산성 향상과 농가 소득 증대를 지원합니다.",
        contact: "063-123-4567",
        link: "#",
    },
    {
        title: "중소벤처기업부 소상공인 정책자금",
        description:
            "소상공인의 경영 안정 및 성장을 위한 저금리 대출, 컨설팅, 교육 등을 지원합니다.",
        contact: "1357",
        link: "#",
    },
];

// 간단 탭
function Tabs({ items }: { items: TabsData }) {
    const [tab, setTab] = useState<"highlights" | "considerations" | "schedule">("highlights");
    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-1 rounded bg-gray-100 p-1">
                {(["highlights", "considerations", "schedule"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-1.5 text-sm rounded ${tab === t ? "bg-white shadow" : "opacity-70"}`}
                    >
                        {t === "highlights" ? "주요 특징" : t === "considerations" ? "고려사항" : "일정"}
                    </button>
                ))}
            </div>

            <div className="pt-4 text-left">
                {tab === "highlights" && (
                    <ul className="space-y-2 text-sm">
                        {items.highlights.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {tab === "considerations" && (
                    <ul className="space-y-2 text-sm">
                        {items.considerations.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {tab === "schedule" && (
                    <>
                        {items.schedule.length > 0 && items.schedule[0].activity !== "N/A" ? (
                            <div className="space-y-2 text-sm">
                                {items.schedule.map((row, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 bg-secondary rounded">
                                        <span className="w-14 font-semibold">{row.time}</span>
                                        <span>{row.activity}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">해당 분석/추천에는 특정 일정이 없습니다.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function AiRecommendPage() {
    return (
        <div className="flex-1 container mx-auto py-8 px-4 md:px-6 text-center">
            <div className="space-y-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center justify-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    AI가 분석하고 추천하는 맞춤형 아이디어!
                </h1>
                <p className="text-muted-foreground md:text-lg">
                    시장 트렌드, 농장 특성 분석부터 최적의 프로그램 추천까지, AI가 당신의 성공을 돕습니다.
                </p>

                {/* 분석 카드 2개 */}
                <div className="grid gap-6 md:grid-cols-2">
                    {aiRecommendations.filter(r => r.type === "analysis").map((rec) => {
                        const Icon = rec.icon;
                        return (
                            <div key={rec.id} className="w-full text-left rounded border bg-white shadow-lg">
                                <div className="p-5 pb-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className="h-6 w-6 text-primary" />
                                        <div className="text-xl font-bold">{rec.category}</div>
                                    </div>
                                    <div className="text-base text-gray-700">{rec.title}</div>
                                </div>
                                <div className="px-5 text-sm text-gray-600">{rec.description}</div>
                                <div className="p-5 pt-3">
                                    <Tabs items={rec.tabs} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 추천 프로그램 (가로 스크롤) */}
                <div className="w-full">
                    <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="h-7 w-7 text-primary" />
                        AI 추천 프로그램
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm">← 좌우로 스와이프하여 다른 프로그램을 확인하세요 →</p>

                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-6 w-max">
                            {aiRecommendations.filter(r => r.type === "program").map((rec) => {
                                const Icon = rec.icon;
                                return (
                                    <div key={rec.id} className="flex flex-col w-80 flex-shrink-0 text-left rounded border bg-white shadow-lg">
                                        <div className="p-5 pb-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon className="h-7 w-7 text-primary" />
                                                <div className="text-xl font-bold line-clamp-2">{rec.title}</div>
                                            </div>
                                            <div className="text-base text-gray-600 line-clamp-3 whitespace-pre-line">{rec.description}</div>
                                        </div>
                                        <div className="px-5">
                                            <Tabs items={rec.tabs} />
                                        </div>
                                        <div className="p-5">
                                            <Link
                                                to={`/register/ai-generate?programId=${rec.id}`}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                프로그램 등록
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 정부지원사업 (가로 스크롤) */}
                <div className="w-full text-left mt-10">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="h-7 w-7 text-primary" />
                        정부지원사업 추천
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        AI 분석 결과와 연관된 정부지원사업을 확인하여 사업 추진에 도움을 받으세요.
                    </p>

                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-4 w-max">
                            {governmentSupportPrograms.map((p, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded border bg-white hover:shadow-md transition-shadow duration-200 flex flex-col justify-between w-80 flex-shrink-0"
                                >
                                    <div>
                                        <div className="text-lg font-semibold mb-2">{p.title}</div>
                                        <div className="text-sm text-gray-600 mb-3">{p.description}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <a href={p.link} className="px-3 py-1.5 rounded border text-sm inline-block text-center">자세히 보기</a>
                                        <button
                                            className="px-3 py-1.5 rounded text-sm inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                            onClick={() => alert(`문의: ${p.contact}`)}
                                        >
                                            <Phone className="h-4 w-4" />
                                            문의하기
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 다시 추천받기 */}
                <div className="flex justify-center mt-8">
                    <button
                        className="flex items-center gap-2 text-lg px-6 py-3 border rounded bg-transparent"
                        onClick={() => alert("새로운 아이디어 추천 요청!")}
                    >
                        <RefreshCw className="h-5 w-5" />
                        다시 추천받기
                    </button>
                </div>
            </div>
        </div>
    );
}
