import Image from "next/image";
import { profile } from "@/lib/content";

/** The portrait, or a monogram card until a photo is added to content. */
export default function Portrait({ className = "", sizes = "(min-width: 1024px) 420px, 90vw", priority = false }: { className?: string; sizes?: string; priority?: boolean }) {
    if (profile.portrait) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} fill sizes={sizes} priority={priority} className="object-cover" />
            </div>
        );
    }
    return (
        <div
            role="img"
            aria-label={`${profile.name} monogram`}
            className={`relative grid place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_20%_10%,rgb(var(--accent-bright-rgb)),rgb(var(--accent-rgb))_45%,rgb(var(--ink-2-rgb))_100%)] ${className}`}
        >
            <span aria-hidden="true" className="font-serif text-[clamp(5rem,14vw,10rem)] italic leading-none text-white/95">
                {profile.initials}
            </span>
            <span aria-hidden="true" className="label absolute bottom-5 left-5 text-white/70">
                {profile.location}
            </span>
        </div>
    );
}
