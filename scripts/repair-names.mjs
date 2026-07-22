#!/usr/bin/env node
// Stage A0 name repair (docs/CATALOG.md): fixes the PDF-extraction damage in
// display names without touching ids (two documented id migrations excepted).
//
//   node scripts/repair-names.mjs           # dry run, prints full rename report
//   node scripts/repair-names.mjs --write   # apply
//
// What it does, in order, per row:
//   1. BYTE FIX: decodes literal octal escapes stored in name strings
//      ("L'\311clat" -> "L'Éclat", "N\2605" -> "N°5", "Fra\356che" -> "Fraîche").
//   2. SPECIALS: explicit brand/name rewrites for known mangled rows
//      (Liz Claiborne, L'Artisan Parfumeur, Hugo Boss "Boss" line, accent unification).
//   3. PREFIX STRIP: removes a leading brand name (or alias) from the display
//      name for brands where the remainder is the true product name.
//      KEEP_BRANDS are never stripped (integral naming: Azzaro Pour Homme,
//      Burberry Her, Guess Seductive, DKNY Be Delicious, ...). Remainders
//      shorter than 4 chars or in BAD_REMAINDERS keep their original name.
//   4. COLLISION GUARD: a rename is skipped (and reported) if it would create
//      two rows with the same brand|name|concentration in the SAME file, which
//      would make rankFragrances' dedupe silently hide one of them.
//   5. ID MIGRATIONS (the two documented duplicate-id repairs):
//      - male_daily Bleu de Chanel EDT gets its own id (the EDP keeps the old
//        one, so existing wishlist references keep resolving).
//      - unisex_sport's literal duplicate Guerlain Aqua Allegoria row (same
//        product twice, same id) is replaced by Acqua di Parma Colonia so the
//        slot stops being dead weight (dedupe hid it from results anyway).
//
// IDs are otherwise never edited: URLs and saved wishlists stay stable even
// where the display name changes.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const WRITE = process.argv.includes('--write')
const DIR = 'fragrances'

const ALIASES = {
  Montblanc: ['Montblanc', 'Mont Blanc'],
  Bvlgari: ['Bvlgari', 'Bulgari'],
  'Louis Vuitton': ['Louis Vuitton', 'LV'],
  'Roja Parfums': ['Roja Parfums', 'Roja'],
}

// Brands whose product names legitimately include the brand (line naming).
const KEEP_BRANDS = new Set([
  'Azzaro', 'Burberry', 'Guess', 'Zara', 'Nautica', 'Kenneth Cole', 'Jaguar',
  'DKNY', 'Valentino', 'Tommy Hilfiger', 'Paris Hilton', 'Paloma Picasso',
  'Lolita Lempicka', 'Ferragamo',
])

// Names never stripped even under a strip-brand (integral product lines).
const KEEP_NAMES = new Set([
  'Dior Homme', 'Dior Homme Intense',
])
const KEEP_NAME_PREFIXES = ['Dior Homme']

const BAD_REMAINDERS = new Set(['Pour Homme', 'Man', 'Woman', 'Her', 'Hero', 'K', 'Gold', 'Blue', 'Night'])

// Explicit rewrites applied before generic stripping. Key: `${brand}|${name}`.
const SPECIALS = new Map(Object.entries({
  'Claiborne|Curve for Men Liz': { brand: 'Liz Claiborne', name: 'Curve for Men' },
  "Parfumeur|L'Artisan Timbuktu L'Artisan": { brand: "L'Artisan Parfumeur", name: 'Timbuktu' },
  'Hugo Boss|Hugo Boss The Scent': { name: 'Boss The Scent' },
  'Hugo Boss|Hugo Boss Boss The Scent': { name: 'Boss The Scent' },
  'Hugo Boss|Hugo Boss Number One': { name: 'Boss Number One' },
  'Hugo Boss|Hugo Boss Boss Bottled Night': { name: 'Boss Bottled Night' },
  'Giorgio Armani|Giorgio Armani Code Absolu': { name: 'Armani Code Absolu' },
  'Kenzo|Kenzo Flower': { name: 'Flower by Kenzo' },
  'Creed|Creed Millesime Imperial': { name: 'Millésime Impérial' },
  'Giorgio Armani|Acqua di Gio': { name: 'Acqua di Giò' },
  'Giorgio Armani|Si': { name: 'Sì' },
  'Giorgio Armani|Si Passione': { name: 'Sì Passione' },
  "Jo Malone|Jo Malone Velvet Rose & Oud Intense": { name: 'Velvet Rose & Oud' },
}))

const decodeOctal = (s) => s.replace(/\\([0-3][0-7][0-7])/g, (_, o) => String.fromCharCode(parseInt(o, 8)))

const files = readdirSync(DIR).filter((f) => f.endsWith('.json'))
const catalogs = {}
for (const f of files) catalogs[f] = JSON.parse(readFileSync(join(DIR, f), 'utf8'))

const renames = []
const skipped = []

for (const f of files) {
  const rows = catalogs[f]
  for (const r of rows) {
    let name = r.name
    let brand = r.brand

    if (name.includes('\\')) name = decodeOctal(name)

    const sp = SPECIALS.get(`${brand}|${name}`)
    if (sp) {
      if (sp.brand) brand = sp.brand
      if (sp.name) name = sp.name
    } else if (!KEEP_BRANDS.has(brand) && !KEEP_NAMES.has(name) &&
               !KEEP_NAME_PREFIXES.some((p) => name.startsWith(p))) {
      for (const alias of ALIASES[brand] || [brand]) {
        if (name.startsWith(alias + ' ')) {
          const rest = name.slice(alias.length + 1).trim()
          if (rest.length >= 4 && !BAD_REMAINDERS.has(rest)) name = rest
          break
        }
      }
      // re-check specials against the stripped result (e.g. "Creed Millesime Imperial" path)
      const sp2 = SPECIALS.get(`${brand}|${name}`)
      if (sp2?.name) name = sp2.name
    }

    if (name === r.name && brand === r.brand) continue

    const collision = rows.some((o) => o !== r &&
      (o._newBrand || o.brand) === brand && (o._newName || o.name) === name &&
      o.concentration === r.concentration)
    if (collision) {
      skipped.push({ file: f, id: r.id, from: r.name, to: name, why: 'same-file brand|name|conc collision (dedupe would hide a row)' })
      continue
    }
    r._newName = name
    r._newBrand = brand
    renames.push({ file: f, id: r.id, fromBrand: r.brand, toBrand: brand, from: r.name, to: name })
  }
}

// ---- id migrations ----
const migrations = []
{
  // Bleu de Chanel EDT: own id (EDP keeps the shared one)
  const md = catalogs['male_daily_final.json']
  const edt = md.find((r) => r.id === 'male-daily-quality-chanel-bleu-de-chanel' && r.concentration === 'EDT')
  if (edt) migrations.push({ row: edt, file: 'male_daily_final.json', newId: 'male-daily-quality-chanel-bleu-de-chanel-edt', why: 'EDP and EDT shared one id; EDP keeps it (wishlist refs resolve), EDT becomes reachable at its own URL' })

  // Guerlain literal duplicate row -> Acqua di Parma Colonia
  const us = catalogs['unisex_sport_final.json']
  const dups = us.filter((r) => r.id === 'unisex-sport-quality-guerlain-guerlain-aqua-allegoria-bergamote-calabria')
  if (dups.length === 2) {
    const idx = us.indexOf(dups[1])
    migrations.push({
      replaceAt: { file: 'unisex_sport_final.json', idx },
      newRow: {
        id: 'unisex-sport-quality-acqua-di-parma-colonia',
        name: 'Colonia', brand: 'Acqua di Parma', concentration: 'EDC', tier: 'quality',
        accords: ['Citrus', 'Aromatic', 'Fresh'],
        top_notes: ['Sicilian Lemon', 'Bergamot', 'Sweet Orange'],
        middle_notes: ['Lavender', 'Rosemary', 'Rose', 'Verbena'],
        base_notes: ['Vetiver', 'Sandalwood', 'Patchouli'],
        description: 'The 1916 Italian cologne that never went out of style. Sunny citrus over lavender and clean woods.',
        sephora_url: null, jomashop_url: null, data_status: 'drafted',
      },
      why: 'row was a literal duplicate (same product twice, same id); dedupe already hid it from results, so the slot was dead weight',
    })
  }
}

console.log(`\nMode: ${WRITE ? '*** WRITE ***' : 'DRY RUN'}`)
console.log(`Renames: ${renames.length} | skipped (collisions): ${skipped.length} | id migrations: ${migrations.length}\n`)
const brandFixes = renames.filter((r) => r.fromBrand !== r.toBrand)
if (brandFixes.length) { console.log('Brand fixes:'); brandFixes.forEach((r) => console.log(`  ${r.fromBrand} -> ${r.toBrand}  (${r.from} -> ${r.to})`)) }
console.log('Sample renames (first 25):')
renames.slice(0, 25).forEach((r) => console.log(`  [${r.file.replace('_final.json', '')}] ${r.from} -> ${r.to}`))
if (skipped.length) { console.log('\nSkipped (collision guard):'); skipped.forEach((s) => console.log(`  [${s.file}] ${s.from} -> ${s.to} :: ${s.why}`)) }
migrations.forEach((m) => console.log(`\nMigration: ${m.newId || m.newRow.id} :: ${m.why}`))

if (!WRITE) { console.log('\nDry run complete. Re-run with --write to apply.\n'); process.exit(0) }

for (const f of files) {
  let touched = false
  for (const r of catalogs[f]) {
    if (r._newName || r._newBrand) {
      r.name = r._newName || r.name
      r.brand = r._newBrand || r.brand
      delete r._newName; delete r._newBrand
      touched = true
    }
  }
  if (touched) writeFileSync(join(DIR, f), JSON.stringify(catalogs[f], null, 2) + '\n')
}
for (const m of migrations) {
  if (m.row) { m.row.id = m.newId; writeFileSync(join(DIR, m.file), JSON.stringify(catalogs[m.file], null, 2) + '\n') }
  if (m.replaceAt) { catalogs[m.replaceAt.file][m.replaceAt.idx] = m.newRow; writeFileSync(join(DIR, m.replaceAt.file), JSON.stringify(catalogs[m.replaceAt.file], null, 2) + '\n') }
}
console.log('\nApplied. Now: bump DATA_VERSION, npm test, npx next build.\n')
