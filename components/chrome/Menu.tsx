"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import {
    glideTo,
    glideTop,
    routeForSection,
    sections,
    setPendingSection,
} from "@/lib/menu";

/* The panel (and its constellation) is only downloaded when the reader
   shows intent: first hover or focus on the trigger, or first open. */
const loadPanel = () => import("./MenuPanel");
const MenuPanel = dynamic(loadPanel, { ssr: false });

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Which section is on screen (home) or which section this route expands. */
function detectCurrent(pathname: string): string | null {
    if (pathname !== "/") {
        const hit = Object.entries(routeForSection).find(([, route]) => route === pathname);
        return hit ? hit[0] : null;
    }
    let current: string | null = "home";
    const line = window.innerHeight * 0.45;
    for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
    }
    return current;
}

function trapTab(e: KeyboardEvent, trigger: HTMLElement | null) {
    const scope = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-menu-scope] ${FOCUSABLE.split(", ").join(`, [data-menu-scope] `)}`)
    );
    const items = trigger ? [trigger, ...scope] : scope;
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = active ? items.includes(active) : false;
    if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
    }
}

export default function Menu() {
    const lenis = useLenis();
    const pathname = usePathname();
    const router = useRouter();
    const reduce = useReducedMotion();
    const { scrollY, scrollYProgress } = useScroll();
    const triggerRef = useRef<HTMLButtonElement>(null);

    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });
    const [current, setCurrent] = useState<string | null>(null);

    useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 300));

    const visible = scrolled || open;

    function openMenu() {
        const r = triggerRef.current?.getBoundingClientRect();
        if (r) {
            setOrigin({
                x: r.left + r.width / 2,
                y: r.top + r.height / 2,
                r: Math.hypot(window.innerWidth, window.innerHeight),
            });
        }
        setCurrent(detectCurrent(pathname));
        lenis?.stop();
        setOpen(true);
    }

    function closeMenu(returnFocus = true) {
        setOpen(false);
        lenis?.start();
        if (returnFocus) triggerRef.current?.focus();
    }

    function select(id: string) {
        closeMenu(false);
        if (pathname === "/") {
            requestAnimationFrame(() => glideTo(lenis, id));
            return;
        }
        if (routeForSection[id] === pathname) {
            glideTop(lenis);
            return;
        }
        setPendingSection(id);
        router.push("/");
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                lenis?.start();
                triggerRef.current?.focus();
            } else if (e.key === "Tab") {
                trapTab(e, triggerRef.current);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, lenis]);

    const ease = [0.76, 0, 0.24, 1] as const;

    return (
        <>
            {/* Show/hide lives on a wrapper so framer's inline transform never
                fights the .btn hover lift on the button itself. */}
            <m.div
                className="fixed right-[var(--gutter)] top-3 z-[130] sm:top-4"
                initial={false}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -18 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ pointerEvents: visible ? "auto" : "none" }}
                inert={!visible}
            >
                <button
                    ref={triggerRef}
                    type="button"
                    aria-expanded={open}
                    aria-controls="site-menu"
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => (open ? closeMenu() : openMenu())}
                    onPointerEnter={() => void loadPanel()}
                    onFocus={() => void loadPanel()}
                    className="btn btn-ghost glass h-12 gap-3 pl-2 pr-4 [--btn-fill:rgb(var(--fg-rgb))] [--btn-fg:rgb(var(--bg-rgb))]"
                >
                    <span className="relative grid h-8 w-8 place-items-center" aria-hidden="true">
                        <svg viewBox="0 0 32 32" className="absolute inset-0 h-full w-full -rotate-90">
                            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
                            <m.circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="rgb(var(--accent-rgb))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                style={{ pathLength: scrollYProgress }}
                            />
                        </svg>
                        <span className="relative flex h-3 w-3.5 flex-col justify-center">
                            <m.span
                                className="absolute left-0 h-[1.5px] w-full rounded bg-current"
                                initial={false}
                                animate={open ? { y: 0, rotate: 45 } : { y: -2.5, rotate: 0 }}
                                transition={{ duration: reduce ? 0 : 0.35, ease }}
                            />
                            <m.span
                                className="absolute left-0 h-[1.5px] w-full rounded bg-current"
                                initial={false}
                                animate={open ? { y: 0, rotate: -45 } : { y: 2.5, rotate: 0 }}
                                transition={{ duration: reduce ? 0 : 0.35, ease }}
                            />
                        </span>
                    </span>
                    <span className="relative inline-grid overflow-hidden text-small font-medium" aria-hidden="true">
                        <span
                            className="col-start-1 row-start-1 transition-transform duration-500 ease-out"
                            style={{ transform: open ? "translateY(-130%)" : "translateY(0)" }}
                        >
                            Menu
                        </span>
                        <span
                            className="col-start-1 row-start-1 transition-transform duration-500 ease-out"
                            style={{ transform: open ? "translateY(0)" : "translateY(130%)" }}
                        >
                            Close
                        </span>
                    </span>
                </button>
            </m.div>

            <AnimatePresence>
                {open && (
                    <MenuPanel
                        key="menu"
                        origin={origin}
                        current={current}
                        pathname={pathname}
                        onSelect={select}
                        onClose={() => closeMenu()}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
