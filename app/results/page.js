import Link from 'next/link'
import { headers } from 'next/headers'
import { matchFragrances } from '@/lib/matchFragrances'
import { checkResultsLimit, ipFromHeaders } from '@/lib/ratelimit'
import { FILTER_ACCORDS, VALID_TIERS, VALID_VIBES, VALID_CONCENTRATIONS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import ResultsClient from './ResultsClient'

export const metadata = {
  title: 'Your Matches | PickSniff',
  description: 'Your personalised fragrance matches ranked by preference.',
}

function parseList(value, fallback) {
  if (!value) return fallback
  return String(value).split(',').map((s) => s.trim()).filter(Boolean)
}

function findPeopleAlsoLiked(allFragrances, topResult, mainResults) {
  if (!topResult) return []
  const mainIds = new Set(mainResults.map((f) => f.id))
  const topAccords = new Set((topResult.accords || []).map((a) => a.toLowerCase()))

  return allFragrances
    .filter((f) => !mainIds.has(f.id) && f.id !== topResult.id)
    .map((f) => {
      const shared = (f.accords || []).filter((a) => topAccords.has(a.toLowerCase())).length
      return { ...f, _shared: shared }
    })
    .filter((f) => f._shared > 0)
    .sort((a, b) => b._shared - a._shared)
    .slice(0, 3)
    .map(({ _shared, ...f }) => f)
}

const VALID_GENDERS = ['male', 'female', 'unisex']

export default async function ResultsPage({ searchParams }) {
  // Rate limit + strict input validation (GAPS #5) - this page recomputes
  // matches from raw URL params, so it is the surface that needs guarding.
  const { success: withinLimit } = await checkResultsLimit(ipFromHeaders(await headers()))
  if (!withinLimit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 text-center">
        <h1 className="text-2xl font-black text-black">Slow down a moment</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate">
          Too many requests from your connection. Please wait a minute and try again.
        </p>
      </div>
    )
  }

  const params = await searchParams
  const rawGenders = parseList(params.genders, ['unisex']).filter((g) => VALID_GENDERS.includes(g))
  const genders = rawGenders.length > 0 ? rawGenders : ['unisex']
  const tier = VALID_TIERS.includes(params.tier) ? params.tier : 'quality'
  const vibe = VALID_VIBES.includes(params.vibe) ? params.vibe : 'daily'
  const accords = parseList(params.accords, []).filter((a) => FILTER_ACCORDS.includes(a)).slice(0, 3)
  const concentrations = parseList(params.concentrations, []).filter((c) => VALID_CONCENTRATIONS.includes(c))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let wishedIds = new Set()
  let ownedIds = new Set()
  const isLoggedIn = !!user

  if (user) {
    const [{ data: wishlist }, { data: owned }] = await Promise.all([
      supabase.from('wishlist').select('fragrance_id').eq('user_id', user.id),
      supabase.from('owned').select('fragrance_id').eq('user_id', user.id),
    ])
    wishedIds = new Set((wishlist ?? []).map((w) => w.fragrance_id))
    ownedIds = new Set((owned ?? []).map((o) => o.fragrance_id))
  }

  const mode = params.mode || null
  const limit = isLoggedIn ? 20 : 10
  const fragrances = await matchFragrances({ genders, tier, vibe, accords, concentrations, limit })

  // Build People Also Liked from the full unfiltered pool
  const allPool = await matchFragrances({ genders, tier, vibe, accords: [], concentrations: [], limit: 50 })
  const alsoLiked = findPeopleAlsoLiked(allPool, fragrances[0], fragrances)

  const wishlistMap = {}
  const ownedMap = {}
  for (const f of fragrances) {
    wishlistMap[f.id] = wishedIds.has(f.id)
    ownedMap[f.id] = ownedIds.has(f.id)
  }
  for (const f of alsoLiked) {
    wishlistMap[f.id] = wishedIds.has(f.id)
    ownedMap[f.id] = ownedIds.has(f.id)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-black">
      <Header />
      <ResultsClient
        fragrances={fragrances}
        alsoLiked={alsoLiked}
        genders={genders}
        tier={tier}
        vibe={vibe}
        accords={accords}
        isLoggedIn={isLoggedIn}
        wishlistMap={wishlistMap}
        ownedMap={ownedMap}
        username={null}
        mode={mode}
      />
      <Footer />
    </div>
  )
}
