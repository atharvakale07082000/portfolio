"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import type { SkillGroup } from "@/lib/content";

/* The fill is triggered by the ROW coming into view, never by the bar:
   a bar at scaleX(0) has no area, so it can't be reliably observed. */
function SkillRow({ name, level, delay }: { name: string; level: number; delay: number }) {
    const ref = useRef<HTMLLIElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
    return (
        <li ref={ref} className="py-3">
            <div className="flex items-baseline justify-between gap-4 text-small">
                <span className="text-fg">{name}</span>
                <span className="tabular-nums text-muted">{level}</span>
            </div>
            <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]"
                role="meter"
                aria-label={name}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
            >
                <div
                    className="h-full w-full origin-left rounded-full bg-[linear-gradient(90deg,rgb(var(--accent-rgb)),rgb(var(--accent-bright-rgb)))] transition-transform duration-[1200ms] ease-out"
                    style={{ transform: `scaleX(${inView ? level / 100 : 0})`, transitionDelay: `${delay}ms` }}
                />
            </div>
        </li>
    );
}

export default function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
    return (
        <article className="card flex flex-col p-6 sm:p-8">
            <p className="text-caption tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-h4 font-semibold text-fg">{group.title}</h3>
            <p className="mt-3 text-small text-muted">{group.description}</p>
            <ul className="mt-5 divide-y divide-[var(--line)]">
                {group.skills.map((s, i) => (
                    <SkillRow key={s.name} name={s.name} level={s.level} delay={i * 70} />
                ))}
            </ul>
        </article>
    );
}
