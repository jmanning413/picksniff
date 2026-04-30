import Link from 'next/link'
import { matchFragrances } from '@/lib/matchFragrances'
import { createClient } from '@/lib/supabase/server'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import ResultsClient from './ResultsClient'

export const metadata = {
  title: 'Your Matches — PickSniff',
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

export default async function ResultsPage({ searchParams }) {
  const params = await searchParams
  const genders = parseList(params.genders, ['unisex'])
  const tier = params.tier || 'quality'
  const vibe = params.vibe || 'daily'
  const accords = parseList(params.accords, [])
  const concentrations = parseList(params.concentrations, [])

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
    <div className="flex min-h-screen flex-col bg-white text-black">
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
      />
      <Footer />
    </div>
  )
}
