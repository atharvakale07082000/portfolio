"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

const projects = [
    {
        title: "Document Intelligence Chatbot (RAG)",
        description: "Production-grade RAG system enabling real-time chat over multi-format documents using Gemini and vector embeddings with SSE streaming.",
        tags: ["FastAPI", "Next.js 15", "Gemini", "ChromaDB"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2025"
    },
    {
        title: "AlfaKinetic Platform",
        description: "Architected backend and AI infrastructure for a GenAI-driven platform. RAG pipelines using LangChain and Vector DBs reduced retrieval latency by 60%.",
        tags: ["LangChain", "FastAPI", "Kafka", "Pinecone"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2025"
    },
    {
        title: "Resume Screening ML",
        description: "Supervised NLP algorithm for resume screening achieving 94% testing accuracy, built and fine-tuned with TensorFlow.",
        tags: ["NLP", "TensorFlow", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2024"
    },
    {
        title: "Amazon Reviews Sentiment",
        description: "NLP-based sentiment analysis model using Google BigQuery for data warehousing, achieving 92.22% accuracy.",
        tags: ["BigQuery", "Python", "NLP"],
        githubUrl: "https://github.com/atharvakale07082000",
        year: "2024"
    },
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen py-16 md:py-32 px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
            >
                <div className="px-8 py-16 md:px-20 md:py-24">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-6 uppercase">
                            Archive.
                        </h1>
                        <p className="text-xl text-gray-500 font-medium tracking-tight max-w-2xl leading-relaxed">
                            A comprehensive log of my engineering work, from generative models to high-performance microservices.
                        </p>
                    </div>

                    {/* Table Header (Desktop only) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <div className="col-span-1">Year</div>
                        <div className="col-span-4">Project</div>
                        <div className="col-span-5">Built With</div>
                        <div className="col-span-2 text-right">Link</div>
                    </div>

                    <div className="flex flex-col">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={index}
                                index={index}
                                {...project}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
