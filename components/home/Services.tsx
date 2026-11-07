"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { useLenis } from "lenis/react";
import { FiArrowUpRight } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { services, type Service } from "@/lib/content";

const demos = {
    agents: dynamic(() => import("./demos/AgentRouteDemo")),
    retrieval: dynamic(() => import("./demos/RagDemo")),
    backend: dynamic(() => import("./demos/ThroughputDemo")),
};

/* Each service owns a background. On selection the new one wipes in as a
   circle growing from the bottom centre, over the previous one. */
const BACKDROPS: Record<Service["id"], string> = {
    agents: "bg-[radial-gradient(120%_100%_at_0%_0%,rgb(var(--sys-indigo-rgb)),rgb(var(--accent-rgb))_55%,rgb(var(--ink-2-rgb)))]",
    retrieval: "bg-[radial-gradient(120%_100%_at_100%_0%,rgb(var(--sys-teal-rgb)),rgb(var(--sys-blue-rgb))_50%,rgb(var(--ink-2-rgb)))]",
    backend: "bg-[radial-gradient(120%_100%_at_50%_0%,rgb(var(--sys-orange-rgb)),rgb(var(--sys-pink-rgb))_55%,rgb(var(--ink-2-rgb)))]",
};

function Stage({ id, previous, className = "" }: { id: Service["id"]; previous: Service["id"] | null; className?: string }) {
    const reduce = useReducedMotion();
    const Demo = demos[id];
    return (
        <div className={`relative isolate overflow-hidden rounded-[1.75rem] [container-type:inline-size] ${className}`}>
            {previous && previous !== id && <div aria-hidden="true" className={`absolute inset-0 -z-10 ${BACKDROPS[previous]}`} />}
            <m.div
                key={id}
                aria-hidden="true"
                className={`absolute inset-0 -z-10 ${BACKDROPS[id]}`}
                initial={reduce || !previous ? false : { clipPath: "circle(0% at 50% 100%)" }}
                animate={{ clipPath: "circle(150% at 50% 100%)" }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
            <p className="label absolute right-[4cqw] top-[3.4cqw] text-[1.9cqw] text-white/70">Interactive demo · sample data</p>
            <div className="h-full pt-[5cqw]">
                <Demo />
            </div>
        </div>
    );
}

export default function Services() {
    const lenis = useLenis();
    const [{ active, previous }, setSel] = useState<{ active: Service["id"]; previous: Service["id"] | null }>({
        active: "agents",
        previous: null,
    });
    const blocks = useRef<Record<string, HTMLElement | null>>({});

    const select = (id: Service["id"]) =>
        setSel((s) => (s.active === id ? s : { active: id, previous: s.active }));

    // Scrolling selects: whichever service block crosses the middle wins.
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    const id = (e.target as HTMLElement).dataset.service as Service["id"] | undefined;
                    if (!id) continue;
                    setSel((s) => (s.active === id ? s : { active: id, previous: s.active }));
                }
            },
            { rootMargin: "-45% 0px -45% 0px" }
        );
        Object.values(blocks.current).forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section
            id="services"
            aria-labelledby="services-title"
            className="surface-light relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            <div className="shell">
                <p className="label text-muted">Services</p>
                <h2 id="services-title" className="mt-5 max-w-[18ch] text-h2 font-semibold text-fg">
                    What I build, from the <span className="accent-word">agent</span> down to the queue.
                </h2>

                {/* Service names: click to jump; the current one is marked. */}
                <div className="mt-10 hidden flex-wrap gap-2 lg:flex" role="group" aria-label="Choose a service">
                    {services.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-pressed={active === s.id}
                            onClick={() => {
                                select(s.id);
                                const el = blocks.current[s.id];
                                if (el) lenis?.scrollTo(el, { offset: -window.innerHeight * 0.3, duration: 1 });
                            }}
                            className={`btn btn-sm ${active === s.id ? "" : "btn-ghost"}`}
                        >
                            <span className="tabular-nums opacity-60">{s.index}</span>
                            <BtnLabel>{s.title}</BtnLabel>
                        </button>
                    ))}
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        {services.map((s) => (
                            <article
                                key={s.id}
                                ref={(el) => {
                                    blocks.current[s.id] = el;
                                }}
                                data-service={s.id}
                                className="flex flex-col justify-center py-10 lg:min-h-[70vh] lg:py-0"
                            >
                                <p className="text-caption tabular-nums text-muted">{s.index}</p>
                                <h3
                                    className={`mt-3 text-h3 font-semibold transition-colors duration-500 ${
                                        active === s.id ? "text-fg" : "text-fg lg:text-muted"
                                    }`}
                                >
                                    {s.title}
                                </h3>
                                <p className="mt-4 text-lead text-fg">{s.short}</p>
                                <p className="mt-3 text-body text-muted">{s.body}</p>
                                <ul className="mt-6 space-y-2">
                                    {s.points.map((p) => (
                                        <li key={p} className="flex gap-3 text-small text-fg">
                                            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools">
                                    {s.tech.map((t) => (
                                        <li key={t} className="chip">
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                                {/* Below lg each service carries its own demo inline. */}
                                <Stage id={s.id} previous={null} className="mt-8 aspect-[4/3.4] lg:hidden" />
                            </article>
                        ))}
                    </div>

                    <div className="hidden lg:col-span-7 lg:block">
                        <div className="sticky top-[calc(50vh-min(36vw,560px)/2)]">
                            <Stage id={active} previous={previous} className="aspect-[4/3.4] max-h-[560px] w-full" />
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-start gap-5 border-t hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-h4 font-semibold text-fg">Have a project in mind?</p>
                    <Link href="/contact" className="btn btn-accent btn-lg">
                        <BtnLabel>Start a conversation</BtnLabel>
                        <BtnIcon>
                            <FiArrowUpRight size={18} />
                        </BtnIcon>
                    </Link>
                </div>
            </div>
        </section>
    );
}
