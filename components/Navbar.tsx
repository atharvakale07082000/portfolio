"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Projects", href: "/projects" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="glass fixed top-0 inset-x-0 z-50 h-12 border-x-0 border-t-0">
            <div className="max-w-6xl mx-auto h-full px-5 md:px-8 flex justify-between items-center">
                <Link href="/" className="text-[17px] font-semibold tracking-tight text-ink">
                    Atharva Kale
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-9">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                "text-[13px] tracking-tight transition-colors",
                                pathname === link.href
                                    ? "text-ink font-medium"
                                    : "text-muted hover:text-ink"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-5">
                    <a
                        href="https://github.com/atharvakale07082000"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-muted hover:text-ink transition-colors"
                    >
                        <Github size={17} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/atharva-kale-7b0b53177/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-muted hover:text-ink transition-colors"
                    >
                        <Linkedin size={17} />
                    </a>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-ink"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="glass md:hidden border-x-0 border-t border-b-0"
                    >
                        <div className="flex flex-col px-6 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "py-3 text-[19px] font-medium tracking-tight border-b border-hairline/60 transition-colors",
                                        pathname === link.href ? "text-accent" : "text-ink"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex gap-4 pt-5">
                                <a
                                    href="https://github.com/atharvakale07082000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-muted hover:text-ink transition-colors"
                                >
                                    <Github size={22} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/atharva-kale-7b0b53177/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-muted hover:text-ink transition-colors"
                                >
                                    <Linkedin size={22} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
