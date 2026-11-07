"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useState } from "react";
import { LayoutGroup, m } from "framer-motion";

/* Retrieval, made visible: choose a question and the chunks re-rank by
   similarity, with the top three handed to the model. Scores are a mock. */

const CHUNKS = [
    { id: "q3", src: "Q3-report.pdf · p.12", text: "Revenue in oncology grew 18% on two new approvals…" },
    { id: "trial", src: "trials.docx · §4", text: "Phase III enrolment closed in March with 1,240 patients…" },
    { id: "deck", src: "board-deck.pptx · slide 7", text: "Competitor pipeline: three assets enter Phase II in 2026…" },
    { id: "faq", src: "faq.md", text: "Access is role-based; analysts cannot export raw tables…" },
    { id: "sql", src: "schema: tenants.orders", text: "orders(id, tenant_id, amount, region, created_at)…" },
];

const QUERIES: { q: string; scores: Record<string, number> }[] = [
    { q: "How did oncology revenue move last quarter?", scores: { q3: 0.91, deck: 0.62, trial: 0.48, sql: 0.31, faq: 0.12 } },
    { q: "Which competitor assets are entering Phase II?", scores: { deck: 0.93, trial: 0.71, q3: 0.44, faq: 0.15, sql: 0.09 } },
    { q: "Total order value by region this month", scores: { sql: 0.88, q3: 0.41, faq: 0.33, deck: 0.18, trial: 0.1 } },
];

export default function RagDemo() {
    const reduce = useReducedMotion();
    const [qi, setQi] = useState(0);
    const { scores } = QUERIES[qi];
    const ranked = [...CHUNKS].sort((a, b) => scores[b.id] - scores[a.id]);

    return (
        <div className="flex h-full flex-col gap-[2.4cqw] p-[4cqw] text-[2.5cqw] leading-snug text-white">
            <div className="flex flex-wrap gap-[1.4cqw]" role="group" aria-label="Sample queries">
                {QUERIES.map((item, i) => (
                    <button
                        key={item.q}
                        type="button"
                        onClick={() => setQi(i)}
                        aria-pressed={qi === i}
                        className={`rounded-full border px-[2.4cqw] py-[1cqw] text-left transition-colors ${
                            qi === i ? "border-transparent bg-white text-ink-2" : "border-white/25 text-white/80 hover:text-white"
                        }`}
                    >
                        {item.q}
                    </button>
                ))}
            </div>
            <LayoutGroup>
                <ol className="flex flex-1 flex-col gap-[1.4cqw]" aria-label="Retrieved chunks, best first">
                    {ranked.map((c, i) => (
                        <m.li
                            key={c.id}
                            layout={!reduce}
                            transition={{ type: "spring", stiffness: 380, damping: 34 }}
                            className={`relative overflow-hidden rounded-[1.8cqw] border px-[2.4cqw] py-[1.6cqw] ${
                                i < 3 ? "border-white/50 bg-white/15" : "border-white/10 bg-black/15 text-white/55"
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-0 left-0 w-full origin-left bg-white/10 transition-transform duration-700 ease-out"
                                style={{ transform: `scaleX(${scores[c.id]})` }}
                            />
                            <span className="relative flex items-baseline justify-between gap-[2cqw]">
                                <span className="truncate font-mono text-[2.1cqw] opacity-80">{c.src}</span>
                                <span className="font-mono text-[2.1cqw] tabular-nums">{scores[c.id].toFixed(2)}</span>
                            </span>
                            <span className="relative mt-[0.4cqw] block truncate">{c.text}</span>
                        </m.li>
                    ))}
                </ol>
            </LayoutGroup>
            <p className="font-mono text-[2.1cqw] text-white/70">top-k = 3 → context → model · streamed over SSE</p>
        </div>
    );
}
