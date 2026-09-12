"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import StreamStatement from "@/components/StreamStatement";
import TraceRail from "@/components/TraceRail";
import { atelier, profile, projects, routeTo } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

const spans = [
    { id: "ident", label: "ident" },
    { id: "atelier", label: "atelier" },
    { id: "archive", label: "archive" },
];

/* The four specialists the orchestrator routes to, plus the fallback.
   Rendered as one typographic line rather than a diagram — the shape of
   the system, stated the way the system states it. */
const route = ["doubt", "quiz", "curriculum", "progress", "assistant"];

const rest = projects.filter((p) => p.slug !== "atelier");

export default function Home() {
    return (
        <div>
            <TraceRail spans={spans} />

            {/* ── Identity ───────────────────────────────────────────── */}
            <section
                id="ident"
                className="max-w-[1180px] mx-auto px-5 md:px-8 pt-32 pb-20 md:pt-44 md:pb-28"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="telemetry text-graphite mb-7">
                        {profile.role} · {profile.location}
                    </p>

                    <h1 className="display display-tight t-hero text-ink mb-9">
                        Atharva
                        <br />
                        Kale
                    </h1>

                    <StreamStatement statement={profile.statement} routes={routeTo} />

                    <div className="mt-11 flex flex-wrap items-center gap-3">
                        <Link href="/projects" className="btn btn-signal">
                            See the work
                            <ArrowRight size={16} />
                        </Link>
                        <a href={profile.resume} download className="btn btn-quiet">
                            <Download size={15} />
                            Résumé
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ── Featured: Atelier ──────────────────────────────────── */}
            <section id="atelier" className="max-w-[1180px] mx-auto px-5 md:px-8 pb-24 md:pb-32">
                <motion.article
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease }}
                    className="panel"
                >
                    <div className="p-6 sm:p-9 md:p-14">
                        {/* Live marker — the only pulse on the site, on the one
                            thing that is actually live. */}
                        <div className="flex items-center gap-2.5 mb-7">
                            <span className="relative inline-flex w-2 h-2 shrink-0">
                                <span className="pulse-ring" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-signal" />
                            </span>
                            <span className="telemetry text-signal">Featured · live</span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <h2 className="display display-tight t-h1 text-ink">{atelier.title}</h2>
                            <p className="telemetry text-graphite">{atelier.subtitle}</p>
                        </div>

                        <p className="display t-h3 text-ink mt-5 max-w-2xl font-semibold tracking-[-0.025em] leading-[1.15]">
                            {atelier.tagline}
                        </p>

                        <p className="text-[16px] md:text-[17px] text-graphite mt-6 max-w-2xl leading-[1.65]">
                            {atelier.summary}
                        </p>

                        {/* The route, stated. */}
                        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 overflow-x-auto">
                            <span className="telemetry text-ink">orchestrator</span>
                            <span className="telemetry text-signal" aria-hidden="true">
                                &rarr;
                            </span>
                            {route.map((agent, i) => (
                                <span key={agent} className="flex items-center gap-2">
                                    {i > 0 && (
                                        <span className="telemetry text-rule-strong" aria-hidden="true">
                                            ·
                                        </span>
                                    )}
                                    <span className="tag">{agent}</span>
                                </span>
                            ))}
                        </div>

                        {/* Numbers. */}
                        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 mt-12">
                            {atelier.specs.map((spec) => (
                                <div key={spec.label} className="rule-t pt-3.5 pb-1">
                                    <dt className="telemetry text-graphite">{spec.label}</dt>
                                    <dd className="numeral text-[15px] md:text-[16px] font-medium text-ink mt-1.5">
                                        {spec.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {/* Mechanics — how it actually works. */}
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-0 mt-12">
                            {atelier.mechanics.map((item) => (
                                <div key={item.label} className="rule-t py-5">
                                    <h3 className="telemetry text-ink mb-2">{item.label}</h3>
                                    <p className="text-[15px] text-graphite leading-[1.6]">
                                        {item.body}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Verified claims — the only teal on the page. */}
                        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-9">
                            {atelier.verified.map((item) => (
                                <p key={item.label} className="telemetry text-verified">
                                    {item.label} &nbsp;{item.value}
                                </p>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-11">
                            <a
                                href={atelier.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-signal"
                            >
                                Open the live app
                                <ArrowUpRight size={16} />
                            </a>
                            <a
                                href={atelier.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-quiet"
                            >
                                Read the source
                                <ArrowUpRight size={15} />
                            </a>
                        </div>
                    </div>
                </motion.article>
            </section>

            {/* ── Archive preview ────────────────────────────────────── */}
            <section id="archive" className="max-w-[1180px] mx-auto px-5 md:px-8 pb-28 md:pb-36">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <h2 className="display t-h2 text-ink">Also built</h2>
                    <Link href="/projects" className="link-signal inline-flex items-center gap-1.5 text-[15px]">
                        Full archive
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {rest.map((project, i) => {
                        const href = project.demoUrl || project.githubUrl;
                        const Wrapper = href ? "a" : "div";
                        return (
                            <motion.div
                                key={project.slug}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                            >
                                <Wrapper
                                    {...(href
                                        ? {
                                              href,
                                              target: "_blank",
                                              rel: "noopener noreferrer",
                                          }
                                        : {})}
                                    className="panel panel-hover group h-full flex flex-col p-6 md:p-7"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="display text-[19px] md:text-[20px] tracking-[-0.025em] text-ink leading-tight">
                                            {project.title}
                                        </h3>
                                        <span className="numeral text-[12px] text-graphite shrink-0 pt-0.5">
                                            {project.year}
                                        </span>
                                    </div>

                                    <p className="text-[15px] text-graphite leading-[1.6] mt-3 flex-grow">
                                        {project.brief}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mt-6">
                                        {project.tags.slice(0, 4).map((tag) => (
                                            <span key={tag} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {href && (
                                        <span className="link-signal inline-flex items-center gap-1 text-[13px] mt-5">
                                            View
                                            <ArrowUpRight
                                                size={13}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </span>
                                    )}
                                </Wrapper>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
