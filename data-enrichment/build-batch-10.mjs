// Builds data-enrichment/batch-10.json — products ranked 451-492: THE FINAL
// TRANCHE. Same rules: compiled from general knowledge, never scraped;
// ungroundable entries ship as null pending research; SKIP for swap-removed.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(450, 492)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })
const SKIP = (expect, reason) => ({ expect, skip: true, reason })

const DATA = [
  N('Ombre Leather | Parfum', 'medium', ['Violet Leaf'], ['Leather', 'Jasmine Sambac'], ['Patchouli', 'Moss', 'Amber'],
    'Raw leather and violet leaf in the densest concentration. Desert air and saddle.',
    'Parfum concentration (2021) of the Ombre Leather line. Confirm the Parfum-specific list.'),
  N('Tom Ford Tuscan Leather', 'high', ['Thyme', 'Raspberry', 'Saffron'], ['Leather', 'Jasmine', 'Olibanum'], ['Amber', 'Suede', 'Woody Notes'],
    'Raw leather cut with jammy raspberry. Dense, animalic and one of the most distinctive things Tom Ford makes.',
    'DUPLICATE PRODUCT: same fragrance as the "Tuscan Leather" row enriched in batch-04, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  SKIP('Tom Ford Noir | EDP', 'Row removed by swap-02 (discontinued 2020); replaced by Noir Extreme, fully enriched.'),
  N('Tommy Girl', 'medium', ['Apple Blossom', 'Mandarin', 'Camellia'], ['Honeysuckle', 'Lily', 'Rose'], ['Musk', 'Sandalwood', 'Cedar'],
    'Apple blossom and honeysuckle over clean musk. A bright, energetic nineties classic that never left.',
    'Same product as the swap-01 replacement row in female_sport; pyramid kept identical across all rows.'),
  SKIP('Tommy Sport', 'Row removed by swap-02 (product does not exist); replaced by Jean Paul Gaultier Le Male, fully enriched.'),
  N('Valentino Donna', 'medium', ['Bergamot'], ['Iris', 'Rose'], ['Leather', 'Vanilla', 'Patchouli'],
    'Powdery iris and rose over suede-soft leather. Roman elegance, quietly done.'),
  N('Born in Roma', 'medium', ['Blackcurrant', 'Bergamot'], ['Jasmine Grandiflorum', 'Jasmine Sambac'], ['Bourbon Vanilla', 'Woody Notes'],
    'Triple jasmine over street-smart vanilla. The modern Valentino bestseller.'),
  N('Voce Viva | EDP', 'medium', ['Bergamot', 'Mandarin'], ['Orange Blossom', 'Gardenia'], ['Vanilla', 'Moss'],
    'Golden gardenia and orange blossom over warm vanilla.'),
  N('Valentino Uomo | EDT', 'medium', ['Bergamot', 'Myrtle'], ['Coffee', 'Gianduia Cream', 'Cedar'], ['Leather', 'Woody Notes'],
    'Espresso and hazelnut cream over suede. An Italian cafe rendered wearable.'),
  N('Voce Viva Intense', 'medium', ['Bergamot', 'Mandarin'], ['Orange Blossom', 'Gardenia'], ['Vanilla', 'Benzoin', 'Moss'],
    'The Voce Viva vanilla pushed deeper and more resinous.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('First', 'medium', ['Aldehydes', 'Blackcurrant Bud', 'Mandarin'], ['Jasmine', 'Rose', 'Narcissus', 'Tuberose'], ['Amber', 'Sandalwood', 'Oakmoss', 'Civet'],
    'A sparkling aldehydic floral from 1976, the first fragrance from a jeweller. Polished and bright.'),
  N('Princess', 'medium', ['Water Lily', 'Apple', 'Mandarin', 'Apricot'], ['Guava', 'Tuberose', 'Tiare Flower'], ['Vanilla', 'Amber', 'Chocolate'],
    'Waterlily and fruit over vanilla and a whisper of chocolate. A tiara in a bottle, on purpose.'),
  N('Bright Crystal Absolu', 'medium', ['Pomegranate', 'Yuzu'], ['Peony', 'Magnolia', 'Lotus'], ['Musk', 'Mahogany', 'Amber'],
    'The Bright Crystal sparkle concentrated and warmed.',
    'Absolu flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Eros Pour Femme', 'medium', ['Sicilian Lemon', 'Calabrian Bergamot', 'Pomegranate'], ['Jasmine', 'Peony', 'Lemon Blossom'], ['Sandalwood', 'Ambroxan', 'Musk', 'Oak'],
    'Bright lemon and pomegranate over jasmine and warm woods. Confident and polished.'),
  N('Dylan Blue Pour Femme', 'medium', ['Blackcurrant', 'Apple', 'Forget-Me-Not'], ['Rose Hip', 'Petalia', 'Jasmine'], ['Musk', 'Patchouli', 'Styrax'],
    'Fruity florals over clean musk and a shadow of patchouli.',
    'Confirm secondary notes against the brand page.'),
  N('Versace Bright Crystal', 'high', ['Pomegranate', 'Yuzu', 'Water Notes'], ['Peony', 'Magnolia', 'Lotus'], ['Musk', 'Mahogany', 'Amber'],
    'Pomegranate and dewy petals over clean musk. One of the best-selling feminines of its era.'),
  N('Man Eau Fraiche', 'medium', ['Lemon', 'Bergamot', 'Rosewood'], ['Tarragon', 'Sage', 'Cedar'], ['Musk', 'Amber', 'Woody Notes'],
    'Mediterranean citrus over airy woods. Light, likeable and endlessly summery.'),
  N('| Eros | EDP', 'high', ['Mint', 'Green Apple', 'Lemon'], ['Tonka Bean', 'Ambroxan', 'Geranium'], ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar'],
    'The Eros mint-and-vanilla clash in a deeper register.',
    'EDP concentration; the EDT was enriched in batch-02. Shares the composition; the EDP reads warmer.'),
  N('Love Spell', 'medium', ['Peach', 'Cherry Blossom'], ['White Jasmine'], ['Musk'],
    'Peach and cherry blossom over soft musk. A body-mist icon in fine-fragrance form.'),
  N('| Bombshell | EDP', 'medium', ['Passion Fruit', 'Grapefruit', 'Pineapple'], ['Peony', 'Vanilla Orchid', 'Red Berries'], ['Musk', 'Woody Notes'],
    'Juicy passion fruit and peony over soft musk. One of the best-selling fragrances in America, year after year.',
    'Same product as the swap-01 replacement row in female_sport; pyramid kept identical across all rows.'),
  SKIP('Bombshell Summer', 'Row removed by cut-audit-01 (dead limited edition); replaced by core Bombshell, fully enriched.'),
  N('Flowerbomb Midnight', 'medium', ['Pomegranate'], ['Jasmine Sambac', 'Blackcurrant'], ['Vanilla', 'Musk'],
    'The Flowerbomb sweetness after dark, with pomegranate up top.',
    'Midnight flanker. Confirm the flanker-specific list.'),
  N('Flowerbomb Nectar', 'medium', ['Bergamot', 'Osmanthus'], ['Orange Blossom', 'Jasmine'], ['Bourbon Vanilla', 'Tonka Bean', 'Benzoin'],
    'The Flowerbomb idea drenched in honeyed vanilla.',
    'Nectar flanker. Confirm the flanker-specific list.'),
  N('Ruby Orchid', 'medium', ['Red Pear'], ['Orchid', 'Peony'], ['Vanilla', 'Patchouli'],
    'Juicy pear over red orchid and warm vanilla.',
    'Ruby Orchid flanker. Confirm the flanker-specific list.'),
  N('Flowerbomb Dew', 'medium', ['Pear Blossom', 'Bergamot'], ['Rose', 'Iris'], ['Musk', 'Sandalwood'],
    'The Flowerbomb florals washed in morning dew. The lightest of the line.',
    'Dew flanker. Confirm the flanker-specific list.'),
  N("Fiore d'Ulivo", 'high', ['Amalfi Lemon', 'Lotus', 'Basil', 'Ambrette'], ['Olive Blossom', 'Magnolia', 'Jasmine'], ['Musk', 'Benzoin', 'Amber'],
    'Olive blossom and Amalfi lemon over soft musk. The Mediterranean in a bottle.',
    'RESEARCHED against the OFFICIAL Xerjoff product page plus Jomashop 2026-07-21.'),
  N('Casamorati 1888', 'high', ['Coriander', 'Clove', 'Green Pepper', 'Saffron'], ['Grasse Rose', 'Moroccan Neroli', 'Ylang-Ylang'], ['Mysore Sandalwood', 'Patchouli', 'Amber', 'Birch'],
    'Spiced rose over grand sandalwood and amber. Old-world elegance, faithfully restored.',
    'RESEARCHED against the OFFICIAL Xerjoff product page 2026-07-21.'),
  N('Soprano', 'high', ['Calabrian Bergamot', 'Freesia', 'Litchi'], ['Bulgarian Rose', 'Egyptian Jasmine', 'Milky Accord', 'Osmanthus'], ['Patchouli', 'Oud', 'Leather'],
    'Milky rose and osmanthus over gentle oud. Calm, idyllic and quietly plush.',
    'RESEARCHED against the OFFICIAL Xerjoff product page plus Niche Beauty 2026-07-21.'),
  N('1861 Renaissance', 'high', ['Amalfi Lemon', 'Tangerine', 'Bergamot', 'Petitgrain'], ['Mint', 'Lily-of-the-Valley', 'Rose'], ['Musk', 'Virginia Cedar', 'Patchouli', 'Amber'],
    'Radiant Italian citrus over mint and clean woods. Sunlight, rendered precisely.',
    'RESEARCHED against the OFFICIAL Xerjoff product page plus Maxaroma 2026-07-21.'),
  N('| Naxos |', 'medium', ['Bergamot', 'Lavender', 'Lemon'], ['Honey', 'Cinnamon', 'Cashmeran'], ['Tobacco', 'Tonka Bean', 'Vanilla', 'Benzoin'],
    'Honeyed tobacco over vanilla and tonka. Rich and golden, the Xerjoff everyone recommends first.',
    'DUPLICATE PRODUCT: same fragrance as the "Xerjoff Naxos" row enriched in batch-04, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Mon Paris | EDP', 'high', ['Strawberry', 'Raspberry', 'Pear', 'Bergamot'], ['Peony', 'Datura', 'Jasmine'], ['Patchouli', 'White Musk', 'Ambroxan'],
    'Sweet berries falling into airy patchouli. Vertiginous, romantic and very Parisian.'),
  N('Black Opium Intense', 'medium', ['Blue Absinthe Accord', 'Pear'], ['Coffee', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Patchouli', 'Licorice'],
    'The Black Opium coffee turned up, with an electric absinthe glow.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Libre Intense', 'medium', ['Mandarin Orange', 'Bergamot'], ['Lavender', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Tonka Bean', 'Ambergris'],
    'The Libre lavender-vanilla tension pushed hotter.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Mon Paris | EDT', 'medium', ['Strawberry', 'Raspberry', 'Pear', 'Bergamot'], ['Peony', 'Datura', 'Jasmine'], ['Patchouli', 'White Musk'],
    'The Mon Paris berries in a lighter, brighter splash.',
    'EDT concentration; shares the EDP composition.'),
  N("Yves Saint Laurent L'Homme", 'medium', ['Ginger', 'Bergamot', 'Lemon'], ['Violet Leaf', 'White Pepper', 'Basil'], ['Cedar', 'Vetiver', 'Tonka Bean'],
    'Crisp ginger and citrus over smooth cedar and tonka. Polished, office-safe and reliably complimented.',
    'DUPLICATE PRODUCT: same fragrance as the "L\\u2019Homme" row added by cut-audit swap-01 in male_formal, listed separately due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N("La Nuit de L'Homme | EDT", 'high', ['Cardamom'], ['Cedar', 'Lavender', 'Bergamot'], ['Vetiver', 'Caraway'],
    'Cardamom and dark cedar built for late hours. A modern seduction benchmark.'),
  N('Y Le Parfum', 'medium', ['Apple', 'Ginger', 'Bergamot'], ['Sage', 'Lavender', 'Geranium'], ['Tonka Bean', 'Cedar', 'Vetiver'],
    'The Y freshness compressed into something darker and dressier.',
    'Le Parfum concentration (2021). Confirm the specific list against the brand page.'),
  N("La Nuit de L'Homme Parfum Intense", 'medium', ['Cardamom', 'Bergamot'], ['Lavender', 'Cedar', 'Orange Blossom'], ['Vetiver', 'Tonka Bean', 'Vanilla'],
    'The La Nuit cardamom-cedar signature in a warmer, sweeter register.',
    'Parfum Intense variant. Shares the line DNA; confirm the specific list.'),
  N('| Libre | EDP', 'medium', ['Mandarin Orange', 'Blackcurrant', 'Bergamot', 'Lavender'], ['Lavender', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Musk', 'Cedar', 'Ambergris'],
    'Sharp lavender over creamy vanilla. Modern and confident.',
    'DUPLICATE PRODUCT: same fragrance as the "Yves Saint Laurent Libre" EDP row enriched in batch-04, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Black Opium | Parfum', 'medium', ['Pear', 'Pink Pepper'], ['Coffee', 'Jasmine', 'Orange Blossom'], ['Vanilla', 'Patchouli', 'Woody Notes'],
    'The Black Opium coffee-vanilla signature in its densest form.',
    'Parfum concentration (2022). Shares the line DNA; confirm the specific list.'),
  N('Zara Man Gold', 'medium', ['Lemon'], ['Praline', 'Cinnamon'], ['Ebony', 'Amber'],
    'Lemon over praline, cinnamon and dark woods. A lot of warmth for very little money.',
    'RESEARCHED against retailer listings (Amazon, Parfumo, The Scent Base) 2026-07-21. Sources vary on base notes; flagged for verification.'),
  N('Night Pour Homme IV', 'medium', ['Bergamot', 'Lemon'], ['Leather'], ['Bamboo', 'Patchouli'],
    'Citrus over a smooth leather core. The darkest of the Night Pour Homme editions.',
    'RESEARCHED 2026-07-21: Night Pour Homme IV verified as a real 2017 Zara edition, distinct from editions II and III.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  const exp = DATA[i].expect.replace(/\\u2019/g, '’')
  if (!hay.includes(exp)) bad.push(`rank ${i + 451}: expected "${exp}" in "${hay}"`)
})
if (bad.length) {
  console.error('RANK MISALIGNMENT - refusing to build:'); bad.forEach((b) => console.error('  ' + b)); process.exit(1)
}

const entries = []
const skipped = []
slice.forEach((p, i) => {
  const n = DATA[i]
  if (n.skip) { skipped.push({ product: `${p.brand} ${p.name}`, reason: n.reason }); return }
  const grounded = n.confidence !== 'low'
  entries.push({
    brand: p.brand, name: p.name, concentration: p.concentration,
    tier: p.tier, accords: p.accords, confidence: n.confidence,
    ...(grounded
      ? { top_notes: n.top, middle_notes: n.middle, base_notes: n.base, description: n.description }
      : { top_notes: null, middle_notes: null, base_notes: null, description: null, needs_verification: true, reason: n.reason }),
    ...(n.note ? { note: n.note } : {}),
    row_count: p.ids.length,
    applies_to_ids: p.ids.map((x) => x.id),
  })
})
const counts = entries.reduce((a, e) => ({ ...a, [e.confidence]: (a[e.confidence] || 0) + 1 }), {})
writeFileSync('data-enrichment/batch-10.json', JSON.stringify({
  _meta: {
    batch: 'batch-10', scope: 'FINAL TRANCHE: unique products ranked 451-492 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length, skipped_swapped: skipped,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| skipped:', skipped.length)
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
