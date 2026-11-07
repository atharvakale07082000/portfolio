"use client";

import { useReducedMotion } from "@/components/system/clientValues";

import { m } from "framer-motion";
import { socials } from "@/lib/content";
import { SOCIAL_ICONS } from "./socialIcons";

/** Narrow screens: the socials run down the left edge of the backdrop. */
export default function MenuRail() {
    const reduce = useReducedMotion();
    return (
        <nav
            aria-label="Elsewhere"
            className="pointer-events-none fixed inset-y-0 left-0 z-[105] flex w-16 flex-col items-center justify-center gap-3"
        >
            <span className="label mb-2 text-white/60 [writing-mode:vertical-rl] rotate-180" aria-hidden="true">
                Elsewhere
            </span>
            {socials.map((s, i) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                    <m.div
                        key={s.label}
                        initial={{ opacity: 0, x: reduce ? 0 : -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: reduce ? 0 : 0.15 + i * 0.05 }}
                    >
                        <a
                            href={s.href}
                            {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            {...(s.label === "Résumé" ? { download: true } : {})}
                            aria-label={`${s.label}: ${s.handle}`}
                            className="surface-dark btn btn-ghost btn-icon pointer-events-auto"
                        >
                            {Icon && <Icon size={17} aria-hidden="true" />}
                        </a>
                    </m.div>
                );
            })}
        </nav>
    );
}
