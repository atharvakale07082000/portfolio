"use client";

import { motion } from "framer-motion";
import { Code, Database, Brain, Terminal, Cloud, Globe } from "lucide-react";

const skills = [
    {
        category: "Generative AI & LLMs",
        icon: <Brain className="w-6 h-6 text-primary" />,
        items: ["OpenAI", "LLaMA", "Mistral", "RAG Pipelines", "LangChain", "LangGraph", "CrewAI", "Pinecone", "FAISS"],
    },
    {
        category: "Backend Engineering",
        icon: <Terminal className="w-6 h-6 text-secondary" />,
        items: ["Python", "FastAPI", "Flask", "Celery", "Kafka", "REST APIs", "Microservices"],
    },
    {
        category: "Cloud & DevOps",
        icon: <Cloud className="w-6 h-6 text-blue-400" />,
        items: ["AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "CI/CD"],
    },
    {
        category: "Databases",
        icon: <Database className="w-6 h-6 text-purple-400" />,
        items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "DocumentDB"],
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">About Me</h1>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-sm">
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            I am a <span className="text-primary font-semibold">Senior Backend & AI Engineer</span> based in Pune, Maharashtra.
                            Currently, I lead the backend and AI architecture at <span className="text-secondary font-semibold">Anervea Data Labs</span>,
                            building next-gen competitive intelligence platforms driven by Generative AI.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            My expertise lies in architecting scalable RAG pipelines, optimizing high-throughput microservices, and deploying
                            production-ready AI agents. I bridge the gap between complex ML research and robust software engineering,
                            ensuring that intelligent systems are not just theoretical, but performant and reliable.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            I hold a Master's in Computer Science from MIT World Peace University and have a strong foundation in
                            cloud-native technologies, having earned certifications in Kubernetes and AWS Machine Learning.
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-8">Technical Arsenal</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-navy/50 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                        {skill.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{skill.category}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skill.items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/5"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
