import Link from 'next/link'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Trending Fragrances',
  description: 'The most popular and saved fragrances on PickSniff this week.',
}

export default async function TrendingPage() {
  const all = await loadAllFragrances()

  // Deterministic "trending" based on date seed — rotates weekly
  // eslint-disable-next-line react-hooks/purity -- server component; weekly seed is intentionally time-based
  const weekSeed = Math.floor(Date.now() / (86400000 * 7))
  function pseudoRandom(i) {
    return ((weekSeed * 2654435769 + i * 1234567891) >>> 0) % all.length
  }

  const seen = new Set()
  const trending = []
  for (let i = 0; trending.length < 20; i++) {
    const idx = pseudoRandom(i)
    if (!seen.has(idx)) { seen.add(idx); trending.push(all[idx]) }
  }

  const spotlight = trending.slice(0, 5)
  const freshFinds = trending.slice(5, 10)
  const worthASniff = trending.slice(10, 15)

  return (
    <div className="flex min-h-screen flex-col bg-cream text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-deep">Trending</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Popular this week</h1>
          <p className="mt-3 text-base leading-7 text-slate">A rotating selection from the 750-fragrance library, refreshed weekly.</p>

          <TrendSection title="Weekly Spotlight" fragrances={spotlight} />
          <TrendSection title="Fresh Finds" fragrances={freshFinds} />
          <TrendSection title="Worth a Sniff" fragrances={worthASniff} />
        </section>
      </main>

      <Footer />
    </div>
  )
}

function TrendSection({ title, fragrances }) {
  return (
    <div className="mt-12">
      <h2 className="mb-5 text-xl font-black">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fragrances.map((f, i) => (
          <Link
            key={f.id}
            href={`/fragrance/${f.id}`}
            className="group flex items-start gap-4 rounded-lg border border-sand bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
          >
            <span className="mt-0.5 w-6 shrink-0 text-sm font-black text-slate">#{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-slate">{f.brand}</p>
              <h3 className="mt-0.5 text-base font-black leading-tight text-black group-hover:text-green-deep transition">{f.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(f.accords || []).slice(0, 3).map((a) => (
                  <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
