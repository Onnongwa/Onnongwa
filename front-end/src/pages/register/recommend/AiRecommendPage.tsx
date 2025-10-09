import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Sparkles,
    RefreshCw,
    CheckCircle,
    Lightbulb,
    BarChart,
    Sprout,
    Phone,
    } from "lucide-react";

    // RecommendDTO 타입 정의 (백엔드 응답 구조 맞춤)
    type RecommendDTO = {
    marketComment: {
        summary: string;
        insight: string[];
        consideration: string[];
        caution: string[];
    };
    farmComment: {
        summary: string;
        strength: string[];
        improvement: string[];
        risk: string[];
    };
    item: string;
    purpose: string;
    requirement: string;
    programs: {
        title: string;
        description: string;
        totalTime: number;
        price: number;
        schedule: string[];
        features: string[];
        considerations: string[];
        locationType: string;
    }[];
    };

    // 탭 컴포넌트
    function Tabs({
    highlights,
    considerations,
    schedule,
    }: {
    highlights: string[];
    considerations: string[];
    schedule: string[];
    }) {
    const [tab, setTab] = useState<"highlights" | "considerations" | "schedule">(
        "highlights"
    );

    return (
        <div className="w-full">
        <div className="grid grid-cols-2 gap-1 rounded bg-gray-100 p-1">
            {(["highlights", "considerations"] as const).map((t) => (
            <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-sm rounded ${
                tab === t ? "bg-white shadow" : "opacity-70"
                }`}
            >
                {t === "highlights"
                ? "주요 특징"
                : "고려사항"
                }
            </button>
            ))}
        </div>

        <div className="pt-4 text-left">
            {tab === "highlights" && (
            <ul className="space-y-2 text-sm">
                {highlights.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>{s}</span>
                </li>
                ))}
            </ul>
            )}
            {tab === "considerations" && (
            <ul className="space-y-2 text-sm">
                {considerations.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>{s}</span>
                </li>
                ))}
            </ul>
            )}
            {tab === "schedule" && (
            <div className="space-y-2 text-sm">
                {schedule.length > 0 ? (
                schedule.map((row, i) => (
                    <div
                    key={i}
                    className="flex items-start gap-3 p-2 bg-secondary rounded"
                    >
                    <span className="w-14 font-semibold">
                        {row.split(" ")[0]}
                    </span>
                    <span>{row.split(" ").slice(1).join(" ")}</span>
                    </div>
                ))
                ) : (
                <p className="text-sm text-gray-500">
                    해당 분석/추천에는 특정 일정이 없습니다.
                </p>
                )}
            </div>
            )}
        </div>
        </div>
    );
}

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

export default function AiRecommendPage() {
    const location = useLocation();
    const dto = location.state?.dto as RecommendDTO | undefined;

    if (!dto) {
        return (
        <div className="text-center py-20">
            <p className="text-lg">추천 결과가 없습니다. 😢</p>
            <Link
            to="/register/onboarding"
            className="mt-4 inline-block px-4 py-2 rounded bg-primary text-primary-foreground"
            >
            다시 시도하기
            </Link>
        </div>
        );
    }

    return (
    <div className="flex-1 container mx-auto py-8 px-4 md:px-6 text-center">
        <div className="space-y-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI가 분석하고 추천하는 맞춤형 아이디어!
            </h1>
            <p className="text-muted-foreground md:text-lg">
            시장 트렌드, 농장 특성 분석부터 최적의 프로그램 추천까지, AI가 당신의
            성공을 돕습니다.
            </p>

            {/* 분석 카드 2개 */}
            <div className="grid gap-6 md:grid-cols-2">
            {/* 시장 분석 */}
            <div className="w-full text-left rounded border bg-white shadow-lg">
                <div className="p-5 pb-3 flex items-center gap-3 mb-2">
                <BarChart className="h-6 w-6 text-primary" />
                <div className="text-xl font-bold">시장 분석</div>
                </div>
                <div className="px-5 text-base text-gray-700">{dto.marketComment.summary}</div>
                <div className="p-5 pt-3">
                <Tabs
                    highlights={dto.marketComment.insight}
                    considerations={[...dto.marketComment.consideration, ...dto.marketComment.caution]}
                    schedule={[]}
                />
                </div>
            </div>

            {/* 농장 분석 */}
            <div className="w-full text-left rounded border bg-white shadow-lg">
                <div className="p-5 pb-3 flex items-center gap-3 mb-2">
                <Sprout className="h-6 w-6 text-primary" />
                <div className="text-xl font-bold">농장 분석</div>
                </div>
                <div className="px-5 text-base text-gray-700">{dto.farmComment.summary}</div>
                <div className="p-5 pt-3">
                <Tabs
                    highlights={dto.farmComment.strength}
                    considerations={[...dto.farmComment.improvement, ...dto.farmComment.risk]}
                    schedule={[]}
                />
                </div>
            </div>
            </div>

            {/* 추천 프로그램 */}
            <div className="w-full">
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-7 w-7 text-primary" />
                AI 추천 프로그램
            </h2>
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 w-max">
                {dto.programs.map((p, idx) => (
                    <div
                    key={idx}
                    className="flex flex-col w-80 flex-shrink-0 text-left rounded border bg-white shadow-lg"
                    >
                    <div className="p-5 pb-3">
                        <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="h-7 w-7 text-primary" />
                        <div className="text-xl font-bold line-clamp-2">{p.title}</div>
                        </div>
                        <div className="text-base text-gray-600 line-clamp-3 whitespace-pre-line">
                        {p.description}
                        </div>
                    </div>
                    <div className="px-5">
                        <Tabs
                        highlights={p.features}
                        considerations={p.considerations}
                        schedule={p.schedule}
                        />
                    </div>
                    <div className="p-5">
                        <Link
                        to={`/register/ai-generate?programId=${idx}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
                        >
                        <CheckCircle className="h-5 w-5" />
                        프로그램 등록
                        </Link>
                    </div>
                    </div>
                ))}
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
                <Link
                    to="/register/onboarding"
                    className="flex items-center gap-2 text-lg px-6 py-3 border rounded bg-transparent"
                >
                    <RefreshCw className="h-5 w-5" />
                    다시 추천받기
                </Link>
                </div>
            </div>
        </div>
    );
}
