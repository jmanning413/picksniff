'use client'

import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  {
    id: 'gender',
    title: 'Gender',
    question: 'Who are you shopping for?',
    multi: true,
    options: ['Male', 'Female', 'Unisex'],
  },
  {
    id: 'price',
    title: 'Price Tier',
    question: 'Choose your price tier.',
    multi: false,
    options: ['Budget', 'Quality', 'Niche'],
  },
  {
    id: 'vibe',
    title: 'Vibe',
    question: "What's your vibe?",
    multi: false,
    options: ['Daily', 'Date Night', 'Sport', 'Chill', 'Formal'],
  },
  {
    id: 'accords',
    title: 'Accords',
    question: 'Pick your favorite accords.',
    hint: 'Choose up to 3. This step is optional.',
    multi: true,
    max: 3,
    optional: true,
    options: [
      'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber',
      'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
    ],
  },
]

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState({
    gender: [],
    price: null,
    vibe: null,
    accords: [],
  })

  const current = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const selection = answers[current.id]

  const isSelected = (option) =>
    current.multi ? selection.includes(option) : selection === option

  const toggle = (option) => {
    if (current.multi) {
      setAnswers((prev) => {
        const sel = prev[current.id]
        if (sel.includes(option)) {
          return { ...prev, [current.id]: sel.filter((o) => o !== option) }
        }
        if (current.max && sel.length >= current.max) return prev
        return { ...prev, [current.id]: [...sel, option] }
      })
    } else {
      setAnswers((prev) => ({ ...prev, [current.id]: option }))
    }
  }

  const canAdvance =
    current.optional ||
    (current.multi ? selection.length > 0 : selection !== null)

  const advance = () => {
    if (isLast) {
      setDone(true)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-6">
        <h1 className="text-4xl font-bold text-black">Your scent profile is ready!</h1>
        <p className="text-zinc-500 max-w-sm">
          We&apos;re matching fragrances to your taste&hellip;
        </p>
        <Link
          href="/"
          className="px-10 py-4 bg-green-accent text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="h-1 w-full bg-zinc-100">
        <div
          className="h-full bg-green-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="flex-1 min-h-[calc(100vh-0.25rem)] flex flex-col justify-between px-6 py-8 sm:py-12 max-w-xl mx-auto w-full">
        <div className="flex flex-col justify-center flex-1">
          <p className="text-sm font-semibold text-zinc-400 mb-4">
            Step {stepIndex + 1} of {STEPS.length}
          </p>

          <h1 className="text-5xl font-bold text-black mb-4">{current.title}</h1>
          <p className="text-xl text-zinc-500 mb-3">{current.question}</p>

          {current.hint ? (
            <p className="text-zinc-400 mb-8">{current.hint}</p>
          ) : (
            <div className="mb-8" aria-hidden="true" />
          )}

          {current.id === 'accords' ? (
            <div className="flex flex-wrap gap-3">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggle(option)}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${
                    isSelected(option)
                      ? 'bg-green-accent border-green-accent text-black'
                      : 'bg-white border-zinc-200 text-black hover:border-green-accent'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggle(option)}
                  className={`w-full px-6 py-5 rounded-2xl text-base font-semibold border-2 text-left transition-all ${
                    isSelected(option)
                      ? 'bg-green-accent border-green-accent text-black'
                      : 'bg-white border-zinc-200 text-black hover:border-green-accent'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          <button
            onClick={advance}
            disabled={!canAdvance}
            className={`w-full py-4 rounded-full text-base font-semibold transition-all ${
              canAdvance
                ? 'bg-green-accent text-black hover:opacity-90'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isLast ? 'Find My Scent' : 'Next'}
          </button>
        </div>
      </section>
    </main>
  )
}
