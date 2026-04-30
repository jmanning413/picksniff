'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import SaveButtons from '@/app/_components/SaveButtons'

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

const BRAND_OVERRIDES = {
  'Louis Vuitton': {
    label: 'Visit LV Boutique',
    href: 'https://us.louisvuitton.com/eng-us/women/fragrances/_/N-tfnabnp',
  },
}

function buildDescription(accords = []) {
  const phrases = accords.map((a) => ACCORD_DESCRIPTIONS[a]).filter(Boolean)
  if (phrases.length === 0) return 'A balanced fragrance pick from the PickSniff library.'
  if (phrases.length === 1) return `A fragrance centered on ${phrases[0]}.`
  return `A fragrance with ${phrases.slice(0, -1).join(', ')} and ${phrases.at(-1)}.`
}

function FilterPill({ children, accent = false }) {
  return (
    <span className={[
      'rounded-full px-3 py-1.5 text-xs font-bold capitalize',
      accent ? 'bg-green-accent text-black' : 'bg-zinc-100 text-zinc-600',
    ].join(' ')}>
      {children}
    </span>
  )
}

function BrandInitial({ brand }) {
  const initial = brand?.charAt(0)?.toUpperCase() || '?'
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-accent sm:h-20 sm:w-20">
      <span className="text-2xl font-black text-black sm:text-3xl">{initial}</span>
    </div>
  )
}

function BuyButtons({ fragrance }) {
  const override = BRAND_OVERRIDES[fragrance.brand]
  const query = encodeURIComponent([fragrance.brand, fragrance.name, fragrance.concentration].filter(Boolean).join(' '))

  if (override) {
    return (
      <div className="mt-5">
        <a href={override.href} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-green-accent px-5 text-sm font-black text-black transition hover:brightness-95">
          {override.label}
        </a>
      </div>
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <a href={fragrance.sephora_url || `https://www.sephora.com/search?keyword=${query}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-green-accent px-5 text-sm font-black text-black transition hover:brightness-95">
        Sephora
      </a>
      <a href={fragrance.jomashop_url || `https://www.jomashop.com/searchresult.html#q=${query}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-green-accent px-5 text-sm font-black text-black transition hover:bg-green-accent/10">
        Jomashop
      </a>
    </div>
  )
}

function FragranceCard({ fragrance, isWishlisted, isOwned, isLoggedIn, isHighlighted, compareSelected, onCompareToggle, compareDisabled }) {
  const score = Math.max(0, Math.min(100, fragrance.score || 0))
  const notes = (fragrance.top_notes || []).slice(0, 3)
  const description = fragrance.description || buildDescription(fragrance.accords)

  return (
    <article className={[
      'rounded-lg border bg-white p-5 shadow-sm transition',
      isHighlighted ? 'border-green-accent ring-2 ring-green-accent/30' : 'border-zinc-200',
    ].join(' ')}>
      {isHighlighted && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-accent px-3 py-1 text-xs font-black text-black">
          🎲 Blind Pick
        </div>
      )}
      <div className="flex gap-4">
        <BrandInitial brand={fragrance.brand} />
        <div className="min-w-0 flex-1">
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{fragrance.brand}</p>
              <Link href={`/fragrance/${fragrance.id}`} className="mt-1 block text-xl font-black leading-tight text-black hover:text-green-accent transition">
                {fragrance.name}
              </Link>
              {fragrance.concentration && (
                <p className="mt-1 text-sm font-bold text-zinc-500">{fragrance.concentration}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-black text-green-accent">{score}%</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Match</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-green-accent transition-all duration-700" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {fragrance.accords?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {fragrance.accords.map((accord) => (
            <span key={accord} className="rounded-full bg-green-accent/15 px-3 py-1 text-xs font-bold text-zinc-700">
              {accord}
            </span>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <p className="mt-4 text-sm leading-6 text-zinc-600">
          <span className="font-black text-black">Top notes: </span>{notes.join(', ')}
        </p>
      )}

      <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>

      <BuyButtons fragrance={fragrance} />

      <SaveButtons
        fragranceId={fragrance.id}
        initialWishlisted={isWishlisted}
        initialOwned={isOwned}
        isLoggedIn={isLoggedIn}
      />

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onCompareToggle(fragrance)}
          disabled={compareDisabled && !compareSelected}
          className={[
            'rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40',
            compareSelected
              ? 'border-green-accent bg-green-accent text-black'
              : 'border-zinc-200 text-zinc-500 hover:border-green-accent',
          ].join(' ')}
        >
          {compareSelected ? '✓ Comparing' : '+ Compare'}
        </button>
      </div>
    </article>
  )
}

function CompareModal({ fragrances, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">Compare Fragrances</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:border-green-accent hover:text-black transition">
            ✕
          </button>
        </div>

        <div className={`grid gap-4 ${fragrances.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {fragrances.map((f) => {
            const query = encodeURIComponent([f.brand, f.name, f.concentration].filter(Boolean).join(' '))
            return (
              <div key={f.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-accent">
                  <span className="text-xl font-black text-black">{f.brand.charAt(0)}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                <h3 className="mt-1 text-lg font-black leading-tight">{f.name}</h3>

                <div className="mt-3 space-y-3 text-sm">
                  <Row label="Concentration" value={f.concentration || '—'} />
                  <Row label="Tier" value={f.tier} />
                  <Row label="Vibe" value={f.vibe?.replace('_', ' ')} />
                  <Row label="Match" value={`${f.score}%`} accent />
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Accords</p>
                    <div className="flex flex-wrap gap-1">
                      {(f.accords || []).map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                  </div>
                  {f.top_notes?.length > 0 && (
                    <Row label="Top Notes" value={f.top_notes.slice(0, 3).join(', ')} />
                  )}
                </div>

                <a href={f.sephora_url || `https://www.sephora.com/search?keyword=${query}`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-green-accent py-2.5 text-xs font-black text-black transition hover:brightness-95">
                  Sephora
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-zinc-400">{label}</span>
      <span className={['text-sm font-bold capitalize', accent ? 'text-green-accent' : 'text-zinc-700'].join(' ')}>{value}</span>
    </div>
  )
}

export default function ResultsClient({ fragrances, alsoLiked, genders, tier, vibe, accords, isLoggedIn, wishlistMap, ownedMap }) {
  const [blindPick, setBlindPick] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const blindRef = useRef(null)

  function doBlindPick() {
    const idx = Math.floor(Math.random() * fragrances.length)
    setBlindPick(fragrances[idx].id)
    setTimeout(() => {
      document.getElementById(`fcard-${fragrances[idx].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  function toggleCompare(fragrance) {
    setCompareList((curr) => {
      if (curr.find((f) => f.id === fragrance.id)) return curr.filter((f) => f.id !== fragrance.id)
      if (curr.length >= 3) { toast.error('Max 3 fragrances to compare'); return curr }
      return [...curr, fragrance]
    })
  }

  function shareResults() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: 'My PickSniff Matches', url })
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'))
    }
  }

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">PickSniff Results</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Your Matches</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
              Ranked by your gender, tier, vibe, and accord picks.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={doBlindPick}
                className="inline-flex items-center gap-2 rounded-full bg-green-accent px-4 py-2 text-sm font-black text-black transition hover:brightness-95"
              >
                🎲 Surprise Me
              </button>
              {compareList.length >= 2 && (
                <button
                  type="button"
                  onClick={() => setShowCompare(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-green-accent px-4 py-2 text-sm font-black text-black transition hover:bg-green-accent/10"
                >
                  Compare {compareList.length}
                </button>
              )}
              <button
                type="button"
                onClick={shareResults}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black"
              >
                Share Results
              </button>
              <Link href="/quiz" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black">
                Retake Quiz
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {genders.map((g) => <FilterPill key={g}>{g}</FilterPill>)}
            <FilterPill>{tier}</FilterPill>
            <FilterPill>{vibe.replace('_', ' ')}</FilterPill>
            {accords.map((a) => <FilterPill key={a} accent>{a}</FilterPill>)}
          </div>
        </div>

        {fragrances.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center">
            <h2 className="text-xl font-black">No matches yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Try a wider gender selection or a different price tier to open up the pool.
            </p>
            <Link href="/quiz" className="mt-6 inline-flex rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95">
              Back to Quiz
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {fragrances.map((f) => (
                <div key={f.id} id={`fcard-${f.id}`}>
                  <FragranceCard
                    fragrance={f}
                    isWishlisted={wishlistMap[f.id] ?? false}
                    isOwned={ownedMap[f.id] ?? false}
                    isLoggedIn={isLoggedIn}
                    isHighlighted={blindPick === f.id}
                    compareSelected={!!compareList.find((c) => c.id === f.id)}
                    onCompareToggle={toggleCompare}
                    compareDisabled={compareList.length >= 3}
                  />
                </div>
              ))}
            </div>

            {!isLoggedIn && (
              <div className="mt-8 rounded-xl border border-dashed border-green-accent/50 bg-green-accent/5 p-8 text-center">
                <span className="text-2xl">🔓</span>
                <h3 className="mt-2 text-lg font-black text-black">See up to 20 matches — free account</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Create a free PickSniff account for double the results, wishlist, collection tracking, and more.
                </p>
                <Link href="/auth" className="mt-4 inline-flex rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95">
                  Create Free Account
                </Link>
              </div>
            )}

            {alsoLiked.length > 0 && (
              <div className="mt-12">
                <p className="mb-6 text-sm font-black uppercase tracking-[0.18em] text-zinc-400">You might also like</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {alsoLiked.map((f) => (
                    <Link key={f.id} href={`/fragrance/${f.id}`} className="group block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-green-accent hover:shadow-sm">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-accent">
                        <span className="text-lg font-black text-black">{f.brand.charAt(0)}</span>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                      <h3 className="mt-1 text-base font-black leading-tight text-black group-hover:text-green-accent transition">{f.name}</h3>
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
          </>
        )}
      </section>

      {showCompare && compareList.length >= 2 && (
        <CompareModal fragrances={compareList} onClose={() => setShowCompare(false)} />
      )}
    </main>
  )
}
