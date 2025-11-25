"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import Link from "next/link";

interface ProjectProps {
    title: string;
    description: string;
    tags: string[];
    githubUrl?: string;
    demoUrl?: string;
    index: number;
}

export default function ProjectCard({ title, description, tags, githubUrl, demoUrl, index }: ProjectProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-navy/50 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-white/5 text-primary group-hover:bg-primary/10 transition-colors">
                        <Folder size={24} />
                    </div>
                    <div className="flex gap-3">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="View Source"
                            >
                                <Github size={20} />
                            </a>
                        )}
                        {demoUrl && (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Live Demo"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-300 border border-white/5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
