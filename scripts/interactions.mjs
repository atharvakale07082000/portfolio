/**
 * Interaction checks: menu (open/Esc/focus return, route-aware glides),
 * keyboard focus visibility, skills physics coming to rest, copy email,
 * theme persistence, chatbot round-trip, contact "Sending…" state.
 *   node scripts/interactions.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
const ok = (name, pass, detail = "") => results.push(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);

async function fresh(width = 1440, opts = {}) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: "light", ...opts });
    await ctx.addInitScript(() => {
        try {
            sessionStorage.setItem("ak-booted", "1");
        } catch {}
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
    return { ctx, page, errors };
}

const sectionTop = (page, id) => page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);

/* 1. Menu basics on home */
{
    const { ctx, page, errors } = await fresh();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.mouse.wheel(0, 1600);
    await page.waitForTimeout(1200);
    const trigger = page.locator("[aria-controls=site-menu]");
    await trigger.click();
    await page.waitForTimeout(900);
    ok("menu opens (aria-expanded)", (await trigger.getAttribute("aria-expanded")) === "true");
    ok("menu dialog present", (await page.locator("#site-menu[role=dialog]").count()) === 1);
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    ok("focus moves into menu", /Home/.test(focused ?? ""), focused);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1600);
    ok("Esc closes menu", (await page.locator("#site-menu").count()) === 0);
    ok("focus returns to trigger", await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "site-menu"));
    // choose Skills from the menu on home
    await trigger.click();
    await page.waitForTimeout(800);
    await page.locator("#site-menu button", { hasText: "Skills" }).click();
    await page.waitForTimeout(2200);
    const top = await sectionTop(page, "skills");
    ok("home: menu glides to Skills (offset 200)", Math.abs(top - 200) < 40, `section top at ${Math.round(top)}px`);
    ok("home: no console errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
}

/* 2. Route-aware menu */
for (const [route, target, expect] of [
    ["/about", "works", "/"],
    ["/contact", "skills", "/"],
    ["/projects", "services", "/"],
    ["/about", "about", "/about"],
]) {
    const { ctx, page, errors } = await fresh();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(900);
    await page.locator("[aria-controls=site-menu]").click();
    await page.waitForTimeout(900);
    const label = target[0].toUpperCase() + target.slice(1);
    const here = await page.locator("#site-menu button[aria-current=location]").textContent().catch(() => null);
    await page.locator("#site-menu button", { hasText: label }).click();
    await page.waitForTimeout(3000);
    const path = new URL(page.url()).pathname;
    if (expect === "/") {
        const top = await sectionTop(page, target);
        ok(`${route} → ${label}: lands on section`, path === "/" && Math.abs(top - 200) < 40, `path ${path}, top ${Math.round(top)}px`);
    } else {
        const y = await page.evaluate(() => scrollY);
        ok(`${route} → ${label}: marked current, scrolls to top`, path === route && /About/.test(here ?? "") && y < 5, `here="${here}", scrollY ${y}`);
    }
    ok(`${route}: no console errors`, errors.length === 0, errors.join(" | "));
    await ctx.close();
}

/* 3. Keyboard: every focus stop shows a visible indicator */
{
    const { ctx, page } = await fresh();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const misses = [];
    for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                name: (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30),
                ring: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0,
                visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
            };
        });
        if (info && (!info.ring || !info.visible)) misses.push(`${info.name}${info.ring ? "" : " (no ring)"}${info.visible ? "" : " (off-screen)"}`);
    }
    ok("keyboard: 40 tab stops have a visible ring", misses.length === 0, misses.slice(0, 5).join("; "));
    await ctx.close();
}

/* 4. Skills physics: drag, shake, and everything comes to rest */
{
    const { ctx, page, errors } = await fresh();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.getElementById("skills").scrollIntoView());
    await page.waitForTimeout(4500);
    const orb = page.locator("#skills [title=Python]");
    const box = await orb.boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + 200, box.y - 200, { steps: 8 });
        const held = await page.locator("#skills p", { hasText: "Python" }).first().isVisible().catch(() => false);
        ok("drag shows held skill name", held);
        await page.mouse.up();
    } else ok("orb rendered", false);
    await page.getByRole("button", { name: "Shake" }).click();
    await page.waitForTimeout(300);
    const moving = await page.evaluate(() => [...document.querySelectorAll("#skills [title]")].map((e) => e.style.transform));
    await page.waitForTimeout(9000);
    const a = await page.evaluate(() => [...document.querySelectorAll("#skills [title]")].map((e) => e.style.transform));
    await page.waitForTimeout(1500);
    const b = await page.evaluate(() => [...document.querySelectorAll("#skills [title]")].map((e) => e.style.transform));
    ok("shake moves the orbs", moving.some((t, i) => t !== a[i]));
    ok("orbs come to rest (no endless spin)", a.every((t, i) => t === b[i]), `${a.filter((t, i) => t !== b[i]).length} still moving`);
    ok("orb sizes are numbers (no NaN)", !a.join().includes("NaN"));
    ok("skills: no console errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
}

/* 5. Copy email + theme persistence */
{
    const { ctx, page } = await fresh(1440, { permissions: ["clipboard-read", "clipboard-write"] });
    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Copy address/ }).click();
    await page.waitForTimeout(300);
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    ok("copy email writes the address", clip.includes("@"), clip);
    await page.getByRole("button", { name: /Switch to dark theme/ }).first().click();
    await page.reload({ waitUntil: "networkidle" });
    ok("theme persists across reload", (await page.getAttribute("html", "data-theme")) === "dark");
    ok("contact page hides footer CTA", (await page.getByText("What's next").count()) === 0);
    await ctx.close();
}

/* 6. Chatbot round-trip (reply or a clean error) */
{
    const { ctx, page } = await fresh();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Ask AI about Atharva's work/ }).click();
    await page.waitForTimeout(800);
    ok("chat panel opens with input focused", await page.evaluate(() => document.activeElement?.id === "chat-input"));
    await page.fill("#chat-input", "What is he building at Onit?");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(12000);
    const text = await page.locator("#chat-panel").innerText();
    const replied = /text-to-SQL|Onit|Strands/i.test(text.split("What is he building at Onit?")[1] ?? "");
    const errored = /didn't come back/.test(text);
    ok("chat answers or shows a clean error", replied || errored, replied ? "streamed a reply" : "error state shown");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    ok("Esc closes chat", (await page.locator("#chat-panel").count()) === 0);
    await ctx.close();
}

/* 7. Contact form "Sending…" (only when an endpoint is configured) */
{
    const { ctx, page } = await fresh();
    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    const action = await page.getAttribute("form", "action");
    if (action && action.startsWith("http")) {
        await page.route(action, async (route) => {
            await new Promise((r) => setTimeout(r, 900));
            await route.fulfill({ status: 200, body: "{}", contentType: "application/json" });
        });
        await page.getByText("Backend", { exact: true }).click();
        await page.fill("#name", "Test Person");
        await page.fill("#email", "test@example.com");
        await page.fill("#message", "Hello from the interaction test.");
        await page.getByRole("button", { name: /Send message/ }).click();
        await page.waitForTimeout(200);
        ok("form shows Sending…", (await page.getByText("Sending…").count()) > 0);
        await page.waitForTimeout(1200);
        ok("form shows success", (await page.getByText(/on its way/).count()) > 0);
    } else {
        ok("form falls back to mailto without an endpoint", (action ?? "").startsWith("mailto:"), action ?? "");
    }
    await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("✗")) ? 1 : 0);
