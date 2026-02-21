"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, FileText } from "lucide-react";
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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 brutalist-card px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-black tracking-tighter uppercase">
                ATHARVA<span className="text-blue-600">.</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "text-xs font-bold uppercase tracking-widest transition-colors",
                            pathname === link.href ? "text-black" : "text-gray-400 hover:text-black"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
                <a
                    href="https://github.com/atharvakale07082000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black transition-colors"
                >
                    <Github size={20} />
                </a>
                <a
                    href="https://www.linkedin.com/in/atharva-kale-7b0b53177/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black transition-colors"
                >
                    <Linkedin size={20} />
                </a>
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden text-black"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 mt-4 w-full bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col items-center gap-6 py-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "text-xl font-black uppercase tracking-tighter transition-colors",
                                        pathname === link.href ? "text-blue-600" : "text-black hover:text-blue-600"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex gap-6 mt-4">
                                <a
                                    href="https://github.com/atharvakale07082000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full text-black hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    <Github size={24} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/atharva-kale-7b0b53177/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full text-black hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
