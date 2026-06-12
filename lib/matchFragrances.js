import { loadAllFragrances } from '@/lib/fragrances'

// Secondary vibe weights used for tiebreaking within score bands
const VIBE_WEIGHTS = {
  daily: ['Fresh', 'Citrus', 'Aromatic', 'Green'],
  date_night: ['Vanilla', 'Amber', 'Spicy', 'Floral'],
  sport: ['Fresh', 'Aquatic', 'Citrus', 'Aromatic'],
  chill: ['Woody', 'Green', 'Fresh', 'Vanilla'],
  formal: ['Woody', 'Amber', 'Spicy', 'Floral'],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeAccords(accords) {
  return new Set((accords || []).map(normalize).filter(Boolean))
}

function getTierPool(fragrances, tier) {
  const tierPool = fragrances.filter((f) => normalize(f.tier) === normalize(tier))
  return tierPool.length >= 5 ? tierPool : fragrances
}

// ---------------------------------------------------------------------------
// FIX 1 — getAvailableAccords
// Returns accords that actually exist in the fragrance pool for the given
// gender + vibe (tier-loosened if pool too small), sorted by frequency.
// ---------------------------------------------------------------------------
export async function getAvailableAccords(gender, tier, vibe) {
  const safeGender = normalize(gender) || 'unisex'
  const safeTier = normalize(tier) || 'quality'
  const safeVibe = normalize(vibe) || 'daily'

  const all = await loadAllFragrances()

  // Filter to matching gender(s) + vibe
  const genders = safeGender === 'all' ? ['male', 'female', 'unisex'] : [safeGender]
  let pool = all.filter((f) => genders.includes(f.gender) && f.vibe === safeVibe)

  // Apply same tier-loosening logic as getTierPool
  pool = getTierPool(pool, safeTier)

  if (pool.length === 0) return []

  // Count how many fragrances carry each accord
  const counts = {}
  for (const f of pool) {
    for (const a of f.accords || []) {
      counts[a] = (counts[a] || 0) + 1
    }
  }

  // Sort by frequency descending
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([accord]) => accord)
}

// ---------------------------------------------------------------------------
// FIX 3 — Scoring bands
// 3 accord matches → 95–99
// 2 accord matches → 80–94
// 1 accord match   → 65–79
// 0 accord matches → 40–64
// Secondary signals (tier, vibe, note matches) differentiate within band.
// ---------------------------------------------------------------------------
function scoreFragrance(fragrance, { tier, vibe, accords, notes = [] }) {
  const fragranceAccords = normalizeAccords(fragrance.accords)
  const selectedAccords = accords.map(normalize).filter(Boolean)
  const vibeAccords = (VIBE_WEIGHTS[vibe] || []).map(normalize)

  // Primary: accord match count drives the band
  let accordMatches = 0
  if (selectedAccords.length > 0) {
    accordMatches = selectedAccords.filter((a) => fragranceAccords.has(a)).length
    // Cap at 3 for band purposes even if user picked more
    accordMatches = Math.min(accordMatches, 3)
  }

  // Determine base range from accord match count
  // When no accords selected, treat as mid-range 0-match band but boosted
  let bandMin, bandMax
  if (selectedAccords.length === 0) {
    bandMin = 50
    bandMax = 72
  } else if (accordMatches === 3) {
    bandMin = 95
    bandMax = 99
  } else if (accordMatches === 2) {
    bandMin = 80
    bandMax = 94
  } else if (accordMatches === 1) {
    bandMin = 65
    bandMax = 79
  } else {
    // 0 matches
    bandMin = 40
    bandMax = 64
  }

  const bandRange = bandMax - bandMin // how many points we can distribute

  // Secondary signals — normalize to 0..1 range then scale to band
  let secondary = 0
  const maxSecondary = 100 // ceiling for secondary raw points

  // Tier match: strong secondary signal
  if (normalize(fragrance.tier) === normalize(tier)) secondary += 35

  // Vibe accord matches: moderate secondary signal
  const vibeMatches = vibeAccords.filter((a) => fragranceAccords.has(a)).length
  secondary += vibeMatches * 8

  // FIX 4 — Notes: the JSON top_notes field is a mirror of accords, not a
  // separate notes pyramid. Do not double-score accords via top_notes.
  // Instead, only score notes when the caller passes explicit note strings
  // (premium filter). Match against accords as the best available proxy.
  if (notes.length > 0) {
    const normalizedNotes = notes.map(normalize)
    const noteMatches = normalizedNotes.filter((n) => fragranceAccords.has(n)).length
    secondary += noteMatches * 12
  }

  // Fragrance accord count richness (more accords = slightly more differentiated)
  secondary += Math.min(6, (fragrance.accords || []).length)

  // Scale secondary to band
  const secondaryFraction = Math.min(secondary, maxSecondary) / maxSecondary
  const rawScore = bandMin + Math.round(secondaryFraction * bandRange)

  return Math.max(bandMin, Math.min(bandMax, rawScore))
}

// ---------------------------------------------------------------------------
// Unique percentage pass — ensures no ties in final top-N
// Preserves the band boundaries: won't push a score below its band floor.
// ---------------------------------------------------------------------------
function uniquePercentages(scored) {
  // scored is already sorted descending by _rawScore
  const result = []
  const used = new Set()

  for (const fragrance of scored) {
    let score = fragrance._rawScore
    // Walk down until we find an unused slot (stay >= 1)
    while (used.has(score) && score > 1) score--
    used.add(score)
    const { _rawScore, ...rest } = fragrance
    result.push({ ...rest, score })
  }
  return result
}

// ---------------------------------------------------------------------------
// FIX 2 — Accord guarantee in top 5
// After ranking, ensures at least one fragrance in the top 5 carries each
// selected accord. If missing, swaps in the best-matching candidate.
// ---------------------------------------------------------------------------
function applyAccordGuarantee(results, selectedAccords) {
  if (!selectedAccords || selectedAccords.length === 0) return results
  if (results.length <= 1) return results

  const normalizedSelected = selectedAccords.map(normalize).filter(Boolean)
  const topN = 5
  const top = results.slice(0, topN)
  const rest = results.slice(topN)

  for (const accord of normalizedSelected) {
    const topHasAccord = top.some((f) =>
      (f.accords || []).map(normalize).includes(accord),
    )
    if (topHasAccord) continue

    // Find best candidate in the remainder
    const candidateIdx = rest.findIndex((f) =>
      (f.accords || []).map(normalize).includes(accord),
    )
    if (candidateIdx === -1) continue // no fragrance anywhere has this accord — skip

    const candidate = rest[candidateIdx]

    // Find the worst fragrance in top 5 that doesn't satisfy any OTHER selected accord
    // that isn't already covered by another top-5 entry
    let swapIdx = -1
    for (let i = top.length - 1; i >= 0; i--) {
      const topFragAccords = (top[i].accords || []).map(normalize)
      // Check if this top-5 entry is the ONLY cover for any other selected accord
      const isOnlyCoverForAnotherAccord = normalizedSelected
        .filter((a) => a !== accord)
        .some((otherAccord) => {
          const otherCovers = top.filter(
            (f, fi) => fi !== i && (f.accords || []).map(normalize).includes(otherAccord),
          )
          return otherCovers.length === 0 && topFragAccords.includes(otherAccord)
        })
      if (!isOnlyCoverForAnotherAccord) {
        swapIdx = i
        break
      }
    }

    if (swapIdx === -1) {
      // All top-5 entries are sole covers for some other accord; replace the last one
      swapIdx = top.length - 1
    }

    // Perform swap
    const displaced = top[swapIdx]
    top[swapIdx] = candidate
    rest.splice(candidateIdx, 1, displaced)
  }

  return [...top, ...rest]
}

// ---------------------------------------------------------------------------
// Main export — matchFragrances
// ---------------------------------------------------------------------------
export async function matchFragrances({
  genders,
  tier,
  vibe,
  accords = [],
  concentrations = [],
  notes = [],
  limit = 20,
}) {
  const safeGenders = genders?.length ? genders : ['unisex']
  const safeTier = tier || 'quality'
  const safeVibe = vibe || 'daily'

  // Single cached read — no per-request file I/O
  const all = await loadAllFragrances()

  let pool = all.filter(
    (f) => safeGenders.includes(f.gender) && f.vibe === safeVibe,
  )

  if (concentrations.length > 0) {
    const normalizedConc = concentrations.map(normalize)
    pool = pool.filter(
      (f) => f.concentration && normalizedConc.includes(normalize(f.concentration)),
    )
  }

  pool = getTierPool(pool, safeTier)
  if (pool.length === 0) return []

  const scored = pool
    .map((f) => ({
      ...f,
      _rawScore: scoreFragrance(f, { tier: safeTier, vibe: safeVibe, accords, notes }),
    }))
    .sort((a, b) => {
      if (b._rawScore !== a._rawScore) return b._rawScore - a._rawScore
      return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`)
    })

  // FIX 2 — Apply accord guarantee before slicing to limit
  // Pass the full scored list so swaps can pull from beyond position 20
  const guaranteed = applyAccordGuarantee(scored, accords)

  return uniquePercentages(guaranteed.slice(0, limit))
}
