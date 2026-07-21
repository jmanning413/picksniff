#!/usr/bin/env node
// Applies an approved cut-and-replace spec (data-enrichment/swap-NN.json) to
// the catalog. Companion to cut-audit-01.json; see CATALOG.md.
//
// SAFETY: dry run by default; --write to apply. Each swap replaces the cut row
// IN PLACE (same array position) so pool sizes and ordering are preserved.
//
// Validations per swap:
//   - cut row exists exactly once in the named file
//   - replacement id does not exist anywhere in the catalog
//   - replacement product (brand|name|conc) not already in the target file
//   - accords all within the 11 filter accords
//   - brand cap: swap must not INCREASE any brand above 3 in the file
//     (pre-existing overages that stay equal or shrink produce a warning)
//   - max 1 Louis Vuitton per file; Byredo/Diptyque only in unisex files
//   - copy_pyramid_from source must exist and be enriched

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const specPath = args.includes('--spec') ? args[args.indexOf('--spec') + 1] : 'data-enrichment/swap-01.json'
const CATALOG_DIR = 'fragrances'
const FILTER_ACCORDS = new Set(['Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber', 'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green'])

const KEY_ORDER = [
  'id', 'name', 'brand', 'concentration', 'tier', 'accords',
  'top_notes', 'middle_notes', 'base_notes', 'description',
  'sephora_url', 'jomashop_url', 'data_status',
]
const reorder = (o) => {
  const out = {}
  for (const k of KEY_ORDER) if (k in o) out[k] = o[k]
  for (const k of Object.keys(o)) if (!(k in out)) out[k] = o[k]
  return out
}

const spec = JSON.parse(readFileSync(specPath, 'utf8'))
const files = readdirSync(CATALOG_DIR).filter((f) => f.endsWith('.json'))
const catalogs = {}
const allIds = new Set()
const allRows = []
for (const f of files) {
  catalogs[f] = JSON.parse(readFileSync(join(CATALOG_DIR, f), 'utf8'))
  catalogs[f].forEach((r) => { allIds.add(r.id); allRows.push(r) })
}

const errors = []
const warnings = []
const plan = []

for (const s of spec.swaps) {
  const rows = catalogs[s.file]
  if (!rows) { errors.push(`${s.cut_id}: file ${s.file} not found`); continue }
  const idxs = rows.map((r, i) => (r.id === s.cut_id ? i : -1)).filter((i) => i >= 0)
  if (idxs.length !== 1) { errors.push(`${s.cut_id}: found ${idxs.length} times in ${s.file} (need exactly 1)`); continue }
  const idx = idxs[0]
  const cutRow = rows[idx]

  let rep = { ...s.replacement }
  if (s.copy_pyramid_from) {
    const src = allRows.find((r) =>
      r.brand === s.copy_pyramid_from.brand && r.name === s.copy_pyramid_from.name &&
      r.concentration === s.copy_pyramid_from.concentration && r.middle_notes)
    if (!src) { errors.push(`${s.cut_id}: copy_pyramid_from source not found/enriched`); continue }
    rep = {
      ...rep,
      accords: [...src.accords],
      top_notes: [...src.top_notes], middle_notes: [...src.middle_notes], base_notes: [...src.base_notes],
      description: src.description,
    }
  }
  rep.sephora_url = null
  rep.jomashop_url = null
  rep.data_status = 'drafted'

  if (allIds.has(rep.id)) { errors.push(`${s.cut_id}: replacement id ${rep.id} already exists`); continue }
  const badAccords = (rep.accords || []).filter((a) => !FILTER_ACCORDS.has(a))
  if (badAccords.length) { errors.push(`${rep.id}: accords outside the 11: ${badAccords.join(', ')}`); continue }
  if (!rep.top_notes?.length || !rep.middle_notes?.length || !rep.base_notes?.length) {
    errors.push(`${rep.id}: incomplete pyramid`); continue
  }
  const dup = rows.some((r, i) => i !== idx &&
    r.brand === rep.brand && r.name === rep.name && r.concentration === rep.concentration)
  if (dup) { errors.push(`${rep.id}: product already present in ${s.file}`); continue }

  // brand caps after this swap (evaluated per file incl. earlier swaps in plan)
  const counts = {}
  rows.forEach((r, i) => { const b = i === idx ? rep.brand : r.brand; counts[b] = (counts[b] || 0) + 1 })
  for (const p of plan.filter((p) => p.file === s.file)) {
    counts[p.cutBrand]--; counts[p.rep.brand] = (counts[p.rep.brand] || 0) + 1
  }
  if ((counts[rep.brand] || 0) > 3) {
    if (rep.brand === cutRow.brand && counts[rep.brand] <= rows.filter((r) => r.brand === cutRow.brand).length) {
      warnings.push(`${s.file}: ${rep.brand} at ${counts[rep.brand]} (pre-existing overage, not increased by this swap)`)
    } else {
      errors.push(`${rep.id}: would push ${rep.brand} to ${counts[rep.brand]} in ${s.file} (cap 3)`); continue
    }
  }
  if (rep.brand === 'Louis Vuitton' && rows.some((r, i) => i !== idx && r.brand === 'Louis Vuitton')) {
    errors.push(`${rep.id}: second LV in ${s.file}`); continue
  }
  if (['Byredo', 'Diptyque'].includes(rep.brand) && !s.file.startsWith('unisex_')) {
    errors.push(`${rep.id}: ${rep.brand} allowed only in unisex files`); continue
  }

  allIds.add(rep.id)
  plan.push({ file: s.file, idx, cutId: s.cut_id, cutBrand: cutRow.brand, cutName: cutRow.name, rep })
}

console.log(`\nSpec:  ${specPath}`)
console.log(`Mode:  ${WRITE ? '*** WRITE ***' : 'DRY RUN (no files written)'}`)
console.log(`Swaps: ${plan.length} of ${spec.swaps.length} valid\n`)
plan.forEach((p) => console.log(`  ${p.file.padEnd(28)} ${p.cutBrand} ${p.cutName}  ->  ${p.rep.brand} ${p.rep.name}${p.rep.description ? '' : '  [MISSING DESC]'}`))
if (warnings.length) { console.log('\nWarnings:'); warnings.forEach((w) => console.log('  ! ' + w)) }
if (errors.length) {
  console.error('\nERRORS (refusing to write):'); errors.forEach((e) => console.error('  x ' + e))
  process.exit(1)
}
if (!WRITE) { console.log('\nDry run complete. Re-run with --write to apply.\n'); process.exit(0) }

const touched = new Set()
for (const p of plan) {
  catalogs[p.file][p.idx] = reorder(p.rep)
  touched.add(p.file)
}
for (const f of touched) {
  writeFileSync(join(CATALOG_DIR, f), JSON.stringify(catalogs[f].map(reorder), null, 2) + '\n')
}
console.log(`\nApplied ${plan.length} swaps across ${touched.size} files.`)
console.log('Now: bump DATA_VERSION, npm test, npx next build.\n')
