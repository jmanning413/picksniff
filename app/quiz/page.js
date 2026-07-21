'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

const TIERS = [
  { id: 'budget', label: 'Budget', description: 'Under $100. Easy wins and smart starter picks.' },
  { id: 'quality', label: 'Quality', description: '$100 to $200. Polished fragrances with more depth.' },
  { id: 'niche', label: 'Niche', description: '$200 and up. Distinctive houses and luxury bottles.' },
]

const VIBES = [
  { id: 'daily', label: 'Daily', description: 'Work, class, errands: your everyday scent.' },
  { id: 'date_night', label: 'Date Night', description: 'Warm, close-up, memorable.' },
  { id: 'sport', label: 'Sport', description: 'Gym, outdoors, hot days.' },
  { id: 'chill', label: 'Chill', description: 'Weekends, cozy nights in.' },
  { id: 'formal', label: 'Formal', description: 'Suits, events, business.' },
]

const ACCORDS_FALLBACK = [
  'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber',
  'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
]

// Simple hints so newcomers never have to guess what a word means
const ACCORD_HINTS = {
  Citrus: 'bright & zesty',
  Floral: 'fresh-cut flowers',
  Woody: 'warm & grounded',
  Vanilla: 'sweet & cozy',
  Amber: 'warm golden glow',
  Spicy: 'bold warm heat',
  Fresh: 'clean, just-showered feel',
  Aromatic: 'crisp & herbal',
  Fruity: 'juicy & sweet',
  Aquatic: 'cool ocean breeze',
  Green: 'crisp & leafy',
}

// The Signature Scent Quiz is exactly 4 steps for everyone (matches the
// "find your scent in 4 questions" promise). Account perks live elsewhere
// (20 results vs 10, wishlist, collection) — never as extra quiz steps.
const STEPS = [
  { eyebrow: 'Step 1', title: 'Who is this for?', subtitle: 'Choose one or more. Unisex can be mixed with any selection.' },
  { eyebrow: 'Step 2', title: 'Pick a price tier', subtitle: 'This keeps the recommendations in the right lane.' },
  { eyebrow: 'Step 3', title: 'Choose the vibe', subtitle: 'Tell PickSniff where this fragrance needs to shine.' },
  { eyebrow: 'Step 4', title: 'Choose favorite accords', subtitle: 'Pick up to 3, or skip if you want us to keep it broad.' },
]

export default function QuizPage() {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [tier, setTier] = useState('')
  const [vibe, setVibe] = useState('')
  const [accords, setAccords] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [availableAccords, setAvailableAccords] = useState(null) // null = not yet fetched
  const [accordsLoading, setAccordsLoading] = useState(false)
  const fetchKeyRef = useRef(null)

  // Fast-start from the homepage: /quiz?g=male preselects gender and jumps to Step 2
  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get('g')
    if (g && GENDERS.some((x) => x.id === g)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time init from URL param
      setGenders([g])
      setStep(1)
    }
  }, [])

  // Fetch available accords when the user reaches Step 4 (index 3)
  // Also prefetch as soon as Steps 1-3 are all complete
  useEffect(() => {
    if (genders.length === 0 || !tier || !vibe) return
    // Don't re-fetch if we already have results for this exact combo
    const key = `${[...genders].sort().join(',')}|${tier}|${vibe}`
    if (fetchKeyRef.current === key) return
    fetchKeyRef.current = key

    setAccordsLoading(true)
    let stale = false
    // Call once per selected gender in parallel, then union results
    Promise.all(
      genders.map((g) =>
        fetch(`/api/quiz/accords?gender=${g}&tier=${tier}&vibe=${vibe}`)
          .then((r) => r.ok ? r.json() : { accords: [] })
          .then((d) => d.accords || [])
          .catch(() => [])
      )
    ).then((perGenderAccords) => {
      if (stale) return
      // Count how many gender pools contain each accord (most universal first)
      const counts = {}
      for (const list of perGenderAccords) {
        for (const a of list) {
          counts[a] = (counts[a] || 0) + 1
        }
      }
      const merged = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([accord]) => accord)
      setAvailableAccords(merged.length > 0 ? merged : ACCORDS_FALLBACK)
    }).catch(() => {
      if (!stale) setAvailableAccords(ACCORDS_FALLBACK)
    }).finally(() => {
      if (!stale) setAccordsLoading(false)
    })
    return () => { stale = true }
  }, [genders, tier, vibe])

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step])
  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1

  function canContinue() {
    if (step === 0) return genders.length > 0
    if (step === 1) return Boolean(tier)
    if (step === 2) return Boolean(vibe)
    return true
  }

  function goBack() {
    if (step === 0) { router.push('/'); return }
    setStep((s) => s - 1)
  }

  async function submitQuiz(includeAccords = true) {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const body = {
        genders,
        tier,
        vibe,
        accords: includeAccords ? accords : [],
      }

      const res = await fetch('/api/quiz/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.status === 429) {
        setSubmitError('Too many requests. Please wait a minute and try again.')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        return
      }

      const params = new URLSearchParams({ genders: genders.join(','), tier, vibe })
      if (includeAccords && accords.length > 0) params.set('accords', accords.join(','))
      router.push(`/results?${params.toString()}`)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function goNext() {
    if (!canContinue()) return
    if (isLastStep) { submitQuiz(true); return }
    setStep((s) => s + 1)
  }

  function toggleGender(id) {
    setGenders((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])
  }

  function toggleAccord(label) {
    setAccords((curr) => {
      if (curr.includes(label)) return curr.filter((x) => x !== label)
      if (curr.length >= 3) return curr
      return [...curr, label]
    })
  }

  // Only Step 4 (accords) is skippable
  const isOptionalStep = step === 3

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div className="h-1.5 w-full bg-zinc-100">
          <div
            className="h-full bg-green-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image src="/logo-mark.png" alt="" width={48} height={48} priority />
            <span className="text-2xl font-black tracking-tight">Pick<span className="text-green-deep">Sniff</span></span>
          </Link>
          <span className="text-sm font-semibold text-slate">{step + 1} of {STEPS.length}</span>
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-5xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={goBack}
            className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-sand px-4 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black"
          >
            <span aria-hidden>&larr;</span> Back
          </button>

          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
              {currentStep.eyebrow}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
              {currentStep.title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate">{currentStep.subtitle}</p>
          </div>

          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {GENDERS.map((g) => (
                <OptionButton key={g.id} label={g.label} selected={genders.includes(g.id)} onClick={() => toggleGender(g.id)} />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3">
              {TIERS.map((t) => (
                <OptionButton key={t.id} label={t.label} description={t.description} selected={tier === t.id} onClick={() => setTier(t.id)} />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {VIBES.map((v) => (
                <OptionButton key={v.id} label={v.label} description={v.description} selected={vibe === v.id} onClick={() => setVibe(v.id)} />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {accordsLoading || availableAccords === null ? (
                // Skeleton chips while fetching
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-[62px] rounded-xl bg-zinc-100 animate-pulse" />
                ))
              ) : (
                availableAccords.map((accord) => {
                  const selected = accords.includes(accord)
                  const disabled = accords.length >= 3 && !selected
                  const hint = ACCORD_HINTS[accord]
                  return (
                    <button
                      key={accord}
                      type="button"
                      onClick={() => toggleAccord(accord)}
                      disabled={disabled}
                      aria-pressed={selected}
                      className={[
                        'rounded-xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-deep disabled:cursor-not-allowed disabled:opacity-40',
                        selected ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-black text-black">{accord}</span>
                        {selected && <span aria-hidden className="text-xs font-black text-green-deep">✓</span>}
                      </span>
                      {hint && <span className="mt-0.5 block text-xs text-slate">{hint}</span>}
                    </button>
                  )
                })
              )}
            </div>
          )}

          {submitError && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue() || isSubmitting}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isSubmitting ? 'Finding matches…' : isLastStep ? 'See My Matches' : 'Next'}
              {!isSubmitting && !isLastStep && <span aria-hidden className="ml-2">&rarr;</span>}
            </button>

            {isOptionalStep && (
              <button
                type="button"
                onClick={() => submitQuiz(false)}
                disabled={isSubmitting}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-sand px-8 text-base font-bold text-slate transition hover:border-green-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-36"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function OptionButton({ label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'min-h-20 rounded-xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-deep',
        selected ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent',
      ].join(' ')}
    >
      <span className="block text-lg font-black text-black">{label}</span>
      {description && <span className="mt-1 block text-sm leading-6 text-slate">{description}</span>}
    </button>
  )
}
