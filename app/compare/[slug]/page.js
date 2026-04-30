import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const [id1, id2] = slug.split('-vs-').map(Number)
  if (!id1 || !id2) return { title: 'Compare — PickSniff' }
  const all = await loadAllFragrances()
  const f1 = all.find((f) => f.id === id1)
  const f2 = all.find((f) => f.id === id2)
  if (!f1 || !f2) return { title: 'Compare — PickSniff' }
  return {
    title: `${f1.brand} ${f1.name} vs ${f2.brand} ${f2.name} — PickSniff`,
    description: `Side-by-side comparison of ${f1.name} by ${f1.brand} and ${f2.name} by ${f2.brand}. Accords, notes, tier, and where to buy.`,
  }
}

const BRAND_OVERRIDES = {
  'Louis Vuitton': { label: 'Visit LV Boutique', href: 'https://us.louisvuitton.com/eng-us/women/fragrances/_/N-tfnabnp' },
}

const VIBE_LABELS = { daily: 'Daily', date_night: 'Date Night', sport: 'Sport', chill: 'Chill', formal: 'Formal' }

export default async function ComparePage({ params }) {
  const { slug } = await params
  const parts = slug.split('-vs-')
  if (parts.length !== 2) notFound()

  const [id1, id2] = parts.map(Number)
  if (!id1 || !id2) notFound()

  const all = await loadAllFragrances()
  const f1 = all.find((f) => f.id === id1)
  const f2 = all.find((f) => f.id === id2)

  if (!f1 || !f2) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <Link href="/encyclopedia" className="mb-6 inline-flex items-center text-sm font-bold text-zinc-500 transition hover:text-black">
            ← Encyclopedia
          </Link>

          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">Side-by-Side</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {f1.brand} {f1.name} vs {f2.brand} {f2.name}
          </h1>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[f1, f2].map((f) => {
              const override = BRAND_OVERRIDES[f.brand]
              const query = encodeURIComponent([f.brand, f.name, f.concentration].filter(Boolean).join(' '))
              return (
                <div key={f.id} className="rounded-xl border border-zinc-200 bg-white p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-accent">
                    <span className="text-2xl font-black text-black">{f.brand.charAt(0)}</span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{f.brand}</p>
                  <h2 className="mt-1 text-2xl font-black">{f.name}</h2>

                  <div className="mt-5 space-y-4">
                    <Row label="Concentration" value={f.concentration || '—'} />
                    <Row label="Tier" value={f.tier} />
                    <Row label="Vibe" value={VIBE_LABELS[f.vibe] || f.vibe} />
                    <Row label="Gender" value={f.gender} />

                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Accords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(f.accords || []).map((a) => (
                          <span key={a} className="rounded-full bg-green-accent/15 px-3 py-1 text-xs font-bold text-zinc-700">{a}</span>
                        ))}
                      </div>
                    </div>

                    {(f.top_notes || []).length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Top Notes</p>
                        <p className="text-sm text-zinc-600">{f.top_notes.join(' · ')}</p>
                      </div>
                    )}

                    {f.description && (
                      <p className="text-sm leading-6 text-zinc-500">{f.description}</p>
                    )}
                  </div>

                  <div className="mt-5">
                    {override ? (
                      <a href={override.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-green-accent py-3 text-sm font-black text-black transition hover:brightness-95">
                        {override.label}
                      </a>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <a href={f.sephora_url || `https://www.sephora.com/search?keyword=${query}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-green-accent py-3 text-sm font-black text-black transition hover:brightness-95">
                          Sephora
                        </a>
                        <a href={f.jomashop_url || `https://www.jomashop.com/searchresult.html#q=${query}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-green-accent py-3 text-sm font-black text-black transition hover:bg-green-accent/10">
                          Jomashop
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-zinc-500 mb-4">Not sure which one is for you?</p>
            <Link href="/quiz"
              className="inline-flex rounded-full bg-green-accent px-8 py-3 text-sm font-black text-black transition hover:brightness-95">
              Take the PickSniff Quiz
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-zinc-100 pb-2">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-zinc-400">{label}</span>
      <span className="text-sm font-bold capitalize text-zinc-700">{value}</span>
    </div>
  )
}
