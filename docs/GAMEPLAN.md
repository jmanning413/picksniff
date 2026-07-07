# PickSniff Gameplan — From Live Site to Real Business

> The single source of truth for what to do, in what order, and why.
> Companion docs: `AUDIT.md` (full audit), `SECURITY.md` (security profile),
> `LEGAL.md` (compliance), `COMPETITORS.md` (market strategy), root `GAPS.md`
> (code-level fixes), root `PROJECT.md` (architecture).
> Written June 2026.

---

## Where you actually are (honest baseline)

**Built and working:** 750-fragrance catalog, six quizzes, matching engine with banded
scoring, encyclopedia + brand/accord/note/seasonal/trending pages, accounts with
wishlist/owned/quiz history, newsletter with welcome email + broadcast tool, tip jar,
live on picksniff.com with auto-deploy.

**Not working / not real yet:**
- **$0 revenue capability** — no affiliate program memberships, no tracking parameters on
  any buy link (GAPS #3). Every click you send to Sephora today earns nothing.
- **Premium shelved** — tip jar in its place; dead premium code confuses the codebase.
- **Legal exposure** — privacy policy and ToS make false statements (LEGAL.md).
- **One critical security hole** — broadcast secret in the client bundle (SECURITY.md F-1).
- **Zero users measured** — GA is optional-unset; you cannot see traffic, quiz completion,
  or click-through today.

The gap between "site exists" and "business exists" is: **affiliate money + traffic +
measurement.** Everything below is sequenced around that.

---

## Phase 0 — Stop-the-bleeding week (do before ANY marketing push)

Ordered; each item is one sitting.

| # | Task | Where | Why first |
|---|------|-------|-----------|
| 0.1 | Rotate `BROADCAST_SECRET`, remove hardcoded client check | `app/admin/email/page.js`, Vercel env | Anyone can mass-email your list today (GAPS #1) |
| 0.2 | Fix privacy policy & ToS false statements | `app/privacy/page.js`, `app/terms/page.js` | Legal exposure grows with every user (LEGAL.md §2) |
| 0.3 | Add affiliate disclosure next to buy buttons | `ResultsClient.js`, `fragrance/[id]` | FTC requirement before affiliate money flows (LEGAL.md §1) |
| 0.4 | Add postal address + sender ID to email footers | `lib/emails/welcome.js`, broadcast footer | CAN-SPAM requirement (LEGAL.md §4) |
| 0.5 | Add newsletter-consent notice at signup | `app/auth/page.js` | You currently auto-subscribe without telling people (LEGAL.md §4) |
| 0.6 | Set `NEXT_PUBLIC_GA_ID` (or add Plausible) | Vercel env | You cannot run a business blind; layout.js already supports it |
| 0.7 | Fix compare-page 404 + sitemap missing routes | GAPS #2, #10 | Cheap SEO wins before crawlers index broken pages |

**Exit criteria:** No critical security finding open, legal pages truthful, analytics
recording, every quiz route in the sitemap.

---

## Phase 1 — Turn on the money (weeks 1–3)

Affiliate revenue is the entire business model. Treat this as the product.

1. **Apply to affiliate programs** (owner task, not code):
   - Sephora — via Rakuten Advertising (their network). Requires a live site with
     traffic and a privacy policy (done in Phase 0).
   - Jomashop — via their affiliate page (historically Rakuten/AvantLink). Also pitch
     them directly later per the original plan.
   - FragranceNet and FragranceX — both run accessible programs (historically
     Commission Junction / ShareASale / direct); typically approve small sites, and
     fragrance-specific inventory beats Sephora for niche bottles. **Start here — they
     approve fastest and convert well for fragrance intent.**
   - Amazon Associates as backstop — approves instantly, pays little, but converts.
2. **Build `lib/affiliate.js`** (GAPS #3, #12): one module that turns
   `(fragrance, retailer)` into a tracked URL; env-driven IDs; used by every buy button.
   Include a `?utm_source=picksniff` fallback even before program approval so retailers
   can *see* your referred traffic when you pitch them.
3. **Track outbound clicks**: fire a GA event (or a `/api/click` beacon) on every buy
   click, tagged with fragrance id + retailer. This is your conversion funnel's last
   visible step and your leverage when negotiating direct deals.
4. **Populate `sephora_url`/`jomashop_url` for the top 100 fragrances** (by quiz
   appearance frequency) with direct product URLs instead of search URLs. Direct links
   convert dramatically better than search-result pages. Script it: a one-off
   `scripts/` job producing a JSON patch the owner reviews.

**Exit criteria:** ≥2 approved affiliate programs, tracked deep links on top-100
fragrances, click-through visible in analytics.

---

## Phase 2 — Traffic engine (weeks 3–10, ongoing)

You have 800+ indexable pages (750 fragrances + 41 brands + accords/notes/seasonal).
That's an SEO asset most competitors' quiz-apps don't have. Strategy: **SEO for durable
growth, Reddit/TikTok for spikes.**

### SEO (highest ROI for this codebase)
- **Fix content thinness**: fragrance pages currently synthesize descriptions from 3
  accords — near-duplicate content across 750 pages. Write real 80–150 word descriptions
  for the top 100 first (they're also your money pages). The `description` field already
  exists and is empty; filling it requires no code.
- **Comparison SEO**: once the compare page works (Phase 0.7), generate the ~50
  most-searched matchups ("Sauvage vs Bleu de Chanel") as static params + add to sitemap.
  These queries have huge volume and weak competition outside Fragrantica forums.
- **"Best X for Y" listicles**: `/seasonal` already does this pattern. Add
  `/best/[slug]` server pages driven by accord+vibe filters (best-vanilla-fragrances-for-
  winter, best-cheap-date-night-colognes). Each is ~0 marginal code.
- Submit sitemap in Google Search Console; watch which pages earn impressions.

### Reddit (credibility play — go slow)
- r/fragrance (~2M), r/Colognes, r/femfragfans, r/FragranceFreebies.
- **Do not link-drop; you will be banned.** Participate genuinely for 2–3 weeks, then
  post the quiz as "I built a free tool, feedback wanted" in the weekly self-promo
  threads where allowed. The beginner angle ("I built this because r/fragrance's
  buying guide overwhelmed me") is disarming and true.

### TikTok/Shorts (the personality quizzes exist FOR this)
- Format that works: "Your zodiac sign as a fragrance" / "POV: your scent matches your
  mood" — 15-second screen-recordings of the astrology/mood quiz with a result reveal.
  The six-quiz structure was built for shareable hooks; use it.
- Every quiz's result page should get an OG share image (you already have `@vercel/og`
  installed and unused — build one `/api/og` route rendering brand + name + match %).

**Exit criteria:** 500 organic sessions/week, one channel showing repeatable growth.

---

## Phase 3 — Retention & product depth (months 2–4)

Only after traffic exists. Priorities in order of evidence they'll matter:

1. **Real notes data** (GAPS #11): the single biggest product-quality unlock. With
   genuine top/middle/base notes, the premium note-filter becomes real, fragrance pages
   get unique content (SEO), and matching can gain a real notes dimension. This is a
   data-entry project (~750 rows); do top-100 first, source from your own knowledge +
   brand sites (do NOT scrape Fragrantica — their data, their ToS; see LEGAL.md §6).
2. **Weekly email actually weekly**: the welcome email promises "weekly picks." Automate
   a Fragrance-of-the-Week broadcast (you have the admin tool; a Vercel cron +
   template makes it hands-off). Broken promises churn lists.
3. **Reviews** (unlocks the fake-trending fix): simple 1–5 + one-line review per
   fragrance per user. Makes `/trending` honest ("most saved this week" for real),
   makes badges earnable, adds UGC content to fragrance pages (SEO again).
4. **Account deletion self-serve** — required to make the privacy policy true; also
   just table-stakes trust.
5. **Samples angle**: "sample before you buy" CTA linking to decant retailers
   (Surrender to Chance, DecantX have affiliate programs) — addresses the #1 real-world
   objection (blind-buying) and adds a second revenue line.

---

## Phase 4 — Premium, revisited (month 4+, only with >2k MAU)

The original $4.99/mo premium plan was shelved — correctly. Revisit only when the free
funnel proves retention. When you do:
- The infra half-exists (`is_premium`, `PremiumGate`, Stripe) but the webhook must
  actually set subscription state (GAPS #8).
- Rescope the offer around what free users actually hit walls on (measure gate clicks
  on `AccountGate`/`PremiumGate` first — instrument them in Phase 2).
- Strongest candidate perks by then: full-history + wardrobe builder, real note
  filtering (needs Phase 3.1), compare unlimited, early access to new quizzes.
- Kill the tip jar or fold it into a "supporter" tier — running both looks amateur.

---

## Measurement — the numbers that matter

| Metric | Where | Healthy target (6 mo) |
|---|---|---|
| Quiz starts / completions | GA events (instrument step transitions) | >70% completion |
| Results → buy-button CTR | outbound click events | >15% |
| Affiliate EPC (earnings per click) | affiliate dashboards | $0.10–0.40 |
| Organic sessions/week | GA / Search Console | 2,000 |
| Email list size / open rate | Supabase count + Resend | 1,000 / >35% |
| Signup conversion (visitor→account) | GA | 3–5% |

Revenue math to keep yourself honest: at 2,000 weekly sessions, 50% take the quiz, 15%
CTR, $0.20 EPC → ~$30/week. Affiliate revenue at this scale is a slow compounder — the
projections in the old planning docs ($1.7k/mo at 500 users) were fantasy. Traffic is
the whole game; that's why Phase 2 is the longest.

---

## Standing rules

1. **Nothing in Phases 1–4 starts until Phase 0 is done.** Phase 0 is one week of work.
2. Ship weekly; every push runs `npx next build` first (no test suite yet — GAPS #4;
   adding the match-engine tests is a rainy-day Phase 1 task).
3. Content > features after Phase 1. A new quiz is worth less than 20 real fragrance
   descriptions.
4. Do not add: native apps, user-uploaded images, forums/DMs (moderation burden), or a
   fragrance database migration to Supabase. All are complexity without near-term revenue.
