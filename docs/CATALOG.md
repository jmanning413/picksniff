# Catalog Revamp Gameplan — Real Notes & Real Photos

> The map for upgrading the catalog from "accords only" to fully documented
> fragrances: verified note pyramids, original descriptions, licensed bottle
> images, and working retailer links. Follow this file whenever updating
> catalog data. Related: root `GAPS.md` #11 (fake notes), `docs/LEGAL.md` §6
> (data provenance rules), `docs/GAMEPLAN.md` Phase 1 (affiliate feeds),
> `docs/DATA-PRODUCT.md` (future "sell the data" scoping).
> Created June 2026. Batching model revised July 2026.
>
> **Real scope (measured, not estimated):** the catalog holds **748 rows**
> (13 files of 50 + 2 of 49, not 750) which resolve to **492 unique products**
> across **92 brands**. `data-enrichment/manifest.json` is the generated
> source of truth for that mapping.

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

`data_status` values: `legacy` (untouched) → `drafted` (compiled, not yet checked
against a primary source) → `verified` (checked against brand/retailer page).

**UI gate (revised July 2026):** the note pyramid renders for `drafted` entries,
not just `verified`. Owner decision — notes are supporting detail under a match
score on a free recommendation site, which is a low-stakes accuracy context (the
reasoning is spelled out in `docs/DATA-PRODUCT.md` §2). The UI gates on the
*presence* of `middle_notes` + `base_notes` rather than on `data_status`, so it
lights up as batches merge and un-enriched rows simply render nothing. If the
data is ever sold or used as ground truth, that bar changes completely.

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

### Stage A0 — Name repair (DISCOVERED 2026-06-13; partially done)

The original PDF extraction mangled names. 31 unambiguous corruptions were repaired
in place (interleaved brand fragments like "Princess EDP Vera", truncations like
"Y Le", one fused double-entry). **Remaining judgment task:** ~200+ entries carry a
redundant brand prefix in the name ("Creed Aventus" under brand Creed). Cards show
the brand separately, so these render doubled. Rule for repair batches: strip the
prefix ONLY where the remainder is the true product name ("Aventus", "Santal 33");
keep integral-brand names ("Dior Homme", "Miss Dior", "Bleu de Chanel"). Fold these
decisions into each Stage A batch review. IDs are never edited.

### Stage A — Notes + descriptions (can start immediately, no dependencies)

**Batching is by UNIQUE PRODUCT, not by catalog row.** Notes are a property of
the product (brand + name + concentration), not of the gender/vibe/tier pool it
was placed in. Dior Sauvage appears in 4 rows; it has one pyramid. So each batch
is ~50 unique products drawn from `data-enrichment/manifest.json` in descending
row-count order (highest catalog visibility first), and one approved pyramid
propagates to every `applies_to_ids` entry at merge time.

**492 unique products ≈ 10 batches of 50.**

1. **Generate**: Claude writes `data-enrichment/batch-NN.json` — for each
   product: `top_notes`, `middle_notes`, `base_notes`, `description`, a
   `confidence` flag, `row_count`, and `applies_to_ids`. The generator script
   (`data-enrichment/build-batch-NN.mjs`) joins the pyramids against
   `manifest.json` so brand/name/concentration/tier/accords/ids come from the
   live catalog verbatim and are never retyped.
2. **Verify**: every `low` entry and every entry carrying a `note` caveat is
   checked against the brand's or a major retailer's product page, plus a 10%
   spot-check of `high` ones. Fix or downgrade anything that doesn't check out.
3. **Approve**: Joseph reviews the batch file and says go.
4. **Merge**: `scripts/merge-enrichment.mjs` writes approved fields into the
   15 catalog files (fanning each product out across its `applies_to_ids`) and
   sets `data_status`. The script refuses to merge if any top note shares a name
   with one of the 11 filter accords, because `lib/matchEngine.mjs` unions
   `top_notes` into the notes-filter pool and such a collision would silently
   change scoring.
   **Then bump `DATA_VERSION` in `lib/fragrances.js`.** The catalog is wrapped in
   `unstable_cache` with `revalidate: false`, and Vercel's Data Cache persists
   across deployments — without a version bump the new data deploys but
   production keeps serving the old catalog. This was observed locally: a stale
   cache survived a rebuild and hid the merged notes completely.
   Finally run `npm test` + `npx next build` (engine tests must stay green), and
   `node scripts/snapshot-matches.mjs` before/after to prove scoring is
   unchanged.
5. **Commit** the batch file AND the catalog change together, one commit per
   batch, message `Catalog enrichment batch NN (N products, M rows)`.

#### The confidence system (three levels, and one hard rule)

| Level | Meaning | Notes fields |
|---|---|---|
| `high` | Globally iconic, grounded in widely published knowledge (Sauvage, CK One, Coco Mademoiselle tier) | Populated |
| `medium` | Well known; core notes solid, secondary notes may vary by source | Populated |
| `low` | Cannot be grounded reliably from real knowledge | **`null`** + `needs_verification: true` + `reason` |

**THE HONESTY RULE — do not break this.** A `low`-confidence entry ships with
`top_notes`/`middle_notes`/`base_notes`/`description` set to `null` and an
explicit `needs_verification: true` plus a one-line `reason`. **Never generate a
plausible-sounding pyramid to fill a gap.** Fabricated data presented as fact is
strictly worse than an honest hole: a hole gets researched, a fabrication ships
and quietly poisons the catalog, the match engine, and any future data product.
35 real entries and 15 flagged gaps beats 50 entries nobody can trust.

Entries that are grounded but carry a specific caveat (flanker vs original,
EDT vs EDP pyramids differing, men's vs women's variant ambiguity) stay at
`medium` and carry a `note` field naming the exact doubt. Those get verified
alongside the `low` ones.

**Provenance (non-negotiable):** pyramids are compiled from general knowledge of
widely documented fragrances. Never scraped, never imported from Fragrantica or
Parfumo, never sourced from a third-party dataset derived from them — including
paid ones (see §2 rule 1, and `docs/DATA-PRODUCT.md` on why buying a scraped
dataset does not launder its provenance).

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
| A sample | 5-product proof of concept (`batch-01-sample.json`) | Approved | 2026-07-20 |
| A batch 01 | Top 50 products by row count, 175 rows (24 high / 24 medium / 2 low) | **Awaiting review** | 2026-07-21 |
| A batches 02–10 | Remaining ~442 unique products, descending row count | — | |
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
