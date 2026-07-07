# GAPS.md — Honest Audit of Known Weaknesses

> Ordered by severity, most important first. Each entry: what, where, why it matters,
> and a fix scoped small enough to execute as a single task.
> Audited June 2026 against the live codebase. See PROJECT.md for architecture context.

---

## 1. 🔴 CRITICAL — Broadcast secret is hardcoded in the client bundle

**What:** `app/admin/email/page.js` (~line 16) compares the typed password against the
literal string `'picksniff-broadcast-2026'` in a `'use client'` component, then sends that
same value as `secret` to `/api/broadcast`. For sending to work, `BROADCAST_SECRET` in
Vercel must equal this string — meaning the secret that authorizes mass-emailing the
entire subscriber list ships in public JavaScript to every visitor of `/admin/email`.

**Why it matters:** Anyone who views source can email every subscriber arbitrary HTML from
`hello@picksniff.com`. That's a spam/phishing vector and a Resend-account/domain-reputation
killer.

**Fix (single task):** Remove the hardcoded comparison; make `handleAuth` accept whatever
is typed (it's just UI gating) and let the server-side `BROADCAST_SECRET` check be the only
authority. Then rotate `BROADCAST_SECRET` in Vercel to a new random value. Optionally add
Upstash rate limiting to `/api/broadcast`.

---

## 2. 🔴 The Compare page always 404s (dead feature)

**What:** `app/compare/[slug]/page.js` parses slugs with
`slug.split('-vs-').map(Number)`, but fragrance IDs are string slugs
(`"male-daily-budget-…"`), so `Number(id)` is always `NaN` → `notFound()`. Both the page
and its `generateMetadata` are affected. Additionally, string IDs containing `-vs-` is not
possible today, but IDs contain many hyphens, so the URL format itself is ambiguous only
for the separator — `-vs-` never appears inside real IDs, so string comparison works.

**Why it matters:** The results-page "Compare" feature builds its own in-page modal (that
works), but any shared/linked `/compare/a-vs-b` URL — including ones search engines might
index — is a guaranteed 404. It's shipped dead code.

**Fix (single task):** In `app/compare/[slug]/page.js`, replace `.map(Number)` with the
raw string parts and `all.find((f) => f.id === id1)`. Same in `generateMetadata`. Verify
with a real slug pair. (Or delete the route if it's unwanted.)

---

## 3. 🔴 No affiliate tracking — the primary monetization is not implemented

**What:** Buy buttons everywhere (`ResultsClient.js`, `app/fragrance/[id]/page.js`,
`compare`, `brand`, `WardrobeButton.js`) link to plain Sephora/Jomashop **search URLs**.
`sephora_url`/`jomashop_url` are `null` for all 750 fragrances. The env vars
`NEXT_PUBLIC_SEPHORA_AFFILIATE_ID` / `NEXT_PUBLIC_JOMASHOP_AFFILIATE_ID` exist in
`.env.example` and CLAUDE.md but are referenced by **zero** lines of code.

**Why it matters:** The business plan is affiliate revenue. Right now every click earns $0.

**Fix (single task):** Create `lib/affiliate.js` with `buildSephoraUrl(fragrance)` /
`buildJomashopUrl(fragrance)` that append the affiliate params when the env vars are set,
and replace the five copy-pasted inline URL constructions with it. (Also fixes gap #12.)

---

## 4. 🟠 Zero automated tests — **PARTIALLY RESOLVED (June 2026)**

**Update:** The matching engine was extracted to pure `lib/matchEngine.mjs` and now has
19 `node --test` tests (`tests/matchEngine.test.mjs`, run via `npm test`) covering bands,
uniqueness/ordering, the accord guarantee, tier loosening, and determinism. The engine
rework also fixed: out-of-order percentages after guarantee swaps, band-floor claims in
`uniquePercentages`, absolute-vs-fractional band counting, and dead-weight secondary
signals. Remaining gap: no tests for API routes, server actions, or components, and no CI
running `npm test` (see AUDIT.md §7).

**Original finding (for context):** No test files, no test runner, no `test` script in
`package.json`. The matching engine had been verified only by ad-hoc manual runs.

**Why it matters:** The scoring bands, accord guarantee, and tier-loosening encode product
promises ("3 accord matches always scores 95–99", "every selected accord appears in top
5", "no ties"). Any refactor can silently break them; nothing would catch it before prod
(and push = deploy).

**Fix (single task):** Add `node --test` tests (zero new deps) in `tests/matchFragrances.test.mjs`
covering: band ranges for 0/1/2/3 accord matches, uniqueness of scores, accord guarantee
in top 5, tier loosening under 5 items, and `getAvailableAccords` never returning an
accord absent from the pool. Note: `lib/fragrances.js` imports `next/cache`, so either
test through fixture pools by extracting pure functions, or export the internal
`_loadAllFragrances`. Add `"test": "node --test tests/"` to package.json.

---

## 5. 🟠 Quiz rate limit is trivially bypassed via /results

**What:** `/api/quiz/match` is zod-validated and Upstash-rate-limited, but the quiz throws
away its response and navigates to `/results`, which recomputes matches from raw
`searchParams` with no rate limit and no schema validation (only `parseList` +
defaulting). `/results` also runs `matchFragrances` **twice** per view (main + limit-50
"People Also Liked" pool).

**Why it matters:** The rate limit protects nothing (hit `/results?genders=…` directly),
the API round-trip adds latency for zero benefit, and each results view does double work.

**Fix (single task):** Either (a) drop the POST from `app/quiz/page.js` `submitQuiz` and
add lightweight validation of searchParams in `app/results/page.js`, or (b) keep the POST
but also rate-limit `/results` in `middleware.js`. Option (a) is simpler and removes dead
work; the zod schema from the API route can move to a shared module and be reused for
searchParams parsing.

---

## 6. 🟠 `subscribers` table missing from `supabase/schema.sql` (schema drift)

**What:** `app/api/subscribe`, `app/api/broadcast`, `app/unsubscribe`, and signup
auto-enroll all use a `subscribers` table (columns: at least `email` unique, `token`)
that was created ad-hoc in the Supabase dashboard and never added to `supabase/schema.sql`.

**Why it matters:** `schema.sql` claims to be the setup script ("run this in your Supabase
project") but produces a broken install. Any DB rebuild or second environment silently
loses the newsletter system.

**Fix (single task):** Append to `supabase/schema.sql`:
`create table public.subscribers (id uuid default gen_random_uuid() primary key, email text unique not null, token uuid default gen_random_uuid() not null, created_at timestamptz default now());`
plus `enable row level security` with **no** public policies (service-role access only).
Verify column names against the live table in the dashboard first.

---

## 7. 🟠 No rate limiting on subscribe/auth (CLAUDE.md security reqs unmet)

**What:** CLAUDE.md mandates rate limits: quiz 10/min (✅ done), search 30/min (n/a —
search is client-side), auth 5/min (❌), and 5-second quiz dedup (❌). `/api/subscribe`
has no limit at all; each new email triggers a Resend send, so an attacker can subscribe
strangers' addresses in bulk (spam vector + Resend quota burn). Auth server actions have
no throttle (credential-stuffing surface).

**Fix (single task):** Extend `lib/ratelimit.js` to export a second limiter
(`slidingWindow(5, '1 m')`, prefix `picksniff:subscribe`) and call it in
`app/api/subscribe/route.js` using the same IP-extraction pattern as the match route.
Auth throttling can be a follow-up (server actions can read `headers()` the same way).

---

## 8. 🟡 Premium is half-abandoned: dead columns, dead gate, webhook that does nothing

**What:** `profiles.is_premium` / `premium_expires_at` / `stripe_customer_id` /
`profile_border_color` exist in the schema; `useIsPremium` and `PremiumGate` exist and
`PremiumGate` advertises "$4.99/month"; but nothing ever sets `is_premium`,
`/premium` client-redirects to `/support` (tip jar), `CheckoutButton` re-exports
`TipButton`, and the Stripe webhook (`app/api/stripe/webhook/route.js`) only `console.log`s.
`app/api/stripe/portal/` is an **empty directory**.

**Why it matters:** Confusing dead surface area; a future agent could wire UI to
`PremiumGate` believing premium works. The webhook endpoint receives real Stripe events
and discards them.

**Fix (single task):** Decide direction with the owner. Cheapest cleanup: delete
`app/api/stripe/portal/` (empty), add a comment atop `PremiumGate.js` and
`useIsPremium.js` stating premium is shelved and nothing sets `is_premium`, and make
`/premium` a server-side `redirect('/support')` instead of a client `useEffect` redirect.

---

## 9. 🟡 Signup can strand accounts without profiles (redirect loop risk)

**What:** In `app/auth/actions.js` `signUp`, the `profiles` insert after `auth.signUp` is
not checked for errors, and RLS requires `auth.uid() = id` — if the session isn't
established yet (or the insert races/fails), the user exists with no profile row. Then
`/profile` does `if (!profile) redirect('/auth')` while middleware sends logged-in users
back — a logged-in, profile-less user bounces or dead-ends. Username uniqueness is also
TOCTOU: checked before signup, not enforced at insert time... actually `username` is
`unique` in the schema, so the insert would fail — which is exactly the unchecked error.

**Fix (single task):** In `signUp`, capture the insert error; on failure, call
`supabase.auth.signOut()` and return
`{ error: 'Could not create profile. That username may have just been taken.' }`.
In `app/profile/page.js`, replace the `!profile` redirect with a small "finish setting up
your profile" inline form (or at minimum sign the user out before redirecting to /auth).

---

## 10. 🟡 Sitemap and metadata lag the quiz expansion

**What:** `app/sitemap.js` lists `/quiz` and `/quiz/personality` but not `/quizzes`,
`/quiz/mood`, `/quiz/seasonal`, `/quiz/astrology`, `/quiz/gift`. The homepage
"Personality quiz teaser" section (`app/page.js`) still says "3 fun questions" (it's now
4 steps) and links only to the personality quiz rather than the hub.

**Fix (single task):** Add the five missing routes to the `staticRoutes` array in
`app/sitemap.js`. Optionally update the homepage teaser copy/link to `/quizzes`.

---

## 11. 🟡 `top_notes` mirrors `accords` — the notes UI is fake

**What:** In all 15 JSON files, `top_notes` is byte-for-byte the same array as `accords`
(confirmed by sampling; also noted in `lib/matchFragrances.js` FIX 4 comment). The
fragrance detail page renders a "Top Notes" section that just repeats the accord pills;
the premium "notes filter" (`COMMON_NOTES` in `app/quiz/page.js` — Bergamot, Cedar, …)
matches against accords as a proxy, so picking "Bergamot" can never match anything
(accords are Citrus/Floral/… — none of the 20 COMMON_NOTES equals an accord name except
Vanilla and Amber).

**Why it matters:** The logged-in Step 6 notes filter is effectively a placebo for 18 of
20 options, and the "Top Notes" section on `/fragrance/[id]` is duplicated noise.

**Fix (single task, code-only):** Hide the `top_notes` block on `/fragrance/[id]` when
`JSON.stringify(f.top_notes) === JSON.stringify(f.accords)`, and remove/disable Step 6 in
`app/quiz/page.js` until real notes data exists. The real fix is a data project: populate
genuine top/middle/base notes per fragrance (owner decision — do not fabricate data).

---

## 12. 🟡 Massive copy-paste duplication of constants and buy-button logic

**What:** `BRAND_OVERRIDES` (the Louis Vuitton special case) is defined in 4 files
(`ResultsClient.js`, `fragrance/[id]/page.js`, `compare/[slug]/page.js`,
`brand/[name]/page.js`). `ACCORD_DESCRIPTIONS` + `buildDescription()` in 2.
`VIBE_LABELS` in 6. `GENDERS` arrays in 5 quiz pages. Sephora/Jomashop URL construction
in 5 places. The "similar fragrances by shared accords" algorithm exists twice
(`findPeopleAlsoLiked` in `results/page.js`, `FragranceAlsoLiked` in `fragrance/[id]`).

**Why it matters:** The LV link (currently pointing at the women's fragrance listing) or
an affiliate change must be edited in 4–5 places; they will drift.

**Fix (single task):** Create `lib/constants.js` exporting `BRAND_OVERRIDES`,
`VIBE_LABELS`, `ACCORD_DESCRIPTIONS`, `buildDescription`, and (per gap #3)
`lib/affiliate.js` for URL building. Mechanically replace the local copies. No behavior
change — verify with `npx next build`.

---

## 13. 🟡 Fake "Trending" and quiz-count copy drift

**What:** `/trending` generates deterministic pseudo-random weekly picks and labels them
"Most Viewed / Most Saved / Most Reviewed" — none of which are measured. The homepage
"How it works" says "Answer 4 questions"; logged-in users get 6 steps. Reviews are
referenced by badges ("Reviewer — left their first review") but no review feature exists.

**Why it matters:** Honest-marketing risk and user confusion; also badge `reviewer` is
unearnable (`reviewCount: 0` hardcoded in `profile/page.js`), as are `advanced_sniffer`,
`wardrobe`, `encyclopedia_worm`, `social_sniffer` (`computeBadges` never awards them and
ignores its `ownedCount` argument).

**Fix (single task):** Soften `/trending` section headings to "Editor rotation" style
copy or a single "This week's picks" list; remove unearnable badges from `BADGE_DEFS`
(keep `first_sniff`, `collector`) or implement their conditions in `computeBadges`.

---

## 14. 🟢 Dead code and stale scaffolding

**What, where:**
- `app/_components/LoadingSniff.js` — never imported anywhere.
- Homepage "Recently Viewed" (`HomepageRecentlyViewed` in `app/page.js`) — reads
  `localStorage.ps_viewed`, which nothing writes; section always hides itself. Also uses
  `innerHTML` with unsanitized localStorage data (self-XSS only, but ugly).
- `app/api/stripe/portal/` — empty directory.
- `build_json.js`, `extract_pdf.js` — root-level one-shot scripts that built the catalog
  from the PDFs; keep, but they don't belong in the deploy tree.
- `README.md` — untouched create-next-app boilerplate.
- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — template
  leftovers.
- `.claude/settings.local.json` committed intent unclear; `fragrances/*.pdf` (3 PDFs,
  source material) ship in the repo.

**Fix (single task):** Delete `LoadingSniff.js`, the `HomepageRecentlyViewed` section,
the empty portal dir, and the four template SVGs; move the two scripts into `scripts/`;
replace README with three lines pointing at PROJECT.md/CLAUDE.md. Each deletion is
grep-verified safe (done during this audit for LoadingSniff and ps_viewed).

---

## 15. 🟢 `public/logo.svg` is an 840 KB fake SVG

**What:** `logo.svg` (and `logo-icon.svg`, 858 KB) are `<svg><image href="data:image/png;base64,…">`
wrappers around large PNGs, with embedded C2PA/AI-generation metadata. Served on every
page via `next/image` (which cannot optimize SVGs — it serves them verbatim).

**Why it matters:** ~840 KB render-blocking-ish logo on every first visit; terrible LCP
on mobile. Also the header logo was reported to intermittently render broken.

**Fix (single task):** Since real PNGs exist (`logo.png`, `logo-icon.png`), check their
sizes; if reasonable, switch all `Image src="/logo.svg"` references (Header, auth,
quizzes, error page, LoadingSniff) to the PNG so `next/image` can optimize, or export a
properly vectorized SVG. Verify visually at 28–100 px sizes.

---

## 16. 🟢 Minor consistency and robustness nits

- `useIsPremium.js` lacks the try/catch hardening `useUser.js` received after a prod
  incident — same crash class remains. *(Fix: copy the same pattern.)*
- `app/quiz/page.js`: `STEPS` length depends on `isLoggedIn`, which can flip after mount
  (auth state change) while `step` is 4–5 → `currentStep` undefined → crash. Rare.
  *(Fix: clamp `step` with `Math.min(step, STEPS.length - 1)`.)*
- Duplicate-signup path: if `auth.signUp` returns an existing user (Supabase does this
  when confirm-email is off), a second `profiles` insert error is swallowed. Related to #9.
- `app/quiz/page.js` fetch effect has no `AbortController`; rapid gender toggling can
  resolve out of order (the `fetchKeyRef` guard prevents refetch but not stale
  resolution ordering). Low impact.
- CSP in `next.config.mjs` allows `'unsafe-eval'`/`'unsafe-inline'` scripts (needed for
  Next/GA as configured, but worth revisiting) and doesn't include Upstash (server-side
  only, fine) — document why before "fixing."
- Mixed root configs: `next.config.mjs` uses Turbopack key; ESLint flat config present
  but `npm run lint` never run in CI (there is no CI).
- Git hygiene: line-ending warnings on every commit (add `.gitattributes` with
  `* text=auto eol=lf`).
