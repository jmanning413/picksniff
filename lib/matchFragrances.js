import { loadAllFragrances } from '@/lib/fragrances'

const VIBE_WEIGHTS = {
  daily: ['Fresh', 'Citrus', 'Aromatic', 'Green'],
  date_night: ['Vanilla', 'Amber', 'Spicy', 'Floral'],
  sport: ['Fresh', 'Aquatic', 'Citrus', 'Aromatic'],
  chill: ['Woody', 'Green', 'Fresh', 'Vanilla'],
  formal: ['Woody', 'Amber', 'Spicy', 'Floral'],
}

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

function scoreFragrance(fragrance, { tier, vibe, accords, notes = [] }) {
  const fragranceAccords = normalizeAccords(fragrance.accords)
  const selectedAccords = accords.map(normalize).filter(Boolean)
  const vibeAccords = (VIBE_WEIGHTS[vibe] || []).map(normalize)

  let score = 52

  if (normalize(fragrance.tier) === normalize(tier)) score += 18
  score += Math.min(12, (fragrance.accords || []).length * 2)

  if (selectedAccords.length > 0) {
    const matches = selectedAccords.filter((a) => fragranceAccords.has(a)).length
    score += matches * 10
    score += Math.max(0, selectedAccords.length - matches) * -3
  } else {
    score += 8
  }

  const vibeMatches = vibeAccords.filter((a) => fragranceAccords.has(a)).length
  score += vibeMatches * 4

  if (notes.length > 0) {
    const topNotes = (fragrance.top_notes || []).map(normalize)
    const noteMatches = notes.map(normalize).filter((n) => topNotes.includes(n)).length
    score += noteMatches * 5
  }

  return score
}

function uniquePercentages(scored) {
  let previous = 99
  return scored.map((fragrance, index) => {
    const raw = Math.round(fragrance._rawScore - index * 0.7)
    const score = Math.max(62, Math.min(previous - 1, raw))
    previous = score
    const { _rawScore, ...result } = fragrance
    return { ...result, score }
  })
}

export async function matchFragrances({ genders, tier, vibe, accords = [], concentrations = [], notes = [], limit = 20 }) {
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
    .map((f) => ({ ...f, _rawScore: scoreFragrance(f, { tier: safeTier, vibe: safeVibe, accords, notes }) }))
    .sort((a, b) => {
      if (b._rawScore !== a._rawScore) return b._rawScore - a._rawScore
      return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`)
    })
    .slice(0, limit)

  return uniquePercentages(scored)
}
