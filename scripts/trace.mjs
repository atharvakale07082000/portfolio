/** CPU-throttled trace of a page load; prints the heaviest main-thread events.
 *  node scripts/trace.mjs <url> [booted=1|0] [width] */
import { chromium } from "playwright";
const [, , url, booted = "0", width = "412"] = process.argv;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: +width, height: 823 }, deviceScaleFactor: 2 });
if (booted === "1") await ctx.addInitScript(() => sessionStorage.setItem("ak-booted", "1"));
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await b.startTracing(p, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(5000);
const buf = await b.stopTracing();
const ev = JSON.parse(buf.toString()).traceEvents;
const main = ev.filter((e) => e.ph === "X" && e.dur > 30000 && e.name !== "ThreadControllerImpl::RunTask" && e.name !== "RunTask");
const top = main.sort((a, c) => c.dur - a.dur).slice(0, 14);
for (const e of top) console.log(String(Math.round(e.dur / 1000)).padStart(5), "ms", e.name, e.args?.data?.url?.slice(-50) ?? e.args?.data?.functionName ?? "");
const sum = {};
for (const e of ev) if (e.ph === "X" && e.dur && ["Layout", "UpdateLayoutTree", "Paint", "PrePaint", "Layerize", "FunctionCall", "EvaluateScript", "v8.compile", "ParseHTML", "HitTest", "IntersectionObserverController::computeIntersections", "Commit"].includes(e.name)) sum[e.name] = (sum[e.name] ?? 0) + e.dur / 1000;
console.log(Object.entries(sum).map(([k, v]) => `${k}:${Math.round(v)}`).join("  "));
await b.close();
