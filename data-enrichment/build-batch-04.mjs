// Builds data-enrichment/batch-04.json — products ranked 151-200 by row count.
// Same rules: compiled from general knowledge, never scraped. Entries that
// cannot be grounded ship as null and are researched separately.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(150, 200)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })

const DATA = [
  N('Oud Wood', 'high', ['Rosewood', 'Cardamom', 'Chinese Pepper'], ['Oud', 'Sandalwood', 'Vetiver'], ['Tonka Bean', 'Vanilla', 'Amber'],
    'Smooth oud and sandalwood over warm tonka. The approachable oud, dry and refined rather than medicinal.'),
  N('Tuscan Leather', 'high', ['Thyme', 'Raspberry', 'Saffron'], ['Leather', 'Jasmine', 'Olibanum'], ['Amber', 'Suede', 'Woody Notes'],
    'Raw leather cut with jammy raspberry. Dense, animalic and one of the most distinctive things Tom Ford makes.'),
  N('Crystal Noir', 'medium', ['Ginger', 'Cardamom', 'Pepper'], ['Gardenia', 'Orange Blossom', 'Coconut'], ['Amber', 'Sandalwood', 'Musk', 'Tonka Bean'],
    'Creamy gardenia and coconut over warm amber. Soft and spicy, closer to velvet than to crystal.'),
  N('Versace Pour Homme', 'medium', ['Lemon', 'Bergamot', 'Neroli', 'Rose de Mai'], ['Hyacinth', 'Clary Sage', 'Cedar', 'Geranium'], ['Musk', 'Tonka Bean', 'Amber'],
    'Clean citrus and herbs over soft musk. Inoffensive, well-made and endlessly wearable.'),
  N('Eros Flame', 'medium', ['Lemon', 'Black Pepper', 'Mandarin', 'Rosemary'], ['Pepper', 'Geranium', 'Rosemary'], ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Patchouli', 'Cedar'],
    'The Eros sweetness redirected into citrus and pepper. Warmer and spicier, less minty than the original.'),
  N('Flowerbomb | Parfum', 'medium', ['Tea', 'Bergamot', 'Osmanthus'], ['Jasmine', 'Orange Blossom', 'Freesia', 'Rose'], ['Patchouli', 'Musk', 'Vanilla'],
    'The Flowerbomb floral explosion in its richest concentration, deeper and longer lasting.',
    'Parfum concentration of the Flowerbomb listed at rank 64 as EDP. Shares the DNA; confirm the Parfum-specific list.'),
  N('Spicebomb | EDT', 'high', ['Bergamot', 'Grapefruit', 'Pink Pepper', 'Elemi'], ['Cinnamon', 'Saffron', 'Paprika'], ['Tobacco', 'Leather', 'Vetiver'],
    'Warm cinnamon and paprika over tobacco and leather. Spicy and enveloping, built for cold weather.'),
  N('Spicebomb Extreme', 'medium', ['Black Pepper', 'Lavender'], ['Cinnamon', 'Cumin'], ['Tobacco', 'Vanilla'],
    'The Spicebomb idea stripped down and darkened: pepper and cumin over sweet tobacco and vanilla.'),
  N('Naxos', 'medium', ['Bergamot', 'Lavender', 'Lemon'], ['Honey', 'Cinnamon', 'Cashmeran'], ['Tobacco', 'Tonka Bean', 'Vanilla', 'Benzoin'],
    'Honeyed tobacco over vanilla and tonka. Rich and golden, the Xerjoff everyone recommends first.'),
  N('Laurent Libre', 'medium', ['Mandarin Orange', 'Blackcurrant', 'Bergamot', 'Lavender'], ['Lavender', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Musk', 'Cedar', 'Ambergris'],
    'Sharp lavender over creamy vanilla, in the eau de parfum concentration.',
    'EDP concentration; the Libre EDT and Parfum are separate catalog rows with differing lists.'),
  N('Black Opium', 'high', ['Pear', 'Pink Pepper', 'Orange Blossom'], ['Coffee', 'Jasmine', 'Bitter Almond', 'Licorice'], ['Vanilla', 'Patchouli', 'Cedar', 'Cashmere Wood'],
    'A jolt of black coffee wrapped in sweet vanilla and white flowers. Addictive and nocturnal.',
    'Likely a duplicate manifest entry of the Black Opium enriched in batch-01. Pyramid intentionally identical.'),
  N('| Opium |', 'medium', ['Coriander', 'Plum', 'Clove', 'Bergamot', 'Pepper'], ['Carnation', 'Jasmine', 'Rose', 'Cinnamon', 'Lily-of-the-Valley'], ['Amber', 'Patchouli', 'Vanilla', 'Myrrh', 'Incense', 'Sandalwood'],
    'A monumental spicy oriental from 1977. Clove, amber and incense, worn like a statement rather than a scent.'),
  N('Libre | Parfum', 'medium', ['Mandarin Orange', 'Blackcurrant', 'Lavender'], ['Lavender', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Musk', 'Cedar', 'Ambergris'],
    'The richest Libre concentration, with the vanilla pushed forward.',
    'Parfum concentration; the EDT and EDP are separate catalog rows. Confirm the Parfum-specific list.'),
  N('Dynamic Pulse', 'medium', ['Mandarin Orange', 'Grapefruit', 'Mint', 'Cedar Leaves'], ['Mango', 'Apple', 'Floral Notes'], ['Patchouli', 'Sandalwood', 'Tonka Bean', 'Rockrose'],
    'Mint and grapefruit over a fruity heart and soft woods. Sporty and cheerfully uncomplicated.',
    'RESEARCHED against retailer listings (Fragrance Outlet, Perfumania, Amazon) 2026-07-21.'),
  N('Blossom Love', 'high', ['Cherry Blossom', 'Rose Liquor'], ['Ylang-Ylang', 'Amaretto', 'Vanilla'], ['Tonka Bean', 'Sandalwood', 'Cashmeran'],
    'Cherry blossom and amaretto over creamy tonka. Sweet and almond-tinged, unusually gourmand for Amouage.',
    'RESEARCHED against the OFFICIAL Amouage product page (amouage.com) plus Nordstrom and Harvey Nichols 2026-07-21.'),
  N('| Gold Woman |', 'medium', ['Rose', 'Frankincense', 'Lily-of-the-Valley'], ['Jasmine', 'Orris', 'Ylang-Ylang'], ['Myrrh', 'Musk', 'Sandalwood', 'Amber', 'Civet'],
    'A dense, powdery floral over myrrh and animalic musk. Opulent and unmistakably old-school Amouage.'),
  N('Amouage Gold Woman', 'medium', ['Rose', 'Frankincense', 'Lily-of-the-Valley'], ['Jasmine', 'Orris', 'Ylang-Ylang'], ['Myrrh', 'Musk', 'Sandalwood', 'Amber', 'Civet'],
    'A dense, powdery floral over myrrh and animalic musk. Opulent and unmistakably old-school Amouage.',
    'DUPLICATE PRODUCT: same fragrance as the "Gold Woman" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Interlude Woman', 'medium', ['Bergamot', 'Coriander', 'Ginger'], ['Rose', 'Jasmine', 'Amber', 'Oregano'], ['Frankincense', 'Patchouli', 'Opoponax', 'Leather', 'Vanilla'],
    'Smoky incense and resin under a rich floral heart. Heavy and dramatic, softer than the Interlude Man.'),
  N('Interlude 53', 'high', ['Bergamot', 'Oregano', 'Pimento Berry'], ['Amber', 'Frankincense', 'Cistus', 'Opoponax'], ['Leather', 'Agarwood', 'Patchouli', 'Sandalwood'],
    'The Interlude accord at extreme concentration: incense, resin and leather pushed far past comfortable.',
    'RESEARCHED against the OFFICIAL Amouage product page 2026-07-21. This is Interlude 53 Man, an extrait at 53 percent oil concentration versus 25 percent for the standard Interlude EDP.'),
  N('Amouage Interlude | EDP', 'medium', ['Bergamot', 'Oregano', 'Pimento'], ['Frankincense', 'Amber', 'Opoponax'], ['Leather', 'Patchouli', 'Sandalwood', 'Agarwood'],
    'A wall of smoky incense and resin over leather. Famously dense, not remotely casual.',
    'DISAMBIGUATED 2026-07-21: the catalog name omits Man or Woman, but this row carries accords Woody, Amber, Aromatic, which match Interlude Man exactly (Interlude Woman is Floral, Amber, Vanilla). Resolved to Interlude Man; pyramid deliberately matches that row.'),
  N('| Ari |', 'medium', ['Raspberry', 'Grapefruit', 'Bergamot'], ['Jasmine', 'Peony', 'Lily-of-the-Valley'], ['Vanilla', 'Musk', 'Marshmallow', 'Woody Notes'],
    'Sweet berries and marshmallow over soft musk. Uncomplicated, sugary and aimed squarely at fun.'),
  N('| Cloud |', 'high', ['Lavender', 'Pear', 'Bergamot'], ['Coconut', 'Praline', 'Vanilla Orchid'], ['Musk', 'Cashmere Wood', 'Woody Notes'],
    'Coconut praline and lavender over creamy musk. A genuine phenomenon, and much better made than it needed to be.'),
  N('Thank U Next', 'medium', ['Raspberry', 'Pear', 'Bergamot'], ['Rose', 'Jasmine', 'Orris'], ['Musk', 'Vanilla', 'Sandalwood'],
    'Pink berries and rose over creamy vanilla. Sweet, soft and unabashedly commercial.'),
  N('Ariana Grande Cloud', 'high', ['Lavender', 'Pear', 'Bergamot'], ['Coconut', 'Praline', 'Vanilla Orchid'], ['Musk', 'Cashmere Wood', 'Woody Notes'],
    'Coconut praline and lavender over creamy musk. A genuine phenomenon, and much better made than it needed to be.',
    'DUPLICATE PRODUCT: same fragrance as the "Cloud" row, listed twice due to a redundant brand prefix. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Incandessence', 'medium', ['Orchid', 'Lily-of-the-Valley', 'Cyclamen'], ['Tulip', 'Peony'], ['Orchid', 'Musk'],
    'A soft, powdery floral built around orchid and peony. Gentle and easy, aimed at everyday wear.',
    'RESEARCHED 2026-07-21. Resolved to the original Incandessence (2000). Avon has released many flankers (Lumiere, Lotus, Enjoy, Soleil, Summer Glow, Bright) with different pyramids; worth confirming which one this catalog row is.'),
  N('Forbidden Rose', 'medium', ['Red Apple', 'Peach', 'Pepper'], ['Lotus', 'Green Apple', 'Heliotrope'], ['Vanilla', 'Chocolate', 'Sandalwood'],
    'Red apple and peach over vanilla and chocolate. A fruity gourmand, sweet and firmly of its moment.',
    'RESEARCHED against retailer listings and Osmoz 2026-07-21.'),
  N('Azzaro Pour Homme | EDT', 'high', ['Lavender', 'Anise', 'Lemon', 'Basil', 'Caraway', 'Bergamot'], ['Vetiver', 'Cardamom', 'Sandalwood', 'Coriander', 'Jasmine', 'Patchouli'], ['Leather', 'Amber', 'Musk', 'Oakmoss', 'Tonka Bean', 'Cedar'],
    'A towering fougere from 1978: anise and lavender over leather and moss. Barbershop in the grandest sense.'),
  N('The Most Wanted | EDP', 'medium', ['Cardamom', 'Ginger'], ['Toffee', 'Amberwood'], ['Vanilla', 'Woody Notes'],
    'Spiced cardamom over toffee and amberwood. Sweet, warm and very loud.'),
  N('Wanted by Night', 'medium', ['Cinnamon', 'Red Fruits', 'Spicy Notes'], ['Tobacco', 'Cedar', 'Vetiver'], ['Vanilla', 'Tonka Bean', 'Benzoin'],
    'Cinnamon and red fruit over tobacco and vanilla. Dark, sweet and built for evenings.'),
  N('Azzaro Wanted | EDT', 'medium', ['Lemon', 'Ginger', 'Mint', 'Lavender'], ['Cardamom', 'Juniper', 'Apple', 'Vetiver'], ['Tonka Bean', 'Amberwood', 'Haitian Vetiver'],
    'Zesty lemon and ginger over warm tonka. Bright up top, comfortably sweet underneath.'),
  N('Pour Homme Intense', 'medium', ['Lavender', 'Anise', 'Bergamot'], ['Cardamom', 'Sandalwood', 'Jasmine'], ['Leather', 'Amber', 'Tonka Bean', 'Cedar'],
    'The Azzaro Pour Homme fougere rendered denser and warmer.',
    'Intense concentration of the Azzaro Pour Homme at rank 177. Shares the DNA; confirm the Intense-specific list.'),
  N('Most Wanted | Parfum', 'medium', ['Cardamom', 'Ginger'], ['Toffee', 'Amberwood'], ['Vanilla', 'Woody Notes'],
    'The Most Wanted signature in its richest concentration.',
    'Parfum concentration of the EDP at rank 178. Confirm the Parfum-specific list against the brand page.'),
  N('Chrome Sport', 'medium', ['Lemon', 'Bergamot', 'Grapefruit', 'Mint'], ['Jasmine', 'Cyclamen', 'Cardamom'], ['Musk', 'Cedar', 'Vetiver', 'Amber'],
    'Sharp citrus and mint over clean musk. Crisp, sporty and deliberately simple.'),
  N('Warm Vanilla Sugar', 'medium', ['Vanilla', 'White Orchid'], ['Sugar', 'Tonka Bean', 'Coconut', 'Jasmine'], ['Vanilla', 'Sandalwood', 'Cacao'],
    'Sweet vanilla and sugar over creamy sandalwood. Comforting, edible and enormously popular.',
    'RESEARCHED against the OFFICIAL Bath and Body Works product page 2026-07-21. Reflects the current 2021 formula; the 1999 original differed (rice, heliotrope, musk).'),
  N('Sweet Pea', 'medium', ['Sweet Pea', 'Pear', 'Tayberry', 'Blackcurrant'], ['Raspberry', 'Freesia', 'Pink Peony'], ['Plum Tree', 'Musk'],
    'Pear and berries over soft freesia and peony. Light, fruity-floral and instantly familiar.',
    'RESEARCHED against the OFFICIAL Bath and Body Works product page 2026-07-21.'),
  N('Curious', 'medium', ['Magnolia', 'Golden Anjou Pear', 'Lotus'], ['Tuberose', 'Jasmine', 'Star Magnolia'], ['Vanilla', 'Musk', 'Sandalwood', 'Blonde Woods'],
    'Pear and magnolia over soft vanilla musk. Clean, sweet and very mid-2000s.'),
  N('Fantasy', 'medium', ['Quince', 'Litchi', 'Kiwi'], ['Jasmine', 'White Chocolate', 'Orchid'], ['Musk', 'Orris Root', 'Woody Notes'],
    'Litchi and white chocolate over powdery musk. A cupcake of a fragrance, and proudly so.'),
  N('London Dream', 'medium', ['Bergamot', 'Strawberry'], ['Rose', 'Jasmine', 'Peony'], ['Musk', 'Woody Notes'],
    'Soft rose and strawberry over clean musk. Light, pretty and easy to wear.'),
  N('London for Men', 'medium', ['Bergamot', 'Lavender', 'Cinnamon'], ['Mimosa', 'Leather', 'Port Wine'], ['Guaiac Wood', 'Tobacco Leaf', 'Oakmoss'],
    'Port wine and leather over tobacco and moss. Warm, boozy and distinctly wintry.'),
  N('Mr. Burberry', 'medium', ['Tarragon', 'Cardamom', 'Grapefruit'], ['Nutmeg', 'Birch Leaf', 'Lavender'], ['Vetiver', 'Guaiac Wood', 'Benzoin', 'Amber'],
    'Herbal tarragon and cardamom over dry vetiver. Clean and modern without being generic.'),
  N('Hero', 'medium', ['Bergamot', 'Black Pepper', 'Juniper'], ['Cedar', 'Cypress'], ['Benzoin', 'Incense', 'Vetiver'],
    'Three cedars over incense and benzoin. Dry, woody and unusually single-minded.'),
  N('Brit for Men Sport', 'medium', ['Ginger', 'Cardamom', 'Green Mandarin', 'Bergamot'], ['Wild Rose', 'Nutmeg', 'Cedar'], ['Tonka Bean', 'Musk', 'Cedar', 'Patchouli'],
    'Ginger and cardamom over nutmeg and warm cedar. Sharp and spicy with a soft tonka finish.',
    'RESEARCHED 2026-07-21. Sources document the Brit for Men line consistently, but the Sport flanker is discontinued and its own list is sparsely reported, so this reflects the Brit for Men structure. Flagged for confirmation.'),
  N('Aqva pour Homme', 'medium', ['Petitgrain', 'Mandarin Orange'], ['Posidonia', 'Santolina'], ['Amber', 'Clary Sage', 'Woody Notes'],
    'A seaweed accord over warm amber. Genuinely marine rather than generically fresh, and quietly distinctive.'),
  N('Man In Black Essence', 'medium', ['Spices', 'Rum'], ['Floral Notes', 'Musk'], ['Resin', 'Guaiac Wood', 'Amber'],
    'Boozy rum and spice over resin and guaiac wood. Dark and warm, a lighter reading of the Man in Black idea.',
    'RESEARCHED against FragranceX and Basenotes 2026-07-21. Bvlgari publishes only broad accords for this flanker rather than a specific note list, so this pyramid is unusually coarse. Flagged for re-verification if precision ever matters.'),
  N('Vert', 'medium', ['Bergamot', 'Orange Blossom', 'Lemon', 'Bulgarian Rose'], ['Green Tea', 'Jasmine', 'Carnation', 'Pepper'], ['Musk', 'Oakmoss', 'Cedar', 'Beeswax'],
    'The original green tea fragrance: bitter tea over citrus and soft musk. Clean, calm and widely imitated.'),
  N('Bvlgari Aqva | EDT', 'medium', ['Petitgrain', 'Mandarin Orange'], ['Posidonia', 'Santolina'], ['Amber', 'Clary Sage', 'Woody Notes'],
    'A seaweed accord over warm amber. Genuinely marine rather than generically fresh.',
    'DUPLICATE PRODUCT: appears to be the same fragrance as the "Bvlgari Aqva pour Homme" row. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N("| Bal d'Afrique |", 'medium', ['Bergamot', 'Lemon', 'Neroli', 'Marigold'], ['Violet', 'Jasmine', 'Cyclamen'], ['Black Amber', 'Musk', 'Vetiver', 'Cedar'],
    'Bright citrus and marigold over warm amber and vetiver. Sunny up top, smoky underneath.',
    'DUPLICATE PRODUCT: same fragrance as the "Byredo Bal d\'Afrique" row enriched in batch-02. Pyramid intentionally identical. Stage A0 repair candidate.'),
  N('Sundazed', 'high', ['Mandarin Orange', 'Californian Lemon'], ['Neroli', 'Jasmine Sambac'], ['Cotton Candy', 'White Musk'],
    'Bright citrus and neroli over spun sugar. Sunny and playful, lighter than most of the Byredo line.',
    'RESEARCHED against the OFFICIAL Byredo product page (byredo.com) plus Space NK 2026-07-21.'),
  N('Sunday Cologne', 'high', ['Bergamot', 'Cardamom', 'Star Anise'], ['Incense', 'Geranium', 'Lavender'], ['Moss', 'Patchouli', 'Vetiver'],
    'Crisp bergamot and cardamom over incense and moss. A relaxed, slightly smoky cologne.',
    'RESEARCHED against the OFFICIAL Byredo product page (byredo.com) plus Harvey Nichols 2026-07-21.'),
  N('Eternity for Men', 'high', ['Lavender', 'Mandarin Orange', 'Bergamot', 'Lemon', 'Sage'], ['Coriander', 'Jasmine', 'Lily-of-the-Valley', 'Basil', 'Geranium'], ['Sandalwood', 'Vetiver', 'Musk', 'Amber'],
    'A clean aromatic fougere built on lavender and sage. Crisp, soapy and a genuine nineties benchmark.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} vs ${slice.length}`); process.exit(1)
}
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 151}: expected "${DATA[i].expect}" in "${hay}"`)
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
writeFileSync('data-enrichment/batch-04.json', JSON.stringify({
  _meta: {
    batch: 'batch-04', scope: 'Unique products ranked 151-200 by catalog row count.',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge. No scraped or third-party dataset content (CATALOG.md rule 1).',
    counts, products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  }, entries,
}, null, 2) + '\n')
console.log('counts:', counts, '| rows:', entries.reduce((s, e) => s + e.row_count, 0))
console.log('\nLOW (need research):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' | ' + e.name))
