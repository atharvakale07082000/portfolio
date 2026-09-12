"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/content";

/**
 * One row of the archive. The row is a container, not a link — each
 * destination gets its own real anchor, so nothing nests and every
 * target is reachable by keyboard.
 */
export default function ProjectRow({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    const primary = project.demoUrl || project.githubUrl;

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="rule-t group grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-3 py-7"
        >
            {/* Period */}
            <div className="md:col-span-2">
                <p className="numeral text-[12px] text-graphite">{project.year}</p>
                <p className="text-[12px] text-graphite/80 mt-0.5 hidden md:block">
                    {project.period}
                </p>
            </div>

            {/* Title + summary */}
            <div className="md:col-span-5 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="display text-[19px] md:text-[21px] tracking-[-0.028em] text-ink leading-snug">
                        {primary ? (
                            <a
                                href={primary}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-block"
                            >
                                {project.title}
                            </a>
                        ) : (
                            project.title
                        )}
                    </h3>
                    {project.live && (
                        <span className="telemetry text-signal border border-signal/40 px-1.5 py-0.5 rounded-[2px]">
                            live
                        </span>
                    )}
                </div>
                <p className="text-[15px] text-graphite leading-[1.6] mt-2.5 max-w-xl">
                    {project.brief}
                </p>
            </div>

            {/* Stack */}
            <div className="md:col-span-4 flex flex-wrap gap-1.5 content-start">
                {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Destinations */}
            <div className="md:col-span-1 flex md:flex-col md:items-end gap-3 md:gap-2">
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.title} live`}
                        className="w-11 h-11 md:w-8 md:h-8 -ml-2.5 md:ml-0 inline-flex items-center justify-center md:justify-end text-graphite hover:text-signal transition-colors"
                    >
                        <ArrowUpRight size={18} />
                    </a>
                )}
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} source on GitHub`}
                        className="w-11 h-11 md:w-8 md:h-8 -ml-2.5 md:ml-0 inline-flex items-center justify-center md:justify-end text-graphite hover:text-signal transition-colors"
                    >
                        <Github size={16} />
                    </a>
                )}
            </div>
        </motion.article>
    );
}
