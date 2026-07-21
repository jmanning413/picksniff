// Builds data-enrichment/batch-02.json — products ranked 51-100 by row count.
// Same provenance rules as batch-01: compiled from general knowledge, never
// scraped. See docs/CATALOG.md Stage A.
//
// Entries are positional (rank order) rather than keyed by name string, because
// several manifest names carry escaped unicode (Chance Eau Fraîche, Chanel N°5).
// Each carries an `expect` fragment that is validated against the manifest so a
// reordered manifest fails loudly instead of silently misassigning pyramids.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const ranked = [...manifest].sort((a, b) => b.ids.length - a.ids.length)
const slice = ranked.slice(50, 100)

const N = (expect, confidence, top, middle, base, description, note) =>
  ({ expect, confidence, top, middle, base, description, note })
const GAP = (expect, reason) => ({ expect, confidence: 'low', reason })

const DATA = [
  N('Ombre Nomade', 'medium', ['Raspberry', 'Saffron'], ['Oud', 'Rose', 'Incense'], ['Benzoin', 'Birch', 'Guaiac Wood', 'Amber'],
    'Dense oud and incense lifted by a jammy raspberry note. Heavy, resinous and unmistakably opulent.'),
  N('Beach Walk', 'high', ['Bergamot', 'Pink Pepper', 'Lemon'], ['Coconut Milk', 'Ylang-Ylang', 'Heliotrope'], ['Musk', 'Cedar', 'Benzoin'],
    'Coconut milk and warm skin over soft musk. Smells like sunscreen on a hot beach, in the best way.'),
  N('Jazz Club', 'high', ['Pink Pepper', 'Neroli', 'Lemon'], ['Rum', 'Clary Sage', 'Vanilla'], ['Tobacco Leaf', 'Vetiver', 'Styrax', 'Benzoin'],
    'Boozy rum and sweet tobacco in a wood-panelled room. Warm, smoky and very easy to like.'),
  GAP('Nautica Classic', 'Older mass-market release with inconsistent published note lists. Cannot ground reliably.'),
  N('Olymp', 'high', ['Water Jasmine', 'Green Mandarin'], ['Salted Vanilla', 'Ginger Flower'], ['Sandalwood', 'Cashmere Wood', 'Ambergris'],
    'Salted vanilla against fresh jasmine. Sweet but with a saline edge that keeps it from cloying.'),
  N('Invictus', 'high', ['Grapefruit', 'Marine Notes', 'Mandarin'], ['Bay Leaf', 'Jasmine'], ['Ambergris', 'Guaiac Wood', 'Oakmoss', 'Patchouli'],
    'Bright grapefruit over a salty marine accord and warm woods. Loud, fresh and built for crowds.'),
  GAP('Galloway', 'Lower-profile Parfums de Marly release; published pyramid varies by source. Cannot ground reliably.'),
  N('Blenheim Bouquet', 'medium', ['Lemon', 'Lime', 'Lavender'], ['Pine', 'Black Pepper'], ['Musk', 'Black Pepper'],
    'Sharp citrus and pine with a peppery bite. A Victorian classic that still reads crisp and clean.'),
  N('Alien', 'medium', ['Jasmine Sambac'], ['Cashmeran'], ['White Amber', 'Woody Notes'],
    'A huge, solar jasmine over warm amber woods. Minimal in structure but enormous in presence.'),
  N('Velvet Orchid', 'medium', ['Bergamot', 'Mandarin', 'Honey', 'Rum'], ['Orchid', 'Jasmine', 'Rose', 'Narcissus'], ['Sandalwood', 'Vanilla', 'Myrrh', 'Labdanum'],
    'Honeyed florals over creamy sandalwood and vanilla. Lush, sweet and deliberately excessive.'),
  N('Tobacco Vanille', 'high', ['Tobacco Leaf', 'Spicy Notes'], ['Vanilla', 'Cacao', 'Tonka Bean', 'Tobacco Blossom'], ['Dried Fruits', 'Woody Notes'],
    'Pipe tobacco steeped in vanilla and dried fruit. Rich, gourmand and unapologetically wintry.'),
  N('Eros', 'high', ['Mint', 'Green Apple', 'Lemon'], ['Tonka Bean', 'Ambroxan', 'Geranium'], ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar'],
    'Cool mint and green apple crashing into sweet tonka and vanilla. Bold, sweet and impossible to miss.'),
  N('Dylan Blue', 'high', ['Bergamot', 'Grapefruit', 'Fig Leaf', 'Water Notes'], ['Violet Leaf', 'Papyrus', 'Black Pepper', 'Patchouli'], ['Musk', 'Tonka Bean', 'Saffron', 'Incense'],
    'Aquatic citrus over papyrus and dry musk. Fresh at the open, darker and woodier as it settles.'),
  N('Flowerbomb', 'high', ['Tea', 'Bergamot', 'Osmanthus'], ['Jasmine', 'Orange Blossom', 'Freesia', 'Rose'], ['Patchouli', 'Musk', 'Vanilla'],
    'An explosion of sweet florals over patchouli and vanilla. Enormous projection, instantly recognisable.'),
  GAP('Alexandria II', 'Limited-distribution Xerjoff release; note lists differ between sources. Cannot ground reliably.'),
  GAP('40 Knots', 'Lower-profile Xerjoff release. Cannot ground a reliable pyramid.'),
  N('Libre', 'medium', ['Lavender', 'Mandarin', 'Blackcurrant', 'Petitgrain'], ['Lavender', 'Orange Blossom', 'Jasmine'], ['Vanilla', 'Musk', 'Cedar', 'Ambergris'],
    'Lavender pulled in two directions, sharp up top and creamy vanilla underneath. Modern and confident.',
    'Libre ships as EDT, EDP and Intense with differing pyramids. Confirm the EDT-specific list.'),
  N('| Y |', 'medium', ['Bergamot', 'Ginger', 'Aldehydes'], ['Sage', 'Geranium', 'Violet Leaf'], ['Cedar', 'Vetiver', 'Tonka Bean'],
    'Crisp aldehydes and sage over dry cedar. Clean and modern, closer to a sharp shirt than a statement.'),
  N('Reflection Man', 'medium', ['Rosemary', 'Pink Pepper', 'Bergamot'], ['Jasmine', 'Orris', 'Neroli'], ['Sandalwood', 'Cedar', 'Vetiver', 'Musk'],
    'Powdery jasmine and orris over smooth sandalwood. Polished and quietly formal.'),
  N('Interlude Man', 'medium', ['Bergamot', 'Oregano', 'Pimento'], ['Frankincense', 'Amber', 'Opoponax'], ['Leather', 'Patchouli', 'Sandalwood', 'Agarwood'],
    'A wall of smoky incense and resin over leather. Famously dense, not remotely casual.'),
  N('Burberry Her', 'medium', ['Strawberry', 'Blackcurrant', 'Raspberry', 'Blackberry'], ['Violet', 'Jasmine'], ['Musk', 'Amber', 'Patchouli', 'Woody Notes'],
    'A jammy berry opening softened by violet and musk. Sweet, youthful and very wearable.'),
  N('Goddess', 'medium', ['Lavender', 'Ginger'], ['Vanilla Absolute', 'Vanilla Caviar'], ['Vanilla Bourbon', 'Cacao'],
    'Vanilla layered three ways, cut with lavender so it never turns flat. Warm, creamy and modern.'),
  N('Goddess', 'medium', ['Lavender', 'Ginger'], ['Vanilla Absolute', 'Vanilla Caviar'], ['Vanilla Bourbon', 'Cacao'],
    'The richer concentration of the vanilla-and-lavender signature, deeper and longer lasting.',
    'Parfum concentration. Reflects the Goddess vanilla DNA; confirm the Parfum-specific list against the brand page.'),
  N('Omnia Crystalline', 'medium', ['Bamboo', 'Nashi Pear'], ['Lotus Flower'], ['Balsa Wood', 'Musk'],
    'Watery pear and bamboo over pale woods. Light, translucent and almost weightless.'),
  N("Angels' Share", 'medium', ['Cognac'], ['Cinnamon', 'Tonka Bean', 'Praline'], ['Oak', 'Vanilla', 'Sandalwood'],
    'Cognac and toasted oak wrapped in praline and vanilla. Boozy, dessert-like and very warm.'),
  N('Mojave Ghost', 'medium', ['Ambrette', 'Jamaican Nesberry'], ['Violet', 'Sandalwood', 'Magnolia'], ['Musk', 'Cedar', 'Amber'],
    'Soft woods and powdery violet with a dry, desert-air quality. Understated and skin-close.'),
  N("Bal d'Afrique", 'medium', ['Bergamot', 'Lemon', 'Neroli', 'Marigold'], ['Violet', 'Jasmine', 'Cyclamen'], ['Black Amber', 'Musk', 'Vetiver', 'Cedar'],
    'Bright citrus and marigold over warm amber and vetiver. Sunny up top, smoky underneath.'),
  N('Bibliotheque', 'medium', ['Peach', 'Plum'], ['Peony', 'Violet'], ['Patchouli', 'Vanilla', 'Leather'],
    'Stewed fruit and vanilla over leather and old paper. Cosy and bookish, exactly as intended.'),
  N('CK Free', 'medium', ['Jackfruit', 'Star Anise', 'Coriander'], ['Blue Sage', 'Tobacco Leaf'], ['Suede', 'Sandalwood', 'Amber', 'Tonka Bean'],
    'Spiced tobacco and suede over warm amber. Dry and masculine without being heavy.'),
  N('Chance Eau Tendre', 'medium', ['Grapefruit', 'Quince'], ['Jasmine', 'Rose'], ['Musk', 'Amber', 'Iris'],
    'Soft grapefruit and quince over powdery musk. The gentlest member of the Chance family.'),
  N('Coco Mademoiselle Intense', 'medium', ['Orange', 'Bergamot', 'Mandarin'], ['Jasmine', 'Rose', 'Ylang-Ylang'], ['Patchouli', 'Vanilla', 'Tonka Bean', 'White Musk'],
    'The Coco Mademoiselle signature pushed warmer and deeper, with more vanilla and tonka.',
    'Intense flanker. Shares the original DNA but the exact list differs; confirm against the brand page.'),
  N('Fra', 'medium', ['Lemon', 'Citron'], ['Jasmine', 'Water Hyacinth'], ['Teak', 'Amber', 'Patchouli', 'Vetiver'],
    'Sparkling citrus over clean woods. The crispest, most transparent Chance.'),
  N('Bleu de Chanel', 'high', ['Grapefruit', 'Lemon', 'Mint', 'Pink Pepper', 'Aldehydes'], ['Ginger', 'Nutmeg', 'Jasmine', 'Iso E Super'], ['Incense', 'Amber', 'Sandalwood', 'Patchouli', 'Cedar', 'Labdanum'],
    'The Bleu signature in a richer register: same citrus and ginger opening, but warmer and more resinous in the dry-down.',
    'This is the EDP, a genuinely different pyramid from the EDT (which is a separate catalog product). Warmer, more amber and sandalwood.'),
  N('Allure Homme Sport', 'medium', ['Orange', 'Aldehydes', 'Sea Notes', 'Mandarin'], ['Pepper', 'Neroli', 'Cedar'], ['Tonka Bean', 'White Musk', 'Vetiver', 'Vanilla', 'Amber'],
    'Clean citrus and sea air over soft tonka and musk. Fresh, polished and endlessly office-safe.'),
  N('5', 'high', ['Aldehydes', 'Ylang-Ylang', 'Neroli', 'Bergamot', 'Lemon'], ['Iris', 'Jasmine', 'Rose', 'Lily-of-the-Valley'], ['Sandalwood', 'Vetiver', 'Vanilla', 'Amber', 'Patchouli', 'Musk'],
    'The most famous fragrance ever made: soapy aldehydes over a vast floral heart and warm woods. A genuine historical artefact.'),
  N('Aromatics Elixir', 'medium', ['Verbena', 'Bergamot', 'Chamomile', 'Aldehydes'], ['Jasmine', 'Rose', 'Ylang-Ylang', 'Orris', 'Patchouli'], ['Oakmoss', 'Sandalwood', 'Musk', 'Incense'],
    'A dense, herbal chypre with rose and patchouli at its core. Divisive, powerful and utterly of its era.'),
  N('Clinique Happy', 'medium', ['Grapefruit', 'Bergamot', 'Lemon', 'Mandarin'], ['Freesia', 'Magnolia', 'Rose', 'Orchid'], ['Musk', 'Amber', 'Cedar', 'Mahogany'],
    'Zesty grapefruit over soft florals. Bright, uncomplicated and exactly as cheerful as the name suggests.'),
  N('Fleurissimo', 'medium', ['Bergamot', 'Violet'], ['Tuberose', 'Rose', 'Violet'], ['Orris', 'Ambergris'],
    'A classical white-floral bouquet built around tuberose and rose. Formal, bridal and old-world.'),
  N('Aventus for Her', 'medium', ['Bergamot', 'Green Apple', 'Violet', 'Pink Pepper'], ['Rose', 'Sandalwood', 'Blackcurrant'], ['Musk', 'Amber', 'Peach', 'Ylang-Ylang'],
    'A fruity rose over soft woods and musk. Shares the fruit-and-wood idea of Aventus without copying it.'),
  N('Original Vetiver', 'medium', ['Bergamot', 'Mandarin', 'Ginger'], ['Vetiver'], ['Amber', 'Musk', 'Sandalwood', 'Tonka Bean'],
    'Clean, green vetiver with a citrus lift and a soft amber finish. Crisp and understated.'),
  N('Imp', 'medium', ['Bergamot', 'Lemon', 'Sea Salt'], ['Iris', 'Sicilian Lemon'], ['Musk', 'Sandalwood'],
    'Salted citrus over soft iris and musk. Airy and sophisticated, built for warm weather.'),
  N('Virgin Island Water', 'medium', ['Lime', 'Coconut', 'Mandarin'], ['Ylang-Ylang', 'Sugar Cane', 'Ginger'], ['White Rum', 'Musk'],
    'Lime, coconut and rum. A holiday cocktail rendered almost literally, and all the better for it.'),
  N('Davidoff Cool Water', 'high', ['Sea Water', 'Mint', 'Lavender', 'Coriander', 'Rosemary', 'Green Notes'], ['Sandalwood', 'Neroli', 'Geranium', 'Jasmine'], ['Musk', 'Cedar', 'Oakmoss', 'Amber', 'Tobacco'],
    'The fragrance that invented the aquatic genre: sea spray, mint and lavender over warm woods.',
    'DUPLICATE PRODUCT: this is the same fragrance as the "Cool Water" row enriched in batch-01, listed separately only because the catalog name carries a redundant brand prefix. Pyramid intentionally identical. Candidate for the Stage A0 name repair.'),
  N('Miss Dior', 'medium', ['Bergamot', 'Mandarin'], ['Rose', 'Peony', 'Lily-of-the-Valley'], ['Patchouli', 'Musk', 'Sandalwood'],
    'A bright rose over clean patchouli. Modern and polished, a long way from the original 1947 chypre.',
    'Miss Dior has been reformulated repeatedly and the name covers several distinct compositions. Confirm which against the brand page.'),
  N("J'adore", 'medium', ['Pear', 'Melon', 'Magnolia', 'Bergamot'], ['Jasmine', 'Rose', 'Orchid', 'Violet'], ['Musk', 'Vanilla', 'Cedar', 'Blackberry'],
    'A glossy, fruity floral built on jasmine and rose. Polished and universally flattering.'),
  N('Blooming Bouquet', 'medium', ['Sicilian Mandarin'], ['Peony', 'Rose', 'Apricot'], ['White Musk'],
    'Soft peony and apricot over clean musk. Gentle and powdery, the most casual of the Miss Dior line.'),
  N('Dior Homme', 'medium', ['Bergamot', 'Grapefruit'], ['Iris', 'Musk'], ['White Musk', 'Cedar'],
    'A pared-back citrus and iris over clean musk. The lightest, most transparent Dior Homme.',
    'Cologne concentration, materially lighter than the EDT and Intense, which are separate catalog rows.'),
  N('Fahrenheit', 'high', ['Lavender', 'Mandarin', 'Bergamot', 'Nutmeg', 'Hawthorn'], ['Violet Leaf', 'Carnation', 'Sandalwood', 'Jasmine'], ['Leather', 'Vetiver', 'Amber', 'Tonka Bean', 'Patchouli'],
    'Violet leaf and leather over a petrol-like accord that nothing else has replicated. Strange, divisive and genuinely iconic.'),
  N('Dior Homme Intense', 'medium', ['Lavender'], ['Iris', 'Ambrette', 'Pear'], ['Vetiver', 'Virginia Cedar'],
    'Buttery iris over soft woods. Refined, powdery and quietly formal.'),
  N('Sauvage', 'high', ['Bergamot', 'Sichuan Pepper'], ['Lavender', 'Star Anise', 'Nutmeg'], ['Ambroxan', 'Vanilla', 'Sandalwood'],
    'The Sauvage idea made warmer and smoother, with vanilla softening the ambroxan.',
    'This is the EDP, a different pyramid from the EDT (a separate catalog product). Sweeter and less peppery.'),
]

if (DATA.length !== slice.length) {
  console.error(`Length mismatch: ${DATA.length} notes vs ${slice.length} manifest products`)
  process.exit(1)
}

// validate rank alignment
const bad = []
slice.forEach((p, i) => {
  const hay = `${p.brand} | ${p.name} | ${p.concentration}`
  if (!hay.includes(DATA[i].expect)) bad.push(`rank ${i + 51}: expected "${DATA[i].expect}" in "${hay}"`)
})
if (bad.length) {
  console.error('RANK MISALIGNMENT - manifest order changed, refusing to build:')
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
const out = {
  _meta: {
    batch: 'batch-02',
    scope: 'Unique products ranked 51-100 by catalog row count, from data-enrichment/manifest.json',
    created: '2026-07-21',
    provenance: 'Compiled from general knowledge of widely documented fragrances. No scraped or third-party dataset content (CATALOG.md rule 1).',
    review_gate: 'Nothing merges into /fragrances/*.json without explicit sign-off (CATALOG.md rule 5).',
    counts, products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  },
  entries,
}

writeFileSync('data-enrichment/batch-02.json', JSON.stringify(out, null, 2) + '\n')
console.log('counts:', counts)
console.log('products:', entries.length, '| rows covered:', out._meta.catalog_rows_covered)
console.log('\nLOW (honest gaps):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' ' + e.name))
console.log('\nCaveat notes:')
entries.filter((e) => e.note).forEach((e) => console.log('  - ' + e.brand + ' ' + e.name))
