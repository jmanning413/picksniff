'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const GENDER_OPTIONS = ['male', 'female', 'unisex']
const TIER_OPTIONS = ['budget', 'quality', 'niche']
const VIBE_OPTIONS = ['daily', 'date_night', 'sport', 'chill', 'formal']
const ACCORD_OPTIONS = [
  'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber',
  'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
]

const VIBE_LABELS = {
  daily: 'Daily',
  date_night: 'Date Night',
  sport: 'Sport',
  chill: 'Chill',
  formal: 'Formal',
}

function toggleItem(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function EncyclopediaClient({ fragrances }) {
  const [query, setQuery] = useState('')
  const [genders, setGenders] = useState([])
  const [tiers, setTiers] = useState([])
  const [vibes, setVibes] = useState([])
  const [accords, setAccords] = useState([])

  const hasFilters = query || genders.length || tiers.length || vibes.length || accords.length

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    return fragrances
      .filter((f) => {
        if (q && !f.name.toLowerCase().includes(q) && !f.brand.toLowerCase().includes(q)) return false
        if (genders.length && !genders.includes(f.gender)) return false
        if (tiers.length && !tiers.includes(f.tier)) return false
        if (vibes.length && !vibes.includes(f.vibe)) return false
        if (accords.length && !accords.some((a) => f.accords?.includes(a))) return false
        return true
      })
      .sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`))
  }, [fragrances, query, genders, tiers, vibes, accords])

  function clearAll() {
    setQuery('')
    setGenders([])
    setTiers([])
    setVibes([])
    setAccords([])
  }

  return (
    <div>
      <div className="mb-5">
        <input
          type="search"
          placeholder="Search by name or brand…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium outline-none transition focus:border-green-accent"
        />
      </div>

      <div className="mb-6 space-y-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
        <FilterRow label="Gender">
          {GENDER_OPTIONS.map((g) => (
            <Pill key={g} active={genders.includes(g)} onClick={() => setGenders(toggleItem(genders, g))}>
              {g}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Tier">
          {TIER_OPTIONS.map((t) => (
            <Pill key={t} active={tiers.includes(t)} onClick={() => setTiers(toggleItem(tiers, t))}>
              {t}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Vibe">
          {VIBE_OPTIONS.map((v) => (
            <Pill key={v} active={vibes.includes(v)} onClick={() => setVibes(toggleItem(vibes, v))}>
              {VIBE_LABELS[v]}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Accords">
          {ACCORD_OPTIONS.map((a) => (
            <Pill key={a} active={accords.includes(a)} onClick={() => setAccords(toggleItem(accords, a))}>
              {a}
            </Pill>
          ))}
        </FilterRow>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-400">
          {filtered.length} of {fragrances.length} fragrances
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-bold text-zinc-400 transition hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-xl font-black">No matches found</p>
          <p className="mt-2 text-sm text-zinc-500">Try adjusting your search or filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-5 rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <FragranceCard key={f.id} fragrance={f} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterRow({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Pill({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1 text-xs font-bold capitalize transition',
        active
          ? 'border-green-accent bg-green-accent text-black'
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-green-accent',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function FragranceCard({ fragrance }) {
  return (
    <Link
      href={`/fragrance/${fragrance.id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
    >
      <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
        {fragrance.brand}
      </p>
      <h2 className="mt-1 text-base font-black leading-tight text-black group-hover:text-green-accent transition">
        {fragrance.name}
      </h2>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {fragrance.concentration && (
          <Tag>{fragrance.concentration}</Tag>
        )}
        <Tag>{fragrance.tier}</Tag>
        <Tag>{fragrance.gender}</Tag>
        <Tag>{VIBE_LABELS[fragrance.vibe]}</Tag>
      </div>

      {fragrance.accords?.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {fragrance.accords.slice(0, 3).map((a) => (
            <span
              key={a}
              className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-xs font-bold capitalize text-zinc-500">
      {children}
    </span>
  )
}
