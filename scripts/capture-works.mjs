#!/usr/bin/env node
/**
 * capture-works.mjs — screenshots of Atharva's projects for the Works gallery.
 *
 * Each project is run locally (see public/works/MANIFEST.md for how), then:
 *
 *   PW_DIR=/path/with/node_modules/{playwright,sharp} \
 *   CREDS_FILE=/path/to/test-creds.env \
 *   node scripts/capture-works.mjs <atelier|neuralscope|aevum|echo> [...]
 *
 * PW_DIR lets the script borrow playwright + sharp from a scratch install so the
 * portfolio's package.json stays untouched (`npm i playwright@1 sharp` anywhere).
 * CREDS_FILE holds KEY=value test credentials for the *local* apps only; values
 * are never logged. Output: public/works/<slug>/<name>.webp at 1440×900 @2x
 * (plus a 390-wide mobile frame where useful).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'works');
const req = createRequire(path.join(process.env.PW_DIR ?? ROOT, 'noop.js'));
const { chromium } = req('playwright');
const sharp = req('sharp');

const creds = process.env.CREDS_FILE
  ? Object.fromEntries(
      fs.readFileSync(process.env.CREDS_FILE, 'utf8').split('\n').filter((l) => l.includes('='))
        .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
    )
  : {};
const need = (k) => creds[k] ?? process.env[k] ?? (() => { throw new Error(`missing ${k}`); })();

const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let browser;
async function context(opts = DESKTOP, extra = {}) {
  browser ??= await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ ...opts, colorScheme: 'light', reducedMotion: 'no-preference', ...extra });
  const page = await ctx.newPage();
  return { ctx, page };
}

/** Screenshot → webp in public/works/<slug>/<name>.webp */
async function save(page, slug, name, shotOpts = {}) {
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  await maskEmails(page);
  const png = await page.screenshot({ type: 'png', ...shotOpts });
  const file = path.join(dir, `${name}.webp`);
  await sharp(png).webp({ quality: 88, effort: 5 }).toFile(file);
  console.log(`  ✓ ${path.relative(ROOT, file)}`);
  return file;
}

/** Hide dev-only overlays (Vite/Next error badges, React Query devtools). */
async function tidy(page) {
  await page.addStyleTag({
    content: `nextjs-portal, [data-nextjs-toast], .tsqd-parent-container, .tsqd-open-btn-container,
      .ReactQueryDevtools, vite-error-overlay { display: none !important; }`,
  }).catch(() => {});
}

/** Belt and braces: no email address (even a seeded one) reaches a published image. */
async function maskEmails(page) {
  await page.evaluate(() => {
    const re = /[\w.+-]+@[\w-]+\.[\w.-]+/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const host = n.parentElement;
      if (!host || /^(style|script|noscript)$/i.test(host.tagName)) continue;
      if (re.test(n.nodeValue)) host.style.visibility = 'hidden';
    }
    for (const el of document.querySelectorAll('input')) {
      if (re.test(el.value)) el.style.visibility = 'hidden';
    }
  }).catch(() => {});
}

// ─────────────────────────────────────────────────────────────── Atelier ──
// frontend :5173 (vite) + backend :8000 (uvicorn app.main:socket_app), local Mongo.
async function atelier() {
  const slug = 'atelier';
  const URL = process.env.ATELIER_URL ?? 'http://localhost:5173';

  { // Landing — logged out
    const { ctx, page } = await context();
    await page.goto(URL + '/', { waitUntil: 'networkidle' });
    await tidy(page);
    await sleep(2500); // let the rating readout animate in
    await save(page, slug, 'landing');
    await ctx.close();
  }
  { // Landing — mobile
    const { ctx, page } = await context(MOBILE);
    await page.goto(URL + '/', { waitUntil: 'networkidle' });
    await tidy(page);
    await sleep(2500);
    await save(page, slug, 'landing-mobile');
    await ctx.close();
  }

  const { ctx, page } = await context();
  // Sign in through the app's own auth form (local test learner).
  await page.goto(URL + '/onboarding', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Sign in', exact: true }).first().click();
  await page.getByPlaceholder('you@example.com').fill(need('ATELIER_EMAIL'));
  await page.locator('input[type=password]').fill(need('ATELIER_PASSWORD'));
  await page.locator('form button[type=submit]').click();
  await page.waitForURL(/dashboard/, { timeout: 30000 });

  { // Chat — the live reasoning stream, then the settled answer with reasoning open
    await page.goto(URL + '/atelier', { waitUntil: 'networkidle' });
    await tidy(page);
    await page.getByRole('button', { name: /New chat/ }).click().catch(() => {});
    await sleep(800);
    const box = page.getByPlaceholder('What would you like to learn today?');
    await box.fill('I keep mixing up B-tree indexes — when does a composite index beat two single-column indexes?');
    await box.press('Meta+Enter');
    await page.getByText('Thinking…').first().waitFor({ timeout: 180000 });
    // Wait until the reasoning panel has at least two first-person steps.
    for (let i = 0; i < 40; i++) {
      const steps = await page.locator('text=/Thinking it through|Working out|Checking|Drafting|Looking/').count();
      if (steps >= 2) break;
      await sleep(400);
    }
    await sleep(1200);
    await save(page, slug, 'chat-reasoning');
    // Settled answer
    await page.getByRole('button', { name: /Send/ }).waitFor({ timeout: 120000 });
    await sleep(1000);
    const toggle = page.getByText('Reasoning', { exact: true }).last();
    await toggle.click().catch(() => {});
    await sleep(600);
    await toggle.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await page.mouse.wheel(0, -180);
    await sleep(800);
    await save(page, slug, 'chat-answer');
  }
  { // Progress — Elo-driven skill mastery after real quizzes
    await page.goto(URL + '/progress', { waitUntil: 'networkidle' });
    await tidy(page);
    await sleep(2500);
    await save(page, slug, 'progress');
  }
  { // Dashboard
    await page.goto(URL + '/dashboard', { waitUntil: 'networkidle' });
    await tidy(page);
    await sleep(2500);
    await save(page, slug, 'dashboard');
  }
  await ctx.close();
}

// ─────────────────────────────────────────────────────────── NeuralScope ──
// Backend :8000 (seed.py + shim, see MANIFEST) and frontend :5173. The frontend
// is hard-wired to http://localhost:8000.
async function neuralscope() {
  const slug = 'neuralscope';
  const URL = process.env.NS_URL ?? 'http://localhost:5173';
  const apiKey = need('NS_API_KEY');

  const login = async (opts) => {
    const { ctx, page } = await context(opts);
    // Upstream bug: get_org_from_auth requires an x-api-key header even for JWT
    // sessions, so the dashboard 401s in a plain browser. Attach the local org's
    // key (minted via POST /auth/api-keys) to API calls only.
    await ctx.route('http://localhost:8000/**', (route) =>
      route.continue({ headers: { ...route.request().headers(), 'x-api-key': apiKey } }));
    await page.goto(URL + '/login', { waitUntil: 'networkidle' });
    await page.locator('input[type=email]').fill(need('NS_EMAIL'));
    await page.locator('input[type=password]').fill(need('NS_PASSWORD'));
    await page.locator('input[type=password]').press('Enter');
    await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 20000 });
    return { ctx, page };
  };
  const visit = async (page, p) => {
    await page.goto(URL + p, { waitUntil: 'networkidle' });
    await tidy(page);
    await sleep(3000); // framer-motion entrances + recharts animations
  };

  const { ctx, page } = await login();
  await visit(page, '/dashboard');
  await save(page, slug, 'dashboard');

  await visit(page, '/traces');
  await save(page, slug, 'trace-explorer');

  // Trace detail — the ingested 6-step support-agent run (newest trace).
  await page.getByText('support_agent: refund request').first().click({ force: true });
  await page.getByText('Execution Waterfall').waitFor();
  await sleep(2500);
  // The waterfall card scrolls internally and fits ~4 rows at 900px tall, so this
  // one frame is taken at 1440×1180 to show the root span + all six steps.
  await page.setViewportSize({ width: 1440, height: 1180 });
  await sleep(1500);
  await save(page, slug, 'trace-waterfall');
  await page.setViewportSize(DESKTOP.viewport);

  // Prompt registry — diff of the deployed version against a new iteration.
  await visit(page, '/prompts');
  await page.getByText('customer-support').first().click({ force: true });
  await page.getByText('Version Archives', { exact: false }).waitFor();
  await sleep(1500);
  const pathway = await page.getByText(/PATHWAY:/).first().innerText();
  const [, latest, deployed] = pathway.match(/LAYER\s*(\d+)\s*→\s*LAYER\s*(\d+)/i) ?? [];
  if (latest && latest === deployed) {
    // Seeded versions are identical one-liners; author v(n+1) through the
    // registry's own "New Iteration" form so the diff viewer has a real change.
    await page.getByText('New Iteration', { exact: false }).first().click({ force: true });
    await page.locator('textarea').first().fill(
      'You are an expert technical support engineer for Acme.\n' +
      'Ground every answer in the retrieved KB articles; cite their IDs.\n' +
      'If the order status tool returns an error, say so — never guess.\n' +
      'Solve the following: {{issue}}\n' +
      'Reply in under 120 words.',
    );
    await page.getByText('Commit to Registry').first().click({ force: true });
    await sleep(3000);
  }
  const expand = page.getByText(/Expand \d+ lines/);
  if (await expand.count()) await expand.first().click({ force: true }).catch(() => {});
  await sleep(1000);
  await save(page, slug, 'prompt-diff');

  await visit(page, '/cost');
  await save(page, slug, 'cost-intelligence');
  await visit(page, '/quality');
  await save(page, slug, 'quality-monitor');
  await ctx.close();
  // No mobile frame: NeuralScope's layout is desktop-only (sidebar fills 390px).
}

// ───────────────────────────────────────────────────────────────── Aevum ──
// Spring Boot :8080 (dev profile seed, local Postgres), Strands AI :8001,
// Next 16 frontend :3001. Signs in as a seeded member (V900__sample_data.sql).
async function aevum() {
  const slug = 'aevum';
  const URL = process.env.AEVUM_URL ?? 'http://localhost:3001';
  const DECISION = 'Select the primary analytics vendor';

  const login = async (opts) => {
    const { ctx, page } = await context(opts);
    await page.goto(URL + '/login', { waitUntil: 'networkidle', timeout: 120000 });
    await page.locator('input[type=email]').fill(need('AEVUM_EMAIL'));
    await page.locator('input[type=password]').fill(need('AEVUM_PASSWORD'));
    await page.locator('input[type=password]').press('Enter');
    await page.waitForURL(/\/app\//, { timeout: 30000 });
    await tidy(page);
    return { ctx, page };
  };
  const openDecision = async (page) => {
    await page.goto(URL + '/app', { waitUntil: 'networkidle' });
    await page.getByText(DECISION).first().click();
    await page.waitForURL(/\/app\/d\//);
    await tidy(page);
    await sleep(2500);
    return page.url().split('?')[0];
  };
  const aiTab = async (page) => {
    await page.getByRole('tab', { name: /AI Summary/ }).click()
      .catch(() => page.getByText('AI Summary').first().click());
    // The summary is model-written; wait for the consensus-risk card to land.
    // Card heading is dynamic (consensus / senior-alignment risk…); wait on the turnout row.
    await page.getByText(/^Turnout$/).first().waitFor({ timeout: 180000 });
    await page.getByText(/Key considerations/i).first().waitFor({ timeout: 180000 });
    await sleep(1500);
  };

  const { ctx, page } = await login();
  await page.goto(URL + '/app', { waitUntil: 'networkidle' });
  await tidy(page);
  await sleep(1500);
  await save(page, slug, 'workspace');

  const decisionUrl = await openDecision(page);
  await page.getByText(/Live insight/i).first().waitFor({ timeout: 180000 });
  await sleep(1200);
  await save(page, slug, 'decision-voting');
  await aiTab(page);
  await save(page, slug, 'decision-ai-summary');

  // Ask about this decision — grounded Q&A over the live tally.
  const ask = page.getByPlaceholder(/Where are we stuck/i);
  if (await ask.count()) {
    await ask.fill('What would it take for Observa OSS to win this?');
    await ask.press('Enter');
    await page.waitForTimeout(1000);
    await page.waitForFunction(() => !document.body.innerText.includes('Thinking'), null, { timeout: 180000 }).catch(() => {});
    await sleep(6000);
    await ask.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await sleep(800);
    await save(page, slug, 'decision-ask');
  }

  await page.goto(decisionUrl + '/timeline', { waitUntil: 'networkidle' });
  await tidy(page);
  await page.getByText(/estimated likelihood of consensus/i).first().waitFor({ timeout: 180000 });
  await sleep(1500);
  // The figures are computed; only the prose is model-written. If a run
  // overstates the 75/25 split, ask the analyst to rewrite it (max 3 tries).
  for (let i = 0; i < 3; i++) {
    const card = await page.getByText(/Consensus report/i).first().locator('xpath=ancestor::div[2]').innerText();
    if (!/entire|all of the vote|unanimous|100% of the vote/i.test(card)) break;
    await page.getByRole('button', { name: /Refresh/ }).first().click();
    await sleep(12000);
  }
  await save(page, slug, 'consensus-report');
  await ctx.close();

  { // Mobile — decision with live tally
    const { ctx: m, page: mp } = await login(MOBILE);
    await openDecision(mp);
    await save(mp, slug, 'decision-mobile');
    await m.close();
  }
}

// ────────────────────────────────────────────────────────────────── ECHO ──
// ECHO is a terminal app. Record a `python main.py --text` session in a pty
// (ANSI kept; see MANIFEST for the recording setup), then render it here:
//   ECHO_SESSION=/path/session.ansi  ECHO_PY=/path/to/python-with-rich
// Rich turns the ANSI into a window-framed SVG; Chrome rasterises it at 2x.
async function echo() {
  const slug = 'echo';
  const session = need('ECHO_SESSION');
  const py = need('ECHO_PY');
  const svgPath = path.join(os.tmpdir(), `echo-session-${process.pid}.svg`);
  execFileSync(py, ['-c', `
import re, sys
from rich.console import Console
from rich.text import Text
from rich.terminal_theme import MONOKAI
raw = open(sys.argv[1], 'rb').read().decode('utf-8', 'replace')
raw = raw.replace('\\r\\n', '\\n').replace('\\r', '')
raw = re.sub(r'\\x1b\\[\\?25[hl]', '', raw)            # cursor show/hide
raw = raw.rstrip() + '\\n'
c = Console(record=True, width=96, force_terminal=True, color_system='truecolor', file=open('/dev/null', 'w'))
c.print(Text.from_ansi(raw), end='')
c.save_svg(sys.argv[2], title='echo — python main.py --text', theme=MONOKAI)
`, session, svgPath]);

  const { ctx, page } = await context({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  let svg = fs.readFileSync(svgPath, 'utf8');
  fs.rmSync(svgPath);
  // Rich emits only a viewBox; give the root real dimensions so it lays out.
  const [, , vw, vh] = svg.match(/viewBox="([\d.\s]+)"/)[1].trim().split(/\s+/).map(Number);
  svg = svg.replace('<svg ', `<svg width="${vw}" height="${vh}" `);
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent;display:inline-block">${svg}</body></html>`,
  );
  await sleep(500); // webfont (Fira Code) in Rich's SVG
  const el = page.locator('svg').first();
  await save(el, slug, 'terminal-session', { omitBackground: true });
  await ctx.close();
}

const projects = { atelier, neuralscope, aevum, echo };

const which = process.argv.slice(2);
if (!which.length) {
  console.error(`usage: node scripts/capture-works.mjs <${Object.keys(projects).join('|')}> [...]`);
  process.exit(1);
}
try {
  for (const slug of which) {
    if (!projects[slug]) throw new Error(`unknown project ${slug}`);
    console.log(`▸ ${slug}`);
    await projects[slug]();
  }
} finally {
  await browser?.close();
}
