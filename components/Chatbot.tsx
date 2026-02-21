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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 brutalist-card font-bold hover:bg-gray-50 transition-colors"
                style={{ borderRadius: '9999px' }}
            >
                {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
                <span className="hidden sm:inline uppercase tracking-widest text-xs pt-0.5">{isOpen ? "Close" : "Ask AI"}</span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, originY: 1, originX: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[550px] brutalist-card flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-black text-white">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-black tracking-tighter uppercase text-lg leading-tight">AI Assistant</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Expert</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {messages.length === 0 && (
                                <div className="text-center mt-12 text-sm">
                                    <p className="font-bold text-gray-800 mb-4 tracking-tight">How can I assist your review?</p>
                                    <ul className="mt-4 flex flex-col gap-2">
                                        <li><button onClick={() => setInput("What is Atharva's tech stack?")} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-black font-semibold text-gray-600 hover:text-black transition-colors">What is Atharva's tech stack?</button></li>
                                        <li><button onClick={() => setInput("Tell me about the RAG pipeline project.")} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-black font-semibold text-gray-600 hover:text-black transition-colors">Tell me about the RAG pipeline project.</button></li>
                                        <li><button onClick={() => setInput("Are you available for freelance work?")} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-black font-semibold text-gray-600 hover:text-black transition-colors">Are you available for freelance work?</button></li>
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
                                            m.role === "user" ? "hidden" : "bg-black text-white"
                                        )}
                                    >
                                        {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div
                                        className={clsx(
                                            "p-3.5 rounded-2xl text-sm leading-relaxed font-medium shadow-sm",
                                            m.role === "user"
                                                ? "bg-blue-600 text-white rounded-br-sm"
                                                : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 mr-auto max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none border border-gray-200 flex items-center">
                                        <Loader2 size={16} className="animate-spin text-blue-600" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 relative">
                            <div className="relative flex items-center">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-full py-3.5 pl-5 pr-14 text-sm text-black focus:outline-none transition-all placeholder:text-gray-400 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1.5 p-2 rounded-full bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
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
