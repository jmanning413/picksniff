import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadAllFragrances } from '@/lib/fragrances'
import { BADGE_DEFS, computeBadges } from '@/lib/badges'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export async function generateMetadata({ params }) {
  const { username } = await params
  return {
    title: `@${username} — PickSniff`,
    description: `View ${username}'s fragrance profile on PickSniff.`,
  }
}

const VIBE_LABELS = { daily: 'Daily', date_night: 'Date Night', sport: 'Sport', chill: 'Chill', formal: 'Formal' }

export default async function PublicProfilePage({ params }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, bio, favorite_fragrance, created_at')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const [
    { data: quizResults },
    { data: wishlistItems },
    { data: ownedItems },
    allFragrances,
  ] = await Promise.all([
    supabase.from('quiz_results').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('wishlist').select('fragrance_id').eq('user_id', profile.id),
    supabase.from('owned').select('fragrance_id').eq('user_id', profile.id),
    loadAllFragrances(),
  ])

  const wishlistIds = new Set((wishlistItems ?? []).map((w) => w.fragrance_id))
  const ownedIds = new Set((ownedItems ?? []).map((o) => o.fragrance_id))
  const ownedFragrances = allFragrances.filter((f) => ownedIds.has(f.id))

  const earnedBadgeIds = computeBadges({
    quizCount: (quizResults ?? []).length,
    wishlistCount: wishlistIds.size,
    ownedCount: ownedIds.size,
    reviewCount: 0,
  })
  const earnedBadges = BADGE_DEFS.filter((b) => earnedBadgeIds.includes(b.id))

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <div className="flex items-start gap-5 sm:gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-accent text-3xl font-black text-black sm:h-24 sm:w-24 sm:text-4xl">
              {profile.username[0].toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-black">@{profile.username}</h1>
              {profile.bio && (
                <p className="mt-1.5 max-w-md text-sm leading-6 text-zinc-500">{profile.bio}</p>
              )}
              {profile.favorite_fragrance && (
                <p className="mt-1 text-sm text-zinc-500">
                  <span className="font-bold text-zinc-700">Favourite: </span>
                  {profile.favorite_fragrance}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-400">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {earnedBadges.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Badges</p>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map((b) => (
                  <div key={b.id} title={b.description}
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 cursor-help">
                    <span>{b.emoji}</span>
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ownedFragrances.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                Collection ({ownedFragrances.length})
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ownedFragrances.map((f) => (
                  <Link key={f.id} href={`/fragrance/${f.id}`}
                    className="block rounded-lg border border-zinc-200 p-4 transition hover:border-green-accent hover:shadow-sm">
                    <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                    <h3 className="mt-1 text-base font-black leading-tight text-black">{f.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(f.accords || []).slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(quizResults ?? []).length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Recent Quiz Results</p>
              <div className="space-y-2">
                {(quizResults ?? []).slice(0, 5).map((r) => (
                  <Link key={r.id}
                    href={`/results?genders=${r.genders.join(',')}&tier=${r.tier}&vibe=${r.vibe}${r.accords?.length ? `&accords=${r.accords.join(',')}` : ''}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-green-accent">
                    <div className="flex flex-wrap gap-2">
                      {r.genders.map((g) => <Tag key={g}>{g}</Tag>)}
                      <Tag>{r.tier}</Tag>
                      <Tag>{VIBE_LABELS[r.vibe] ?? r.vibe}</Tag>
                    </div>
                    <span className="text-xs font-black text-green-accent">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-xs font-bold capitalize text-zinc-500">
      {children}
    </span>
  )
}
