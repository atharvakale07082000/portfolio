"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { clsx } from "clsx";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTIONS = [
    "What is Atharva's tech stack?",
    "Tell me about the AI Tutor project.",
    "What experience does Atharva have?",
    "Is Atharva available for new roles?",
];

function MarkdownText({ text }: { text: string }) {
    const segments = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <>
            {segments.map((seg, i) => {
                if (seg.startsWith("**") && seg.endsWith("**")) {
                    return <strong key={i} className="font-bold">{seg.slice(2, -2)}</strong>;
                }
                if (seg.startsWith("`") && seg.endsWith("`")) {
                    return (
                        <code key={i} className="bg-surface text-accent px-1 rounded text-[0.75em] font-mono">
                            {seg.slice(1, -1)}
                        </code>
                    );
                }
                return (
                    <span key={i}>
                        {seg.split("\n").map((line, j, arr) => (
                            <span key={j}>
                                {line}
                                {j < arr.length - 1 && <br />}
                            </span>
                        ))}
                    </span>
                );
            })}
        </>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-1 py-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

function ChatWindow({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStreaming]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isStreaming) return;

        const userMsg: Message = { role: "user", content: text };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput("");
        setIsStreaming(true);

        abortRef.current = new AbortController();

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
                signal: abortRef.current.signal,
            });

            if (!res.ok || !res.body) throw new Error("Request failed");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            setMessages(prev => [...prev, { role: "assistant", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    { role: "assistant", content: accumulated },
                ]);
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "AbortError") return;
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[420px] h-[560px] card flex flex-col overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)]"
        >
            {/* Header */}
            <div className="px-5 py-4 bg-white border-b border-hairline flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent text-white">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-ink tracking-tight text-[15px] leading-tight">
                            Ask Atharva&apos;s AI
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            <p className="mono text-[10px] text-muted uppercase tracking-wider">
                                Powered by Gemini
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close chat"
                    className="p-2 rounded-full hover:bg-surface text-muted hover:text-ink transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-surface overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={14} className="text-muted" />
                            <p className="mono text-[11px] text-muted uppercase tracking-wider">
                                Suggested questions
                            </p>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {SUGGESTIONS.map((s) => (
                                <li key={s}>
                                    <button
                                        onClick={() => setInput(s)}
                                        className="w-full text-left px-4 py-3 rounded-xl bg-white border border-hairline hover:border-accent font-medium text-muted hover:text-ink text-sm transition-all"
                                    >
                                        {s}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex gap-2.5 max-w-[88%]",
                            m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        {m.role === "assistant" && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-accent text-white mt-0.5">
                                <Bot size={13} />
                            </div>
                        )}
                        <div
                            className={clsx(
                                "px-4 py-3 rounded-2xl text-sm leading-relaxed font-normal shadow-sm",
                                m.role === "user"
                                    ? "bg-accent text-white rounded-br-sm"
                                    : "bg-white text-ink rounded-bl-sm border border-hairline"
                            )}
                        >
                            {m.role === "assistant" ? (
                                <MarkdownText text={m.content} />
                            ) : (
                                m.content
                            )}
                        </div>
                    </div>
                ))}

                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex gap-2.5 mr-auto max-w-[88%]">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-accent text-white mt-0.5">
                            <Bot size={13} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white border border-hairline shadow-sm rounded-bl-sm">
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="p-4 bg-white border-t border-hairline flex-shrink-0"
            >
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about skills, projects, experience..."
                        className="w-full bg-surface border border-hairline focus:border-accent rounded-full py-3.5 pl-5 pr-14 text-sm text-ink focus:outline-none transition-all placeholder:text-muted font-normal"
                        disabled={isStreaming}
                    />
                    <button
                        type="submit"
                        aria-label="Send message"
                        disabled={isStreaming || !input.trim()}
                        className="absolute right-1.5 p-2 rounded-full bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0077ed] transition-colors"
                    >
                        <Send size={15} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close chat" : "Ask AI"}
                className="glass fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-ink font-medium shadow-lg hover:bg-white/90 transition-colors"
            >
                {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
                <span className="hidden sm:inline text-[13px] tracking-tight">
                    {isOpen ? "Close" : "Ask AI"}
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
