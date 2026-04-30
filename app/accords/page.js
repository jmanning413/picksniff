import Link from 'next/link'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Accord Explorer — PickSniff',
  description: 'Learn what every fragrance accord smells like, with real examples from our 750-fragrance library.',
}

const ACCORDS = [
  { name: 'Citrus', emoji: '🍋', description: 'Bright, zesty, and energising. Think lemon, bergamot, grapefruit — the first thing you smell when you spray.' },
  { name: 'Floral', emoji: '🌸', description: 'Rose, jasmine, peony, iris. Can be soft and powdery or lush and heady. The most classic fragrance family.' },
  { name: 'Woody', emoji: '🪵', description: 'Cedar, sandalwood, oud, vetiver. Grounding and warm with a sense of depth and permanence.' },
  { name: 'Vanilla', emoji: '🍦', description: 'Sweet, creamy, and comforting. Gourmand but not sugary. Pairs with almost everything for a soft landing.' },
  { name: 'Amber', emoji: '🟠', description: 'Resinous, warm, golden. Not a single ingredient but a family of warmth built from labdanum, benzoin, and musks.' },
  { name: 'Spicy', emoji: '🌶️', description: 'Pepper, cardamom, cinnamon, saffron. Adds edge and intrigue. The backbone of many date-night fragrances.' },
  { name: 'Fresh', emoji: '🌬️', description: 'Clean, airy, and effortless. Laundered musks, green herbs, and light ozonic notes. Easy to wear anywhere.' },
  { name: 'Aromatic', emoji: '🌿', description: 'Lavender, rosemary, sage, herbs. A dry, somewhat medicinal freshness that reads as sophisticated and composed.' },
  { name: 'Fruity', emoji: '🍑', description: 'Peach, raspberry, apple, blackcurrant. Adds a sweet juicy energy without going into dessert territory.' },
  { name: 'Aquatic', emoji: '🌊', description: 'Cool, sea-spray, slightly ozonic. Evokes ocean air, rain on stone, or the inside of a boat.' },
  { name: 'Green', emoji: '🌱', description: 'Fresh-cut grass, leaves, ferns, stems. Crisp and naturalistic with a slightly bitter bite that keeps sweetness in check.' },
]

export default async function AccordsPage() {
  const all = await loadAllFragrances()

  const accordExamples = {}
  for (const accord of ACCORDS) {
    accordExamples[accord.name] = all
      .filter((f) => (f.accords || []).includes(accord.name))
      .slice(0, 3)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">Accord Explorer</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What does it actually smell like?</h1>
          <p className="mt-3 text-base leading-7 text-zinc-500">
            Every fragrance accord explained in plain English — no jargon, just what your nose will experience.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ACCORDS.map((accord) => {
              const examples = accordExamples[accord.name] ?? []
              return (
                <div key={accord.name} className="rounded-xl border border-zinc-200 bg-white p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{accord.emoji}</span>
                    <h2 className="text-xl font-black">{accord.name}</h2>
                  </div>
                  <p className="text-sm leading-6 text-zinc-500">{accord.description}</p>

                  {examples.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Examples</p>
                      <div className="flex flex-col gap-1.5">
                        {examples.map((f) => (
                          <Link
                            key={f.id}
                            href={`/fragrance/${f.id}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm transition hover:border-green-accent"
                          >
                            <span className="font-bold text-zinc-700">{f.brand} {f.name}</span>
                            <span className="text-xs font-bold text-zinc-400">{f.concentration}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/encyclopedia?accords=${accord.name}`}
                    className="mt-4 inline-flex items-center text-xs font-black text-green-accent hover:underline"
                  >
                    Browse all {accord.name} fragrances →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
