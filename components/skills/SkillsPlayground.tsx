"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import TechIcon from "@/components/system/TechIcon";
import { orbSkills } from "@/lib/content";
import {
    createWorld,
    drag,
    grab,
    radiiFor,
    release,
    render,
    resize,
    settle,
    shake,
    step,
    type World,
} from "./physics";

/* The orbs drop into the stage once it is on screen, collide, and can be
   dragged and thrown. One GSAP ticker callback drives the world; it is
   removed whenever the stage leaves the viewport or the pile comes to rest,
   and added back on the next interaction. */

type Props = { shakeSignal: number };

/* Ticker bookkeeping lives at module level, outside React's tracking. */
const loop = { tick: null as null | ((t: number, dt: number) => void), on: false };
function startLoop(fn: (t: number, dt: number) => void) {
    if (loop.on && loop.tick === fn) return;
    stopLoop();
    loop.tick = fn;
    loop.on = true;
    gsap.ticker.add(fn);
}
function stopLoop() {
    if (loop.tick) gsap.ticker.remove(loop.tick);
    loop.on = false;
}

export default function SkillsPlayground({ shakeSignal }: Props) {
    const reduce = useReducedMotion();
    const stageRef = useRef<HTMLDivElement>(null);
    const orbRefs = useRef<(HTMLElement | null)[]>([]);
    const worldRef = useRef<World | null>(null);
    const visibleRef = useRef(false);
    const dragRef = useRef<{ i: number; ox: number; oy: number; t: number; id: number } | null>(null);
    const tickRef = useRef<((t: number, dt: number) => void) | null>(null);
    const [held, setHeld] = useState<string | null>(null);

    // World setup, sizing, visibility.
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const { width, height } = stage.getBoundingClientRect();
        const world = createWorld(width, height, radiiFor(orbSkills.length, width));
        worldRef.current = world;

        if (reduce) {
            settle(world);
            render(world, orbRefs.current);
            return;
        }

        const tick = (_t: number, deltaMs: number) => {
            const w = worldRef.current;
            if (!w || !stageRef.current) return;
            const awake = step(w, Math.min(deltaMs / 1000, 1 / 30));
            render(w, orbRefs.current);
            if (!awake && !dragRef.current) stopLoop();
        };
        tickRef.current = tick;
        render(world, orbRefs.current);

        const io = new IntersectionObserver(([entry]) => {
            if (!entry || !stageRef.current) return;
            visibleRef.current = entry.isIntersecting;
            if (entry.isIntersecting) startLoop(tick);
            else stopLoop();
        }, { threshold: 0.15 });
        io.observe(stage);

        const ro = new ResizeObserver(([entry]) => {
            const w = worldRef.current;
            if (!entry || !w || !stageRef.current) return;
            const { width: nw, height: nh } = entry.contentRect;
            if (Math.abs(nw - w.w) < 1 && Math.abs(nh - w.h) < 1) return;
            resize(w, nw, nh, radiiFor(orbSkills.length, nw));
            render(w, orbRefs.current);
            if (visibleRef.current) startLoop(tick);
        });
        ro.observe(stage);

        return () => {
            io.disconnect();
            ro.disconnect();
            stopLoop();
            worldRef.current = null;
        };
    }, [reduce]);

    // The Shake button lives outside the stage; it signals through a counter.
    useEffect(() => {
        if (shakeSignal === 0 || reduce) return;
        const w = worldRef.current;
        const tick = tickRef.current;
        if (!w || !tick) return;
        shake(w);
        startLoop(tick);
    }, [shakeSignal, reduce]);

    function pointerDown(i: number, e: React.PointerEvent<HTMLElement>) {
        const w = worldRef.current;
        const stage = stageRef.current;
        if (reduce || !w || !stage || !tickRef.current) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const r = stage.getBoundingClientRect();
        const b = w.bodies[i];
        dragRef.current = { i, ox: e.clientX - r.left - b.x, oy: e.clientY - r.top - b.y, t: e.timeStamp, id: e.pointerId };
        grab(w, i);
        setHeld(orbSkills[i].name);
        startLoop(tickRef.current);
    }

    function pointerMove(e: React.PointerEvent<HTMLElement>) {
        const d = dragRef.current;
        const w = worldRef.current;
        const stage = stageRef.current;
        if (!d || !w || !stage || d.id !== e.pointerId) return;
        const r = stage.getBoundingClientRect();
        drag(w, d.i, e.clientX - r.left - d.ox, e.clientY - r.top - d.oy, (e.timeStamp - d.t) / 1000);
        dragRef.current = { ...d, t: e.timeStamp };
    }

    function pointerUp(e: React.PointerEvent<HTMLElement>) {
        const d = dragRef.current;
        const w = worldRef.current;
        if (!d || d.id !== e.pointerId) return;
        if (w) release(w, d.i);
        dragRef.current = null;
        setHeld(null);
        if (tickRef.current) startLoop(tickRef.current);
    }

    return (
        <div ref={stageRef} className="absolute inset-0 touch-pan-y" aria-hidden="true">
            <p
                className={`pointer-events-none absolute inset-x-0 top-[18%] select-none text-center text-[clamp(2.5rem,9vw,8rem)] font-semibold tracking-[-0.05em] text-fg/10 transition-opacity duration-300 ${
                    held ? "opacity-100" : "opacity-0"
                }`}
            >
                {held ?? ""}
            </p>
            {orbSkills.map((s, i) => (
                <span
                    key={s.name}
                    ref={(el) => {
                        orbRefs.current[i] = el;
                    }}
                    title={s.name}
                    onPointerDown={(e) => pointerDown(i, e)}
                    onPointerMove={pointerMove}
                    onPointerUp={pointerUp}
                    onPointerCancel={pointerUp}
                    className={`absolute left-0 top-0 grid touch-none place-items-center rounded-full bg-white shadow-[0_6px_18px_-6px_rgb(0_0_0/0.35),inset_0_0_0_1px_rgb(0_0_0/0.06)] ${
                        reduce ? "" : "cursor-grab active:cursor-grabbing"
                    }`}
                    style={{ width: 0, height: 0, transform: "translate3d(-200px,-200px,0)" }}
                >
                    <TechIcon icon={s.icon} name={s.name} className="h-[52%] w-[52%] text-ink-2" style={{ color: s.color }} />
                </span>
            ))}
        </div>
    );
}
