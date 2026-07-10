"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, ArrowUpRight } from "lucide-react";

const featured = {
    title: "Atelier — AI Tutor Platform",
    tagline: "An adaptive learning platform that thinks out loud.",
    description:
        "Five specialist ReAct agents route through a keyword + LLM router, then stream every thought, tool call, and token to the learner in real time over Server-Sent Events. Mastery is tracked with an Elo system mapped to Bloom's taxonomy.",
    specs: [
        ["Agents", "5 specialists"],
        ["Tools", "13-tool registry"],
        ["Throughput", "200 concurrent"],
        ["Tests", "190 passing"],
    ],
    demoUrl: "https://ai-based-tutor.vercel.app",
    githubUrl: "https://github.com/atharvakale07082000/ai-based-tutor",
};

const projects = [
    {
        title: "Document Intelligence",
        description:
            "Production RAG over multi-format documents with Gemini, vector embeddings, and SSE streaming.",
        tags: ["FastAPI", "Next.js", "ChromaDB"],
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "AlfaKinetic Platform",
        description:
            "GenAI competitive-intelligence backend. LangChain RAG pipelines cut retrieval latency by 60%.",
        tags: ["LangChain", "Kafka", "Pinecone"],
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "Resume Screening ML",
        description:
            "Supervised NLP model reaching 94% test accuracy, built and tuned with TensorFlow.",
        tags: ["NLP", "TensorFlow"],
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "Amazon Reviews Sentiment",
        description:
            "NLP sentiment model on a BigQuery warehouse, reaching 92.22% accuracy.",
        tags: ["BigQuery", "Python"],
        link: "https://github.com/atharvakale07082000",
    },
];

// Signature: the frosted status capsule cycles real facts about the work.
const STATUS = ["200 concurrent users", "190 tests passing", "SSE token streaming", "60% lower latency"];

function StatusCapsule() {
    const [i, setI] = useState(0);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;
        const id = setInterval(() => setI((v) => (v + 1) % STATUS.length), 2600);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="glass inline-flex items-center gap-2.5 rounded-full pl-3.5 pr-4 py-2 shadow-sm">
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="mono text-[12.5px] text-muted tabular-nums overflow-hidden h-[16px] w-[168px]">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={i}
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -14, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="block whitespace-nowrap"
                    >
                        {STATUS[i]}
                    </motion.span>
                </AnimatePresence>
            </span>
        </div>
    );
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
    return (
        <div className="bg-canvas">
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-5 md:px-8 pt-40 pb-24 md:pt-52 md:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="flex flex-col items-center text-center"
                >
                    <p className="eyebrow text-[15px] md:text-[17px] mb-5">Backend &amp; AI Engineer</p>

                    <h1 className="display w-full text-[15vw] leading-[0.95] sm:text-[13vw] md:text-[112px] md:leading-[0.92]">
                        <span className="text-graphite">Atharva Kale</span>
                    </h1>

                    <p className="text-[19px] md:text-[24px] text-muted font-normal tracking-tight w-full max-w-2xl mt-7 leading-snug">
                        I build streaming multi-agent systems and RAG pipelines — turning
                        generative models into reliable, high-throughput infrastructure.
                    </p>

                    <div className="mt-8">
                        <StatusCapsule />
                    </div>

                    <div className="mt-9 flex items-center gap-6 flex-wrap justify-center">
                        <Link
                            href="/projects"
                            className="btn-primary inline-flex items-center gap-1.5 px-6 py-3 text-[15px]"
                        >
                            View work
                            <ArrowRight size={17} />
                        </Link>
                        <a
                            href="/Atharva_Kale_CV (1).pdf"
                            download
                            className="link-chevron inline-flex items-center gap-0.5 text-[15px]"
                        >
                            Download résumé
                            <ChevronRight size={16} />
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ── Featured: the one bold, dark product tile ────────── */}
            <section className="max-w-6xl mx-auto px-5 md:px-8 pb-8">
                <motion.a
                    href={featured.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease }}
                    className="tile-dark group block px-7 py-10 md:px-16 md:py-16 overflow-hidden"
                >
                    <p className="eyebrow text-[13px] md:text-[14px] mb-4" style={{ color: "var(--color-accentbright)" }}>
                        Featured · Live
                    </p>
                    <h2 className="display text-[34px] md:text-[54px] text-white max-w-3xl">
                        {featured.title}
                    </h2>
                    <p className="text-[18px] md:text-[22px] text-white/60 font-normal tracking-tight mt-4 max-w-2xl leading-snug">
                        {featured.tagline}
                    </p>
                    <p className="text-[15px] md:text-[16px] text-white/50 font-normal leading-relaxed mt-5 max-w-2xl">
                        {featured.description}
                    </p>

                    {/* Apple "tech specs" strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-10 max-w-3xl">
                        {featured.specs.map(([label, value]) => (
                            <div key={label} className="spec-row-dark pt-4">
                                <div className="mono text-[12px] uppercase tracking-wider text-white/40">
                                    {label}
                                </div>
                                <div className="text-[17px] md:text-[19px] font-medium text-white mt-1">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 mt-11 flex-wrap">
                        <span className="btn-glass inline-flex items-center gap-1.5 px-5 py-2.5 text-[14px]">
                            Open live app
                            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                        <a
                            href={featured.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/70 hover:text-white text-[14px] font-medium inline-flex items-center gap-0.5 transition-colors"
                        >
                            View source
                            <ChevronRight size={15} />
                        </a>
                    </div>
                </motion.a>
            </section>

            {/* ── Selected work grid ───────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-32">
                <div className="flex items-end justify-between mb-9">
                    <h2 className="display text-[30px] md:text-[40px] text-ink">Selected work</h2>
                    <Link
                        href="/projects"
                        className="link-chevron inline-flex items-center gap-0.5 text-[15px] pb-1"
                    >
                        All projects
                        <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {projects.map((project, i) => (
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.06, ease }}
                            className="card group p-8 md:p-9 flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-ink leading-tight group-hover:text-accent transition-colors">
                                    {project.title}
                                </h3>
                                <ArrowUpRight
                                    size={20}
                                    className="text-muted shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                                />
                            </div>
                            <p className="text-[15px] text-muted font-normal leading-relaxed mt-3">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-7 pt-6 spec-row">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="mono text-[11px] tracking-tight text-muted bg-surface rounded-full px-3 py-1"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>
        </div>
    );
}
