#!/usr/bin/env node
// Enrichment ran per catalog ROW, so a product living in several gender/vibe
// pools could receive slightly different pyramids from different batches
// (Gucci Bloom opened on "Rangoon Creeper" in three rows and "Jasmine Bud" in
// three others). Same fragrance, different notes depending which quiz path a
// user took. This picks one canonical pyramid per product and applies it to
// every row of that product.
//
//   node scripts/normalize-pyramids.mjs           # dry run
//   node scripts/normalize-pyramids.mjs --write
//
// Canonical choice is deterministic: the MOST COMPLETE pyramid wins, then the
// most frequent, then lexicographically. Completeness leads because the
// disagreements are truncations, not alternatives — Portrait of a Lady appeared
// in three rows without "Turkish Rose" and two rows with it, and dropping the
// signature note of the fragrance to satisfy a majority would be wrong.
// Descriptions are normalized the same way so cards agree with each other.
//
// Scoring safety: middle/base notes are not scoring inputs at all. top_notes
// feed only the notes filter, which unions them with accords, so this refuses
// to write a top note whose name collides with one of the 11 filter accords.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const WRITE = process.argv.includes('--write')
const DIR = 'fragrances'
const FILTER_ACCORDS = new Set(['citrus', 'floral', 'woody', 'vanilla', 'amber', 'spicy', 'fresh', 'aromatic', 'fruity', 'aquatic', 'green'])

const files = readdirSync(DIR).filter((f) => f.endsWith('.json'))
const catalogs = {}
const rows = []
for (const f of files) {
  catalogs[f] = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  catalogs[f].forEach((r, i) => rows.push({ r, f, i }))
}

const groups = new Map()
for (const e of rows) {
  const k = `${e.r.brand}|${e.r.name}|${e.r.concentration}`
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push(e)
}

const sig = (r) => JSON.stringify([r.top_notes, r.middle_notes, r.base_notes])
const size = (r) => (r.top_notes?.length || 0) + (r.middle_notes?.length || 0) + (r.base_notes?.length || 0)

const changes = []
const blocked = []

for (const [key, entries] of groups) {
  if (entries.length < 2) continue
  const variants = new Map()
  for (const e of entries) {
    const s = sig(e.r)
    if (!variants.has(s)) variants.set(s, { count: 0, row: e.r })
    variants.get(s).count++
  }
  if (variants.size === 1) continue

  const winner = [...variants.entries()]
    .sort((a, b) =>
      size(b[1].row) - size(a[1].row) ||
      b[1].count - a[1].count ||
      a[0].localeCompare(b[0]))[0][1].row

  const collide = (winner.top_notes || []).filter((n) => FILTER_ACCORDS.has(String(n).trim().toLowerCase()))
  if (collide.length) {
    blocked.push({ key, collide })
    continue
  }

  for (const e of entries) {
    if (sig(e.r) === sig(winner)) continue
    changes.push({
      file: e.f, idx: e.i, id: e.r.id, key,
      fromTop: (e.r.top_notes || []).join(', '),
      toTop: (winner.top_notes || []).join(', '),
      fields: {
        top_notes: [...winner.top_notes],
        middle_notes: [...winner.middle_notes],
        base_notes: [...winner.base_notes],
        description: winner.description,
      },
    })
  }
}

console.log(`\nMode: ${WRITE ? '*** WRITE ***' : 'DRY RUN'}`)
console.log(`Products with inconsistent pyramids: ${new Set(changes.map((c) => c.key)).size}`)
console.log(`Rows to normalize: ${changes.length}`)
if (blocked.length) {
  console.log(`\nBLOCKED (canonical top note collides with a filter accord):`)
  blocked.forEach((b) => console.log(`  ${b.key} :: ${b.collide.join(', ')}`))
}
console.log('')
const byKey = new Map()
changes.forEach((c) => { if (!byKey.has(c.key)) byKey.set(c.key, []); byKey.get(c.key).push(c) })
for (const [k, cs] of byKey) {
  console.log(`  ${k}`)
  console.log(`     canonical top: ${cs[0].toTop}`)
  cs.forEach((c) => console.log(`     fixing ${c.id}  (was: ${c.fromTop})`))
}

if (!WRITE) { console.log('\nDry run complete. Re-run with --write to apply.\n'); process.exit(0) }

const touched = new Set()
for (const c of changes) { Object.assign(catalogs[c.file][c.idx], c.fields); touched.add(c.file) }
for (const f of touched) writeFileSync(join(DIR, f), JSON.stringify(catalogs[f], null, 2) + '\n')
console.log(`\nNormalized ${changes.length} rows across ${touched.size} files.\n`)
