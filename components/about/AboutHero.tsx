"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import Link from "next/link";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiAward, FiCheckCircle, FiCpu, FiDownload, FiZap } from "react-icons/fi";
import ScrubText from "@/components/system/ScrubText";
import Portrait from "@/components/system/Portrait";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { useAge } from "@/components/system/clientValues";
import { aboutFacts, profile } from "@/lib/content";

const STICKERS = [
    { icon: FiZap, text: "10× throughput", pos: "left-[-6%] top-[12%]", delay: "0s" },
    { icon: FiAward, text: "Rolls-Royce award", pos: "right-[-8%] top-[38%]", delay: "-2s" },
    { icon: FiCpu, text: "Agents that show their work", pos: "left-[-4%] bottom-[14%]", delay: "-4s" },
    { icon: FiCheckCircle, text: "Evals before ship", pos: "right-[-2%] bottom-[-3%]", delay: "-1s" },
];

export default function AboutHero() {
    const reduce = useReducedMotion();
    const age = useAge(profile.dateOfBirth);
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 120, damping: 18 });
    const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 120, damping: 18 });

    return (
        <section className="surface-light relative overflow-hidden pb-24 pt-[calc(var(--nav-h)+4rem)] md:pb-32 md:pt-[calc(var(--nav-h)+6rem)]">
            <div className="shell grid items-center gap-16 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <p className="label text-muted">About</p>
                    <ScrubText
                        as="h1"
                        text="An engineer of systems that explain themselves."
                        accent={["explain"]}
                        className="mt-6 max-w-[14ch] text-h1 font-semibold text-fg"
                    />
                    <p className="mt-8 max-w-[56ch] text-lead text-muted">
                        I&apos;m {profile.name}
                        {age !== null ? `, ${age},` : ","} an {profile.role} at {profile.company} in {profile.city}. I build
                        multi-agent platforms, text-to-SQL and production RAG — and the Python services, queues and caches
                        that keep them fast when real traffic arrives. When a system needs a face, I build that too.
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-2" aria-label="Quick facts">
                        {aboutFacts.map((f) => (
                            <li key={f} className="chip text-fg">
                                {f}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <a href={profile.resume} download className="btn btn-lg">
                            <BtnIcon dir="down">
                                <FiDownload size={17} />
                            </BtnIcon>
                            <BtnLabel>Download résumé</BtnLabel>
                        </a>
                        <Link href="/contact" className="btn btn-ghost btn-lg">
                            <BtnLabel>Get in touch</BtnLabel>
                            <BtnIcon>
                                <FiArrowUpRight size={17} />
                            </BtnIcon>
                        </Link>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[420px] lg:col-span-5">
                    <div
                        className="relative [perspective:1000px]"
                        onPointerMove={(e) => {
                            if (reduce || e.pointerType !== "mouse") return;
                            const r = e.currentTarget.getBoundingClientRect();
                            px.set((e.clientX - r.left) / r.width);
                            py.set((e.clientY - r.top) / r.height);
                        }}
                        onPointerLeave={() => {
                            px.set(0.5);
                            py.set(0.5);
                        }}
                    >
                        <m.div style={reduce ? undefined : { rotateX, rotateY }} className="relative">
                            <Portrait priority className="aspect-[4/5] w-full rounded-[2rem] shadow-[var(--shadow)]" />
                            {STICKERS.map(({ icon: Icon, text, pos, delay }) => (
                                <span key={text} className={`absolute ${pos} hidden xs:block`} aria-hidden="true">
                                    <span
                                        className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-caption font-medium text-fg shadow-[var(--shadow)] motion-safe:animate-[float_6s_ease-in-out_infinite]"
                                        style={{ animationDelay: delay }}
                                    >
                                        <Icon size={14} className="text-link" />
                                        {text}
                                    </span>
                                </span>
                            ))}
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
