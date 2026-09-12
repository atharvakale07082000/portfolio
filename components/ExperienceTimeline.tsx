"use client";

import { motion } from "framer-motion";

type Role = {
    role: string;
    company: string;
    period: string;
    location: string;
    /** The single most useful number from the role. */
    headline: { label: string; value: string };
    work: string[];
    stack: string[];
};

const roles: Role[] = [
    {
        role: "Senior Backend & AI Engineer",
        company: "Anervea Data Labs",
        period: "Aug 2025 — Present",
        location: "Pune",
        headline: { label: "Retrieval latency", value: "−60%" },
        work: [
            "Lead the backend and AI architecture for AlfaKinetic, a GenAI competitive-intelligence platform serving real-time business insight.",
            "Architected the retrieval layer on LangChain, Hugging Face and vector stores (Pinecone, Qdrant), cutting retrieval latency by 60%.",
            "Designed the Python service tier on FastAPI, Kafka and Celery, taking ingestion and semantic-search throughput to 10× where it started.",
            "Set the GenAI roadmap with leadership and mentor engineers on LLM system design and CI/CD.",
        ],
        stack: ["Python", "FastAPI", "LangChain", "Kafka", "Celery", "Pinecone", "Qdrant"],
    },
    {
        role: "Backend Engineer",
        company: "Anervea Data Labs",
        period: "Sep 2024 — Aug 2025",
        location: "Pune",
        headline: { label: "API response", value: "7s → <100ms" },
        work: [
            "Rebuilt the REST layer and its backend workflows, taking API response time from seven seconds to under a hundred milliseconds.",
            "Built automated extraction systems on Playwright, Selenium and Celery that tripled research throughput.",
            "Implemented resilient ETL pipelines on MongoDB and Redis for low-latency real-time analytics.",
        ],
        stack: ["Python", "Playwright", "Selenium", "Celery", "MongoDB", "Redis"],
    },
    {
        role: "Python Full-Stack Developer, Intern",
        company: "Netra Labs",
        period: "Aug 2024 — Sep 2024",
        location: "Pune",
        headline: { label: "Front-end load", value: "−25%" },
        work: [
            "Cut front-end load times by 25% across data-analytics applications with Next.js and React Query.",
            "Those gains carried through to a 15% lift in measured usability and engagement.",
        ],
        stack: ["Next.js", "React Query", "JavaScript", "Python"],
    },
];

export default function ExperienceTimeline() {
    return (
        <div>
            {roles.map((role, i) => (
                <motion.article
                    key={`${role.company}-${role.period}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="rule-t grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-5 py-9 md:py-12"
                >
                    {/* When + the one number */}
                    <div className="md:col-span-3">
                        <p className="telemetry text-graphite">{role.period}</p>
                        <p className="telemetry text-graphite/80 mt-1.5">{role.location}</p>

                        <div className="mt-6">
                            <p className="telemetry text-graphite">{role.headline.label}</p>
                            <p className="numeral text-[22px] md:text-[26px] font-medium text-signal mt-1 leading-none">
                                {role.headline.value}
                            </p>
                        </div>
                    </div>

                    {/* What */}
                    <div className="md:col-span-9">
                        <h3 className="display text-[22px] md:text-[26px] tracking-[-0.03em] text-ink leading-tight">
                            {role.role}
                        </h3>
                        <p className="text-[16px] text-graphite mt-1">{role.company}</p>

                        <ul className="mt-6 space-y-3">
                            {role.work.map((item) => (
                                <li
                                    key={item}
                                    className="relative pl-5 text-[16px] text-graphite leading-[1.65]"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-[11px] w-2 h-px bg-rule-strong"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 mt-6">
                            {role.stack.map((tech) => (
                                <span key={tech} className="tag">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.article>
            ))}
        </div>
    );
}
