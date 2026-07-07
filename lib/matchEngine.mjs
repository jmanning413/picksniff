// Pure matching engine — no framework imports so it can be unit-tested with
// plain `node --test`. All fragrance/scoring logic lives here;
// lib/matchFragrances.js is a thin async wrapper that loads the catalog and
// delegates to these functions.
//
// Scoring contract (product rules):
//   Band is set by the FRACTION of the user's selected accords the fragrance
//   matches (so picking 1 accord and matching it is a full match):
//     all selected matched → 95–99
//     ≥ 2/3 matched        → 80–94
//     some matched         → 65–79
//     none matched         → 40–64
//     no accords selected  → 50–72
//   (With 3 accords selected this is identical to the original 3/2/1/0 table.)
//   Secondary signals position a fragrance inside its band. Displayed scores
//   are strictly decreasing down the list — no ties, never out of order.
//   Every selected accord is represented in the top 5 when any candidate
//   carries it (accord guarantee).

// Secondary vibe weights used for differentiation within score bands
export const VIBE_WEIGHTS = {
  daily: ['Fresh', 'Citrus', 'Aromatic', 'Green'],
  date_night: ['Vanilla', 'Amber', 'Spicy', 'Floral'],
  sport: ['Fresh', 'Aquatic', 'Citrus', 'Aromatic'],
  chill: ['Woody', 'Green', 'Fresh', 'Vanilla'],
  formal: ['Woody', 'Amber', 'Spicy', 'Floral'],
}

export function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

// Filter to the requested tier, loosening to the whole pool when the tier
// slice is too small to give useful results. Returns the pool plus whether
// loosening happened (tier match is only a differentiating signal when the
// pool is mixed-tier).
export function getTierPool(fragrances, tier) {
  const t = normalize(tier)
  const tierPool = fragrances.filter((f) => normalize(f.tier) === t)
  if (tierPool.length >= 5) return { pool: tierPool, loosened: false }
  return { pool: fragrances, loosened: true }
}

// Accords that actually exist in a pool, most common first (ties alphabetical
// for determinism).
export function availableAccordsFromPool(pool) {
  const counts = new Map()
  for (const f of pool) {
    for (const a of f.accords || []) {
      counts.set(a, (counts.get(a) || 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
    .map(([accord]) => accord)
}

export function scoreFragrance(fragrance, { tier, vibe, accords = [], notes = [], tierLoosened = false }) {
  const fragranceAccords = new Set((fragrance.accords || []).map(normalize))
  const selected = [...new Set(accords.map(normalize).filter(Boolean))]

  // Primary: fraction of selected accords matched sets the band
  let bandMin, bandMax
  if (selected.length === 0) {
    bandMin = 50; bandMax = 72
  } else {
    const matched = selected.filter((a) => fragranceAccords.has(a)).length
    const fraction = matched / selected.length
    if (fraction === 1)          { bandMin = 95; bandMax = 99 }
    else if (fraction >= 2 / 3)  { bandMin = 80; bandMax = 94 }
    else if (fraction > 0)       { bandMin = 65; bandMax = 79 }
    else                         { bandMin = 40; bandMax = 64 }
  }

  // Secondary signals, 0–100 budget, scaled into the band
  let secondary = 0

  // The fragrance's FIRST accord is its dominant character; if the user asked
  // for it, this is a stronger match than an incidental accord hit.
  const firstAccord = normalize((fragrance.accords || [])[0])
  if (selected.length > 0 && firstAccord && selected.includes(firstAccord)) {
    secondary += 30
  }

  // Alignment with accords typical for the chosen vibe
  const vibeAccords = (VIBE_WEIGHTS[vibe] || []).map(normalize)
  secondary += vibeAccords.filter((a) => fragranceAccords.has(a)).length * 10 // max 40

  // Tier match only differentiates when the pool was tier-loosened;
  // otherwise every candidate matches and the bonus is dead weight.
  if (tierLoosened && normalize(fragrance.tier) === normalize(tier)) {
    secondary += 20
  }

  // Notes filter (premium): top_notes currently mirrors accords in the data,
  // so this is a weak proxy signal until real notes data exists (GAPS #11).
  if (notes.length > 0) {
    const notePool = new Set(
      [...(fragrance.accords || []), ...(fragrance.top_notes || [])].map(normalize),
    )
    const noteMatches = notes.map(normalize).filter((n) => notePool.has(n)).length
    secondary += Math.min(10, noteMatches * 5)
  }

  const secondaryFraction = Math.min(secondary, 100) / 100
  return Math.round(bandMin + secondaryFraction * (bandMax - bandMin))
}

// Ensure every selected accord appears on at least one top-N fragrance when
// any candidate in the ranked list carries it. Swaps the best carrier in for
// the lowest-ranked top entry that isn't the sole cover of another selected
// accord, then re-sorts each section so displayed scores stay in order.
export function applyAccordGuarantee(results, selectedAccords, topN = 5) {
  if (!selectedAccords || selectedAccords.length === 0) return results
  if (results.length <= 1) return results

  const selected = [...new Set(selectedAccords.map(normalize).filter(Boolean))]
  const top = results.slice(0, topN)
  const rest = results.slice(topN)
  const hasAccord = (f, a) => (f.accords || []).map(normalize).includes(a)

  for (const accord of selected) {
    if (top.some((f) => hasAccord(f, accord))) continue

    const candidateIdx = rest.findIndex((f) => hasAccord(f, accord))
    if (candidateIdx === -1) continue // nothing in the pool has it — skip

    const candidate = rest[candidateIdx]

    // Lowest-ranked top entry that is not the only cover of another selected accord
    let swapIdx = -1
    for (let i = top.length - 1; i >= 0; i--) {
      const isSoleCover = selected.some(
        (other) =>
          other !== accord &&
          hasAccord(top[i], other) &&
          !top.some((f, fi) => fi !== i && hasAccord(f, other)),
      )
      if (!isSoleCover) { swapIdx = i; break }
    }
    if (swapIdx === -1) swapIdx = top.length - 1

    rest[candidateIdx] = top[swapIdx]
    top[swapIdx] = candidate
  }

  const byScore = (a, b) => b._rawScore - a._rawScore
  top.sort(byScore)
  rest.sort(byScore)
  return [...top, ...rest]
}

// Convert raw scores to displayed percentages: strictly decreasing down the
// list (no ties, never out of order), floor 1. When many fragrances tie on a
// raw score, later ones step down by 1 — which can dip below a band floor;
// that's the unavoidable cost of unique integer scores in a narrow band.
export function uniquePercentages(scored) {
  const out = []
  let prev = Infinity
  for (const fragrance of scored) {
    const { _rawScore, ...rest } = fragrance
    const score = Math.max(1, Math.min(_rawScore, prev - 1))
    out.push({ ...rest, score })
    prev = score
  }
  return out
}

// Rank a pre-filtered pool. Deterministic: score desc, then brand+name.
export function rankFragrances(pool, { tier, vibe, accords = [], notes = [], limit = 20, tierLoosened = false }) {
  if (pool.length === 0) return []

  const scored = pool
    .map((f) => ({
      ...f,
      _rawScore: scoreFragrance(f, { tier, vibe, accords, notes, tierLoosened }),
    }))
    .sort(
      (a, b) =>
        b._rawScore - a._rawScore ||
        `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`),
    )

  // Guarantee runs on the full ranked list so swaps can pull from beyond the limit
  const guaranteed = applyAccordGuarantee(scored, accords)

  return uniquePercentages(guaranteed.slice(0, limit))
}
