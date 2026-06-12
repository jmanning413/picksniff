'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const GENDERS = [
  { id: 'male', label: 'Him' },
  { id: 'female', label: 'Her' },
  { id: 'unisex', label: 'Anyone' },
]

const OCCASIONS = [
  { id: 'birthday',    label: 'Birthday',    emoji: '🎂', vibe: 'daily',      desc: 'A crowd-pleasing everyday favourite' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍', vibe: 'date_night', desc: 'Romantic, memorable, and a little indulgent' },
  { id: 'holiday',     label: 'Holiday',     emoji: '🎄', vibe: 'formal',     desc: 'Sophisticated and gift-worthy' },
  { id: 'justbecause', label: 'Just Because',emoji: '💌', vibe: 'chill',      desc: 'Warm, wearable, and genuinely thoughtful' },
  { id: 'datenight',   label: 'Date Night',  emoji: '✨', vibe: 'date_night', desc: 'Seductive, long-lasting, and bold' },
]

const TIERS = [
  { id: 'budget', label: 'Budget', description: 'Great gift under $100 — impressive without breaking the bank.' },
  { id: 'quality', label: 'Quality', description: 'The sweet spot — polished bottles they\'ll be proud to display.' },
  { id: 'niche', label: 'Niche', description: 'A luxury statement — for someone who deserves the best.' },
]

const ACCORDS_FALLBACK = ['Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber', 'Spicy', 'Fresh', 'Aromatic', 'Aquatic', 'Green']

const TOTAL_STEPS = 4

export default function GiftQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [occasion, setOccasion] = useState(null)
  const [tier, setTier] = useState('')
  const [accords, setAccords] = useState([])
  const [availableAccords, setAvailableAccords] = useState(null)
  const [accordsLoading, setAccordsLoading] = useState(false)
  const fetchKeyRef = useRef(null)

  const vibe = occasion?.vibe || ''

  useEffect(() => {
    if (genders.length === 0 || !vibe || !tier) return
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
      const counts = {}
      for (const list of perGender) {
        for (const a of list) counts[a] = (counts[a] || 0) + 1
      }
      const merged = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([a]) => a)
      setAvailableAccords(merged.length > 0 ? merged : ACCORDS_FALLBACK)
    }).catch(() => setAvailableAccords(ACCORDS_FALLBACK))
      .finally(() => setAccordsLoading(false))
  }, [genders, vibe, tier])

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
    if (step === 1) return Boolean(occasion)
    if (step === 2) return Boolean(tier)
    return true
  }

  function goNext() {
    if (!canContinue()) return
    if (step < 3) { setStep((s) => s + 1); return }
    submit()
  }

  function submit() {
    const selectedGenders = genders.length > 0 ? genders : ['unisex']
    const params = new URLSearchParams({
      genders: selectedGenders.join(','),
      tier,
      vibe,
      mode: 'gift',
    })
    if (accords.length > 0) params.set('accords', accords.join(','))
    router.push(`/results?${params.toString()}`)
  }

  const progress = (step / TOTAL_STEPS) * 100
  const isOptionalStep = step === 3

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div className="h-1.5 w-full bg-zinc-100">
          <div className="h-full bg-green-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image src="/logo.svg" alt="" width={34} height={34} priority />
            <span>Pick<span className="text-green-accent">Sniff</span></span>
          </Link>
          <span className="text-sm font-semibold text-zinc-400">{step + 1} of {TOTAL_STEPS}</span>
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-3xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)}
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black">
              ← Back
            </button>
          )}

          {/* Step 0: Gender (gift-framed) */}
          {step === 0 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">Gift Finder</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Who are you shopping for?</h1>
                <p className="mt-3 text-base leading-7 text-zinc-500">Choose one or more. We'll find them the perfect scent.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {GENDERS.map((g) => (
                  <button key={g.id} type="button" onClick={() => toggleGender(g.id)} aria-pressed={genders.includes(g.id)}
                    className={['min-h-20 rounded-lg border p-5 text-left transition', genders.includes(g.id) ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-zinc-200 bg-white hover:border-green-accent'].join(' ')}>
                    <span className="block text-lg font-black text-black">{g.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1: Occasion */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">Step 2</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What's the occasion?</h1>
                <p className="mt-3 text-base leading-7 text-zinc-500">This shapes the whole recommendation.</p>
              </div>
              <div className="grid gap-3">
                {OCCASIONS.map((o) => (
                  <button key={o.id} type="button" onClick={() => setOccasion(o)} aria-pressed={occasion?.id === o.id}
                    className={['flex items-start gap-4 rounded-xl border p-4 text-left transition', occasion?.id === o.id ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-zinc-200 bg-white hover:border-green-accent'].join(' ')}>
                    <span className="text-2xl">{o.emoji}</span>
                    <div>
                      <p className="text-base font-black text-black">{o.label}</p>
                      <p className="mt-0.5 text-sm text-zinc-500">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Gift budget */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">Step 3</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What's the gift budget?</h1>
                <p className="mt-3 text-base leading-7 text-zinc-500">No judgment — great gifts exist at every price.</p>
              </div>
              <div className="grid gap-3">
                {TIERS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setTier(t.id)} aria-pressed={tier === t.id}
                    className={['min-h-20 rounded-lg border p-5 text-left transition', tier === t.id ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-zinc-200 bg-white hover:border-green-accent'].join(' ')}>
                    <span className="block text-lg font-black text-black">{t.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-zinc-500">{t.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Accords (optional) */}
          {step === 3 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-accent">Step 4 · Optional</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Do they have a scent preference?</h1>
                <p className="mt-3 text-base leading-7 text-zinc-500">Pick up to 2 if you know what they like, or skip.</p>
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
                        className={['min-h-11 rounded-full border px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40', selected ? 'border-green-accent bg-green-accent text-black shadow-sm' : 'border-zinc-200 bg-white text-zinc-700 hover:border-green-accent'].join(' ')}>
                        {a}
                      </button>
                    )
                  })
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={goNext} disabled={!canContinue()}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35">
              {step === 3 ? 'Find Their Perfect Scent →' : 'Next →'}
            </button>
            {isOptionalStep && (
              <button type="button" onClick={submit}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-zinc-200 px-8 text-base font-bold text-zinc-500 transition hover:border-green-accent hover:text-black sm:min-w-36">
                Skip
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
