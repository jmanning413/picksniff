import Link from 'next/link'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Notes Glossary — PickSniff',
  description: 'Every fragrance note explained in plain English. What each note smells like, with real fragrance examples.',
}

const NOTE_DESCRIPTIONS = {
  Bergamot: 'A citrus peel with a floral edge — sharper than orange, more complex than lemon. The backbone of countless colognes.',
  Cedar: 'Dry, pencil-shaving woods with a slight sweetness. Versatile and grounding.',
  Sandalwood: 'Creamy, milky, and smooth with a warm woodiness that lingers for hours.',
  Vetiver: 'Smoky, earthy, and rooty. Dry and complex with a grassy undertone.',
  Vanilla: 'Sweet, warm, and enveloping — like warm cake but more sophisticated in fragrance.',
  Rose: 'The queen of flowers — can be dewy and green or velvety and opulent depending on the extract.',
  Jasmine: 'Heady, indolic, and intensely floral with a slight animalic quality at high concentrations.',
  Lavender: 'Herbal, floral, and slightly medicinal. Fresh, clean, and endlessly versatile.',
  Pepper: 'Dry, spicy, and sharp. Black pepper adds crackling energy; pink pepper is softer and fruity.',
  Amber: 'A warm, resinous accord of labdanum and musks — golden, sweet, and enveloping.',
  Oud: 'Rich, smoky, animalic wood from infected agarwood. The most precious raw material in perfumery.',
  Musk: 'Skin-like and intimate. White musk is clean; animalic musk is warmer and more carnal.',
  Patchouli: 'Dark, earthy, and slightly sweet with a chocolate edge. Divisive but distinctive.',
  Iris: 'Powdery, rooty, and slightly chilly. Evokes violet and a hint of carrot. Elegant and expensive.',
  Lemon: 'Clean, bright citrus with a tart freshness that vanishes quickly but lifts everything around it.',
  Orange: 'Sweeter and fuller than lemon — juicy, sunny, and immediately likeable.',
  Grapefruit: 'Slightly bitter citrus with a green, slightly metallic quality. Energising and modern.',
  Cardamom: 'Warm, slightly sweet spice with green herbal undertones. Bridges Eastern and Western perfumery.',
  Neroli: 'Orange blossom distillate — floral, honeyed, slightly bitter, and intensely aromatic.',
  'Tonka Bean': 'Sweet like vanilla but with almond, hay, and coumarin. Warm, gourmand, and addictive.',
  Ambroxan: 'A synthetic amber molecule — warm, woody, and musky with incredible longevity. The secret weapon of modern fragrance.',
}

export default async function NotesPage() {
  const all = await loadAllFragrances()

  const noteIndex = {}
  for (const f of all) {
    const allNotes = [
      ...(f.top_notes || []),
      ...(f.middle_notes || []),
      ...(f.base_notes || []),
    ]
    for (const note of allNotes) {
      if (!noteIndex[note]) noteIndex[note] = []
      if (noteIndex[note].length < 3) noteIndex[note].push(f)
    }
  }

  const sortedNotes = Object.keys(noteIndex).sort()

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">Notes Glossary</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What does each note smell like?</h1>
          <p className="mt-3 text-base leading-7 text-zinc-500">
            Every note in the PickSniff library explained in plain English. No chemistry degree required.
          </p>

          {/* Featured notes with descriptions */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {Object.entries(NOTE_DESCRIPTIONS).map(([note, desc]) => {
              const examples = noteIndex[note] ?? []
              return (
                <div key={note} className="rounded-xl border border-zinc-200 bg-white p-5">
                  <h2 className="text-lg font-black">{note}</h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{desc}</p>
                  {examples.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1">
                      {examples.map((f) => (
                        <Link key={f.id} href={`/fragrance/${f.id}`}
                          className="text-xs font-bold text-zinc-600 transition hover:text-green-accent">
                          {f.brand} {f.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* All notes alphabetical */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-black">All notes A–Z</h2>
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
              {sortedNotes.map((note) => (
                <div key={note} className="mb-1 break-inside-avoid">
                  <span className="text-sm font-bold text-zinc-600">{note}</span>
                  <span className="ml-1 text-xs text-zinc-400">({noteIndex[note].length})</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
