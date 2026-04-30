import Link from 'next/link'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Seasonal Fragrance Picks — PickSniff',
  description: 'The best fragrances for every season, updated automatically.',
}

const SEASON_CONFIG = {
  Spring: {
    emoji: '🌸',
    description: 'Light, fresh, and floral. Spring fragrances wake up with green stems, blooming flowers, and dewy citrus.',
    accords: ['Floral', 'Fresh', 'Green', 'Citrus'],
    vibe: 'daily',
  },
  Summer: {
    emoji: '☀️',
    description: 'Breezy, aquatic, and alive. Summer calls for citrus-forward, aquatic, and light woody fragrances that survive heat.',
    accords: ['Citrus', 'Aquatic', 'Fresh', 'Fruity'],
    vibe: 'sport',
  },
  Autumn: {
    emoji: '🍂',
    description: 'Warm, spiced, and complex. Autumn demands amber, woods, and spices that wrap around you like a coat.',
    accords: ['Amber', 'Woody', 'Spicy', 'Aromatic'],
    vibe: 'chill',
  },
  Winter: {
    emoji: '❄️',
    description: 'Rich, dark, and memorable. Winter fragrances lean into vanilla, oud, and deep musks that project through cold air.',
    accords: ['Vanilla', 'Amber', 'Woody', 'Spicy'],
    vibe: 'formal',
  },
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'Spring'
  if (month >= 6 && month <= 8) return 'Summer'
  if (month >= 9 && month <= 11) return 'Autumn'
  return 'Winter'
}

export default async function SeasonalPage() {
  const all = await loadAllFragrances()
  const currentSeason = getCurrentSeason()

  const seasonalPicks = {}
  for (const [season, config] of Object.entries(SEASON_CONFIG)) {
    const scored = all
      .map((f) => ({
        ...f,
        _score: (f.accords || []).filter((a) => config.accords.includes(a)).length,
      }))
      .filter((f) => f._score > 0)
      .sort((a, b) => b._score - a._score)

    const seen = new Set()
    seasonalPicks[season] = scored
      .filter((f) => {
        if (seen.has(f.brand)) return false
        seen.add(f.brand)
        return true
      })
      .slice(0, 10)
      .map(({ _score, ...f }) => f)
  }

  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">Seasonal Picks</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Best fragrances by season</h1>
          <p className="mt-3 text-base leading-7 text-zinc-500">
            Curated picks that match each season&apos;s energy. Updated automatically.
          </p>

          {seasons.map((season) => {
            const config = SEASON_CONFIG[season]
            const picks = seasonalPicks[season] ?? []
            const isCurrent = season === currentSeason

            return (
              <div key={season} className={['mt-14', isCurrent ? '' : ''].join(' ')}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">{config.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black">{season} {new Date().getFullYear()}</h2>
                      {isCurrent && (
                        <span className="rounded-full bg-green-accent px-2.5 py-0.5 text-xs font-black text-black">Current</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm leading-6 text-zinc-500">{config.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {picks.map((f) => (
                    <Link
                      key={f.id}
                      href={`/fragrance/${f.id}`}
                      className="group block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
                    >
                      <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                      <h3 className="mt-1 text-base font-black leading-tight text-black group-hover:text-green-accent transition">{f.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(f.accords || []).filter((a) => config.accords.includes(a)).map((a) => (
                          <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                        ))}
                        {(f.accords || []).filter((a) => !config.accords.includes(a)).map((a) => (
                          <span key={a} className="rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-xs font-bold text-zinc-500">{a}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/quiz`}
                  className="mt-4 inline-flex items-center text-sm font-bold text-green-accent transition hover:underline"
                >
                  Find your perfect {season.toLowerCase()} fragrance →
                </Link>
              </div>
            )
          })}
        </section>
      </main>

      <Footer />
    </div>
  )
}
