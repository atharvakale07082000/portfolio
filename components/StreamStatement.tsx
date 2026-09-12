"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The hero doesn't fade in — it streams, the way his agents answer.
 *
 * First a routing line resolves, then the statement arrives word by word
 * behind a caret. The full text is in the server-rendered markup and in
 * the accessibility tree the whole time; only opacity is animated, so
 * crawlers and screen readers get the complete sentence immediately.
 */
export default function StreamStatement({
    statement,
    routes,
}: {
    statement: string;
    routes: string[];
}) {
    const words = statement.split(" ");

    // Server and no-JS render everything visible. The layout effect below
    // rewinds it before first paint when motion is welcome.
    const [revealed, setRevealed] = useState(words.length);
    const [routesIn, setRoutesIn] = useState(routes.length);
    const [streaming, setStreaming] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useIsoLayoutEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setRevealed(0);
        setRoutesIn(0);
        setStreaming(true);
    }, []);

    useEffect(() => {
        if (!streaming) return;

        const at = (ms: number, fn: () => void) => {
            timers.current.push(setTimeout(fn, ms));
        };

        // Phase 1 — the router resolves its plan.
        routes.forEach((_, i) => at(220 + i * 130, () => setRoutesIn(i + 1)));

        // Phase 2 — tokens arrive. Slightly uneven, like a real stream.
        const start = 220 + routes.length * 130 + 260;
        words.forEach((word, i) => {
            const jitter = (word.length > 6 ? 34 : 0) + (i % 3) * 12;
            at(start + i * 58 + jitter, () => setRevealed(i + 1));
        });

        // Phase 3 — the caret retires.
        at(start + words.length * 58 + 520, () => setStreaming(false));

        const t = timers.current;
        return () => t.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streaming]);

    return (
        <div>
            {/* Routing line — real specialisms, resolved in order. */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-6">
                <span className="telemetry text-signal">route</span>
                <span className="telemetry text-rule-strong" aria-hidden="true">
                    &rarr;
                </span>
                {routes.map((route, i) => (
                    <span key={route} className="flex items-center gap-2.5">
                        {i > 0 && (
                            <span className="telemetry text-rule-strong" aria-hidden="true">
                                ·
                            </span>
                        )}
                        <span
                            className="telemetry text-graphite transition-opacity duration-300"
                            style={{ opacity: i < routesIn ? 1 : 0 }}
                        >
                            {route}
                        </span>
                    </span>
                ))}
            </div>

            {/* The claim. */}
            <p className="t-lead text-ink max-w-[46ch] font-normal">
                {words.map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        className="transition-opacity duration-200"
                        style={{ opacity: i < revealed ? 1 : 0 }}
                    >
                        {word}
                        {i < words.length - 1 ? " " : ""}
                    </span>
                ))}
                {streaming && <span className="caret" aria-hidden="true" />}
            </p>
        </div>
    );
}
