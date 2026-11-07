/**
 * Layout + console check across widths, themes and motion preferences.
 *   node scripts/verify.mjs [baseUrl] [--routes=/,/about] [--themes=light,dark] [--reduced]
 * Reports: horizontal overflow (with offenders), console errors, page errors,
 * hydration warnings, and overlapping interactive elements in each viewport.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000";
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d);
const routes = opt("routes", "/,/about,/contact,/projects,/experience").split(",");
const themes = opt("themes", "light,dark").split(",");
const widths = opt("widths", "320,390,768,1024,1440,1920").split(",").map(Number);
const reduced = args.includes("--reduced");

const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;

for (const theme of themes) {
    for (const width of widths) {
        const ctx = await browser.newContext({
            viewport: { width, height: 900 },
            colorScheme: theme,
            reducedMotion: reduced ? "reduce" : "no-preference",
        });
        await ctx.addInitScript((t) => {
            try {
                localStorage.setItem("theme", t);
                sessionStorage.setItem("ak-booted", "1");
            } catch {}
        }, theme);
        const page = await ctx.newPage();
        const logs = [];
        page.on("console", (m) => {
            if (m.type() === "error" || /hydrat/i.test(m.text())) logs.push(`console.${m.type()}: ${m.text().slice(0, 300)}`);
        });
        page.on("pageerror", (e) => logs.push(`pageerror: ${e.message.slice(0, 300)}`));

        for (const route of routes) {
            logs.length = 0;
            await page.goto(base + route, { waitUntil: "networkidle" });
            const result = await page.evaluate(async () => {
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                const vw = document.documentElement.clientWidth;
                const overflowAt = [];
                const overlaps = new Set();
                // body uses overflow-x: clip, so scrollWidth alone can hide real
                // overflow. Also flag visible elements that cross the viewport edge
                // without an ancestor (below body) that clips them.
                const clipped = (el) => {
                    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
                        const s = getComputedStyle(n);
                        if (s.overflowX !== "visible" || s.clipPath !== "none") return true;
                        if (s.position === "fixed") return false;
                    }
                    return false;
                };
                const escapees = () =>
                    [...document.querySelectorAll("body *")]
                        .filter((el) => {
                            const r = el.getBoundingClientRect();
                            if (r.width === 0 || r.height === 0) return false;
                            if (r.right <= vw + 1 && r.left >= -1) return false;
                            if (getComputedStyle(el).visibility === "hidden") return false;
                            if (el.closest(".sr-only")) return false;
                            return !clipped(el);
                        })
                        .slice(0, 4)
                        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).slice(0, 60)} [${Math.round(el.getBoundingClientRect().left)}→${Math.round(el.getBoundingClientRect().right)}]`);
                const check = () => {
                    const esc = escapees();
                    if (esc.length) overflowAt.push(`${Math.round(window.scrollY)} (escaping): ${esc.join(" | ")}`);
                    if (document.documentElement.scrollWidth > window.innerWidth + 0.5) {
                        const off = [...document.querySelectorAll("body *")]
                            .filter((el) => {
                                const r = el.getBoundingClientRect();
                                return r.width > 0 && r.right > vw + 1;
                            })
                            .slice(0, 4)
                            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
                        overflowAt.push(`${Math.round(window.scrollY)}: ${off.join(" | ")}`);
                    }
                    const els = [...document.querySelectorAll("a[href], button, input, textarea, [role=button]")].filter((el) => {
                        if (el.closest("[inert], [aria-hidden=true], .sr-only")) return false;
                        const s = getComputedStyle(el);
                        if (s.visibility === "hidden" || s.opacity === "0" || el.classList.contains("sr-only")) return false;
                        const r = el.getBoundingClientRect();
                        return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
                    });
                    for (let i = 0; i < els.length; i++) {
                        for (let j = i + 1; j < els.length; j++) {
                            const a = els[i], b = els[j];
                            if (a.contains(b) || b.contains(a)) continue;
                            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
                            const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
                            const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
                            if (w > 3 && h > 3) {
                                // A fixed control floating over content is expected; only flag same-layer overlaps.
                                const fixed = (el) => { for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).position === "fixed") return true; return false; };
                                if (fixed(a) !== fixed(b)) continue;
                                const name = (el) => (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30);
                                overlaps.add(`${name(a)} ✕ ${name(b)}`);
                            }
                        }
                    }
                };
                const step = Math.round(innerHeight * 0.6);
                for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await sleep(140);
                    check();
                }
                window.scrollTo(0, 0);
                return { overflowAt: overflowAt.slice(0, 3), overlaps: [...overlaps].slice(0, 6) };
            });
            const bad = result.overflowAt.length || result.overlaps.length || logs.length;
            if (bad) problems++;
            console.log(
                `${bad ? "✗" : "✓"} ${theme.padEnd(5)} ${String(width).padStart(4)} ${route}` +
                    (result.overflowAt.length ? `\n    overflow: ${result.overflowAt.join("\n              ")}` : "") +
                    (result.overlaps.length ? `\n    overlap: ${result.overlaps.join("; ")}` : "") +
                    (logs.length ? `\n    ${logs.join("\n    ")}` : "")
            );
        }
        await ctx.close();
    }
}
await browser.close();
console.log(problems ? `\n${problems} page/width combinations need attention` : "\nAll clean");
process.exit(problems ? 1 : 0);
