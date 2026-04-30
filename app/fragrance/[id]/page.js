import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { getFragranceById, loadAllFragrances } from '@/lib/fragrances'
import { createClient } from '@/lib/supabase/server'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import SaveButtons from '@/app/_components/SaveButtons'

const BRAND_OVERRIDES = {
  'Louis Vuitton': {
    label: 'Visit LV Boutique',
    href: 'https://us.louisvuitton.com/eng-us/women/fragrances/_/N-tfnabnp',
  },
}

const ACCORD_DESCRIPTIONS = {
  Citrus: 'bright citrus lift',
  Floral: 'soft floral polish',
  Woody: 'smooth woods',
  Vanilla: 'creamy sweetness',
  Amber: 'warm amber depth',
  Spicy: 'a confident spicy edge',
  Fresh: 'clean freshness',
  Aromatic: 'aromatic texture',
  Fruity: 'juicy fruit energy',
  Aquatic: 'cool aquatic air',
  Green: 'crisp green character',
}

const VIBE_LABELS = {
  daily: 'Daily',
  date_night: 'Date Night',
  sport: 'Sport',
  chill: 'Chill',
  formal: 'Formal',
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const f = await getFragranceById(id)
  if (!f) return { title: 'Not Found — PickSniff' }
  return {
    title: `${f.brand} ${f.name} — PickSniff`,
    description: `Explore ${f.name} by ${f.brand}. ${f.concentration} · ${f.tier} tier · ${f.vibe} vibe.`,
  }
}

export default async function FragrancePage({ params }) {
  const { id } = await params

  // Both calls share the same unstable_cache entry — only one disk read total
  const [f, allFragrances] = await Promise.all([
    getFragranceById(id),
    loadAllFragrances(),
  ])

  if (!f) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isWishlisted = false
  let isOwned = false

  if (user) {
    const [{ data: wItem }, { data: oItem }] = await Promise.all([
      supabase.from('wishlist').select('id').eq('user_id', user.id).eq('fragrance_id', f.id).maybeSingle(),
      supabase.from('owned').select('id').eq('user_id', user.id).eq('fragrance_id', f.id).maybeSingle(),
    ])
    isWishlisted = !!wItem
    isOwned = !!oItem
  }

  const override = BRAND_OVERRIDES[f.brand]
  const query = encodeURIComponent([f.brand, f.name, f.concentration].filter(Boolean).join(' '))
  const description = f.description || buildDescription(f.accords)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${f.brand} ${f.name}`,
    description,
    brand: { '@type': 'Brand', name: f.brand },
    url: `${base}/fragrance/${f.id}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Script
        id={`jsonld-${f.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
        <Link
          href="/encyclopedia"
          className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-zinc-500 transition hover:text-black"
        >
          ← Encyclopedia
        </Link>
        <div className="flex gap-5 sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-accent sm:h-28 sm:w-28">
            <span className="text-3xl font-black text-black sm:text-5xl">
              {f.brand.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/brand/${encodeURIComponent(f.brand)}`} className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400 hover:text-green-accent transition">{f.brand}</Link>
            <h1 className="mt-1 text-2xl font-black leading-tight text-black sm:text-3xl">{f.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {f.concentration && (
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-500">
                  {f.concentration}
                </span>
              )}
              <span className="rounded-full bg-green-accent/20 px-3 py-1 text-xs font-bold capitalize text-zinc-700">
                {f.tier}
              </span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold capitalize text-zinc-500">
                {f.gender}
              </span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-500">
                {VIBE_LABELS[f.vibe]}
              </span>
            </div>
          </div>
        </div>

        {f.accords?.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Accords</h2>
            <div className="flex flex-wrap gap-2">
              {f.accords.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-green-accent/15 px-4 py-1.5 text-sm font-bold text-zinc-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {f.top_notes?.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
              Top Notes
            </h2>
            <p className="text-sm leading-7 text-zinc-600">{f.top_notes.join(' · ')}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">About</h2>
          <p className="text-sm leading-7 text-zinc-600">{description}</p>
        </div>

        <SaveButtons
          fragranceId={f.id}
          initialWishlisted={isWishlisted}
          initialOwned={isOwned}
          isLoggedIn={!!user}
        />

        <div className="mt-6 rounded-xl border border-dashed border-zinc-200 p-6 text-center">
          <p className="font-black text-black">See your match score</p>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Take the PickSniff quiz to find out how well {f.name} matches your taste.
          </p>
          <Link
            href="/quiz"
            className="mt-4 inline-flex rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95"
          >
            Take the Quiz
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Buy</h2>
          {override ? (
            <a
              href={override.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green-accent px-6 font-black text-black transition hover:brightness-95"
            >
              {override.label}
            </a>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={f.sephora_url || `https://www.sephora.com/search?keyword=${query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-green-accent px-6 font-black text-black transition hover:brightness-95"
              >
                Sephora
              </a>
              <a
                href={f.jomashop_url || `https://www.jomashop.com/searchresult.html#q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-green-accent px-6 font-black text-black transition hover:bg-green-accent/10"
              >
                Jomashop
              </a>
            </div>
          )}
        </div>
        <FragranceShareButton name={f.name} brand={f.brand} />
        <FragranceAlsoLiked fragrance={f} allFragrances={allFragrances} />
      </section>
      </main>

      <Footer />
    </div>
  )
}

function buildDescription(accords = []) {
  const phrases = accords.map((a) => ACCORD_DESCRIPTIONS[a]).filter(Boolean)
  if (phrases.length === 0) return 'A balanced fragrance pick from the PickSniff library.'
  if (phrases.length === 1) return `A fragrance centered on ${phrases[0]}.`
  return `A fragrance with ${phrases.slice(0, -1).join(', ')} and ${phrases.at(-1)}.`
}

function FragranceShareButton({ name, brand }) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Share</h2>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=Just%20found%20${encodeURIComponent(brand + ' ' + name)}%20on%20PickSniff%20%F0%9F%91%83&url=${encodeURIComponent('https://picksniff.com')}`}
          target="_blank" rel="noopener noreferrer"
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 transition hover:border-green-accent hover:text-black"
        >
          Share on X
        </a>
        <a
          href={`https://www.reddit.com/submit?title=${encodeURIComponent('Found ' + brand + ' ' + name + ' on PickSniff')}&url=${encodeURIComponent('https://picksniff.com')}`}
          target="_blank" rel="noopener noreferrer"
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 transition hover:border-green-accent hover:text-black"
        >
          Share on Reddit
        </a>
      </div>
    </div>
  )
}

function FragranceAlsoLiked({ fragrance, allFragrances }) {
  const topAccords = new Set((fragrance.accords || []).map((a) => a.toLowerCase()))
  const similar = allFragrances
    .filter((f) => f.id !== fragrance.id)
    .map((f) => ({
      ...f,
      _shared: (f.accords || []).filter((a) => topAccords.has(a.toLowerCase())).length,
    }))
    .filter((f) => f._shared > 0)
    .sort((a, b) => b._shared - a._shared)
    .slice(0, 3)

  if (similar.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">People also liked</h2>
      <div className="flex flex-col gap-2">
        {similar.map((f) => (
          <Link key={f.id} href={`/fragrance/${f.id}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-green-accent hover:shadow-sm">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
              <p className="text-sm font-black text-black">{f.name}</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {(f.accords || []).filter((a) => topAccords.has(a.toLowerCase())).slice(0, 2).map((a) => (
                <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
