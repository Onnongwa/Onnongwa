import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Search, Filter, Loader2 } from "lucide-react";

// 프론트엔드에서 사용할 데이터 타입
type Experience = {
    id: string;
    title: string;
    description: string;
    location: string;
    price: string;
    tags: string[];
    imageUrl: string;
    // --- API에 없는 데이터 ---
    duration: string; // 임시 데이터로 처리
};

// API 응답 객체 내부의 content 타입
type ApiExperience = {
    id: number;
    title: string;
    description: string;
    location: string;
    price: number;
    hashTag: string[];
    imageUrl: string;
};

// API 페이징 응답 전체 타입
type ApiResponse = {
    content: ApiExperience[];
    totalPages: number;
    totalElements: number;
    number: number; // 현재 페이지 (0부터 시작)
};

const API_BASE_URL = "http://localhost:8080/api/v1/experience/search";

export default function ExperiencesPage() {
    // 1. 상태 관리 변경
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1); // 페이지는 1부터 시작
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const perPage = 5; // 한 페이지에 보여줄 아이템 수 (백엔드와 협의 필요)

    // 2. API 호출 로직 (useEffect)
    useEffect(() => {
        const fetchExperiences = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // URL 쿼리 파라미터 생성
                const params = new URLSearchParams();
                if (search) {
                    params.append("keyword", search);
                }
                params.append("page", (page - 1).toString()); // API는 0-based page
                params.append("size", perPage.toString());

                const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }

                const data: ApiResponse = await response.json();

                // 3. 데이터 매핑 (API 응답 -> 프론트엔드 타입)
                const mappedData: Experience[] = data.content.map((item) => ({
                    id: item.id.toString(),
                    title: item.title,
                    description: item.description,
                    location: item.location,
                    price: `${item.price.toLocaleString()}원`,
                    tags: item.hashTag,
                    imageUrl: item.imageUrl,
                    duration: "정보 없음", // API에 duration 정보가 없으므로 임시 처리
                }));

                setExperiences(mappedData);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperiences();
    }, [search, page]); // 검색어 또는 페이지가 변경될 때마다 API 호출

    const resetFilters = () => {
        setSearch("");
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
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="키워드로 검색하세요"
                                className="w-full pl-10 border rounded px-3 py-2"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // 검색 시 첫 페이지로
                                }}
                            />
                        </div>
                    </div>

                    {search && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="w-full inline-flex items-center justify-center gap-2 border rounded px-3 py-2"
                        >
                            <Filter className="h-4 w-4" />
                            검색 초기화
                        </button>
                    )}
                </div>

                {/* 개수 표시 */}
                <div className="text-sm text-gray-500 text-center">
                    총 <span className="font-semibold text-primary">{totalElements}</span>개의 체험이 있습니다
                    {totalPages > 1 && (
                        <span className="ml-2">
                            (페이지 {page} / {totalPages})
                        </span>
                    )}
                </div>

                {/* 목록 */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : experiences.length > 0 ? (
                        experiences.map((e) => (
                            // ... 기존 JSX 구조와 동일 ...
                            // key={e.id}, Link to={`/experiences/${e.id}`} 등 그대로 사용
                            <div
                                key={e.id}
                                className="overflow-hidden rounded border bg-white hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex">
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={e.imageUrl || "/placeholder.svg"}
                                            alt={e.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-3">
                                        <div className="pb-2">
                                            <div className="text-base font-bold line-clamp-2 leading-tight">{e.title}</div>
                                            <div className="text-sm text-gray-600 line-clamp-2">{e.description}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {e.tags.slice(0, 3).map((t, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">{t}</span>
                                            ))}
                                            {e.tags.length > 3 && <span className="text-xs text-gray-500 px-2 py-0.5">+{e.tags.length - 3}</span>}
                                        </div>
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
                                        <Link to={`/experiences/${e.id}`} className="block w-full mt-2 text-center rounded bg-primary text-white py-2">
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
                            <p className="text-sm text-gray-500 mb-4">다른 키워드를 시도해보세요</p>
                        </div>
                    )}
                </div>


                {/* 페이징 */}
                {!isLoading && totalPages > 1 && (
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