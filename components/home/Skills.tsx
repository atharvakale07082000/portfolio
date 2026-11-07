"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FiArrowRight, FiShuffle } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { orbSkills } from "@/lib/content";

/* The playground (and GSAP with it) downloads only as the section nears. */
const SkillsPlayground = dynamic(() => import("@/components/skills/SkillsPlayground"), { ssr: false });

export default function Skills() {
    const ref = useRef<HTMLDivElement>(null);
    const near = useInView(ref, { once: true, margin: "800px 0px" });
    const reduce = useReducedMotion();
    const [shakeSignal, setShake] = useState(0);

    return (
        <section
            id="skills"
            aria-labelledby="skills-title"
            className="surface-light relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            <div className="shell">
                <p className="label text-muted">Skills</p>
                <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <h2 id="skills-title" className="max-w-[14ch] text-h2 font-semibold text-fg">
                        Areas of <span className="accent-word">expertise</span>
                    </h2>
                    {/* Outside the clipped stage, so its lift and glow are never cut off. */}
                    {!reduce && (
                        <button type="button" onClick={() => setShake((n) => n + 1)} className="btn btn-ghost self-start sm:self-auto">
                            <BtnIcon dir="up">
                                <FiShuffle size={16} />
                            </BtnIcon>
                            <BtnLabel>Shake</BtnLabel>
                        </button>
                    )}
                </div>
                <p className="mt-4 max-w-xl text-body text-muted">
                    {reduce ? "The tools I reach for most." : "Grab one, throw it, or shake the lot. Twenty-four tools I reach for most."}
                </p>

                <div
                    ref={ref}
                    className="card relative mt-10 h-[min(72vh,560px)] min-h-[380px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,rgb(var(--raised-rgb)),rgb(var(--bg-rgb)))]"
                >
                    {near && <SkillsPlayground shakeSignal={shakeSignal} />}
                </div>
                <ul className="sr-only">
                    {orbSkills.map((s) => (
                        <li key={s.name}>{s.name}</li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-lg text-lead text-fg">
                        Agents and retrieval on top, Python services and queues underneath — and enough React to ship the interface.
                    </p>
                    <Link href="/about#skills" className="btn btn-lg">
                        <BtnLabel>See all my skills</BtnLabel>
                        <BtnIcon dir="right">
                            <FiArrowRight size={18} />
                        </BtnIcon>
                    </Link>
                </div>
            </div>
        </section>
    );
}
