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
        <div className="space-y-16">
            {experiences.map((exp, index) => (
                <motion.div
                    key={exp.id}
                    initial={{ opacity: 0.3, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-6 sm:pl-10 group"
                >
                    {/* The refined dot marker */}
                    <div className="absolute left-0 top-2.5 w-[8px] h-[8px] sm:w-[12px] sm:h-[12px] rounded-full bg-white border-[2px] border-gray-300 group-hover:border-blue-600 group-hover:bg-blue-600 transition-colors duration-500 hidden sm:block" />

                    <div className="mb-4">
                        <h3 className="text-2xl font-black tracking-tight text-black leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {exp.role}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                            <span className="text-gray-800 font-bold tracking-tight text-lg">{exp.company}</span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="text-gray-500 font-medium text-sm tracking-wide opacity-80">{exp.period}</span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-6 text-gray-600 text-[1.05rem] leading-[1.7] font-medium">
                        {exp.description.map((item, i) => (
                            <li key={i} className="pl-4 relative">
                                <span className="absolute left-0 top-2.5 w-1 h-1 rounded-full bg-gray-300" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-2.5 py-1 bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors border border-gray-100 text-xs font-bold uppercase tracking-wider rounded-md"
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
