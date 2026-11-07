/* The brand mark: an accent squircle carrying a bracketed monogram — an
   engineer's mark, quiet enough to sit next to a wordmark. The same
   geometry is drawn by app/icon.tsx for the favicons. */

export default function BrandMark({ size = 30, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            aria-hidden="true"
            className={className}
        >
            <defs>
                <linearGradient id="bm-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgb(var(--accent-bright-rgb))" />
                    <stop offset="1" stopColor="rgb(var(--accent-rgb))" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#bm-g)" />
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
