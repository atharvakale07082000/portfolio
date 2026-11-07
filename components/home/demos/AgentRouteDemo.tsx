"use client";

import { useEffect, useRef, useState } from "react";

/* A live mock of a structured-output router: pick a question, the router
   returns an ordered plan, the chosen specialists run in order and one
   voice answers. Sized in cqw so it scales with its container. */

const SPECIALISTS = ["doubt", "quiz", "curriculum", "progress", "assistant"] as const;

const QUESTIONS = [
    {
        q: "Why does my recursion overflow the stack?",
        plan: ["doubt"],
        thinking: "Reads like a missing base case — walk through the call stack.",
        answer: "Your base case never triggers for n = 0, so each call adds a frame until the stack runs out.",
    },
    {
        q: "Quiz me on binary trees, then update my progress",
        plan: ["quiz", "progress"],
        thinking: "Two jobs: generate at the learner's Elo, then record the result.",
        answer: "Five questions at Bloom level 3 are ready. Your mastery moves once you submit.",
    },
    {
        q: "Plan my next module on graphs",
        plan: ["curriculum", "progress"],
        thinking: "Check what is mastered first, then build on it.",
        answer: "Trees are mastered at 742, so the module opens with BFS and DFS before shortest paths.",
    },
];

export default function AgentRouteDemo() {
    const [qi, setQi] = useState(0);
    // step: 0 = idle, 1 = routing, 2..n+1 = specialist k running, n+2 = answered
    const [step, setStep] = useState(QUESTIONS[0].plan.length + 2);
    const timers = useRef<number[]>([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const current = QUESTIONS[qi];
    const done = current.plan.length + 2;

    function ask(i: number) {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setQi(i);
        setStep(1);
        const plan = QUESTIONS[i].plan;
        for (let k = 0; k <= plan.length; k++) {
            timers.current.push(window.setTimeout(() => setStep(k + 2), 650 + k * 650));
        }
    }

    const running = (name: string) => {
        const idx = current.plan.indexOf(name);
        if (idx < 0) return "off";
        if (step >= idx + 3) return "done";
        if (step === idx + 2) return "run";
        return step >= 1 ? "queued" : "off";
    };

    return (
        <div className="flex h-full flex-col gap-[2.4cqw] p-[4cqw] text-[2.6cqw] leading-snug">
            <div className="flex flex-wrap gap-[1.4cqw]" role="group" aria-label="Sample questions">
                {QUESTIONS.map((item, i) => (
                    <button
                        key={item.q}
                        type="button"
                        onClick={() => ask(i)}
                        aria-pressed={qi === i}
                        className={`rounded-full border px-[2.4cqw] py-[1cqw] text-left transition-colors ${
                            qi === i ? "border-transparent bg-white text-ink-2" : "border-white/25 text-white/80 hover:text-white"
                        }`}
                    >
                        {item.q}
                    </button>
                ))}
            </div>

            <div className="rounded-[2.4cqw] bg-black/30 p-[3cqw] font-mono text-[2.3cqw] text-white/85">
                <span className="text-sys-teal">router</span> → RoutePlan(
                <span className={step >= 2 ? "text-white" : "text-white/40"}>
                    [{current.plan.map((p) => `"${p}"`).join(", ")}]
                </span>
                )
            </div>

            <ul className="grid grid-cols-5 gap-[1.4cqw]" aria-label="Specialists">
                {SPECIALISTS.map((name) => {
                    const state = running(name);
                    return (
                        <li
                            key={name}
                            className={`rounded-[1.8cqw] border px-[1cqw] py-[2cqw] text-center text-[2.1cqw] transition-all duration-500 ${
                                state === "run"
                                    ? "scale-105 border-white bg-white text-ink-2"
                                    : state === "done"
                                      ? "border-white/60 bg-white/15 text-white"
                                      : state === "queued"
                                        ? "border-white/40 text-white/80"
                                        : "border-white/10 text-white/35"
                            }`}
                        >
                            {name}
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto space-y-[1.6cqw]" aria-live="polite">
                <p className={`text-white/70 italic transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>
                    thinking — {current.thinking}
                </p>
                <p
                    className={`rounded-[2.4cqw] bg-white px-[3cqw] py-[2.4cqw] text-ink-2 transition-all duration-500 ${
                        step >= done ? "translate-y-0 opacity-100" : "translate-y-[2cqw] opacity-0"
                    }`}
                >
                    {current.answer}
                </p>
            </div>
        </div>
    );
}
