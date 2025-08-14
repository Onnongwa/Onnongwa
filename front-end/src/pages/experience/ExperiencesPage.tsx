// src/pages/experience/ExperiencesPage.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Search, Filter } from "lucide-react";

type Experience = {
    id: string;
    title: string;
    description: string;
    location: string;
    region: string;       // 지역 (강원도, 경기도 등)
    price: string;
    duration: string;
    category: string;     // 농촌체험, 어촌체험, 공예체험, 힐링체험 등
    tags: string[];
    imageUrl: string;
};

const ALL_EXPERIENCES: Experience[] = [
    {
        id: "potato-farm",
        title: "땅속 보물 찾기, 아이와 함께하는 감자 명상 🍠",
        description:
            "흙 내음 가득한 밭에서 직접 감자를 캐며 자연과 교감하는 시간. 아이들에게는 신나는 모험을, 어른들에게는 평화로운 휴식을 선사합니다.",
        location: "강원도 평창",
        region: "강원도",
        price: "50,000원",
        duration: "약 3시간",
        category: "농촌체험",
        tags: ["#감자캐기", "#가족여행", "#농촌체험", "#힐링"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "clam-digging",
        title: "바다의 보물, 갯벌에서 찾다",
        description:
            "드넓은 갯벌에서 신선한 조개를 직접 캐는 이색 체험. 자연의 신비와 수확의 기쁨을 동시에 느껴보세요.",
        location: "충청남도 태안",
        region: "충청남도",
        price: "35,000원",
        duration: "약 2시간",
        category: "어촌체험",
        tags: ["#갯벌체험", "#조개잡이", "#바다여행", "#자연학습"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "hanji-craft",
        title: "한지에 담는 한국의 미",
        description:
            "전통 한지의 아름다움을 배우고 나만의 작품을 만드는 시간. 고즈넉한 한옥에서 예술적 감각을 깨워보세요.",
        location: "전라북도 전주",
        region: "전라북도",
        price: "40,000원",
        duration: "약 2.5시간",
        category: "공예체험",
        tags: ["#한지공예", "#전통문화", "#공예체험", "#전주여행"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "forest-healing",
        title: "숲속 힐링 명상 & 차담 체험 🧘‍♀️🍵",
        description:
            "바쁜 일상에 지친 당신을 위한 완벽한 휴식! 고요한 숲속에서 자연의 소리를 들으며 깊은 명상에 잠기고, 향긋한 전통차와 함께 마음을 나누는 시간.",
        location: "경기도 가평",
        region: "경기도",
        price: "45,000원",
        duration: "약 2시간",
        category: "힐링체험",
        tags: ["#숲속명상", "#차담", "#힐링체험", "#자연치유"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "strawberry-picking",
        title: "달콤한 봄날, 딸기 따기 체험 🍓",
        description:
            "빨갛게 익은 달콤한 딸기를 직접 따며 봄의 향기를 만끽하세요. 갓 딴 딸기로 만든 잼 만들기 체험도 함께!",
        location: "경기도 양평",
        region: "경기도",
        price: "30,000원",
        duration: "약 2.5시간",
        category: "농촌체험",
        tags: ["#딸기따기", "#봄체험", "#잼만들기", "#가족체험"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "pottery-making",
        title: "흙과 함께하는 도자기 만들기",
        description:
            "전통 도예 기법을 배우며 나만의 도자기를 만들어보세요. 완성된 작품은 구워서 택배로 보내드립니다.",
        location: "경상북도 경주",
        region: "경상북도",
        price: "55,000원",
        duration: "약 3시간",
        category: "공예체험",
        tags: ["#도자기", "#전통공예", "#핸드메이드", "#경주여행"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "rice-planting",
        title: "논에서 만나는 우리 쌀 이야기",
        description:
            "직접 모내기를 체험하고 우리 쌀의 소중함을 배워보세요. 전통 농기구 체험과 농촌 점심 식사도 포함!",
        location: "전라남도 나주",
        region: "전라남도",
        price: "25,000원",
        duration: "약 4시간",
        category: "농촌체험",
        tags: ["#모내기", "#쌀체험", "#농촌생활", "#전통농업"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "seaweed-harvesting",
        title: "바다 농부가 되어보자! 미역 채취 체험",
        description:
            "새벽 바다에서 미역을 직접 채취하고 가공하는 과정을 체험해보세요. 신선한 해산물 시식도 함께!",
        location: "제주도 서귀포",
        region: "제주도",
        price: "60,000원",
        duration: "약 3.5시간",
        category: "어촌체험",
        tags: ["#미역채취", "#제주바다", "#해녀체험", "#해산물"],
        imageUrl: "/placeholder.svg?height=200&width=300",
    },
];

export default function ExperiencesPage() {
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("전체 지역");
    const [category, setCategory] = useState("전체 카테고리");
    const [page, setPage] = useState(1);
    const perPage = 5;

    const regions = useMemo(
        () => Array.from(new Set(ALL_EXPERIENCES.map((e) => e.region))),
        []
    );
    const categories = useMemo(
        () => Array.from(new Set(ALL_EXPERIENCES.map((e) => e.category))),
        []
    );

    const filtered = useMemo(() => {
        return ALL_EXPERIENCES.filter((e) => {
            const matchesSearch =
                !search ||
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase());
            const matchesRegion = region === "전체 지역" || e.region === region;
            const matchesCategory =
                category === "전체 카테고리" || e.category === category;
            return matchesSearch && matchesRegion && matchesCategory;
        });
    }, [search, region, category]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const resetFilters = () => {
        setSearch("");
        setRegion("전체 지역");
        setCategory("전체 카테고리");
        setPage(1);
    };

    return (
        <main className="container mx-auto py-6 px-4 md:px-6">
            <div className="space-y-6 max-w-2xl mx-auto">
                {/* 제목 */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">체험 정보</h1>
                    <p className="text-muted-foreground">다양한 농어촌 체험을 찾아보고 예약하세요</p>
                </div>

                {/* 검색/필터 */}
                <div className="space-y-4">
                    {/* 검색창 */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="체험명이나 키워드로 검색하세요"
                                className="w-full pl-10 border rounded px-3 py-2"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    {/* 필터 */}
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            className="border rounded px-3 py-2"
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="전체 지역">전체 지역</option>
                            {regions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border rounded px-3 py-2"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="전체 카테고리">전체 카테고리</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(search || region !== "전체 지역" || category !== "전체 카테고리") && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="w-full inline-flex items-center justify-center gap-2 border rounded px-3 py-2"
                        >
                            <Filter className="h-4 w-4" />
                            필터 초기화
                        </button>
                    )}
                </div>

                {/* 개수 표시 */}
                <div className="text-sm text-gray-500 text-center">
                    총 <span className="font-semibold text-primary">{filtered.length}</span>개의 체험이 있습니다
                    {totalPages > 1 && (
                        <span className="ml-2">
              (페이지 {page} / {totalPages})
            </span>
                    )}
                </div>

                {/* 목록 */}
                <div className="space-y-4">
                    {current.length > 0 ? (
                        current.map((e) => (
                            <div
                                key={e.id}
                                className="overflow-hidden rounded border bg-white hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex">
                                    {/* 이미지 */}
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={e.imageUrl || "/placeholder.svg"}
                                            alt={e.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* 내용 */}
                                    <div className="flex-1 p-3">
                                        <div className="pb-2">
                                            <div className="text-base font-bold line-clamp-2 leading-tight">
                                                {e.title}
                                            </div>
                                            <div className="text-sm text-gray-600 line-clamp-2">
                                                {e.description}
                                            </div>
                                        </div>

                                        {/* 태그 */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {e.tags.slice(0, 3).map((t, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                                                >
                          {t}
                        </span>
                                            ))}
                                            {e.tags.length > 3 && (
                                                <span className="text-xs text-gray-500 px-2 py-0.5">
                          +{e.tags.length - 3}
                        </span>
                                            )}
                                        </div>

                                        {/* 메타 */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{e.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{e.duration}</span>
                                                </div>
                                            </div>
                                            <div className="text-base font-bold text-primary">{e.price}</div>
                                        </div>

                                        {/* 버튼 */}
                                        <Link
                                            to={`/experiences/${e.id}`}
                                            className="block w-full mt-2 text-center rounded bg-primary text-white py-2"
                                        >
                                            자세히 보기
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                            <p className="text-lg font-medium">검색 결과가 없습니다</p>
                            <p className="text-sm text-gray-500 mb-4">다른 검색어나 필터를 시도해보세요</p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="border rounded px-4 py-2"
                            >
                                전체 체험 보기
                            </button>
                        </div>
                    )}
                </div>

                {/* 페이징 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            type="button"
                            className="border rounded px-3 py-1.5 text-sm disabled:opacity-50"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`border rounded px-3 py-1.5 text-sm ${
                                    page === p ? "bg-primary text-white" : ""
                                }`}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="border rounded px-3 py-1.5 text-sm disabled:opacity-50"
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
