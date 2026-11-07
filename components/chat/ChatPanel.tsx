"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { FiArrowUp, FiX } from "react-icons/fi";
import { profile } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
    "How does the Atelier orchestrator route a turn?",
    "What is he building at Onit?",
    "What has he shipped with FastAPI?",
    "Why did he win the Rolls-Royce award?",
];

/** Inline **bold** and `code` only — the API answers in plain prose. */
function Rich({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} className="font-semibold text-fg">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code key={i} className="rounded bg-raised px-1 py-0.5 font-mono text-[0.86em] text-link">
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
        <span className="inline-flex items-center gap-1.5 py-1" aria-label="Thinking">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                    style={{ animationDelay: `${i * 180}ms` }}
                />
            ))}
        </span>
    );
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
    const reduce = useReducedMotion();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        inputRef.current?.focus({ preventScroll: true });
        return () => abortRef.current?.abort();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
    }, [messages, streaming, reduce]);

    async function send(text: string) {
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
            let reply = "";
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                reply += decoder.decode(value, { stream: true });
                const snapshot = reply;
                setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: snapshot }]);
            }
            // A stream that ends without a word is a failure, not an answer.
            if (!reply.trim()) throw new Error("empty reply");
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            setMessages((prev) =>
                prev.length > 0 && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content === ""
                    ? prev.slice(0, -1)
                    : prev
            );
            setError(`The answer didn't come back. Send it again, or email ${profile.email}.`);
        } finally {
            setStreaming(false);
        }
    }

    const last = messages[messages.length - 1];

    return (
        <m.div
            id="chat-panel"
            role="dialog"
            aria-label="Ask about Atharva's work"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 12, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="surface-white fixed inset-x-3 bottom-20 z-[95] flex h-[min(72svh,600px)] flex-col overflow-hidden rounded-3xl border hairline shadow-[var(--shadow)] sm:inset-x-auto sm:bottom-24 sm:right-[var(--gutter)] sm:w-[400px]"
        >
            <div className="flex shrink-0 items-center justify-between border-b hairline px-5 py-3">
                <div className="min-w-0">
                    <h2 className="text-small font-semibold text-fg">Ask about the work</h2>
                    <p className="text-caption text-muted">Answers from his résumé · Gemini</p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost btn-icon -mr-2 border-0">
                    <FiX size={18} aria-hidden="true" />
                </button>
            </div>

            <div data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-4" aria-live="polite">
                {messages.length === 0 && (
                    <div>
                        <p className="label mb-3 text-muted">Try one of these</p>
                        <ul className="space-y-2">
                            {SUGGESTIONS.map((s) => (
                                <li key={s}>
                                    <button
                                        type="button"
                                        onClick={() => send(s)}
                                        className="w-full rounded-2xl border hairline bg-raised px-4 py-3 text-left text-small text-muted transition-colors hover:text-fg"
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
                            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-small text-white">
                                {m.content}
                            </p>
                        </div>
                    ) : (
                        <div key={i} className="max-w-[92%]">
                            <p className="rounded-2xl rounded-bl-md bg-raised px-4 py-2.5 text-small text-muted">
                                {m.content ? <Rich text={m.content} /> : <Thinking />}
                                {streaming && i === messages.length - 1 && m.content && (
                                    <span className="caret" aria-hidden="true" />
                                )}
                            </p>
                        </div>
                    )
                )}

                {streaming && last?.role === "user" && (
                    <div className="max-w-[92%]">
                        <p className="inline-block rounded-2xl rounded-bl-md bg-raised px-4 py-2.5">
                            <Thinking />
                        </p>
                    </div>
                )}

                {error && (
                    <p role="alert" className="border-t hairline pt-3 text-caption text-fg">
                        {error}
                    </p>
                )}
                <div ref={endRef} />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void send(input);
                }}
                className="shrink-0 border-t hairline p-3"
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
                        autoComplete="off"
                        className="h-11 w-full rounded-full border border-[var(--line-strong)] bg-bg pl-4 pr-12 text-small text-fg placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        aria-label="Send"
                        disabled={streaming || !input.trim()}
                        className="btn btn-accent btn-icon absolute right-1 h-9 w-9"
                    >
                        <FiArrowUp size={16} aria-hidden="true" />
                    </button>
                </div>
            </form>
        </m.div>
    );
}
