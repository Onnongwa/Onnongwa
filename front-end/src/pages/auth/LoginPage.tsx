import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE = "http://localhost:8080/api/v1"

    const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // 
                body: JSON.stringify({ email, password }),        // (LoginDTO 필드명과 일치)
                credentials: "include",                            // (JSESSIONID 쿠키 수신)
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "로그인 실패");
            }

            const data = await res.json(); // {id,email,role}
            
            localStorage.setItem("user", JSON.stringify(data));

            alert("로그인 성공!");
            navigate("/");
        } catch {
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 container mx-auto py-8 px-4 md:px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">로그인</h1>
                    <p className="text-muted-foreground">브라보 농어촌 라이프에 오신 것을 환영합니다</p>
                </div>

                <div className="w-full rounded border bg-white shadow-sm">
                    <div className="p-6 border-b text-center space-y-1">
                        <div className="text-2xl font-semibold">계정에 로그인</div>
                        <div className="text-sm text-gray-600">이메일과 비밀번호를 입력해주세요</div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* 이메일 */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">이메일</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border rounded px-10 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border rounded px-10 py-2 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                        onClick={() => setShowPassword((s) => !s)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            {/* 링크 */}
                            <div className="flex items-center justify-between">
                                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </div>

                            {/* 제출 */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
                            >
                                {isLoading ? "로그인 중..." : "로그인"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">계정이 없으신가요? </span>
                            <Link to="/auth/signup" className="text-primary hover:underline">
                                회원가입
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
