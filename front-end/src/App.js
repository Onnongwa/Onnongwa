// src/App.tsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

// 코드 스플리팅 (lazy)
const HomePage = lazy(() => import("./pages/home/HomePage"));
const RegisterOptionsPage = lazy(() => import("./pages/register/RegisterOptionsPage"));

const RecommendOnboardingPage = lazy(
    () => import("./pages/register/recommend/onboarding/RecommendOnboardingPage")
);
const AiRecommendPage = lazy(() => import("./pages/register/recommend/AiRecommendPage"));

const GenerateOnboardingPage = lazy(
    () => import("./pages/register/generate/onboarding/GenerateOnboardingPage")
);
const AiGeneratePage = lazy(() => import("./pages/register/generate/AiGeneratePage"));

const ExperiencesPage = lazy(() => import("./pages/experience/ExperiencesPage"));
const ExperienceDetailPage = lazy(() => import("./pages/experience/ExperienceDetailPage"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));

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

                    {/* AI 추천 온보딩 → 정보 입력 */}
                    <Route
                        path="/register/ai-recommend/onboarding"
                        element={
                            <Layout header={{ title: "AI 체험 아이디어 추천", backTo: "/register" }}>
                                <RecommendOnboardingPage />
                            </Layout>
                        }
                    />

                    {/* AI 추천 결과 (결과 페이지) */}
                    <Route
                        path="/register/ai-recommend"
                        element={
                            <Layout header={{ title: "AI 추천 결과", backTo: "/register/ai-recommend/onboarding" }}>
                                <AiRecommendPage />
                            </Layout>
                        }
                    />
                    {/* 온보딩에서 이 경로로 이동한다면 동일 페이지로 라우팅 */}
                    <Route path="/register/ai-recommend/result" element={<Navigate to="/register/ai-recommend" replace />} />

                    {/* AI 홍보글 자동 생성 온보딩 → 정보 입력 */}
                    <Route
                        path="/register/onboarding"
                        element={
                            <Layout header={{ title: "AI 홍보글 자동 생성", backTo: "/register" }}>
                                <GenerateOnboardingPage />
                            </Layout>
                        }
                    />

                    {/* AI 홍보글 생성 결과/검토 */}
                    <Route
                        path="/register/ai-generate"
                        element={
                            <Layout header={{ title: "체험 등록 정보 확인", backTo: "/register/onboarding" }}>
                                <GenerateOnboardingPage />
                            </Layout>
                        }
                    />

                    {/* 체험 목록 / 상세 */}
                    <Route
                        path="/experiences"
                        element={
                            <Layout header={{ title: "체험 정보", backTo: "/" }}>
                                <ExperiencesPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/experiences/:id"
                        element={
                            <Layout header={{ title: "체험 상세", backTo: "/experiences" }}>
                                <ExperienceDetailPage />
                            </Layout>
                        }
                    />

                    {/* 인증 */}
                    <Route
                        path="/auth/login"
                        element={
                            <Layout header={{ title: "로그인", backTo: "/" }}>
                                <LoginPage />
                            </Layout>
                        }
                    />
                    <Route
                        path="/auth/signup"
                        element={
                            <Layout header={{ title: "회원가입", backTo: "/auth/login" }}>
                                <SignupPage />
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
