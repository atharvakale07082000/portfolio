import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import { education, experience, impact, recognition } from "@/lib/content";

/** Career card: every company, with its role progression. Current role pings. */
export function CareerCard() {
    return (
        <div className="card p-6 sm:p-8">
            <p className="label text-muted">Career</p>
            <ol className="mt-6 space-y-8">
                {experience.map((c) => (
                    <li key={c.name}>
                        <p className="text-h4 font-semibold text-fg">{c.name}</p>
                        <p className="text-caption text-muted">
                            {c.location} · {c.period}
                        </p>
                        <ol className="relative mt-4 space-y-4 border-l border-[var(--line-strong)] pl-5">
                            {c.roles.map((r) => (
                                <li key={r.title} className="relative">
                                    <span className="absolute -left-[25px] top-1.5 flex h-2.5 w-2.5" aria-hidden="true">
                                        {r.current && <span className="ping absolute inset-0 rounded-full bg-sys-green/70" />}
                                        <span className={`relative h-2.5 w-2.5 rounded-full ${r.current ? "bg-sys-green" : "bg-muted"}`} />
                                    </span>
                                    <p className="text-small font-medium text-fg">
                                        {r.title}
                                        {r.current && <span className="sr-only"> (current role)</span>}
                                    </p>
                                    <p className="text-caption text-muted">{r.period}</p>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default function ExperienceBlock({ withLink = true }: { withLink?: boolean }) {
    return (
        <section
            id="experience"
            aria-labelledby="experience-title"
            className="surface-dark relative z-10 -mt-8 rounded-t-[2rem] pb-28 pt-24 md:pb-36 md:pt-32"
        >
            <div className="shell">
                <p className="label text-muted">Experience</p>
                <h2 id="experience-title" className="mt-5 max-w-[18ch] text-h2 font-semibold text-fg">
                    Impact, in <span className="accent-word">numbers</span> I can stand behind.
                </h2>

                <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-24">
                            <CareerCard />
                        </div>
                    </div>
                    <ul className="lg:col-span-7">
                        {impact.map((it) => (
                            <li key={it.metric} className="grid gap-2 border-t hairline py-7 sm:grid-cols-[minmax(0,12rem)_auto_1fr] sm:items-baseline sm:gap-6">
                                <span className="text-h3 font-semibold tabular-nums text-fg">{it.metric}</span>
                                <span aria-hidden="true" className="hidden text-muted sm:block">
                                    →
                                </span>
                                <span className="text-body text-muted">{it.body}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16 grid gap-6 md:grid-cols-2">
                    <div className="card p-6 sm:p-8">
                        <p className="label text-muted">Education</p>
                        <ul className="mt-5 space-y-5">
                            {education.map((e) => (
                                <li key={e.degree}>
                                    <p className="text-body font-semibold text-fg">{e.degree}</p>
                                    <p className="text-small text-muted">
                                        {e.school} · {e.period} · {e.note}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card p-6 sm:p-8">
                        <p className="label text-muted">Recognition</p>
                        <ul className="mt-5 space-y-5">
                            {recognition.map((r) => (
                                <li key={r.title}>
                                    <p className="text-body font-semibold text-fg">{r.title}</p>
                                    <p className="text-small text-muted">{r.detail}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {withLink && (
                    <Link href="/experience" className="btn btn-ghost btn-lg mt-12">
                        <BtnLabel>Full experience</BtnLabel>
                        <BtnIcon dir="right">
                            <FiArrowRight size={18} />
                        </BtnIcon>
                    </Link>
                )}
            </div>
        </section>
    );
}
