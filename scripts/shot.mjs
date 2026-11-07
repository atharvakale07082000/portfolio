/** Screenshot helper: node scripts/shot.mjs <url> <out.png> [w] [h] [theme] [js-to-run-first] */
import { chromium } from "playwright";
const [,, url, out, w = "1440", h = "900", theme = "light", action = ""] = process.argv;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, colorScheme: theme });
await ctx.addInitScript((t) => { localStorage.setItem("theme", t); sessionStorage.setItem("ak-booted", "1"); }, theme);
const p = await ctx.newPage();
const errs = [];
p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
p.on("pageerror", (e) => errs.push(e.message));
await p.goto(url, { waitUntil: "networkidle" });
if (action) await p.evaluate(action);
await p.waitForTimeout(1800);
await p.screenshot({ path: out });
console.log(errs.length ? errs.join("\n") : "no errors");
await b.close();
