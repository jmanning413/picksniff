# Data Product Scoping: Selling Fragrance Data as an API

> **STATUS: FUTURE PRODUCT DECISION. NOT BEING BUILT.**
> This is a scoping document for an idea raised in July 2026: that the catalog
> being compiled under `docs/CATALOG.md` could eventually be sold as a fragrance
> data API. It exists so the idea is thought through honestly rather than drifted
> into. Nothing in here is approved, scheduled, or under construction. The
> current and only sanctioned use of the enrichment data is **PickSniff itself**.
> Created 2026-07-21.

---

## 1. What the product would be

A read API (and/or bulk export) over the compiled catalog:

| Field | Source | Notes |
|---|---|---|
| `brand`, `name`, `concentration` | Existing catalog | Product identity |
| `top_notes`, `middle_notes`, `base_notes` | Stage A enrichment | The actual value proposition |
| `accords` (11-value controlled vocabulary) | Existing, curated | Our own taxonomy, genuinely differentiated |
| `gender`, `vibe`, `tier` | Existing, curated | Our editorial classification |
| `confidence` | Stage A enrichment | **The most commercially interesting field** |

The honest differentiator is not volume. Competing datasets claim 100k+
fragrances; a 492-product catalog cannot compete on size and should not try. The
differentiators would be:

1. **A clean controlled vocabulary.** 11 normalized accords instead of thousands
   of free-text tags. That is genuinely useful for anyone building a recommender.
2. **Per-entry confidence flags.** Almost no fragrance dataset tells you which
   rows to trust. Ours would.
3. **Defensible provenance.** Compiled, not scraped. See §4.

## 2. The accuracy bar problem (read this before anything else)

There is a large and easily underestimated gap between two uses of the same data:

- **Today: flavor text under a match score.** If Sauvage's middle notes list
  "geranium" and a source would have said "elemi," a PickSniff user is not
  harmed. The notes are supporting colour for a recommendation the accord engine
  already made. Small errors are invisible and cost nothing.
- **If sold: ground truth a customer builds on.** A paying customer treats every
  field as fact. They will build search, filters, recommendations, and possibly
  their own customer-facing copy on it. An error propagates into *their* product,
  and they can point at an invoice and say they paid for accuracy.

**This is a different product with a different standard, not the same data with a
price tag.** Moving from one to the other requires per-entry sourcing: a citation
(brand product page or major retailer listing) recorded per fragrance, a date
checked, and a re-verification cadence as formulations get reformulated. That is
the actual work, and it is substantially larger than compiling the notes was.

## 3. The verification gap (what could honestly be sold today: nothing)

Measured against batch-01 (the top 50 products by catalog row count):

| Confidence | Count | Sellable as verified ground truth? |
|---|---|---|
| `high` | 24 | **No.** Well grounded, but "I know this reliably" is not a citation. |
| `medium` | 24 | **No.** Core notes solid, secondary notes explicitly may vary. |
| `low` | 2 | **No.** Honestly null by design. |

**Today the honest answer is that 0 of 492 products are sellable as verified
data**, because *verified* means checked against a named primary source on a
known date, and no entry has that yet. `high` confidence means the compilation is
trustworthy for internal use. It does not mean sourced.

That is not a reason to abandon the idea. It is the size of the gap, stated
plainly, so nobody prices a product against data that has not been sourced yet.
CATALOG.md's `data_status` ladder (`legacy` → `drafted` → `verified`) is exactly
the right instrument; a data product needs `verified` to actually mean something,
with the citation stored, not just the label.

## 4. Legal and licensing flags

**None of this is legal advice. Selling data requires real legal review before
taking a single payment.** Flags to raise with a lawyer:

1. **Compiled factual data has weaker protection than creative work.** Individual
   notes are facts, and facts are not copyrightable. Our *selection and
   arrangement* (the accord taxonomy, tier/vibe classification, confidence
   scoring) is the protectable part. Practically: our editorial layer is the
   asset, not the note lists.
2. **Provenance is our strongest position, and it must stay clean.** The whole
   catalog is compiled from general knowledge, never scraped and never bought
   from a scraped dataset. That is what makes it sellable at all. Buying a
   Fragrantica-derived dataset would not launder its origin: a vendor who
   scraped in breach of another site's terms never held the rights they would be
   purporting to sublicense, so the buyer inherits the exposure and adds a
   payment trail. **A single imported scraped row would contaminate the entire
   product.** This is the reason the no-scraping rule is absolute.
3. **Trademarks.** Brand and product names are trademarks. Using them to
   factually identify real products is generally nominative fair use, but a
   commercial data product invites more scrutiny than a consumer site, and must
   not imply brand endorsement, partnership, or authorization.
4. **Terms of service and accuracy disclaimers are mandatory.** Any paid API
   needs its own ToS: no warranty of accuracy, no fitness for a particular
   purpose, liability capped, clear statement that notes reflect published
   information and formulations change over time.
5. **Reformulation risk.** Fragrances get reformulated and pyramids change.
   Selling a static snapshot as current fact creates ongoing accuracy exposure
   that a consumer site simply does not carry.
6. **Customer redistribution rights** need defining up front: can a customer
   cache it, resell it, train a model on it? Silence here causes disputes later.

## 5. A realistic phased path

**Phase 1 — Internal only (where we are, and where we stay for the foreseeable future).**
Finish Stage A across all 492 products. Use the data on PickSniff exclusively:
the real note pyramid UI, un-placebo the notes filter, richer descriptions and
SEO. Value is captured immediately with zero legal or accuracy exposure. The data
earns its keep here regardless of whether it is ever sold.

**Phase 2 — Verification (only if Phase 1 is complete and there is real demand).**
Convert `high`/`medium` confidence into actual sourced verification: a citation
URL and check date per entry against brand product pages and major retailer
listings, starting with the highest-row-count products. Extend the schema with
`source_url` and `verified_at`. This is the phase that costs real time, and it is
the phase that makes the difference between "our data" and "a data product."

**Phase 3 — Only then, consider selling.** Gate this behind: (a) a meaningful
share of the catalog at genuine `verified` status with stored citations,
(b) completed legal review and drafted ToS, (c) evidence someone actually wants
to buy it, (d) a maintenance commitment, because a stale data product is worse
than no data product. A rate-limited free tier over a small verified slice is the
cheapest way to test demand before building billing.

**Do not skip Phase 2.** Selling Phase 1 data is the failure mode this document
exists to prevent: it converts a private, low-stakes accuracy tolerance into a
public, paid, contractual one overnight.

## 6. Honest assessment

The idea is not silly. The confidence-flag concept and the clean accord
vocabulary are genuinely differentiated, and "compiled, not scraped" is a real
competitive position in a category where most available datasets have murky
origins. Whether it is a *business* is a much bigger question: the addressable
market for fragrance data APIs is small, incumbents claim far larger catalogs,
and the ongoing verification burden is permanent, not one-off.

The pragmatic read: treat the data as **infrastructure that makes PickSniff
better**, which it definitely is, and treat the API as a **speculative option**
that costs nothing to keep open as long as Phase 1 is done cleanly. The single
most valuable thing for both outcomes is identical: keep provenance spotless and
confidence flags honest. Do that, and the option stays open. Break it once, and
it closes permanently.
