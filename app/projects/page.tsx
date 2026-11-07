import type { Metadata } from "next";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import LensPoster from "@/components/work/LensPoster";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { archive, atelier, profile, works } from "@/lib/content";

export const metadata: Metadata = {
    title: "Projects",
    description: "Atelier, NeuralScope, Aevum, ECHO and more — agent systems, retrieval and backends by Atharva Kale.",
    alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
    const flagship = works[0];
    return (
        <>
            <section className="surface-light relative pb-24 pt-[calc(var(--nav-h)+4rem)] md:pb-32 md:pt-[calc(var(--nav-h)+6rem)]">
                <div className="shell">
                    <p className="label text-muted">Projects</p>
                    <h1 className="mt-6 max-w-[16ch] text-h1 font-semibold text-fg">
                        Everything I&apos;ve built, and <span className="accent-word">how</span> it works.
                    </h1>
                    <p className="mt-6 max-w-[56ch] text-lead text-muted">
                        Agent platforms, observability, retrieval and the services underneath. Production work at Onit and Anervea is described, not linked.
                    </p>

                    <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
                        {works.map((w) => (
                            <li key={w.slug}>
                                <LensPoster work={w} href={w.links.live ?? w.links.github} />
                                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                    <h2 className="text-h4 font-semibold text-fg">{w.title}</h2>
                                    <p className="text-caption text-muted">
                                        {w.kind} · {w.year}
                                        {w.team ? " · Team project" : ""}
                                    </p>
                                </div>
                                <p className="mt-2 text-body text-muted">{w.outcome}</p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {w.links.live && (
                                        <a href={w.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
                                            <BtnLabel>Live demo</BtnLabel>
                                            <span className="sr-only">: {w.title}</span>
                                        </a>
                                    )}
                                    {w.links.github && (
                                        <a href={w.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                            <FiGithub size={14} aria-hidden="true" />
                                            <BtnLabel>Source</BtnLabel>
                                            <span className="sr-only">: {w.title}</span>
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="atelier-title" className="surface-dark relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32">
                <div className="shell">
                    <p className="label text-muted">Deep dive · {atelier.period}</p>
                    <h2 id="atelier-title" className="mt-5 max-w-[18ch] text-h2 font-semibold text-fg">
                        {flagship.title}: {atelier.tagline.replace(/\.$/, "")}.
                    </h2>
                    <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border hairline bg-[var(--line)] lg:grid-cols-4">
                        {atelier.specs.map((s) => (
                            <div key={s.label} className="bg-bg p-6">
                                <dt className="text-caption text-muted">{s.label}</dt>
                                <dd className="mt-2 text-h4 font-semibold text-fg">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <ol className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-2">
                        {atelier.mechanics.map((m, i) => (
                            <li key={m.label} className="border-t hairline pt-6">
                                <p className="text-caption tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</p>
                                <h3 className="mt-3 text-h4 font-semibold text-fg">{m.label}</h3>
                                <p className="mt-3 text-body text-muted">{m.body}</p>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-14 flex flex-wrap items-center gap-3">
                        {atelier.verified.map((v) => (
                            <span key={v.label} className="chip text-fg">
                                <span className="h-1.5 w-1.5 rounded-full bg-sys-green" aria-hidden="true" />
                                {v.label}: {v.value}
                            </span>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-wrap gap-3">
                        {flagship.links.live && (
                            <a href={flagship.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
                                <BtnLabel>Try Atelier</BtnLabel>
                                <BtnIcon>
                                    <FiArrowUpRight size={18} />
                                </BtnIcon>
                            </a>
                        )}
                        {flagship.links.github && (
                            <a href={flagship.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                                <FiGithub size={18} aria-hidden="true" />
                                <BtnLabel>Read the source</BtnLabel>
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <section aria-labelledby="archive-title" className="surface-light relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32">
                <div className="shell">
                    <p className="label text-muted">Archive</p>
                    <h2 id="archive-title" className="mt-5 text-h2 font-semibold text-fg">
                        Production work &amp; <span className="accent-word">earlier</span> projects
                    </h2>
                    <ul className="mt-12">
                        {archive.map((a) => (
                            <li key={a.title} className="grid gap-3 border-t hairline py-8 md:grid-cols-12 md:gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-h4 font-semibold text-fg">{a.title}</h3>
                                    <p className="mt-1 text-caption text-muted">
                                        {a.period}
                                        {a.note ? ` · ${a.note}` : ""}
                                    </p>
                                </div>
                                <div className="md:col-span-8">
                                    <p className="text-body text-muted">{a.brief}</p>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {a.tags.map((t) => (
                                            <li key={t} className="chip">
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-lg mt-10">
                        <FiGithub size={18} aria-hidden="true" />
                        <BtnLabel>More on GitHub</BtnLabel>
                        <BtnIcon>
                            <FiArrowUpRight size={18} />
                        </BtnIcon>
                    </a>
                </div>
            </section>
        </>
    );
}
