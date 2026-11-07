import type Lenis from "lenis";
import { testimonials } from "./content";

export type SectionLink = { id: string; label: string };

/** Home sections, in page order. Reviews appears only once it has content. */
export const sections: SectionLink[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "works", label: "Works" },
    ...(testimonials.length > 0 ? [{ id: "reviews", label: "Reviews" }] : []),
    { id: "skills", label: "Skills" },
];

export const pages = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
];

/** Routes that are the full version of a home section. */
export const routeForSection: Record<string, string> = {
    about: "/about",
    works: "/projects",
};

export const SECTION_OFFSET = -200;

/* A section requested from another route, consumed by the home page once it
   mounts. Module state survives client-side navigation, which is all this
   needs; a hard reload simply lands at the top. */
let pendingSection: string | null = null;

export function setPendingSection(id: string | null): void {
    pendingSection = id;
}

export function peekPendingSection(): string | null {
    return pendingSection;
}

export function takePendingSection(): string | null {
    const id = pendingSection;
    pendingSection = null;
    return id;
}

export function glideTo(lenis: Lenis | undefined, id: string, attempt = 0): void {
    const el = id === "home" ? 0 : document.getElementById(id);
    if (el === null) return;
    const offset = id === "home" ? 0 : SECTION_OFFSET;
    if (lenis) {
        lenis.scrollTo(el, {
            offset,
            duration: attempt === 0 ? 1.2 : 0.6,
            force: true,
            // Lazy content above the target can shift it mid-glide; correct once or twice.
            onComplete: () => {
                if (el === 0 || attempt >= 2) return;
                const drift = el.getBoundingClientRect().top - -offset;
                if (Math.abs(drift) > 4) glideTo(lenis, id, attempt + 1);
            },
        });
        return;
    }
    const top = el === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function glideTop(lenis: Lenis | undefined): void {
    if (lenis) lenis.scrollTo(0, { duration: 1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
}
