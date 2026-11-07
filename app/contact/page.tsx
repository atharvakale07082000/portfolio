import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmail from "@/components/system/CopyEmail";
import LocalTime from "@/components/system/LocalTime";
import Roll from "@/components/system/Roll";
import { profile, socials } from "@/lib/content";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Atharva Kale about AI systems, backend work or a full-time role.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <section className="surface-light relative pb-28 pt-[calc(var(--nav-h)+4rem)] md:pb-36 md:pt-[calc(var(--nav-h)+6rem)]">
            <div className="shell">
                <p className="label text-muted">Contact</p>
                <h1 className="mt-6 max-w-[14ch] text-h1 font-semibold text-fg">
                    Let&apos;s build something that <span className="accent-word">thinks</span>.
                </h1>
                <p className="mt-6 max-w-[52ch] text-lead text-muted">
                    Agents, retrieval, a backend that has to survive real load — or a full-time role. Tell me what you&apos;re working on.
                </p>

                <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>

                    <aside className="space-y-6 lg:col-span-5" aria-label="Other ways to reach me">
                        <div className="surface-dark rounded-[1.75rem] p-7 sm:p-9">
                            <p className="label text-muted">Email</p>
                            <a href={`mailto:${profile.email}`} className="roll-host mt-4 block break-all text-h4 font-semibold text-fg">
                                <Roll text={profile.email} />
                            </a>
                            <CopyEmail className="mt-6" label="Copy address" />
                        </div>

                        <div className="card p-7 sm:p-9">
                            <p className="label text-muted">Elsewhere</p>
                            <ul className="mt-4 divide-y divide-[var(--line)]">
                                {socials
                                    .filter((s) => s.label !== "Email")
                                    .map((s) => (
                                        <li key={s.label}>
                                            <a
                                                href={s.href}
                                                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                {...(s.label === "Résumé" ? { download: true } : {})}
                                                className="roll-host flex items-center justify-between gap-4 py-3.5"
                                            >
                                                <span className="text-body font-medium text-fg">
                                                    <Roll text={s.label} />
                                                </span>
                                                <span className="truncate text-small text-muted">{s.handle}</span>
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className="card p-7 sm:p-9">
                            <p className="label text-muted">Local time</p>
                            <p className="mt-3 text-h4 font-semibold text-fg">
                                <LocalTime />
                            </p>
                            <p className="mt-1 text-small text-muted">India Standard Time, UTC+5:30</p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
