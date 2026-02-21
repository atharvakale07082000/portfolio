"use client";

import { motion } from "framer-motion";
import { Database, Brain, Terminal, Cloud } from "lucide-react";

const skills = [
    {
        category: "Generative AI",
        icon: <Brain strokeWidth={1.5} />,
        items: "OpenAI, LLaMA, Mistral, RAG, LangChain, CrewAI, Pinecone, FAISS",
    },
    {
        category: "Backend",
        icon: <Terminal strokeWidth={1.5} />,
        items: "Python, FastAPI, Flask, Celery, Kafka, REST, Microservices",
    },
    {
        category: "Cloud",
        icon: <Cloud strokeWidth={1.5} />,
        items: "AWS, Docker, Kubernetes, Terraform, CI/CD",
    },
    {
        category: "Databases",
        icon: <Database strokeWidth={1.5} />,
        items: "PostgreSQL, MongoDB, Redis, Elasticsearch",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen py-16 md:py-32 px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
            >
                <div className="px-8 py-16 md:px-20 md:py-24">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-12">
                        ABOUT.
                    </h1>

                    <div className="space-y-8 text-lg md:text-xl text-gray-700 font-medium leading-[1.8]">
                        <p>
                            I am a <span className="text-black font-bold">Senior Backend & AI Engineer</span> based in Pune, Maharashtra.
                            Currently, I navigate the complexities of AI architecture at <span className="text-blue-600 font-bold">Anervea Data Labs</span>.
                        </p>
                        <p>
                            My focus is strictly on the intersection of deep machine learning logic and scalable software systems. I build structures that turn theoretical generative models into high-throughput, latency-optimized production value.
                        </p>
                        <p>
                            Holding a Master's in Computer Science from MIT World Peace University and certified in AWS Machine Learning, my engineering philosophy revolves around rigorous simplicity—removing the friction between huge data streams and real-time user insights.
                        </p>
                    </div>

                    <hr className="my-16 border-gray-200" />

                    <h2 className="text-2xl font-bold tracking-tight text-black mb-10">
                        TECHNICAL ARSENAL
                    </h2>

                    <div className="flex flex-col space-y-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                className="group flex flex-col md:flex-row md:items-start gap-4 p-4 -ml-4 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-gray-400 group-hover:text-blue-600 transition-colors mt-1">
                                    {skill.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black tracking-tight">{skill.category}</h3>
                                    <p className="text-gray-500 font-medium mt-1 leading-relaxed">{skill.items}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
