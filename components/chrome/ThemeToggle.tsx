"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { BtnIcon } from "@/components/system/Btn";

type Theme = "light" | "dark";

function subscribe(cb: () => void) {
    const mo = new MutationObserver(cb);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
}

const getTheme = (): Theme =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

function setTheme(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    try {
        localStorage.setItem("theme", next);
    } catch {
        /* storage blocked: the choice lasts for this page view */
    }
}

/** Light/dark switch. The theme is resolved before paint by the layout script. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
    const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
    const dark = theme === "dark";
    return (
        <button
            type="button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={theme === null ? undefined : dark}
            className={`btn btn-ghost btn-icon glass ${className}`}
        >
            <BtnIcon dir="down">{dark ? <FiSun size={17} /> : <FiMoon size={17} />}</BtnIcon>
        </button>
    );
}
