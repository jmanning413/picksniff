'use client'

// The Nose Test. Research: docs/NOSE-TEST.md. Question spec: docs/NOSE-TEST-SCRIPT.md.
// Scoring lives in lib/noseProfile.mjs and is kept pure. This file is the UI shell.
//
// WORDING FREEZE: every prompt string lives in lib/noseProfile.mjs, not here,
// precisely so it is not casually edited for layout reasons. Read the banner at
// the top of that file before changing any of them.

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import QuizIcon from '@/app/_components/QuizIcons'
import {
  SMELL_ITEMS,
  SPECIAL_ITEMS,
  INTENSITY_ITEMS,
  TRIGEMINAL_ITEMS,
  VALENCE_CHOICES,
  scoreNoseProfile,
} from '@/lib/noseProfile.mjs'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

// Build the question list. Valence items first (the four-option control), then
// the special formats, then intensity probes, then the trigeminal pair.
function buildQuestions(smellOrder) {
  const smells = smellOrder.map((item) => ({
    kind: 'valence',
    id: item.id,
    prompt: item.prompt,
    icon: item.icon,
    options: VALENCE_CHOICES,
  }))
  const specials = SPECIAL_ITEMS.map((item) => ({
    kind: 'special',
    id: item.id,
    prompt: item.prompt,
    note: item.note,
    icon: item.icon,
    options: item.options,
  }))
  const intensity = INTENSITY_ITEMS.map((item) => ({
    kind: 'intensity',
    id: item.id,
    prompt: item.prompt,
    icon: item.icon,
    options: item.options,
  }))
  const trigeminal = TRIGEMINAL_ITEMS.map((item) => ({
    kind: 'trigeminal',
    id: item.id,
    prompt: item.prompt,
    icon: item.icon,
    options: item.options,
  }))
  return [...smells, ...specials, ...intensity, ...trigeminal]
}

export default function NoseTestPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [answers, setAnswers] = useState({})
  const [smellOrder, setSmellOrder] = useState(SMELL_ITEMS)
  const [profile, setProfile] = useState(null)

  // Order effects are real: earlier items prime later ones. Standard mitigation
  // is randomising independent items, and our smells are independent. The first
  // three are deliberately fixed because they carry the engagement load.
  // Shuffled after mount so server and client markup match.
  useEffect(() => {
    const fixed = SMELL_ITEMS.filter((i) => i.fixed)
    const rest = SMELL_ITEMS.filter((i) => !i.fixed)
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rest[i], rest[j]] = [rest[j], rest[i]]
    }
    setSmellOrder([...fixed, ...rest])
  }, [])

  const questions = useMemo(() => buildQuestions(smellOrder), [smellOrder])
  const totalSteps = 1 + questions.length

  function toggleGender(id) {
    setGenders((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]))
  }

  function select(questionId, optionId) {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    const index = step - 1
    if (index < questions.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 240)
    } else {
      setProfile(scoreNoseProfile(next))
    }
  }

  function goToResults() {
    const params = new URLSearchParams({
      genders: (genders.length > 0 ? genders : ['unisex']).join(','),
      tier: profile.tier,
      vibe: profile.vibe,
      accords: profile.accords.join(','),
      mode: 'nose',
    })
    router.push(`/results?${params.toString()}`)
  }

  const progress = profile ? 100 : (step / totalSteps) * 100

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
          className="h-1.5 w-full bg-zinc-100"
        >
          <div
            className="h-full bg-green-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image src="/logo-mark.png" alt="" width={48} height={48} priority />
            <span className="text-2xl font-black tracking-tight">
              Pick<span className="text-green-deep">Sniff</span>
            </span>
          </Link>
          {!profile && (
            <span className="text-sm font-semibold text-slate">
              {step + 1} of {totalSteps}
            </span>
          )}
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-3xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {step > 0 && !profile && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-sand px-4 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black"
            >
              ← Back
            </button>
          )}

          {/* Step 0: who it's for, plus an honest statement of length */}
          {step === 0 && !profile && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
                  The Nose Test
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Who is this for?</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate">
                  Then {questions.length} quick questions about smells you already know. No fragrance
                  knowledge needed. About 90 seconds.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {GENDERS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGender(g.id)}
                    aria-pressed={genders.includes(g.id)}
                    className={[
                      'min-h-20 rounded-xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-deep',
                      genders.includes(g.id)
                        ? 'border-green-accent bg-green-accent/15 shadow-sm'
                        : 'border-sand bg-white hover:border-green-accent',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg font-black text-black">{g.label}</span>
                      {genders.includes(g.id) && (
                        <span aria-hidden className="text-sm font-black text-green-deep">
                          ✓
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => genders.length > 0 && setStep(1)}
                  disabled={genders.length === 0}
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:min-w-48"
                >
                  Start →
                </button>
              </div>
            </>
          )}

          {/* Questions */}
          {step >= 1 && !profile && (() => {
            const q = questions[step - 1]
            if (!q) return null
            return (
              <>
                <div className="mb-8">
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
                    Question {step} of {questions.length}
                  </p>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{q.prompt}</h1>
                  {q.note && <p className="mt-3 text-sm leading-6 text-slate">{q.note}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => select(q.id, opt.id)}
                        aria-pressed={selected}
                        className={[
                          'flex items-center justify-between gap-4 rounded-xl border p-5 text-left transition',
                          selected
                            ? 'border-green-accent bg-green-accent/15 shadow-sm'
                            : 'border-sand bg-white hover:border-green-accent',
                        ].join(' ')}
                      >
                        <span className="flex items-center gap-4">
                          <span className="shrink-0 text-green-deep">
                            <QuizIcon name={q.icon} />
                          </span>
                          <span className="text-base font-black text-black">{opt.label}</span>
                        </span>
                        {selected && (
                          <span aria-hidden className="shrink-0 text-sm font-black text-green-deep">
                            ✓
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )
          })()}

          {/* Profile reveal. Leads with a falsifiable claim, never a horoscope. */}
          {profile && (
            <div>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
                  Your Nose Profile
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Here is what your answers say.
                </h1>
              </div>

              <div className="rounded-2xl border border-sand bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate">
                  What you lean toward
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.accords.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-green-accent/20 px-3 py-1 text-sm font-black text-green-deep"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {profile.prediction?.accord && (
                <div className="mt-4 rounded-2xl border border-sand bg-white p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate">
                    A prediction you can check
                  </p>
                  <p className="mt-3 text-base leading-7 text-black">
                    You should tend to dislike{' '}
                    <strong className="font-black">{profile.prediction.accord.toLowerCase()}</strong>{' '}
                    fragrances, going by your reaction to {profile.prediction.dimension.toLowerCase()}.
                    If that is wrong, we would genuinely like to know.
                  </p>
                </div>
              )}

              {profile.blindSpots.length > 0 && (
                <div className="mt-4 rounded-2xl border border-sand bg-white p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate">
                    Worth knowing
                  </p>
                  <p className="mt-3 text-base leading-7 text-black">
                    Some people barely register {profile.blindSpots.join(' and ')}. Your answers
                    suggest you may be one of them. That is a common difference in how people smell,
                    and it is a good reason to try before you buy.
                  </p>
                </div>
              )}

              {profile.trigeminal >= 2 && (
                <div className="mt-4 rounded-2xl border border-sand bg-white p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate">
                    On strength
                  </p>
                  <p className="mt-3 text-base leading-7 text-black">
                    You read sharp, peppery things strongly. Where a fragrance comes in more than one
                    concentration, the lighter one (EDT rather than parfum) will usually suit you
                    better.
                  </p>
                </div>
              )}

              {profile.unfamiliarCount >= 5 && (
                <p className="mt-4 text-sm leading-6 text-slate">
                  You marked {profile.unfamiliarCount} smells as unfamiliar, so this profile is a
                  first sketch rather than a finished picture. It sharpens as you tell us what you
                  actually wear.
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goToResults}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95"
                >
                  See my matches →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({})
                    setProfile(null)
                    setStep(0)
                  }}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-sand px-8 text-base font-bold text-slate transition hover:border-green-accent hover:text-black"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
