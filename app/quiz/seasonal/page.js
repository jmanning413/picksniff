'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import QuizIcon from '@/app/_components/QuizIcons'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

const SEASONS = [
  { id: 'spring', label: 'Spring', icon: 'flower', desc: 'Fresh florals, green air, new beginnings' },
  { id: 'summer', label: 'Summer', icon: 'sun', desc: 'Sun, sea, citrus, and open skies' },
  { id: 'fall', label: 'Fall', icon: 'leaf', desc: 'Warm spice, golden woods, crisp mornings' },
  { id: 'winter', label: 'Winter', icon: 'snowflake', desc: 'Cozy amber, deep vanilla, cold air' },
]

const TIERS = [
  { id: 'budget', label: 'Budget', description: 'Easy wins and smart starter picks.' },
  { id: 'quality', label: 'Quality', description: 'Polished fragrances with more depth.' },
  { id: 'niche', label: 'Niche', description: 'Distinctive houses and luxury bottles.' },
]

// Map season to a vibe and a set of seasonally-appropriate accords
const SEASON_MAP = {
  spring: { vibe: 'daily',      accords: ['Fresh', 'Floral', 'Green', 'Citrus'] },
  summer: { vibe: 'sport',      accords: ['Citrus', 'Aquatic', 'Fresh', 'Green'] },
  fall:   { vibe: 'chill',      accords: ['Woody', 'Amber', 'Spicy', 'Aromatic'] },
  winter: { vibe: 'date_night', accords: ['Vanilla', 'Amber', 'Spicy', 'Woody'] },
}

const ACCORDS_FALLBACK = ['Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber', 'Spicy', 'Fresh', 'Aromatic', 'Aquatic', 'Green']

// Steps: 0=gender, 1=season, 2=tier, 3=accords (optional)
const TOTAL_STEPS = 4

export default function SeasonalQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [season, setSeason] = useState('')
  const [tier, setTier] = useState('')
  const [accords, setAccords] = useState([])
  const [availableAccords, setAvailableAccords] = useState(null)
  const [accordsLoading, setAccordsLoading] = useState(false)
  const fetchKeyRef = useRef(null)

  // Fetch accords when we have enough info (after step 2 is complete)
  useEffect(() => {
    if (genders.length === 0 || !season || !tier) return
    const { vibe } = SEASON_MAP[season] || {}
    if (!vibe) return

    const key = `${genders.sort().join(',')}|${tier}|${vibe}`
    if (fetchKeyRef.current === key) return
    fetchKeyRef.current = key

    setAccordsLoading(true)
    Promise.all(
      genders.map((g) =>
        fetch(`/api/quiz/accords?gender=${g}&tier=${tier}&vibe=${vibe}`)
          .then((r) => r.ok ? r.json() : { accords: [] })
          .then((d) => d.accords || [])
          .catch(() => [])
      )
    ).then((perGender) => {
      // Intersect with seasonal accords, then fall back to API order
      const { accords: seasonal } = SEASON_MAP[season]
      const counts = {}
      for (const list of perGender) {
        for (const a of list) counts[a] = (counts[a] || 0) + 1
      }
      // Sort: seasonal accords that exist in pool first, then others
      const inPool = Object.keys(counts)
      const sorted = [
        ...seasonal.filter((a) => inPool.includes(a)),
        ...inPool.filter((a) => !seasonal.includes(a)),
      ]
      setAvailableAccords(sorted.length > 0 ? sorted.slice(0, 8) : ACCORDS_FALLBACK)
    }).catch(() => setAvailableAccords(ACCORDS_FALLBACK))
      .finally(() => setAccordsLoading(false))
  }, [genders, season, tier])

  function toggleGender(id) {
    setGenders((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])
  }

  function toggleAccord(a) {
    setAccords((curr) => {
      if (curr.includes(a)) return curr.filter((x) => x !== a)
      if (curr.length >= 2) return curr
      return [...curr, a]
    })
  }

  function canContinue() {
    if (step === 0) return genders.length > 0
    if (step === 1) return Boolean(season)
    if (step === 2) return Boolean(tier)
    return true
  }

  function goNext() {
    if (!canContinue()) return
    if (step < 3) { setStep((s) => s + 1); return }
    submit()
  }

  function submit() {
    const { vibe, accords: seasonAccords } = SEASON_MAP[season]
    const selectedGenders = genders.length > 0 ? genders : ['unisex']
    // Use selected accords if any, otherwise seed with top 2 seasonal accords for better results
    const finalAccords = accords.length > 0 ? accords : seasonAccords.slice(0, 2)
    const params = new URLSearchParams({
      genders: selectedGenders.join(','),
      tier,
      vibe,
      accords: finalAccords.join(','),
      mode: 'seasonal',
    })
    router.push(`/results?${params.toString()}`)
  }

  const progress = (step / TOTAL_STEPS) * 100
  const isOptionalStep = step === 3

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div className="h-1.5 w-full bg-zinc-100">
          <div className="h-full bg-green-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image src="/logo-mark.png" alt="" width={48} height={48} priority />
            <span className="text-2xl font-black tracking-tight">Pick<span className="text-green-deep">Sniff</span></span>
          </Link>
          <span className="text-sm font-semibold text-slate">{step + 1} of {TOTAL_STEPS}</span>
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-3xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-sand px-4 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black"
            >
              ← Back
            </button>
          )}

          {/* Step 0: Gender */}
          {step === 0 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Seasonal Quiz</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Who is this for?</h1>
                <p className="mt-3 text-base leading-7 text-slate">Choose one or more.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {GENDERS.map((g) => (
                  <button key={g.id} type="button" onClick={() => toggleGender(g.id)} aria-pressed={genders.includes(g.id)}
                    className={['min-h-20 rounded-xl border p-5 text-left transition', genders.includes(g.id) ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent'].join(' ')}>
                    <span className="block text-lg font-black text-black">{g.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1: Season */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Step 2</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Which season?</h1>
                <p className="mt-3 text-base leading-7 text-slate">Pick the season you want to dress for.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SEASONS.map((s) => (
                  <button key={s.id} type="button" onClick={() => setSeason(s.id)} aria-pressed={season === s.id}
                    className={['flex items-start gap-4 rounded-xl border p-5 text-left transition', season === s.id ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent'].join(' ')}>
                    <span className="mt-0.5 shrink-0 text-green-deep"><QuizIcon name={s.icon} /></span>
                    <div>
                      <p className="text-base font-black text-black">{s.label}</p>
                      <p className="mt-0.5 text-sm text-slate">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Tier */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Step 3</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Pick a price tier</h1>
                <p className="mt-3 text-base leading-7 text-slate">This keeps recommendations in the right lane.</p>
              </div>
              <div className="grid gap-3">
                {TIERS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setTier(t.id)} aria-pressed={tier === t.id}
                    className={['min-h-20 rounded-xl border p-5 text-left transition', tier === t.id ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent'].join(' ')}>
                    <span className="block text-lg font-black text-black">{t.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate">{t.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Accords (optional) */}
          {step === 3 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Step 4 · Optional</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Any accord preferences?</h1>
                <p className="mt-3 text-base leading-7 text-slate">Pick up to 2, or skip to let the season decide.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {accordsLoading || availableAccords === null ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-11 rounded-full bg-zinc-100 animate-pulse" style={{ width: `${72 + (i % 3) * 20}px` }} />
                  ))
                ) : (
                  availableAccords.map((a) => {
                    const selected = accords.includes(a)
                    const disabled = accords.length >= 2 && !selected
                    return (
                      <button key={a} type="button" onClick={() => toggleAccord(a)} disabled={disabled} aria-pressed={selected}
                        className={['min-h-11 rounded-full border px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40', selected ? 'border-green-accent bg-green-accent text-black shadow-sm' : 'border-sand bg-white text-zinc-700 hover:border-green-accent'].join(' ')}>
                        {a}
                      </button>
                    )
                  })
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue()}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {step === 3 ? 'See My Seasonal Matches' : 'Next →'}
            </button>
            {isOptionalStep && (
              <button type="button" onClick={submit}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-sand px-8 text-base font-bold text-slate transition hover:border-green-accent hover:text-black sm:min-w-36">
                Skip
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
