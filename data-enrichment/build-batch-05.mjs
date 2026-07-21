// Builds data-enrichment/batch-05.json — products ranked 201-250 by row count.
// Same rules: compiled from general knowledge, never scraped. Entries that
// cannot be grounded ship as null and are researched separately.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(200, 250)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })

const DATA = [
  N('Obsession for Men', 'medium', ['Mandarin', 'Bergamot', 'Lavender', 'Clary Sage'], ['Myrrh', 'Coriander', 'Cinnamon', 'Carnation'], ['Amber', 'Musk', 'Vanilla', 'Sandalwood', 'Patchouli'],
    'Warm amber and spice under a citrus-lavender opening. A dense, sweet oriental from the late eighties.'),
  N('Euphoria Men', 'medium', ['Ginger', 'Pepper'], ['Black Basil', 'Sage', 'Cedar'], ['Amber', 'Suede', 'Patchouli'],
    'Cool ginger and pepper over suede and amber. Dark and smooth without turning heavy.'),
  N('Calvin Klein CK Be', 'medium', ['Lavender', 'Mint', 'Bergamot', 'Juniper', 'Mandarin'], ['Magnolia', 'Jasmine', 'Peach', 'Freesia'], ['Musk', 'Sandalwood', 'Tonka Bean', 'Opoponax', 'Cedar'],
    'Soft lavender and mint over skin musk. The quieter sibling of CK One, calm and unisex.'),
  N('| CK Be |', 'medium', ['Lavender', 'Mint', 'Bergamot', 'Juniper', 'Mandarin'], ['Magnolia', 'Jasmine', 'Peach', 'Freesia'], ['Musk', 'Sandalwood', 'Tonka Bean', 'Opoponax', 'Cedar'],
    'Soft lavender and mint over skin musk. The quieter sibling of CK One, calm and unisex.',
    'DUPLICATE PRODUCT: same fragrance as the "Calvin Klein CK Be" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('CK2', 'medium', ['Violet Leaf', 'Mandarin', 'Cucumber'], ['Rose', 'Aquatic Notes', 'Orris'], ['Vetiver', 'Incense', 'Sandalwood', 'Musk'],
    'Wet violet leaf and cucumber over mineral vetiver. Urban and deliberately androgynous.'),
  N('| Obsession | EDT', 'medium', ['Green Notes', 'Mandarin', 'Bergamot', 'Peach', 'Basil'], ['Coriander', 'Orange Blossom', 'Jasmine', 'Sandalwood', 'Cedar'], ['Amber', 'Incense', 'Musk', 'Vanilla', 'Civet'],
    'A landmark eighties oriental: amber, incense and animalic warmth under a bright green opening.'),
  N('Good Girl Supreme', 'medium', ['Berries', 'Bergamot'], ['Tuberose', 'Jasmine'], ['Roasted Coffee', 'Vanilla', 'Tonka Bean'],
    'The Good Girl coffee-and-tuberose idea pushed darker with berries.',
    'Supreme flanker. Shares the Good Girl DNA; confirm the Supreme-specific list against the brand page.'),
  N('Good Girl Blush', 'high', ['Bergamot', 'Bitter Almond'], ['Peony', 'Ylang-Ylang'], ['Vanilla', 'Coumarin'],
    'Peony and ylang over a double dose of vanilla. The Good Girl idea turned soft, powdery and pink.',
    'RESEARCHED against the OFFICIAL Carolina Herrera product page plus Sephora and Nordstrom 2026-07-21.'),
  N('Légère', 'medium', ['Bergamot', 'Mandarin'], ['Tuberose', 'Jasmine', 'Ylang-Ylang'], ['Tonka Bean', 'Cacao', 'Sandalwood', 'Musk'],
    'The Good Girl signature with the coffee dialled down and the florals lifted. Softer and daytime-friendly.',
    'Légère flanker. Shares the Good Girl DNA; confirm the flanker-specific list.'),
  N('Bad Boy | EDT', 'high', ['Black Pepper', 'White Pepper', 'Bergamot'], ['Cedar', 'Clary Sage'], ['Tonka Bean', 'Cacao', 'Amberwood'],
    'Pepper and sage over sweet tonka and cacao. Spicy-sweet with a deliberate edge.'),
  N('| Chance | EDP', 'medium', ['Pink Pepper', 'Lemon', 'Pineapple'], ['Jasmine', 'Iris', 'Hyacinth'], ['Patchouli', 'Amber', 'Vetiver', 'White Musk'],
    'Pink pepper and jasmine spun around bright patchouli. Youthful, rounded and instantly recognisable.'),
  N('N\\2605', 'high', ['Aldehydes', 'Ylang-Ylang', 'Neroli', 'Bergamot', 'Lemon'], ['Iris', 'Jasmine', 'Rose', 'Lily-of-the-Valley'], ['Sandalwood', 'Vetiver', 'Vanilla', 'Amber', 'Patchouli', 'Musk'],
    'The most famous fragrance ever made: soapy aldehydes over a vast floral heart and warm woods.',
    'DUPLICATE PRODUCT: same fragrance as the "Chanel N°5" row enriched in batch-02, listed twice due to an encoding variant of the name. Pyramid intentionally identical. Stage A0 repair candidate.'),
  GAP('Chance Eau de Cologne pour Homme', 'CONFIRMED NON-EXISTENT PRODUCT (researched 2026-07-21): Chanel has never released a men’s Chance — the Chance line is women-only per Chanel’s own catalog. This row is a data-corruption artifact from the original PDF extraction. Its accords (Citrus, Fresh, Aromatic) and Cologne concentration suggest it may be a mangling of Allure Homme Sport Cologne, a real Chanel men’s cologne with exactly that profile. OWNER DECISION NEEDED: rename the row (Stage A0) or remove it. Notes deliberately left null; do not invent a pyramid for a product that does not exist.'),
  N('Sycomore', 'medium', ['Cypress', 'Pink Pepper', 'Juniper'], ['Vetiver', 'Violet'], ['Sandalwood', 'Tobacco', 'Incense'],
    'Smoky vetiver over dry cypress and sandalwood. Austere, elegant and quietly one of Chanel’s best.'),
  N('Allure Homme Sport | EDP', 'medium', ['Orange', 'Aldehydes', 'Sea Notes', 'Mandarin'], ['Pepper', 'Neroli', 'Cedar'], ['Tonka Bean', 'White Musk', 'Vetiver', 'Vanilla', 'Amber'],
    'The Allure Homme Sport signature in a deeper concentration.',
    'The catalog lists this as EDP; Chanel’s richer version is formally Eau Extrême. Shares the line DNA; confirm which product this row is.'),
  N('Eau Extreme', 'medium', ['Mandarin', 'Cypress', 'Sage'], ['Pepper', 'Neroli'], ['Tonka Bean', 'Sandalwood', 'White Musk'],
    'The darkest, warmest Allure Homme Sport: less citrus splash, more tonka and woods.',
    'The catalog lists this as EDT; Eau Extrême is formally an EDP. Concentration label likely swapped with the other Allure Homme Sport row. Notes reflect Eau Extrême.'),
  N('Egoiste', 'high', ['Coriander', 'Mandarin', 'Rosewood'], ['Carnation', 'Cinnamon', 'Rose'], ['Sandalwood', 'Vanilla', 'Ambrette'],
    'Spiced sandalwood and carnation from 1990. Bold, woody and still unlike anything else on a shelf.'),
  N('Chanel Coco Mademoiselle', 'high', ['Orange', 'Bergamot', 'Orange Blossom'], ['Jasmine', 'Rose', 'Ylang-Ylang', 'Mimosa'], ['Patchouli', 'White Musk', 'Vanilla', 'Vetiver', 'Tonka Bean'],
    'Bright orange over rose, jasmine and clean patchouli. Polished, modern and enormously popular.',
    'DUPLICATE PRODUCT: same fragrance as the "Coco Mademoiselle" row enriched in batch-01, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Chloé', 'high', ['Peony', 'Litchi', 'Freesia'], ['Rose', 'Magnolia', 'Lily-of-the-Valley'], ['Amber', 'Cedar', 'Honey'],
    'A powdery modern rose over soft amber. Romantic without being sugary, and a template many copied.'),
  N('Curve for Men', 'medium', ['Pineapple', 'Lavender', 'Lemon', 'Juniper Berries', 'Neroli'], ['Ginger', 'Sage', 'Cardamom', 'Cactus', 'Coriander'], ['Musk', 'Sandalwood', 'Mahogany', 'Cedar', 'Vetiver'],
    'Green pineapple and juniper over dry woods. A mid-nineties mall classic that aged better than expected.',
    'RESEARCHED against retailer listings (FragranceX, Osmoz, Basenotes) 2026-07-21.'),
  N('| Happy | EDT', 'medium', ['Grapefruit', 'Bergamot', 'Lemon', 'Mandarin'], ['Freesia', 'Magnolia', 'Rose', 'Orchid'], ['Musk', 'Amber', 'Cedar', 'Mahogany'],
    'Zesty grapefruit over soft florals. Bright, uncomplicated and exactly as cheerful as the name suggests.',
    'DUPLICATE PRODUCT: same fragrance as the "Clinique Happy" row enriched in batch-02, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Chemistry', 'medium', ['Mint', 'Neroli', 'Lavender', 'Lemon'], ['Ginger', 'Coriander', 'Pepper', 'Cyclamen'], ['Musk', 'Oakmoss', 'Sandalwood', 'Cedar', 'Amber'],
    'Cool mint and citrus over mossy woods. Clean-cut, quiet and very much of its decade.',
    'RESEARCHED against retailer listings (Perfume.com, FragranceNet, Basenotes) 2026-07-21. Discontinued product.'),
  N('Happy for Men', 'medium', ['Lime', 'Green Notes', 'Cypress'], ['Jasmine', 'Freesia', 'Orange Blossom'], ['Musk', 'Suede', 'Guaiac Wood'],
    'Cold citrus and cypress over clean musk. Crisp, green and deliberately simple.'),
  N('Spring Flower', 'medium', ['Peach', 'Melon', 'Apple', 'Bergamot'], ['Jasmine', 'Rose'], ['Musk', 'Ambergris'],
    'Juicy peach and melon over soft florals and musk. The sunniest, most easygoing Creed.'),
  N('| Love in White |', 'medium', ['Orange Zest'], ['Magnolia', 'Jasmine', 'Daffodil', 'Rice Husk'], ['Sandalwood', 'Ambergris', 'Vanilla'],
    'White florals over creamy rice husk and sandalwood. Clean and bridal, with a faintly powdery finish.'),
  N('Creed Love in White', 'medium', ['Orange Zest'], ['Magnolia', 'Jasmine', 'Daffodil', 'Rice Husk'], ['Sandalwood', 'Ambergris', 'Vanilla'],
    'White florals over creamy rice husk and sandalwood. Clean and bridal, with a faintly powdery finish.',
    'DUPLICATE PRODUCT: same fragrance as the "Love in White" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Erolfa', 'medium', ['Lemon', 'Lime', 'Melon', 'Bergamot'], ['Ginger', 'Violet', 'Cyclamen', 'Pepper'], ['Musk', 'Ambergris', 'Oakmoss', 'Cedar'],
    'Citrus and sea air built for deck shoes. A 1992 marine that still reads properly nautical.'),
  N('Aventus Cologne', 'medium', ['Ginger', 'Mandarin', 'Pink Pepper'], ['Vetiver', 'Patchouli', 'Sandalwood'], ['Birch', 'Musk', 'Tonka Bean', 'Styrax'],
    'The Aventus smoke rebuilt around ginger and vetiver. Fresher and greener than its famous sibling.'),
  N('Viking Cologne', 'medium', ['Bergamot', 'Mandarin', 'Pink Pepper'], ['Sage', 'Nutmeg', 'Lavender', 'Rosemary'], ['Sandalwood', 'Vetiver', 'Patchouli'],
    'Herbal citrus over dry woods. The Viking fire calmed down into something office-safe.'),
  N('Millesime Imperial', 'medium', ['Bergamot', 'Lemon', 'Sea Salt'], ['Iris', 'Sicilian Lemon'], ['Musk', 'Sandalwood'],
    'Salted citrus over soft iris and musk. Airy and sophisticated, built for warm weather.',
    'DUPLICATE PRODUCT: same fragrance as the "Creed Millésime Impérial" row enriched in batch-02, listed twice due to an accent variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Cool Water Woman', 'medium', ['Citrus', 'Pineapple', 'Blackcurrant', 'Quince'], ['Lotus', 'Lily', 'Water Notes'], ['Musk', 'Sandalwood', 'Vanilla'],
    'Watery fruit and lotus over clean musk. The aquatic idea translated brighter and fruitier.'),
  N('Champion', 'medium', ['Bergamot', 'Lemon'], ['Clary Sage', 'Galbanum'], ['Oakmoss', 'Cedar'],
    'Sharp citrus over green galbanum and moss. Lean, gym-bag fresh and deliberately simple.',
    'RESEARCHED against retailer listings (Parfumo, Perfumebox, Cologne.com) 2026-07-21.'),
  N('Cool Water Game', 'medium', ['Watermelon', 'Grapefruit', 'Lemon Verbena', 'Basil'], ['Lavender', 'Violet Leaf', 'Blackcurrant'], ['Patchouli', 'Woody Notes'],
    'Watermelon and verbena over light woods. A sweeter, fruitier spin on the Cool Water idea.',
    'RESEARCHED 2026-07-21; resolved to Cool Water Game for Him (2006), distinct from the Happy Summer flanker. Discontinued product.'),
  N('Adventure', 'medium', ['Mandarin Orange', 'Pepper', 'Lemon', 'Bergamot', 'Mate'], ['Pimento', 'Sesame'], ['Vetiver', 'Cedar', 'White Musk'],
    'Peppered citrus and mate over dry vetiver. Outdoorsy in a low-key, wearable way.',
    'RESEARCHED against retailer listings (FragranceX, Parfumo, Perfume Direct) 2026-07-21.'),
  N('Loverdose', 'medium', ['Mandarin', 'Star Anise'], ['Licorice', 'Jasmine', 'Gardenia'], ['Vanilla', 'Amber', 'Woody Notes'],
    'Licorice and star anise over sweet vanilla. Dark candy, worn with intent.'),
  N('Spirit of the Brave', 'medium', ['Bergamot', 'Galbanum', 'Artemisia'], ['Clary Sage', 'Elemi', 'Cypress'], ['Balsam Fir', 'Tonka Bean', 'Labdanum'],
    'Green galbanum and cypress over warm tonka and fir balsam. Fresher and greener than the Only the Brave line it extends.',
    'RESEARCHED against the official Diesel product listing and launch coverage 2026-07-21.'),
  N('Absolutely Blooming', 'medium', ['Red Berries', 'Bergamot'], ['Peony', 'Damascus Rose', 'Grasse Rose'], ['White Musk'],
    'A bouquet of roses over sweet berries and musk. Bright, pink and unabashedly pretty.'),
  N('Miss Dior | Parfum', 'medium', ['Mandarin'], ['Rose', 'Jasmine'], ['Amber', 'Woody Notes', 'Vanilla'],
    'The Miss Dior rose in its densest concentration.',
    'Parfum concentration (2024 release). Shares the modern Miss Dior DNA; confirm the Parfum-specific list against the brand page.'),
  N('Fahrenheit | Parfum', 'medium', ['Mandarin', 'Lavender'], ['Violet Leaf', 'Sandalwood'], ['Leather', 'Vetiver', 'Tonka Bean'],
    'The Fahrenheit violet-and-leather signature, warmer and denser.',
    'Parfum concentration; the EDT enriched in batch-03 is the reference formulation. Confirm the Parfum-specific list.'),
  N('Higher', 'medium', ['Pear', 'Basil', 'Lemon', 'Peach'], ['Cypress', 'Rosemary', 'Cardamom', 'Pepper'], ['Musk', 'Cedar'],
    'Crisp pear and basil over cypress and musk. An energetic early-2000s fresh scent, since discontinued.',
    'RESEARCHED against retailer listings (Parfumo, Basenotes, Le Parfumier) 2026-07-21. Discontinued product.'),
  N('Dior Homme | EDP', 'medium', ['Bergamot', 'Pink Pepper'], ['Iris', 'Lavender'], ['Vetiver', 'Cedar', 'Musk'],
    'The Dior Homme iris in a deeper, woodier register.',
    'EDP concentration; the EDT and Intense are separate catalog rows with their own lists. Confirm against the brand page.'),
  N('Sauvage | Parfum', 'medium', ['Bergamot', 'Mandarin', 'Elemi'], ['Sandalwood', 'Olibanum'], ['Vanilla', 'Tonka Bean'],
    'Sauvage condensed: the citrus survives, but sandalwood and vanilla carry it.',
    'Parfum concentration (2019). The EDT and EDP are separate catalog rows with their own lists.'),
  N('Elixir', 'high', ['Cinnamon', 'Nutmeg', 'Cardamom', 'Grapefruit'], ['Lavender'], ['Licorice', 'Sandalwood', 'Amber', 'Patchouli', 'Vetiver'],
    'A spiced, concentrated shot of the Sauvage idea: lavender and licorice over dense woods. Very strong, very dark.'),
  N('Tempo', 'medium', ['Bergamot', 'Pink Pepper'], ['Patchouli', 'Violet Leaf', 'Mate'], ['Patchouli', 'Clary Sage', 'Woody Notes'],
    'Patchouli studied from three angles: green, earthy and clean. Serious and beautifully made.'),
  N('Eau Rose', 'medium', ['Bergamot', 'Litchi'], ['Damascena Rose', 'Centifolia Rose', 'Artichoke Leaf'], ['White Musk', 'Cedar'],
    'Two roses kept fresh and green rather than jammy. Light, natural and very wearable.'),
  N('Be Delicious | EDP', 'medium', ['Grapefruit', 'Cucumber', 'Apple'], ['Apple', 'Rose', 'Violet', 'Magnolia'], ['Sandalwood', 'Amber', 'White Musk'],
    'Crisp green apple and cucumber over soft woods. Juicy, clean and famously easy to wear.',
    'DUPLICATE PRODUCT: same fragrance as the "DKNY Be Delicious" EDP row enriched in batch-03, listed twice due to a name variant. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Be Delicious | EDT', 'medium', ['Grapefruit', 'Cucumber', 'Apple'], ['Apple', 'Rose', 'Violet', 'Magnolia'], ['Sandalwood', 'Amber', 'White Musk'],
    'The Be Delicious green apple in a lighter, brighter splash.',
    'EDT concentration of the Be Delicious EDP. Shares the DNA; the EDT-specific list is not separately documented.'),
  N('DKNY Be Delicious | EDT', 'medium', ['Grapefruit', 'Cucumber', 'Apple'], ['Apple', 'Rose', 'Violet', 'Magnolia'], ['Sandalwood', 'Amber', 'White Musk'],
    'The Be Delicious green apple in a lighter, brighter splash.',
    'DUPLICATE PRODUCT: same fragrance as the "Be Delicious" EDT row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Rose The One', 'medium', ['Pink Grapefruit', 'Mandarin', 'Blackcurrant'], ['Rose', 'Peony', 'Lily-of-the-Valley'], ['Musk', 'Vanilla', 'Ambrette', 'Sandalwood'],
    'A soft pink rose over musk and vanilla. Gentle, rounded and easy to like.'),
  N('Light Blue Eau Intense | EDP', 'high', ['Sicilian Lemon', 'Granny Smith Apple'], ['Marigold', 'Jasmine'], ['Amberwood', 'Musk'],
    'The Light Blue citrus sharpened and deepened with amberwood. Brighter opening, warmer finish.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 201}: expected "${DATA[i].expect}" in "${hay}"`)
})
if (bad.length) {
  console.error('RANK MISALIGNMENT - refusing to build:'); bad.forEach((b) => console.error('  ' + b)); process.exit(1)
}

const entries = slice.map((p, i) => {
  const n = DATA[i]
  const grounded = n.confidence !== 'low'
  return {
    brand: p.brand, name: p.name, concentration: p.concentration,
    tier: p.tier, accords: p.accords, confidence: n.confidence,
    ...(grounded
      ? { top_notes: n.top, middle_notes: n.middle, base_notes: n.base, description: n.description }
      : { top_notes: null, middle_notes: null, base_notes: null, description: null, needs_verification: true, reason: n.reason }),
    ...(n.note ? { note: n.note } : {}),
    row_count: p.ids.length,
    applies_to_ids: p.ids.map((x) => x.id),
  }
})
const counts = entries.reduce((a, e) => ({ ...a, [e.confidence]: (a[e.confidence] || 0) + 1 }), {})
writeFileSync('data-enrichment/batch-05.json', JSON.stringify({
  _meta: {
    batch: 'batch-05', scope: 'Unique products ranked 201-250 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| rows:', entries.reduce((s, e) => s + e.row_count, 0))
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
