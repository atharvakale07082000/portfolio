/** @type {import('tailwindcss').Config} */

/* Every colour resolves through a CSS variable defined in app/globals.css.
   Surface-scoped tokens (bg, fg, muted, line, link) change with the
   section's surface class and with the theme, so components never need to
   know whether they sit on a light or a dark section. */
const rgb = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const type = ["display", "h1", "h2", "h3", "h4", "lead", "body", "small", "caption", "code"];

module.exports = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
    darkMode: ["selector", '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                accent: rgb("accent"),
                "accent-bright": rgb("accent-bright"),
                "ink-0": rgb("ink-0"),
                "ink-1": rgb("ink-1"),
                "ink-2": rgb("ink-2"),
                paper: rgb("paper"),
                "paper-0": rgb("paper-0"),
                bg: rgb("bg"),
                raised: rgb("raised"),
                fg: rgb("fg"),
                muted: rgb("muted"),
                link: rgb("link"),
                "sys-blue": rgb("sys-blue"),
                "sys-indigo": rgb("sys-indigo"),
                "sys-purple": rgb("sys-purple"),
                "sys-pink": rgb("sys-pink"),
                "sys-orange": rgb("sys-orange"),
                "sys-green": rgb("sys-green"),
                "sys-teal": rgb("sys-teal"),
                line: "var(--line)",
                "line-strong": "var(--line-strong)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
                mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
            },
            fontSize: Object.fromEntries(
                type.map((t) => [
                    t,
                    [`var(--fs-${t})`, { lineHeight: `var(--lh-${t})`, letterSpacing: `var(--ls-${t})` }],
                ])
            ),
            transitionTimingFunction: {
                apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                out: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            maxWidth: {
                shell: "1280px",
            },
            screens: {
                xs: "420px",
                "3xl": "1800px",
            },
        },
    },
    plugins: [],
};
