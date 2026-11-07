/**
 * Boot-state helpers shared by the opening loader and the menu. The loader
 * holds the scroll lock; anything that wants to scroll the page on arrival
 * (the menu gliding to a section after a route change) waits for it here.
 */

export const BOOT_KEY = "ak-booted";
const EVENT = "boot:done";

declare global {
    interface Window {
        __bootDone?: boolean;
    }
}

export function isBootDone(): boolean {
    return typeof window !== "undefined" && window.__bootDone === true;
}

export function markBootDone(): void {
    if (typeof window === "undefined") return;
    window.__bootDone = true;
    document.documentElement.setAttribute("data-booted", "");
    try {
        sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
        /* storage blocked — the loader simply plays again next visit */
    }
    window.dispatchEvent(new Event(EVENT));
}

export function whenBootDone(): Promise<void> {
    if (isBootDone()) return Promise.resolve();
    return new Promise((resolve) => {
        window.addEventListener(EVENT, () => resolve(), { once: true });
    });
}
