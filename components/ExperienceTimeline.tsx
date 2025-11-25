"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

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
        period: "August 2025 – Present",
        location: "Pune, Maharashtra",
        description: [
            "Leading backend and AI architecture for AlfaKinetic, a GenAI-driven Competitive Intelligence platform.",
            "Architected RAG pipelines using LangChain, Hugging Face, and Vector DBs (Pinecone, Qdrant), cutting data retrieval latency by 60%.",
            "Designed scalable Python microservices with FastAPI, Kafka, and Celery, enabling 10× higher throughput.",
            "Partnered with leadership to define the GenAI roadmap and mentored engineers on LLM system design."
        ],
        technologies: ["Python", "FastAPI", "LangChain", "Pinecone", "Kafka", "Celery"],
    },
    {
        id: 2,
        role: "Backend Engineer",
        company: "Anervea Data Labs",
        period: "September 2024 – August 2025",
        location: "Pune, Maharashtra",
        description: [
            "Developed high-performance REST APIs reducing latency from 7s to <100ms.",
            "Built automated data extraction systems using Playwright, Celery, and Selenium, boosting throughput by 3×.",
            "Implemented resilient ETL pipelines and integrated MongoDB + Redis for real-time analytics.",
        ],
        technologies: ["Python", "Playwright", "Selenium", "MongoDB", "Redis"],
    },
    {
        id: 3,
        role: "Python Full Stack Developer Intern",
        company: "Netra Labs",
        period: "August 2024 - September 2024",
        location: "Pune, Maharashtra",
        description: [
            "Reduced front-end load times by 25% using modern JavaScript frameworks such as NextJS and ReactQuery.",
            "Improved usability and engagement by 15% in data analytics applications."
        ],
        technologies: ["Next.js", "ReactQuery", "JavaScript", "Python"],
    },
];

export default function ExperienceTimeline() {
    return (
        <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-12">
            {experiences.map((exp, index) => (
                <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative pl-8 md:pl-12"
                >
                    {/* Dot */}
                    <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-navy" />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                        <span className="hidden sm:inline text-gray-600">•</span>
                        <span className="text-primary font-medium">{exp.company}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Calendar size={14} />
                        {exp.period}
                        <span className="text-gray-600">|</span>
                        <span>{exp.location}</span>
                    </div>

                    <ul className="list-disc list-outside ml-4 text-gray-300 mb-4 space-y-2">
                        {exp.description.map((item, i) => (
                            <li key={i} className="leading-relaxed">{item}</li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-secondary border border-white/5"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
