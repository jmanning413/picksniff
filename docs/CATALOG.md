# Catalog Revamp Gameplan — Real Notes & Real Photos

> The map for upgrading all 750 catalog entries from "accords only" to fully
> documented fragrances: verified note pyramids, original descriptions, licensed
> bottle images, and working retailer links. Follow this file whenever updating
> catalog data. Related: root `GAPS.md` #11 (fake notes), `docs/LEGAL.md` §6
> (data provenance rules), `docs/GAMEPLAN.md` Phase 1 (affiliate feeds).
> Created June 2026.

---

## 1. Where we are / where we're going

**Today, each entry has:**
`id`, `name`, `brand`, `concentration`, `tier`, `accords` (real, curated),
`top_notes` (FAKE — mirrors accords), `description` (mostly empty),
`sephora_url` / `jomashop_url` (null), no images.

**Target record:**

```json
{
  "id": "male-daily-budget-giorgio-armani-acqua-di-gio",
  "name": "Acqua di Giò",
  "brand": "Giorgio Armani",
  "concentration": "EDT",
  "tier": "budget",
  "accords": ["Aquatic", "Citrus", "Fresh"],
  "top_notes": ["Bergamot", "Neroli", "Green Tangerine"],
  "middle_notes": ["Sea Notes", "Jasmine", "Rosemary"],
  "base_notes": ["White Musk", "Cedar", "Patchouli"],
  "description": "Original 2-3 sentence description in brand voice.",
  "image_url": "/fragrances/images/male-daily-budget-giorgio-armani-acqua-di-gio.jpg",
  "image_source": "fragrancenet-feed",
  "sephora_url": "https://...direct product URL...",
  "jomashop_url": "https://...direct product URL...",
  "data_status": "verified"
}
```

`data_status` values: `legacy` (untouched) → `drafted` (AI-generated, unreviewed)
→ `verified` (checked against brand/retailer page) — only `verified` entries get
the full notes-pyramid UI treatment.

## 2. Non-negotiable rules (from LEGAL.md — read before every batch)

1. **Never scrape or import Fragrantica/Parfumo data** — including Kaggle
   datasets derived from them. Offline cross-checking a single fact is OK;
   importing content is not.
2. **Notes are facts** — confirming them against brand/retailer product pages
   is fine. **Descriptions are expression** — every description must be
   original writing, never copied or lightly reworded from anywhere.
3. **Images must be licensed**: affiliate program feeds (licensed for
   affiliates), brand press kits (licensed for media use), or nothing. Never
   hotlink or download from Fragrantica/Parfumo/Google Images.
4. **Accord copy never claims ingredients** (Design.md drift rule) — but note
   pyramids DO name ingredients, because they're per-fragrance facts, verified.
5. Claude never writes to `/fragrances/*.json` without explicit approval of a
   reviewed batch file (CLAUDE.md standing rule).

## 3. The pipeline — five stages

### Stage A — Notes + descriptions (can start immediately, no dependencies)

Batch loop, ~50 fragrances per batch, 15 batches total:

1. **Generate**: Claude writes `data-enrichment/batch-NN.json` — for each id:
   `top_notes`, `middle_notes`, `base_notes`, `description`, and a
   `confidence` flag (`high` / `verify`).
2. **Verify**: every `verify`-flagged entry (and a 10% spot-check of `high`
   ones) is checked against the brand's or a major retailer's product page.
   Fix or downgrade anything that doesn't check out.
3. **Approve**: Joseph reviews the batch file and says go.
4. **Merge**: `scripts/merge-enrichment.mjs` writes approved fields into the
   15 catalog files and sets `data_status`. Run `npm test` + `npx next build`
   after every merge (engine tests must stay green — notes affect scoring
   inputs).
5. **Commit** the batch file AND the catalog change together, one commit per
   batch, message `Catalog enrichment batch NN (ids X-Y)`.

**Batch order** (highest user visibility first):
1. Batch 01: top ~100 by quiz-result visibility (most-surfaced across all
   gender/tier/vibe pools)
2. Batches 02–06: remaining budget + quality tier entries (they dominate results)
3. Batches 07–15: niche tier and the long tail

### Stage B — Retailer links (blocked on affiliate approvals)

1. Apply to FragranceNet + FragranceX (fast approvals), Sephora via Rakuten,
   Jomashop (GAMEPLAN Phase 1 — owner task).
2. When the first feed arrives: `scripts/import-feed.mjs` fuzzy-matches feed
   rows to catalog ids (brand + name + concentration), outputs a match report:
   `matched / ambiguous / unmatched`.
3. Joseph reviews ambiguous matches; script fills `sephora_url`/`jomashop_url`
   (and future retailer fields) for confirmed matches.
4. STANDING DECISION: feed imports take tracking URLs and image URLs only — IGNORE price columns. No price storage, refresh, or display systems, ever (see CLAUDE.md rules).
5. `lib/affiliate.js` (GAPS #3) appends tracking params at render time — URLs
   in the catalog stay clean, tracking stays in one file.

### Stage C — Images (blocked on Stage B feeds; press kits as fallback)

1. Primary source: image URLs from affiliate feeds → download once via
   `scripts/import-images.mjs`, resize to ~600px WebP, store in
   `public/fragrances/images/{id}.webp`, record `image_source`.
2. Fallback for top-100 gaps: brand press-kit images (manual, log the source).
3. No image → keep the letter-avatar (it's the designed fallback, not a bug).
4. UI switch: fragrance page + result cards render `image_url` when present,
   letter-avatar otherwise. Never mix on one card.

### Stage D — UI unlocks (after ≥ 1 batch merged)

- Fragrance page: real Top / Middle / Base pyramid section for `verified`
  entries (replaces the fake top_notes strip).
- Quiz Step 6 notes filter: un-placebo it — match against real note fields
  (engine change: `npm test` gate, don't touch scoring bands).
- Results cards: show 2-3 real top notes under the accords.
- SEO: descriptions land automatically (pages already render `description`).

### Stage E — Maintenance mode (steady state)

- New fragrance added to catalog → must enter with full target-record fields
  (`data_status: "verified"`) — no more legacy-shaped entries.
- Quarterly: re-run feed import to catch dead retailer URLs.
- Corrections from users/community → fix the JSON, note it in the commit.
- `scripts/validate-catalog.mjs` (AUDIT.md §2) runs in `prebuild` and fails on:
  duplicate ids, accords outside the 11, missing required fields, curation-rule
  violations (max 3/brand/vibe, max 1 LV/vibe, Byredo/Diptyque unisex-only).

## 4. Progress tracker

Update this table as batches merge. "—" = not started.

| Stage | Scope | Status | Date |
|---|---|---|---|
| A batch 01 | Top 100 notes+descriptions | — | |
| A batches 02–06 | Budget+quality tiers | — | |
| A batches 07–15 | Niche + long tail | — | |
| B | Affiliate applications sent | — | |
| B | First feed imported, links merged | — | |
| C | Images: top 100 | — | |
| C | Images: full catalog coverage | — | |
| D | Notes pyramid UI + real notes filter | — | |
| E | Validation script in prebuild | — | |

## 5. Definition of done (per fragrance)

- [ ] Real top/middle/base notes, verified or confidently known
- [ ] Original description, 2–3 sentences, brand voice, no ingredient claims
      beyond the verified notes
- [ ] Licensed image or deliberate letter-avatar fallback
- [ ] Direct retailer product URLs (not search URLs) where the product exists
- [ ] `data_status: "verified"`
- [ ] Curation rules still hold after any tier/vibe/accord correction
