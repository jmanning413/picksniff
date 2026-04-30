'use client'

import Link from 'next/link'
import { useState } from 'react'

const VIBES = ['daily', 'date_night', 'sport', 'chill', 'formal']
const VIBE_LABELS = { daily: 'Daily', date_night: 'Date Night', sport: 'Sport', chill: 'Chill', formal: 'Formal' }

function buildWardrobe(quizResults, allFragrances) {
  const wardrobe = {}
  for (const vibe of VIBES) {
    const relevant = quizResults.filter((r) => r.vibe === vibe)
    if (relevant.length === 0) continue
    const latest = relevant[0]
    const candidates = allFragrances.filter(
      (f) =>
        f.vibe === vibe &&
        latest.genders.includes(f.gender) &&
        f.tier === latest.tier
    )
    if (candidates.length > 0) wardrobe[vibe] = candidates[0]
  }
  return wardrobe
}

export default function WardrobeButton({ quizResults, allFragrances }) {
  const [open, setOpen] = useState(false)

  const wardrobe = buildWardrobe(quizResults, allFragrances)
  const hasWardrobe = Object.keys(wardrobe).length > 0

  if (!hasWardrobe) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black"
      >
        💎 My Fragrance Wardrobe
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-accent">Your Complete</p>
                <h2 className="text-2xl font-black">Fragrance Wardrobe</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:border-green-accent transition">
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VIBES.filter((v) => wardrobe[v]).map((v) => {
                const f = wardrobe[v]
                const query = encodeURIComponent([f.brand, f.name, f.concentration].filter(Boolean).join(' '))
                return (
                  <div key={v} className="rounded-xl border border-zinc-200 p-4">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-green-accent">{VIBE_LABELS[v]}</p>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-accent">
                      <span className="text-lg font-black text-black">{f.brand.charAt(0)}</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                    <p className="mt-0.5 text-base font-black leading-tight">{f.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(f.accords || []).slice(0, 2).map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                    <a href={f.sephora_url || `https://www.sephora.com/search?keyword=${query}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-green-accent py-2 text-xs font-black text-black transition hover:brightness-95">
                      Sephora
                    </a>
                  </div>
                )
              })}
            </div>

            <p className="mt-6 text-center text-xs text-zinc-400">
              Based on your quiz history. Take more quizzes to complete your wardrobe.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
