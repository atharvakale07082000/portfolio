"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";

type Props = {
    text: string;
    /** Words to set in the serif italic with the accent gradient. */
    accent?: readonly string[];
    /** External progress (0–1). Without it the text tracks its own scroll. */
    progress?: MotionValue<number>;
    as?: "p" | "h1" | "h2" | "h3";
    className?: string;
    id?: string;
};

const clean = (w: string) => w.replace(/[^\p{L}\p{N}'’-]/gu, "").toLowerCase();

function Word({
    word,
    index,
    total,
    progress,
    accent,
}: {
    word: string;
    index: number;
    total: number;
    progress: MotionValue<number>;
    accent: boolean;
}) {
    // Each word lights over a window that overlaps its neighbours, so the
    // wave reads as continuous rather than stepped.
    const start = (index / total) * 0.85;
    const end = Math.min(1, start + 0.15 + 0.85 / total);
    // Unlit words stay at 40%: dim, but still 3:1 legible on the dark surfaces.
    const opacity = useTransform(progress, [start, end], [0.4, 1]);
    const y = useTransform(progress, [start, end], [6, 0]);
    const blur = useTransform(progress, [start, end], [2, 0]);
    const filter = useTransform(blur, (b) => (b < 0.05 ? "none" : `blur(${b.toFixed(2)}px)`));

    return (
        <m.span
            className={`inline-block ${accent ? "accent-word" : ""}`}
            style={{ opacity, y, filter }}
        >
            {word}
        </m.span>
    );
}

export default function ScrubText({
    text,
    accent = [],
    progress,
    as = "p",
    className = "",
    id,
}: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.55"] });
    const source = progress ?? scrollYProgress;
    const words = text.split(" ");
    const accentSet = new Set(accent.map((a) => a.toLowerCase()));
    const Tag = as;

    if (reduce) {
        return (
            <Tag ref={ref} id={id} className={className}>
                {words.map((w, i) => (
                    <span key={i} className={accentSet.has(clean(w)) ? "accent-word" : undefined}>
                        {w}
                        {i < words.length - 1 ? " " : ""}
                    </span>
                ))}
            </Tag>
        );
    }

    return (
        <Tag ref={ref} id={id} className={className}>
            {words.map((w, i) => (
                <span key={i}>
                    <Word
                        word={w}
                        index={i}
                        total={words.length}
                        progress={source}
                        accent={accentSet.has(clean(w))}
                    />
                    {i < words.length - 1 ? " " : ""}
                </span>
            ))}
        </Tag>
    );
}
