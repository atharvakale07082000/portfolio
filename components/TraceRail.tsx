"use client";

import { useEffect, useRef, useState } from "react";

export type Span = { id: string; label: string };

/**
 * The signature element.
 *
 * The page is one request; each section is a span. The rail marks them in
 * order — which is legitimate here because in a trace, order is the
 * information. A hairline fills as you scroll and the active span lights.
 *
 * Desktop only: below 1024px there is no gutter to put it in, and a rail
 * squeezed against the text would be decoration rather than structure.
 */
export default function TraceRail({ spans }: { spans: Span[] }) {
    const [progress, setProgress] = useState(0);
    const [active, setActive] = useState(0);
    const frame = useRef<number | null>(null);

    useEffect(() => {
        const measure = () => {
            frame.current = null;

            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);

            // The active span is the last one whose top has passed the
            // upper third of the viewport.
            const line = window.innerHeight * 0.34;
            let current = 0;
            spans.forEach((span, i) => {
                const el = document.getElementById(span.id);
                if (el && el.getBoundingClientRect().top <= line) current = i;
            });
            setActive(current);
        };

        const onScroll = () => {
            if (frame.current === null) frame.current = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        };
    }, [spans]);

    return (
        <div
            aria-hidden="true"
            className="rail-wrap fixed top-1/2 -translate-y-1/2 z-30 select-none"
        >
            <div className="relative pl-0" style={{ height: `${spans.length * 46}px` }}>
                <div className="rail" />
                <div
                    className="rail-fill"
                    style={{
                        height: "100%",
                        transform: `scaleY(${progress})`,
                        transition: "transform 120ms linear",
                    }}
                />

                {spans.map((span, i) => (
                    <div
                        key={span.id}
                        className="absolute left-0 flex items-center gap-3"
                        style={{ top: `${i * 46}px` }}
                    >
                        <div className="relative w-px h-[7px]">
                            <span className="rail-node" data-active={i <= active} />
                        </div>
                        <span
                            className="telemetry pl-3 transition-colors duration-500"
                            style={{
                                color: i === active ? "var(--signal)" : "var(--graphite)",
                                opacity: i === active ? 1 : 0.55,
                            }}
                        >
                            {span.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
