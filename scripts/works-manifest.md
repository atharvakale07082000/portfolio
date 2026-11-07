# Works gallery — screenshot manifest

Captured 2026-11-07 by `scripts/capture-works.mjs` (Playwright + system Chrome).
Every app was run **locally** against local databases and seeded or test data.
No production database, account or service was written to.
Desktop frames are 1440×900 @2x (2880×1800) unless noted. Mobile frames are 390×844 @3x (1170×2532).
Every image was opened and checked before it was kept. None shows secrets, API keys, tokens or real personal data.
All email addresses, including seeded ones, are hidden by the script's `maskEmails` pass.

## atelier/ — Atelier (AI tutor)

| File | Screen | What it shows |
|---|---|---|
| `landing.webp` | Landing page, logged out | Hero "Learn like it's measured." with the live Elo **rating readout** card (current → 1680 target for Backend Engineer) |
| `landing-mobile.webp` | Landing, 390 wide | Responsive hero, CTAs and the top of the rating readout |
| `chat-reasoning.webp` | Ask Atelier chat, **mid-stream** | The live **"Thinking…" reasoning stream** as the Learning Assistant specialist works ("Working out what you're really asking" ✓ → "Thinking it through" …), with the agent roster status bar |
| `chat-answer.webp` | Ask Atelier chat, settled | The same turn finished: re-opened **Reasoning** panel (3 first-person steps) above a structured answer on B-tree composite vs single-column indexes, with inline code |
| `progress.webp` | Progress | **Elo-driven skill mastery** for 6 topics after 9 real adaptive quizzes (76% … 71% of the mastery threshold), XP, quiz accuracy, activity heatmap |
| `dashboard.webp` | Learner dashboard | Greeting, job-readiness/XP/skills stats, AI-picked prep modules, the skill-mastery sidebar and leaderboard |

Run notes:
- `frontend` (Vite) on :5173. `backend` (`uvicorn app.main:socket_app`) on :8000 with `MONGO_URL=mongodb://127.0.0.1:27017` and `MONGO_DATABASE=atelier_local` set as launch-time env overrides, so the Atlas URI in `.env` was never used.
- The test learner "Mira" (`mira.demo@example.com`) was created through Atelier's own onboarding against the local Mongo. Its progress data comes from real `/quiz/generate` and `/quiz/{id}/submit` calls.
- The configured NIM models are gone: `qwen3-next-80b` returns 410 and `nemotron-3-super-120b` returns 404 for this key. The chat ran with `NIM_ORCHESTRATOR_MODEL`/`NIM_SPECIALIST_MODEL`/`NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b`, set as env overrides at launch.
- Hugging Face inference returns **402 Payment Required**: the HF credits are exhausted. Topic classification and recommendations degrade, but nothing shown here depends on HF.

## neuralscope/ — NeuralScope (LLM observability)

| File | Screen | What it shows |
|---|---|---|
| `trace-waterfall.webp` | Trace detail, **1440×1180 @2x** | **Execution waterfall for a 6-step agent run** (`support_agent: refund request`): root `agent_step` → plan (LLM) → KB retrieval → order-status tool call → rerank chain → draft reply (LLM, 2.95 s) → guardrail check, plus latency, cost ($0.0262), tokens (6,220) and trace attributes |
| `trace-explorer.webp` | Trace explorer list | Recent traces with latency, model, cost and status (OK/ERROR). The 6-step run sits at the top |
| `prompt-diff.webp` | Prompt registry → `customer-support` | **Version lineage (v1–v4) with a unified diff** between the deployed v3 and the new v4 prompt (grounding, citation and tool-error rules added) |
| `dashboard.webp` | Analytics dashboard | Spans, cost, average quality and error-rate KPIs, the activity-over-time latency chart and the quality heatmap |
| `cost-intelligence.webp` | Cost intelligence | Window spend, average call price, optimisation score and **daily cost stacked by model** |
| `quality-monitor.webp` | Quality monitor | Average quality coefficient, **hallucination index**, quality-score distribution and hallucination delta charts |

Run notes:
- Backend on :8000 using a scratch venv of `requirements.txt` with `bcrypt==4.0.1` pinned, because passlib 1.7.4 breaks on bcrypt ≥ 4.1 and the seed can't hash passwords. `MONGODB_URI`, `REDIS_URL` (db 5) and `CORS_ORIGINS` were overridden to local values. Data comes from `python seed.py` (200 traces, prompts and alert rules).
- The waterfall trace was sent through NeuralScope's own `POST /api/v1/ingest/traces` with a local org API key minted via `POST /auth/api-keys`. The seeded spans all start at t=0 with equal durations, so every seeded waterfall is a flat stack.
- The v4 prompt was authored through the registry's own "New Iteration" form, because the seeded v1–v3 templates are identical one-liners.
- Upstream bugs worked around **without editing the repo** (worth fixing in the project):
  1. **No `postcss.config.js` in `frontend/`**, so Tailwind never runs and the app renders unstyled (the April `dist/` build has only 1.9 KB of CSS). Vite was launched with an out-of-tree `--config` that adds `tailwindcss` + `autoprefixer`.
  2. **`get_org_from_auth` requires an `x-api-key` header even for JWT sessions**, so every dashboard call returns 401 in a browser. The capture script attaches the local org key to API requests.
  3. **`TraceResponse.id`/`org_id` are typed `str` but Beanie returns `ObjectId`**, so `GET /traces` and the ingest response return 500. The backend was served through a tiny launcher outside the repo that substitutes a coercing subclass.
- No mobile frame: the layout is desktop-only (the sidebar fills a 390-wide viewport).

## aevum/ — Aevum (collaborative decisions)

| File | Screen | What it shows |
|---|---|---|
| `decision-ai-summary.webp` | Decision → **AI Summary** rail | Live tally (Metrika Cloud 75% / Observa OSS 25%) next to the Strands analyst's **senior-alignment risk** card (turnout 4/4, lead 50 pts) and model-written **key considerations** |
| `consensus-report.webp` | Decision history | **Consensus report**: 85% estimated likelihood of consensus (stated heuristic) on Metrika Cloud, the analyst's prose, and the full decision timeline |
| `decision-voting.webp` | Decision → Timeline tab | **Voting/consensus panel**: participants with roles (Lead/Moderator/Member/Viewer), weighted options with vote shares, timeline and the **Live Insight** card |
| `decision-ask.webp` | "Ask about this decision" | Grounded Q&A ("What would it take for Observa OSS to win?") with a provenance footer ("Answered from: 4 option(s) · 4 ballot(s)…") and the Live Insight card |
| `workspace.webp` | Workspace dashboard | Open/finalized counts and the decision list (Draft / Voting / Finalized) |
| `decision-mobile.webp` | Decision, 390 wide | Responsive decision header and option cards with live vote shares |

Run notes:
- Docker isn't installed, so the existing Homebrew Postgres 16 and Redis stood in for `make setup`.
- `aevum_backend` ran via `./mvnw spring-boot:run` with the `dev` profile (Flyway + `V900__sample_data.sql`) against a new local database `aevum_local`. `DB_URL`, `DB_USERNAME` and `DB_PASSWORD` were overridden in the process env, and `make` (which `include`s `.env`) was not used, so the teammate's Supabase was never touched.
- The frontend signed in as seeded member Ava Chen.
- `aevum_ai` (Strands) ran on :8001 from a scratch venv. Its configured `nemotron-3-super-120b` returns 404 for this key, so it ran with `AEVUM_AI_NIM_MODEL=nvidia/nemotron-3-ultra-550b-a55b`.
- The smaller `nemotron-3.5-lightning` was tried first and overstated the 75/25 split ("commands the entire weight"). Those frames were discarded. The script re-asks the analyst if the report overstates the split.
- `aevum_frontend` (Next 16) ran on :3001 with `NEXT_PUBLIC_API_BASE_URL`/`API_BASE_URL=http://localhost:8080` and `AI_BASE_URL=http://localhost:8001` overriding the Render URLs in `.env`. The Next dev badge and TanStack devtools button are hidden.
- No Aevum code was changed.

## echo/ — ECHO (local voice agent, terminal)

| File | Screen | What it shows |
|---|---|---|
| `terminal-session.webp` | `python main.py --text` session, rendered as a terminal window (2380×2296) | Boot banner (llama3.2 via Ollama, 21 agents, guardrails active). The command → **guardrail prompt** (`⚠ Confirmation Required`, action `move_file`) → declined with "no" → the planner's **workflow table** (`disk_agent` ✅ done, `file_agent` ⏭ skipped "user declined confirmation") → ECHO's spoken-style summary |

Run notes:
- Ollama was installed (`brew install ollama`) and `llama3.2` pulled.
- ECHO ran from a scratch venv under Python 3.12. The system `python3` is now a Homebrew 3.15, which has no faster-whisper wheels.
- `HOME` pointed at a sandbox folder of dummy files (`~/Downloads/q3-roadmap-draft-v1.pdf` …), so ECHO's memory, audit log and snapshots and every file path stayed inside that sandbox. A no-op `say` shim muted TTS.
- The session was recorded in a pty with `TTY_INTERACTIVE=0` (colours kept, no spinners). The capture script then renders it via Rich's SVG export: set `ECHO_SESSION=<file.ansi>` and `ECHO_PY=<python with rich>`.
- The guarded action was declined, so no file was moved.
- ECHO's own quirks, seen but not fixed:
  - llama3.2 (3B) tends to route file tasks to `finder_agent` (AppleScript), which times out.
  - It never passes `operation: list` to `file_agent`.
  - The intent classifier sometimes refuses "delete" commands before planning.
  - The `main.py` imports mix `import config` and `from echo import config`, so it only runs with a parent dir that exposes the repo as an `echo` package.

## Projects that could not be fully run

All four projects ran. What's partial:
- **Atelier**: Hugging Face-backed features (topic classification, feed recommendations) are degraded because of HF 402.
- **NeuralScope**: Replay Studio and Alerts were not captured.
- **ECHO**: voice mode was not exercised (text mode only).
