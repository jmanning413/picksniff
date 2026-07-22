// Catalog integrity guards.
//
// These exist because of GAPS.md #19: the catalog shipped with 748 rows but only
// 746 unique ids, and nothing caught it. IDs are built as
// {gender}-{vibe}-{tier}-{brand}-{name} and omit concentration, so two
// concentrations of the same product in the same gender/vibe/tier collide.
//
// A collision is not cosmetic. Results render with key={f.id} and
// id={`fcard-${f.id}`}, so duplicates produce duplicate React keys and duplicate
// DOM ids, and getFragranceById() returns only the first match, making the
// second row permanently unreachable.

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'fragrances'
const VALID_ACCORDS = [
  'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber', 'Spicy',
  'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
]
const VALID_TIERS = ['budget', 'quality', 'niche']

function loadCatalog() {
  const rows = []
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
    const parsed = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'))
    for (const [index, row] of parsed.entries()) {
      rows.push({ ...row, __file: file, __index: index })
    }
  }
  return rows
}

test('catalog: every id is unique', () => {
  const rows = loadCatalog()
  const seen = new Map()
  const duplicates = []
  for (const row of rows) {
    if (seen.has(row.id)) {
      duplicates.push(`${row.id} (${seen.get(row.id)} and ${row.__file}[${row.__index}])`)
    } else {
      seen.set(row.id, `${row.__file}[${row.__index}]`)
    }
  }
  assert.deepEqual(duplicates, [], `duplicate catalog ids:\n  ${duplicates.join('\n  ')}`)
})

test('catalog: every row has the fields the app depends on', () => {
  const missing = []
  for (const row of loadCatalog()) {
    const where = `${row.__file}[${row.__index}]`
    if (!row.id || typeof row.id !== 'string') missing.push(`${where}: id`)
    if (!row.name) missing.push(`${where}: name`)
    if (!row.brand) missing.push(`${where}: brand`)
    if (!Array.isArray(row.accords) || row.accords.length === 0) missing.push(`${where}: accords`)
  }
  assert.deepEqual(missing, [], `rows missing required fields:\n  ${missing.join('\n  ')}`)
})

test('catalog: accords stay inside the 11-value filter vocabulary', () => {
  const invalid = []
  for (const row of loadCatalog()) {
    for (const accord of row.accords || []) {
      if (!VALID_ACCORDS.includes(accord)) {
        invalid.push(`${row.__file}[${row.__index}] "${accord}" (${row.id})`)
      }
    }
  }
  assert.deepEqual(invalid, [], `accords outside the fixed vocabulary:\n  ${invalid.join('\n  ')}`)
})

test('catalog: tiers stay inside budget/quality/niche', () => {
  const invalid = []
  for (const row of loadCatalog()) {
    if (row.tier && !VALID_TIERS.includes(row.tier)) {
      invalid.push(`${row.__file}[${row.__index}] "${row.tier}" (${row.id})`)
    }
  }
  assert.deepEqual(invalid, [], `invalid tiers:\n  ${invalid.join('\n  ')}`)
})
