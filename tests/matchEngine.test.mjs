import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getTierPool,
  availableAccordsFromPool,
  scoreFragrance,
  applyAccordGuarantee,
  uniquePercentages,
  rankFragrances,
} from '../lib/matchEngine.mjs'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
let nextId = 0
function frag(accords, { tier = 'quality', brand = 'Brand', name } = {}) {
  nextId += 1
  return {
    id: `test-${nextId}`,
    name: name ?? `Frag ${nextId}`,
    brand,
    tier,
    accords,
    top_notes: accords,
    concentration: 'EDP',
  }
}

function pool20() {
  // Varied pool: some Vanilla+Amber+Spicy, some partial, some unrelated.
  // Counter reset so repeated calls build identical pools (determinism test).
  nextId = 0
  return [
    frag(['Vanilla', 'Amber', 'Spicy']),
    frag(['Vanilla', 'Amber', 'Woody']),
    frag(['Vanilla', 'Fresh', 'Citrus']),
    frag(['Amber', 'Spicy', 'Woody']),
    frag(['Fresh', 'Citrus', 'Aquatic']),
    frag(['Fresh', 'Green', 'Aromatic']),
    frag(['Woody', 'Aromatic', 'Green']),
    frag(['Floral', 'Fruity', 'Fresh']),
    frag(['Citrus', 'Aromatic', 'Woody']),
    frag(['Spicy', 'Woody', 'Amber']),
    frag(['Vanilla', 'Floral', 'Fruity']),
    frag(['Aquatic', 'Green', 'Citrus']),
    frag(['Amber', 'Vanilla', 'Spicy']),
    frag(['Fresh', 'Aquatic', 'Green']),
    frag(['Fruity', 'Citrus', 'Floral']),
    frag(['Woody', 'Amber', 'Aromatic']),
    frag(['Green', 'Fresh', 'Citrus']),
    frag(['Spicy', 'Amber', 'Vanilla']),
    frag(['Floral', 'Vanilla', 'Amber']),
    frag(['Aromatic', 'Fresh', 'Woody']),
  ]
}

const OPTS = { tier: 'quality', vibe: 'date_night' }

// ---------------------------------------------------------------------------
// scoreFragrance — band contract
// ---------------------------------------------------------------------------
test('all 3 selected accords matched → 95–99', () => {
  const s = scoreFragrance(frag(['Vanilla', 'Amber', 'Spicy']), {
    ...OPTS, accords: ['Vanilla', 'Amber', 'Spicy'],
  })
  assert.ok(s >= 95 && s <= 99, `got ${s}`)
})

test('single selected accord fully matched is a FULL match → 95–99', () => {
  const s = scoreFragrance(frag(['Vanilla', 'Woody', 'Fresh']), {
    ...OPTS, accords: ['Vanilla'],
  })
  assert.ok(s >= 95 && s <= 99, `got ${s}`)
})

test('2 of 2 selected matched → 95–99; 1 of 2 → 65–79', () => {
  const both = scoreFragrance(frag(['Vanilla', 'Amber', 'Woody']), {
    ...OPTS, accords: ['Vanilla', 'Amber'],
  })
  const half = scoreFragrance(frag(['Vanilla', 'Fresh', 'Citrus']), {
    ...OPTS, accords: ['Vanilla', 'Amber'],
  })
  assert.ok(both >= 95 && both <= 99, `both got ${both}`)
  assert.ok(half >= 65 && half <= 79, `half got ${half}`)
})

test('2 of 3 matched → 80–94; 1 of 3 → 65–79; 0 of 3 → 40–64', () => {
  const two = scoreFragrance(frag(['Vanilla', 'Amber', 'Woody']), {
    ...OPTS, accords: ['Vanilla', 'Amber', 'Spicy'],
  })
  const one = scoreFragrance(frag(['Vanilla', 'Fresh', 'Citrus']), {
    ...OPTS, accords: ['Vanilla', 'Amber', 'Spicy'],
  })
  const zero = scoreFragrance(frag(['Fresh', 'Green', 'Aquatic']), {
    ...OPTS, accords: ['Vanilla', 'Amber', 'Spicy'],
  })
  assert.ok(two >= 80 && two <= 94, `two got ${two}`)
  assert.ok(one >= 65 && one <= 79, `one got ${one}`)
  assert.ok(zero >= 40 && zero <= 64, `zero got ${zero}`)
})

test('no accords selected → 50–72 band', () => {
  const s = scoreFragrance(frag(['Vanilla', 'Amber', 'Spicy']), { ...OPTS, accords: [] })
  assert.ok(s >= 50 && s <= 72, `got ${s}`)
})

test('dominant (first) accord match outscores incidental match within a band', () => {
  // Both are full matches of the single selected accord; one leads with it
  const dominant = scoreFragrance(frag(['Vanilla', 'Woody', 'Green']), {
    ...OPTS, accords: ['Vanilla'],
  })
  const incidental = scoreFragrance(frag(['Woody', 'Green', 'Vanilla']), {
    ...OPTS, accords: ['Vanilla'],
  })
  assert.ok(dominant > incidental, `dominant ${dominant} vs incidental ${incidental}`)
})

test('duplicate selected accords do not distort the fraction', () => {
  const s = scoreFragrance(frag(['Vanilla', 'Woody', 'Fresh']), {
    ...OPTS, accords: ['Vanilla', 'Vanilla', 'vanilla'],
  })
  assert.ok(s >= 95 && s <= 99, `got ${s}`)
})

test('tier bonus applies only when pool was loosened', () => {
  const f = frag(['Woody', 'Green', 'Fresh'], { tier: 'quality' })
  const tight = scoreFragrance(f, { ...OPTS, accords: ['Woody'], tierLoosened: false })
  const loose = scoreFragrance(f, { ...OPTS, accords: ['Woody'], tierLoosened: true })
  assert.ok(loose >= tight, `loosened ${loose} should be >= tight ${tight}`)
})

// ---------------------------------------------------------------------------
// getTierPool
// ---------------------------------------------------------------------------
test('tier pool loosens to full pool when fewer than 5 in tier', () => {
  const pool = [
    frag(['Woody'], { tier: 'niche' }),
    frag(['Amber'], { tier: 'niche' }),
    ...Array.from({ length: 8 }, () => frag(['Fresh'], { tier: 'budget' })),
  ]
  const { pool: loosened, loosened: flag } = getTierPool(pool, 'niche')
  assert.equal(loosened.length, 10)
  assert.equal(flag, true)

  const { pool: tight, loosened: flag2 } = getTierPool(pool, 'budget')
  assert.equal(tight.length, 8)
  assert.equal(flag2, false)
})

// ---------------------------------------------------------------------------
// availableAccordsFromPool
// ---------------------------------------------------------------------------
test('available accords only include accords present, most frequent first', () => {
  const pool = [
    frag(['Vanilla', 'Amber']),
    frag(['Vanilla', 'Woody']),
    frag(['Vanilla', 'Amber']),
  ]
  const accords = availableAccordsFromPool(pool)
  assert.deepEqual(accords, ['Vanilla', 'Amber', 'Woody'])
  assert.ok(!accords.includes('Citrus'))
})

// ---------------------------------------------------------------------------
// uniquePercentages
// ---------------------------------------------------------------------------
test('displayed scores are unique and strictly decreasing', () => {
  const scored = [95, 95, 95, 94, 90, 90].map((s) => ({ ...frag(['Woody']), _rawScore: s }))
  const out = uniquePercentages(scored)
  const scores = out.map((f) => f.score)
  assert.deepEqual(scores, [95, 94, 93, 92, 90, 89])
  for (let i = 1; i < scores.length; i++) assert.ok(scores[i] < scores[i - 1])
  assert.ok(out.every((f) => !('_rawScore' in f)))
})

test('unique scores never go below 1', () => {
  const scored = [2, 2, 2, 2].map((s) => ({ ...frag(['Woody']), _rawScore: s }))
  const scores = uniquePercentages(scored).map((f) => f.score)
  assert.ok(scores.every((s) => s >= 1))
})

// ---------------------------------------------------------------------------
// applyAccordGuarantee
// ---------------------------------------------------------------------------
function ranked(fragments) {
  // helper: fake a pre-sorted scored list, descending
  return fragments.map((f, i) => ({ ...f, _rawScore: 99 - i }))
}

test('missing selected accord gets swapped into the top 5', () => {
  const list = ranked([
    frag(['Woody']), frag(['Woody']), frag(['Woody']), frag(['Woody']), frag(['Woody']),
    frag(['Vanilla']), frag(['Woody']),
  ])
  const out = applyAccordGuarantee(list, ['Woody', 'Vanilla'])
  const top5 = out.slice(0, 5)
  assert.ok(top5.some((f) => f.accords.includes('Vanilla')), 'Vanilla carrier must be in top 5')
  assert.ok(top5.some((f) => f.accords.includes('Woody')))
})

test('guarantee never evicts the sole cover of another selected accord', () => {
  const list = ranked([
    frag(['Amber']),           // sole cover of Amber
    frag(['Woody']), frag(['Woody']), frag(['Woody']), frag(['Woody']),
    frag(['Vanilla']),
  ])
  const out = applyAccordGuarantee(list, ['Amber', 'Woody', 'Vanilla'])
  const top5 = out.slice(0, 5)
  assert.ok(top5.some((f) => f.accords.includes('Amber')), 'Amber sole cover must survive')
  assert.ok(top5.some((f) => f.accords.includes('Vanilla')))
  assert.ok(top5.some((f) => f.accords.includes('Woody')))
})

test('guarantee keeps each section internally sorted; display scores stay monotonic end-to-end', () => {
  const list = ranked([
    frag(['Woody']), frag(['Woody']), frag(['Woody']), frag(['Woody']), frag(['Woody']),
    frag(['Woody']), frag(['Woody']), frag(['Vanilla']),
  ])
  const out = applyAccordGuarantee(list, ['Vanilla'])

  // Top 5 and remainder are each sorted internally. (A raw-score inversion at
  // the top-5 boundary is inherent to promotion — the guarantee deliberately
  // lifts a lower-scored carrier into the top 5.)
  for (let i = 1; i < 5; i++) {
    assert.ok(out[i]._rawScore <= out[i - 1]._rawScore, `top: ${i}`)
  }
  for (let i = 6; i < out.length; i++) {
    assert.ok(out[i]._rawScore <= out[i - 1]._rawScore, `rest: ${i}`)
  }

  // What the user sees must be strictly decreasing — uniquePercentages clamps
  // the boundary inversion away.
  const displayed = uniquePercentages(out).map((f) => f.score)
  for (let i = 1; i < displayed.length; i++) {
    assert.ok(displayed[i] < displayed[i - 1],
      `displayed position ${i}: ${displayed[i]} !< ${displayed[i - 1]}`)
  }
})

test('guarantee is a no-op when accord exists nowhere in the pool', () => {
  const list = ranked([frag(['Woody']), frag(['Amber']), frag(['Fresh'])])
  const out = applyAccordGuarantee(list, ['Vanilla'])
  assert.equal(out.length, 3)
})

// ---------------------------------------------------------------------------
// rankFragrances — end to end on a fixture pool
// ---------------------------------------------------------------------------
test('rankFragrances: full pipeline invariants hold', () => {
  const results = rankFragrances(pool20(), {
    ...OPTS, accords: ['Vanilla', 'Amber', 'Spicy'], limit: 10,
  })

  assert.equal(results.length, 10)

  // strictly decreasing unique scores
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i].score < results[i - 1].score)
  }

  // every selected accord present in top 5
  const top5 = results.slice(0, 5)
  for (const accord of ['Vanilla', 'Amber', 'Spicy']) {
    assert.ok(top5.some((f) => f.accords.includes(accord)), `${accord} missing from top 5`)
  }

  // top result is a full match in the 95–99 band region (may step down 1–2 for uniqueness)
  assert.ok(results[0].score >= 95 && results[0].score <= 99)

  // no internal fields leak
  assert.ok(results.every((f) => !('_rawScore' in f)))
})

test('rankFragrances respects limit and handles empty pool', () => {
  assert.deepEqual(rankFragrances([], { ...OPTS, accords: [] }), [])
  const r = rankFragrances(pool20(), { ...OPTS, accords: [], limit: 5 })
  assert.equal(r.length, 5)
})

test('rankFragrances de-duplicates same brand+name+concentration', () => {
  const pool = [
    frag(['Amber', 'Spicy', 'Woody'], { brand: 'Versace', name: 'Eros Flame' }),
    frag(['Amber', 'Spicy', 'Woody'], { brand: 'Versace', name: 'Eros Flame' }), // dup
    frag(['Fresh', 'Citrus', 'Aquatic'], { brand: 'Dior', name: 'Sauvage' }),
  ]
  // both Eros Flames default to EDP via the frag() fixture
  const results = rankFragrances(pool, { ...OPTS, accords: ['Amber'], limit: 10 })
  const erosCount = results.filter((f) => f.name === 'Eros Flame').length
  assert.equal(erosCount, 1, 'Eros Flame must appear exactly once')
})

test('rankFragrances is deterministic', () => {
  const a = rankFragrances(pool20(), { ...OPTS, accords: ['Vanilla', 'Amber'], limit: 10 })
  const b = rankFragrances(pool20(), { ...OPTS, accords: ['Vanilla', 'Amber'], limit: 10 })
  assert.deepEqual(a.map((f) => [f.name, f.score]), b.map((f) => [f.name, f.score]))
})
