"use client";

import { useLocalTime } from "./clientValues";
import { profile } from "@/lib/content";

/** Live local time for the home city. Renders a neutral placeholder on the server. */
export default function LocalTime({ className = "", withCity = true }: { className?: string; withCity?: boolean }) {
    const time = useLocalTime(profile.timeZone);
    return (
        <span className={`tabular-nums ${className}`}>
            {withCity && <>{profile.city}, </>}
            <time>{time ?? "--:--"}</time>
            <span className="sr-only"> local time</span>
            <span aria-hidden="true"> IST</span>
        </span>
    );
}
