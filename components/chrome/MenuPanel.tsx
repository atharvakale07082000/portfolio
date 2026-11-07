"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { m } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { BtnIcon, BtnLabel } from "@/components/system/Btn";
import Roll from "@/components/system/Roll";
import LocalTime from "@/components/system/LocalTime";
import ThemeToggle from "./ThemeToggle";
import MenuConstellation from "./MenuConstellation";
import MenuRail from "./MenuRail";
import { pages, sections } from "@/lib/menu";
import { profile } from "@/lib/content";

type Props = {
    origin: { x: number; y: number; r: number };
    current: string | null;
    pathname: string;
    onSelect: (id: string) => void;
    onClose: () => void;
};

const WIDE = "(min-width: 1024px)";
function subscribeWide(cb: () => void) {
    const mq = window.matchMedia(WIDE);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}
const getWide = () => window.matchMedia(WIDE).matches;

const ease = [0.76, 0, 0.24, 1] as const;

export default function MenuPanel({ origin, current, pathname, onSelect, onClose }: Props) {
    const reduce = useReducedMotion();
    const wide = useSyncExternalStore(subscribeWide, getWide, () => false);
    const firstRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        firstRef.current?.focus({ preventScroll: true });
    }, []);

    const at = `at ${origin.x}px ${origin.y}px`;
    const clip = reduce
        ? {}
        : {
              initial: { clipPath: `circle(0px ${at})` },
              animate: { clipPath: `circle(${origin.r}px ${at})` },
              exit: { clipPath: `circle(0px ${at})` },
          };

    return (
        <>
            {/* Backdrop: blurred, and a click anywhere on it closes the menu. */}
            <m.div
                className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.5, ease }}
            />

            {/* Socials live on the backdrop, outside the panel. */}
            <div data-menu-scope>
                {wide ? <MenuConstellation /> : <MenuRail />}
            </div>

            {/* The panel grows as a circle from the trigger and closes back into it.
                The clip sits on a full-viewport layer so the circle can use
                viewport coordinates; the layer itself ignores the pointer. */}
            <m.div
                className="pointer-events-none fixed inset-0 z-[110]"
                {...clip}
                {...(reduce
                    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
                    : {})}
                transition={{ duration: reduce ? 0.15 : 0.75, ease }}
            >
                <div
                    id="site-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    data-menu-scope
                    data-lenis-prevent
                    className="surface-dark-2 pointer-events-auto absolute inset-y-0 right-0 flex w-[calc(100%-4rem)] flex-col overflow-y-auto rounded-l-[2rem] px-6 pb-8 pt-24 sm:px-10 lg:w-[520px] xl:w-[560px]"
                >
                    <p className="label text-muted">Sections</p>
                    <ul className="dim-list mt-5 flex flex-col">
                        {sections.map((s, i) => {
                            const here = current === s.id;
                            return (
                                <li key={s.id} className="transition-opacity duration-300">
                                    <button
                                        ref={i === 0 ? firstRef : undefined}
                                        type="button"
                                        onClick={() => onSelect(s.id)}
                                        aria-current={here ? "location" : undefined}
                                        className="group flex w-full items-baseline gap-4 rounded-xl py-1.5 text-left"
                                    >
                                        <span className="w-7 shrink-0 text-caption tabular-nums text-muted">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-h2 font-semibold text-fg transition-colors duration-300 group-hover:text-accent-bright">
                                            {s.label}
                                        </span>
                                        {here && (
                                            <span className="chip ml-auto self-center whitespace-nowrap border-accent-bright/40 text-accent-bright">
                                                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
                                                You are here
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <p className="label mt-10 text-muted">Pages</p>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                        {pages.map((p) => (
                            <li key={p.href}>
                                <Link
                                    href={p.href}
                                    onClick={onClose}
                                    aria-current={pathname === p.href ? "page" : undefined}
                                    className={`roll-host text-body font-medium ${
                                        pathname === p.href ? "text-accent-bright" : "text-fg"
                                    }`}
                                >
                                    <Roll text={p.label} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/contact" onClick={onClose} className="btn btn-accent btn-lg">
                                <BtnLabel>Let&apos;s talk</BtnLabel>
                                <BtnIcon>
                                    <FiArrowUpRight size={18} />
                                </BtnIcon>
                            </Link>
                            <ThemeToggle />
                        </div>
                        <a
                            href={`mailto:${profile.email}`}
                            className="roll-host mt-6 inline-block break-all text-small text-fg"
                        >
                            <Roll text={profile.email} />
                        </a>
                        <p className="mt-2 text-caption text-muted">
                            <LocalTime /> · Available for interesting problems
                        </p>
                    </div>
                </div>
            </m.div>
        </>
    );
}
