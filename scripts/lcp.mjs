/** LCP timing under 4x CPU throttle: node scripts/lcp.mjs <url> [booted] */
import { chromium } from "playwright";
const [, , url, booted = "0"] = process.argv;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.6 });
if (booted === "1") await ctx.addInitScript(() => sessionStorage.setItem("ak-booted", "1"));
await ctx.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((l) =>
        l.getEntries().forEach((e) => window.__lcp.push([Math.round(e.startTime), e.element?.tagName, (e.element?.className || "").toString().slice(0, 40), e.size]))
    ).observe({ type: "largest-contentful-paint", buffered: true });
});
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(5000);
const fcp = await p.evaluate(() => Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime));
console.log("FCP", fcp, "LCP entries", JSON.stringify(await p.evaluate(() => window.__lcp)));
await b.close();
