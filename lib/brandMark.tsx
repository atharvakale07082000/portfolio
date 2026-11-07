/* The brand mark drawn for next/og (favicons, OG images). Mirrors
   components/chrome/BrandMark.tsx; image routes cannot read CSS variables,
   so the two accent values are restated here from globals.css. */
export const ACCENT = "#0071E3";
export const ACCENT_BRIGHT = "#2997FF";

export function MarkSvg({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={ACCENT_BRIGHT} />
                    <stop offset="1" stopColor={ACCENT} />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#g)" />
            <path
                d="M10.6 22.5 15 9.5h2l4.4 13M12.3 17.8h7.4"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
