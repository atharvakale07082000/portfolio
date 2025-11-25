"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.text();
            const assistantMessage: Message = { role: 'assistant', content: data };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] bg-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/20 text-primary">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">AI Assistant</h3>
                                <p className="text-xs text-gray-400">Ask about my experience</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10 text-sm">
                                    <p>Hi! I'm an AI trained on Atharva's resume.</p>
                                    <p className="mt-2">Ask me anything like:</p>
                                    <ul className="mt-2 space-y-1 text-primary/80">
                                        <li>"What are your top skills?"</li>
                                        <li>"Tell me about your RAG project."</li>
                                        <li>"Do you know Python?"</li>
                                    </ul>
                                </div>
                            )}

                            {messages.map((m, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "flex gap-3 max-w-[85%]",
                                        m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                            m.role === "user" ? "bg-white/10 text-white" : "bg-primary/20 text-primary"
                                        )}
                                    >
                                        {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div
                                        className={clsx(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            m.role === "user"
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 mr-auto max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 text-gray-200 rounded-tl-none border border-white/5 flex items-center">
                                        <Loader2 size={16} className="animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full bg-navy/50 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
