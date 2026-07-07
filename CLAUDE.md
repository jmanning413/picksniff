# PickSniff — Claude Code Instructions
# Operational rules for working in this repo. Read PROJECT.md for architecture,
# GAPS.md for known bugs/debt. Last updated: June 2026.

## What this is
Fragrance matchmaking web app (picksniff.com). 750-fragrance static JSON catalog, six
quizzes funneling into one `/results` page, Supabase auth/user-data, live in production.
- **PROJECT.md** — full architecture, data flow, design decisions, critical paths. Read it before structural changes.
- **GAPS.md** — severity-ordered audit of known bugs, security issues, and debt, each with a scoped fix. Check it before "discovering" a bug.
- **docs/** — business & compliance layer: `GAMEPLAN.md` (phased roadmap — check which phase we're in before proposing work), `AUDIT.md` (product/SEO/perf/a11y/ops audit), `SECURITY.md` (threat model + findings F-1…F-10), `LEGAL.md` (compliance checklist), `COMPETITORS.md` (positioning strategy).
- Priority standing order: GAMEPLAN Phase 0 items (security fix, legal-page truth fixes, disclosures, analytics) come before any new feature work.

## Commands
| Task | Command |
|---|---|
| Dev server | `npm run dev` (Turbopack; use port 3001+ if 3000 busy) |
| Prod build check | `npx next build` — **run before every push**; there are no tests and push = deploy |
| Lint | `npm run lint` |
| Deploy | `git push origin main` → Vercel auto-deploys. **Never** use `npx vercel --prod` or `vercel alias` — manual deploys broke domain aliasing in the past |
| Prod logs | `npx vercel logs` |
| Env vars | `npx vercel env ls` (all prod vars are set; local `.env.local` exists, gitignored) |

There is no test suite and no CI (GAPS.md #4). `npx next build` succeeding is the only gate.

## Environment / workflow gotchas
- Windows 11, PowerShell 5.1 default shell: **no `&&`** in PowerShell tool calls (use `;` or the Bash tool). Heredocs for commit messages work in the Bash tool.
- Git commits: LF→CRLF warnings are normal, ignore them.
- Vercel preview URLs (`picksniff-*.vercel.app`) are SSO-protected — curl them and you get a login page, not the app. Test on picksniff.com or locally with `next build && next start`.
- **Do not Read `public/logo.svg` or `public/logo-icon.svg`** — they are 840 KB base64-PNG-in-SVG files that blow the context window (and see GAPS.md #15).
- Supabase "Confirm email" is deliberately OFF. Sign-up creates a session immediately.
- The developer (Joseph) is a beginner: explain steps plainly, show full code, confirm before overwriting files he made.

## The actual data (this section corrects older docs)
- Catalog lives in **`/fragrances`** (not `/db`): 15 files, `{gender}_{vibe}_final.json`, 50 each, 750 total. `gender` ∈ male/female/unisex, `vibe` ∈ daily/date_night/sport/chill/formal.
- `gender` and `vibe` are NOT in the JSON — `lib/fragrances.js` stamps them from the filename.
- IDs are **string slugs** (`"male-daily-budget-giorgio-armani-acqua-di-gio"`), not numbers. Never `Number()` them (that bug killed the compare page — GAPS.md #2).
- `top_notes` is a duplicate of `accords` — there is no real notes pyramid. `description` is mostly empty (UI synthesizes one). `sephora_url`/`jomashop_url` are null (UI falls back to search links). There is **no `affiliate_type` field** in the data; the Louis Vuitton special case is the hardcoded `BRAND_OVERRIDES` map (currently copy-pasted in 4 files — GAPS.md #12).
- **Do not modify the JSON files unless explicitly asked.** They are the source of truth.
- Fragrance data is cached forever via `unstable_cache` in `lib/fragrances.js` — always read through `loadAllFragrances()` / `getFragranceById()`, never `fs` directly.

## Conventions this codebase follows
- Plain JavaScript, no TypeScript. App Router (Next.js **16**, React 19). Path alias `@/*` = repo root.
- Server components by default; `'use client'` only where state/effects needed. Client children of server pages are named `*Client.js` (`ResultsClient`, `EncyclopediaClient`) or live in `app/_components/`.
- Server actions in `app/_actions/` and `app/auth/actions.js` (`'use server'`, zod-validated, return `{ error }` objects — never throw to the client).
- API routes: zod schema → `safeParse` → generic error strings out, `console.error('[route-name]', err)` server-side. Rate limiting via `lib/ratelimit.js` (Upstash, no-ops without env vars).
- Supabase: `lib/supabase/server.js` (cookie client) in server code, `lib/supabase/client.js` in browser code, inline service-role client (`getAdminClient()` pattern) only where RLS must be bypassed. Never concatenate user input into queries.
- Styling: Tailwind v4 utilities inline, no CSS modules. Brand green = `green-accent` (`#7fe040`, defined in `globals.css` `@theme`). Font DM Sans via `next/font`. Buttons are `rounded-full`, headings `font-black tracking-tight`. White background, clean/minimal, NOT luxury.
- Icons on the quizzes hub are inline SVG components (stroke `#1A1A1A`, strokeWidth 1.75, round caps) — match that style for new icons; no icon libraries.
- All external/buy links: `target="_blank" rel="noopener noreferrer"`.
- Client fetch flows use `react-hot-toast` for feedback; optimistic UI with `useTransition` for save buttons.
- Every quiz page maps its answers onto `{genders, tier, vibe, accords}` and links to `/results?...&mode=<name>`; `mode` only selects copy in `MODE_COPY` (`app/results/ResultsClient.js`). New quiz = new page + hub card + `MODE_COPY` entry + sitemap entry. No backend changes.

## Rules — do not break these
- Match scoring lives in `lib/matchEngine.mjs` (pure, unit-tested via `npm test`); `lib/matchFragrances.js` is a thin loader wrapper — keep it that way. Bands are product decisions, set by the FRACTION of selected accords matched: all → 95–99, ≥2/3 → 80–94, some → 65–79, none → 40–64, no-accords-selected → 50–72 (identical to the old 3/2/1/0 table when 3 are picked). Displayed scores strictly decrease down the list (no ties, no out-of-order %); every selected accord represented in top 5; tier loosens when pool < 5 (tier bonus only applies then). Don't change bands without explicit instruction, and run `npm test` after any engine edit.
- Guests get 10 results / accounts 20 (`limit` in `app/results/page.js` and `/api/quiz/match`). Steps 5–6 of `/quiz` are account-gated.
- The 11 filter accords: Citrus, Floral, Woody, Vanilla, Amber, Spicy, Fresh, Aromatic, Fruity, Aquatic, Green. **Never add Powdery, Leather, or Oud as filter accords.**
- App name is **PickSniff** (never "Scent Percent"). The flagship quiz is the **"Signature Scent Quiz"** (renamed from "Classic Fragrance Quiz" — don't reintroduce "Classic").
- `/premium` is shelved and redirects to `/support` (tip jar). Don't wire anything to `PremiumGate`/`is_premium` — nothing sets it (GAPS.md #8).
- `supabase/schema.sql` lags the live DB (missing `subscribers` — GAPS.md #6). The dashboard DB is the truth.
- No pricing data anywhere; website only (no native app); max 1 LV fragrance per vibe; Byredo/Diptyque live only in unisex lists.
- Secrets only in `.env.local` / Vercel env. Never hardcode (see GAPS.md #1 for the existing violation to fix, not imitate).

## Gotchas (things that look right but aren't)
- The quiz's POST to `/api/quiz/match` is only a validation/rate-limit gate — its response is discarded and `/results` recomputes from URL params. Changing match behavior means changing `lib/matchFragrances.js`, not the API route.
- Errors thrown in client `useEffect`s surface as the generic "Something went wrong" boundary (`app/error.js`). `useUser.js` is hardened with try/catch for this; copy that pattern in new hooks (`useIsPremium` isn't — GAPS.md #16).
- React state arrays must not be mutated: use `[...arr].sort()`, never `arr.sort()` (a past prod bug).
- `middleware.js` runs Supabase session refresh on nearly every route; its cookie handling follows the `@supabase/ssr` recipe exactly — don't "simplify" it.
- Homepage "Recently Viewed" and `LoadingSniff.js` are dead code (GAPS.md #14); don't build on them.
- `/trending` picks are deterministic pseudo-random, not real analytics. Badges beyond `first_sniff`/`collector` are unearnable.
