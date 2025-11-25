"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

const projects = [
    {
        title: "AlfaKinetic (Competitive Intelligence Platform)",
        description: "Architected the backend and AI infrastructure for a GenAI-driven platform. Implemented RAG pipelines using LangChain and Vector DBs, reducing retrieval latency by 60%. Designed scalable microservices handling high-throughput data ingestion.",
        tags: ["GenAI", "RAG", "LangChain", "FastAPI", "Kafka", "Pinecone"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
    {
        title: "Resume Screening & Similarity Analysis",
        description: "Developed a supervised learning algorithm using NLP for resume screening, achieving 94% testing accuracy. Built and fine-tuned ML models with TensorFlow to improve talent assessment workflows.",
        tags: ["NLP", "Machine Learning", "TensorFlow", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
    {
        title: "Sentiment Analysis of Amazon Reviews",
        description: "Built an NLP-based sentiment analysis model using Google BigQuery for data warehousing, achieving 92.22% accuracy. Provided actionable insights into consumer behavior.",
        tags: ["NLP", "Google BigQuery", "Data Warehousing", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
    {
        title: "Automated Data Extraction System",
        description: "Built automated data extraction systems using Playwright, Celery, and Selenium, boosting research throughput by 3× for Anervea Data Labs.",
        tags: ["Playwright", "Celery", "Selenium", "Python", "Automation"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h1>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            A collection of my work in AI engineering, backend development, and system architecture.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={index}
                                index={index}
                                {...project}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
