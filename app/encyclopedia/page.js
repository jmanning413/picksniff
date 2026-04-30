import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import EncyclopediaClient from './EncyclopediaClient'

export const metadata = {
  title: 'Fragrance Encyclopedia — PickSniff',
  description: 'Browse all 750 fragrances. Search by name or brand, filter by gender, vibe, tier, and accords.',
}

export default async function EncyclopediaPage() {
  const fragrances = await loadAllFragrances()

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">
            Encyclopedia
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">All Fragrances</h1>
          <p className="mt-3 text-base leading-7 text-zinc-500">
            {fragrances.length} fragrances. Search, filter, explore.
          </p>
        </div>

        <EncyclopediaClient fragrances={fragrances} />
      </main>

      <Footer />
    </div>
  )
}
