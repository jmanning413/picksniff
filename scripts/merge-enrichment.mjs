#!/usr/bin/env node
// Merges an approved enrichment batch into the 15 catalog files.
// docs/CATALOG.md Stage A step 4.
//
// SAFETY: dry run by default. Nothing is written without --write.
// CATALOG.md rule 5: never write to /fragrances/*.json without Joseph's
// explicit sign-off on a reviewed batch.
//
//   node scripts/merge-enrichment.mjs                      # dry run, batch-01
//   node scripts/merge-enrichment.mjs --batch data-enrichment/batch-02.json
//   node scripts/merge-enrichment.mjs --write              # actually merge
//
// Behaviour:
//   - Notes belong to the unique product; each entry fans out across its
//     applies_to_ids.
//   - low-confidence entries (null notes) are SKIPPED, leaving those rows
//     untouched at data_status "legacy". We never write a guessed pyramid.
//   - Merged rows get data_status "drafted" (AI-compiled, not yet checked
//     against a primary source). Only "verified" unlocks the pyramid UI.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const batchPath = args.includes('--batch') ? args[args.indexOf('--batch') + 1] : 'data-enrichment/batch-01.json'
const CATALOG_DIR = 'fragrances'

const KEY_ORDER = [
  'id', 'name', 'brand', 'concentration', 'tier', 'accords',
  'top_notes', 'middle_notes', 'base_notes', 'description',
  'sephora_url', 'jomashop_url', 'data_status',
]

const reorder = (o) => {
  const out = {}
  for (const k of KEY_ORDER) if (k in o) out[k] = o[k]
  for (const k of Object.keys(o)) if (!(k in out)) out[k] = o[k] // keep unknown fields
  return out
}

const batch = JSON.parse(readFileSync(batchPath, 'utf8'))
const files = readdirSync(CATALOG_DIR).filter((f) => f.endsWith('.json'))

// id -> { file, index }
const index = new Map()
const catalogs = {}
for (const f of files) {
  const rows = JSON.parse(readFileSync(join(CATALOG_DIR, f), 'utf8'))
  catalogs[f] = rows
  rows.forEach((r, i) => index.set(r.id, { file: f, i }))
}

const plan = []      // { id, file, product, fields }
const skipped = []   // low confidence
const unmatched = [] // ids in batch not present in catalog

for (const e of batch.entries) {
  const label = `${e.brand} ${e.name} (${e.concentration})`
  if (e.confidence === 'low' || e.top_notes === null) {
    skipped.push({ label, rows: e.applies_to_ids.length, reason: e.reason || 'null notes' })
    continue
  }
  for (const id of e.applies_to_ids) {
    const loc = index.get(id)
    if (!loc) { unmatched.push({ id, label }); continue }
    plan.push({
      id,
      file: loc.file,
      i: loc.i,
      product: label,
      fields: {
        top_notes: e.top_notes,
        middle_notes: e.middle_notes,
        base_notes: e.base_notes,
        description: e.description,
        data_status: 'drafted',
      },
    })
  }
}

// ---- report ----
console.log(`\nBatch:  ${batchPath}`)
console.log(`Mode:   ${WRITE ? '*** WRITE (files will be modified) ***' : 'DRY RUN (no files written)'}`)
console.log(`\nProducts in batch:      ${batch.entries.length}`)
console.log(`Rows to update:         ${plan.length}`)
console.log(`Products skipped (low): ${skipped.length}  (${skipped.reduce((s, x) => s + x.rows, 0)} rows left untouched)`)
console.log(`Unmatched ids:          ${unmatched.length}`)

const byFile = plan.reduce((a, p) => ({ ...a, [p.file]: (a[p.file] || 0) + 1 }), {})
console.log('\nRows per catalog file:')
Object.keys(byFile).sort().forEach((f) => console.log(`  ${f.padEnd(30)} ${byFile[f]}`))

if (skipped.length) {
  console.log('\nSKIPPED (left at legacy, notes remain fake):')
  skipped.forEach((s) => console.log(`  - ${s.label} [${s.rows} rows] :: ${s.reason}`))
}
if (unmatched.length) {
  console.log('\nUNMATCHED IDS (batch references ids not in catalog):')
  unmatched.forEach((u) => console.log(`  - ${u.id}  (${u.label})`))
}

// sample diff so the change is visible before approving
const sample = plan[0]
if (sample) {
  const before = catalogs[sample.file][sample.i]
  console.log(`\nSample change  ${sample.id}`)
  console.log(`  top_notes    ${JSON.stringify(before.top_notes)}`)
  console.log(`            -> ${JSON.stringify(sample.fields.top_notes)}`)
  console.log(`  middle_notes (absent) -> ${JSON.stringify(sample.fields.middle_notes)}`)
  console.log(`  base_notes   (absent) -> ${JSON.stringify(sample.fields.base_notes)}`)
  console.log(`  description  ${JSON.stringify(before.description)} -> ${JSON.stringify(sample.fields.description.slice(0, 55) + '...')}`)
  console.log(`  data_status  (absent) -> "drafted"`)
}

// ENGINE HAZARD GUARD.
// lib/matchEngine.mjs unions top_notes into the accord pool for the notes
// filter. A top note whose name exactly equals one of the 11 filter accords
// would silently change match scoring. batch-01 has zero collisions (verified
// by scripts/snapshot-matches.mjs: 0/735 cases changed). This keeps that true
// for later batches instead of relying on someone remembering.
const FILTER_ACCORDS = ['citrus', 'floral', 'woody', 'vanilla', 'amber', 'spicy', 'fresh', 'aromatic', 'fruity', 'aquatic', 'green']
const collisions = []
for (const e of batch.entries) {
  for (const n of e.top_notes || []) {
    if (FILTER_ACCORDS.includes(String(n).trim().toLowerCase())) {
      collisions.push(`${e.brand} ${e.name} -> top note "${n}"`)
    }
  }
}
if (collisions.length) {
  console.error('\nACCORD COLLISION: these top notes share a name with a filter accord')
  console.error('and would change match scoring. Rename the note or re-verify before merging:')
  collisions.forEach((c) => console.error('  - ' + c))
  console.error('\nRe-run scripts/snapshot-matches.mjs before/after if you intend this.')
  process.exit(1)
}

if (unmatched.length) {
  console.error('\nAborting: unmatched ids must be resolved before merging.')
  process.exit(1)
}

if (!WRITE) {
  console.log('\nDry run complete. Nothing was written. Re-run with --write to apply.\n')
  process.exit(0)
}

for (const p of plan) Object.assign(catalogs[p.file][p.i], p.fields)
const touched = new Set(plan.map((p) => p.file))
for (const f of touched) {
  writeFileSync(join(CATALOG_DIR, f), JSON.stringify(catalogs[f].map(reorder), null, 2) + '\n')
}
console.log(`\nMerged. ${plan.length} rows across ${touched.size} files.`)
console.log('Now run: npm test && npx next build\n')
