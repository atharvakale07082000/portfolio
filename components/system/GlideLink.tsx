"use client";

import { useLenis } from "lenis/react";
import { glideTo } from "@/lib/menu";

/** In-page link that glides with Lenis. The href keeps it working without JS. */
export default function GlideLink({
    to,
    className = "",
    children,
}: {
    to: string;
    className?: string;
    children: React.ReactNode;
}) {
    const lenis = useLenis();
    return (
        <a
            href={`#${to}`}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                glideTo(lenis, to);
            }}
        >
            {children}
        </a>
    );
}
