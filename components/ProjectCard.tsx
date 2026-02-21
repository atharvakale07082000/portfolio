"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectProps {
    title: string;
    description: string;
    tags: string[];
    githubUrl?: string;
    demoUrl?: string;
    year?: string;
    index: number;
}

export default function ProjectCard({ title, description, tags, githubUrl, demoUrl, year, index }: ProjectProps) {
    const link = demoUrl || githubUrl || "#";

    return (
        <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group block border-b border-gray-100 last:border-0 py-6 md:py-8 hover:bg-gray-50 transition-colors -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-2xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-baseline">
                {/* Year */}
                <div className="col-span-1 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                    {year || "2024"}
                </div>

                {/* Title & Description */}
                <div className="col-span-4">
                    <h3 className="text-xl font-black text-black tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed block md:hidden mb-4">
                        {description}
                    </p>
                </div>

                {/* Tags */}
                <div className="col-span-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-[0.65rem] font-bold uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Link Icon */}
                <div className="col-span-2 flex justify-start md:justify-end items-center text-gray-400 group-hover:text-blue-600 transition-colors mt-4 md:mt-0">
                    <span className="text-xs font-bold uppercase tracking-widest mr-2 md:hidden">View Project</span>
                    <ArrowUpRight strokeWidth={2.5} size={20} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </div>

            {/* Desktop Description Tooltip/Subtitle */}
            <div className="hidden md:block col-span-12 mt-3 text-sm text-gray-500 font-medium leading-relaxed max-w-2xl ml-[8.333%]">
                {description}
            </div>
        </motion.a>
    );
}
