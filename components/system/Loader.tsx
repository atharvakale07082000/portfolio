"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useLenis } from "lenis/react";
import { markBootDone } from "@/lib/boot";

/* A short terminal boot log, once per session. While it plays the page is
   locked (CSS keeps <html> overflow hidden until data-booted is set, and
   Lenis is stopped); the reveal hands the scroll back. The inline script
   in the layout sets data-booted before first paint on later visits, so
   returning readers never see it. */

const LINES: { cmd?: string; ok?: string; dots?: string; val?: string }[] = [
    { cmd: "boot atharva.kale --profile=ai,backend" },
    { ok: "orchestrator", dots: "··········", val: "5 specialists" },
    { ok: "retrieval", dots: "·············", val: "warm" },
    { ok: "api latency", dots: "···········", val: "200ms" },
    { cmd: "stream portfolio" },
];

export default function Loader() {
    const lenis = useLenis();
    const reduce = useReducedMotion();
    const [shown, setShown] = useState(0);
    const [phase, setPhase] = useState<"play" | "exit" | "done">("play");

    useEffect(() => {
        const booted = document.documentElement.hasAttribute("data-booted");
        const timers: number[] = [];
        const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

        if (booted) {
            at(0, () => setPhase("done"));
            markBootDone();
            return () => timers.forEach(clearTimeout);
        }

        lenis?.stop();
        const step = reduce ? 0 : 110;
        LINES.forEach((_, i) => at(80 + i * step, () => setShown(i + 1)));
        const hold = reduce ? 250 : 80 + LINES.length * step + 180;
        at(hold, () => setPhase("exit"));
        return () => timers.forEach(clearTimeout);
    }, [lenis, reduce]);

    if (phase === "done") return null;

    return (
        <m.div
            className="boot surface-dark fixed inset-0 z-[200] flex items-end"
            aria-hidden="true"
            initial={false}
            animate={
                phase === "exit"
                    ? reduce
                        ? { opacity: 0 }
                        : { clipPath: "inset(0% 0% 100% 0%)" }
                    : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
            }
            transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
                if (phase !== "exit") return;
                markBootDone();
                lenis?.start();
                setPhase("done");
            }}
        >
            <div className="shell pb-[12vh]">
                <pre className="font-mono text-code text-muted whitespace-pre-wrap">
                    {LINES.slice(0, shown).map((l, i) => (
                        <div key={i} className="leading-7">
                            {l.cmd ? (
                                <>
                                    <span className="text-accent-bright">$ </span>
                                    <span className="text-fg">{l.cmd}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sys-green">✓ </span>
                                    {l.ok} <span className="opacity-40">{l.dots}</span>{" "}
                                    <span className="text-fg">{l.val}</span>
                                </>
                            )}
                        </div>
                    ))}
                    <span className="caret" />
                </pre>
            </div>
        </m.div>
    );
}
