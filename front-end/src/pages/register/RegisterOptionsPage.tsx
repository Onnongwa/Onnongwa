// src/pages/register/RegisterOptionsPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, FileText } from "lucide-react";

export default function RegisterOptionsPage() {
    return (
        <div className="w-full flex flex-col items-center justify-center text-center py-8 px-4 md:px-6">
            <div className="space-y-8 max-w-xl w-full">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    어떤 방식으로 체험을 등록하시겠어요?
                </h1>

                <p className="text-muted-foreground md:text-lg">
                    AI의 도움을 받아 새로운 체험 아이디어를 얻거나, 직접 체험 정보를 입력하고
                    AI가 홍보글을 작성하도록 할 수 있습니다.
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* AI 추천 카드 */}
                    <div className="p-6 flex flex-col items-center text-center rounded border bg-white hover:shadow-lg transition-shadow duration-200">
                        <Sparkles className="h-12 w-12 text-primary mb-4" />
                        <div className="mb-2 text-xl font-semibold">AI 체험 아이디어 추천</div>
                        <p className="mb-4 text-sm text-muted-foreground">
                            간단한 정보 입력으로 AI가 새로운 체험 아이디어를 제안하고,
                            즉시 등록할 수 있도록 도와드립니다.
                        </p>
                        <Link
                            to="/register/ai-recommend"
                            className="w-full inline-block px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            AI 아이디어 받기
                        </Link>
                    </div>

                    {/* 직접/AI 등록 카드 */}
                    <div className="p-6 flex flex-col items-center text-center rounded border bg-white hover:shadow-lg transition-shadow duration-200">
                        <FileText className="h-12 w-12 text-primary mb-4" />
                        <div className="mb-2 text-xl font-semibold">AI / 직접 등록하기</div>
                        <p className="mb-4 text-sm text-muted-foreground">
                            기존 체험 정보를 입력하면 AI가 매력적인 홍보글을 자동으로 작성하여 등록을 돕습니다.
                        </p>
                        <Link
                            to="/register/onboarding"
                            className="w-full inline-block px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            직접 등록하기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
