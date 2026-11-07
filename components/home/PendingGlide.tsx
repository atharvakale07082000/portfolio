"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { glideTo, peekPendingSection, takePendingSection } from "@/lib/menu";
import { whenBootDone } from "@/lib/boot";

/* When the menu sends a reader here from another route, glide to the
   section they chose — but only once the loader has released the page. */
export default function PendingGlide() {
    const lenis = useLenis();
    useEffect(() => {
        if (!lenis || !peekPendingSection()) return;
        let cancelled = false;
        let raf = 0;
        let timer = 0;
        void whenBootDone().then(() => {
            // Let the router finish its own scroll-to-top before gliding.
            timer = window.setTimeout(() => {
                raf = requestAnimationFrame(() => {
                    if (cancelled) return;
                    const id = takePendingSection();
                    if (id) glideTo(lenis, id);
                });
            }, 150);
        });
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            cancelAnimationFrame(raf);
        };
    }, [lenis]);
    return null;
}
