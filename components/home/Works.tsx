"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { useLenis } from "lenis/react";
import { FiArrowRight, FiArrowUpRight, FiGithub } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import LensPoster from "@/components/work/LensPoster";
import { profile, tone, works } from "@/lib/content";

/* The gallery. Behind it, an ambient wash in the current project's tints
   crossfades as the reader moves down; it is feathered on both axes so no
   box edge ever shows, and kept dark enough for text. A numbered tracker
   sits in the page gutter and fades with the section. */

export default function Works() {
    const reduce = useReducedMotion();
    const lenis = useLenis();
    const sectionRef = useRef<HTMLElement>(null);
    const rows = useRef<(HTMLElement | null)[]>([]);
    const [current, setCurrent] = useState(0);
    const sectionInView = useInView(sectionRef, { margin: "-35% 0px -35% 0px" });

    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    const i = Number((e.target as HTMLElement).dataset.index);
                    if (!Number.isNaN(i)) setCurrent(i);
                }
            },
            { rootMargin: "-45% 0px -45% 0px" }
        );
        rows.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    const w = works[current];

    return (
        <section
            ref={sectionRef}
            id="works"
            aria-labelledby="works-title"
            className="surface-dark relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            {/* Ambient wash: a sticky viewport-sized layer inside the section. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[2rem]">
                <div className="sticky top-0 h-[100svh] [mask-composite:intersect] [-webkit-mask-composite:source-in] [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent),linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent),linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)]">
                    <AnimatePresence initial={false}>
                        <m.div
                            key={w.slug}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.38 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 1.1, ease: "easeInOut" }}
                            style={{
                                backgroundImage: `radial-gradient(40% 45% at 30% 45%, ${tone(w.tone[0])}, transparent 70%), radial-gradient(40% 45% at 72% 60%, ${tone(w.tone[1])}, transparent 70%)`,
                            }}
                        />
                    </AnimatePresence>
                </div>
            </div>

            {/* Gutter tracker — only where a gutter exists. */}
            <m.nav
                aria-label="Projects"
                className="fixed inset-y-0 left-0 z-20 hidden items-center pl-6 min-[1440px]:flex"
                initial={false}
                animate={{ opacity: sectionInView ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ pointerEvents: sectionInView ? "auto" : "none" }}
                inert={!sectionInView}
            >
                <ol className="flex flex-col gap-1">
                    {works.map((item, i) => (
                        <li key={item.slug}>
                            <button
                                type="button"
                                aria-label={`Project ${i + 1}: ${item.title}`}
                                aria-current={current === i ? "true" : undefined}
                                onClick={() => {
                                    const el = rows.current[i];
                                    if (el) lenis?.scrollTo(el, { offset: -120, duration: 1.1 });
                                }}
                                className="group flex items-center gap-2 rounded-full py-1.5 pr-2 text-caption tabular-nums"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`h-px transition-all duration-500 ${current === i ? "w-6 bg-accent-bright" : "w-3 bg-white/30 group-hover:w-5"}`}
                                />
                                <span className={current === i ? "text-fg" : "text-muted group-hover:text-fg"}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </button>
                        </li>
                    ))}
                </ol>
            </m.nav>

            <div className="shell relative">
                <p className="label text-muted">Works</p>
                <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h2 id="works-title" className="max-w-[16ch] text-h2 font-semibold text-fg">
                        Selected <span className="accent-word">systems</span>, shipped and running.
                    </h2>
                    <p className="max-w-sm text-body text-muted">
                        AI and backend first. I build the front ends for my own systems too — every UI below is mine unless marked as a team project.
                    </p>
                </div>

                <ol className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
                    {works.map((item, i) => {
                        const href = item.links.live ?? item.links.github;
                        return (
                            <li
                                key={item.slug}
                                ref={(el) => {
                                    rows.current[i] = el;
                                }}
                                data-index={i}
                                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
                            >
                                <div className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                                    <LensPoster work={item} href={href} />
                                </div>
                                <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                                    <p className="flex flex-wrap items-center gap-3 text-caption text-muted">
                                        <span className="tabular-nums">
                                            {String(i + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span>{item.kind}</span>
                                        <span aria-hidden="true">·</span>
                                        <span>{item.year}</span>
                                        {item.team && <span className="chip min-h-0 py-0.5">Team project</span>}
                                    </p>
                                    <h3 className="mt-3 text-h3 font-semibold text-fg">{item.title}</h3>
                                    <p className="mt-4 text-lead text-fg">{item.outcome}</p>
                                    <p className="mt-3 text-body text-muted">{item.summary}</p>
                                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech">
                                        {item.tech.map((t) => (
                                            <li key={t} className="chip">
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-7 flex flex-wrap gap-3">
                                        {item.links.live && (
                                            <a href={item.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                                                <BtnLabel>Live demo</BtnLabel>
                                                <BtnIcon>
                                                    <FiArrowUpRight size={16} />
                                                </BtnIcon>
                                                <span className="sr-only">: {item.title} (opens in a new tab)</span>
                                            </a>
                                        )}
                                        {item.links.github && (
                                            <a href={item.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                                                <FiGithub size={16} aria-hidden="true" />
                                                <BtnLabel>Source</BtnLabel>
                                                <span className="sr-only">: {item.title} on GitHub (opens in a new tab)</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="mt-24 flex flex-wrap items-center gap-3 border-t hairline pt-10">
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
                        <FiGithub size={18} aria-hidden="true" />
                        <BtnLabel>More on GitHub</BtnLabel>
                        <BtnIcon>
                            <FiArrowUpRight size={18} />
                        </BtnIcon>
                    </a>
                    <Link href="/projects" className="btn btn-ghost btn-lg">
                        <BtnLabel>All projects</BtnLabel>
                        <BtnIcon dir="right">
                            <FiArrowRight size={18} />
                        </BtnIcon>
                    </Link>
                </div>
            </div>
        </section>
    );
}
