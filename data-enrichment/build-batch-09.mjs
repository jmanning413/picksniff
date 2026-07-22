// Builds data-enrichment/batch-09.json — products ranked 401-450 by row count.
// Same rules: compiled from general knowledge, never scraped; ungroundable
// entries ship as null pending research; SKIP for rows removed by swaps.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(400, 450)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })
const SKIP = (expect, reason) => ({ expect, skip: true, reason })

const DATA = [
  N('Phantom | EDT', 'medium', ['Lemon', 'Lavender'], ['Lavender', 'Vanilla'], ['Patchouli', 'Vetiver'],
    'Clean lavender and lemon over sweet vanilla and patchouli.',
    'Phantom is formally an EDP (enriched in batch-03); this EDT row is a concentration oddity. Notes reflect the core product.'),
  N('1 Million Royal', 'medium', ['Green Apple', 'Blood Mandarin'], ['Cinnamon', 'Rose Absolute'], ['Amberwood', 'Cedar'],
    'The 1 Million sweetness crowned with rose and amberwood.',
    'Royal flanker (2023). Confirm the flanker-specific list against the brand page.'),
  N('1 Million Priv', 'medium', ['Blood Mandarin', 'Cinnamon'], ['Myrrh', 'Rose'], ['Tobacco', 'Amber', 'Patchouli'],
    'The 1 Million DNA smoked with myrrh and tobacco.',
    'Prive flanker (2015), quietly wound down but still stocked. Confirm the list.'),
  N('Invictus Victory', 'medium', ['Lemon', 'Black Pepper'], ['Lavender'], ['Vanilla', 'Tonka Bean', 'Olibanum'],
    'The Invictus freshness armored with pepper and incense-tinged vanilla.',
    'Victory flanker (2021). Confirm the flanker-specific list.'),
  N('Pure XS Black', 'medium', ['Ginger', 'Tangerine'], ['Vanilla', 'Cinnamon', 'Coconut'], ['Cashmere Wood', 'Myrrh', 'Patchouli'],
    'The Pure XS sugar pulled darker with coconut and myrrh.',
    'Black flanker. Confirm the flanker-specific list.'),
  N('Invictus | Parfum', 'medium', ['Grapefruit', 'Marine Notes'], ['Bay Leaf', 'Lavender'], ['Ambergris', 'Guaiac Wood', 'Patchouli'],
    'The Invictus marine accord in its densest concentration.',
    'Parfum concentration; the EDT was enriched in batch-02. Confirm the Parfum-specific list.'),
  N('Invictus Platinum', 'medium', ['Grapefruit', 'Mint'], ['Lavender', 'Sage'], ['Ambergris', 'Woody Notes'],
    'A colder, more metallic Invictus.',
    'Platinum flanker (2022). Confirm the flanker-specific list.'),
  N('1 Million | Parfum', 'medium', ['Blood Mandarin', 'Bergamot'], ['Rose', 'Cinnamon'], ['Leather', 'Amber', 'Patchouli', 'Woody Notes'],
    'The 1 Million cinnamon-leather signature in its richest concentration.',
    'Parfum concentration (2020); the EDT was enriched in batch-03. Confirm the Parfum-specific list.'),
  N('Paloma Picasso', 'medium', ['Aldehydes', 'Hyacinth', 'Bergamot'], ['Jasmine', 'Rose', 'Ylang-Ylang'], ['Oakmoss', 'Patchouli', 'Amber', 'Civet'],
    'A fierce green chypre with real animalic depth. Unmistakably eighties, in the best way.'),
  N('Timbuktu', 'medium', ['Green Mango', 'Cardamom', 'Pink Pepper'], ['Karo Karounde', 'Incense'], ['Vetiver', 'Myrrh', 'Patchouli', 'Benzoin'],
    'Smoky incense and green mango over dry vetiver. Spare, strange and much loved.'),
  N('Cassili', 'high', ['Red Currant', 'Plum', 'Peach'], ['Rose', 'Mimosa', 'White Flowers'], ['Sandalwood', 'Tonka Bean', 'Vanilla'],
    'Plum and mimosa over creamy sandalwood and vanilla. Soft-spoken and polished.',
    'RESEARCHED against the OFFICIAL Parfums de Marly product page 2026-07-21.'),
  N('Oriana', 'high', ['Mandarin', 'Bergamot', 'Grapefruit'], ['Orange Blossom', 'Blackcurrant', 'Raspberry'], ['Marshmallow', 'Ambrette', 'Chantilly Cream', 'Musk'],
    'Citrus and berries whipped into marshmallow and chantilly cream. A dessert with posture.',
    'RESEARCHED against the OFFICIAL Parfums de Marly product page plus Dillards 2026-07-21.'),
  N('| Cassili |', 'high', ['Red Currant', 'Plum', 'Peach'], ['Rose', 'Mimosa', 'White Flowers'], ['Sandalwood', 'Tonka Bean', 'Vanilla'],
    'Plum and mimosa over creamy sandalwood and vanilla. Soft-spoken and polished.',
    'DUPLICATE PRODUCT: same fragrance as the prefixed Cassili row. Pyramid intentionally identical (sourced from the official PdM page). Stage A0 repair candidate.'),
  N('Delina Exclusif', 'medium', ['Litchi', 'Pear', 'Bergamot'], ['Turkish Rose', 'Incense'], ['Vanilla', 'Musk', 'Oud'],
    'The Delina rose deepened with incense and oud.',
    'Exclusif flanker. Confirm the flanker-specific list.'),
  SKIP('Leilani', 'CONFIRMED WRONG BRAND (verified 2026-07-21): Leilani is a Parfums d Elmar fragrance, not Parfums de Marly; PdM has no Leilani. Repaired via swap-07 to PdM Valaya, which enters fully enriched from the official page.'),
  N('La Ros', 'medium', ['Pear', 'Litchi', 'Bergamot'], ['Turkish Rose', 'Peony'], ['Musk', 'Sandalwood'],
    'The Delina rose washed lighter and dewier.',
    'La Rosee flanker. Confirm the flanker-specific list.'),
  N('Meliora', 'high', ['Blackcurrant', 'Red Berries', 'Cassis'], ['Rose', 'Lily-of-the-Valley', 'Ylang-Ylang'], ['Musk', 'Vanilla', 'Woody Notes'],
    'Zesty berries over rose and a warm vanilla-wood base. Playful and bright.',
    'RESEARCHED against the OFFICIAL Parfums de Marly product page plus Harrods 2026-07-21.'),
  N('Sedley', 'medium', ['Bergamot', 'Spearmint', 'Water Notes'], ['Lavender', 'Geranium'], ['Sandalwood', 'Vetiver'],
    'Minted citrus over watery woods. The freshest Parfums de Marly.',
    'Confirm the list against the brand page.'),
  N('Layton Exclusif', 'medium', ['Mandarin', 'Bergamot'], ['Jasmine', 'Geranium'], ['Vanilla', 'Coffee', 'Sandalwood'],
    'The Layton sweetness sharpened with coffee.',
    'Exclusif flanker. Confirm the flanker-specific list.'),
  N('| Herod |', 'medium', ['Cinnamon', 'Pepper', 'Osmanthus'], ['Tobacco Leaf', 'Incense'], ['Vanilla', 'Cypriol', 'Labdanum', 'Musk'],
    'Sweet vanilla and tobacco over cinnamon and incense. Warm, boozy and unmistakably wintry.',
    'DUPLICATE PRODUCT: same fragrance as the "Parfums de Marly Herod" row enriched in batch-02, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Percival', 'medium', ['Bergamot', 'Mandarin'], ['Lavender', 'Geranium', 'Cinnamon'], ['Tonka Bean', 'Musk', 'Amber'],
    'A polished fresh-spicy crowd-pleaser with a soft tonka finish.',
    'Confirm the list against the brand page.'),
  N('| Paris | EDP', 'medium', ['Frozen Apple', 'Peach Nectar', 'Melon'], ['Mimosa', 'Freesia', 'Tuberose', 'Lily-of-the-Valley'], ['Sandalwood', 'Ylang-Ylang', 'Oakmoss', 'Musk'],
    'Chilled apple and peach over soft white florals. Bubbly, flirty and exactly of its moment.',
    'RESEARCHED against retailer listings (FragranceX, Perfumania, Basenotes) 2026-07-21.'),
  SKIP('| Night | EDP', 'CONFIRMED FAKE NAME (verified 2026-07-21): no Paris Hilton fragrance called Night exists in her 30-fragrance line. Repaired via swap-07 to Can Can, which matches this row\u2019s Floral/Vanilla/Amber evening profile.'),
  N('Babylon', 'high', ['Nutmeg', 'Saffron', 'Coriander'], ['Cypriol'], ['Vanilla', 'Sandalwood', 'Cedar'],
    'Saffron and nutmeg over earthy cypriol and vanilla. Ancient-world spice, modern polish.',
    'RESEARCHED against retailer listings (Parfumo, BeautyTheShop) 2026-07-21.'),
  SKIP('Halfeti Pour Femme', 'Row repaired by swap-02 (fake name; product is unisex Halfeti), which entered fully enriched.'),
  SKIP('Lord George Pour Femme', 'Row repaired by swap-02 (fake name); replaced by The Coveted Duchess Rose, fully enriched.'),
  N('Clandestine Clara', 'medium', ['Rum', 'Vanilla'], ['Cinnamon', 'Musk'], ['Amber', 'Patchouli'],
    'Rum and cinnamon over warm amber. The most mischievous of the Portraits.',
    'RESEARCHED against retailer listings (Perfume.com, FragranceX, Beautinow) 2026-07-21.'),
  N('Sartorial', 'medium', ['Violet Leaf', 'Neroli', 'Cardamom', 'Black Pepper', 'Ginger'], ['Beeswax', 'Linden Blossom', 'Lavender', 'Leather'], ['Gurjum Wood', 'Myrrh', 'Cedar', 'Tonka Bean', 'Oakmoss', 'Honey'],
    'A Savile Row tailor shop in scent: pressed wool, beeswax and steam. Genuinely original.',
    'RESEARCHED against retailer listings (Bloomingdales, Selfridges, Osmoz) 2026-07-21.'),
  N('Halfeti Cedar', 'high', ['Rum', 'Saffron', 'Peach', 'Cardamom'], ['Virginia Cedar', 'Dried Fruits', 'Cinnamon', 'Immortelle'], ['Atlas Cedar', 'Tonka Bean', 'Vanilla', 'Labdanum', 'Patchouli'],
    'The Halfeti spice rebuilt around two cedars, rum and dried fruit. Luminous and warm.',
    'RESEARCHED against retailer listings (Maxaroma, Harrods, Basenotes) 2026-07-21.'),
  N('| Candy | EDP', 'medium', ['Caramel'], ['White Musk'], ['Benzoin', 'Vanilla', 'Caramel'],
    'Burnt caramel and benzoin over powdery musk. Deliberately simple, unapologetically sweet.',
    'DUPLICATE PRODUCT: same fragrance as the "Prada Candy" row enriched in batch-02, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N("L'Homme Intense", 'medium', ['Neroli', 'Black Pepper'], ['Iris', 'Tonka Bean'], ['Amber', 'Patchouli', 'Sandalwood'],
    'The Prada iris warmed with tonka and amber.',
    'Intense flanker of Prada L Homme (batch-02). Confirm the flanker-specific list.'),
  N('Luna Rossa Black', 'medium', ['Bergamot', 'Angelica'], ['Coffee'], ['Musk', 'Amber', 'Patchouli'],
    'Soft coffee and angelica over warm musk. The plushest Luna Rossa.',
    'Confirm the list against the brand page.'),
  N('Polo Sport', 'medium', ['Aldehydes', 'Lavender', 'Mint', 'Bergamot', 'Lemon'], ['Sea Notes', 'Rosemary', 'Geranium', 'Juniper'], ['Musk', 'Cedar', 'Amber', 'Oakmoss'],
    'Mint, sea air and lavender over mossy woods. The 1994 template for sporty freshness.'),
  N('Elysium Pour Femme', 'high', ['Bergamot', 'Mandarin', 'Blackberry', 'Peach'], ['Peony', 'Freesia', 'Ylang-Ylang', 'Jasmine', 'Magnolia', 'Violet'], ['Pink Pepper', 'Cedar', 'Sandalwood', 'Vanilla', 'Musk'],
    'Sun-lit fruit over a big floral heart and creamy woods. Bright, expensive and effortless.',
    'RESEARCHED against ROJA London and Neiman Marcus listings 2026-07-21.'),
  N('Danger Pour Femme | EDP', 'high', ['Lemon', 'Bergamot', 'Grapefruit', 'Mandarin'], ['Rose de Mai', 'Gardenia', 'Jasmine', 'Ylang-Ylang', 'Violet', 'Peach'], ['Clove', 'Patchouli', 'Sandalwood', 'Vanilla', 'Tonka Bean', 'Orris', 'Musk'],
    'A grand floral chypre with clove-spiced warmth underneath. Glamorous and unapologetic.',
    'RESEARCHED against ROJA London listings 2026-07-21.'),
  N('Danger Pour Femme | Parfum', 'high', ['Lemon', 'Bergamot', 'Grapefruit', 'Mandarin'], ['Rose de Mai', 'Gardenia', 'Jasmine', 'Ylang-Ylang', 'Violet', 'Peach'], ['Clove', 'Patchouli', 'Sandalwood', 'Vanilla', 'Tonka Bean', 'Orris', 'Musk'],
    'The Danger floral chypre in its densest concentration.',
    'Parfum concentration; ROJA sells both EDP and Parfum. Pyramid per the ROJA London listing; the Parfum reads deeper.'),
  N('| Elysium Pour Homme |', 'medium', ['Lime', 'Lemon', 'Grapefruit', 'Bergamot'], ['Blackcurrant', 'Juniper', 'Apple', 'Cedar'], ['Musk', 'Ambergris', 'Vetiver', 'Amber'],
    'Sparkling citrus and blackcurrant over clean musk and ambergris. Fresh, expensive-smelling and very smooth.',
    'Same product as the "Roja Parfums Elysium" row enriched in batch-02 (that row omits Pour Homme from the name). Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Roja Parfums Elysium Pour Homme', 'medium', ['Lime', 'Lemon', 'Grapefruit', 'Bergamot'], ['Blackcurrant', 'Juniper', 'Apple', 'Cedar'], ['Musk', 'Ambergris', 'Vetiver', 'Amber'],
    'Sparkling citrus and blackcurrant over clean musk and ambergris.',
    'DUPLICATE PRODUCT: prefix variant of the Elysium Pour Homme row. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Roja Elysium Pour Homme', 'medium', ['Lime', 'Lemon', 'Grapefruit', 'Bergamot'], ['Blackcurrant', 'Juniper', 'Apple', 'Cedar'], ['Musk', 'Ambergris', 'Vetiver', 'Amber'],
    'Sparkling citrus and blackcurrant over clean musk and ambergris.',
    'DUPLICATE PRODUCT: another prefix variant of Elysium Pour Homme. Pyramid intentionally identical. Stage A0 repair candidate.'),
  SKIP('Incanto Dream', 'Row removed by swap-02 (discontinued); replaced by Marc Jacobs Perfect, fully enriched.'),
  N('Chergui', 'medium', ['Honey', 'Tobacco Leaf'], ['Hay', 'Iris', 'Rose'], ['Sandalwood', 'Amber', 'Musk'],
    'Honeyed tobacco and hay in desert heat. A modern classic of warmth.'),
  SKIP('Wonderstruck', 'Row removed by cut-audit-01 (discontinued); replaced by Thank U Next, fully enriched.'),
  SKIP('Angel Muse', 'Row removed by swap-03 (discontinued per Mugler); replaced by Lattafa Yara, fully enriched.'),
  SKIP('Thierry Mugler Aura', 'Row removed by swap-03 (discontinued per Mugler); replaced by Lattafa Khamrah, fully enriched.'),
  N('| Black Orchid | EDP', 'high', ['Truffle', 'Gardenia', 'Blackcurrant', 'Ylang-Ylang', 'Bergamot'], ['Orchid', 'Lotus Wood', 'Fruity Notes'], ['Mexican Chocolate', 'Patchouli', 'Vanilla', 'Incense', 'Sandalwood', 'Vetiver'],
    'Truffle, dark chocolate and orchid over patchouli. Opulent, strange and completely uncompromising.',
    'DUPLICATE PRODUCT: same fragrance as the "Tom Ford Black Orchid" row enriched in batch-03, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Black Orchid | Parfum', 'medium', ['Truffle', 'Blackcurrant', 'Ylang-Ylang'], ['Orchid', 'Rum'], ['Mexican Chocolate', 'Patchouli', 'Vanilla', 'Sandalwood'],
    'The Black Orchid darkness in its densest form.',
    'Parfum concentration (2020). Confirm the Parfum-specific list.'),
  N('Rose Prick', 'medium', ['Rose de Mai', 'Turkish Rose', 'Bulgarian Rose'], ['Turmeric', 'Sichuan Pepper'], ['Tonka Bean', 'Patchouli'],
    'Three roses with thorns of pepper and turmeric.',
    'Confirm the list against the brand page.'),
  N('Jasmin Rouge', 'medium', ['Jasmine Sambac'], ['Cinnamon', 'Ginger', 'Clary Sage'], ['Vanilla', 'Amber', 'Leather'],
    'Lipstick-red jasmine spiced with cinnamon and ginger.',
    'Confirm the list against the brand page.'),
  N('| Oud Wood | EDP', 'high', ['Rosewood', 'Cardamom', 'Chinese Pepper'], ['Oud', 'Sandalwood', 'Vetiver'], ['Tonka Bean', 'Vanilla', 'Amber'],
    'Smooth oud and sandalwood over warm tonka. The approachable oud, dry and refined rather than medicinal.',
    'DUPLICATE PRODUCT: same fragrance as the "Tom Ford Oud Wood" row enriched in batch-04, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Noir Extreme', 'medium', ['Mandarin', 'Neroli', 'Saffron', 'Cardamom'], ['Jasmine', 'Orange Blossom', 'Rose', 'Kulfi'], ['Amber', 'Sandalwood', 'Vanilla', 'Woody Notes'],
    'Spiced mandarin and a dessert-like kulfi heart over warm amber and sandalwood.',
    'Same product as the swap-02 replacement row in unisex_date_night; pyramid kept identical across all rows.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  const exp = DATA[i].expect.replace(/\\(\d{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
  if (!hay.includes(exp)) bad.push(`rank ${i + 401}: expected "${exp}" in "${hay}"`)
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
writeFileSync('data-enrichment/batch-09.json', JSON.stringify({
  _meta: {
    batch: 'batch-09', scope: 'Unique products ranked 401-450 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length, skipped_swapped: skipped,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| products:', entries.length, '| skipped:', skipped.length)
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
