/**
 * Single source of truth for everything the site says about the work.
 * Home, Projects and the résumé chatbot all read from here, so a fact
 * only ever has to be corrected in one place.
 */

export type Spec = { label: string; value: string };

export type Project = {
    slug: string;
    title: string;
    tagline: string;
    /** One paragraph. What it is and what is interesting about how it works. */
    summary: string;
    /** Short form for the dense archive table. */
    brief: string;
    period: string;
    year: string;
    tags: string[];
    githubUrl?: string;
    demoUrl?: string;
    live?: boolean;
};

/* ── The flagship ──────────────────────────────────────────────────── */

export const atelier = {
    slug: "atelier",
    title: "Atelier",
    subtitle: "AI Tutor Platform",
    tagline: "An adaptive learning platform that thinks out loud.",
    summary:
        "A Strands orchestrator makes one structured-output call per turn and returns an ordered plan of specialists — doubt, quiz, curriculum, progress, assistant — then streams them back as a single voice over Server-Sent Events. Specialists carry only a skill's name and description in their prompt and pull the full instruction body on demand, so context stays small until the work needs it.",
    demoUrl: "https://ai-based-tutor.vercel.app",
    githubUrl: "https://github.com/atharvakale07082000/ai-based-tutor",
    period: "Jan 2025 — present",

    /** The numbers, as tech-spec rows. */
    specs: [
        { label: "Routing", value: "1 LLM call / turn" },
        { label: "Specialists", value: "5 agents · 10 skills" },
        { label: "Tool registry", value: "14 adapters" },
        { label: "Concurrency", value: "64 threads · 200 users" },
    ] satisfies Spec[],

    /** The decisions worth reading about. Each one is a real mechanism. */
    mechanics: [
        {
            label: "Orchestrator routing",
            body: "Every turn goes through one tool-less LLM call that returns a structured RoutePlan — an ordered list of specialist keys plus a one-line reason. A deterministic keyword heuristic is kept only for the error path, not as the primary router.",
        },
        {
            label: "Progressive-disclosure skills",
            body: "Ten SKILL.md packages follow the Agent Skills spec. Only name and description are injected into a specialist's prompt; the body arrives when the agent calls load_skill and asks for it.",
        },
        {
            label: "Reasoning, not tool traces",
            body: "The stream adapter splits a first-person reasoning note out of the token stream and sends it as its own event. Tool names, arguments and latencies are captured for evaluation but never reach the client.",
        },
        {
            label: "Resumable interviews",
            body: "The live module interview is an interrupt-driven agent persisted to a session, so a reloaded tab rejoins a running interview at the question it left off on instead of losing it.",
        },
        {
            label: "Elo mapped to Bloom",
            body: "Proficiency runs 0–1000 and maps onto Bloom's six levels; mastery lands at 700. Each quiz updates it by clamp(current + 32 × (score − expected)), which then sets the difficulty of the next generation.",
        },
        {
            label: "Honest backpressure",
            body: "A sliding-window token bucket holds outbound calls to the NIM free tier's 40 rpm. When a request has to wait, the delay is announced as a reasoning event rather than stalling the stream in silence.",
        },
    ],

    stack: [
        "FastAPI",
        "Strands Agents",
        "NVIDIA NIM",
        "React 18",
        "TypeScript",
        "SSE",
        "MongoDB",
        "DeepEval",
    ],

    /** Verified claims — rendered in the "verified" teal, nothing else is. */
    verified: [
        { label: "Test suite", value: "184 passing" },
        { label: "Datastore", value: "MongoDB only" },
    ] satisfies Spec[],
};

/* ── The archive ───────────────────────────────────────────────────── */

export const projects: Project[] = [
    {
        slug: "atelier",
        title: "Atelier — AI Tutor Platform",
        tagline: atelier.tagline,
        summary: atelier.summary,
        brief:
            "A Strands orchestrator routes each turn to five specialists and streams one voice back over SSE. Skills load on demand, reasoning streams separately from the answer, and module interviews survive a page reload. Elo proficiency mapped to Bloom's taxonomy sets the difficulty of everything generated next. 184 tests, MongoDB as the only datastore.",
        period: atelier.period,
        year: "2025",
        tags: atelier.stack,
        githubUrl: atelier.githubUrl,
        demoUrl: atelier.demoUrl,
        live: true,
    },
    {
        slug: "document-intelligence",
        title: "Document Intelligence Chatbot",
        tagline: "Chat over a folder of mixed-format documents.",
        summary:
            "A retrieval pipeline over PDF, DOCX and PPTX that answers in the stream rather than after it. Gemini generates, ChromaDB holds the vectors, MongoDB holds session metadata, and SSE keeps the page responsive while long documents are still being processed.",
        brief:
            "Retrieval over PDF, DOCX and PPTX with Gemini, ChromaDB vectors and MongoDB session metadata. Answers stream over SSE so the page stays responsive while long documents are still processing.",
        period: "Oct 2025 — Dec 2025",
        year: "2025",
        tags: ["FastAPI", "Next.js", "Gemini", "ChromaDB", "SSE"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
    {
        slug: "alfakinetic",
        title: "AlfaKinetic",
        tagline: "Competitive intelligence, assembled in real time.",
        summary:
            "The backend and AI architecture behind a GenAI competitive-intelligence platform. LangChain retrieval over Pinecone and Qdrant cut retrieval latency by 60%, and FastAPI services fronted by Kafka and Celery took data ingestion and semantic search to 10× the throughput they started at.",
        brief:
            "Backend and AI architecture for a GenAI competitive-intelligence platform. LangChain retrieval over Pinecone and Qdrant cut retrieval latency 60%; FastAPI, Kafka and Celery took ingestion throughput to 10×.",
        period: "Aug 2025 — present",
        year: "2025",
        tags: ["LangChain", "FastAPI", "Kafka", "Celery", "Pinecone", "Qdrant"],
    },
    {
        slug: "resume-screening",
        title: "Résumé Screening & Similarity",
        tagline: "Ranking candidates without reading every file.",
        summary:
            "A supervised NLP model that screens résumés and scores similarity against a role, reaching 94% test accuracy. Built and tuned in TensorFlow, with word-cloud analysis used to sanity-check what the model was actually keying on.",
        brief:
            "Supervised NLP screening and similarity scoring at 94% test accuracy, built and tuned in TensorFlow, with word-cloud analysis used to check what the model was keying on.",
        period: "Aug 2023 — Dec 2023",
        year: "2023",
        tags: ["NLP", "TensorFlow", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
    {
        slug: "amazon-sentiment",
        title: "Amazon Reviews Sentiment",
        tagline: "Sentiment at warehouse scale.",
        summary:
            "A sentiment model run against a BigQuery warehouse of Amazon reviews at 92.22% accuracy, used to flag reviews whose language did not match their rating and to pull consumer-behaviour signal out of the remainder.",
        brief:
            "Sentiment classification over a BigQuery warehouse of Amazon reviews at 92.22% accuracy, used to flag reviews whose language did not match their rating.",
        period: "Feb 2023 — Apr 2023",
        year: "2023",
        tags: ["BigQuery", "NLP", "Python"],
        githubUrl: "https://github.com/atharvakale07082000",
    },
];

/* ── Identity ──────────────────────────────────────────────────────── */

export const profile = {
    name: "Atharva Kale",
    role: "Backend & AI Engineer",
    location: "Pune, India",
    email: "atharva.skale07@gmail.com",
    github: "https://github.com/atharvakale07082000",
    linkedin: "https://www.linkedin.com/in/atharva-kale-7b0b53177/",
    resume: "/Atharva_Kale_CV.pdf",
    /** The claim, not the job title. Streams in on the home page. */
    statement:
        "I build agent systems that show their work — and the backend that keeps them up under load.",
};

/** What the hero's routing line resolves to. Real specialisms, ordered. */
export const routeTo = ["agent systems", "retrieval", "backend at load"];
