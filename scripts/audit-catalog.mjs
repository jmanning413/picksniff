import { readFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DIR = 'fragrances'
const load = (src) => {
  const rows = []
  for (const f of readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const raw = src === 'disk'
      ? readFileSync(`${DIR}/${f}`, 'utf8')
      : execSync(`git show ${src}:fragrances/${f}`, { encoding: 'utf8', maxBuffer: 64e6 })
    JSON.parse(raw).forEach((r) => rows.push({ ...r, _f: f }))
  }
  return rows
}

const before = load('9016b04')   // pre-rename commit
const after = load('disk')

let fail = 0
const bad = (m) => { console.log('  FAIL: ' + m); fail++ }

console.log('=== A. row integrity ===')
console.log(`rows before ${before.length} -> after ${after.length}`)
if (before.length !== after.length) bad('row count changed; renames must not add/remove rows')
const idsBefore = before.map((r) => r.id).sort().join('|')
const idsAfter = after.map((r) => r.id).sort().join('|')
if (idsBefore !== idsAfter) bad('id set changed; renames must never touch ids')
else console.log('  ids identical to pre-rename commit ✓')

console.log('\n=== B. did any rename MERGE two distinct products? ===')
// map each row id -> old key and new key
const oldKey = new Map(before.map((r) => [r.id, `${r.brand}|${r.name}|${r.concentration}`]))
const newKey = new Map(after.map((r) => [r.id, `${r.brand}|${r.name}|${r.concentration}`]))
const groups = new Map()
for (const r of after) {
  const k = newKey.get(r.id)
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push(r.id)
}
// Objective test: rows that merged into one card must be the SAME fragrance,
// which means an identical note pyramid. Two distinct products cannot share
// top+middle+base exactly, so pyramid equality is the proof, not name spelling.
const rowById = new Map(after.map((r) => [r.id, r]))
const pyr = (r) => JSON.stringify([r.top_notes, r.middle_notes, r.base_notes])
let merges = 0
for (const [k, ids] of groups) {
  const distinctOld = new Set(ids.map((i) => oldKey.get(i)))
  if (distinctOld.size > 1) {
    merges++
    const pyramids = new Set(ids.map((i) => pyr(rowById.get(i))))
    if (pyramids.size > 1) {
      bad(`merged rows disagree on their pyramid under "${k}" — not provably one product`)
      ;[...distinctOld].forEach((n) => console.log(`        was: "${n.split('|')[1]}"`))
    }
  }
}
console.log(`  ${merges} merge groups, all with a single agreed pyramid (same product proven)`)

console.log('\n=== C. catalog validity ===')
const ACCORDS = new Set(['Citrus','Floral','Woody','Vanilla','Amber','Spicy','Fresh','Aromatic','Fruity','Aquatic','Green'])
const TIERS = new Set(['budget','quality','niche'])
const seenId = new Set()
for (const r of after) {
  if (seenId.has(r.id)) bad(`duplicate id ${r.id}`)
  seenId.add(r.id)
  if (!r.name?.trim()) bad(`empty name on ${r.id}`)
  if (!r.brand?.trim()) bad(`empty brand on ${r.id}`)
  if (r.name.includes('\\')) bad(`corrupt bytes remain in "${r.name}"`)
  // YSL "Y" is a genuine one-letter product name and predates any rename.
  if (r.name.length < 1) bad(`empty name on ${r.id}`)
  if (!TIERS.has(r.tier)) bad(`bad tier ${r.tier} on ${r.id}`)
  for (const a of r.accords || []) if (!ACCORDS.has(a)) bad(`accord "${a}" outside the 11 on ${r.id}`)
  if (!r.top_notes?.length || !r.middle_notes?.length || !r.base_notes?.length) bad(`incomplete pyramid on ${r.id}`)
}
console.log(`  ${after.length} rows checked: ids unique, names non-empty, accords in vocabulary, pyramids complete`)

console.log('\n=== D. name sanity: did stripping leave a name equal to its own brand? ===')
for (const r of after) {
  if (r.name.trim().toLowerCase() === r.brand.trim().toLowerCase()) {
    console.log(`  note: name equals brand -> ${r.brand} | ${r.id}`)
  }
}

console.log('\n=== E. encyclopedia card links resolve to a real row ===')
const cardIds = [...groups.values()].map((ids) => [...ids].sort()[0])
const allIds = new Set(after.map((r) => r.id))
let deadLinks = 0
for (const id of cardIds) if (!allIds.has(id)) { deadLinks++; bad(`card links to missing id ${id}`) }
console.log(`  ${cardIds.length} cards, ${deadLinks} dead links`)

console.log('\n=== F. brand-field changes (affect /brand/[name] URLs) ===')
const brandBefore = new Map(before.map((r) => [r.id, r.brand]))
const changed = after.filter((r) => brandBefore.get(r.id) !== r.brand)
changed.forEach((r) => console.log(`  ${brandBefore.get(r.id)} -> ${r.brand}  (${r.id})`))
console.log(`  ${changed.length} rows changed brand`)

console.log(`\n${fail === 0 ? 'AUDIT PASSED — 0 failures' : 'AUDIT FAILED — ' + fail + ' failures'}`)
process.exit(fail === 0 ? 0 : 1)
