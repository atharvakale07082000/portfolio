"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ArrowUp } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
    "How does the Atelier orchestrator route a turn?",
    "What has Atharva shipped with FastAPI?",
    "Where has he worked, and for how long?",
    "What is he strongest at?",
];

/** Inline **bold** and `code` only — the API answers in plain prose. */
function Rich({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} className="font-semibold text-ink">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code
                            key={i}
                            className="numeral text-[0.85em] text-signal px-1 py-0.5 rounded-[2px]"
                            style={{ background: "var(--sunk)" }}
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return (
                    <span key={i}>
                        {part.split("\n").map((line, j, all) => (
                            <span key={j}>
                                {line}
                                {j < all.length - 1 && <br />}
                            </span>
                        ))}
                    </span>
                );
            })}
        </>
    );
}

function Thinking() {
    return (
        <div className="flex items-center gap-1.5 py-0.5">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-signal"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

function Panel({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
        return () => abortRef.current?.abort();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, streaming]);

    const send = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || streaming) return;

            setError(null);
            const outgoing: Message[] = [...messages, { role: "user", content: trimmed }];
            setMessages(outgoing);
            setInput("");
            setStreaming(true);

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: outgoing }),
                    signal: controller.signal,
                });
                if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let text = "";
                setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    text += decoder.decode(value, { stream: true });
                    setMessages((prev) => [
                        ...prev.slice(0, -1),
                        { role: "assistant", content: text },
                    ]);
                }
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                setError("The answer didn't come back. Send it again, or email Atharva directly.");
            } finally {
                setStreaming(false);
            }
        },
        [messages, streaming]
    );

    return (
        <motion.div
            role="dialog"
            aria-label="Ask about Atharva's work"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="panel fixed z-50 flex flex-col overflow-hidden
                       inset-x-3 bottom-3 h-[min(78vh,600px)]
                       sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[420px] sm:h-[580px]"
            style={{ boxShadow: "var(--shadow-float)" }}
        >
            {/* Header */}
            <div className="rule-b px-4 py-3 flex items-center justify-between shrink-0">
                <div className="min-w-0">
                    <h2 className="display text-[15px] tracking-[-0.02em] text-ink">
                        Ask about the work
                    </h2>
                    <p className="telemetry text-graphite mt-0.5">
                        Answers from his résumé · Gemini
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="w-11 h-11 -mr-2.5 inline-flex items-center justify-center text-graphite hover:text-ink transition-colors shrink-0"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Transcript */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                style={{ background: "var(--paper)" }}
            >
                {messages.length === 0 && (
                    <div>
                        <p className="telemetry text-graphite mb-3">Try one of these</p>
                        <ul className="space-y-2">
                            {SUGGESTIONS.map((s) => (
                                <li key={s}>
                                    <button
                                        type="button"
                                        onClick={() => send(s)}
                                        className="panel panel-hover w-full text-left px-3.5 py-3 text-[14px] text-graphite hover:text-ink leading-snug"
                                    >
                                        {s}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {messages.map((m, i) =>
                    m.role === "user" ? (
                        <div key={i} className="flex justify-end">
                            <p
                                className="max-w-[85%] px-3.5 py-2.5 text-[14.5px] leading-relaxed rounded-[2px]"
                                style={{ background: "var(--signal)", color: "var(--signal-ink)" }}
                            >
                                {m.content}
                            </p>
                        </div>
                    ) : (
                        <div key={i} className="max-w-[92%]">
                            <p className="telemetry text-signal mb-1.5">reply</p>
                            <p className="text-[14.5px] text-graphite leading-[1.65]">
                                <Rich text={m.content} />
                                {streaming && i === messages.length - 1 && (
                                    <span className="caret" aria-hidden="true" />
                                )}
                            </p>
                        </div>
                    )
                )}

                {streaming && messages[messages.length - 1]?.role === "user" && (
                    <div>
                        <p className="telemetry text-signal mb-1.5">reply</p>
                        <Thinking />
                    </div>
                )}

                {error && (
                    <p role="alert" className="text-[13.5px] text-ink rule-t pt-3">
                        {error}
                    </p>
                )}

                <div ref={endRef} />
            </div>

            {/* Composer */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
                className="rule-t p-3 shrink-0"
            >
                <div className="relative flex items-center">
                    <label htmlFor="chat-input" className="sr-only">
                        Your question
                    </label>
                    <input
                        id="chat-input"
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a project, a stack, a role…"
                        disabled={streaming}
                        className="w-full min-h-[44px] pl-3.5 pr-12 text-[14.5px] text-ink rounded-[2px] border transition-colors focus:outline-none disabled:opacity-60"
                        style={{
                            background: "var(--paper)",
                            borderColor: "var(--rule-strong)",
                        }}
                    />
                    <button
                        type="submit"
                        aria-label="Send"
                        disabled={streaming || !input.trim()}
                        className="absolute right-1 w-9 h-9 inline-flex items-center justify-center rounded-[2px] disabled:opacity-35 disabled:cursor-not-allowed transition-opacity"
                        style={{ background: "var(--signal)", color: "var(--signal-ink)" }}
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close the question panel" : "Ask about Atharva's work"}
                className="panel fixed bottom-5 right-5 z-40 min-h-[44px] inline-flex items-center gap-2 px-4 text-ink hover:border-rule-strong transition-colors"
                style={{ boxShadow: "var(--shadow-lift)" }}
            >
                {open ? <X size={17} /> : <MessageSquare size={17} />}
                <span className="text-[14px] font-medium tracking-[-0.01em]">
                    {open ? "Close" : "Ask"}
                </span>
            </button>

            <AnimatePresence>{open && <Panel onClose={() => setOpen(false)} />}</AnimatePresence>
        </>
    );
}
