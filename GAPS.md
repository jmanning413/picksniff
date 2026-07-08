# GAPS.md — Honest Audit of Known Weaknesses

> Ordered by severity, most important first. Each entry: what, where, why it matters,
> and a fix scoped small enough to execute as a single task.
> Originally audited June 2026 · **Fully re-audited 2026-06-12.** Status labels:
> 🔓 OPEN · 🔶 PARTIAL · ✅ RESOLVED. See PROJECT.md for architecture context.

---

## 0. 🔴 NEW (incident, 2026-06-12) — Production env vars were EMPTY; Supabase project paused

**What happened:** Routine verification found every production env var
(`NEXT_PUBLIC_SUPABASE_URL`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, all 8) returning
empty at runtime — `/api/stripe/checkout` answered "Stripe is not configured",
`/api/subscribe` answered "Service unavailable", and **account creation was silently
broken on the live site**. Separately, the Supabase project host
(`mbryokifzglwyfznncoh.supabase.co`) stopped resolving in DNS — the classic signature of
a **paused free-tier Supabase project** (they pause after ~1 week of inactivity).

**ROOT CAUSE FOUND (2026-06-12):** there are TWO Vercel projects. `project-a022s`
serves www.picksniff.com; `picksniff` (the one this repo was CLI-linked to) only serves
picksniff.vercel.app. All env vars lived in the wrong project, so production never had
them. Fixed: repo relinked to `project-a022s` and all 8 vars set there; Supabase project
restored by owner.
**Remaining follow-ups:**
1. Consolidate to ONE Vercel project (delete/retire the unused `picksniff` project in
   the dashboard) so this split can never recur.
2. Prevent Supabase re-pausing (free tier pauses after ~1 week idle): weekly cron ping
   or Supabase Pro at launch.

**Follow-up fix (single task):** add `/api/health` returning JSON booleans —
`{supabase, stripe, resend}` — each true only when the env var exists AND a trivial call
succeeds. Check it after every deploy (and point a free uptime monitor at it) so silent
env loss can never happen again.

## 1. ✅ RESOLVED (2026-06-12) — Broadcast secret was hardcoded in the client bundle

Fixed (SECURITY.md F-1): the client-side password comparison was removed from
`app/admin/email/page.js` (the server-side `BROADCAST_SECRET` check on `/api/broadcast`
is the only gate), `BROADCAST_SECRET` was rotated to a new 48-char random value in both
Vercel and `.env.local`, `/admin` is disallowed in robots.js, and the admin page is
noindexed via a layout. Follow-up idea (optional hardening): switch admin auth to
logged-in user id allowlist instead of a shared secret.

## 2. ✅ RESOLVED (2026-06-12) — The Compare page always 404'd

Fixed: `.map(Number)` removed in both the page and `generateMetadata`; string-slug ids
compare directly. `/compare/{id}-vs-{id}` URLs resolve now.

## 3. 🔶 PARTIAL — No affiliate tracking (the primary monetization)

**Progress:** all buy links now flow through one component
(`app/_components/BuyButtons.js` — results, fragrance pages, mobile sticky bar), with
action-verb labels and a reassurance note. Adding tracking params is now a one-file
change. **Still open:** no affiliate program memberships (owner task — GAMEPLAN Phase 1),
no tracking params, `sephora_url`/`jomashop_url` still null catalog-wide (Stage B of
docs/CATALOG.md), and `WardrobeButton`/compare/brand pages still build their own links.

## 4. 🔶 PARTIAL — Test coverage

**Progress:** the match engine is pure (`lib/matchEngine.mjs`) with 19 passing
`node --test` tests (`npm test`); bands/guarantee/ordering are locked in.
**Still open:** zero tests for API routes, server actions, or components; no CI runs
anything (AUDIT.md §7 — a 30-line GitHub Action would gate pushes on `npm test` +
`next build`).

## 5. 🔓 OPEN — Quiz rate limit trivially bypassed via /results

Unchanged: `/api/quiz/match` is rate-limited but its response is discarded; `/results`
recomputes from raw searchParams with no limit and runs the matcher twice per view.
Fix options unchanged (validate + limit `/results`, drop the decorative POST).

## 6. 🔓 OPEN — `subscribers` table missing from `supabase/schema.sql`

Unchanged schema drift. Now more urgent: if the paused Supabase project (#0) were ever
lost rather than restored, `schema.sql` could not rebuild the newsletter system. Fix:
append the `subscribers` CREATE TABLE (verify columns against the dashboard) with RLS
enabled and no public policies.

## 7. 🔓 OPEN — No rate limiting on subscribe/auth

Unchanged: `/api/subscribe` is an unauthenticated email-send primitive with no limit;
auth server actions have no throttle. Fix: second Upstash limiter (5/min/IP) in the
subscribe route; same pattern inside `signIn`/`signUp`.

## 8. ✅ RESOLVED (2026-06-12) — Premium removed permanently

Owner decision: PickSniff is 100% free forever; Stripe is donations-only. Removed:
`PremiumGate`, `useIsPremium`, `app/premium/*`, empty `app/api/stripe/portal/`, unused
`getStripeObjectId`. `/premium` now 301s to `/support` via next.config.mjs. Terms
rewritten (Donations section). Remaining follow-up: drop the four deprecated `profiles`
columns (`is_premium`, `premium_expires_at`, `stripe_customer_id`,
`profile_border_color`) during the next deliberate schema migration; they are unread by
code and marked deprecated in `supabase/schema.sql`.

## 9. 🔓 OPEN — Signup can strand accounts without profiles

Unchanged: unchecked `profiles` insert after `auth.signUp` + `!profile → redirect('/auth')`
loop risk on `/profile`. Fix unchanged (check insert error, sign out + return error;
tolerant profile page).

## 10. ✅ RESOLVED (2026-06-12) — Sitemap missing quiz routes

Fixed: `/quizzes`, `/quiz/mood`, `/quiz/seasonal`, `/quiz/astrology`, `/quiz/gift` added
to `app/sitemap.js`; `/admin` disallowed in robots.js.

## 11. 🔶 PARTIAL — `top_notes` mirrors `accords` (fake notes)

**Progress:** full remediation pipeline written — **docs/CATALOG.md** (enrichment
batches, verification rules, feed imports, image licensing). Quiz accord hints no longer
imply ingredients (Design.md drift rule).
**Still open:** the data itself — no enrichment batch has run yet; quiz Step 6 notes
filter is still a placebo; fragrance pages still render the mirrored `top_notes`.

## 12. 🔶 PARTIAL — Copy-paste duplication

**Progress:** buy-link construction + LV override centralized in `BuyButtons.js` for the
two money surfaces; quiz option icons centralized in `QuizIcons.js`.
**Still open:** `BRAND_OVERRIDES` copies remain in `compare/[slug]` and `brand/[name]`;
`ACCORD_DESCRIPTIONS`+`buildDescription` duplicated (ResultsClient, fragrance page);
`VIBE_LABELS` in ~6 files; `GENDERS` arrays in 5 quiz pages. Fix: `lib/constants.js`.

## 13. 🔓 OPEN — Fake "Trending" labels & unearnable badges

Unchanged: `/trending` still labels pseudo-random picks "Most Viewed/Saved/Reviewed";
5 of 7 badges unearnable (`computeBadges` ignores most conditions). Relabel + trim
remains the honest quick fix (badge icons are now SVGs, but the earnability problem is
untouched).

## 14. 🔶 PARTIAL — Dead code and stale scaffolding

**Resolved:** homepage "Recently Viewed" dead section removed (with its innerHTML
self-XSS surface — SECURITY.md F-8).
**Still open:** `LoadingSniff.js` never imported; empty `app/api/stripe/portal/` dir;
`build_json.js`/`extract_pdf.js` in root (move to `scripts/`); boilerplate `README.md`;
template SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`,
`window.svg`).

## 15. ✅ RESOLVED (2026-06-12) — 840 KB fake-SVG logo replaced

Generated `public/logo-mark.png` (transparent background, trimmed, 384px, ~49 KB) from
the owner's PNG and swapped every logo reference to it; all `mix-blend-multiply`
workarounds removed; `next/image` can now optimize it. Real favicon set added
(`app/icon.png` + `app/apple-icon.png`), template `favicon.ico` deleted. The old
`public/logo.svg` / `logo-icon.svg` (840 KB each) are now unreferenced — safe to delete
whenever the owner confirms.

## 16. 🔶 PARTIAL — Consistency and robustness nits

- ✅ `useUser.js` hardened (try/catch on client creation + getUser).
- ✅ `genders.sort()` state mutation fixed (`[...genders].sort()`).
- 🔓 `useIsPremium.js` still lacks the same hardening.
- 🔓 `app/quiz/page.js`: `step` can exceed `STEPS.length-1` if auth state flips
  mid-quiz (clamp with `Math.min`).
- 🔓 Accord-fetch effect has no AbortController (stale-resolution edge).
- 🔓 CSP still allows `unsafe-inline`/`unsafe-eval` (SECURITY.md F-7; the dead inline
  homepage script blocking cleanup was removed, so the GA-nonce pass is now unblocked).
- 🔓 No `.gitattributes` (LF/CRLF warnings on every commit).

## 17. 🔓 NEW — No post-deploy verification

Every push auto-deploys, but nothing confirms the deployment actually works (the #0
incident ran silently for an unknown period). Fix (single task): `/api/health` route +
free UptimeRobot monitor on it and `/`; optionally a `scripts/smoke.mjs` that curls the
critical endpoints, run manually after risky deploys.

## 18. 🔓 NEW — Local `.env.local` may drift from production reality

The 2026-06-12 repair copied local values → production. That direction was correct this
time, but nothing keeps the two in sync, and Vercel's sensitive-var pull returns empty
strings (so `vercel env pull` can't be used to sync down). Convention going forward:
any env change happens in BOTH places in the same sitting, and `.env.example` lists
every name. (Also: once the Supabase project is restored, confirm the project ref in
`.env.local` still matches the dashboard.)
