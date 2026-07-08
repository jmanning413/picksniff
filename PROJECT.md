# PROJECT.md — PickSniff Architecture & Orientation

> Written June 2026 as a knowledge-transfer document. Read this before touching anything
> non-trivial. Known problems are catalogued in `GAPS.md`. Operational rules live in `CLAUDE.md`.

---

## What this is

PickSniff (picksniff.com) is a fragrance recommendation web app — "the dating app for
fragrances." A complete beginner answers a short quiz (gender → price tier → vibe →
accords) and gets a ranked list of fragrance matches with XP-style match-percentage bars
and buy buttons linking to Sephora/Jomashop. The catalog is 750 hand-curated fragrances
stored as static JSON. Revenue is affiliate links (not yet wired — see GAPS). PickSniff is permanently
100% free: no premium tiers, ever; Stripe handles optional donations only.

The owner/developer (Joseph) is a self-described beginner. The site is live in production
on Vercel, deployed automatically on every push to `main` on GitHub
(`jmanning413/picksniff`). There is no staging environment: **push = deploy to prod**.

## Tech stack and why

| Piece | Choice | Why it's here |
|---|---|---|
| Framework | Next.js 16, App Router, JS (no TS) | Vercel-native, one deploy target for pages + API. Plain `.js` everywhere — beginner-friendly, no build friction. |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`, `@theme inline` in `globals.css`) | Utility classes inline in JSX; no component library. Brand token `--color-green-accent: #7fe040` used as `text-green-accent` etc. |
| Auth + DB | Supabase (Postgres + RLS + cookie auth via `@supabase/ssr`) | Free tier, hosted auth. Only *user* data lives here — the fragrance catalog does not. |
| Catalog | 15 static JSON files in `/fragrances`, loaded through `unstable_cache` | Catalog is immutable; avoids DB round-trips entirely. This was a deliberate decision — do not migrate it to Supabase casually. |
| Payments | Stripe (one-time donations only) | PickSniff is permanently free; premium was removed June 2026. `/premium` 301s to `/support`. |
| Email | Resend (`lib/resend.js`), from `hello@picksniff.com` | Welcome email on subscribe/signup, manual broadcasts. |
| Rate limiting | Upstash Redis via `@upstash/ratelimit` | Only on the quiz-match API. No-ops gracefully when env vars absent. |
| Validation | Zod on every API route and server action | |

Every external service degrades gracefully: `getStripe()`, `getResend()`,
`getAdminClient()`, and `checkRateLimit()` all return `null`/pass-through when their env
vars are missing, so the app boots locally with no `.env.local` at all.

## Architecture

```
                     ┌──────────────────────────────────────────┐
                     │ /fragrances/*.json (15 files, 750 items) │  ← source of truth
                     └───────────────┬──────────────────────────┘
                                     │ lib/fragrances.js
                                     │ loadAllFragrances()  (unstable_cache, never expires,
                                     │ stamps gender+vibe from filename onto each object)
              ┌──────────────────────┼───────────────────────────────┐
              │                      │                               │
   lib/matchFragrances.js     Server components               app/api/quiz/accords
   (scoring engine)           (/encyclopedia, /fragrance/[id],  (GET, feeds quiz Step 4)
              │                /brand, /trending, /seasonal,
              │                /notes, /accords, /compare, /)
              │
   ┌──────────┴─────────────┐
   │                        │
 /results (server page,   /api/quiz/match (POST, zod + Upstash
 re-runs matching from     rate limit; the quiz calls this as a
 URL search params)        validation/rate-limit gate, then
                           navigates to /results — the response
                           body is currently discarded)

 Supabase (user data only): profiles, wishlist, owned, quiz_results, subscribers
   • middleware.js refreshes the session cookie on every request, guards /profile
   • lib/supabase/server.js — cookie-scoped client for server components/actions
   • lib/supabase/client.js — browser client (NEXT_PUBLIC_ vars)
   • service-role admin client created inline where RLS must be bypassed
     (subscribe route, broadcast route, unsubscribe page, signup auto-enroll)

 Stripe: /api/stripe/checkout (donations) → hosted checkout → /api/stripe/webhook (logs only)
 Resend: /api/subscribe → welcome email;  /api/broadcast → batch email to all subscribers
```

### The quiz constellation

There are six quizzes, all funneling into the same `/results` page via URL params
(`genders`, `tier`, `vibe`, `accords`, optional `concentrations`, optional `mode`):

- `/quiz` — the flagship "Signature Scent Quiz." 4 steps for guests; steps 5–6
  (concentration, notes) appear for logged-in users behind `AccountGate`. Step 4 fetches
  live accord availability from `/api/quiz/accords` (one fetch per selected gender,
  unioned client-side, sorted by how many gender pools contain each accord, with a
  hardcoded fallback list).
- `/quiz/personality`, `/quiz/mood`, `/quiz/seasonal`, `/quiz/astrology`, `/quiz/gift` —
  themed front-ends that map fun answers onto the same `{genders, tier, vibe, accords}`
  shape and link to `/results?mode=<name>`. `mode` only changes the results-page copy
  (`MODE_COPY` in `ResultsClient.js`); the matching is identical.
- `/quizzes` — the hub page listing all six with inline SVG icons.

### The matching engine (`lib/matchFragrances.js`) — most load-bearing file

1. Filter pool by gender(s) + vibe, optionally concentration.
2. `getTierPool`: filter to requested tier, but **loosen to the whole pool if fewer than
   5 remain** (so users always get results).
3. `scoreFragrance`: accord-match count sets a score **band** (3 matches → 95–99,
   2 → 80–94, 1 → 65–79, 0 → 40–64, no accords selected → 50–72). Secondary signals
   (tier match, vibe-weight accords, note matches, accord richness) position within the
   band. Bands make scores feel meaningful and never cross.
4. Sort, then `applyAccordGuarantee`: every selected accord must appear on at least one
   top-5 result; swaps candidates in from the remainder without displacing the sole cover
   of another accord.
5. `uniquePercentages`: decrement duplicated scores so no two results tie.

`getAvailableAccords(gender, tier, vibe)` shares the same pool/tier-loosening logic and
returns accords sorted by frequency — this keeps quiz Step 4 honest (never offer an
accord that would produce zero band-3 results).

### Data shape (actual, not the CLAUDE.md idealization)

```json
{
  "id": "male-daily-budget-giorgio-armani-acqua-di-gio",   // STRING slug, not a number
  "name": "Acqua di Giò",
  "brand": "Giorgio Armani",
  "concentration": "EDT",
  "tier": "budget",
  "accords": ["Aquatic", "Citrus", "Fresh"],       // Capitalized
  "top_notes": ["Aquatic", "Citrus", "Fresh"],     // ⚠ duplicate of accords, NOT a real notes pyramid
  "description": "",                                // mostly empty; UI synthesizes from accords
  "sephora_url": null,                              // never populated; UI falls back to search URLs
  "jomashop_url": null
}
```

`gender` and `vibe` are **not in the files** — `loadFile()` stamps them from the filename
(`{gender}_{vibe}_final.json`). Fragrance IDs are referenced as `text` in Supabase
(`wishlist.fragrance_id` etc.), which is consistent with the slug IDs.

### Supabase schema (`supabase/schema.sql` + drift)

Tables: `profiles` (username, bio, plus four deprecated premium columns — unread by code), `wishlist`, `owned`,
`quiz_results` — all with RLS: public SELECT, owner-only writes. A `subscribers` table
(email unique, token uuid for unsubscribe links) **exists in production but is missing
from `schema.sql`** — it was created ad-hoc in the dashboard. Treat the live DB as the
truth and `schema.sql` as documentation that lags.

### Auth flow

Email+password only, via server actions in `app/auth/actions.js` (`useActionState` on the
client). Supabase "Confirm email" is intentionally **OFF**. Signup: check username free →
`auth.signUp` → insert `profiles` row → auto-enroll in `subscribers` (admin client) →
welcome email (fire-and-forget) → redirect `/profile`. `middleware.js` refreshes the
session cookie on every matched request and redirects logged-out users off `/profile`.

Client-side auth state comes from `lib/hooks/useUser.js` (hardened with try/catch after a
production incident — errors thrown in effects hit `app/error.js`, the generic "Something
went wrong" screen).

## Key design decisions (inferred and confirmed)

1. **Catalog as static JSON, cached forever** — cheap, fast, versioned in git. The
   trade-off is that fixing catalog data requires a deploy.
2. **One results page, many quizzes** — new quiz types are pure front-ends; `mode` param
   only re-skins copy. Adding a seventh quiz is ~250 lines and zero backend work.
3. **Band-based scoring with forced uniqueness** — product decision that every result
   shows a distinct, plausible-feeling percentage.
4. **Graceful-degradation env handling everywhere** — the app must run with zero env
   config; production Vercel has the real vars (verified present: Supabase ×3, Stripe ×2,
   Resend, Broadcast secret, site URL).
5. **Guest vs. account limits** — guests get 10 results, accounts 20; extra quiz steps are
   account-gated (`AccountGate` blurs + overlays). Premium was removed permanently in June 2026: PickSniff is 100% free and Stripe handles optional donations only.
6. **Push-to-main deploys** — earlier manual `vercel --prod` + alias workflows caused
   domain-pointing bugs; the fix was "always deploy via git push."

## Critical paths (touch with care)

- `lib/fragrances.js` + `/fragrances/*.json` — everything reads from here. Do not modify
  JSON without explicit instruction.
- `lib/matchFragrances.js` — the product. Band boundaries and the accord guarantee encode
  explicit product decisions from April–June 2026.
- `app/quiz/page.js` → `/api/quiz/match` → `/results` — the core funnel.
- `middleware.js` and `lib/supabase/*` — session handling; subtle cookie logic from the
  `@supabase/ssr` docs, easy to break.
- `app/results/page.js` + `ResultsClient.js` — shared endpoint of all six quizzes; a
  regression here breaks everything at once.

Safe to change casually: static content pages (`/about`, `/privacy`, `/terms`,
`/contact`), copy, icons, `Footer`, the hub page, badge definitions.

## Surprises and traps for newcomers

- **CLAUDE.md's data section is aspirational, not actual.** It describes numeric IDs, a
  `notes: {top/middle/base}` pyramid, an `affiliate_type` field, and a `/db` folder. The
  real data has string-slug IDs, a `top_notes` array that just mirrors `accords`, no
  affiliate_type field, and lives in `/fragrances`.
- `public/logo.svg` is an **840 KB SVG wrapping a base64 PNG** — not a real vector. It's
  referenced everywhere via `next/image`. Don't try to Read it (it blows the context
  window); don't "optimize" it without checking rendering everywhere.
- The quiz's POST to `/api/quiz/match` exists for **validation + rate limiting only**; its
  response is discarded and `/results` recomputes matches from URL params.
- `/premium` 301-redirects to `/support` (next.config.mjs). Premium is permanently removed; never resurrect it.
- Windows dev machine: PowerShell 5.1 is the default shell (no `&&`), git warns
  LF→CRLF constantly (harmless), and the Vercel CLI prints a NativeCommandError-looking
  hint line that is not an error.
- Vercel deployment URLs (`picksniff-xxxx.vercel.app`) are SSO-protected — you cannot
  curl them to test; use `picksniff.com` or local `next build && next start`.
- The homepage "Recently Viewed" section reads `localStorage.ps_viewed` via an inline
  script, but **nothing ever writes that key** — the section permanently hides itself.
- `app/error.js` is the route error boundary users see as "Something went wrong." Any
  uncaught client exception (including ones thrown from effects) lands there; when
  production "breaks," check the browser console first.
