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

export default function ProjectCard({
    title,
    description,
    tags,
    githubUrl,
    demoUrl,
    year,
    index,
}: ProjectProps) {
    const link = demoUrl || githubUrl || "#";

    return (
        <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline py-7 spec-row -mx-4 px-4 rounded-2xl hover:bg-surface transition-colors"
        >
            {/* Year */}
            <div className="md:col-span-1 mono text-[13px] text-muted">{year || "2024"}</div>

            {/* Title + description */}
            <div className="md:col-span-5">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-[19px] font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    {demoUrl && (
                        <span className="mono text-[10px] uppercase tracking-wider text-accent border border-accent/30 rounded-full px-2 py-0.5">
                            Live
                        </span>
                    )}
                </div>
                <p className="text-[14.5px] text-muted font-normal leading-relaxed mt-2 max-w-xl">
                    {description}
                </p>
            </div>

            {/* Tags */}
            <div className="md:col-span-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="mono text-[11px] tracking-tight text-muted bg-surface group-hover:bg-white rounded-full px-3 py-1 transition-colors"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Chevron */}
            <div className="md:col-span-1 flex md:justify-end items-center text-muted group-hover:text-accent transition-colors">
                <ArrowUpRight
                    size={19}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </div>
        </motion.a>
    );
}
