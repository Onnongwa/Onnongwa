// src/App.tsx (JS 쓰면 App.js로, 내용 동일)
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

// 코드 스플리팅
const HomePage = lazy(() => import("./pages/home/HomePage"));
const RegisterOptionsPage = lazy(() => import("./pages/register/RegisterOptionsPage"));
const AiRecommendPage = lazy(() => import("./pages/register/recommend/AiRecommendPage"));
const GenerateOnboardingPage = lazy(() => import("./pages/register/GenerateOnboardingPage"));
const AiGeneratePage = lazy(() => import("./pages/register/generate/AiGeneratePage"));
const ExperienceDetailPage = lazy(() => import("./pages/experience/ExperienceDetailPage"));

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div className="p-6">로딩 중...</div>}>
                <Routes>
                    {/* 홈 */}
                    <Route
                        path="/"
                        element={
                            <Layout header={{ title: "브라보 농어촌 라이프" }}>
                                <HomePage />
                            </Layout>
                        }
                    />

                    {/* 등록 플로우 */}
                    <Route
                        path="/register"
                        element={
                            <Layout header={{ title: "체험등록", backTo: "/" }}>
                                <RegisterOptionsPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/register/ai-recommend"
                        element={
                            <Layout header={{ title: "AI 추천 결과", backTo: "/register" }}>
                                <AiRecommendPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/register/onboarding"
                        element={
                            <Layout header={{ title: "AI 홍보글 자동 생성", backTo: "/register" }}>
                                <GenerateOnboardingPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/register/ai-generate"
                        element={
                            <Layout header={{ title: "체험 등록 정보 확인", backTo: "/register/onboarding" }}>
                                <AiGeneratePage />
                            </Layout>
                        }
                    />

                    {/* 체험 상세 */}
                    <Route
                        path="/experiences/:id"
                        element={
                            <Layout header={{ title: "체험 상세", backTo: "/" }}>
                                <ExperienceDetailPage />
                            </Layout>
                        }
                    />

                    {/* 404 */}
                    <Route
                        path="*"
                        element={
                            <Layout header={{ title: "페이지를 찾을 수 없어요", backTo: "/" }}>
                                <div className="p-6">요청하신 페이지가 존재하지 않습니다.</div>
                            </Layout>
                        }
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
