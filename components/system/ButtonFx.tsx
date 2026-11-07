"use client";

import { useEffect } from "react";

/* One delegated listener pair for every .btn on the site. It records where
   the pointer crossed the button's edge in --bx/--by: the fill grows from
   the entry point and, on leave, drains toward the exit point. */

function setOrigin(btn: HTMLElement, e: PointerEvent) {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty("--bx", `${e.clientX - r.left}px`);
    btn.style.setProperty("--by", `${e.clientY - r.top}px`);
}

function handle(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const target = e.target as Element | null;
    const btn = target?.closest?.(".btn") as HTMLElement | null;
    if (!btn) return;
    const other = e.relatedTarget as Node | null;
    if (other && btn.contains(other)) return;
    setOrigin(btn, e);
}

export default function ButtonFx() {
    useEffect(() => {
        document.addEventListener("pointerover", handle, { passive: true });
        document.addEventListener("pointerout", handle, { passive: true });
        return () => {
            document.removeEventListener("pointerover", handle);
            document.removeEventListener("pointerout", handle);
        };
    }, []);
    return null;
}
