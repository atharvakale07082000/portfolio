"use client";

import { useSyncExternalStore } from "react";

/* Date-dependent values never appear in pre-rendered HTML. Each hook
   returns null on the server and during hydration, then the real value in
   the browser — no stale build-time numbers, no hydration mismatch. */

const noopSubscribe = () => () => {};
const serverNull = () => null;

function minuteSubscribe(cb: () => void) {
    const id = window.setInterval(cb, 10_000);
    return () => window.clearInterval(id);
}

const timeFormatters = new Map<string, Intl.DateTimeFormat>();
function formatterFor(timeZone: string) {
    let f = timeFormatters.get(timeZone);
    if (!f) {
        f = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone,
        });
        timeFormatters.set(timeZone, f);
    }
    return f;
}

/** "14:05" in the given zone, refreshed every few seconds. */
export function useLocalTime(timeZone: string): string | null {
    return useSyncExternalStore(
        minuteSubscribe,
        () => formatterFor(timeZone).format(new Date()),
        serverNull
    );
}

export function ageFrom(isoDob: string, now: Date): number {
    const dob = new Date(`${isoDob}T00:00:00`);
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
    return age;
}

/** Age in whole years, or null on the server / when no date is set. */
export function useAge(isoDob: string | null): number | null {
    return useSyncExternalStore(
        noopSubscribe,
        () => (isoDob ? ageFrom(isoDob, new Date()) : null),
        serverNull
    );
}

/** The current year, client-only. */
export function useYear(): number | null {
    return useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), serverNull);
}

const RM = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
    const mq = window.matchMedia(RM);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

/**
 * prefers-reduced-motion, hydration-safe: false on the server and during
 * hydration (matching the pre-rendered markup), the real value right after.
 */
export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
}
