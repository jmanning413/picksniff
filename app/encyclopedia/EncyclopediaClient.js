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

  // One card per PRODUCT, not per catalog row. A fragrance deliberately lives in
  // several gender/vibe pools so the quiz can match it in each context, which
  // meant the encyclopedia rendered Good Girl five times and Santal 33 four
  // times. Group on brand|name|concentration and merge the pool metadata.
  const products = useMemo(() => {
    const groups = new Map()
    for (const f of fragrances) {
      const key = `${f.brand}|${f.name}|${f.concentration}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(f)
    }

    return [...groups.values()]
      .map((rows) => {
        const sorted = [...rows].sort((a, b) => a.id.localeCompare(b.id))
        // Accords vary between rows of the same product (a known data issue —
        // they were assigned per pool, not per product), so rank by how often
        // each appears across the rows and keep the most representative.
        const freq = new Map()
        for (const r of rows) for (const a of r.accords || []) freq.set(a, (freq.get(a) || 0) + 1)
        const accordsRanked = [...freq.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([a]) => a)

        return {
          id: sorted[0].id,
          brand: sorted[0].brand,
          name: sorted[0].name,
          concentration: sorted[0].concentration,
          genders: [...new Set(rows.map((r) => r.gender))],
          vibes: [...new Set(rows.map((r) => r.vibe))],
          tiers: [...new Set(rows.map((r) => r.tier))],
          accords: accordsRanked,
          rowCount: rows.length,
        }
      })
      .sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`))
  }, [fragrances])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    // A product matches a facet if ANY of its rows does.
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
      if (genders.length && !genders.some((g) => p.genders.includes(g))) return false
      if (tiers.length && !tiers.some((t) => p.tiers.includes(t))) return false
      if (vibes.length && !vibes.some((v) => p.vibes.includes(v))) return false
      if (accords.length && !accords.some((a) => p.accords.includes(a))) return false
      return true
    })
  }, [products, query, genders, tiers, vibes, accords])

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
          className="w-full rounded-full border border-sand px-5 py-3 text-sm font-medium outline-none transition focus:border-green-accent"
        />
      </div>

      <div className="mb-6 space-y-4 rounded-lg border border-sand bg-zinc-50 p-4">
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
        <p className="text-sm font-bold text-slate">
          {filtered.length} of {products.length} fragrances
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-bold text-slate transition hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-xl font-black">No matches found</p>
          <p className="mt-2 text-sm text-slate">Try adjusting your search or filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-5 rounded-xl bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <FragranceCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterRow({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</p>
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
          : 'border-sand bg-white text-slate hover:border-green-accent',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function FragranceCard({ product }) {
  // Vibes are capped so a fragrance sitting in five pools doesn't wrap the card.
  const shownVibes = product.vibes.slice(0, 2)
  const extraVibes = product.vibes.length - shownVibes.length

  return (
    <Link
      href={`/fragrance/${product.id}`}
      className="group block rounded-lg border border-sand bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
    >
      <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-slate">
        {product.brand}
      </p>
      <h2 className="mt-1 text-base font-black leading-tight text-black group-hover:text-green-deep transition">
        {product.name}
      </h2>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {product.concentration && <Tag>{product.concentration}</Tag>}
        {product.tiers.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        {product.genders.map((g) => (
          <Tag key={g}>{g}</Tag>
        ))}
        {shownVibes.map((v) => (
          <Tag key={v}>{VIBE_LABELS[v]}</Tag>
        ))}
        {extraVibes > 0 && <Tag>{`+${extraVibes}`}</Tag>}
      </div>

      {product.accords.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {product.accords.slice(0, 3).map((a) => (
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
    <span className="rounded-full border border-sand bg-zinc-50 px-2 py-0.5 text-xs font-bold capitalize text-slate">
      {children}
    </span>
  )
}
