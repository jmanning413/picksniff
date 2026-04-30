'use client'

import Link from 'next/link'
import { useState } from 'react'

const VIBE_LABELS = {
  daily: 'Daily',
  date_night: 'Date Night',
  sport: 'Sport',
  chill: 'Chill',
  formal: 'Formal',
}

const TABS = ['Quiz History', 'Wishlist', 'Collection']

export default function ProfileTabs({ quizResults, wishlistFragrances, ownedFragrances }) {
  const [tab, setTab] = useState('Quiz History')

  return (
    <div className="mt-10">
      <div className="flex gap-1 rounded-full border border-zinc-200 p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              'rounded-full px-4 py-2 text-sm font-bold transition',
              tab === t ? 'bg-green-accent text-black' : 'text-zinc-500 hover:text-black',
            ].join(' ')}
          >
            {t}
            {t === 'Wishlist' && wishlistFragrances.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">{wishlistFragrances.length}</span>
            )}
            {t === 'Collection' && ownedFragrances.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">{ownedFragrances.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Quiz History' && (
          <QuizHistory results={quizResults} />
        )}
        {tab === 'Wishlist' && (
          <FragranceGrid fragrances={wishlistFragrances} emptyMessage="No fragrances wishlisted yet." />
        )}
        {tab === 'Collection' && (
          <FragranceGrid fragrances={ownedFragrances} emptyMessage="No fragrances marked as owned yet." />
        )}
      </div>
    </div>
  )
}

function QuizHistory({ results }) {
  if (results.length === 0) {
    return (
      <Empty message="No quiz results saved yet.">
        <Link
          href="/quiz"
          className="mt-4 inline-flex rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95"
        >
          Take the Quiz
        </Link>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((r) => (
        <Link
          key={r.id}
          href={`/results?genders=${r.genders.join(',')}&tier=${r.tier}&vibe=${r.vibe}${r.accords?.length ? `&accords=${r.accords.join(',')}` : ''}`}
          className="block rounded-lg border border-zinc-200 p-4 transition hover:border-green-accent hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {r.genders.map((g) => (
                <Tag key={g}>{g}</Tag>
              ))}
              <Tag>{r.tier}</Tag>
              <Tag>{VIBE_LABELS[r.vibe] ?? r.vibe}</Tag>
              {r.accords?.map((a) => (
                <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">
                  {a}
                </span>
              ))}
            </div>
            <span className="shrink-0 text-xs text-zinc-400">
              {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-green-accent">View results →</p>
        </Link>
      ))}
    </div>
  )
}

function FragranceGrid({ fragrances, emptyMessage }) {
  if (fragrances.length === 0) {
    return <Empty message={emptyMessage} />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fragrances.map((f) => (
        <Link
          key={f.id}
          href={`/fragrance/${f.id}`}
          className="block rounded-lg border border-zinc-200 p-4 transition hover:border-green-accent hover:shadow-sm"
        >
          <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{f.brand}</p>
          <h3 className="mt-1 text-base font-black leading-tight text-black">{f.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {f.accords?.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">
                {a}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-xs font-bold capitalize text-zinc-500">
      {children}
    </span>
  )
}

function Empty({ message, children }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <p className="text-sm text-zinc-500">{message}</p>
      {children}
    </div>
  )
}
