import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/system/SmoothScroll";
import ButtonFx from "@/components/system/ButtonFx";
import Loader from "@/components/system/Loader";
import Navbar from "@/components/chrome/Navbar";
import Footer from "@/components/chrome/Footer";
import Menu from "@/components/chrome/Menu";
import ChatLauncher from "@/components/chat/ChatLauncher";
import { profile } from "@/lib/content";
import { BOOT_KEY } from "@/lib/boot";

/* Fonts are vendored (Latin subset) so the build never needs a CDN and the
   browser never makes a third-party request. Both are small and preloaded. */
const inter = localFont({
    src: "./fonts/Inter-Variable.woff2",
    variable: "--font-inter",
    weight: "100 900",
    display: "swap",
    preload: true,
    fallback: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
});

const serif = localFont({
    src: "./fonts/InstrumentSerif-Italic.woff2",
    variable: "--font-instrument-serif",
    weight: "400",
    style: "italic",
    display: "swap",
    // The hero headline (the LCP) uses it for its accent word, so preload too.
    preload: true,
    fallback: ["Georgia", "serif"],
});

const description =
    "Atharva Kale — AI & Backend Engineer in Pune building multi-agent platforms, text-to-SQL and RAG systems, and the Python backends that keep them fast under load.";

export const metadata: Metadata = {
    metadataBase: new URL(profile.siteUrl),
    title: {
        default: `${profile.name} — ${profile.role}`,
        template: `%s — ${profile.name}`,
    },
    description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: profile.github }],
    keywords: ["AI Engineer", "Backend Engineer", "Agentic AI", "RAG", "FastAPI", "LangGraph", "Pune"],
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: profile.name,
        title: `${profile.name} — ${profile.role}`,
        description: profile.statement,
        url: "/",
    },
    twitter: {
        card: "summary_large_image",
        title: `${profile.name} — ${profile.role}`,
        description: profile.statement,
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
    colorScheme: "light dark",
};

/* Before first paint: resolve the theme (no flash) and mark returning
   visits as booted so the loader stays hidden. */
const headScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");var dark=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;d.setAttribute("data-theme",dark?"dark":"light");}catch(e){}try{if(sessionStorage.getItem("${BOOT_KEY}")){d.setAttribute("data-booted","");window.__bootDone=true;}}catch(e){d.setAttribute("data-booted","");window.__bootDone=true;}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-theme="light" suppressHydrationWarning className={`${inter.variable} ${serif.variable}`}>
            <head>
                <script dangerouslySetInnerHTML={{ __html: headScript }} />
                <noscript>
                    <style>{`.boot{display:none!important}html{overflow:auto!important}`}</style>
                </noscript>
            </head>
            <body>
                <a
                    href="#main"
                    className="btn btn-accent sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300]"
                >
                    Skip to content
                </a>
                <SmoothScroll>
                    <ButtonFx />
                    <Loader />
                    <Navbar />
                    <main id="main" tabIndex={-1} className="outline-none">
                        {children}
                    </main>
                    <Footer />
                    <Menu />
                    <ChatLauncher />
                </SmoothScroll>
            </body>
        </html>
    );
}
