import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";

const socials = [
    { label: "GitHub", href: profile.github, Icon: Github, external: true },
    { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin, external: true },
    { label: "Email", href: `mailto:${profile.email}`, Icon: Mail, external: false },
];

export default function Footer() {
    return (
        <footer className="rule-t" style={{ background: "var(--surface)" }}>
            <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-16 md:py-20">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
                    <div className="min-w-0">
                        <p className="telemetry text-signal mb-4">Open to work</p>
                        <a
                            href={`mailto:${profile.email}`}
                            className="display t-email text-ink inline-flex items-start gap-2 group"
                        >
                            <span className="link">{profile.email}</span>
                            <ArrowUpRight
                                size={24}
                                className="mt-1.5 shrink-0 text-graphite transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <p className="text-[15px] text-graphite mt-4 max-w-md">
                            Backend and AI roles, contract or full-time. Fastest reply by email.
                        </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {socials.map(({ label, href, Icon, external }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                {...(external
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                className="panel panel-hover w-12 h-12 inline-flex items-center justify-center text-graphite hover:text-ink"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="rule-t mt-14 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href="/projects" className="telemetry text-graphite hover:text-ink transition-colors inline-flex items-center min-h-[28px]">
                            Work
                        </Link>
                        <Link href="/experience" className="telemetry text-graphite hover:text-ink transition-colors inline-flex items-center min-h-[28px]">
                            Experience
                        </Link>
                        <Link href="/about" className="telemetry text-graphite hover:text-ink transition-colors inline-flex items-center min-h-[28px]">
                            About
                        </Link>
                        <a
                            href={profile.resume}
                            download
                            className="telemetry text-graphite hover:text-ink transition-colors inline-flex items-center min-h-[28px]"
                        >
                            Résumé
                        </a>
                    </div>
                    <p className="telemetry text-graphite">
                        {profile.location} · {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
}
