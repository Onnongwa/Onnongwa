import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";

export default function SignupPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "user" as "user" | "farmer",
        password: "",
        confirmPassword: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (key: keyof typeof form, val: string) =>
        setForm((p) => ({ ...p, [key]: val }));

    const handleSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (form.password.length < 6) {
            alert("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        setIsLoading(true);
        try {
            // TODO: 실제 회원가입 API 연동
            await new Promise((r) => setTimeout(r, 1200));
            alert("회원가입이 완료되었습니다! 로그인 해주세요.");
            navigate("/auth/login");
        } catch {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 container mx-auto py-8 px-4 md:px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">회원가입</h1>
                    <p className="text-muted-foreground">
                        브라보 농어촌 라이프에 가입하여 다양한 체험을 즐겨보세요
                    </p>
                </div>

                <div className="w-full rounded border bg-white shadow-sm">
                    <div className="p-6 border-b text-center space-y-1">
                        <div className="text-2xl font-semibold">새 계정 만들기</div>
                        <div className="text-sm text-gray-600">
                            아래 정보를 입력하여 계정을 생성하세요
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* 이름 */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">이름</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="홍길동"
                                        value={form.name}
                                        onChange={(e) => onChange("name", e.target.value)}
                                        className="w-full border rounded px-10 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 이메일 */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">이메일</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={form.email}
                                        onChange={(e) => onChange("email", e.target.value)}
                                        className="w-full border rounded px-10 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 전화번호 */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">전화번호</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        value={form.phone}
                                        onChange={(e) => onChange("phone", e.target.value)}
                                        className="w-full border rounded px-10 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 회원 유형 */}
                            <div className="space-y-2">
                                <div className="text-sm font-medium">회원 유형</div>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={form.role === "user"}
                                            onChange={() => onChange("role", "user")}
                                        />
                                        <div>
                                            <div className="font-medium">일반 회원</div>
                                            <div className="text-sm text-gray-600">
                                                농어촌 체험을 찾고 예약하는 일반 사용자
                                            </div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="farmer"
                                            checked={form.role === "farmer"}
                                            onChange={() => onChange("role", "farmer")}
                                        />
                                        <div>
                                            <div className="font-medium">농장주</div>
                                            <div className="text-sm text-gray-600">
                                                체험 프로그램을 등록하고 운영하는 농장주
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        placeholder="최소 6자 이상"
                                        value={form.password}
                                        onChange={(e) => onChange("password", e.target.value)}
                                        className="w-full border rounded px-10 py-2 pr-12"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        onClick={() => setShowPw((s) => !s)}
                                        aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    >
                                        {showPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            {/* 비밀번호 확인 */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">비밀번호 확인</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type={showPw2 ? "text" : "password"}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        value={form.confirmPassword}
                                        onChange={(e) => onChange("confirmPassword", e.target.value)}
                                        className="w-full border rounded px-10 py-2 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        onClick={() => setShowPw2((s) => !s)}
                                        aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    >
                                        {showPw2 ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "가입 중..." : "회원가입"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">이미 계정이 있으신가요? </span>
                            <Link to="/auth/login" className="text-primary hover:underline">
                                로그인
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
