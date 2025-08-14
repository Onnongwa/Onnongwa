import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type NavItem = { label: string; to: string; external?: boolean };

const defaultNav: NavItem[] = [
    { label: "체험등록", to: "/register" },
    { label: "체험정보", to: "#" },
    { label: "지도보기", to: "/map" },
    { label: "로그인", to: "#" },
];

type Props = {
    /** 헤더 좌측 타이틀 */
    title?: string;
    /** 뒤로가기/좌측 링크 (없으면 화살표 숨김) */
    backTo?: string;
    /** 오른쪽 네비 아이템 */
    nav?: NavItem[];
};

export default function SiteHeader({ title = "브라보 농어촌 라이프", backTo, nav = defaultNav }: Props) {
    return (
        <header className="sticky top-0 z-40 w-full bg-white text-primary shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 text-xl font-bold">
                    {backTo && (
                        <Link to={backTo} className="inline-flex" aria-label="뒤로가기">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    )}
                    <Link to="/" className="hover:opacity-80">{title}</Link>
                </div>
                <nav className="flex gap-4 text-sm">
                    {nav.map((n, i) =>
                        n.external ? (
                            <a key={i} href={n.to} className="font-medium hover:underline underline-offset-4" rel="noreferrer">
                                {n.label}
                            </a>
                        ) : (
                            <Link key={i} to={n.to} className="font-medium hover:underline underline-offset-4">
                                {n.label}
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </header>
    );
}
