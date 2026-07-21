#!/usr/bin/env node
// Regression harness: snapshots ranked match output across a wide grid of quiz
// inputs so a catalog data change can be proven not to alter scoring.
//
//   node scripts/snapshot-matches.mjs before.json
//   ...make the data change...
//   node scripts/snapshot-matches.mjs after.json
//   node scripts/snapshot-matches.mjs --diff before.json after.json
//
// Replicates lib/fragrances.js (filename -> gender/vibe stamping) and calls the
// pure engine directly, avoiding the Next.js unstable_cache dependency.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getTierPool, rankFragrances } from '../lib/matchEngine.mjs'

const GENDERS = ['male', 'female', 'unisex']
const VIBES = ['daily', 'date_night', 'sport', 'chill', 'formal']
const TIERS = ['budget', 'quality', 'niche']
const ACCORDS = ['Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber', 'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green']

const args = process.argv.slice(2)

function loadAll() {
  const out = []
  for (const g of GENDERS) {
    for (const v of VIBES) {
      try {
        const raw = readFileSync(join('fragrances', `${g}_${v}_final.json`), 'utf-8')
        for (const f of JSON.parse(raw)) out.push({ ...f, gender: g, vibe: v })
      } catch {}
    }
  }
  return out
}

function run(all, { genders, tier, vibe, accords, notes }) {
  let pool = all.filter((f) => genders.includes(f.gender) && f.vibe === vibe)
  const { pool: tierPool, loosened } = getTierPool(pool, tier)
  return rankFragrances(tierPool, { tier, vibe, accords, notes, limit: 20, tierLoosened: loosened })
}

function snapshot() {
  const all = loadAll()
  const cases = []

  // accord selections: none, each single, and a few multi combos
  const accordSets = [[], ...ACCORDS.map((a) => [a]), ['Citrus', 'Fresh'], ['Woody', 'Amber', 'Spicy'], ['Floral', 'Vanilla', 'Fruity']]

  for (const g of GENDERS) {
    for (const v of VIBES) {
      for (const t of TIERS) {
        for (const accords of accordSets) {
          const key = `${g}|${v}|${t}|${accords.join('+') || 'none'}`
          const res = run(all, { genders: [g], tier: t, vibe: v, accords, notes: [] })
          cases.push({ key, results: res.map((r) => `${r.id}:${r.score ?? r.matchScore ?? ''}`) })
        }
      }
    }
  }

  // notes filter exercised explicitly: this is the path that top_notes feeds
  for (const g of GENDERS) {
    for (const v of VIBES) {
      for (const notes of [['Vanilla'], ['Amber'], ['Green'], ['Citrus', 'Woody']]) {
        const key = `NOTES|${g}|${v}|quality|${notes.join('+')}`
        const res = run(all, { genders: [g], tier: 'quality', vibe: v, accords: ['Fresh'], notes })
        cases.push({ key, results: res.map((r) => `${r.id}:${r.score ?? r.matchScore ?? ''}`) })
      }
    }
  }

  return cases
}

if (args[0] === '--diff') {
  const a = JSON.parse(readFileSync(args[1], 'utf8'))
  const b = JSON.parse(readFileSync(args[2], 'utf8'))
  const mapB = new Map(b.map((c) => [c.key, c.results.join(',')]))
  let changed = 0
  for (const c of a) {
    const before = c.results.join(',')
    const after = mapB.get(c.key)
    if (after === undefined) { console.log(`MISSING in after: ${c.key}`); changed++; continue }
    if (before !== after) {
      changed++
      console.log(`\nCHANGED  ${c.key}`)
      const bs = before.split(','), as = after.split(',')
      for (let i = 0; i < Math.max(bs.length, as.length); i++) {
        if (bs[i] !== as[i]) console.log(`   [${i}] ${bs[i] || '(none)'}  ->  ${as[i] || '(none)'}`)
      }
    }
  }
  console.log(`\n${changed === 0 ? 'IDENTICAL' : 'DIFFERENCES'}: ${changed} of ${a.length} cases changed.`)
  process.exit(changed === 0 ? 0 : 1)
}

const cases = snapshot()
writeFileSync(args[0], JSON.stringify(cases, null, 2))
console.log(`Wrote ${cases.length} cases to ${args[0]}`)
