import Link from "next/link";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import GlideLink from "@/components/system/GlideLink";
import LocalTime from "@/components/system/LocalTime";
import { profile } from "@/lib/content";

/* Deliberately still: no entrance animation, so the headline is the first
   paint (and the LCP). A custom hero animation can be layered on later. */
export default function Hero() {
    return (
        <section id="home" className="surface-light relative flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_20%,rgb(var(--accent-rgb)/0.10),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgb(var(--accent-bright-rgb)/0.08),transparent_70%)]"
            />
            <div className="shell relative flex flex-1 flex-col justify-center py-16 md:py-20">
                <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
                    <span className="relative inline-flex h-2 w-2" aria-hidden="true">
                        <span className="ping absolute inset-0 rounded-full bg-sys-green/60" />
                        <span className="relative h-2 w-2 rounded-full bg-sys-green" />
                    </span>
                    {profile.name} · {profile.role}
                </p>

                <h1 className="mt-6 max-w-[13ch] text-display font-semibold text-fg">
                    AI systems that <span className="accent-word">show</span> their work.
                </h1>

                <div className="mt-8 grid max-w-3xl gap-5">
                    <p className="text-lead text-muted">{profile.intro}</p>
                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-code text-muted">
                        <span className="text-link">route</span>
                        <span aria-hidden="true">→</span>
                        {profile.routeTo.map((r, i) => (
                            <span key={r} className="flex items-center gap-2.5">
                                {i > 0 && <span aria-hidden="true">·</span>}
                                <span className="text-fg">{r}</span>
                            </span>
                        ))}
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <GlideLink to="works" className="btn btn-lg">
                        <BtnLabel>View work</BtnLabel>
                        <BtnIcon dir="down">
                            <FiArrowDown size={18} />
                        </BtnIcon>
                    </GlideLink>
                    <Link href="/contact" className="btn btn-ghost btn-lg">
                        <BtnLabel>Get in touch</BtnLabel>
                        <BtnIcon>
                            <FiArrowUpRight size={18} />
                        </BtnIcon>
                    </Link>
                </div>
            </div>

            {/* Three equal columns so the scroll hint is truly centred. */}
            <div className="shell relative grid grid-cols-[1fr_auto_1fr] items-end gap-4 pb-14 text-caption text-muted">
                <LocalTime className="justify-self-start" />
                <GlideLink to="about" className="flex flex-col items-center gap-2 rounded-full">
                    <span className="label">Scroll</span>
                    <span className="relative h-10 w-px overflow-hidden bg-[var(--line)]" aria-hidden="true">
                        <span className="absolute inset-x-0 top-0 h-1/2 bg-[rgb(var(--fg-rgb))] motion-safe:animate-[scroll-hint_1.8s_var(--ease-apple)_infinite]" />
                    </span>
                </GlideLink>
                <a href={profile.resume} download className="roll-host hidden justify-self-end font-medium text-fg sm:block">
                    Résumé ↓
                </a>
            </div>
        </section>
    );
}
