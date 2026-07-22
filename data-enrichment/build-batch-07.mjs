// Builds data-enrichment/batch-07.json — products ranked 301-350 by row count.
// Same rules: compiled from general knowledge, never scraped; ungroundable
// entries ship as null pending research; SKIP for rows removed by swaps.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(300, 350)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })
const SKIP = (expect, reason) => ({ expect, skip: true, reason })

const DATA = [
  SKIP('Gucci Bloom Acqua di Fiori', 'Row removed by swap-03 (flanker discontinued); replaced by core Gucci Bloom, fully enriched.'),
  N('Guess Seductive | EDP', 'medium', ['Pear', 'Bergamot', 'Blackcurrant'], ['Jasmine', 'Orange Blossom', 'Orris Root'], ['Vanilla', 'Cashmere Wood', 'Olibanum'],
    'Juicy pear over soft white florals and vanilla. Easy, sweet and inexpensive to like.',
    'RESEARCHED against retailer listings 2026-07-21; resolved to the original 2010 Seductive (the line has many later color flankers).'),
  N('Seductive Homme Blue', 'medium', ['Cardamom', 'Black Pepper', 'Citruses'], ['Sea Notes', 'Geranium'], ['Cashmere Wood', 'Moss'],
    'Peppered citrus over a marine heart and mossy woods. A cheap, cheerful blue fragrance.',
    'RESEARCHED against retailer listings (Perfume.com, FragranceX) 2026-07-21.'),
  N('Seductive Noir', 'medium', ['Sage', 'Bergamot', 'Peony'], ['Iris', 'Jasmine Sambac', 'Lily-of-the-Valley'], ['Vanilla', 'Suede', 'Haitian Vetiver'],
    'Powdery iris and jasmine over vanilla suede. Softer and dressier than the name suggests.',
    'RESEARCHED against retailer listings 2026-07-21; resolved to the 2019 women\u2019s Seductive Noir.'),
  SKIP('Guess Effect Sport', 'Row repaired by swap-02 (fake name; real product is Guess Effect), which entered fully enriched.'),
  N('Toit', 'medium', ['Apple', 'Pear'], ['Rose', 'Basil', 'Grass'], ['Green Notes', 'Oakmoss'],
    'Crisp orchard fruit and grass on a Paris rooftop. Green, gentle and quietly witty.'),
  N('Citron Noir', 'medium', ['Citron', 'Lime', 'Lemon'], ['Black Tea'], ['Musk', 'Smoky Notes'],
    'Dark citrus over smoke and black tea. A cologne with shadows in it.',
    'Hermes publishes minimal structure for this cologne; tiering approximated. Verify against the brand page.'),
  N('Eau Tr', 'medium', ['Orange', 'Grapefruit'], ['Geranium'], ['Cedar', 'Vetiver'],
    'The Terre d Hermes mineral woods at their lightest and most citrus-forward.',
    'Eau Tres Fraiche concentration of the Terre d Hermes line; shares the DNA.'),
  N("Terre d'Herm", 'high', ['Orange', 'Grapefruit'], ['Pepper', 'Geranium', 'Flint'], ['Vetiver', 'Cedar', 'Benzoin', 'Oakmoss'],
    'Orange over flint and vetiver. Mineral, dry and one of the great modern masculines.',
    'Catalog lists EDP; Terre d Hermes ships as EDT and Parfum. Notes reflect the shared line DNA.'),
  N('H24', 'medium', ['Clary Sage'], ['Narcissus', 'Rosewood'], ['Sclarene', 'Musk'],
    'Green sage and narcissus over a warm metallic finish. Modern and deliberately synthetic in the best way.',
    'H24 ships as EDT and EDP; the catalog says Parfum, which is not a documented concentration. Notes reflect the line DNA; confirm the row.'),
  N('Merveilles', 'medium', ['Orange', 'Elemi', 'Pink Pepper'], ['Pepper', 'Ambergris'], ['Oakmoss', 'Cedar', 'Vetiver', 'Balsam Fir'],
    'Bitter orange over salty ambergris and woods. Sparkling and strange, like sea air at dusk.'),
  N('1899 Hemingway', 'medium', ['Bergamot', 'Juniper', 'Black Pepper'], ['Cinnamon', 'Orris', 'Vetiver'], ['Vanilla', 'Amber', 'Oud'],
    'Peppered citrus over cinnamon and warm amber. Literary branding, crowd-pleasing juice.',
    'Confirm the exact list against the brand page; sources vary on secondary notes.'),
  N('Hugo Woman', 'medium', ['Green Apple', 'Melon', 'Papaya', 'Peach'], ['Jasmine', 'Lily', 'Orris'], ['Sandalwood', 'Amber', 'Vanilla', 'Cedar'],
    'Crisp green fruit over soft florals and sandalwood. Bright, clean and very nineties.',
    'RESEARCHED 2026-07-21; resolved to the 1997 EDT (the 2015 EDP relaunch is a different boysenberry-and-black-tea composition).'),
  N('Hugo Man', 'medium', ['Green Apple', 'Mint', 'Lavender', 'Grapefruit', 'Basil'], ['Sage', 'Geranium', 'Carnation'], ['Fir', 'Cedar', 'Musk'],
    'Green apple and herbs over mossy woods. The backpack-bottle nineties classic, still everywhere.'),
  N('Boss The Scent | EDT', 'medium', ['Ginger', 'Mandarin'], ['Maninka Fruit', 'Lavender'], ['Leather', 'Woody Notes'],
    'Ginger and an exotic fruit note over soft leather. Smooth, deliberate and evening-coded.'),
  N('Number One', 'medium', ['Lemon', 'Bergamot', 'Apple', 'Green Notes'], ['Jasmine', 'Honey', 'Carnation'], ['Sandalwood', 'Oakmoss', 'Tobacco', 'Musk'],
    'Citrus and honey over moss and tobacco. A quietly confident eighties chypre.',
    'Confirm secondary notes; sources vary on this 1985 release.'),
  N('Boss Bottled | EDT', 'high', ['Apple', 'Plum', 'Bergamot', 'Lemon'], ['Geranium', 'Cinnamon', 'Mahogany', 'Carnation'], ['Vanilla', 'Sandalwood', 'Cedar', 'Vetiver'],
    'Apple and cinnamon over creamy sandalwood and vanilla. The default smart-casual masculine for two decades.'),
  N('Boss Bottled | Parfum', 'medium', ['Fig Leaf'], ['Orange Blossom'], ['Leather', 'Cedar'],
    'The Boss Bottled idea rebuilt darker: fig, orange blossom and leather.',
    'Parfum concentration (2022). Confirm the Parfum-specific list against the brand page.'),
  N('Bottled Night', 'medium', ['Lavender', 'Birch Leaf'], ['African Violet', 'Jasmine'], ['Woody Notes', 'Musk'],
    'Lavender and birch over dark woods. The Bottled DNA dressed for evenings.'),
  N('Absolute', 'medium', ['Ginger', 'Mandarin'], ['Maninka Fruit', 'Osmanthus'], ['Leather', 'Vetiver', 'Woody Notes'],
    'The Scent signature concentrated and roughened with vetiver.',
    'Absolute flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('The Scent | Parfum', 'medium', ['Ginger', 'Mandarin'], ['Maninka Fruit', 'Lavender'], ['Leather', 'Amber', 'Woody Notes'],
    'The Scent signature in its deepest concentration.',
    'Parfum concentration; shares the line DNA. Confirm the Parfum-specific list.'),
  N('Hugo Boss The Scent | EDT', 'medium', ['Ginger', 'Mandarin'], ['Maninka Fruit', 'Lavender'], ['Leather', 'Woody Notes'],
    'Ginger and an exotic fruit note over soft leather. Smooth, deliberate and evening-coded.',
    'DUPLICATE PRODUCT: same fragrance as the "Boss The Scent" EDT row, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('| Oud for Greatness |', 'high', ['Saffron', 'Nutmeg', 'Lavender'], ['Oud'], ['Musk', 'Patchouli'],
    'Saffron and lavender over a polished, potent oud. The modern reference oud for a reason.'),
  N('Initio Oud for Greatness', 'high', ['Saffron', 'Nutmeg', 'Lavender'], ['Oud'], ['Musk', 'Patchouli'],
    'Saffron and lavender over a polished, potent oud. The modern reference oud for a reason.',
    'DUPLICATE PRODUCT: same fragrance as the "Oud for Greatness" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N("L'Eau d'Issey pour Homme | EDT", 'high', ['Yuzu', 'Mandarin', 'Lemon', 'Tarragon', 'Cypress'], ['Nutmeg', 'Saffron', 'Blue Water Lily', 'Geranium'], ['Vetiver', 'Musk', 'Tobacco', 'Amber', 'Cedar'],
    'Yuzu and water over spiced woods. The 1994 aquatic that defined a decade of freshness.'),
  N('Homme Sport', 'medium', ['Grapefruit', 'Bergamot'], ['Nutmeg', 'Ginger'], ['Vetiver', 'Musk', 'Cedar'],
    'The Issey freshness tuned for the gym: sharper citrus, more ginger.',
    'Sport flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Homme Intense', 'medium', ['Yuzu', 'Mandarin'], ['Nutmeg', 'Saffron'], ['Amber', 'Sandalwood', 'Musk'],
    'The Issey aquatic warmed with amber and saffron.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Jaguar Classic Blue', 'medium', ['Orange', 'Juniper Berries', 'Lavender', 'Mandarin', 'Basil'], ['Ginger', 'Orange Blossom', 'Lotus'], ['Sandalwood', 'Benzoin', 'White Musk'],
    'Bright citrus and lavender over creamy sandalwood. A budget staple that consistently overdelivers.',
    'RESEARCHED against retailer listings (HNAK, The Perfume Spot, Amazon) 2026-07-21.'),
  N('Le Male | EDT', 'high', ['Mint', 'Lavender', 'Bergamot'], ['Cinnamon', 'Orange Blossom', 'Caraway'], ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Amber'],
    'Cool mint and lavender over sweet vanilla. One of the best-selling men’s fragrances ever made, and still everywhere.',
    'Same product as the swap-02 replacement row in male_sport; pyramid kept identical across all rows.'),
  N('Le Male Le Parfum', 'medium', ['Cardamom'], ['Lavender', 'Orange Blossom'], ['Vanilla', 'Oud Accord'],
    'The Le Male vanilla-lavender signature pushed richer and more resinous.',
    'Le Parfum concentration (2020). Confirm the specific list against the brand page.'),
  N('Glow', 'medium', ['Orange', 'Neroli', 'Grapefruit'], ['Rose', 'Jasmine', 'Sandalwood'], ['Musk', 'Vanilla', 'Amber'],
    'Clean soap and soft musk with a citrus glow. The fresh-out-the-shower blueprint since 2002.'),
  N('Fancy', 'medium', ['Pear', 'Apricot', 'Red Fruits'], ['Gardenia', 'Jasmine'], ['Caramel', 'Vanilla', 'Sandalwood', 'Amber'],
    'Juicy pear over gardenia and caramel. Sweet, flirty and comfortable being exactly that.'),
  N('Peony & Blush Suede', 'high', ['Red Apple'], ['Peony'], ['Suede'],
    'Crisp apple, lush peony and soft suede. One of the house’s defining trios.',
    'Jo Malone publishes colognes as note trios; tiering follows the official top/heart/base assignment.'),
  N('English Pear & Freesia', 'high', ['King William Pear'], ['Freesia'], ['Patchouli'],
    'Ripe pear and white freesia over quiet patchouli. The house’s autumn bestseller.',
    'Jo Malone publishes colognes as note trios; tiering follows the official assignment.'),
  N('Blackberry & Bay', 'high', ['Blackberry'], ['Bay Leaf'], ['Cedar'],
    'Tart blackberry brightened with green bay. Instantly likeable and very English.',
    'Jo Malone publishes colognes as note trios; tiering follows the official assignment.'),
  N('Velvet Rose & Oud | Cologne Intense', 'medium', ['Damask Rose'], ['Oud'], ['Clove'],
    'Dark rose over oud and clove. The richest, most evening-ready Jo Malone.',
    'Cologne Intense line trio.'),
  N('Velvet Rose & Oud Intense', 'medium', ['Damask Rose'], ['Oud'], ['Clove'],
    'Dark rose over oud and clove. The richest, most evening-ready Jo Malone.',
    'DUPLICATE PRODUCT: same fragrance as the "Velvet Rose & Oud" Cologne Intense row; the extra "Intense" in the name is a data artifact, as the product line is already called Cologne Intense. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Joop! Homme', 'medium', ['Orange Blossom', 'Bergamot', 'Mandarin'], ['Heliotrope', 'Jasmine', 'Cinnamon'], ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Patchouli', 'Amber'],
    'A pink tidal wave of heliotrope and vanilla. Loud, sweet and gloriously unsubtle since 1989.'),
  N('Viva La Juicy | EDT', 'high', ['Wild Berries', 'Mandarin'], ['Honeysuckle', 'Gardenia', 'Jasmine'], ['Amber', 'Caramel', 'Vanilla', 'Sandalwood', 'Praline'],
    'Juicy berries over honeysuckle and a caramel-praline base, in a lighter splash.',
    'EDT concentration; the EDP entered fully enriched via swap-02. Pyramid kept identical; confirm if the EDT differs.'),
  N('Viva La Juicy Noir', 'medium', ['Wild Berries', 'Mandarin'], ['Honeysuckle', 'Gardenia', 'Jasmine'], ['Caramel', 'Vanilla', 'Amber', 'Sandalwood'],
    'The Viva La Juicy gourmand pulled darker and muskier.',
    'Noir flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Connected', 'medium', ['Persimmon', 'Mandarin Orange', 'Red Apple', 'Violet Leaf'], ['Lemon', 'Clary Sage', 'Cardamom'], ['Mahogany', 'Driftwood', 'Tobacco', 'Oakmoss'],
    'Orchard fruit over dry driftwood and tobacco. A likeable, low-stakes daily wear.',
    'RESEARCHED against retailer listings (FragranceNet, Basenotes) 2026-07-21. Formally Connected Kenneth Cole Reaction (2011).'),
  N('Black Bold', 'medium', ['Mandarin', 'Ginger', 'Water Mint'], ['Cedar Leaf', 'Nutmeg', 'Lotus', 'Incense'], ['Suede', 'Violet Leaves', 'Musk', 'Ambergris'],
    'Cool mint and ginger over smoky woods and suede. Darker and denser than the original Black.',
    'RESEARCHED against retailer listings (Perfumania, Kenneth Cole, Basenotes) 2026-07-21. Distinct from the 2003 Kenneth Cole Black.'),
  N('Reaction', 'medium', ['Melon', 'Lime', 'Mandarin'], ['Green Apple', 'Cucumber'], ['Musk', 'Cedar', 'Amber'],
    'Melon and lime over clean musk. An easy, inoffensive early-2000s fresh scent.'),
  N('Flower by Kenzo | EDT', 'medium', ['Blackcurrant', 'Mandarin'], ['Rose', 'Violet', 'Hawthorn'], ['White Musk', 'Vanilla', 'Opoponax'],
    'A powdery poppy-inspired floral over soft vanilla musk. Gentle and instantly recognisable.'),
  N('Kenzo Flower | EDT', 'medium', ['Blackcurrant', 'Mandarin'], ['Rose', 'Violet', 'Hawthorn'], ['White Musk', 'Vanilla', 'Opoponax'],
    'A powdery poppy-inspired floral over soft vanilla musk. Gentle and instantly recognisable.',
    'DUPLICATE PRODUCT: same fragrance as the "Flower by Kenzo" EDT row, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Kenzo Flower | EDP', 'medium', ['Blackcurrant', 'Mandarin'], ['Rose', 'Violet', 'Hawthorn'], ['White Musk', 'Vanilla', 'Opoponax'],
    'The Flower powdery-poppy signature in a deeper concentration.',
    'EDP concentration of the Flower EDT rows; shares the composition.'),
  N('Eau de Lacoste Pour Femme', 'medium', ['Freesia', 'Apple Blossom', 'Pepper'], ['Jasmine', 'Rose', 'Violet'], ['Cedar', 'Amber', 'Musk'],
    'Soft florals with a peppery edge over clean woods. Understated and office-perfect.',
    'Confirm against a retailer page; sources vary on secondary notes.'),
  N('Fra\\356che', 'medium', ['Grapefruit', 'Yellow Mandarin', 'Pink Pepper'], ['Water Notes', 'Magnolia', 'Egyptian Jasmine'], ['Musk', 'Patchouli'],
    'Watery citrus and magnolia over clean musk. Light, aquatic and made for hot days.',
    'RESEARCHED 2026-07-21; formally Eau de Lacoste L.12.12 Pour Elle Eau Fraiche (2018).'),
  SKIP('Energetic', 'CONFIRMED FAKE NAME (verified 2026-07-21): the L.12.12 Pour Elle line is Sparkling/Elegant/Natural/Magnetic/French Panache; no Energetic exists. Repaired via swap-05 to Sparkling (currently sold on lacoste.com), which enters fully enriched.'),
  N('L.12.12 Noir', 'medium', ['Watermelon'], ['Basil', 'Lavender', 'Verbena'], ['Dark Chocolate', 'Cashmeran', 'Patchouli', 'Coumarin'],
    'Watermelon and herbs over dark chocolate. Stranger and more interesting than the polo-shirt bottle admits.',
    'RESEARCHED against retailer listings (Fragrance Outlet, Perfumebox) 2026-07-21.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 301}: expected "${DATA[i].expect}" in "${hay}"`)
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
writeFileSync('data-enrichment/batch-07.json', JSON.stringify({
  _meta: {
    batch: 'batch-07', scope: 'Unique products ranked 301-350 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length, skipped_swapped: skipped,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| skipped:', skipped.length)
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
