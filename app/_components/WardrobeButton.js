'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { buildRetailerLinks } from '@/app/_components/BuyButtons'

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

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const wardrobe = buildWardrobe(quizResults, allFragrances)
  const hasWardrobe = Object.keys(wardrobe).length > 0

  if (!hasWardrobe) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-xl border border-sand px-4 py-2 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black"
      >
        My Fragrance Wardrobe
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Fragrance wardrobe" className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-deep">Your Complete</p>
                <h2 className="text-2xl font-black">Fragrance Wardrobe</h2>
              </div>
              <button type="button" autoFocus aria-label="Close wardrobe" onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-slate hover:border-green-accent transition">
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VIBES.filter((v) => wardrobe[v]).map((v) => {
                const f = wardrobe[v]
                const links = buildRetailerLinks(f)
                return (
                  <div key={v} className="rounded-xl border border-sand p-4">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-green-deep">{VIBE_LABELS[v]}</p>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-accent">
                      <span className="text-lg font-black text-black">{f.brand.charAt(0)}</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate">{f.brand}</p>
                    <p className="mt-0.5 text-base font-black leading-tight">{f.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(f.accords || []).slice(0, 2).map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                    <a href={links.override ? links.override.href : links.sephora}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-green-accent py-2 text-xs font-black text-black transition hover:brightness-95">
                      {links.override ? links.override.label : 'Shop at Sephora'} →
                    </a>
                  </div>
                )
              })}
            </div>

            <p className="mt-6 text-center text-xs text-slate">
              Based on your quiz history. Take more quizzes to complete your wardrobe.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
