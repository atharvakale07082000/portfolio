/**
 * Builds app/favicon.ico from the brand mark (16, 32 and 48 px PNG frames).
 *   node scripts/make-favicon.mjs
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const svg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2997FF"/><stop offset="1" stop-color="#0071E3"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#g)"/><path d="M10.6 22.5 15 9.5h2l4.4 13M12.3 17.8h7.4" fill="none" stroke="#fff" stroke-width="${s <= 16 ? 2.8 : 2.2}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
const frames = [];
for (const s of [16, 32, 48]) {
    await page.setViewportSize({ width: s, height: s });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg(s)}</body></html>`);
    frames.push({ s, png: await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } }) });
}
await browser.close();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = 6 + 16 * frames.length;
const dir = frames.map(({ s, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s, 0);
    e.writeUInt8(s, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...dir, ...frames.map((f) => f.png)]));
console.log("app/favicon.ico written");
