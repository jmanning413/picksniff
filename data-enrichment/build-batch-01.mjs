// Builds data-enrichment/batch-01.json for docs/CATALOG.md Stage A.
//
// PROVENANCE: every pyramid below is compiled from general knowledge of widely
// documented fragrances. Nothing here is scraped, imported, or derived from
// Fragrantica/Parfumo or any third-party dataset (CATALOG.md rule 1).
//
// Product identity (brand/name/concentration/tier/accords) and the id lists are
// joined from manifest.json so they match the live catalog verbatim.
//
// HONESTY RULE: confidence "low" entries carry null notes + needs_verification.
// We never emit a plausible-sounding pyramid we cannot ground.

import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('data-enrichment/manifest.json', 'utf8'))
const key = (p) => `${p.brand}|${p.name}|${p.concentration}`

// brand|name|concentration -> pyramid + confidence
const NOTES = {
  'Carolina Herrera|Good Girl|EDP': {
    confidence: 'high',
    top: ['Almond', 'Coffee'],
    middle: ['Tuberose', 'Jasmine Sambac', 'Bulgarian Rose', 'Orange Blossom'],
    base: ['Tonka Bean', 'Cacao', 'Vanilla', 'Praline', 'Sandalwood', 'Musk'],
    description: 'Roasted coffee and bitter almond over a bed of white flowers, landing on praline and tonka. Sweet and dark at once, built for evenings.',
  },
  'Jo Malone|Jo Malone Wood Sage & Sea Salt|Cologne': {
    confidence: 'high',
    top: ['Ambrette Seeds', 'Grapefruit'],
    middle: ['Sea Salt'],
    base: ['Sage', 'Red Algae'],
    description: 'A windswept shoreline in a bottle: mineral sea salt against earthy sage. Airy, dry, and deliberately understated.',
  },
  'Lacoste|Lacoste L.12.12 Blanc|EDT': {
    confidence: 'medium',
    top: ['Grapefruit', 'Rosemary', 'Cardamom'],
    middle: ['Tuberose', 'Ylang-Ylang', 'Woody Notes'],
    base: ['Virginia Cedar', 'Leather', 'Suede'],
    description: 'Crisp grapefruit and rosemary over a soft suede base. Clean and laundered, the definition of an easy daily wear.',
  },
  'Burberry|Burberry Hero|EDP': {
    confidence: 'medium',
    top: ['Bergamot', 'Black Pepper', 'Juniper Berries'],
    middle: ['Cedarwood', 'Pine'],
    base: ['Atlas Cedar', 'Virginia Cedar', 'Vetiver', 'Benzoin'],
    description: 'A study in cedar, layered three ways over bright bergamot and pepper. Woody and upright without turning heavy.',
    note: 'Hero ships as EDT, EDP and Elixir with differing pyramids. This reflects the core cedar-forward Hero DNA; confirm the EDP-specific list.',
  },
  'Byredo|Byredo Gypsy Water|EDP': {
    confidence: 'high',
    top: ['Bergamot', 'Lemon', 'Pepper', 'Juniper Berries'],
    middle: ['Incense', 'Pine Needles', 'Orris'],
    base: ['Amber', 'Vanilla', 'Sandalwood'],
    description: 'Pine and incense smoothed by vanilla and amber. Reads like a campfire the morning after, clean rather than smoky.',
  },
  'Calvin Klein|CK One|EDT': {
    confidence: 'high',
    top: ['Lemon', 'Bergamot', 'Cardamom', 'Pineapple', 'Papaya', 'Green Notes'],
    middle: ['Nutmeg', 'Violet', 'Orris Root', 'Jasmine', 'Rose', 'Lily-of-the-Valley'],
    base: ['Sandalwood', 'Cedar', 'Amber', 'Musk', 'Oakmoss', 'Green Tea'],
    description: 'The blueprint for shared fragrance: citrus and green tea over soft musk. Nineties to its core and still endlessly wearable.',
  },
  'Chanel|Bleu de Chanel|EDT': {
    confidence: 'high',
    top: ['Grapefruit', 'Lemon', 'Mint', 'Pink Pepper'],
    middle: ['Ginger', 'Nutmeg', 'Jasmine'],
    base: ['Incense', 'Vetiver', 'Cedar', 'Sandalwood', 'Patchouli', 'Labdanum', 'White Musk'],
    description: 'Citrus and mint sharpened by ginger, settling into smoky incense and cedar. Polished, versatile, hard to wear badly.',
  },
  'Creed|Creed Silver Mountain Water|EDP': {
    confidence: 'high',
    top: ['Bergamot', 'Mandarin'],
    middle: ['Green Tea', 'Blackcurrant'],
    base: ['Musk', 'Sandalwood', 'Petitgrain'],
    description: 'Green tea and blackcurrant over clean musk, cool as meltwater. Bright and transparent, built for warm days.',
  },
  'Creed|Creed Aventus|EDP': {
    confidence: 'high',
    top: ['Bergamot', 'Blackcurrant', 'Apple', 'Pineapple'],
    middle: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
    base: ['Oakmoss', 'Dry Woods', 'Ambergris', 'Vanilla', 'Musk'],
    description: 'A fruity, smoky signature built on juicy pineapple and blackcurrant over a dry birch-smoke base. Bold and polished.',
  },
  'Dior|Sauvage|EDT': {
    confidence: 'high',
    top: ['Bergamot', 'Pepper'],
    middle: ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'],
    base: ['Ambroxan', 'Cedar', 'Labdanum'],
    description: 'A bright bergamot opening gives way to a peppery heart and a warm, mineral trail of ambroxan and cedar. Clean and forceful.',
  },
  'Diptyque|Diptyque Oyédo|EDT': {
    confidence: 'medium',
    top: ['Yuzu', 'Mandarin', 'Lime'],
    middle: ['Thyme'],
    base: ['Woody Notes'],
    description: 'A sharp burst of yuzu and mandarin cut with thyme. Tart and zesty, closer to a citrus peel than a cologne.',
    note: 'Diptyque publishes simplified note lists. The yuzu-forward core is well established; supporting notes vary by source.',
  },
  'Hermès|Terre d\'Hermès|EDT': {
    confidence: 'high',
    top: ['Orange', 'Grapefruit'],
    middle: ['Pepper', 'Geranium', 'Patchouli'],
    base: ['Vetiver', 'Cedar', 'Benzoin'],
    description: 'Bitter orange over flint, pepper and dry vetiver. Mineral and earthy, a modern classic with real structure.',
  },
  'Hermès|Hermès H24|EDT': {
    confidence: 'medium',
    top: ['Clary Sage'],
    middle: ['Narcissus', 'Rosewood'],
    base: ['Sclarene'],
    description: 'Green clary sage and narcissus against a smooth, almost metallic warmth. Modern and unusual, more sculpture than bouquet.',
  },
  'Jo Malone|Jo Malone Lime Basil & Mandarin|Cologne': {
    confidence: 'high',
    top: ['Lime', 'Mandarin', 'Bergamot'],
    middle: ['Basil', 'Lilac', 'Iris'],
    base: ['Patchouli', 'Vetiver'],
    description: 'Zesty lime lifted by peppery basil over a quiet woody base. The house signature, crisp and immediately recognisable.',
  },
  'Le Labo|Le Labo Santal 33|EDP': {
    confidence: 'high',
    top: ['Cardamom', 'Iris', 'Violet'],
    middle: ['Ambrox', 'Sandalwood'],
    base: ['Cedarwood', 'Leather', 'Papyrus'],
    description: 'Dry sandalwood and cedar wrapped in leather and a smoky violet. Unmistakable, and it carries across a room.',
  },
  'Le Labo|Le Labo Another 13|EDP': {
    confidence: 'medium',
    top: ['Pear', 'Ambrette'],
    middle: ['Jasmine', 'Ambroxan'],
    base: ['Moss', 'Musk', 'Cedar'],
    description: 'A clean skin-musk built on ambroxan with a whisper of pear. Quiet and magnetic rather than loud.',
  },
  'Nautica|Nautica Voyage|EDT': {
    confidence: 'high',
    top: ['Apple', 'Green Leaves'],
    middle: ['Mimosa', 'Water Lotus', 'Cedar'],
    base: ['Musk', 'Amber', 'Moss'],
    description: 'Crisp green apple over airy lotus and soft cedar. Fresh, breezy, and famously good value.',
  },
  'Nishane|Nishane Hacivat|Extrait': {
    confidence: 'medium',
    top: ['Pineapple', 'Grapefruit', 'Bergamot', 'Blackcurrant'],
    middle: ['Jasmine', 'Patchouli', 'Cedar'],
    base: ['Oakmoss', 'Woody Notes', 'Amber'],
    description: 'A juicy pineapple opening over dry woods and moss. Rich and fruity with a polished, resinous finish.',
  },
  'Prada|Prada Infusion d\'Iris|EDT': {
    confidence: 'medium',
    top: ['Mandarin', 'Neroli', 'Galbanum'],
    middle: ['Iris', 'Orange Blossom'],
    base: ['Vetiver', 'Benzoin', 'Cedar', 'Incense'],
    description: 'Powdery iris over clean citrus and a trace of incense. Soft, refined, and quietly formal.',
  },
  'Thierry Mugler|Angel|EDP': {
    confidence: 'high',
    top: ['Bergamot', 'Cotton Candy', 'Melon', 'Coconut'],
    middle: ['Red Berries', 'Honey', 'Peach', 'Apricot', 'Plum', 'Jasmine'],
    base: ['Vanilla', 'Patchouli', 'Chocolate', 'Caramel', 'Tonka Bean', 'White Musk'],
    description: 'The original gourmand: caramel and chocolate slammed against earthy patchouli. Divisive, unmistakable, and genuinely historic.',
  },
  'Tommy Hilfiger|Tommy|EDT': {
    confidence: 'medium',
    top: ['Apple', 'Grapefruit', 'Lemon', 'Lavender', 'Mint', 'Cranberry'],
    middle: ['Rose', 'Sage', 'Cactus', 'Cotton Flower'],
    base: ['Musk', 'Sandalwood', 'Amber', 'Cedar'],
    description: 'Apple and mint over a soft cotton-and-musk base. All-American and uncomplicated, easy in any season.',
  },
  'Versace|Versace Versense|EDT': {
    confidence: 'medium',
    top: ['Bergamot', 'Mandarin', 'Fig Leaf'],
    middle: ['Cardamom', 'Jasmine', 'Water Lily'],
    base: ['Cedar', 'Musk', 'Olive Tree'],
    description: 'Green fig leaf and citrus over a soft woody base. Mediterranean and leafy, light on its feet.',
  },
  'Adidas|Adidas Ice Dive|EDT': {
    confidence: 'low',
    needs_verification: true,
    reason: 'Mass-market Adidas line. Published note lists differ substantially across retailers and I cannot ground a reliable pyramid.',
  },
  'Atelier Cologne|Atelier Cologne Orange Sanguine|Cologne Absolue': {
    confidence: 'medium',
    top: ['Blood Orange', 'Bitter Orange', 'Grapefruit'],
    middle: ['Jasmine', 'Geranium'],
    base: ['Sandalwood', 'Tonka Bean', 'Amber'],
    description: 'A vivid squeeze of blood orange held up by sandalwood and tonka. Juicy at the open, warm and lasting underneath.',
  },
  'Azzaro|Azzaro Chrome|EDT': {
    confidence: 'high',
    top: ['Lemon', 'Bergamot', 'Neroli', 'Pineapple', 'Rosemary'],
    middle: ['Jasmine', 'Cyclamen', 'Coriander', 'Oakmoss'],
    base: ['Musk', 'Sandalwood', 'Cedar', 'Tonka Bean', 'Brazilian Rosewood'],
    description: 'Clean citrus and neroli over soft woods and musk. Soapy, fresh, and reliably inoffensive.',
  },
  'Burberry|Burberry Weekend|EDT': {
    confidence: 'medium',
    top: ['Mandarin', 'Peach', 'Nectarine', 'Wild Rose', 'Reseda'],
    middle: ['Iris', 'Hyacinth', 'Blue Cedar'],
    base: ['Sandalwood', 'Cedar', 'Musk', 'Honey'],
    description: 'Soft stone fruit and hyacinth over warm cedar and honey. Relaxed and floral, exactly as the name suggests.',
    note: 'The catalog row does not specify Weekend for Women vs for Men, which have different pyramids. The Green/Floral/Woody accords point to the women\'s original, which is what this reflects. Confirm before merge.',
  },
  'Byredo|Byredo Super Cedar|EDP': {
    confidence: 'medium',
    top: ['Rose'],
    middle: ['Virginia Cedar'],
    base: ['Sandalwood', 'Musk'],
    description: 'Pencil-shaving cedar softened by a single rose and clean musk. Minimal by design, close to the skin.',
  },
  'Calvin Klein|Eternity|EDP': {
    confidence: 'high',
    top: ['Freesia', 'Sage', 'Mandarin', 'Bergamot'],
    middle: ['Lily', 'Rose', 'Jasmine', 'Lily-of-the-Valley', 'Narcissus', 'Carnation'],
    base: ['Sandalwood', 'Amber', 'Musk', 'Patchouli', 'Heliotrope'],
    description: 'A full white-floral bouquet over powdery sandalwood and amber. Classic, composed, and built to last.',
  },
  'Chanel|Coco Mademoiselle|EDP': {
    confidence: 'high',
    top: ['Orange', 'Bergamot', 'Mandarin'],
    middle: ['Jasmine', 'Rose', 'Litchi', 'Ylang-Ylang'],
    base: ['Patchouli', 'Vetiver', 'Vanilla', 'White Musk', 'Tonka Bean'],
    description: 'Bright orange and rose riding on a bold patchouli base. Confident and modern, a genuine signature scent.',
  },
  'Chanel|Coco|EDP': {
    confidence: 'medium',
    top: ['Coriander', 'Peach', 'Mandarin', 'Bulgarian Rose', 'Angelica'],
    middle: ['Clove', 'Rose', 'Jasmine', 'Orange Blossom', 'Mimosa'],
    base: ['Amber', 'Sandalwood', 'Vanilla', 'Tonka Bean', 'Opoponax', 'Labdanum'],
    description: 'Spiced florals over deep amber and resin. Opulent and old-world, a very different animal from Mademoiselle.',
  },
  'Creed|Creed Green Irish Tweed|EDP': {
    confidence: 'high',
    top: ['Lemon', 'Verbena', 'Peppermint'],
    middle: ['Iris', 'Violet Leaf'],
    base: ['Sandalwood', 'Ambergris'],
    description: 'Violet leaf and mint over soft sandalwood, green as cut grass. Refined and gentlemanly, endlessly imitated.',
  },
  'Davidoff|Cool Water|EDT': {
    confidence: 'high',
    top: ['Sea Water', 'Mint', 'Lavender', 'Coriander', 'Rosemary', 'Green Notes'],
    middle: ['Sandalwood', 'Neroli', 'Geranium', 'Jasmine'],
    base: ['Musk', 'Cedar', 'Oakmoss', 'Amber', 'Tobacco'],
    description: 'The fragrance that invented the aquatic genre: sea spray, mint and lavender over warm woods. A permanent reference point.',
  },
  'Dior|Hypnotic Poison|EDP': {
    confidence: 'high',
    top: ['Coconut', 'Plum', 'Apricot'],
    middle: ['Jasmine', 'Tuberose', 'Rose', 'Caraway', 'Lily-of-the-Valley'],
    base: ['Vanilla', 'Almond', 'Sandalwood', 'Musk'],
    description: 'Bitter almond and coconut wrapped in creamy vanilla. Hypnotic is the right word, warm and faintly dangerous.',
  },
  'Diptyque|Diptyque Philosykos|EDP': {
    confidence: 'high',
    top: ['Fig Leaf'],
    middle: ['Fig', 'Coconut'],
    base: ['White Cedar', 'Woody Notes'],
    description: 'The whole fig tree: green leaf, milky fruit and dry wood. Sun-warmed and Mediterranean, beautifully simple.',
  },
  'Dolce & Gabbana|Light Blue|EDT': {
    confidence: 'high',
    top: ['Sicilian Lemon', 'Apple', 'Cedar', 'Bluebell'],
    middle: ['Bamboo', 'Jasmine', 'White Rose'],
    base: ['Cedar', 'Musk', 'Amber'],
    description: 'Crisp Sicilian lemon and green apple over soft cedar. A sun-on-skin summer staple, breezy and instantly likeable.',
  },
  'Elizabeth Arden|Elizabeth Arden Green Tea|EDT': {
    confidence: 'medium',
    top: ['Bergamot', 'Lemon', 'Mint', 'Rhubarb'],
    middle: ['Green Tea', 'Jasmine', 'Fennel', 'Carnation'],
    base: ['Musk', 'Amber', 'Oakmoss', 'Celery Seed'],
    description: 'Steeped green tea with citrus and mint. Light, clean and refreshing, closer to a spa than a perfume counter.',
  },
  'Frederic Malle|Frederic Malle Portrait of a Lady|EDP': {
    confidence: 'high',
    top: ['Raspberry', 'Blackcurrant', 'Cinnamon', 'Clove'],
    middle: ['Turkish Rose', 'Patchouli', 'Sandalwood'],
    base: ['Frankincense', 'Benzoin', 'Musk', 'Amber'],
    description: 'A monumental rose built on patchouli and incense. Dense, dramatic and long-lasting, with nothing shy about it.',
  },
  'Frederic Malle|Frederic Malle Musc Ravageur|EDP': {
    confidence: 'medium',
    top: ['Lavender', 'Bergamot', 'Mandarin'],
    middle: ['Cinnamon', 'Clove'],
    base: ['Musk', 'Vanilla', 'Amber', 'Sandalwood', 'Cedar', 'Tonka Bean', 'Guaiac Wood'],
    description: 'Warm spice and vanilla over a heavy musk. Sensual and skin-like, exactly as the name promises.',
  },
  'Giorgio Armani|Acqua di Giò Profondo|EDP': {
    confidence: 'medium',
    top: ['Sea Notes', 'Bergamot', 'Green Mandarin'],
    middle: ['Rosemary', 'Lavender', 'Cypress', 'Mastic'],
    base: ['Patchouli', 'Musk', 'Mineral Notes'],
    description: 'A darker, deeper take on the aquatic original, with rosemary and cypress over wet stone. Cool and serious.',
  },
  'Gucci|Gucci Bloom|EDP': {
    confidence: 'medium',
    top: ['Rangoon Creeper'],
    middle: ['Tuberose', 'Jasmine Sambac'],
    base: ['Orris Root'],
    description: 'A dense white-floral bouquet, tuberose forward, with powdery orris underneath. Lush and unapologetically floral.',
  },
  'Guerlain|Guerlain Mon Guerlain Intense|EDP': {
    confidence: 'medium',
    top: ['Bergamot', 'Lavender'],
    middle: ['Jasmine', 'Iris', 'Orange Blossom'],
    base: ['Vanilla', 'Tonka Bean', 'Sandalwood', 'Patchouli'],
    description: 'Lavender and vanilla in the classic Guerlain register, richer and more resinous than the original. Soft but substantial.',
    note: 'Reflects the Mon Guerlain lavender/vanilla DNA. The Intense flanker differs from the original EDP and the exact list needs confirming.',
  },
  'Guerlain|Guerlain Shalimar|EDP': {
    confidence: 'high',
    top: ['Bergamot', 'Lemon', 'Mandarin', 'Cedar'],
    middle: ['Iris', 'Jasmine', 'Rose', 'Patchouli', 'Vetiver'],
    base: ['Vanilla', 'Tonka Bean', 'Opoponax', 'Incense', 'Leather', 'Sandalwood'],
    description: 'Smoky vanilla and incense over bright citrus, a template the whole oriental family still follows. Nearly a century old and still commanding.',
  },
  'Hugo Boss|Hugo|EDT': {
    confidence: 'medium',
    top: ['Green Apple', 'Mint', 'Basil', 'Grapefruit', 'Lavender'],
    middle: ['Sage', 'Geranium', 'Carnation', 'Jasmine'],
    base: ['Fir', 'Cedar', 'Patchouli', 'Vetiver', 'Musk'],
    description: 'Green apple and mint over pine and cedar. Sharp and energetic, a nineties staple that still reads fresh.',
  },
  'Initio|Initio Side Effect|EDP': {
    confidence: 'medium',
    top: ['Rum', 'Cinnamon', 'Saffron'],
    middle: ['Tobacco', 'Jasmine'],
    base: ['Vanilla', 'Sandalwood', 'Amber', 'Tonka Bean'],
    description: 'Boozy rum and tobacco poured over vanilla and sandalwood. Rich, heady and firmly after-dark.',
  },
  'Issey Miyake|Issey Miyake L\'Eau d\'Issey|EDT': {
    confidence: 'medium',
    top: ['Lotus', 'Freesia', 'Cyclamen', 'Melon', 'Rose Water'],
    middle: ['Peony', 'Lily', 'Carnation', 'Lily-of-the-Valley'],
    base: ['Cedar', 'Musk', 'Amber', 'Osmanthus'],
    description: 'Watery lotus and peony over clean woods. Translucent and cool, a defining floral of its era.',
    note: 'This is the original L\'Eau d\'Issey, confirmed distinct from the three pour Homme rows in the catalog.',
  },
  'Kenneth Cole|Kenneth Cole Black|EDT': {
    confidence: 'low',
    needs_verification: true,
    reason: 'Published pyramid is inconsistently reported across sources and risks confusion with the Black Bold flanker. Cannot ground reliably.',
  },
  'Lancôme|La Vie Est Belle|EDP': {
    confidence: 'high',
    top: ['Blackcurrant', 'Pear'],
    middle: ['Iris', 'Jasmine', 'Orange Blossom'],
    base: ['Praline', 'Vanilla', 'Patchouli', 'Tonka Bean'],
    description: 'A sweet gourmand centered on praline and iris, softened by tonka and vanilla. Rich but rounded.',
  },
  'Le Labo|Le Labo Rose 31|EDP': {
    confidence: 'medium',
    top: ['Rose', 'Cumin'],
    middle: ['Cedar', 'Vetiver', 'Olibanum'],
    base: ['Oud', 'Musk', 'Amber', 'Guaiac Wood'],
    description: 'Rose stripped of sweetness and pushed through cumin and dry woods. Spiky and unisex, nothing like a rose soliflore.',
  },
  'Le Labo|Le Labo Bergamote 22|EDP': {
    confidence: 'medium',
    top: ['Bergamot', 'Grapefruit'],
    middle: ['Orange Blossom', 'Petitgrain'],
    base: ['Vetiver', 'Musk', 'Amber', 'Cedar'],
    description: 'A bright citrus opening anchored by vetiver and musk so it lasts. Clean and sparkling with real staying power.',
  },
  'Louis Vuitton|LV Imagination|EDP': {
    confidence: 'medium',
    top: ['Bergamot', 'Citron', 'Neroli'],
    middle: ['Black Tea', 'Ginger'],
    base: ['Ambroxan', 'Guaiac Wood', 'Cedar'],
    description: 'Sparkling citrus over smoky black tea and warm ambroxan. Light and radiant with an unexpected woody depth.',
  },
}

const top50 = [...manifest].sort((a, b) => b.ids.length - a.ids.length).slice(0, 50)

const missing = top50.filter((p) => !NOTES[key(p)])
if (missing.length) {
  console.error('Missing NOTES entries for:')
  missing.forEach((p) => console.error('  ' + key(p)))
  process.exit(1)
}

const entries = top50.map((p) => {
  const n = NOTES[key(p)]
  const grounded = n.confidence !== 'low'
  return {
    brand: p.brand,
    name: p.name,
    concentration: p.concentration,
    tier: p.tier,
    accords: p.accords,
    confidence: n.confidence,
    ...(grounded
      ? {
          top_notes: n.top,
          middle_notes: n.middle,
          base_notes: n.base,
          description: n.description,
        }
      : {
          top_notes: null,
          middle_notes: null,
          base_notes: null,
          description: null,
          needs_verification: true,
          reason: n.reason,
        }),
    ...(n.note ? { note: n.note } : {}),
    row_count: p.ids.length,
    applies_to_ids: p.ids.map((i) => i.id),
  }
})

const counts = entries.reduce((acc, e) => ({ ...acc, [e.confidence]: (acc[e.confidence] || 0) + 1 }), {})

const out = {
  _meta: {
    batch: 'batch-01',
    scope: 'Top 50 unique products by catalog row count, from data-enrichment/manifest.json',
    created: '2026-07-21',
    provenance:
      'Note pyramids compiled from general knowledge of widely documented fragrances. No scraped, imported, or third-party dataset content (CATALOG.md rule 1).',
    confidence_levels: {
      high: 'Globally iconic; grounded in widely published knowledge.',
      medium: 'Well known; core notes solid, secondary notes may vary by source.',
      low: 'Cannot be grounded reliably. Notes are null and needs_verification is set. Never guessed.',
    },
    review_gate:
      'Nothing merges into /fragrances/*.json without Joseph\'s explicit sign-off on this reviewed batch (CATALOG.md rule 5).',
    counts,
    products: entries.length,
    catalog_rows_covered: entries.reduce((s, e) => s + e.row_count, 0),
  },
  entries,
}

writeFileSync('data-enrichment/batch-01.json', JSON.stringify(out, null, 2) + '\n')
console.log('counts:', counts)
console.log('products:', entries.length, '| catalog rows covered:', out._meta.catalog_rows_covered)
console.log('\nLOW confidence (need manual verification):')
entries.filter((e) => e.confidence === 'low').forEach((e) => console.log('  - ' + e.brand + ' ' + e.name + ' (' + e.concentration + ') :: ' + e.reason))
console.log('\nMEDIUM entries carrying a caveat note:')
entries.filter((e) => e.note).forEach((e) => console.log('  - ' + e.brand + ' ' + e.name))
