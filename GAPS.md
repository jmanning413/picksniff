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

**Follow-up DONE (2026-06-12):** `/api/health` exists (JSON booleans for
supabase/stripe/resend; 503 when any fail) and a daily Vercel cron (`vercel.json`) hits
it — which also keeps the free-tier Supabase project active so it can't pause again.
Remaining owner items: point a free uptime monitor (e.g. UptimeRobot) at `/api/health`,
and delete the retired `picksniff` Vercel project after a stability window.

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

## 4. 🔶 PARTIAL — Test coverage (CI now gates every push)

**Progress:** engine has 19 passing tests; **CI added 2026-06-12**
(`.github/workflows/ci.yml`: lint + `npm test` + `next build` on every push/PR — all
lint errors were fixed to make lint a blocking gate).
**Still open:** no tests for API routes, server actions, or components.

## 5. ✅ RESOLVED (2026-06-12) — /results now validated and rate-limited

`/results` strictly validates every search param against allowlists (genders, tier,
vibe, the 11 accords max 3, concentrations) and is rate-limited (30/min/IP via the
shared Upstash limiters; friendly page when exceeded). Remaining nice-to-have: the
quiz's decorative POST to `/api/quiz/match` could now be dropped (response discarded).

## 6. ✅ RESOLVED (2026-06-12) — `subscribers` added to `supabase/schema.sql`

Columns verified against the live DB by probe (id, email unique, token, created_at);
RLS enabled with no public policies (service-role only).

## 7. ✅ RESOLVED (2026-06-12) — Subscribe + auth rate limits

`lib/ratelimit.js` generalized (`makeLimiter`); `/api/subscribe` limited 5/min/IP,
`signIn`/`signUp` server actions limited 5/min/IP, `/results` 30/min/IP. All no-op
without Upstash env vars (local dev).

## 8. ✅ RESOLVED (2026-06-12) — Premium removed permanently

Owner decision: PickSniff is 100% free forever; Stripe is donations-only. Removed:
`PremiumGate`, `useIsPremium`, `app/premium/*`, empty `app/api/stripe/portal/`, unused
`getStripeObjectId`. `/premium` now 301s to `/support` via next.config.mjs. Terms
rewritten (Donations section). Remaining follow-up: drop the four deprecated `profiles`
columns (`is_premium`, `premium_expires_at`, `stripe_customer_id`,
`profile_border_color`) during the next deliberate schema migration; they are unread by
code and marked deprecated in `supabase/schema.sql`.

## 9. ✅ RESOLVED (2026-06-12) — Signup orphan-profile risk closed

`signUp` now checks the profiles insert; on failure it signs the user out and returns a
clear error. `/profile` self-heals any legacy orphan by creating a fallback profile
(`sniffer_<id>`), so no redirect dead-ends remain.

## 10. ✅ RESOLVED (2026-06-12) — Sitemap missing quiz routes

Fixed: `/quizzes`, `/quiz/mood`, `/quiz/seasonal`, `/quiz/astrology`, `/quiz/gift` added
to `app/sitemap.js`; `/admin` disallowed in robots.js.

## 11. 🔶 PARTIAL — `top_notes` mirrors `accords` (fake notes)

**Progress:** full remediation pipeline written — **docs/CATALOG.md** (enrichment
batches, verification rules, feed imports, image licensing). Quiz accord hints no longer
imply ingredients (Design.md drift rule).
**Still open:** the data itself — no enrichment batch has run yet; fragrance pages
hide notes while `top_notes` mirrors accords (real notes/pyramid land with batch 1).
NOTE: the placebo quiz notes step (old Step 6) was removed 2026-06-13 when the quiz
went to a flat 4 steps; concentration filtering (old Step 5) also removed from the quiz.

## 12. ✅ RESOLVED (2026-06-12) — Duplication centralized

`lib/constants.js` now owns VIBE_LABELS, accord descriptions/buildDescription, and the
valid-value allowlists; EVERY buy link on the site (results, fragrance, compare, brand,
wardrobe modal) flows through `buildRetailerLinks` in `BuyButtons.js` — affiliate
tracking is now genuinely a one-file change. Minor leftover: small `GENDERS` arrays in
quiz pages (harmless, identical literals).

## 13. ✅ RESOLVED (2026-06-12) — Honest trending labels; only earnable badges

`/trending` sections renamed to editorial framing ("Weekly Spotlight", "Fresh Finds",
"Worth a Sniff") with honest subhead ("rotating selection, refreshed weekly"). Badges
trimmed to the two earnable ones (First Sniff, Collector); new badges may only ship
together with awarding logic in `computeBadges`.

## 14. ✅ RESOLVED (2026-06-12) — Dead code and scaffolding cleaned

Deleted: `LoadingSniff.js`, the five create-next-app template SVGs, the empty stripe
portal dir (earlier). Moved `build_json.js`/`extract_pdf.js` to `scripts/`. README
replaced with a real project pointer. Remaining (owner call): delete the unreferenced
840 KB `public/logo.svg` + `logo-icon.svg`.

## 15. ✅ RESOLVED (2026-06-12) — 840 KB fake-SVG logo replaced

Generated `public/logo-mark.png` (transparent background, trimmed, 384px, ~49 KB) from
the owner's PNG and swapped every logo reference to it; all `mix-blend-multiply`
workarounds removed; `next/image` can now optimize it. Real favicon set added
(`app/icon.png` + `app/apple-icon.png`), template `favicon.ico` deleted. The old
`public/logo.svg` / `logo-icon.svg` (840 KB each) are now unreferenced — safe to delete
whenever the owner confirms.

## 16. 🔶 PARTIAL — Consistency and robustness nits

- ✅ `useUser.js` hardened; `genders.sort()` mutation fixed; `useIsPremium` deleted with
  premium; quiz `step` clamped against STEPS shrinking (2026-06-12); accord-fetch effect
  has a stale-result guard (2026-06-12); `.gitattributes` added (2026-06-12).
- 🔓 CSP still allows `unsafe-inline`/`unsafe-eval` (SECURITY.md F-7) — needs its own
  deliberate pass with testing.

## 17. ✅ RESOLVED (2026-06-12) — /api/health + daily cron

`/api/health` verifies Supabase (live query), Stripe and Resend env presence; returns
503 if anything is down. `vercel.json` cron hits it daily (doubles as the Supabase
keep-alive). Owner nice-to-have: point a free uptime monitor at it.

## 18. 🔓 NEW — Local `.env.local` may drift from production reality

The 2026-06-12 repair copied local values → production. That direction was correct this
time, but nothing keeps the two in sync, and Vercel's sensitive-var pull returns empty
strings (so `vercel env pull` can't be used to sync down). Convention going forward:
any env change happens in BOTH places in the same sitting, and `.env.example` lists
every name. (Also: once the Supabase project is restored, confirm the project ref in
`.env.local` still matches the dashboard.)

## 19. ✅ RESOLVED (2026-07-21) — Duplicate catalog IDs: was 748 rows, 746 unique

**Resolution:** 19a fixed by renaming the unreachable EDT row; 19b fixed by deleting the
duplicate row that carried a wrong accord (see below). Catalog is now **747 rows, 747
unique ids**, and `tests/catalog.test.mjs` guards it permanently.

Found during post-deploy verification of the Nose Test. **Pre-existing**, and unrelated
to it: the duplicates are present at `14e859a`, which touched only `docs/`. They also
predate the cut-audit and enrichment batches.

IDs are built as `{gender}-{vibe}-{tier}-{brand}-{name}` and **omit `concentration`**,
so two concentrations of the same product in the same gender/vibe/tier collide.

**Two distinct cases, with different severities and different fixes.**

**19a. 🔶 Chanel — a real rendering bug.**
`male-daily-quality-chanel-bleu-de-chanel` appears twice in `male_daily_final.json`
(lines ~566 and ~666), once as **EDP** and once as **EDT**. The engine's dedup key is
`brand|name|concentration`, so these are correctly treated as different products and
**both survive into the same result set sharing one `id`**. Reproduced with the real
pipeline (male/daily/quality, Woody+Aromatic+Citrus): both rows returned. Consequences:
- Duplicate React keys at `ResultsClient.js` (`key={f.id}`), so card state (wishlist
  heart, compare checkbox) can act on the wrong one.
- Duplicate DOM ids (`fcard-${f.id}`), so "Surprise Me" always scrolls to the first.
- `getFragranceById` returns the first match, so `/fragrance/<id>` always shows the EDP
  and **the EDT is permanently unreachable**.
- `wishlist`/`owned` store `fragrance_id`, so saving the EDT saves an id resolving to
  the EDP.

**Fix (safe, no migration):** rename only the **second, currently unreachable** row to
`...-bleu-de-chanel-edt`. The first row keeps its id, so any existing wishlist/owned
rows stay valid. Nobody can have saved the EDT because it was never reachable.

**19b. 🔓 Guerlain — wasted slot, needs a human decision.**
`unisex-sport-quality-guerlain-guerlain-aqua-allegoria-bergamote-calabria` appears twice
in `unisex_sport_final.json` (lines ~997 and ~1083) with **identical brand, name and
concentration (EDT)**. The engine therefore *does* dedupe it and it never surfaces
twice, so there is no rendering bug. But it is a genuine duplicate row consuming a
catalog slot, and **the two copies disagree on their third accord**: one says `Aquatic`,
the other `Aromatic`.

**Resolved by deleting the `Aquatic` row and keeping `Aromatic`.** The two rows were
byte-identical apart from that one accord, so this removed no unique information. The
`id` is unchanged (both rows shared it), so no wishlist or owned row was affected.

`Aromatic` is the correct value and `Aquatic` was wrong. The row's own note data is
`Bergamot, Lemon, Mint / Neroli, Petitgrain / White Musk, Cedar` — petitgrain, neroli
and mint are aromatic materials and there is no marine note anywhere in it. Confirmed
against the product itself: Calabrian bergamot and petitgrain over ginger and cardamom,
with white musk and woods. The `Aquatic` tag was almost certainly an artifact of the
*Aqua Allegoria* line name, which is marketing rather than an accord.

Note this was the row the site actually served: the engine keeps the first occurrence,
so **the wrong accord was the live one** and the correct row was unreachable.

**Prevention:** add a duplicate-id assertion to the test suite so this cannot regress.
The catalog is loaded through `loadAllFragrances()`, so a single test asserting
`ids.length === new Set(ids).size` would have caught both.
