/**
 * Single source of truth for everything the site says.
 * Home, /about, /projects, /experience, /contact, the menu and the résumé
 * chatbot all read from here, so a fact only has to be corrected once.
 *
 * Sources: the July 2026 résumé (authoritative where it differs), the
 * earlier site, and the README of each project in ~/Desktop/Propjects.
 */

/* ── Identity ──────────────────────────────────────────────────────── */

export const profile = {
    name: "Atharva Kale",
    firstName: "Atharva",
    lastName: "Kale",
    initials: "AK",
    role: "AI & Backend Engineer",
    company: "Onit",
    city: "Pune",
    location: "Pune, India",
    timeZone: "Asia/Kolkata",
    email: "atharva.skale07@gmail.com",
    github: "https://github.com/atharvakale07082000",
    linkedin: "https://www.linkedin.com/in/atharva-kale-7b0b53177/",
    resume: "/Atharva_Kale_CV.pdf",
    /** Set NEXT_PUBLIC_SITE_URL in production; Vercel provides its own URL. */
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : "http://localhost:3000"),
    /**
     * ISO date of birth, e.g. "2000-08-07". While null, the age clause on
     * /about is left out entirely; it is never rendered on the server.
     */
    dateOfBirth: null as string | null,
    /** Path under /public, e.g. "/portrait.jpg". While null a monogram card stands in. */
    portrait: null as string | null,
    /** The claim, not the job title. */
    statement:
        "I build agent systems that show their work — and the backend that keeps them up under load.",
    intro:
        "AI engineer building multi-agent platforms, text-to-SQL systems and production RAG — on a backend designed for the day the traffic arrives.",
    /** Real specialisms, in order. The hero's routing line resolves to these. */
    routeTo: ["agent systems", "retrieval", "backend at load"],
    yearsShipping: "2+",
};

export type Social = {
    label: string;
    handle: string;
    href: string;
    external: boolean;
};

export const socials: Social[] = [
    { label: "GitHub", handle: "@atharvakale07082000", href: profile.github, external: true },
    { label: "LinkedIn", handle: "in/atharva-kale", href: profile.linkedin, external: true },
    { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: "Résumé", handle: "PDF · 1 page", href: profile.resume, external: false },
];

/* ── Home: about statement + favourite stack ───────────────────────── */

export const aboutStatement =
    "I work on the unglamorous half of applied AI — holding a model's output to a contract, keeping retrieval fast enough to use, and making a pipeline degrade honestly instead of hanging.";
export const aboutAccent = ["contract", "honestly", "fast"];

export const aboutIntro =
    "I'm Atharva, an AI & Backend engineer at Onit in Pune. I build agentic text-to-SQL, production RAG and the Python services underneath them — and the React front ends for my own systems when they need one.";

export const aboutApproach = {
    title: "How I work",
    body: "Measure first, then let the model write the words. Every agent I ship streams its reasoning, announces its waits and carries evals into CI, so the system can tell you what it is doing — and so can the person using it.",
};

/** Icon keys resolve in components/system/TechIcon.tsx. */
export const favoriteStack = [
    { name: "Python", icon: "python" },
    { name: "FastAPI", icon: "fastapi" },
    { name: "LangGraph", icon: "langgraph" },
    { name: "Strands Agents", icon: "strands" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Redis", icon: "redis" },
    { name: "AWS", icon: "aws" },
    { name: "Docker", icon: "docker" },
] as const;

/* ── Services ──────────────────────────────────────────────────────── */

export type Service = {
    id: "agents" | "retrieval" | "backend";
    index: string;
    title: string;
    short: string;
    body: string;
    points: string[];
    tech: string[];
};

export const services: Service[] = [
    {
        id: "agents",
        index: "01",
        title: "Agentic AI systems",
        short: "Multi-agent platforms that route, reason and stay honest.",
        body: "Orchestrators that make one structured routing call per turn, specialists that load skills on demand, human-in-the-loop interrupts for high-impact actions, and a reasoning stream users can actually read.",
        points: [
            "Structured-output routing across specialist agents",
            "Interrupts and human-in-the-loop delegates",
            "Evals suite wired into CI/CD before ship",
        ],
        tech: ["Strands Agents", "LangGraph", "CrewAI", "MCP", "Langfuse"],
    },
    {
        id: "retrieval",
        index: "02",
        title: "RAG & text-to-SQL",
        short: "Retrieval and query agents that answer from your data.",
        body: "Retrieval pipelines over mixed document formats and text-to-SQL agents over live multi-tenant schemas — cached, streamed and measured, so answers arrive in seconds, not half a minute.",
        points: [
            "Text-to-SQL over 11–50 table tenant schemas",
            "Hybrid retrieval on Pinecone, Qdrant, ChromaDB",
            "Token streaming over SSE while the work runs",
        ],
        tech: ["LangChain", "Pinecone", "ChromaDB", "Redis", "RAGAS"],
    },
    {
        id: "backend",
        index: "03",
        title: "Backend at scale",
        short: "Python services that stay fast when the traffic arrives.",
        body: "Microservices on FastAPI with async queues, ETL on MongoDB and Redis, RBAC and AWS deployments — the infrastructure that keeps an AI feature up while thousands of people use it.",
        points: [
            "API latency taken from 3s to 200ms",
            "Async queues for 10× ingestion throughput",
            "RBAC across 6 roles, deployed on AWS",
        ],
        tech: ["FastAPI", "RabbitMQ", "Celery", "PostgreSQL", "AWS"],
    },
];

/* ── Works (home gallery) ──────────────────────────────────────────── */

export type Tone = "blue" | "indigo" | "purple" | "pink" | "orange" | "green" | "teal";

/** CSS colour for a tone token, with optional alpha. */
export const tone = (t: Tone, a = 1) => `rgb(var(--sys-${t}-rgb) / ${a})`;

export type Work = {
    slug: string;
    title: string;
    kind: string;
    year: string;
    outcome: string;
    summary: string;
    metric: { value: string; label: string };
    tech: string[];
    links: { live?: string; github?: string };
    /** Screenshot under /public/works/<slug>/. Absent → designed poster only. */
    image?: string;
    /** Two Apple system tints (tokens in globals.css) for poster and backdrop. */
    tone: [Tone, Tone];
    team?: boolean;
};

export const works: Work[] = [
    {
        slug: "atelier",
        image: "/works/atelier/chat-reasoning.webp",
        title: "Atelier",
        kind: "AI tutor platform",
        year: "2025",
        outcome: "One routing call per turn, five specialists, one streamed voice.",
        summary:
            "A Strands orchestrator returns an ordered plan of specialists — doubt, quiz, curriculum, progress, assistant — and streams them back over SSE. Skills load on demand, reasoning streams apart from the answer, and Elo mastery mapped to Bloom sets the difficulty of everything generated next.",
        metric: { value: "200", label: "concurrent users" },
        tech: ["FastAPI", "Strands Agents", "NVIDIA NIM", "MongoDB", "React", "SSE"],
        links: {
            live: "https://ai-based-tutor.vercel.app",
            github: "https://github.com/atharvakale07082000/ai-based-tutor",
        },
        tone: ["blue", "indigo"],
    },
    {
        slug: "neuralscope",
        image: "/works/neuralscope/trace-waterfall.webp",
        title: "NeuralScope",
        kind: "AI observability platform",
        year: "2026",
        outcome: "Traces, prompt versions and cost for every LLM call and agent step.",
        summary:
            "Full-stack observability for agentic systems: a waterfall and DAG trace explorer, a versioned prompt registry with diffs and A/B deploys, token and cost intelligence per model, a replay studio for past traces, and threshold alerts on errors, cost and latency.",
        metric: { value: "5", label: "observability modules" },
        tech: ["FastAPI", "Beanie", "MongoDB", "Redis", "React", "Recharts"],
        links: { github: "https://github.com/atharvakale07082000" },
        tone: ["green", "blue"],
    },
    {
        slug: "aevum",
        image: "/works/aevum/decision-ai-summary.webp",
        title: "Aevum",
        kind: "Collaborative decision platform",
        year: "2026",
        outcome: "Every number is measured; the model only writes the words.",
        summary:
            "Real-time team decisions with weighted voting and an immutable outcome. I built the AI service: Strands agents that narrate measured vote shares, turnout and role divergence, fall back to deterministic templates without a model, and borrow the caller's token so there is no new tenant boundary to get wrong.",
        metric: { value: "4", label: "AI panels, 0 invented numbers" },
        tech: ["Strands Agents", "FastAPI", "Spring Boot", "PostgreSQL", "Redis", "WebSocket"],
        links: { github: "https://github.com/atharvakale07082000/aevum_ai" },
        tone: ["orange", "pink"],
        team: true,
    },
    {
        slug: "echo",
        image: "/works/echo/terminal-session.webp",
        title: "ECHO",
        kind: "Local multi-agent voice assistant",
        year: "2025",
        outcome: "20+ on-device agents behind a six-tier permission engine.",
        summary:
            "A fully local macOS assistant on Apple Silicon. A planner builds each task as a DAG and runs it through specialised agents with system access, while every action passes a permission engine with audit logging, snapshots and rollback, and secrets are redacted before any log or model call.",
        metric: { value: "100%", label: "on-device" },
        tech: ["Python", "Ollama", "Llama 3.2", "faster-whisper", "Playwright"],
        links: { github: "https://github.com/atharvakale07082000" },
        tone: ["purple", "indigo"],
    },
    {
        slug: "doc-intelligence",
        title: "Document Intelligence",
        kind: "RAG chatbot",
        year: "2025",
        outcome: "Chat over 85+ document formats, answered in the stream.",
        summary:
            "A retrieval pipeline over PDF, DOCX, PPTX and dozens more formats. Gemini generates, ChromaDB holds the vectors, MongoDB holds session metadata, and SSE token streaming keeps the page responsive while long documents are still being processed.",
        metric: { value: "+35%", label: "engagement" },
        tech: ["FastAPI", "Gemini", "ChromaDB", "MongoDB", "SSE"],
        links: { github: "https://github.com/atharvakale07082000" },
        tone: ["teal", "blue"],
    },
];

/* ── Projects archive (/projects) ──────────────────────────────────── */

export type Spec = { label: string; value: string };

export const atelier = {
    tagline: "An adaptive learning platform that thinks out loud.",
    period: "Jan 2025 — present",
    specs: [
        { label: "Routing", value: "1 LLM call / turn" },
        { label: "Specialists", value: "5 agents · 10 skills" },
        { label: "Tool registry", value: "14 adapters" },
        { label: "Concurrency", value: "64 threads · 200 users" },
    ] satisfies Spec[],
    mechanics: [
        {
            label: "Orchestrator routing",
            body: "Every turn goes through one tool-less LLM call that returns a structured RoutePlan — an ordered list of specialist keys plus a one-line reason. A keyword heuristic is kept only for the error path.",
        },
        {
            label: "Progressive-disclosure skills",
            body: "Ten SKILL.md packages follow the Agent Skills spec. Only name and description sit in a specialist's prompt; the body arrives when the agent calls load_skill.",
        },
        {
            label: "Reasoning, not tool traces",
            body: "The stream adapter splits a first-person reasoning note out of the token stream and sends it as its own event. Tool names, arguments and latencies are kept for evaluation, never sent to the client.",
        },
        {
            label: "Resumable interviews",
            body: "The live module interview is an interrupt-driven agent persisted to a session, so a reloaded tab rejoins at the question it left off on.",
        },
        {
            label: "Elo mapped to Bloom",
            body: "Proficiency runs 0–1000 across Bloom's six levels; mastery lands at 700. Each quiz moves it by clamp(current + 32 × (score − expected)), which sets the next difficulty.",
        },
        {
            label: "Honest backpressure",
            body: "A sliding-window token bucket holds calls to the NIM free tier's 40 rpm. When a request has to wait, the delay is announced as a reasoning event instead of a silent stall.",
        },
    ],
    verified: [
        { label: "Test suite", value: "184 passing" },
        { label: "Datastore", value: "MongoDB only" },
    ] satisfies Spec[],
};

export type ArchiveItem = {
    title: string;
    period: string;
    brief: string;
    tags: string[];
    href?: string;
    note?: string;
};

export const archive: ArchiveItem[] = [
    {
        title: "Text-to-SQL agent",
        period: "2026 — present",
        brief: "Multi-agent text-to-SQL on Strands over live multi-tenant schemas of 11–50 tables. Per-tenant schema caching in Redis took end-to-end query time from 30s to 11s with a 4s time-to-first-token; human-in-the-loop interrupts pause high-impact queries for confirmation.",
        tags: ["Strands Agents", "Redis", "Evals in CI", "HITL"],
        note: "Production work at Onit",
    },
    {
        title: "AlfaKinetic",
        period: "Aug 2025 — Jun 2026",
        brief: "GenAI and agentic systems for a competitive-intelligence platform serving global biopharma. A LangChain RAG chatbot cut latency 60% and cost 2×, and won the Rolls-Royce Excellence Award for shipping early.",
        tags: ["LangChain", "Hugging Face", "FastAPI", "RabbitMQ", "AWS"],
        note: "Production work at Anervea",
    },
    {
        title: "Résumé Screening & Similarity",
        period: "Aug 2023 — Dec 2023",
        brief: "Supervised NLP screening and skill matching at 94% test accuracy, with entity extraction that improved workflow efficiency by 15%.",
        tags: ["NLP", "TensorFlow", "Python"],
        href: profile.github,
    },
    {
        title: "Amazon Reviews Sentiment",
        period: "Feb 2023 — Apr 2023",
        brief: "Sentiment classification over a BigQuery warehouse of Amazon reviews at 92.22% accuracy, used to flag reviews whose language did not match their rating.",
        tags: ["BigQuery", "NLP", "Python"],
        href: profile.github,
    },
];

/* ── Skills ────────────────────────────────────────────────────────── */

/** Physics orbs on the home page. AI and backend first; four frontend. */
export const orbSkills = [
    { name: "Python", icon: "python", color: "#3776AB" },
    { name: "LangChain", icon: "langchain", color: "#1C3C3C" },
    { name: "LangGraph", icon: "langgraph", color: "#2F6868" },
    { name: "CrewAI", icon: "crewai", color: "#FF5A50" },
    { name: "PyTorch", icon: "pytorch", color: "#EE4C2C" },
    { name: "Hugging Face", icon: "huggingface", color: "#FFB000" },
    { name: "Gemini", icon: "gemini", color: "#8E75B2" },
    { name: "Ollama", icon: "ollama", color: "#3A3A3C" },
    { name: "FastAPI", icon: "fastapi", color: "#009688" },
    { name: "Pydantic", icon: "pydantic", color: "#E92063" },
    { name: "RabbitMQ", icon: "rabbitmq", color: "#FF6600" },
    { name: "Celery", icon: "celery", color: "#37814A" },
    { name: "Redis", icon: "redis", color: "#DC382D" },
    { name: "MongoDB", icon: "mongodb", color: "#47A248" },
    { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
    { name: "AWS", icon: "aws", color: "#FF9900" },
    { name: "Docker", icon: "docker", color: "#2496ED" },
    { name: "Kubernetes", icon: "kubernetes", color: "#326CE5" },
    { name: "GitHub Actions", icon: "githubactions", color: "#2088FF" },
    { name: "Google Cloud", icon: "googlecloud", color: "#4285F4" },
    { name: "React", icon: "react", color: "#149ECA" },
    { name: "Next.js", icon: "nextjs", color: "#111111" },
    { name: "TypeScript", icon: "typescript", color: "#3178C6" },
    { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
] as const;

export type SkillGroup = {
    title: string;
    description: string;
    /** Levels are self-assessed, 0–100. Adjust freely. */
    skills: { name: string; level: number }[];
};

export const skillGroups: SkillGroup[] = [
    {
        title: "Generative & agentic AI",
        description:
            "Multi-agent orchestration, retrieval and text-to-SQL, with evals and tracing treated as part of the feature, not an afterthought.",
        skills: [
            { name: "Agent orchestration — Strands, LangGraph, CrewAI", level: 92 },
            { name: "RAG pipelines & vector search", level: 90 },
            { name: "Text-to-SQL agents", level: 86 },
            { name: "Evals & observability — RAGAS, DeepEval, Langfuse", level: 82 },
            { name: "LLM APIs — OpenAI, Gemini, Bedrock, NIM", level: 88 },
            { name: "PyTorch & classic NLP", level: 70 },
        ],
    },
    {
        title: "Backend, data & messaging",
        description:
            "Python services designed for load: async APIs, queues, caches and ETL, with auth and access control built in from the start.",
        skills: [
            { name: "Python — FastAPI, Flask, Pydantic", level: 94 },
            { name: "Microservices & distributed systems", level: 86 },
            { name: "Queues — RabbitMQ, Celery, Kafka", level: 82 },
            { name: "MongoDB, PostgreSQL, Redis", level: 88 },
            { name: "Vector DBs — Pinecone, Qdrant, ChromaDB, FAISS", level: 86 },
            { name: "Auth, RBAC & API design", level: 84 },
        ],
    },
    {
        title: "Cloud, DevOps & frontend",
        description:
            "Shipping it: containers, CI/CD with evals in the pipeline, AWS in production — and the React front ends for my own systems.",
        skills: [
            { name: "AWS — EC2, S3, Lambda, RDS, SQS, Bedrock", level: 84 },
            { name: "Docker & GitHub Actions CI/CD", level: 86 },
            { name: "GCP & Vertex AI", level: 72 },
            { name: "Linux, Git, Playwright automation", level: 84 },
            { name: "React, Next.js & TypeScript", level: 72 },
            { name: "Tailwind CSS & UI build", level: 68 },
        ],
    },
];

export const coreConcepts = [
    "RAG",
    "Agentic workflows",
    "Text-to-SQL",
    "MCP",
    "Human-in-the-loop",
    "Evals in CI",
    "SSE streaming",
    "Structured output",
    "Async queues",
    "RBAC",
    "ETL pipelines",
    "Rate limiting & backpressure",
];

/* ── Experience ────────────────────────────────────────────────────── */

export type Role = {
    title: string;
    period: string;
    current?: boolean;
    highlights: string[];
    stack: string[];
};

export type Company = {
    name: string;
    location: string;
    period: string;
    summary: string;
    roles: Role[];
};

export const experience: Company[] = [
    {
        name: "Onit",
        location: "Pune, India",
        period: "Jul 2026 — present",
        summary: "Legal and enterprise workflow software. I build its agentic text-to-SQL layer.",
        roles: [
            {
                title: "AI Engineer",
                period: "Jul 2026 — present",
                current: true,
                highlights: [
                    "Building a dynamic text-to-SQL agent that turns natural-language questions into executable queries against live, multi-tenant production schemas of 11 to 50 tables per tenant.",
                    "Designed a multi-agent architecture on Strands Agents with per-tenant schemas cached in Redis, cutting end-to-end query time from 30s to 11s with a 4s time-to-first-token.",
                    "Integrated interrupts and human-in-the-loop delegates that pause on ambiguous or high-impact queries and resume with the corrected context.",
                    "Built a custom evals suite and dashboard and wired it into CI/CD to catch regressions before ship.",
                ],
                stack: ["Strands Agents", "Redis", "Python", "Evals in CI"],
            },
        ],
    },
    {
        name: "Anervea Data Labs",
        location: "Pune, India",
        period: "Sep 2024 — Jun 2026",
        summary: "GenAI competitive intelligence for global biopharma clients.",
        roles: [
            {
                title: "Senior Backend & AI Engineer",
                period: "Aug 2025 — Jun 2026",
                highlights: [
                    "Led development of GenAI and agentic AI systems for a competitive-intelligence platform serving global biopharma clients.",
                    "Created an LLM-powered RAG chatbot with LangChain and Hugging Face, cutting latency 60% and cost 2× — awarded the Rolls-Royce Excellence Award for shipping ahead of schedule.",
                    "Architected a microservices backend on FastAPI with RabbitMQ async queues, taking ingestion throughput to 10×.",
                    "Migrated the Care-Easy diabetes chatbot to an agentic RAG workflow in four days, replacing static retrieval with tool-driven decisions.",
                    "Managed a three-engineer team delivering 45+ features in a two-week sprint; implemented RBAC across six roles and deployed on AWS.",
                ],
                stack: ["LangChain", "Hugging Face", "FastAPI", "RabbitMQ", "AWS"],
            },
            {
                title: "Backend Engineer",
                period: "Sep 2024 — Aug 2025",
                highlights: [
                    "Designed high-performance APIs on FastAPI and Flask, taking response latency from 3s to 200ms.",
                    "Built ETL pipelines on MongoDB and Redis powering real-time analytics for client dashboards.",
                    "Developed automation pipelines with Playwright, Selenium and Celery, improving throughput 3×.",
                    "Owned 4+ backend services across two client environments on a two-week sprint cadence.",
                ],
                stack: ["FastAPI", "Flask", "MongoDB", "Redis", "Celery", "Playwright"],
            },
        ],
    },
    {
        name: "Netra Labs",
        location: "Pune, India",
        period: "Aug 2024 — Sep 2024",
        summary: "Data-analytics applications.",
        roles: [
            {
                title: "Python Full Stack Developer, Intern",
                period: "Aug 2024 — Sep 2024",
                highlights: [
                    "Cut front-end load times by 25% across data-analytics applications with Next.js and React Query, lifting measured usability and engagement by 15%.",
                ],
                stack: ["Next.js", "React Query", "Python"],
            },
        ],
    },
];

export const impact = [
    { metric: "30s → 11s", body: "End-to-end text-to-SQL query time on dynamic tenant schemas, with a 4s time-to-first-token." },
    { metric: "−60%", body: "Latency on a production RAG chatbot, alongside a 2× cut in cost." },
    { metric: "10×", body: "Data-ingestion throughput after moving to FastAPI microservices on RabbitMQ queues." },
    { metric: "3s → 200ms", body: "API response latency after redesigning the FastAPI and Flask service layer." },
    { metric: "4 days", body: "To migrate a diabetes-care chatbot from static retrieval to an agentic RAG workflow." },
    { metric: "45+", body: "Features shipped in a two-week sprint, leading a team of three engineers." },
    { metric: "3×", body: "Throughput on automation pipelines built with Playwright, Selenium and Celery." },
];

export const education = [
    {
        degree: "M.S. Computer Science",
        school: "MIT World Peace University, Pune",
        period: "2022 — 2024",
        note: "CGPA 8.14",
    },
    {
        degree: "B.Sc. Computer Science",
        school: "Ramnarain Ruia Autonomous College, Mumbai",
        period: "2018 — 2021",
        note: "CGPA 7.33",
    },
];

export const recognition = [
    { title: "Rolls-Royce Excellence Award", detail: "For delivering a production RAG chatbot ahead of schedule" },
    { title: "AWS Machine Learning Foundations", detail: "Certified, 2024" },
    { title: "Cloud Native Technologies", detail: "Professional certificate — Kubernetes & Docker, 2024" },
];

/* ── /about ────────────────────────────────────────────────────────── */

export const aboutFacts = [
    "Based in Pune, India",
    "AI Engineer at Onit",
    `${profile.yearsShipping} years shipping to production`,
    "Rolls-Royce Excellence Award",
    "M.S. Computer Science",
];

export const story = [
    {
        text: "I started on the backend — APIs, ETL and scraping pipelines — and took one service from three seconds to two hundred milliseconds. That habit of measuring first never left.",
        accent: ["measuring"],
    },
    {
        text: "Now I build agents that show their work: they stream their reasoning, announce their waits and pause for a human when the stakes are high. When a system tells you what it is doing, you can trust it.",
        accent: ["show", "trust"],
    },
];

export const principles = [
    {
        title: "Measure, then let the model write",
        body: "Numbers come from code. The model narrates them and is forbidden from inventing any.",
        icon: "measure",
    },
    {
        title: "Degrade honestly, never wrong",
        body: "Without a model the service still answers, says which mode it is in, and keeps the same figures.",
        icon: "shield",
    },
    {
        title: "Show the reasoning, hide the plumbing",
        body: "Users see what the agent is thinking. Tool names, arguments and latencies go to evals, not the UI.",
        icon: "eye",
    },
    {
        title: "Context on demand",
        body: "Prompts carry names and descriptions; full instructions load only when the work needs them.",
        icon: "layers",
    },
    {
        title: "Evals before ship",
        body: "A regression suite runs in CI so a prompt change is tested like a code change.",
        icon: "check",
    },
    {
        title: "Backpressure you can see",
        body: "When a rate limit makes the system wait, it says so instead of stalling in silence.",
        icon: "gauge",
    },
] as const;

/* ── Contact ───────────────────────────────────────────────────────── */

export const contactTopics = ["AI / agents", "Backend", "Full-time role", "Consulting", "Just saying hi"];

/* ── Testimonials ──────────────────────────────────────────────────── */

export type Testimonial = { quote: string; name: string; role: string };

/** Empty until real quotes exist. The Reviews section and menu item only
 *  render when this list has entries. */
export const testimonials: Testimonial[] = [];
