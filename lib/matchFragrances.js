import { loadAllFragrances } from '@/lib/fragrances'
import {
  normalize,
  getTierPool,
  availableAccordsFromPool,
  rankFragrances,
} from './matchEngine.mjs'

// Thin async wrappers around the pure engine in lib/matchEngine.mjs.
// All scoring/banding/guarantee logic lives there (unit-tested via `npm test`).

// Accords that actually exist in the fragrance pool for the given
// gender + vibe (tier-loosened if the pool is too small), most common first.
export async function getAvailableAccords(gender, tier, vibe) {
  const safeGender = normalize(gender) || 'unisex'
  const safeTier = normalize(tier) || 'quality'
  const safeVibe = normalize(vibe) || 'daily'

  const all = await loadAllFragrances()

  const genders = safeGender === 'all' ? ['male', 'female', 'unisex'] : [safeGender]
  const genderVibePool = all.filter(
    (f) => genders.includes(f.gender) && f.vibe === safeVibe,
  )

  const { pool } = getTierPool(genderVibePool, safeTier)
  return availableAccordsFromPool(pool)
}

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

  const { pool: tierPool, loosened } = getTierPool(pool, safeTier)

  return rankFragrances(tierPool, {
    tier: safeTier,
    vibe: safeVibe,
    accords,
    notes,
    limit,
    tierLoosened: loosened,
  })
}
