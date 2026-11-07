"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import Link from "next/link";
import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import ScrubText from "@/components/system/ScrubText";
import Portrait from "@/components/system/Portrait";
import TechIcon from "@/components/system/TechIcon";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { aboutAccent, aboutApproach, aboutIntro, aboutStatement, favoriteStack, orbSkills } from "@/lib/content";

/* Everything in this scene is a function of one scroll progress value:
   the statement lights word by word, the portrait settles, and the three
   steps (introduction → approach → let's talk) arrive in order. No
   pinning; nothing here sits over the hero or captures its pointer. */

function Step({
    progress,
    at,
    reduce,
    children,
}: {
    progress: MotionValue<number>;
    at: number;
    reduce: boolean | null;
    children: React.ReactNode;
}) {
    const opacity = useTransform(progress, [at, at + 0.12], [0, 1]);
    const y = useTransform(progress, [at, at + 0.12], [24, 0]);
    return (
        <m.div className="card flex flex-col p-6 sm:p-8" style={reduce ? undefined : { opacity, y }}>
            {children}
        </m.div>
    );
}

export default function AboutScene() {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.85"] });
    const statement = useTransform(scrollYProgress, [0, 0.38], [0, 1]);
    const portraitScale = useTransform(scrollYProgress, [0.15, 0.5], [0.92, 1]);
    const portraitRadius = useTransform(scrollYProgress, [0.15, 0.5], [48, 24]);

    return (
        <section
            ref={ref}
            id="about"
            aria-labelledby="about-title"
            className="surface-dark relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            <div className="shell">
                <p className="label text-muted" id="about-title">
                    About
                </p>
                <ScrubText
                    as="h2"
                    text={aboutStatement}
                    accent={aboutAccent}
                    progress={statement}
                    className="mt-6 max-w-[24ch] text-h2 font-semibold"
                />

                <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12">
                    <m.div
                        className="overflow-hidden lg:col-span-5"
                        style={reduce ? { borderRadius: 24 } : { scale: portraitScale, borderRadius: portraitRadius }}
                    >
                        <Portrait className="aspect-[4/5] w-full" />
                    </m.div>

                    <div className="grid gap-6 lg:col-span-7">
                        <Step progress={scrollYProgress} at={0.3} reduce={reduce}>
                            <p className="label text-link">01 · Introduction</p>
                            <p className="mt-4 text-lead text-fg">{aboutIntro}</p>
                        </Step>
                        <Step progress={scrollYProgress} at={0.4} reduce={reduce}>
                            <p className="label text-link">02 · {aboutApproach.title}</p>
                            <p className="mt-4 text-body text-muted">{aboutApproach.body}</p>
                            <div className="mt-6">
                                <p className="text-caption font-medium text-fg">Favorite tech stack</p>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {favoriteStack.map((t) => (
                                        <li
                                            key={t.name}
                                            title={t.name}
                                            className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[22px] text-ink-2"
                                        >
                                            <TechIcon icon={t.icon} name={t.name} className="h-[22px] w-[22px]" style={{ color: brandColor(t.icon) }} />
                                            <span className="sr-only">{t.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Step>
                        <Step progress={scrollYProgress} at={0.5} reduce={reduce}>
                            <p className="label text-link">03 · Let&apos;s talk</p>
                            <p className="mt-4 text-lead text-fg">
                                Building something with agents, retrieval or real load behind it? I&apos;d like to hear about it.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/about" className="btn">
                                    <BtnLabel>More about me</BtnLabel>
                                    <BtnIcon>
                                        <FiArrowUpRight size={16} />
                                    </BtnIcon>
                                </Link>
                                <Link href="/contact" className="btn btn-ghost">
                                    <BtnLabel>Get in touch</BtnLabel>
                                </Link>
                            </div>
                        </Step>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Brand colours come from the skills data; Strands has no logo, so it keeps ink. */
const brandColor = (icon: string) => orbSkills.find((o) => o.icon === icon)?.color;
