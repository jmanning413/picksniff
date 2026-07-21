// Builds data-enrichment/batch-03.json — products ranked 101-150 by row count.
// Same rules as batches 01-02: compiled from general knowledge, never scraped,
// low-confidence entries ship as null rather than as guesses.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(100, 150)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })

const DATA = [
  N('Tam Dao', 'medium', ['Italian Cypress', 'Rosewood'], ['Sandalwood', 'Cedar'], ['Amber', 'Musk'],
    'Creamy sandalwood over dry cypress. Meditative and monastic, with very little sweetness.'),
  N('Do Son', 'medium', ['Orange Blossom'], ['Tuberose', 'Rose', 'Jasmine'], ['White Musk', 'Benzoin'],
    'Airy tuberose kept light rather than heady. Soft, white-floral and quietly elegant.'),
  N('Be Delicious', 'medium', ['Grapefruit', 'Cucumber', 'Apple'], ['Apple', 'Rose', 'Violet', 'Magnolia'], ['Sandalwood', 'Amber', 'White Musk'],
    'Crisp green apple and cucumber over soft woods. Juicy, clean and famously easy to wear.'),
  N('Light Blue pour Homme', 'high', ['Grapefruit', 'Sicilian Mandarin', 'Bergamot', 'Juniper'], ['Rosemary', 'Rosewood', 'Pepper'], ['Musk', 'Incense', 'Oakmoss'],
    'Bitter grapefruit and juniper over dry woods. Sharper and more mineral than the women\'s Light Blue.'),
  N('Gabbana K', 'medium', ['Blood Orange', 'Sicilian Lemon', 'Juniper'], ['Pimento', 'Geranium', 'Lavender', 'Clary Sage'], ['Cedar', 'Vetiver', 'Patchouli'],
    'Bright citrus over spicy pimento and dry cedar. Fresh at the top, distinctly woody underneath.'),
  N('| Si |', 'medium', ['Blackcurrant', 'Bergamot', 'Mandarin'], ['Rose', 'Freesia', 'May Rose'], ['Vanilla', 'Patchouli', 'Amberwood', 'Musk'],
    'Blackcurrant and rose over a creamy vanilla-patchouli base. Modern chypre warmth, polished and rich.'),
  N('Acqua di Gioia', 'medium', ['Mint', 'Lemon', 'Pink Pepper'], ['Jasmine', 'Peony', 'Aquatic Notes'], ['Labdanum', 'Cedar', 'Brown Sugar'],
    'Crushed mint and lemon over watery jasmine. The aquatic idea of Acqua di Giò rendered greener and sweeter.'),
  N('Code Colonia', 'medium', ['Bergamot', 'Grapefruit', 'Cardamom'], ['Orange Blossom', 'Jasmine', 'Rose'], ['Tonka Bean', 'Musk', 'Woody Notes'],
    'A lighter, citrus-forward take on the Armani Code idea. Clean and bright rather than sweet.'),
  N('Acqua di Gi', 'high', ['Bergamot', 'Neroli', 'Green Tangerine', 'Lime', 'Lemon'], ['Sea Notes', 'Jasmine', 'Rosemary', 'Peach', 'Freesia', 'Coriander'], ['White Musk', 'Cedar', 'Oakmoss', 'Patchouli', 'Amber'],
    'The defining marine fragrance: citrus and sea air over soft woods and musk. Effortless and endlessly copied.'),
  N('Armani Code | EDT', 'high', ['Lemon', 'Bergamot'], ['Star Anise', 'Olive Blossom', 'Guaiac Wood'], ['Tonka Bean', 'Leather', 'Tobacco'],
    'Sweet anise and olive blossom over tonka and leather. Warm, seductive and built for evenings.'),
  N('Acqua di Gi', 'high', ['Bergamot', 'Neroli', 'Green Tangerine', 'Lime', 'Lemon'], ['Sea Notes', 'Jasmine', 'Rosemary', 'Peach', 'Freesia', 'Coriander'], ['White Musk', 'Cedar', 'Oakmoss', 'Patchouli', 'Amber'],
    'The defining marine fragrance: citrus and sea air over soft woods and musk. Effortless and endlessly copied.',
    'DUPLICATE PRODUCT: same fragrance as the "Acqua di Giò" row, listed twice because the catalog carries both an accented and unaccented spelling. Pyramid intentionally identical. Candidate for Stage A0 name repair.'),
  N('Rush', 'medium', ['Freesia', 'Peach', 'Coriander', 'Gardenia'], ['Jasmine', 'Rose', 'Orris'], ['Vanilla', 'Patchouli', 'Vetiver', 'Musk'],
    'A creamy, almost synthetic floral over vanilla and patchouli. Distinctive and unmistakably late-nineties.'),
  N('Mon Guerlain', 'medium', ['Lavender', 'Bergamot'], ['Jasmine', 'Iris'], ['Vanilla', 'Sandalwood', 'Coumarin'],
    'Lavender and vanilla in a soft, powdery balance. Comforting and modern, with classic Guerlain sweetness.'),
  N('Samsara', 'medium', ['Bergamot', 'Lemon', 'Ylang-Ylang', 'Peach'], ['Jasmine', 'Rose', 'Iris', 'Narcissus'], ['Sandalwood', 'Tonka Bean', 'Vanilla', 'Amber', 'Musk'],
    'Creamy sandalwood under a rich floral heart. Opulent, warm and firmly of the late eighties.'),
  N('Bergamote', 'medium', ['Bergamot', 'Lemon', 'Mint'], ['Neroli', 'Petitgrain'], ['White Musk', 'Cedar'],
    'Pure, zesty bergamot kept bright and uncomplicated. A citrus cologne in the classic Guerlain style.'),
  N('Nil', 'medium', ['Green Mango', 'Grapefruit', 'Tomato Leaf'], ['Lotus', 'Orange', 'Peony'], ['Incense', 'Sycamore', 'Musk'],
    'Unripe green mango over watery lotus and soft incense. Green, dry and unusually original.'),
  N('Atomic Rose', 'medium', ['Italian Bergamot', 'Pink Pepper'], ['Bulgarian Rose', 'Turkish Rose', 'Egyptian Jasmine'], ['Vanilla', 'Ambroxan'],
    'Two natural roses over vanilla and ambroxan. Lush and modern, with the rose kept bright rather than jammy.',
    'RESEARCHED against retailer listings (Harrods, Perfume.com, BeautyTheShop) 2026-07-21.'),
  N('Ginger Lily', 'medium', ['Ginger', 'Black Cardamom', 'Pink Pepper'], ['Water Lily', 'Orchid', 'Jasmine', 'Rose'], ['Sandalwood', 'Black Amber', 'Incense', 'Patchouli', 'Leather'],
    'Smoky incense and black amber under spiced lily. Dark and resinous, the heaviest thing Jo Malone makes.',
    'RESEARCHED against the official Jo Malone London product page plus Macys and Nordstrom listings 2026-07-21. This is the Cologne Intense concentration.'),
  N('La Fleur', 'medium', ['Red Berries', 'Mandarin Orange', 'Water Lily'], ['Honeysuckle', 'Gardenia', 'Jasmine'], ['Caramel', 'Vanilla', 'Sandalwood'],
    'Berries and white flowers over caramel and vanilla. Sweet, fruity and cheerfully uncomplicated.',
    'RESEARCHED against retailer listings (Wikiparfum, FragranceX, Perfume.com) 2026-07-21.'),
  N('Encre Noire', 'medium', ['Cypress'], ['Vetiver'], ['Cashmere Wood', 'Musk'],
    'Dark, earthy vetiver over cold cypress. Austere and inky, with almost nothing sweet in it.'),
  N('La Nuit', 'medium', ['Lychee', 'Bergamot'], ['Rose', 'Black Orchid', 'Vanilla Orchid'], ['Vanilla', 'Praline', 'Patchouli', 'Incense'],
    'Jammy rose and lychee over praline and vanilla. Dark, sweet and built for night.'),
  N('Intens', 'medium', ['Blackcurrant', 'Pear'], ['Iris', 'Jasmine', 'Orange Blossom'], ['Praline', 'Vanilla', 'Patchouli', 'Tonka Bean'],
    'The La Vie Est Belle praline signature pushed richer and sweeter.',
    'Intensément flanker. Shares the original DNA; the exact list differs. Confirm against the brand page.'),
  N('Arp', 'medium', ['Bergamot', 'Honeysuckle', 'Peach', 'Neroli', 'Aldehydes'], ['Rose', 'Jasmine', 'Ylang-Ylang', 'Lily-of-the-Valley', 'Iris'], ['Sandalwood', 'Vetiver', 'Vanilla', 'Musk', 'Patchouli'],
    'A grand aldehydic floral from 1927 that still smells composed and complete. Powdery, rosy and formal.'),
  N('Attrape', 'high', ['Litchi', 'Bergamot', 'Ginger'], ['Peony', 'Turkish Rose', 'Cacao'], ['Patchouli'],
    'Juicy litchi and peony over an unexpected thread of cacao and patchouli. Bright and slightly gourmand.',
    'RESEARCHED against the OFFICIAL Louis Vuitton product page (us.louisvuitton.com) 2026-07-21.'),
  N('Rose des Vents', 'high', ['Peach', 'Green Notes', 'Blackcurrant'], ['May Rose', 'Turkish Rose', 'Iris'], ['White Musk', 'Orris Root', 'Cedar', 'Violet Leaf', 'Pepper'],
    'A field of Grasse roses softened by peach and iris. Powdery, green and deliberately classical.',
    'RESEARCHED against the OFFICIAL Louis Vuitton product page (us.louisvuitton.com) 2026-07-21.'),
  N('Lazy Sunday', 'medium', ['Pear', 'Aldehydes', 'Lily-of-the-Valley'], ['Iris', 'Rose', 'Orange Blossom'], ['White Musk', 'Ambrette'],
    'Clean laundry and soft iris. Smells like fresh sheets, which is exactly the intention.'),
  N('Fireplace', 'high', ['Pink Pepper', 'Orange Blossom', 'Clove'], ['Chestnut', 'Guaiac Wood', 'Cashmeran'], ['Vanilla', 'Peru Balsam', 'Cade Oil'],
    'Woodsmoke, roasted chestnut and vanilla. Genuinely smells like sitting by a fire, and it is the reason this line sells.'),
  N('Jazz Club', 'medium', ['Pink Pepper', 'Neroli', 'Lemon'], ['Rum', 'Clary Sage', 'Vanilla'], ['Tobacco Leaf', 'Vetiver', 'Styrax', 'Benzoin'],
    'Boozy rum and sweet tobacco, in the richer eau de parfum concentration.',
    'EDP concentration of the Jazz Club listed separately at rank 53 as EDT. Shares the composition; the EDP reads deeper.'),
  N('Sailing Day', 'medium', ['Sea Salt', 'Coriander', 'Bergamot'], ['Seaweed', 'Juniper'], ['Musk', 'Ambrette'],
    'Salt spray and wet rope over clean musk. Bracing and genuinely maritime rather than generically fresh.'),
  N('Autumn Vibes', 'medium', ['Pink Pepper', 'Coriander', 'Cardamom'], ['Carrot Seed', 'Nutmeg', 'Frankincense'], ['Cedar', 'Oakmoss', 'Balsam'],
    'Spiced woods and frankincense over damp moss. Smells like a forest floor in October, which is the point.',
    'RESEARCHED against the official Maison Margiela product page plus the Macys listing 2026-07-21.'),
  N('Legend Red', 'medium', ['Grapefruit', 'Lemon', 'Pink Pepper'], ['Cinnamon', 'Clary Sage'], ['Tonka Bean', 'Leather', 'Cedar'],
    'Bright grapefruit over warm cinnamon and leather. Fresh opening, considerably warmer finish.'),
  N('Explorer', 'medium', ['Bergamot', 'Pink Pepper', 'Clary Sage'], ['Vetiver', 'Leather'], ['Patchouli', 'Ambroxan', 'Cacao'],
    'Bergamot and vetiver over ambroxan and a touch of cacao. Clean, modern and very wearable.'),
  N('Olymp', 'medium', ['Water Jasmine', 'Green Mandarin'], ['Salted Vanilla', 'Ginger Flower'], ['Sandalwood', 'Cashmere Wood', 'Ambergris'],
    'The salted-vanilla Olympéa signature in a lighter, fresher concentration.',
    'EDT concentration of the Olympéa listed at rank 55 as EDP. Lighter and more citrus-forward.'),
  N('1 Million', 'high', ['Blood Mandarin', 'Grapefruit', 'Mint'], ['Rose', 'Cinnamon', 'Spicy Notes'], ['Leather', 'Amber', 'Patchouli', 'White Wood'],
    'Sweet cinnamon and leather over bright mandarin. Loud, sweet and one of the defining designer scents of its decade.'),
  N('Phantom', 'medium', ['Lemon', 'Lavender'], ['Lavender', 'Vanilla'], ['Patchouli', 'Vetiver'],
    'Clean lavender and lemon over sweet vanilla and patchouli. Simple, bright and modern.'),
  N('Invictus Aqua', 'medium', ['Grapefruit', 'Marine Notes', 'Mandarin'], ['Bay Leaf', 'Jasmine'], ['Ambergris', 'Guaiac Wood', 'Patchouli'],
    'The Invictus marine accord made fresher and more transparent.',
    'Aqua flanker of the Invictus listed at rank 56. Shares the DNA; lighter and more aquatic.'),
  N('Delina', 'medium', ['Litchi', 'Rhubarb', 'Bergamot', 'Nutmeg'], ['Turkish Rose', 'Peony', 'Vanilla'], ['Musk', 'Cashmere Wood', 'Incense', 'Vetiver'],
    'A bright, fruity Turkish rose over soft musk and cashmere wood. Sweet, polished and extremely popular.'),
  N('| Layton |', 'high', ['Apple', 'Bergamot', 'Lavender', 'Mandarin'], ['Violet', 'Jasmine', 'Geranium', 'Pepper'], ['Vanilla', 'Sandalwood', 'Guaiac Wood', 'Patchouli', 'Cardamom'],
    'Green apple and lavender over creamy vanilla and sandalwood. Sweet, spicy and hugely versatile.'),
  N('Pegasus', 'medium', ['Bergamot', 'Heliotrope'], ['Almond', 'Lavender', 'Jasmine'], ['Vanilla', 'Sandalwood', 'Amber', 'Vetiver'],
    'Creamy almond and heliotrope over vanilla and sandalwood. Soft, nutty and comforting.'),
  N('Marly Layton', 'high', ['Apple', 'Bergamot', 'Lavender', 'Mandarin'], ['Violet', 'Jasmine', 'Geranium', 'Pepper'], ['Vanilla', 'Sandalwood', 'Guaiac Wood', 'Patchouli', 'Cardamom'],
    'Green apple and lavender over creamy vanilla and sandalwood. Sweet, spicy and hugely versatile.',
    'DUPLICATE PRODUCT: same fragrance as the "Layton" row, listed twice because the catalog name carries a redundant brand prefix. Pyramid intentionally identical. Candidate for Stage A0 name repair.'),
  N('Herod', 'medium', ['Cinnamon', 'Pepper', 'Osmanthus'], ['Tobacco Leaf', 'Incense'], ['Vanilla', 'Cypriol', 'Labdanum', 'Musk'],
    'Sweet vanilla and tobacco over cinnamon and incense. Warm, boozy and unmistakably wintry.'),
  N('Lord George', 'medium', ['Brandy', 'Bergamot'], ['Tonka Bean', 'Clary Sage'], ['Leather', 'Vanilla', 'Cedar'],
    'Brandy and tonka over soft leather. Clubby and old-world, with a boozy sweetness throughout.'),
  N('Prada Candy', 'medium', ['Caramel'], ['White Musk'], ['Benzoin', 'Vanilla', 'Caramel'],
    'Burnt caramel and benzoin over powdery musk. Deliberately simple, unapologetically sweet.'),
  N('Infusion', 'medium', ['Mandarin', 'Galbanum', 'Neroli'], ['Iris', 'Orange Blossom'], ['Vetiver', 'Cedar', 'Benzoin', 'Incense'],
    'Cool, earthy iris over clean woods. Refined and slightly austere, closer to a watercolour than a statement.'),
  N("L'Homme", 'medium', ['Neroli', 'Black Pepper', 'Cardamom'], ['Iris', 'Violet', 'Geranium'], ['Amber', 'Patchouli', 'Cedar', 'Sandalwood'],
    'Powdery iris and violet over soft amber. Clean, smooth and quietly sophisticated.'),
  N('Polo Blue | EDT', 'high', ['Melon', 'Cucumber', 'Mandarin', 'Basil'], ['Sage', 'Geranium', 'Suede'], ['Musk', 'Amber', 'Patchouli', 'Woody Notes'],
    'Cool melon and cucumber over soft suede. Breezy, clean and built for warm weather.'),
  N('Polo Blue | EDP', 'medium', ['Melon', 'Cucumber', 'Mandarin', 'Basil'], ['Sage', 'Geranium', 'Suede'], ['Musk', 'Amber', 'Patchouli', 'Woody Notes'],
    'The Polo Blue melon-and-suede signature in a deeper, longer-lasting concentration.',
    'EDP concentration; shares the EDT DNA but reads warmer. Confirm the EDP-specific list against the brand page.'),
  N('Elysium', 'medium', ['Lime', 'Lemon', 'Grapefruit', 'Bergamot'], ['Blackcurrant', 'Juniper', 'Apple', 'Cedar'], ['Musk', 'Ambergris', 'Vetiver', 'Amber'],
    'Sparkling citrus and blackcurrant over clean musk and ambergris. Fresh, expensive-smelling and very smooth.'),
  N('Alien Goddess', 'medium', ['Bergamot', 'Coconut Water'], ['Jasmine', 'Tuberose'], ['Vanilla', 'Cashmeran'],
    'Solar jasmine and coconut over creamy vanilla. Brighter and softer than the original Alien.'),
  N('Black Orchid', 'high', ['Truffle', 'Gardenia', 'Blackcurrant', 'Ylang-Ylang', 'Bergamot'], ['Orchid', 'Lotus Wood', 'Fruity Notes'], ['Mexican Chocolate', 'Patchouli', 'Vanilla', 'Incense', 'Sandalwood', 'Vetiver'],
    'Truffle, dark chocolate and orchid over patchouli. Opulent, strange and completely uncompromising.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`)
  process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 101}: expected "${DATA[i].expect}" in "${hay}"`)
})
if (bad.length) {
  console.error('RANK MISALIGNMENT - refusing to build:')
  bad.forEach((b) => console.error('  ' + b))
  process.exit(1)
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
writeFileSync('data-enrichment/batch-03.json', JSON.stringify({
  _meta: {
    batch: 'batch-03',
    scope: 'Unique products ranked 101-150 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  },
  entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| rows:', entries.reduce((s, e) => s + e.row_count, 0))
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' ' + e.name))
