"use client";

import { motion } from "framer-motion";

const skills = [
    { category: "Generative AI", items: "OpenAI · LLaMA · Mistral · RAG · LangChain · LangGraph · CrewAI · Pinecone · FAISS" },
    { category: "Backend", items: "Python · FastAPI · Flask · Celery · Kafka · REST · Microservices" },
    { category: "Cloud & DevOps", items: "AWS · Docker · Kubernetes · Terraform · CI/CD" },
    { category: "Data & Search", items: "PostgreSQL · MongoDB · Redis · Elasticsearch" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
    return (
        <div className="bg-canvas min-h-screen">
            <div className="max-w-3xl mx-auto px-5 md:px-8 pt-36 pb-32 md:pt-44">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                >
                    <p className="eyebrow text-[15px] mb-4">About</p>
                    <h1 className="display text-[44px] md:text-[64px] text-ink mb-12">
                        Rigorous simplicity.
                    </h1>

                    <div className="space-y-7 text-[19px] md:text-[22px] text-muted font-normal leading-[1.55] tracking-tight">
                        <p>
                            I&apos;m a <span className="text-ink font-medium">Backend &amp; AI Engineer</span> based in
                            Pune, currently shaping the AI architecture at{" "}
                            <span className="text-ink font-medium">Anervea Data Labs</span>.
                        </p>
                        <p>
                            My work lives at the intersection of deep machine-learning logic and
                            scalable software systems — building the structures that turn theoretical
                            generative models into high-throughput, latency-optimized production value.
                        </p>
                        <p>
                            I hold a Master&apos;s in Computer Science from MIT World Peace University and
                            an AWS Machine Learning certification. My engineering philosophy is about
                            removing friction between huge data streams and real-time user insight.
                        </p>
                    </div>
                </motion.div>

                <div className="mt-20">
                    <h2 className="mono text-[12px] uppercase tracking-wider text-muted mb-2">
                        Technical specifications
                    </h2>
                    <div className="mt-4">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: index * 0.06, ease }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 py-6 spec-row"
                            >
                                <h3 className="text-[17px] font-medium text-ink tracking-tight">
                                    {skill.category}
                                </h3>
                                <p className="md:col-span-2 text-[16px] text-muted font-normal leading-relaxed">
                                    {skill.items}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
