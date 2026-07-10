"use client";

import { motion } from "framer-motion";

interface ExperienceItem {
    id: number;
    role: string;
    company: string;
    period: string;
    location: string;
    description: string[];
    technologies: string[];
}

const experiences: ExperienceItem[] = [
    {
        id: 1,
        role: "Senior Backend & AI Engineer",
        company: "Anervea Data Labs",
        period: "Aug 2025 — Present",
        location: "Pune, Maharashtra",
        description: [
            "Leading backend and AI architecture for AlfaKinetic, a GenAI-driven competitive-intelligence platform.",
            "Architected RAG pipelines with LangChain, Hugging Face, and vector DBs (Pinecone, Qdrant), cutting retrieval latency by 60%.",
            "Designed scalable Python microservices with FastAPI, Kafka, and Celery, enabling 10× higher throughput.",
            "Partnered with leadership to define the GenAI roadmap and mentored engineers on LLM system design.",
        ],
        technologies: ["Python", "FastAPI", "LangChain", "Pinecone", "Kafka", "Celery"],
    },
    {
        id: 2,
        role: "Backend Engineer",
        company: "Anervea Data Labs",
        period: "Sep 2024 — Aug 2025",
        location: "Pune, Maharashtra",
        description: [
            "Developed high-performance REST APIs, reducing latency from 7s to under 100ms.",
            "Built automated data-extraction systems with Playwright, Celery, and Selenium, boosting throughput 3×.",
            "Implemented resilient ETL pipelines and integrated MongoDB + Redis for real-time analytics.",
        ],
        technologies: ["Python", "Playwright", "Selenium", "MongoDB", "Redis"],
    },
    {
        id: 3,
        role: "Python Full-Stack Developer Intern",
        company: "Netra Labs",
        period: "Aug 2024 — Sep 2024",
        location: "Pune, Maharashtra",
        description: [
            "Cut front-end load times by 25% using Next.js and React Query.",
            "Improved usability and engagement by 15% across data-analytics applications.",
        ],
        technologies: ["Next.js", "React Query", "JavaScript", "Python"],
    },
];

export default function ExperienceTimeline() {
    return (
        <div className="relative">
            {/* Hairline spine */}
            <div className="absolute left-[5px] top-3 bottom-3 w-px bg-hairline hidden sm:block" />

            <div className="space-y-14">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                        transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className="relative sm:pl-10 group"
                    >
                        {/* Dot */}
                        <div className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full bg-canvas border-2 border-hairline group-hover:border-accent group-hover:bg-accent transition-colors duration-500 hidden sm:block" />

                        <div className="mono text-[12px] uppercase tracking-wider text-muted mb-2">
                            {exp.period} · {exp.location}
                        </div>
                        <h3 className="text-[24px] md:text-[26px] font-semibold tracking-tight text-ink leading-tight">
                            {exp.role}
                        </h3>
                        <div className="text-[16px] text-accent font-medium mt-0.5">{exp.company}</div>

                        <ul className="space-y-2.5 mt-5 text-[16px] text-muted leading-relaxed font-normal">
                            {exp.description.map((item, i) => (
                                <li key={i} className="pl-4 relative">
                                    <span className="absolute left-0 top-[10px] w-1 h-1 rounded-full bg-hairline" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-2 mt-5">
                            {exp.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="mono text-[11px] tracking-tight text-muted bg-surface rounded-full px-3 py-1"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
