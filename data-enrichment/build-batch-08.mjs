// Builds data-enrichment/batch-08.json — products ranked 351-400 by row count.
// Same rules: compiled from general knowledge, never scraped; ungroundable
// entries ship as null pending research; SKIP for rows removed by swaps.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(350, 400)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })
const SKIP = (expect, reason) => ({ expect, skip: true, reason })

const DATA = [
  N('Essential Sport', 'medium', ['Grapefruit', 'Bergamot', 'Ginger'], ['Water Notes', 'Juniper', 'Geranium', 'Nutmeg'], ['Vetiver', 'Musk', 'Patchouli'],
    'Grapefruit and ginger over watery greens and vetiver. Brisk and gym-bag simple.',
    'RESEARCHED against retailer listings (Fragplace, Basenotes) 2026-07-21.'),
  N("Belle L'", 'medium', ['Bergamot', 'Mandarin'], ['Orange Blossom', 'Jasmine'], ['White Musk', 'Praline'],
    'The La Vie Est Belle sweetness lifted with orange blossom and light musk.',
    'L Eclat flanker. Shares the line DNA; confirm the flanker-specific list. NOTE: the catalog name string contains literal corrupt bytes (backslash-311 for the E-acute), same PDF-extraction disease as the fake names; a Stage A0 candidate for text repair.'),
  N('Tresor', 'medium', ['Peach', 'Apricot Blossom', 'Rose'], ['Rose', 'Heliotrope', 'Iris'], ['Sandalwood', 'Vanilla', 'Musk', 'Amber'],
    'Peach and rose over powdery sandalwood. A soft-focus classic worn for three decades.'),
  N('Id\\364le | EDP', 'high', ['Pear', 'Bergamot'], ['Rose', 'Jasmine'], ['White Musk', 'Vanilla', 'Cedar'],
    'A weightless modern rose over clean musk. Minimal, radiant and hugely successful.'),
  N('Hypn\\364se', 'medium', ['Passion Flower'], ['Jasmine', 'Gardenia'], ['Vanilla', 'Vetiver'],
    'Creamy vanilla under soft white florals. Cozy and quietly seductive.'),
  N('Id\\364le Aura', 'medium', ['Bergamot', 'Pink Pepper'], ['Rose', 'Jasmine'], ['Vanilla', 'Musk', 'Sandalwood'],
    'The Idole rose warmed with vanilla and a salty glow.',
    'Aura flanker (2021, confirmed NOT discontinued by Lancome). Confirm the flanker-specific list.'),
  N('Nectar', 'medium', ['Pear', 'Bergamot'], ['Rose'], ['Vanilla', 'Tonka Bean', 'Musk'],
    'The Idole rose whipped into a sweeter, creamier register.',
    'Nectar flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Id\\364le | EDT', 'medium', ['Pear', 'Bergamot'], ['Rose', 'Jasmine'], ['White Musk', 'Vanilla', 'Cedar'],
    'The Idole clean rose in a lighter register.',
    'Idole ships as EDP and flankers; an EDT is not a documented concentration. Notes reflect the line DNA; confirm what this row is.'),
  N('Lanc\\364me La Vie Est Belle', 'high', ['Blackcurrant', 'Pear'], ['Iris', 'Jasmine', 'Orange Blossom'], ['Praline', 'Vanilla', 'Patchouli', 'Tonka Bean'],
    'A sweet gourmand centered on praline and iris, softened by tonka and vanilla.',
    'DUPLICATE PRODUCT: same fragrance as the "La Vie Est Belle" row enriched in batch-01, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Ylang 49', 'medium', ['Ylang-Ylang'], ['Gardenia', 'Oakmoss'], ['Patchouli', 'Vetiver', 'Sandalwood', 'Benzoin'],
    'A mossy white-floral chypre, deep green and slightly retro.'),
  SKIP('Rose 31 Intense', 'Row repaired by swap-03 (fake name; real product Rose 31), which entered fully enriched.'),
  SKIP('Citron 28', 'Row removed by swap-03 (Seoul city exclusive, fails availability standard); replaced by Another 13, fully enriched.'),
  N('The Noir 29', 'medium', ['Bergamot', 'Fig'], ['Bay Leaf', 'Black Tea'], ['Hay', 'Tobacco', 'Musk', 'Cedar'],
    'Black tea, fig and hay. Dry, smoky and quietly addictive.'),
  N('Lolita Lempicka', 'medium', ['Ivy', 'Anise'], ['Licorice', 'Violet', 'Amarena Cherry'], ['Tonka Bean', 'Vanilla', 'Musk', 'Praline'],
    'Anise and licorice over vanilla praline. A fairy-tale gourmand that predates the trend.'),
  N('Spell on You', 'high', ['Violet', 'Tuscan Iris', 'Green Notes'], ['Iris', 'Rose', 'Chinese Jasmine'], ['Acacia', 'Peach', 'White Musk'],
    'Powdery iris and violet over a soft peach-musk glow. Delicate and deliberately seductive.',
    'RESEARCHED against the OFFICIAL Louis Vuitton product page (us.louisvuitton.com) 2026-07-21.'),
  N('Au Hasard', 'high', ['Bergamot', 'Lemon', 'Aldehydes'], ['Pear', 'Cardamom', 'Freesia', 'Neroli'], ['Sandalwood', 'Ambrette', 'Musk', 'Leather', 'Cashmeran'],
    'Exceptional sandalwood grafted with pear liqueur and cottony musk. Quietly luxurious.',
    'RESEARCHED against the OFFICIAL Louis Vuitton product page (eu.louisvuitton.com) 2026-07-21.'),
  N('Flower Market | EDP', 'medium', ['Green Notes', 'Freesia'], ['Rose', 'Tuberose', 'Jasmine'], ['Cedar', 'Musk'],
    'Cut stems and fresh florals, like burying your face in a market bouquet.',
    'Flower Market is formally an EDT; this EDP row is a concentration oddity. Notes reflect the product; on the brand US site the product sits in the discontinued section but remains deeply stocked (watch list).'),
  N('On A Date', 'medium', ['Pink Pepper', 'Bergamot'], ['Grape', 'Rose'], ['Oak', 'Musk'],
    'Grape and rose over oak, like an aperitivo hour. Confirm the list against the brand page.',
    'Sources are thin on this 2020 release; pyramid flagged for verification.'),
  N('Flower Market | EDT', 'medium', ['Green Notes', 'Freesia'], ['Rose', 'Tuberose', 'Jasmine'], ['Cedar', 'Musk'],
    'Cut stems and fresh florals, like burying your face in a market bouquet.',
    'The formal EDT concentration; same product as the EDP row above. Watch list per the brand-site discontinued flag.'),
  N('Springtime in a Park', 'medium', ['Pear', 'Bergamot'], ['Lily-of-the-Valley', 'Rose'], ['White Musk', 'Blond Woods'],
    'Pear and dewy florals over clean musk. Gentle, green and optimistic.',
    'Confirm the list against the brand page.'),
  N('Replica Under the Lemon Trees', 'medium', ['Lemon', 'Mandarin'], ['Petitgrain', 'Neroli'], ['Musk', 'Woody Notes'],
    'Shaded citrus and neroli, more dappled light than beach heat.',
    'Confirm the list against the brand page.'),
  SKIP('Flower Market Night', 'Row repaired by swap-03 (fake name); replaced by Replica Bubble Bath, fully enriched.'),
  N('Margiela Replica Under the Lemon Trees', 'medium', ['Lemon', 'Mandarin'], ['Petitgrain', 'Neroli'], ['Musk', 'Woody Notes'],
    'Shaded citrus and neroli, more dappled light than beach heat.',
    'DUPLICATE PRODUCT: same fragrance as the "Replica Under the Lemon Trees" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Matcha Meditation', 'medium', ['Bergamot'], ['Matcha Tea', 'Jasmine'], ['White Chocolate', 'Musk'],
    'Green matcha sweetened with white chocolate. Calm, creamy and modern.',
    'Confirm the list against the brand page.'),
  N('Replica Jazz Club | EDT', 'high', ['Pink Pepper', 'Neroli', 'Lemon'], ['Rum', 'Clary Sage', 'Vanilla'], ['Tobacco Leaf', 'Vetiver', 'Styrax', 'Benzoin'],
    'Boozy rum and sweet tobacco in a wood-panelled room. Warm, smoky and very easy to like.',
    'DUPLICATE PRODUCT: same fragrance as the Jazz Club EDT enriched in batch-02, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Replica Beach Walk', 'high', ['Bergamot', 'Pink Pepper', 'Lemon'], ['Coconut Milk', 'Ylang-Ylang', 'Heliotrope'], ['Musk', 'Cedar', 'Benzoin'],
    'Coconut milk and warm skin over soft musk. Smells like sunscreen on a hot beach, in the best way.',
    'DUPLICATE PRODUCT: same fragrance as the Beach Walk enriched in batch-02, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Replica Sailing Day', 'medium', ['Sea Salt', 'Coriander', 'Bergamot'], ['Seaweed', 'Juniper'], ['Musk', 'Ambrette'],
    'Salt spray and wet rope over clean musk. Bracing and genuinely maritime.',
    'DUPLICATE PRODUCT: same fragrance as the Sailing Day enriched in batch-03, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Daisy Dream', 'medium', ['Blackberry', 'Grapefruit', 'Pear'], ['Jasmine', 'Lychee', 'Blue Wisteria'], ['White Woods', 'Musk', 'Coconut Water'],
    'Airy berries and wisteria over watery coconut. The dreamiest, lightest Daisy.'),
  N('Daisy | EDP', 'high', ['Strawberry', 'Violet Leaves', 'Red Grapefruit'], ['Violet', 'Gardenia', 'Jasmine'], ['Musk', 'Vanilla', 'White Woods'],
    'Strawberry and violet over soft musk. The charm-bracelet classic of the 2000s.',
    'Daisy is formally an EDT; this EDP row is a concentration oddity. Notes reflect the core product.'),
  N('Daisy | EDT', 'high', ['Strawberry', 'Violet Leaves', 'Red Grapefruit'], ['Violet', 'Gardenia', 'Jasmine'], ['Musk', 'Vanilla', 'White Woods'],
    'Strawberry and violet over soft musk. The charm-bracelet classic of the 2000s.'),
  N('Daisy Love', 'medium', ['Cloudberries'], ['Daisy Tree Petals'], ['Driftwood', 'Cashmere Musk'],
    'Sugared cloudberries over driftwood. Sweet and beachy, softer than the original.',
    'Daisy Love is formally an EDT; catalog lists EDP. Notes reflect the core product.'),
  N('Eau So Fresh', 'medium', ['Raspberry', 'Grapefruit', 'Pear'], ['Violet', 'Rose', 'Apple Blossom'], ['Musk', 'Cedar', 'Plum'],
    'A fruitier, fizzier Daisy with raspberry up top.'),
  N('Honey', 'medium', ['Pear', 'Mandarin'], ['Orange Blossom', 'Peach', 'Honeysuckle'], ['Honey', 'Vanilla', 'Woody Notes'],
    'Golden honeysuckle and honey over soft vanilla. Sunny and easygoing.'),
  N('Legend Spirit', 'medium', ['Bergamot', 'Grapefruit', 'Pink Pepper'], ['Lavender', 'Cardamom', 'Aquatic Notes'], ['White Musk', 'Cashmere Wood', 'Oakmoss'],
    'The Legend fougere washed brighter and cleaner. Easy to wear anywhere.'),
  N('Legend Night', 'medium', ['Bergamot', 'Mint'], ['Lavender', 'Clary Sage', 'Apple'], ['Tonka Bean', 'Vanilla', 'Woody Notes'],
    'The Legend DNA darkened for evenings.',
    'Night flanker. Confirm the flanker-specific list against the brand page.'),
  SKIP('Individuel', 'Row removed by cut-audit-01 (discontinued); replaced by Montblanc Legend, fully enriched.'),
  N('Ultra Blue', 'medium', ['Sicilian Bergamot', 'Marine Accord'], ['Sea Salt', 'Exotic Woods'], ['Patchouli', 'Leather'],
    'The Explorer format pushed aquatic: salt, bergamot and woods.',
    'Confirm the list against the brand page.'),
  N('Mont Blanc Explorer | EDP', 'medium', ['Bergamot', 'Pink Pepper', 'Clary Sage'], ['Vetiver', 'Leather'], ['Patchouli', 'Ambroxan', 'Cacao'],
    'Bergamot and vetiver over ambroxan and a touch of cacao. Clean, modern and very wearable.',
    'DUPLICATE PRODUCT: same fragrance as the "Montblanc Explorer" row enriched in batch-02, listed twice due to a spacing variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Toy 2', 'medium', ['Green Apple', 'Mandarin', 'Magnolia'], ['Peony', 'Jasmine'], ['Musk', 'Amberwood', 'Sandalwood'],
    'Apple and peony in a teddy-bear bottle. Clean, fruity and fun.',
    'Confirm secondary notes against the brand page.'),
  N('| For Her | EDP', 'medium', ['Rose', 'Peach'], ['Musk'], ['Patchouli', 'Amber'],
    'An enveloping musk dressed with rose and peach. The modern musk benchmark.'),
  N('For Her | Parfum', 'medium', ['Rose', 'Peach'], ['Musk'], ['Patchouli', 'Amber', 'Vanilla'],
    'The For Her musk in a denser, warmer register.',
    'The For Her line ships as EDT/EDP plus named flankers; a plain Parfum is not standard. Notes reflect the line DNA; confirm what this row is.'),
  N('for Him Bleu', 'medium', ['Nutmeg', 'Cardamom'], ['Suede', 'Iris'], ['Vanilla', 'Woody Notes'],
    'Spiced suede and iris over soft vanilla. Smooth, dark and understated.',
    'Resolved to Bleu Noir EDP. Confirm the concentration-specific list.'),
  N('Musc Noir', 'medium', ['Plum'], ['Rose', 'Musk'], ['Suede', 'Vanilla'],
    'The For Her musk pulled darker with plum and suede.',
    'Confirm the list against the brand page.'),
  SKIP('Voyage Pour Elle', 'CONFIRMED FAKE NAME (verified 2026-07-21): no Nautica Voyage Pour Elle exists; the real women\u2019s product is Nautica My Voyage (2007). Repaired via swap-06, which enters fully enriched.'),
  N('Nautica Blue', 'medium', ['Pineapple', 'Bergamot', 'Peach'], ['Water Lily', 'Jasmine'], ['Sandalwood', 'Musk', 'Cedar'],
    'Pineapple and water lily over clean woods. A five-dollar sea breeze that keeps its promise.',
    'RESEARCHED against retailer listings (Nautica.com, Fragrance Outlet, Le Parfumier) 2026-07-21.'),
  N('| Nina |', 'medium', ['Lime', 'Lemon'], ['Toffee Apple', 'Peony', 'Moonflower'], ['Musk', 'Vanilla', 'Apple Tree'],
    'Candy apple and citrus over soft vanilla. A modern fairy tale in a red-apple bottle.'),
  N('Olymp\\351a Intense', 'medium', ['Water Jasmine', 'Green Mandarin'], ['Salted Vanilla', 'Ginger Flower'], ['Sandalwood', 'Cashmere Wood', 'Ambergris', 'Amber'],
    'The salted-vanilla Olympea signature pushed deeper and warmer.',
    'Intense flanker. Shares the line DNA; confirm the flanker-specific list.'),
  N('Fame', 'medium', ['Mango', 'Bergamot'], ['Jasmine'], ['Vanilla', 'Incense'],
    'Juicy mango over jasmine, vanilla and a curl of incense. A current bestseller.'),
  N('Olymp\\351a | Parfum', 'medium', ['Water Jasmine', 'Green Mandarin'], ['Salted Vanilla', 'Ginger Flower'], ['Sandalwood', 'Cashmere Wood', 'Ambergris'],
    'The Olympea signature in its richest concentration.',
    'Parfum concentration; the EDP and EDT are separate catalog rows. Confirm the Parfum-specific list.'),
  N('Pure XS | EDT', 'medium', ['Ginger', 'Thyme', 'Bergamot'], ['Vanilla', 'Cinnamon', 'Apple'], ['Sugar Cane', 'Cashmere Wood', 'Myrrh'],
    'Ginger fizz over warm vanilla and sugar. Playful, sweet and built to be noticed.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  const exp = DATA[i].expect.replace(/\\(\d{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
  if (!hay.includes(exp)) bad.push(`rank ${i + 351}: expected "${exp}" in "${hay}"`)
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
writeFileSync('data-enrichment/batch-08.json', JSON.stringify({
  _meta: {
    batch: 'batch-08', scope: 'Unique products ranked 351-400 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length, skipped_swapped: skipped,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| skipped:', skipped.length)
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
