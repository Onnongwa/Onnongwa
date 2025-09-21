// src/pages/home/HomePage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Leaf, Users, Sparkles } from "lucide-react";

const API_BASE = "http://localhost:8080/api/v1/experience";

interface ExpListDto {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    location: string;
    price: number;
    hashTag: string[];
}

export default function HomePage() {
    const [experiences, setExperiences] = useState<ExpListDto[]>([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/popular`)
            .then((res) => res.json())
            .then((data) => setExperiences(data))
            .catch((err) => console.error("체험 불러오기 실패:", err));
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/experiences?keyword=${encodeURIComponent(query.trim())}`);
        } else {
            navigate("/experiences");
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex flex-col items-center justify-center text-center px-4">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                        자연에서 찾는 나만의 저속노화 라이프
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                        다양한 농어촌 체험으로 몸과 마음을 힐링하고, 새로운 활력을 찾아보세요.
                    </p>

                    <div className="w-full max-w-md mx-auto flex gap-2">
                        <input
                            type="search"
                            placeholder="어떤 체험을 찾으시나요?"
                            className="flex-1 bg-primary-foreground text-foreground px-3 py-2 rounded border border-gray-200"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />

                        <button
                            type="button"
                            className="px-3 py-2 rounded bg-secondary text-secondary-foreground border"
                            onClick={handleSearch}
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">검색</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4">
                <div className="container mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            이달의 추천 체험
                        </h2>
                        <p className="text-muted-foreground md:text-xl">
                            지금 가장 인기 있는 농어촌 체험 프로그램들을 만나보세요.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {experiences.map((c, i) => (
                            <div
                                key={i}
                                className="flex flex-col rounded border bg-white shadow-sm h-full"
                            >
                                <img
                                    src={c.imageUrl}
                                    alt={`${c.title} 이미지`}
                                    className="aspect-video object-cover rounded-t"
                                />
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-semibold text-lg truncate">{c.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {c.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground my-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                        {c.location}
                    </span>
                                        <span>{c.price.toLocaleString()}원</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-3">
                                        {c.hashTag.join(" ")}
                                    </div>
                                    <Link
                                        className="block w-full text-center px-3 py-2 rounded bg-primary text-primary-foreground mt-auto"
                                        to={`/experiences/${c.id}`}
                                    >
                                        자세히 보기
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary px-4">
                <div className="container mx-auto space-y-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        브라보 농어촌 라이프, 어떻게 작동하나요?
                    </h2>
                    <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                        디지털에 익숙하지 않은 농어촌민도, 다양한 체험을 찾는 도시민도 모두를
                        위한 쉽고 편리한 플랫폼입니다.
                    </p>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="p-6 flex flex-col items-center text-center rounded border bg-white">
                            <Sparkles className="h-12 w-12 text-primary mb-4" />
                            <h3 className="font-semibold mb-2">AI 홍보글 자동 생성</h3>
                            <p className="text-sm text-muted-foreground">
                                최소한의 정보만 입력하면 AI가 매력적인 체험 소개글을 자동으로
                                작성해드립니다.
                            </p>
                        </div>
                        <div className="p-6 flex flex-col items-center text-center rounded border bg-white">
                            <Leaf className="h-12 w-12 text-primary mb-4" />
                            <h3 className="font-semibold mb-2">해시태그 기반 큐레이션</h3>
                            <p className="text-sm text-muted-foreground">
                                다양한 해시태그와 검색 기능을 통해 원하는 체험을 쉽고 빠르게
                                찾아보세요.
                            </p>
                        </div>
                        <div className="p-6 flex flex-col items-center text-center rounded border bg-white">
                            <Users className="h-12 w-12 text-primary mb-4" />
                            <h3 className="font-semibold mb-2">도농 상생 O2O</h3>
                            <p className="text-sm text-muted-foreground">
                                온라인에서 쉽게 정보를 얻고 예약하여 오프라인 체험으로 이어지는
                                상생 구조를 만듭니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex flex-col items-center justify-center text-center px-4">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        농어촌민이신가요? 당신의 삶을 공유하고 수익을 창출하세요!
                    </h2>
                    <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                        복잡한 기술 없이도 당신의 소중한 자원과 프로그램을 도시민에게 알릴
                        수 있습니다.
                    </p>
                    <Link
                        className="inline-block px-4 py-2 rounded bg-primary-foreground text-primary"
                        to="/register"
                    >
                        지금 바로 체험 등록하기
                    </Link>
                </div>
            </section>
        </>
    );
}
