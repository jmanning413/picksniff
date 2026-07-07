'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unisex', label: 'Unisex' },
]

const QUESTIONS = [
  {
    id: 'vibe',
    question: 'Pick a vibe',
    options: [
      { id: 'moody', label: 'Dark & Moody', emoji: '🌑', desc: 'Low lights, deep music, velvet seats' },
      { id: 'fresh', label: 'Crisp & Fresh', emoji: '🌿', desc: 'Open windows, morning runs, clean sheets' },
      { id: 'bold', label: 'Bold & Loud', emoji: '🔥', desc: 'Centre of the room, unforgettable exits' },
      { id: 'cozy', label: 'Soft & Cozy', emoji: '🕯️', desc: 'Blankets, candles, good books' },
    ],
  },
  {
    id: 'place',
    question: 'Pick a place',
    options: [
      { id: 'forest', label: 'Forest at dusk', emoji: '🌲', desc: 'Pine, earth, cool air' },
      { id: 'city', label: 'City at midnight', emoji: '🌃', desc: 'Rain on concrete, neon lights' },
      { id: 'beach', label: 'Beach at sunrise', emoji: '🌊', desc: 'Salt air, warm sand, open sky' },
      { id: 'garden', label: 'Secret garden', emoji: '🌹', desc: 'Flowers, old stone, green shade' },
    ],
  },
  {
    id: 'time',
    question: 'Pick a time of day',
    options: [
      { id: 'morning', label: 'Morning', emoji: '🌅', desc: '6–10am' },
      { id: 'afternoon', label: 'Afternoon', emoji: '☀️', desc: '12–5pm' },
      { id: 'evening', label: 'Evening', emoji: '🌆', desc: '6–10pm' },
      { id: 'night', label: 'Late Night', emoji: '🌙', desc: '11pm–3am' },
    ],
  },
]

const ARCHETYPES = {
  'moody-city-night': { name: 'The Dark Romantic', desc: 'You wear fragrance like armor — intense, unforgettable, always leaving a trace. Deep amber, oud, and smouldering spice are your language.', quiz: { tier: 'niche', vibe: 'date_night', accords: ['Amber', 'Spicy', 'Woody'] } },
  'moody-forest-night': { name: 'The Mysterious Wanderer', desc: 'You prefer shadows to spotlights. Earthy woods, vetiver, and quiet smoke define your trail.', quiz: { tier: 'quality', vibe: 'chill', accords: ['Woody', 'Aromatic'] } },
  'fresh-beach-morning': { name: 'The Fresh Minimalist', desc: 'Clean, effortless, and always put-together. Citrus, aquatics, and light musks are your signature.', quiz: { tier: 'budget', vibe: 'daily', accords: ['Fresh', 'Citrus', 'Aquatic'] } },
  'fresh-garden-afternoon': { name: 'The Green Optimist', desc: 'You smell like possibility. Fresh greens, florals, and sparkling citrus light up every room you walk into.', quiz: { tier: 'budget', vibe: 'daily', accords: ['Fresh', 'Green', 'Floral'] } },
  'bold-city-evening': { name: 'The Bold Explorer', desc: 'You wear your confidence like a second skin. Spicy woods, warm amber, and powerful musks leave a room remembering you.', quiz: { tier: 'quality', vibe: 'date_night', accords: ['Spicy', 'Amber', 'Woody'] } },
  'cozy-garden-evening': { name: 'The Cozy Homebody', desc: 'You find magic in the mundane. Vanilla, soft florals, and warm woods wrap around you like your favourite blanket.', quiz: { tier: 'budget', vibe: 'chill', accords: ['Vanilla', 'Floral', 'Woody'] } },
  'cozy-forest-night': { name: 'The Forest Dreamer', desc: 'Old soul. Pine resin, moss, and woody smoke speak your language. You belong somewhere between a cabin and a bookshop.', quiz: { tier: 'quality', vibe: 'chill', accords: ['Woody', 'Green', 'Aromatic'] } },
  'bold-beach-morning': { name: 'The Sunlit Adventurer', desc: 'Life is for living loudly. Bright citrus, sea air, and warm musks follow you everywhere.', quiz: { tier: 'budget', vibe: 'sport', accords: ['Citrus', 'Aquatic', 'Fresh'] } },
}

function getArchetype(answers) {
  const key = `${answers.vibe}-${answers.place}-${answers.time}`
  if (ARCHETYPES[key]) return ARCHETYPES[key]
  if (answers.vibe === 'cozy') return ARCHETYPES['cozy-garden-evening']
  if (answers.vibe === 'fresh') return ARCHETYPES['fresh-beach-morning']
  if (answers.vibe === 'bold') return ARCHETYPES['bold-city-evening']
  return ARCHETYPES['moody-city-night']
}

// Step 0 = gender, Steps 1-3 = personality questions
const TOTAL_STEPS = 1 + QUESTIONS.length

export default function PersonalityQuizPage() {
  const [step, setStep] = useState(0)
  const [genders, setGenders] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  function toggleGender(id) {
    setGenders((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])
  }

  function advanceFromGender() {
    if (genders.length === 0) return
    setStep(1)
  }

  function select(questionId, optionId) {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    const questionIndex = step - 1 // step 1 = QUESTIONS[0], etc.
    if (questionIndex < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 300)
    } else {
      setTimeout(() => setResult(getArchetype(next)), 300)
    }
  }

  function restart() {
    setStep(0)
    setGenders([])
    setAnswers({})
    setResult(null)
  }

  function goBack() {
    if (step === 0) return
    setStep((s) => s - 1)
  }

  const progress = (step / TOTAL_STEPS) * 100

  if (result) {
    const selectedGenders = genders.length > 0 ? genders : ['unisex']
    const params = new URLSearchParams({
      genders: selectedGenders.join(','),
      tier: result.quiz.tier,
      vibe: result.quiz.vibe,
      accords: result.quiz.accords.join(','),
    })

    return (
      <main className="min-h-screen bg-cream text-black">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
          <Image className="mix-blend-multiply" src="/logo.svg" alt="PickSniff" width={64} height={64} priority />
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-deep">Your Fragrance Archetype</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{result.name}</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-slate">{result.desc}</p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href={`/results?${params.toString()}`}
              className="inline-flex flex-1 min-h-12 items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95"
            >
              See My Matches →
            </Link>
            <button
              type="button"
              onClick={restart}
              className="inline-flex flex-1 min-h-12 items-center justify-center rounded-xl border border-sand px-8 text-base font-bold text-slate transition hover:border-green-accent hover:text-black"
            >
              Retake Quiz
            </button>
          </div>

          <Link
            href="/quiz"
            className="mt-4 text-sm font-bold text-zinc-400 transition hover:text-black"
          >
            Or take the Signature Scent Quiz →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="sticky top-0 z-20 bg-white">
        <div className="h-1.5 w-full bg-zinc-100">
          <div className="h-full bg-green-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="PickSniff home">
            <Image className="mix-blend-multiply" src="/logo.svg" alt="" width={34} height={34} priority />
            <span>Pick<span className="text-green-accent">Sniff</span></span>
          </Link>
          <span className="text-sm font-semibold text-zinc-400">{step + 1} of {TOTAL_STEPS}</span>
        </header>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-3xl content-center px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-sand px-4 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black"
            >
              ← Back
            </button>
          )}

          {/* Step 0: Gender */}
          {step === 0 && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-green-deep">
                  Step 1
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Who is this for?</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate">
                  Choose one or more. This helps us match you to the right fragrances.
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
                  onClick={advanceFromGender}
                  disabled={genders.length === 0}
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-green-accent px-8 text-base font-black text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:min-w-48"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Steps 1-3: Personality questions */}
          {step >= 1 && (() => {
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
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => select(q.id, opt.id)}
                        className={[
                          'flex items-start gap-4 rounded-xl border p-5 text-left transition',
                          selected
                            ? 'border-green-accent bg-green-accent/15 shadow-sm'
                            : 'border-sand bg-white hover:border-green-accent',
                        ].join(' ')}
                      >
                        <span className="text-3xl">{opt.emoji}</span>
                        <div>
                          <p className="text-base font-black text-black">{opt.label}</p>
                          <p className="mt-0.5 text-sm text-slate">{opt.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )
          })()}
        </div>
      </section>
    </main>
  )
}
