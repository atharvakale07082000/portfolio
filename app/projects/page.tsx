"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectRow from "@/components/ProjectCard";
import { projects } from "@/lib/content";

/* Stacks that appear on more than one project — filtering by a tag that
   only one project carries isn't a filter, it's a link. */
function sharedTags() {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
        p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    return [...counts.entries()]
        .filter(([, n]) => n > 1)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tag]) => tag);
}

export default function ProjectsPage() {
    const [filter, setFilter] = useState<string | null>(null);
    const tags = useMemo(sharedTags, []);

    const shown = filter ? projects.filter((p) => p.tags.includes(filter)) : projects;

    return (
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-32 pb-28 md:pt-44 md:pb-36">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12 md:mb-16"
            >
                <p className="telemetry text-signal mb-6">Archive</p>
                <h1 className="display display-tight t-h1 text-ink">
                    Everything
                    <br />
                    shipped.
                </h1>
                <p className="t-lead text-graphite max-w-xl mt-6">
                    Streaming agent systems, retrieval pipelines, and the backend work
                    underneath them — newest first.
                </p>
            </motion.div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-2 mb-10">
                <span className="telemetry text-graphite mr-1">Stack</span>
                <button
                    type="button"
                    onClick={() => setFilter(null)}
                    aria-pressed={filter === null}
                    className="tag min-h-[36px] px-3 inline-flex items-center"
                    style={
                        filter === null
                            ? { background: "var(--signal)", color: "var(--signal-ink)" }
                            : undefined
                    }
                >
                    all
                </button>
                {tags.map((tag) => {
                    const on = filter === tag;
                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setFilter(on ? null : tag)}
                            aria-pressed={on}
                            className="tag min-h-[36px] px-3 inline-flex items-center hover:text-ink"
                            style={
                                on
                                    ? { background: "var(--signal)", color: "var(--signal-ink)" }
                                    : undefined
                            }
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>

            {/* Column header */}
            <div className="hidden md:grid grid-cols-12 gap-x-6 pb-3">
                <span className="telemetry text-graphite col-span-2">When</span>
                <span className="telemetry text-graphite col-span-5">Project</span>
                <span className="telemetry text-graphite col-span-4">Built with</span>
                <span className="telemetry text-graphite col-span-1 md:text-right">Go</span>
            </div>

            <div>
                {shown.map((project, i) => (
                    <ProjectRow key={project.slug} project={project} index={i} />
                ))}
            </div>

            <p className="rule-t pt-5 telemetry text-graphite">
                {shown.length} of {projects.length} shown
            </p>
        </div>
    );
}
