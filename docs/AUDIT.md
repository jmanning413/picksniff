# PickSniff Comprehensive Audit — June 2026

> Scope: everything except code-level bugs (those live in root `GAPS.md`, severity-ordered,
> 16 findings) and security (dedicated `SECURITY.md`). This document covers: product,
> data quality, SEO, performance, accessibility, email/deliverability, analytics,
> operations, and documentation. Each finding has a severity and a concrete action.
>
> Severity: 🔴 blocks the business · 🟠 costs money/users now · 🟡 fix this quarter · 🟢 hygiene

---

## 1. Product audit

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| P1 | **Monetization not wired**: no affiliate memberships, no tracked links, `sephora_url`/`jomashop_url` null across all 750 items — every buy click is a search-results page with zero attribution | 🔴 | GAMEPLAN Phase 1; GAPS #3 |
| P2 | **No measurement**: GA supported by layout but `NEXT_PUBLIC_GA_ID` unset; zero events for quiz steps, completions, buy clicks | 🔴 | Set env var; add events for step transitions + outbound clicks |
| P3 | Quiz Step 6 "favourite notes" filter is a placebo — 18 of 20 note options can never match because matching compares notes against accords (GAPS #11) | 🟠 | Disable Step 6 until real notes data exists |
| P4 | "Trending — Most Viewed / Most Saved / Most Reviewed" is pseudo-random, not measured; reviews don't exist as a feature at all | 🟠 | Relabel honestly now; build reviews in Phase 3 |
| P5 | 5 of 7 badges are unearnable (`computeBadges` never awards them) | 🟡 | Trim `BADGE_DEFS` to the two real ones |
| P6 | Welcome email promises "weekly picks" — no weekly email has ever been sent; list churn risk | 🟠 | Automate weekly broadcast or soften the promise |
| P7 | Homepage "Personality quiz teaser" says "3 fun questions" (now 4 steps) and bypasses the `/quizzes` hub | 🟢 | Copy fix |
| P8 | No account deletion despite privacy policy claiming it exists | 🟠 | Legal issue too — LEGAL.md §2; build self-serve delete |
| P9 | Compare feature: in-page modal works, but shareable `/compare` URLs 404 (GAPS #2) | 🟠 | One-line fix; unlocks comparison SEO |
| P10 | The `mode` param quizzes (mood/seasonal/astrology/gift) discard their persona output — e.g. the personality quiz computes an archetype but `/results` shows generic cards with no archetype callback | 🟡 | Pass archetype/sign name via param and render in results header; increases share-ability |

## 2. Data quality audit (the `/fragrances` catalog)

- 🟠 **`top_notes` = `accords` in 100% of sampled entries.** No real notes pyramid exists.
  Everything downstream that says "notes" is cosmetic. (GAPS #11.)
- 🟠 **`description` empty for the significant majority of entries** — pages fall back to a
  synthesized sentence built from 3 accord names, producing near-duplicate content on 750
  indexable pages (SEO risk: thin/doorway-page classification).
- 🟡 **No data validation script.** Nothing asserts: unique IDs across all 15 files, accords
  drawn only from the 11 canonical values, exactly 50 per file, tier ∈ {budget, quality,
  niche}. One malformed entry deploys silently. → Add `scripts/validate-catalog.mjs` +
  run it in the build (`prebuild` npm hook). Cheap, high value.
- 🟡 **Curation rules unenforced**: max-3-per-brand-per-vibe, max-1-LV-per-vibe,
  Byredo/Diptyque unisex-only. These were manual rules during curation; the validation
  script above should encode them so future edits can't violate them.
- 🟢 IDs embed tier (`male-daily-budget-...`) but tier is also a field — if a fragrance's
  tier is ever corrected the ID lies. Accept as known wart (IDs are referenced in user
  wishlists — never rewrite them).

## 3. SEO audit

- 🔴 **Sitemap missing `/quizzes` and 4 of 6 quiz routes** (GAPS #10). One-array fix.
- 🟠 **Thin content on money pages** (see Data audit). Prioritize top-100 real descriptions.
- 🟠 **No OG images**: `@vercel/og` is installed and never used; `twitter: summary_large_image`
  is declared with no image. Every share of a result/fragrance renders as a bare link.
  → One `/api/og` route (brand initial, name, match bar) transforms social CTR.
- 🟡 No canonical URLs declared; `www.picksniff.com` and apex both live — confirm a single
  canonical host redirect in Vercel domain settings and add `metadataBase`/`alternates.canonical`.
- 🟡 JSON-LD Product schema exists on fragrance pages (good) but has an empty
  `AggregateOffer` with no price — Google may flag invalid offer markup. Either drop
  `offers` or mark availability only.
- 🟡 Brand pages are SSG'd (good); fragrance pages are dynamic — 750 pages hit the
  server per crawl. `generateStaticParams` on `/fragrance/[id]` would make the whole
  catalog static and fast. Low effort, do it with the perf pass.
- 🟢 robots.js exists and is permissive; `/admin/email` should be disallowed there and
  `noindex`ed (it's a public route today — see SECURITY.md).

## 4. Performance audit

- 🔴 **`public/logo.svg` is 840 KB (base64 PNG in an SVG shell)** and loads on every page
  including the auth and error screens; `next/image` cannot optimize SVGs. This alone
  wrecks mobile LCP. `logo-icon.svg` is 858 KB. Real PNGs exist alongside. (GAPS #15.)
  → Swap references to the PNGs (optimizable) or export a true vector at <10 KB.
- 🟠 `/encyclopedia` ships **all 750 fragrances as serialized props to a client component**
  (~several hundred KB of JSON in the HTML). Fine at current scale, but paginate or
  virtualize before the catalog grows; at minimum strip unused fields (`description`,
  `top_notes`) from the payload.
- 🟡 `/results` runs the matcher twice per view (main + also-liked pool) — merge into one
  pass (GAPS #5 fix covers this).
- 🟡 Middleware runs a Supabase `getUser()` network call on nearly every route including
  fully-static marketing pages — consider narrowing the matcher to routes that need
  sessions (`/profile`, `/results`, `/quiz`, fragrance pages with save buttons).
- 🟢 Fonts via `next/font` (good). Tailwind v4, no runtime CSS-in-JS (good). Catalog reads
  cached via `unstable_cache` (good).

## 5. Accessibility audit

- 🟠 **Color contrast**: brand green `#7fe040` used as text on white (`text-green-accent`
  eyebrows, headings, links) is ~1.9:1 contrast — far below WCAG AA 4.5:1. Fine as a
  *background* with black text (buttons pass), fails as *text color*. → Introduce a
  darker text-green token (e.g. `#3f8f10`-range) for text usage only; keep the bright
  green for fills.
- 🟡 Quiz option buttons rely on color alone (green tint) for selected state; add a
  check glyph (some have `aria-pressed` — good — but visual redundancy is needed).
- 🟡 Modals (`WardrobeButton`, `CompareModal`) have no focus trap, no `Esc` handling, no
  `role="dialog"`/`aria-modal` — keyboard users can tab behind them.
- 🟡 The match-percent bar is a styled div with no `role="progressbar"`/label; decorative
  emoji (🎲, 💎, ♥) unlabeled in buttons.
- 🟢 Semantic headings are generally sound; nav landmarks exist; `alt` texts present on
  logo images.

## 6. Email & deliverability audit

- 🔴 **CAN-SPAM gaps**: no physical postal address in any email; sender identity fine;
  unsubscribe works (token link — good). (LEGAL.md §4.)
- 🟠 **Consent**: account signup silently adds the email to the marketing list. At
  minimum add notice text at signup; ideally a pre-checked-in-US / unchecked-in-EU box.
- 🟠 **Deliverability prerequisites unverified**: confirm SPF, DKIM (Resend domain
  verification), and DMARC records exist for picksniff.com before any broadcast to a
  real list — one broadcast from an unauthenticated domain can poison your sender
  reputation permanently.
- 🟡 Broadcast tool sends in batches of 50 with no per-send rate limiting and no retry —
  fine at 100 subscribers, revisit at 5k (Resend batch API exists).
- 🟢 Unsubscribe deletes the row (vs. flagging) — means re-subscribes look "new" and
  historical counts are lost; acceptable, but consider a `status` column later.

## 7. Operations & reliability audit

- 🔴 **No CI**: `next build` runs only on the deploying machine and Vercel; lint never
  runs; no tests exist (GAPS #4). → GitHub Action: install, lint, build, (later) test —
  30 lines of YAML, blocks broken pushes to prod.
- 🟠 **No error monitoring**: client errors vanish into users' consoles; the "Something
  went wrong" incident was debugged blind. → Sentry free tier or even a tiny
  `/api/log-error` beacon wired into `app/error.js`.
- 🟠 **Single point of failure: the owner's laptop.** Repo is on GitHub (good); Supabase
  free tier has 7-day backups only; there is no dump of the `subscribers`/`profiles`
  data. → Monthly `pg_dump` via Supabase CLI into private storage; document restore.
- 🟡 **Schema drift**: `supabase/schema.sql` missing `subscribers` (GAPS #6); no migration
  tooling. Adopt "every dashboard change gets appended to schema.sql in the same PR" as
  a hard rule until real migrations are worth it.
- 🟡 No uptime monitoring — a free UptimeRobot ping on `/` and `/api/quiz/accords` gives
  alerting for both frontend and the data path.
- 🟢 Env vars complete in Vercel (verified via `vercel env ls`); `.env.local` untracked;
  `.env.example` current except unused affiliate IDs (keep — Phase 1 uses them).

## 8. Analytics gaps (specific events to add)

Instrument these eight events and nothing else to start:
`quiz_start` (per quiz type), `quiz_complete`, `results_view` (mode tag),
`buy_click` (fragrance id + retailer), `signup`, `wishlist_add`, `subscribe`,
`account_gate_view` (which gate). These directly answer: where do users drop off, what
converts, and is premium worth reviving.

## 9. Documentation audit

- Root docs are now current: `PROJECT.md` (architecture), `GAPS.md` (code audit),
  `CLAUDE.md` (agent instructions — audited separately, see final section of the
  delivery message), this `docs/` set (strategy/compliance).
- 🟢 `README.md` is still create-next-app boilerplate → replace with 5 lines linking the
  doc set.
- 🟢 The two catalog-generation scripts (`build_json.js`, `extract_pdf.js`) are undocumented
  root clutter → move to `scripts/` with a header comment each.

---

## Audit rollup — the ten actions worth doing first

1. Rotate broadcast secret (SECURITY F-1) — 30 min
2. Truthful privacy/ToS + affiliate disclosures (LEGAL §1–2) — 2 h
3. Set GA ID + 8 events — 2 h
4. `lib/affiliate.js` + program applications (GAMEPLAN Phase 1) — 1 day + waiting
5. Swap 840 KB logo for optimizable PNG — 1 h
6. Sitemap + compare-page fixes — 1 h
7. Catalog validation script wired into build — 2 h
8. GitHub Actions CI (lint + build) — 1 h
9. Email footer address + signup consent line — 1 h
10. Darker green text token for contrast — 2 h
