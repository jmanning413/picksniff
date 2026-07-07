'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

const SIGNS = [
  { id: 'aries',       label: 'Aries',       emoji: '♈', dates: 'Mar 21 – Apr 19', vibe: 'sport',      accords: ['Spicy', 'Fresh'],    tier: 'quality' },
  { id: 'taurus',      label: 'Taurus',      emoji: '♉', dates: 'Apr 20 – May 20', vibe: 'chill',      accords: ['Woody', 'Vanilla'],   tier: 'quality' },
  { id: 'gemini',      label: 'Gemini',      emoji: '♊', dates: 'May 21 – Jun 20', vibe: 'daily',      accords: ['Citrus', 'Aromatic'], tier: 'quality' },
  { id: 'cancer',      label: 'Cancer',      emoji: '♋', dates: 'Jun 21 – Jul 22', vibe: 'chill',      accords: ['Aquatic', 'Floral'],  tier: 'quality' },
  { id: 'leo',         label: 'Leo',         emoji: '♌', dates: 'Jul 23 – Aug 22', vibe: 'formal',     accords: ['Amber', 'Spicy'],     tier: 'quality' },
  { id: 'virgo',       label: 'Virgo',       emoji: '♍', dates: 'Aug 23 – Sep 22', vibe: 'daily',      accords: ['Green', 'Aromatic'],  tier: 'quality' },
  { id: 'libra',       label: 'Libra',       emoji: '♎', dates: 'Sep 23 – Oct 22', vibe: 'date_night', accords: ['Floral', 'Amber'],    tier: 'quality' },
  { id: 'scorpio',     label: 'Scorpio',     emoji: '♏', dates: 'Oct 23 – Nov 21', vibe: 'date_night', accords: ['Spicy', 'Woody'],     tier: 'niche'   },
  { id: 'sagittarius', label: 'Sagittarius', emoji: '♐', dates: 'Nov 22 – Dec 21', vibe: 'sport',      accords: ['Fresh', 'Citrus'],    tier: 'quality' },
  { id: 'capricorn',   label: 'Capricorn',   emoji: '♑', dates: 'Dec 22 – Jan 19', vibe: 'formal',     accords: ['Woody', 'Amber'],     tier: 'quality' },
  { id: 'aquarius',    label: 'Aquarius',    emoji: '♒', dates: 'Jan 20 – Feb 18', vibe: 'daily',      accords: ['Fresh', 'Aromatic'],  tier: 'quality' },
  { id: 'pisces',      label: 'Pisces',      emoji: '♓', dates: 'Feb 19 – Mar 20', vibe: 'chill',      accords: ['Aquatic', 'Vanilla'], tier: 'quality' },
]

const TOTAL_STEPS = 2

export default function AstrologyQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [sign, setSign] = useState(null)

  function toggleGender(id) {
    setGenders((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])
  }

  function selectSign(s) {
    setSign(s)
    const selectedGenders = genders.length > 0 ? genders : ['unisex']
    const params = new URLSearchParams({
      genders: selectedGenders.join(','),
      tier: s.tier,
      vibe: s.vibe,
      accords: s.accords.join(','),
      mode: 'astrology',
    })
    setTimeout(() => router.push(`/results?${params.toString()}`), 300)
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div className="h-1.5 w-full bg-zinc-100">
          <div className="h-full bg-green-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image className="mix-blend-multiply" src="/logo.svg" alt="" width={48} height={48} priority />
            <span className="text-2xl font-black tracking-tight">Pick<span className="text-green-accent">Sniff</span></span>
          </Link>
          <span className="text-sm font-semibold text-zinc-400">{step + 1} of {TOTAL_STEPS}</span>
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-3xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)}
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-sand px-4 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black">
              ← Back
            </button>
          )}

          {/* Step 0: Gender */}
          {step === 0 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Astrology Quiz</p>
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
              <div className="mt-6">
                <button type="button" onClick={() => genders.length > 0 && setStep(1)} disabled={genders.length === 0}
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:min-w-48">
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 1: Zodiac sign */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Step 2</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">What's your sign?</h1>
                <p className="mt-3 text-base leading-7 text-slate">Pick your zodiac and we'll find your scent instantly.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {SIGNS.map((s) => (
                  <button key={s.id} type="button" onClick={() => selectSign(s)} aria-pressed={sign?.id === s.id}
                    className={['flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition', sign?.id === s.id ? 'border-green-accent bg-green-accent/15 shadow-sm' : 'border-sand bg-white hover:border-green-accent'].join(' ')}>
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-sm font-black text-black">{s.label}</span>
                    <span className="text-xs text-zinc-400 leading-tight">{s.dates}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
