import Link from 'next/link'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import QuizIcon from '@/app/_components/QuizIcons'

export const metadata = {
  title: 'Accord Explorer — PickSniff',
  description: 'Learn what every fragrance accord smells like, with real examples from our 750-fragrance library.',
}

const ACCORDS = [
  { name: 'Citrus', icon: 'citrus', description: 'Bright, zesty, and energising. Think lemon, bergamot, grapefruit — the first thing you smell when you spray.' },
  { name: 'Floral', icon: 'flower', description: 'Rose, jasmine, peony, iris. Can be soft and powdery or lush and heady. The most classic fragrance family.' },
  { name: 'Woody', icon: 'pine', description: 'Cedar, sandalwood, oud, vetiver. Grounding and warm with a sense of depth and permanence.' },
  { name: 'Vanilla', icon: 'droplet', description: 'Sweet, creamy, and comforting. Gourmand but not sugary. Pairs with almost everything for a soft landing.' },
  { name: 'Amber', icon: 'amber', description: 'Resinous, warm, golden. Not a single ingredient but a family of warmth built from labdanum, benzoin, and musks.' },
  { name: 'Spicy', icon: 'chili', description: 'Pepper, cardamom, cinnamon, saffron. Adds edge and intrigue. The backbone of many date-night fragrances.' },
  { name: 'Fresh', icon: 'wind', description: 'Clean, airy, and effortless. Laundered musks, green herbs, and light ozonic notes. Easy to wear anywhere.' },
  { name: 'Aromatic', icon: 'sprig', description: 'Lavender, rosemary, sage, herbs. A dry, somewhat medicinal freshness that reads as sophisticated and composed.' },
  { name: 'Fruity', icon: 'peach', description: 'Peach, raspberry, apple, blackcurrant. Adds a sweet juicy energy without going into dessert territory.' },
  { name: 'Aquatic', icon: 'wave', description: 'Cool, sea-spray, slightly ozonic. Evokes ocean air, rain on stone, or the inside of a boat.' },
  { name: 'Green', icon: 'sprout', description: 'Fresh-cut grass, leaves, ferns, stems. Crisp and naturalistic with a slightly bitter bite that keeps sweetness in check.' },
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
    <div className="flex min-h-screen flex-col bg-cream text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-deep">Accord Explorer</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What does it actually smell like?</h1>
          <p className="mt-3 text-base leading-7 text-slate">
            Every fragrance accord explained simply — no jargon, just what your nose will experience.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ACCORDS.map((accord) => {
              const examples = accordExamples[accord.name] ?? []
              return (
                <div key={accord.name} className="rounded-xl border border-sand bg-white p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-wash text-green-deep"><QuizIcon name={accord.icon} size={26} /></span>
                    <h2 className="text-xl font-black">{accord.name}</h2>
                  </div>
                  <p className="text-sm leading-6 text-slate">{accord.description}</p>

                  {examples.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Examples</p>
                      <div className="flex flex-col gap-1.5">
                        {examples.map((f) => (
                          <Link
                            key={f.id}
                            href={`/fragrance/${f.id}`}
                            className="flex items-center justify-between rounded-lg border border-sand bg-zinc-50 px-3 py-2 text-sm transition hover:border-green-accent"
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
                    className="mt-4 inline-flex items-center text-xs font-black text-green-deep hover:underline"
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
