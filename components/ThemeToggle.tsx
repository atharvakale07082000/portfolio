"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light-first with a dark toggle. The initial value is already on
 * <html> from the inline script in app/layout.tsx — this only reads it
 * back and lets the choice be changed and remembered.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "dark" : "light");
        setReady(true);
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch {
            /* private mode — the choice just won't persist */
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className={`w-11 h-11 -mr-2.5 inline-flex items-center justify-center text-graphite hover:text-ink transition-colors ${className}`}
        >
            {/* Render nothing until the real theme is known, so the icon
                never contradicts the page. */}
            <span className={ready ? "" : "opacity-0"}>
                {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </span>
        </button>
    );
}
