import type { Metadata } from "next";
import ExperienceBlock from "@/components/about/ExperienceBlock";
import { experience, profile } from "@/lib/content";

export const metadata: Metadata = {
    title: "Experience",
    description: "Atharva Kale's roles at Onit, Anervea Data Labs and Netra Labs — agentic AI, RAG and backend engineering.",
    alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
    return (
        <>
            <section className="surface-light relative pb-24 pt-[calc(var(--nav-h)+4rem)] md:pb-32 md:pt-[calc(var(--nav-h)+6rem)]">
                <div className="shell">
                    <p className="label text-muted">Experience</p>
                    <h1 className="mt-6 max-w-[16ch] text-h1 font-semibold text-fg">
                        {profile.yearsShipping} years shipping AI and backend to <span className="accent-word">production</span>.
                    </h1>

                    <ol className="mt-16 space-y-16">
                        {experience.map((c) => (
                            <li key={c.name} className="grid gap-8 border-t hairline pt-10 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <h2 className="text-h3 font-semibold text-fg">{c.name}</h2>
                                    <p className="mt-2 text-small text-muted">
                                        {c.location} · {c.period}
                                    </p>
                                    <p className="mt-4 text-body text-muted">{c.summary}</p>
                                </div>
                                <ol className="space-y-10 lg:col-span-8">
                                    {c.roles.map((r) => (
                                        <li key={r.title} className="card p-6 sm:p-8">
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                                <h3 className="flex items-center gap-2.5 text-h4 font-semibold text-fg">
                                                    {r.current && (
                                                        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                                                            <span className="ping absolute inset-0 rounded-full bg-sys-green/70" />
                                                            <span className="relative h-2.5 w-2.5 rounded-full bg-sys-green" />
                                                        </span>
                                                    )}
                                                    {r.title}
                                                    {r.current && <span className="sr-only">(current role)</span>}
                                                </h3>
                                                <p className="text-caption text-muted">{r.period}</p>
                                            </div>
                                            <ul className="mt-5 space-y-3">
                                                {r.highlights.map((h) => (
                                                    <li key={h} className="flex gap-3 text-body text-muted">
                                                        <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                                        {h}
                                                    </li>
                                                ))}
                                            </ul>
                                            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
                                                {r.stack.map((s) => (
                                                    <li key={s} className="chip">
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ol>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
            <ExperienceBlock withLink={false} />
        </>
    );
}
