"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useRef, useState } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import Poster from "./Poster";
import type { Work } from "@/lib/content";

/* A poster that tilts gently toward the pointer and shows a glass lens:
   a frosted rim that clears toward a zoomed centre. backdrop-filter does
   not survive a tilted parent, so the glass is a blurred, masked copy. */

const LENS = 168;
const ZOOM = 1.9;
const TILT = 5;

export default function LensPoster({ work, href, priority = false }: { work: Work; href?: string; priority?: boolean }) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [lens, setLens] = useState<{ w: number; h: number } | null>(null);

    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const rotateY = useSpring(useTransform(px, [0, 1], [-TILT, TILT]), { stiffness: 140, damping: 20 });
    const rotateX = useSpring(useTransform(py, [0, 1], [TILT, -TILT]), { stiffness: 140, damping: 20 });

    const lx = useMotionValue(0);
    const ly = useMotionValue(0);
    const sx = useSpring(lx, { stiffness: 500, damping: 40 });
    const sy = useSpring(ly, { stiffness: 500, damping: 40 });
    // Shift the zoomed copy so the point under the pointer sits at the lens centre.
    const zx = useTransform(sx, (v) => LENS / 2 - v * ZOOM);
    const zy = useTransform(sy, (v) => LENS / 2 - v * ZOOM);

    const interactive = !reduce;

    function onMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!interactive || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        px.set(x / r.width);
        py.set(y / r.height);
        lx.set(x);
        ly.set(y);
        if (!lens) setLens({ w: r.width, h: r.height });
    }

    function onLeave() {
        px.set(0.5);
        py.set(0.5);
        setLens(null);
    }

    const face = (
        <div ref={ref} className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] bg-ink-2">
            <Poster work={work} priority={priority} />
            {lens && (
                <m.div
                    aria-hidden="true"
                    inert
                    className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-full shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6),inset_0_0_0_1px_rgb(255_255_255/0.35)]"
                    style={{ width: LENS, height: LENS, x: sx, y: sy, marginLeft: -LENS / 2, marginTop: -LENS / 2 }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <m.div
                        className="absolute left-0 top-0 origin-top-left"
                        style={{ width: lens.w, height: lens.h, x: zx, y: zy, scale: ZOOM }}
                    >
                        <Poster work={work} />
                    </m.div>
                    {/* Frosted rim: a blurred copy masked to the edge only. */}
                    <m.div
                        className="absolute left-0 top-0 origin-top-left blur-[6px] [mask-image:radial-gradient(circle,transparent_52%,#000_74%)]"
                        style={{ width: lens.w, height: lens.h, x: zx, y: zy, scale: ZOOM }}
                    >
                        <Poster work={work} />
                    </m.div>
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.28),transparent_45%)]" />
                </m.div>
            )}
        </div>
    );

    return (
        <div className="[perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
            <m.div style={interactive ? { rotateX, rotateY } : undefined} className={lens ? "cursor-none" : undefined}>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                        {face}
                    </a>
                ) : (
                    face
                )}
            </m.div>
        </div>
    );
}
