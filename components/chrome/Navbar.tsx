"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGroup, m } from "framer-motion";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const LINKS = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

/* Sits at the top of every page and scrolls away with it. The fixed menu
   trigger takes over once the reader has scrolled. */
export default function Navbar() {
    const pathname = usePathname();
    const reduce = useReducedMotion();
    const [hot, setHot] = useState<string | null>(null);

    return (
        <header className="absolute inset-x-0 top-0 z-40">
            <nav aria-label="Primary" className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
                <Link href="/" className="roll-host group flex items-center gap-2.5 rounded-full" aria-label={`${profile.name} — home`}>
                    <BrandMark size={30} />
                    <span className="hidden text-small font-semibold tracking-[-0.02em] text-fg xs:inline">
                        {profile.firstName}
                        <span className="text-muted font-medium"> {profile.lastName}</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <LayoutGroup id="nav">
                        <ul
                            className="glass flex items-center rounded-full p-1"
                            onPointerLeave={() => setHot(null)}
                        >
                            {LINKS.map((l) => {
                                const current = pathname === l.href;
                                const lit = hot === l.href;
                                return (
                                    <li key={l.href} className="relative">
                                        {lit && (
                                            <m.span
                                                layoutId="nav-marker"
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-ink-2 dark:bg-paper"
                                                transition={
                                                    reduce
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 420, damping: 36 }
                                                }
                                            />
                                        )}
                                        <Link
                                            href={l.href}
                                            aria-current={current ? "page" : undefined}
                                            onPointerEnter={() => setHot(l.href)}
                                            onFocus={() => setHot(l.href)}
                                            onBlur={() => setHot(null)}
                                            className={`relative z-10 flex h-9 items-center gap-1.5 rounded-full px-3 text-small sm:px-4 font-medium transition-colors duration-300 ${
                                                lit ? "text-paper dark:text-ink-2" : "text-fg"
                                            }`}
                                        >
                                            {current && (
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-1.5 w-1.5 rounded-full ${lit ? "bg-accent-bright" : "bg-accent"}`}
                                                />
                                            )}
                                            {l.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </LayoutGroup>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}
