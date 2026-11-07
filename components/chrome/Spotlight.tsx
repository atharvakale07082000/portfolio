"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useRef } from "react";


/* The giant wordmark. A soft spotlight follows the pointer across it: the
   base text is barely there, a lit copy is revealed through a radial mask
   whose centre is two CSS variables, written at most once per frame. */

let frame = 0;
function follow(el: HTMLElement, x: number, y: number) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
    });
}

export default function Spotlight({ text }: { text: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    const svg = (className: string) => (
        <svg viewBox="0 0 1000 150" className={className} aria-hidden="true">
            <text
                x="0"
                y="128"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fontSize="168"
                fontWeight="700"
                letterSpacing="-6"
                fill="currentColor"
            >
                {text}
            </text>
        </svg>
    );

    return (
        <div
            ref={ref}
            className="relative select-none [--mx:50%] [--my:60%]"
            onPointerMove={(e) => {
                if (reduce || e.pointerType !== "mouse" || !ref.current) return;
                const r = ref.current.getBoundingClientRect();
                follow(ref.current, e.clientX - r.left, e.clientY - r.top);
            }}
        >
            {svg("h-auto w-full text-white/[0.07]")}
            <div
                className="absolute inset-0 text-accent-bright"
                style={{
                    WebkitMaskImage: "radial-gradient(circle 22vw at var(--mx) var(--my), #000 0%, transparent 70%)",
                    maskImage: "radial-gradient(circle 22vw at var(--mx) var(--my), #000 0%, transparent 70%)",
                }}
            >
                {svg("h-auto w-full")}
            </div>
        </div>
    );
}
