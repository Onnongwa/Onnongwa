import React from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

type LayoutProps = {
    children: React.ReactNode;
    header?: React.ComponentProps<typeof SiteHeader>; // title, backTo, nav
    /** 메인 영역에 컨테이너/패딩을 적용할지 (기본 true) */
    withContainer?: boolean;
};

export default function Layout({ children, header, withContainer = true }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader {...header} />
            <main className={`flex-1 ${withContainer ? "container mx-auto py-8 px-4 md:px-6" : ""}`}>
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
