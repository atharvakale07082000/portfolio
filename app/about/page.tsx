import type { Metadata } from "next";
import { FiActivity, FiBarChart2, FiCheckCircle, FiEye, FiLayers, FiShield } from "react-icons/fi";
import AboutHero from "@/components/about/AboutHero";
import SkillCard from "@/components/about/SkillCard";
import ExperienceBlock from "@/components/about/ExperienceBlock";
import ScrubText from "@/components/system/ScrubText";
import { coreConcepts, principles, skillGroups, story } from "@/lib/content";

export const metadata: Metadata = {
    title: "About",
    description:
        "Atharva Kale is an AI & Backend Engineer in Pune: agentic text-to-SQL, production RAG, FastAPI microservices and the evals that keep them honest.",
    alternates: { canonical: "/about" },
};

const ICONS = {
    measure: FiBarChart2,
    shield: FiShield,
    eye: FiEye,
    layers: FiLayers,
    check: FiCheckCircle,
    gauge: FiActivity,
};

export default function AboutPage() {
    return (
        <>
            <AboutHero />

            <section aria-labelledby="story-title" className="surface-dark relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32">
                <div className="shell">
                    <p id="story-title" className="label text-muted">
                        My story
                    </p>
                    <div className="mt-8 space-y-12 md:space-y-16">
                        {story.map((s) => (
                            <ScrubText key={s.text} text={s.text} accent={s.accent} className="max-w-[28ch] text-h3 font-semibold" />
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="skills"
                aria-labelledby="skills-title"
                className="surface-light relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
            >
                <div className="shell">
                    <p className="label text-muted">Details &amp; summary</p>
                    <h2 id="skills-title" className="mt-5 max-w-[18ch] text-h2 font-semibold text-fg">
                        The toolkit, <span className="accent-word">weighted</span> by how I use it.
                    </h2>
                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        {skillGroups.map((g, i) => (
                            <SkillCard key={g.title} group={g} index={i} />
                        ))}
                    </div>
                    <div className="mt-12">
                        <p className="label text-muted">Core concepts</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {coreConcepts.map((c) => (
                                <li key={c} className="chip text-fg">
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <ExperienceBlock />

            <section
                aria-labelledby="principles-title"
                className="surface-dark-2 relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
            >
                <div className="shell">
                    <p className="label text-muted">Design principles</p>
                    <h2 id="principles-title" className="mt-5 max-w-[18ch] text-h2 font-semibold text-fg">
                        How I decide when nobody is <span className="accent-word">watching</span>.
                    </h2>
                    <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                        {principles.map((p, i) => {
                            const Icon = ICONS[p.icon];
                            return (
                                <li key={p.title} className="border-t hairline pt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-caption tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                                        <Icon size={20} className="text-link" aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-5 text-h4 font-semibold text-fg">{p.title}</h3>
                                    <p className="mt-3 text-body text-muted">{p.body}</p>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>
        </>
    );
}
