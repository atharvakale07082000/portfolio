import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-hairline">
            <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    <div>
                        <p className="eyebrow text-[14px] mb-3">Let&apos;s build something</p>
                        <a
                            href="mailto:atharva.skale07@gmail.com"
                            className="display text-[30px] md:text-[44px] text-ink hover:text-accent transition-colors inline-flex items-center gap-2 group"
                        >
                            atharva.skale07@gmail.com
                            <ArrowUpRight
                                className="mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                size={28}
                            />
                        </a>
                    </div>

                    <div className="flex gap-3">
                        <a href="https://github.com/atharvakale07082000" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-11 h-11 rounded-full bg-white border border-hairline flex items-center justify-center text-muted hover:text-ink hover:border-ink/20 transition-colors">
                            <Github size={19} />
                        </a>
                        <a href="https://www.linkedin.com/in/atharva-kale-7b0b53177/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-11 h-11 rounded-full bg-white border border-hairline flex items-center justify-center text-muted hover:text-ink hover:border-ink/20 transition-colors">
                            <Linkedin size={19} />
                        </a>
                        <a href="mailto:atharva.skale07@gmail.com" aria-label="Email" className="w-11 h-11 rounded-full bg-white border border-hairline flex items-center justify-center text-muted hover:text-ink hover:border-ink/20 transition-colors">
                            <Mail size={19} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-14 pt-8 border-t border-hairline">
                    <div className="flex gap-7 mono text-[12px] text-muted">
                        <Link href="/about" className="hover:text-ink transition-colors">About</Link>
                        <Link href="/experience" className="hover:text-ink transition-colors">Experience</Link>
                        <Link href="/projects" className="hover:text-ink transition-colors">Projects</Link>
                    </div>
                    <p className="mono text-[12px] text-muted">
                        © {new Date().getFullYear()} Atharva Kale
                    </p>
                </div>
            </div>
        </footer>
    );
}
