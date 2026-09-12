"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const links = [
    { name: "Index", href: "/" },
    { name: "Work", href: "/projects" },
    { name: "Experience", href: "/experience" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close the drawer on navigation and lock the page behind it.
    useEffect(() => setOpen(false), [pathname]);
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header className="chrome rule-b fixed top-0 inset-x-0 z-50">
            <nav
                aria-label="Primary"
                className="max-w-[1180px] mx-auto h-14 px-5 md:px-8 flex items-center justify-between gap-6"
            >
                <Link
                    href="/"
                    className="display text-[17px] tracking-[-0.03em] text-ink shrink-0 h-11 inline-flex items-center"
                >
                    {profile.name}
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => {
                        const current = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                aria-current={current ? "page" : undefined}
                                className="relative px-3.5 h-11 inline-flex items-center text-[14px] tracking-[-0.01em] transition-colors"
                                style={{ color: current ? "var(--ink)" : "var(--graphite)" }}
                            >
                                {link.name}
                                {current && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-3.5 right-3.5 bottom-2.5 h-px bg-signal"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <ThemeToggle />
                    <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hidden md:inline-flex w-11 h-11 items-center justify-center text-graphite hover:text-ink transition-colors"
                    >
                        <Github size={16} />
                    </a>
                    <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hidden md:inline-flex w-11 h-11 -mr-2.5 items-center justify-center text-graphite hover:text-ink transition-colors"
                    >
                        <Linkedin size={16} />
                    </a>

                    <button
                        type="button"
                        className="md:hidden w-11 h-11 -mr-2.5 inline-flex items-center justify-center text-ink"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-nav"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden rule-t"
                        style={{ background: "var(--paper)" }}
                    >
                        <div className="px-5 pt-2 pb-6">
                            {links.map((link) => {
                                const current = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        aria-current={current ? "page" : undefined}
                                        className="display rule-b flex items-center justify-between py-4 text-[28px] tracking-[-0.035em]"
                                        style={{ color: current ? "var(--signal)" : "var(--ink)" }}
                                    >
                                        {link.name}
                                        <span className="telemetry text-rule-strong">
                                            {link.href === "/" ? "index" : link.href.slice(1)}
                                        </span>
                                    </Link>
                                );
                            })}
                            <div className="flex gap-2 pt-5">
                                <a
                                    href={profile.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="panel w-12 h-12 inline-flex items-center justify-center text-graphite"
                                >
                                    <Github size={18} />
                                </a>
                                <a
                                    href={profile.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="panel w-12 h-12 inline-flex items-center justify-center text-graphite"
                                >
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
