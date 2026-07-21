// Builds data-enrichment/gapfill-01.json — resolves the 6 products that
// batches 01 and 02 honestly shipped as null (confidence "low").
//
// UNLIKE the batch files, these pyramids were RESEARCHED against brand and
// retailer product pages rather than compiled from general knowledge, so each
// carries a `source` field. This is the first slice of docs/DATA-PRODUCT.md
// Phase 2 (per-entry sourcing) and the pattern later verification should follow.
//
// Still no scraping: these are individual product lookups, which CATALOG.md §2
// rule 1 explicitly permits ("offline cross-checking a single fact is OK;
// importing content is not").

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const find = (frag, conc) =>
  manifest.find((p) => `${p.brand} ${p.name}`.includes(frag) && p.concentration === conc)

const DATA = [
  {
    match: ['Ice Dive', 'EDT'],
    confidence: 'medium',
    source: 'Retailer/aggregator listings (Wikiparfum, Basenotes, Le Parfumier) 2026-07-21',
    top: ['Mint', 'Grapefruit', 'Lavender', 'Bergamot', 'Yuzu', 'Mandarin Orange', 'Anise'],
    middle: ['Geranium', 'Sandalwood', 'Patchouli'],
    base: ['Pepper', 'Ambergris', 'Musk', 'Vanilla', 'Tonka Bean'],
    description: 'Icy mint and citrus over a soft woody base. Sharp and bracing up front, warmer and sweeter as it settles.',
  },
  {
    match: ['Kenneth Cole Black', 'EDT'],
    confidence: 'medium',
    source: 'Retailer listings (Perfume.com, Perfumania, Basenotes) 2026-07-21',
    top: ['Mandarin Orange', 'Water Mint', 'Ginger', 'Basil'],
    middle: ['Lotus', 'Incense', 'Cedar', 'Nutmeg'],
    base: ['Musk', 'Violet Leaf', 'Suede', 'Amber'],
    description: 'Cool mint and ginger over incense and soft suede. Clean and understated, closer to fresh than to dark.',
    note: 'Resolved to Kenneth Cole Black for Men (2003). Distinct from the separate Black Bold catalog row and from the 2004 women\'s Black.',
  },
  {
    match: ['Galloway', 'EDP'],
    confidence: 'high',
    source: 'OFFICIAL brand page: us.parfums-de-marly.com/products/galloway (2026-07-21)',
    top: ['Lemon', 'Pepper', 'Elemi'],
    middle: ['Cardamom', 'Iris'],
    base: ['Musk', 'Ambrox', 'Cypriol'],
    description: 'Zesty lemon and pepper over powdery iris, resting on warm ambrox and musk. Bright and spicy without being loud.',
  },
  {
    match: ['Nautica Classic', 'EDT'],
    confidence: 'medium',
    source: 'Retailer listings (FragranceX, Fragrance Outlet, Basenotes) 2026-07-21',
    top: ['Aldehydes', 'Lime', 'Coriander', 'Cypress', 'Clary Sage', 'Bergamot', 'Lemon'],
    middle: ['Cyclamen', 'Jasmine', 'Caraway', 'Rose', 'Geranium'],
    base: ['Sandalwood', 'Amber', 'Patchouli', 'Musk', 'Oakmoss', 'Cedar'],
    description: 'A woody chypre built on citrus and herbs over mossy sandalwood. Classic early-nineties structure, dry and masculine.',
  },
  {
    match: ['Alexandria II', 'EDP'],
    confidence: 'medium',
    source: 'Retailer listings (Neiman Marcus, The Scent Room, Beautinow) 2026-07-21',
    top: ['Palisander Rosewood', 'Lavender', 'Apple', 'Cinnamon'],
    middle: ['Rose', 'Cedar', 'Lily-of-the-Valley'],
    base: ['Agarwood', 'Sandalwood', 'Amber', 'Vanilla', 'Musk'],
    description: 'Rich oud and sandalwood under spiced rose and rosewood. Opulent and resinous, a signature of the Oud Stars line.',
  },
  {
    match: ['40 Knots', 'EDP'],
    confidence: 'medium',
    source: 'Retailer listings (FragranceX, The Scent Room, Parfinity) 2026-07-21',
    top: ['Sea Notes', 'Foliage'],
    middle: ['Green Notes', 'Salt', 'Clary Sage'],
    base: ['Driftwood', 'Cedar', 'Musk'],
    description: 'Sea salt and green foliage over sun-bleached driftwood. Airy and maritime, built around openness rather than weight.',
    note: 'Sources disagree on the exact list for this one. The salt/marine/driftwood core is consistent everywhere; secondary notes vary. Worth a second check against the brand page before it is ever treated as verified.',
  },
]

const entries = []
const missing = []
for (const d of DATA) {
  const p = find(d.match[0], d.match[1])
  if (!p) { missing.push(d.match.join(' ')); continue }
  entries.push({
    brand: p.brand, name: p.name, concentration: p.concentration,
    tier: p.tier, accords: p.accords,
    confidence: d.confidence,
    source: d.source,
    top_notes: d.top, middle_notes: d.middle, base_notes: d.base,
    description: d.description,
    ...(d.note ? { note: d.note } : {}),
    row_count: p.ids.length,
    applies_to_ids: p.ids.map((x) => x.id),
  })
}
if (missing.length) {
  console.error('Could not match in manifest:', missing.join(', '))
  process.exit(1)
}

const counts = entries.reduce((a, e) => ({ ...a, [e.confidence]: (a[e.confidence] || 0) + 1 }), {})
const out = {
  _meta: {
    batch: 'gapfill-01',
    scope: 'Resolves the 6 products batches 01-02 shipped as null (confidence "low").',
    created: '2026-07-21',
    provenance: 'RESEARCHED against brand and retailer product pages, not compiled from general knowledge. Each entry carries a `source`. Individual product lookups only, never bulk import (CATALOG.md §2 rule 1).',
    counts, products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  },
  entries,
}
writeFileSync('data-enrichment/gapfill-01.json', JSON.stringify(out, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| rows:', out._meta.catalog_rows_covered)
entries.forEach((e) => console.log(`  ${e.confidence.padEnd(6)} ${e.brand} ${e.name} — ${e.source.slice(0, 60)}`))
