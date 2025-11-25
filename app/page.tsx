"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Download } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
                            Available for hire
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Atharva Kale <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Senior Backend & AI Engineer
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Specializing in Generative AI, RAG Pipelines, and Scalable Backend Architectures.
                        Turning complex data into actionable business insights.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/projects"
                            className="px-8 py-4 rounded-full bg-primary text-white font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 group"
                        >
                            View Projects
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex gap-4">
                            <a
                                href="https://github.com/atharvakale07082000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                            >
                                <Github size={24} />
                            </a>
                            <a
                                href="https://linkedin.com/in/atharva-kale-7b0b53177"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a
                                href="/resume.pdf"
                                download
                                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                                title="Download Resume"
                            >
                                <Download size={24} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
