'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import QuizIcon from '@/app/_components/QuizIcons'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

const QUESTIONS = [
  {
    id: 'energy',
    question: "How's your energy right now?",
    options: [
      { id: 'high', label: 'High', icon: 'flame', desc: 'Ready to take on the world' },
      { id: 'low', label: 'Low', icon: 'battery', desc: 'Running on empty' },
      { id: 'building', label: 'Building', icon: 'bolt', desc: 'Finding my momentum' },
      { id: 'calm', label: 'Calm', icon: 'wave', desc: 'Peaceful and present' },
    ],
  },
  {
    id: 'social',
    question: "Where's your head at today?",
    options: [
      { id: 'social', label: 'Social', icon: 'people', desc: 'Out with people, loving it' },
      { id: 'reflective', label: 'Reflective', icon: 'lotus', desc: 'Inward, solo mode' },
      { id: 'on', label: 'On', icon: 'briefcase', desc: 'Presenting, performing, working' },
      { id: 'comfort', label: 'Comfort', icon: 'heart', desc: 'I just need a hug' },
    ],
  },
  {
    id: 'intent',
    question: 'What do you want your scent to do?',
    options: [
      { id: 'statement', label: 'Make a statement', icon: 'burst', desc: 'Unforgettable entrance' },
      { id: 'confidence', label: 'Give me confidence', icon: 'shield', desc: 'Background power' },
      { id: 'ground', label: 'Ground me', icon: 'sprout', desc: 'Calm and centred' },
      { id: 'lift', label: 'Lift my mood', icon: 'star', desc: 'Bright and energising' },
    ],
  },
]

const TOTAL_STEPS = 1 + QUESTIONS.length // gender + 3 questions

function getMoodResult(energy, social, intent) {
  const vibeScores = { daily: 0, date_night: 0, sport: 0, chill: 0, formal: 0 }

  const add = (vibe, pts) => { vibeScores[vibe] = (vibeScores[vibe] || 0) + pts }

  if (energy === 'high')    { add('sport', 3); add('date_night', 1) }
  if (energy === 'low')     { add('chill', 3); add('daily', 1) }
  if (energy === 'building'){ add('daily', 3); add('sport', 1) }
  if (energy === 'calm')    { add('chill', 3); add('formal', 1) }

  if (social === 'social')     { add('date_night', 3); add('sport', 1) }
  if (social === 'reflective') { add('chill', 3); add('daily', 1) }
  if (social === 'on')         { add('formal', 3); add('date_night', 1) }
  if (social === 'comfort')    { add('chill', 3); add('daily', 1) }

  if (intent === 'statement')  { add('date_night', 3); add('formal', 1) }
  if (intent === 'confidence') { add('daily', 3); add('formal', 1) }
  if (intent === 'ground')     { add('chill', 3); add('daily', 1) }
  if (intent === 'lift')       { add('sport', 3); add('daily', 1) }

  const vibe = Object.entries(vibeScores).sort((a, b) => b[1] - a[1])[0][0]

  let tier = 'quality'
  if (social === 'reflective' && intent === 'statement') tier = 'niche'
  if (energy === 'low' && social === 'comfort') tier = 'budget'

  const vibeAccords = {
    sport:     ['Fresh', 'Citrus', 'Aquatic'],
    date_night:['Amber', 'Spicy', 'Vanilla'],
    formal:    ['Woody', 'Amber', 'Aromatic'],
    chill:     ['Woody', 'Vanilla', 'Green'],
    daily:     ['Fresh', 'Aromatic', 'Citrus'],
  }
  const intentAccords = {
    statement:  ['Spicy', 'Amber'],
    confidence: ['Aromatic', 'Woody'],
    ground:     ['Woody', 'Green'],
    lift:       ['Citrus', 'Fresh'],
  }

  const base = vibeAccords[vibe]
  const overlay = intentAccords[intent] || []
  const accords = [base[0]]
  const second = overlay.find((a) => a !== base[0]) || base[1]
  if (second) accords.push(second)

  return { vibe, tier, accords }
}

export default function MoodQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleGender(id) {
    setGenders((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])
  }

  function select(questionId, optionId) {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    const questionIndex = step - 1
    if (questionIndex < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 280)
    } else {
      setIsSubmitting(true)
      const { vibe, tier, accords } = getMoodResult(next.energy, next.social, next.intent)
      const selectedGenders = genders.length > 0 ? genders : ['unisex']
      const params = new URLSearchParams({
        genders: selectedGenders.join(','),
        tier,
        vibe,
        accords: accords.join(','),
        mode: 'mood',
      })
      router.push(`/results?${params.toString()}`)
    }
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
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">Mood Quiz</p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Who is this for?</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate">
                  Choose one or more. We&apos;ll match you to the right scents.
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
                    <span className="block text-lg font-black text-black">{g.label}</span>
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
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Steps 1–3: Mood questions */}
          {step >= 1 && !isSubmitting && (() => {
            const q = QUESTIONS[step - 1]
            return (
              <>
                <div className="mb-8">
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
                    Question {step}
                  </p>
                  <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{q.question}</h1>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => select(q.id, opt.id)}
                      className={[
                        'flex items-start gap-4 rounded-xl border p-5 text-left transition',
                        answers[q.id] === opt.id
                          ? 'border-green-accent bg-green-accent/15 shadow-sm'
                          : 'border-sand bg-white hover:border-green-accent',
                      ].join(' ')}
                    >
                      <span className="mt-0.5 shrink-0 text-green-deep"><QuizIcon name={opt.icon} /></span>
                      <div>
                        <p className="text-base font-black text-black">{opt.label}</p>
                        <p className="mt-0.5 text-sm text-slate">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )
          })()}

          {isSubmitting && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="h-1 w-12 rounded-full bg-green-accent animate-pulse" />
              <p className="text-sm font-bold text-slate">Reading your mood...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
