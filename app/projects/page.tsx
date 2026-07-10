"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

const projects = [
    {
        title: "Atelier — AI Tutor Platform",
        description:
            "Adaptive learning platform powered by a multi-agent ReAct system. Five specialist agents route through a keyword + LLM router, then run a streaming ReAct loop over a 13-tool registry — every thought, tool call, and token pushed live via Server-Sent Events. Elo-based mastery mapped to Bloom's taxonomy, a 64-thread pool for 200 concurrent users, Langfuse observability, 190 passing tests.",
        tags: ["FastAPI", "React", "ReAct Agents", "LangGraph", "Together AI", "SSE", "MongoDB", "Langfuse"],
        githubUrl: "https://github.com/atharvakale07082000/ai-based-tutor",
        demoUrl: "https://ai-based-tutor.vercel.app",
        year: "2025",
    },
    {
        title: "Document Intelligence Chatbot (RAG)",
        description:
            "Production-grade RAG system enabling real-time chat over multi-format documents using Gemini and vector embeddings with SSE streaming.",
        tags: ["FastAPI", "Next.js 15", "Gemini", "ChromaDB"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2025",
    },
    {
        title: "AlfaKinetic Platform",
        description:
            "Architected backend and AI infrastructure for a GenAI-driven platform. RAG pipelines using LangChain and Vector DBs reduced retrieval latency by 60%.",
        tags: ["LangChain", "FastAPI", "Kafka", "Pinecone"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2025",
    },
    {
        title: "Resume Screening ML",
        description:
            "Supervised NLP algorithm for resume screening achieving 94% testing accuracy, built and fine-tuned with TensorFlow.",
        tags: ["NLP", "TensorFlow", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2024",
    },
    {
        title: "Amazon Reviews Sentiment",
        description:
            "NLP-based sentiment analysis model using Google BigQuery for data warehousing, achieving 92.22% accuracy.",
        tags: ["BigQuery", "Python", "NLP"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2024",
    },
];

export default function ProjectsPage() {
    return (
        <div className="bg-canvas min-h-screen">
            <div className="max-w-5xl mx-auto px-5 md:px-8 pt-36 pb-32 md:pt-44">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14"
                >
                    <p className="eyebrow text-[15px] mb-4">Archive</p>
                    <h1 className="display text-[44px] md:text-[64px] text-ink">
                        Everything I&apos;ve shipped.
                    </h1>
                    <p className="text-[18px] md:text-[21px] text-muted font-normal tracking-tight max-w-2xl mt-5 leading-snug">
                        A complete log of my engineering work — from streaming multi-agent
                        systems to high-throughput data infrastructure.
                    </p>
                </motion.div>

                {/* Column header (desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-6 pb-4 mono text-[11px] uppercase tracking-wider text-muted">
                    <div className="col-span-1">Year</div>
                    <div className="col-span-5">Project</div>
                    <div className="col-span-5">Built with</div>
                    <div className="col-span-1 text-right">Link</div>
                </div>

                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} index={index} {...project} />
                    ))}
                </div>
            </div>
        </div>
    );
}
