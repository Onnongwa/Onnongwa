import React from "react";

export default function SiteFooter() {
    return (
        <footer className="w-full py-6 bg-muted text-muted-foreground text-center text-sm">
            <div className="container mx-auto px-4 md:px-6">
                &copy; {new Date().getFullYear()} 브라보 농어촌 라이프. All rights reserved.
            </div>
        </footer>
    );
}
