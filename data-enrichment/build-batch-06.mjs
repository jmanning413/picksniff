// Builds data-enrichment/batch-06.json — products ranked 251-300 by row count.
// Same rules: compiled from general knowledge, never scraped; ungroundable
// entries ship as null pending research. NEW: SKIP marker for manifest
// products whose catalog rows were removed by the cut-audit swaps.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(250, 300)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })
const SKIP = (expect, reason) => ({ expect, skip: true, reason })

const DATA = [
  N('Gabbana Light Blue Eau Intense', 'high', ['Sicilian Lemon', 'Granny Smith Apple'], ['Marigold', 'Jasmine'], ['Amberwood', 'Musk'],
    'The Light Blue citrus sharpened and deepened with amberwood. Brighter opening, warmer finish.',
    'DUPLICATE PRODUCT: same fragrance as the "Light Blue Eau Intense" row enriched in batch-05, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('The One for Men', 'high', ['Grapefruit', 'Coriander', 'Basil'], ['Cardamom', 'Ginger', 'Orange Blossom'], ['Tobacco', 'Cedar', 'Amber'],
    'Warm tobacco and spice under a bright citrus opening. Smooth, mature and built for evenings.'),
  N('Gabbana Pour Homme', 'medium', ['Bergamot', 'Mandarin', 'Neroli'], ['Lavender', 'Sage', 'Pepper'], ['Tobacco', 'Cedar', 'Tonka Bean'],
    'A classic barbershop citrus-lavender over tobacco and cedar. Traditional in the best sense.'),
  N('Light Blue Forever', 'medium', ['Grapefruit', 'Bergamot'], ['Violet Leaf', 'Jasmine'], ['White Musk', 'Patchouli', 'Amberwood'],
    'The Light Blue idea rendered cleaner and more transparent, with a musky finish.',
    'Forever flanker (2021). Shares the line DNA; confirm the flanker-specific list.'),
  N('Gabbana Light Blue | EDT', 'high', ['Sicilian Lemon', 'Apple', 'Cedar', 'Bluebell'], ['Bamboo', 'Jasmine', 'White Rose'], ['Cedar', 'Musk', 'Amber'],
    'Crisp Sicilian lemon and green apple over a soft cedar base. A sun-on-skin summer staple.',
    'DUPLICATE PRODUCT: same fragrance as the "Light Blue" row enriched in batch-01, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Gabbana The One | EDT', 'medium', ['Bergamot', 'Mandarin', 'Lychee', 'Peach'], ['Madonna Lily', 'Lily-of-the-Valley', 'Jasmine'], ['Vanilla', 'Amber', 'Musk', 'Vetiver'],
    'Golden fruit and lily over warm vanilla amber. Polished and glamorous without shouting.',
    'Resolved to the women’s The One EDT (2011). Confirm which The One this row carries.'),
  N('Cashmere Mist', 'medium', ['Lily-of-the-Valley', 'Suede', 'Bergamot'], ['Jasmine', 'Ylang-Ylang'], ['Sandalwood', 'Musk', 'Amber', 'Vanilla'],
    'Powdery suede and soft florals over skin musk. A quiet signature scent worn by millions.'),
  SKIP('Dunhill Icon', 'Row removed by cut-audit-01 (Dunhill license expired 2023); replaced by Prada Luna Rossa Ocean, which entered fully enriched.'),
  SKIP('Dunhill Century', 'Row removed by cut-audit-01; replaced by Carolina Herrera 212 VIP Black, which entered fully enriched.'),
  N('Desire Blue', 'medium', ['Litchi', 'Mandarin Orange', 'Lotus', 'Bergamot'], ['Sea Notes', 'Orange', 'Brazilian Rosewood'], ['Tonka Bean', 'Musk', 'Amber', 'Benzoin'],
    'Watery fruit and sea air over warm tonka and amber. An easygoing early-2000s fresh scent.',
    'RESEARCHED against retailer listings (Fragrance Outlet, HNAK, PriceRiteMart) 2026-07-21. Borderline-keep row: discontinued license but deep discounter stock.'),
  N('Green Tea', 'medium', ['Lemon', 'Bergamot', 'Mint', 'Orange Peel'], ['Green Tea', 'Jasmine', 'Carnation', 'Fennel'], ['Musk', 'Amber', 'Oakmoss'],
    'Bitter green tea over bright citrus and clean musk. A warm-weather staple for almost thirty years.'),
  N('Untold Absolu', 'high', ['Plum', 'Raspberry', 'Ginger', 'Bergamot'], ['Egyptian Jasmine', 'Narcissus'], ['Tahitian Vanilla', 'Tonka Bean', 'Benzoin', 'Cashmere Wood'],
    'Dark fruit and jasmine over a rich vanilla base. Discontinued once, relaunched by demand.',
    'RESEARCHED against retailer listings 2026-07-21 during the availability audit; product was relaunched after a discontinuation gap.'),
  N('Intensely', 'medium', ['Pink Pepper', 'Violet Leaf'], ['Lavender', 'Toffee', 'Sage'], ['Vanilla', 'Tonka Bean', 'Amber'],
    'The Stronger With You warmth pushed sweeter, with a toffee heart.',
    'Intensely flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Stronger With You | EDP', 'high', ['Cardamom', 'Pink Pepper', 'Violet Leaves'], ['Sage', 'Lavender'], ['Chestnut', 'Vanilla', 'Amberwood', 'Cedar'],
    'Spiced sweetness over roasted chestnut and vanilla. A modern crowd-pleaser with real warmth.'),
  SKIP('Island Kiss', 'Row removed by cut-audit-01 (dead limited edition); replaced by Tommy Girl, which entered fully enriched.'),
  SKIP('Sorbetto Rosso', 'Row removed by cut-audit-01 (dead limited edition); replaced by Ralph, which entered fully enriched.'),
  N('Pleasures | EDP', 'medium', ['White Lily', 'Violet Leaves', 'Green Notes'], ['Peony', 'Lilac', 'Jasmine'], ['Sandalwood', 'Patchouli', 'Musk'],
    'Dewy florals with a clean green edge. Fresh-from-the-shower polish, endlessly reliable.'),
  N('Knowing', 'medium', ['Rose', 'Plum', 'Aldehydes'], ['Jasmine', 'Patchouli', 'Orris'], ['Oakmoss', 'Amber', 'Sandalwood', 'Civet'],
    'A mossy rose chypre from 1988. Deep, formal and unapologetically grown-up.'),
  N('Beautiful', 'medium', ['Rose', 'Mandarin', 'Lily'], ['Tuberose', 'Jasmine', 'Ylang-Ylang', 'Marigold'], ['Sandalwood', 'Vetiver', 'Musk', 'Amber'],
    'A grand floral bouquet built around rose and tuberose. A wedding-day classic for four decades.'),
  N('White Linen', 'medium', ['Aldehydes', 'Citrus', 'Peach'], ['Rose', 'Jasmine', 'Lily-of-the-Valley'], ['Cedar', 'Oakmoss', 'Amber', 'Musk'],
    'Crisp aldehydes over rose and clean woods. Smells like pressed sheets and daylight.'),
  N('Pleasures | EDT', 'medium', ['White Lily', 'Violet Leaves', 'Green Notes'], ['Peony', 'Lilac', 'Jasmine'], ['Sandalwood', 'Patchouli', 'Musk'],
    'The Pleasures dewy-floral signature in a lighter splash.',
    'EDT concentration of the Pleasures EDP row; shares the composition.'),
  SKIP('Signorina Uomo', 'CONFIRMED FAKE NAME (verified 2026-07-21): no Signorina Uomo exists; Signorina is women-only. Row sits in a MALE pool with Woody/Amber/Aromatic accords, matching Uomo Salvatore Ferragamo (2016). Repaired via swap-04, which enters fully enriched.'),
  N('Portrait of a Lady', 'high', ['Turkish Rose', 'Raspberry', 'Blackcurrant', 'Cinnamon', 'Clove'], ['Rose', 'Patchouli'], ['Patchouli', 'Sandalwood', 'Incense', 'Ambroxan', 'Benzoin', 'Musk'],
    'An enormous rose over dark patchouli and incense. One of the most acclaimed perfumes of the century.'),
  SKIP('Portrait of a Lady Intense', 'CONFIRMED FAKE NAME (verified 2026-07-21): no Intense exists in the Malle line. Renamed to plain Portrait of a Lady via swap-04 (no duplicate in that pool), entering fully enriched.'),
  N('Une Fleur de Cassie', 'medium', ['Mimosa', 'Cassie', 'Bergamot'], ['Rose', 'Jasmine', 'Violet'], ['Sandalwood', 'Musk', 'Vanilla'],
    'Powdery mimosa and cassie over soft sandalwood. Delicate, strange and quietly beautiful.'),
  N('Musc Ravageur', 'high', ['Lavender', 'Bergamot'], ['Cinnamon', 'Clove'], ['Vanilla', 'Tonka Bean', 'Musk', 'Amber', 'Sandalwood', 'Cedar'],
    'Spiced vanilla and musk with almost no flowers. Warm, animalic and famously seductive.'),
  N('Si Passione', 'medium', ['Blackcurrant', 'Pear', 'Pink Pepper'], ['Rose', 'Jasmine', 'Heliotrope'], ['Vanilla', 'Cedar', 'Amberwood'],
    'The Si blackcurrant turned up and sweetened. Bold, fruity and made for nights out.'),
  N('My Way', 'medium', ['Orange Blossom', 'Bergamot'], ['Tuberose', 'Jasmine'], ['Vanilla', 'White Musk', 'Cedar'],
    'Bright orange blossom and tuberose over creamy vanilla. Modern, clean and widely loved.'),
  N('S\\354 Passione', 'medium', ['Blackcurrant', 'Pear', 'Pink Pepper'], ['Rose', 'Jasmine', 'Heliotrope'], ['Vanilla', 'Cedar', 'Amberwood'],
    'The Si blackcurrant turned up and sweetened. Bold, fruity and made for nights out.',
    'DUPLICATE PRODUCT: same fragrance as the "Si Passione" row, listed twice due to an accent-encoding variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Fiori', 'medium', ['Blackcurrant', 'Green Mandarin'], ['Neroli', 'Rose'], ['Vanilla', 'Patchouli', 'Musk'],
    'The Si idea brightened with neroli and green mandarin. Fresher and more floral than its siblings.',
    'Si Fiori flanker (2019). Shares the line DNA; confirm the flanker-specific list and current availability.'),
  N('Acqua di Gioia | EDT', 'medium', ['Mint', 'Lemon', 'Pink Pepper'], ['Jasmine', 'Peony', 'Aquatic Notes'], ['Labdanum', 'Cedar', 'Brown Sugar'],
    'The Acqua di Gioia water-and-mint idea in a lighter splash.',
    'EDT concentration; the EDP was enriched in batch-03. Shares the composition.'),
  N('| Si | EDT', 'medium', ['Blackcurrant', 'Bergamot', 'Mandarin'], ['Rose', 'Freesia', 'May Rose'], ['Vanilla', 'Patchouli', 'Amberwood', 'Musk'],
    'The Si chypre signature in a brighter, lighter register.',
    'EDT concentration; the EDP was enriched in batch-03. Shares the composition.'),
  N('Code Absolu', 'medium', ['Green Apple', 'Bergamot', 'Mandarin'], ['Orange Blossom', 'Nutmeg'], ['Tonka Bean', 'Vanilla', 'Suede'],
    'The Code sweetness wrapped in apple and suede. Smooth, dense and evening-coded.'),
  N('Armani Code | Parfum', 'medium', ['Bergamot', 'Green Mandarin'], ['Orange Blossom', 'Clary Sage'], ['Tonka Bean', 'Cedar', 'Vetiver'],
    'The modern Code pillar: citrus and orange blossom over a woody tonka base.',
    'Parfum concentration (2022 relaunch pillar). Confirm the Parfum-specific list against the brand page.'),
  N('Profumo', 'high', ['Bergamot', 'Sea Notes'], ['Rosemary', 'Sage', 'Geranium'], ['Incense', 'Patchouli'],
    'The Acqua di Giò sea breeze deepened with incense and patchouli. Darker, smokier and widely considered the best of the line.',
    'Same product as the swap-02 replacement rows; pyramid kept identical across all rows.'),
  N("L'Interdit | EDP", 'high', ['Pear', 'Bergamot'], ['Orange Blossom', 'Jasmine', 'Tuberose'], ['Vetiver', 'Patchouli', 'Ambroxan'],
    'White flowers over a dark vetiver undercurrent. Elegant with a deliberate edge.'),
  N("L'Interdit Intense", 'medium', ['Pear', 'Blackcurrant'], ['Orange Blossom', 'Jasmine', 'Tuberose'], ['Sandalwood', 'Vetiver', 'Vanilla'],
    'The L’Interdit white-floral dna pushed creamier and deeper.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N("L'Interdit Rouge", 'medium', ['Blood Orange', 'Ginger'], ['Tuberose', 'Jasmine'], ['Patchouli', 'Vanilla', 'Amberwood'],
    'The L’Interdit florals set against spiced orange and warm woods.',
    'Rouge flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Gentleman | EDT', 'medium', ['Pear', 'Cardamom'], ['Lavender', 'Iris'], ['Leather', 'Patchouli', 'Black Vanilla'],
    'Powdery iris and lavender over leather and dark vanilla. Soft-spoken and modern.'),
  N('Reserve Priv', 'medium', ['Whisky Accord', 'Bergamot'], ['Iris', 'Orange Blossom'], ['Oak', 'Patchouli', 'Vanilla'],
    'A whisky-and-oak reading of the Gentleman iris. Warm, boozy and refined.',
    'Reserve Privee flanker. Confirm the flanker-specific list against the brand page.'),
  N('Bois', 'medium', ['Clary Sage', 'Cardamom'], ['Iris', 'Cypress'], ['Sandalwood', 'Patchouli', 'Vanilla'],
    'The Gentleman iris grounded in dry woods. The most versatile of the line.',
    'Boisee flanker (2020). Confirm the flanker-specific list against the brand page.'),
  N("Givenchy L'Interdit | EDP", 'high', ['Pear', 'Bergamot'], ['Orange Blossom', 'Jasmine', 'Tuberose'], ['Vetiver', 'Patchouli', 'Ambroxan'],
    'White flowers over a dark vetiver undercurrent. Elegant with a deliberate edge.',
    'DUPLICATE PRODUCT: same fragrance as the "L’Interdit" EDP row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N("Givenchy L'Interdit Rouge", 'medium', ['Blood Orange', 'Ginger'], ['Tuberose', 'Jasmine'], ['Patchouli', 'Vanilla', 'Amberwood'],
    'The L’Interdit florals set against spiced orange and warm woods.',
    'DUPLICATE PRODUCT: same fragrance as the "L’Interdit Rouge" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Amarige', 'medium', ['Violet', 'Mandarin', 'Peach', 'Plum'], ['Gardenia', 'Tuberose', 'Ylang-Ylang', 'Mimosa'], ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Amber'],
    'An exuberant white-floral wall of tuberose and gardenia. Loud, joyful and unmistakable.'),
  N('Flora Gorgeous Gardenia', 'high', ['Pear Blossom'], ['Gardenia', 'Frangipani'], ['Patchouli', 'Brown Sugar'],
    'Creamy gardenia over brown sugar. Sweet, sunny and a current bestseller.'),
  N('| Bloom | EDP', 'medium', ['Jasmine Bud'], ['Tuberose', 'Rangoon Creeper'], ['Orris Root', 'Sandalwood'],
    'A lush white-floral built on tuberose and jasmine. The core Bloom, a current pillar that sells year after year.',
    'Same product as the swap-03 replacement rows; pyramid kept identical across all rows. Gucci publishes Bloom as a floral trio; base notes flagged for verification.'),
  N('Gorgeous Magnolia', 'medium', ['Dewberry'], ['Magnolia', 'Jasmine'], ['Patchouli', 'Warm Musk'],
    'Juicy dewberry over creamy magnolia. Bright, modern and easy to love.',
    'Flora flanker (2022). Confirm the flanker-specific list against the brand page.'),
  N('| Guilty | EDP', 'medium', ['Mandarin', 'Pink Pepper', 'Bergamot'], ['Lilac', 'Geranium', 'Peach'], ['Patchouli', 'Amber', 'Vanilla'],
    'Lilac and warm amber with a peachy glow. Confident and a little rebellious.',
    'Resolved to the women’s Guilty EDP. Confirm which Guilty this row carries.'),
  SKIP('Bloom Acqua di Fiori | EDT', 'Row removed by swap-03 (flanker discontinued); replaced by core Gucci Bloom, which entered fully enriched.'),
  N('Gucci Guilty | EDP', 'medium', ['Mandarin', 'Pink Pepper', 'Bergamot'], ['Lilac', 'Geranium', 'Peach'], ['Patchouli', 'Amber', 'Vanilla'],
    'Lilac and warm amber with a peachy glow. Confident and a little rebellious.',
    'DUPLICATE PRODUCT: same fragrance as the "Guilty" EDP row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 251}: expected "${DATA[i].expect}" in "${hay}"`)
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
writeFileSync('data-enrichment/batch-06.json', JSON.stringify({
  _meta: {
    batch: 'batch-06', scope: 'Unique products ranked 251-300 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length, skipped_swapped: skipped,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| skipped (cut rows):', skipped.length)
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
