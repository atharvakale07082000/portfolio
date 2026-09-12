"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";

const capabilities = [
    {
        group: "Agents & LLMs",
        items:
            "Strands Agents · LangChain · LangGraph · CrewAI · NVIDIA NIM · OpenAI · Gemini · Hugging Face Inference · structured-output routing · progressive-disclosure skills · guardrails · DeepEval",
    },
    {
        group: "Retrieval",
        items: "RAG pipeline design · Pinecone · Qdrant · ChromaDB · FAISS · Elasticsearch · embedding + chunking strategy",
    },
    {
        group: "Backend",
        items: "Python · FastAPI · Flask · Celery · Kafka · Server-Sent Events · REST · microservices · async concurrency · rate limiting & backpressure",
    },
    {
        group: "Data",
        items: "MongoDB (Motor) · PostgreSQL · Redis · DocumentDB · BigQuery · ETL pipelines",
    },
    {
        group: "Platform",
        items: "AWS (EC2, S3, Lambda, RDS, DynamoDB) · Docker · Kubernetes · Terraform · GitHub Actions · structlog · Langfuse",
    },
];

const credentials = [
    {
        label: "M.S. Computer Science",
        detail: "MIT World Peace University · 2022–2024 · CGPA 8.14",
    },
    {
        label: "B.Sc. Computer Science",
        detail: "Ramnarain Ruia Autonomous College · 2018–2021 · CGPA 7.33",
    },
    { label: "AWS Machine Learning Foundations", detail: "Certified 2024" },
    {
        label: "Cloud Native Technologies",
        detail: "Professional certificate, Kubernetes & Docker · 2024",
    },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
    return (
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-32 pb-28 md:pt-44 md:pb-36">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <p className="telemetry text-signal mb-6">About</p>
                <h1 className="display display-tight t-h1 text-ink max-w-3xl">
                    Make the system say what it&apos;s doing.
                </h1>

                <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 mt-12">
                    <div className="lg:col-span-7 space-y-6 text-[17px] md:text-[18px] text-graphite leading-[1.7]">
                        <p>
                            I&apos;m a <span className="text-ink font-medium">Senior Backend &amp; AI Engineer</span>{" "}
                            at <span className="text-ink font-medium">Anervea Data Labs</span> in{" "}
                            {profile.location}, where I lead the backend and AI architecture behind
                            AlfaKinetic — a GenAI competitive-intelligence platform.
                        </p>
                        <p>
                            Most of my work is the unglamorous half of applied AI: holding a
                            model&apos;s output to a contract, keeping retrieval fast enough to be
                            usable, and making a pipeline degrade honestly instead of hanging. A
                            generative feature is only as good as the system that has to stay up
                            while thousands of people use it.
                        </p>
                        <p>
                            The thread through the projects here is legibility. Agents that stream
                            their reasoning instead of hiding it. Rate limits that announce the wait
                            rather than stalling in silence. Interviews that survive a page reload.
                            When a system tells you what it&apos;s doing, you can debug it — and so
                            can the person using it.
                        </p>
                        <p>
                            Before Anervea I was building data-extraction and ETL infrastructure,
                            and I took an API from seven seconds to under a hundred milliseconds,
                            which is still the change I&apos;m most pleased with.
                        </p>
                    </div>

                    <aside className="lg:col-span-5 lg:col-start-9">
                        <h2 className="telemetry text-graphite rule-b pb-3">Credentials</h2>
                        <dl>
                            {credentials.map((item) => (
                                <div key={item.label} className="rule-b py-4">
                                    <dt className="text-[15px] font-medium text-ink">{item.label}</dt>
                                    <dd className="text-[13.5px] text-graphite mt-1">{item.detail}</dd>
                                </div>
                            ))}
                        </dl>
                        <a href={profile.resume} download className="btn btn-quiet mt-6">
                            Download résumé
                        </a>
                    </aside>
                </div>
            </motion.div>

            {/* Capabilities */}
            <section className="mt-24 md:mt-32">
                <h2 className="telemetry text-graphite mb-2">Capabilities</h2>
                <dl>
                    {capabilities.map((cap, i) => (
                        <motion.div
                            key={cap.group}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.45, delay: i * 0.05, ease }}
                            className="rule-t grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 py-6"
                        >
                            <dt className="md:col-span-3 display text-[17px] tracking-[-0.025em] text-ink">
                                {cap.group}
                            </dt>
                            <dd className="md:col-span-9 text-[15px] text-graphite leading-[1.7]">
                                {cap.items}
                            </dd>
                        </motion.div>
                    ))}
                </dl>
            </section>
        </div>
    );
}
