"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
    {
        title: "Document Intelligence (RAG)",
        description: "Production-grade RAG system enabling real-time chat over multi-format documents using Gemini and vector embeddings with SSE streaming.",
        tags: ["Python", "FastAPI", "Next.js", "ChromaDB"],
        colSpan: "md:col-span-2 lg:col-span-2",
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "AlfaKinetic Platform",
        description: "GenAI-driven competitive intelligence platform with 60% reduced retrieval latency via LangChain.",
        tags: ["GenAI", "Kafka", "Pinecone"],
        colSpan: "md:col-span-1 lg:col-span-1",
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "Resume Screening ML",
        description: "Supervised NLP algorithm achieving 94% testing accuracy for talent assessment workflows.",
        tags: ["NLP", "TensorFlow"],
        colSpan: "md:col-span-1 lg:col-span-1",
        link: "https://github.com/atharvakale07082000",
    },
    {
        title: "Amazon Reviews Sentiment",
        description: "NLP-based sentiment model utilizing BigQuery, achieving 92.22% accuracy.",
        tags: ["BigQuery", "Python"],
        colSpan: "md:col-span-2 lg:col-span-1",
        link: "https://github.com/atharvakale07082000",
    }
];

export default function Home() {
    return (
        <main className="relative min-h-screen z-0 pb-32">
            {/* The Stripe Ethereal Mesh Background */}
            <div className="mesh-bg"></div>

            <div className="container mx-auto px-6 lg:px-12 pt-40 relative z-10">
                {/* Hero Section: Brutalist Typography */}
                <div className="mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white leading-[0.85] mb-8">
                            ATHARVA <br />
                            <span className="text-white/40">KALE.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-medium tracking-tight text-white/80 max-w-2xl mt-12">
                            Senior Backend & AI Engineer. <br />
                            Transforming complex generative models into reliable, high-throughput production infrastructure.
                        </p>

                        <div className="mt-12 flex gap-6 items-center flex-wrap">
                            <Link href="/projects" className="brutalist-card px-8 py-4 font-bold tracking-tight text-lg flex items-center gap-2 group">
                                View Work
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="/Atharva_Kale_CV (1).pdf" download className="text-white font-bold tracking-tight hover:underline hover:text-white/80 transition-colors border-b-2 border-white/30 pb-1 hover:border-white">
                                Download Resume
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* The Grid: Stripe-esque delicate cards on Brutalist structure */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">Selected <br /> Works.</h2>
                        <Link href="/projects" className="text-white/80 hover:text-white font-bold tracking-tighter uppercase text-sm flex items-center gap-2 mb-2">
                            All Archives <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project, i) => (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={i}
                                className={`brutalist-card p-8 flex flex-col justify-between group ${project.colSpan}`}
                            >
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-4 text-black group-hover:text-blue-600 transition-colors uppercase leading-none">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium leading-relaxed mb-8 text-lg">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ExternalLink size={18} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
