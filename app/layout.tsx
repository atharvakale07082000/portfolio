import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { profile } from "@/lib/content";

/* Fonts are vendored into app/fonts/ from the @fontsource-variable
   packages, so the build never depends on reaching Google's CDN and the
   browser never makes a third-party request. To update them, reinstall the
   @fontsource-variable packages and re-copy the woff2 files from their
   `files` directories in node_modules. */

/* Display — variable, slightly off-kilter. Carries the personality. */
const bricolage = localFont({
    src: "./fonts/BricolageGrotesque-Variable.woff2",
    variable: "--font-bricolage",
    weight: "200 800",
    display: "swap",
    fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/* Body — clean with a little grit. */
const instrument = localFont({
    src: [
        { path: "./fonts/InstrumentSans-Variable.woff2", style: "normal" },
        { path: "./fonts/InstrumentSans-VariableItalic.woff2", style: "italic" },
    ],
    variable: "--font-instrument",
    weight: "400 700",
    display: "swap",
    fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/* Telemetry — wide and technical. Labels and numerals only. */
const martian = localFont({
    src: "./fonts/MartianMono-Variable.woff2",
    variable: "--font-martian",
    weight: "300 700",
    display: "swap",
    fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
    title: `${profile.name} — ${profile.role}`,
    description:
        "Backend and AI engineer building streaming multi-agent systems, retrieval pipelines, and the infrastructure that keeps them up under load.",
    openGraph: {
        title: `${profile.name} — ${profile.role}`,
        description: profile.statement,
        type: "website",
    },
};

/* Resolve the theme before first paint so there is no flash. Mirrors the
   logic in components/ThemeToggle.tsx. */
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-theme="light" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body
                className={`${bricolage.variable} ${instrument.variable} ${martian.variable} min-h-screen flex flex-col`}
            >
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-signal focus:text-signal-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium"
                >
                    Skip to content
                </a>
                <Navbar />
                <main id="main" className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
                <Chatbot />
            </body>
        </html>
    );
}
