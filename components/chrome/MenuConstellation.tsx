"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useEffect, useRef, useState } from "react";
import { animate, m, motionValue, type MotionValue } from "framer-motion";
import { socials } from "@/lib/content";
import { SOCIAL_ICONS } from "./socialIcons";

/* Wide screens: the socials orbit a core orb on the blurred backdrop. One
   animation-frame loop writes every node's motion values; nothing here
   re-renders per frame. Nodes fly out on open, then drift gently. */

type Node = { x: MotionValue<number>; y: MotionValue<number> };
type Size = { w: number; h: number };

const ANGLES = [-148, -38, 34, 146];
const RADII = [1, 0.92, 1.04, 0.95];
const PHASES = [0, 1.7, 3.1, 4.6];

/** Base position of node i for a given stage size. */
function basePoint(i: number, size: Size) {
    const r = Math.min(size.w * 0.36, size.h * 0.3) * RADII[i % RADII.length];
    const a = (ANGLES[i % ANGLES.length] * Math.PI) / 180;
    return { x: size.w / 2 + Math.cos(a) * r, y: size.h / 2 + Math.sin(a) * r };
}

function writeFrame(nodes: Node[], size: Size, spread: number, t: number, drift: boolean) {
    const cx = size.w / 2;
    const cy = size.h / 2;
    nodes.forEach((n, i) => {
        const b = basePoint(i, size);
        const p = PHASES[i % PHASES.length];
        const dx = drift ? Math.sin(t * 0.32 + p) * 9 : 0;
        const dy = drift ? Math.cos(t * 0.27 + p * 1.3) * 9 : 0;
        n.x.set(cx + (b.x - cx) * spread + dx);
        n.y.set(cy + (b.y - cy) * spread + dy);
    });
}

export default function MenuConstellation() {
    const reduce = useReducedMotion();
    const stageRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<Size | null>(null);
    const [hot, setHot] = useState<number | null>(null);
    const [nodes] = useState<Node[]>(() => socials.map(() => ({ x: motionValue(0), y: motionValue(0) })));
    const [spread] = useState(() => motionValue(reduce ? 1 : 0));

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            const box = entries[0]?.contentRect;
            if (!box || !stageRef.current) return;
            setSize({ w: box.width, h: box.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!size) return;
        if (reduce) {
            writeFrame(nodes, size, 1, 0, false);
            return;
        }
        const ctl = animate(spread, 1, { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 });
        let raf = 0;
        const tick = (now: number) => {
            writeFrame(nodes, size, spread.get(), now / 1000, true);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            ctl.stop();
        };
    }, [size, reduce, nodes, spread]);

    return (
        <div
            ref={stageRef}
            className="pointer-events-none fixed inset-y-0 left-0 right-[520px] z-[105] xl:right-[560px]"
        >
            {size && (
                <>
                    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                        {nodes.map((n, i) => (
                            <g key={i} style={{ opacity: hot === null || hot === i ? 1 : 0.25, transition: "opacity .3s" }}>
                                <m.line
                                    x1={size.w / 2}
                                    y1={size.h / 2}
                                    x2={n.x}
                                    y2={n.y}
                                    stroke="white"
                                    strokeOpacity={0.22}
                                    strokeWidth={1}
                                    initial={{ pathLength: reduce ? 1 : 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                />
                                <m.line
                                    x1={size.w / 2}
                                    y1={size.h / 2}
                                    x2={n.x}
                                    y2={n.y}
                                    stroke="rgb(var(--accent-bright-rgb))"
                                    strokeWidth={1.5}
                                    className="flow-line"
                                    style={{ opacity: hot === i ? 1 : 0, transition: "opacity .3s" }}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Core orb with a slowly turning text ring. */}
                    <m.div
                        className="absolute left-0 top-0 flex h-0 w-0 items-center justify-center"
                        style={{ x: size.w / 2, y: size.h / 2 }}
                        initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        aria-hidden="true"
                    >
                        <div className="relative grid h-40 w-40 shrink-0 place-items-center">
                            <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_40s_linear_infinite]">
                                <defs>
                                    <path id="orb-ring" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
                                </defs>
                                <text className="fill-white/70 text-[10.5px] uppercase tracking-[0.32em]">
                                    <textPath href="#orb-ring">Find me elsewhere · Let&apos;s connect ·</textPath>
                                </text>
                            </svg>
                            <div className="h-20 w-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgb(var(--accent-bright-rgb)),rgb(var(--accent-rgb))_55%,rgb(var(--ink-2-rgb))_100%)] shadow-[0_0_60px_-10px_rgb(var(--accent-rgb)/0.8)]" />
                        </div>
                    </m.div>

                    <nav aria-label="Elsewhere">
                        <ul>
                            {socials.map((s, i) => {
                                const Icon = SOCIAL_ICONS[s.label];
                                return (
                                    <m.li
                                        key={s.label}
                                        className="absolute left-0 top-0 flex h-0 w-0 items-center justify-center"
                                        style={{ x: nodes[i].x, y: nodes[i].y }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: hot === null || hot === i ? 1 : 0.4 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <a
                                            href={s.href}
                                            {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                            {...(s.label === "Résumé" ? { download: true } : {})}
                                            aria-label={`${s.label}: ${s.handle}`}
                                            onPointerEnter={() => setHot(i)}
                                            onPointerLeave={() => setHot(null)}
                                            onFocus={() => setHot(i)}
                                            onBlur={() => setHot(null)}
                                            className="surface-dark btn btn-ghost pointer-events-auto shrink-0 [--btn-fill:rgb(var(--accent-rgb))]"
                                        >
                                            {Icon && <Icon size={16} aria-hidden="true" />}
                                            <span className="btn-label-fit" aria-hidden="true">
                                                <span>{s.label}</span>
                                                <span>{s.handle}</span>
                                            </span>
                                        </a>
                                    </m.li>
                                );
                            })}
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
}
