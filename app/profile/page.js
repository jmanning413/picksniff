import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadAllFragrances } from '@/lib/fragrances'
import { BADGE_DEFS, computeBadges } from '@/lib/badges'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import ProfileTabs from './ProfileTabs'
import SignOutButton from '../_components/SignOutButton'
import WardrobeButton from '../_components/WardrobeButton'
import QuizIcon from '@/app/_components/QuizIcons'

export const metadata = { title: 'My Profile' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const [
    { data: profile },
    { data: quizResults },
    { data: wishlistItems },
    { data: ownedItems },
    allFragrances,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('quiz_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('wishlist').select('fragrance_id').eq('user_id', user.id),
    supabase.from('owned').select('fragrance_id').eq('user_id', user.id),
    loadAllFragrances(),
  ])

  // Self-heal accounts that lost their profile row (GAPS #9)
  let activeProfile = profile
  if (!activeProfile) {
    const fallbackUsername = `sniffer_${user.id.replace(/-/g, '').slice(0, 10)}`
    const { data: created } = await supabase
      .from('profiles')
      .insert({ id: user.id, username: fallbackUsername })
      .select('*')
      .single()
    if (!created) redirect('/auth')
    activeProfile = created
  }

  const wishlistIds = new Set((wishlistItems ?? []).map((w) => w.fragrance_id))
  const ownedIds = new Set((ownedItems ?? []).map((o) => o.fragrance_id))
  const wishlistFragrances = allFragrances.filter((f) => wishlistIds.has(f.id))
  const ownedFragrances = allFragrances.filter((f) => ownedIds.has(f.id))

  const earnedBadgeIds = computeBadges({
    quizCount: (quizResults ?? []).length,
    wishlistCount: wishlistIds.size,
    ownedCount: ownedIds.size,
    reviewCount: 0,
  })
  const earnedBadges = BADGE_DEFS.filter((b) => earnedBadgeIds.includes(b.id))
  const lockedBadges = BADGE_DEFS.filter((b) => !earnedBadgeIds.includes(b.id))

  return (
    <div className="flex min-h-screen flex-col bg-cream text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <div className="flex items-start gap-5 sm:gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-accent text-3xl font-black text-black sm:h-24 sm:w-24 sm:text-4xl">
              {activeProfile.username[0].toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-black">@{activeProfile.username}</h1>
              {activeProfile.bio && (
                <p className="mt-1.5 max-w-md text-sm leading-6 text-slate">{activeProfile.bio}</p>
              )}
              {activeProfile.favorite_fragrance && (
                <p className="mt-1 text-sm text-slate">
                  <span className="font-bold text-zinc-700">Favourite: </span>
                  {activeProfile.favorite_fragrance}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-400">
                Member since {new Date(activeProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <SignOutButton />
            <WardrobeButton quizResults={quizResults ?? []} allFragrances={allFragrances} />
          </div>

          {/* Badges */}
          <div className="mt-10">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Badges</p>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((b) => (
                <div key={b.id} title={b.description}
                  className="flex items-center gap-1.5 rounded-full border border-green-accent bg-green-accent/10 px-3 py-1.5 text-xs font-bold text-zinc-700 cursor-help">
                  <span className="text-green-deep"><QuizIcon name={b.icon} size={15} /></span><span>{b.name}</span>
                </div>
              ))}
              {lockedBadges.map((b) => (
                <div key={b.id} title={`Locked: ${b.description}`}
                  className="flex items-center gap-1.5 rounded-full border border-sand bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-400 cursor-help opacity-50">
                  <span className="text-green-deep"><QuizIcon name={b.icon} size={15} /></span><span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          <ProfileTabs
            quizResults={quizResults ?? []}
            wishlistFragrances={wishlistFragrances}
            ownedFragrances={ownedFragrances}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
