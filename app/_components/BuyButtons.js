import Link from 'next/link'

// Single source of truth for buy links. When affiliate programs go live
// (GAMEPLAN Phase 1), tracking params get added HERE and nowhere else.
const BRAND_OVERRIDES = {
  'Louis Vuitton': {
    label: 'Visit LV Boutique',
    href: 'https://us.louisvuitton.com/eng-us/women/fragrances/_/N-tfnabnp',
  },
}

export function buildRetailerLinks(fragrance) {
  const override = BRAND_OVERRIDES[fragrance.brand]
  if (override) return { override }

  const query = encodeURIComponent(
    [fragrance.brand, fragrance.name, fragrance.concentration].filter(Boolean).join(' '),
  )
  return {
    sephora: fragrance.sephora_url || `https://www.sephora.com/search?keyword=${query}`,
    jomashop: fragrance.jomashop_url || `https://www.jomashop.com/searchresult.html#q=${query}`,
  }
}

export default function BuyButtons({ fragrance, showNote = false }) {
  const links = buildRetailerLinks(fragrance)

  if (links.override) {
    return (
      <div className="mt-5">
        <a
          href={links.override.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-green-accent px-5 text-sm font-black text-black transition hover:brightness-95"
        >
          {links.override.label} →
        </a>
        {showNote && (
          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Opens the brand&apos;s official site — prices and returns are handled by them.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={links.sephora}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-green-accent px-5 text-sm font-black text-black transition hover:brightness-95"
        >
          Shop at Sephora →
        </a>
        <a
          href={links.jomashop}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-sand bg-white px-5 text-sm font-bold text-black transition hover:border-green-accent"
        >
          Shop at Jomashop
        </a>
      </div>
      {showNote && (
        <p className="mt-2 text-xs leading-5 text-zinc-400">
          Links open the retailer&apos;s official listing — prices and returns are handled by them.
        </p>
      )}
    </div>
  )
}

// Mobile-only sticky bar for the fragrance detail page — keeps the buy
// action reachable no matter how far the user scrolls.
export function StickyBuyBar({ fragrance }) {
  const links = buildRetailerLinks(fragrance)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 px-4 py-3 backdrop-blur sm:hidden">
      <div className="flex items-center gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-zinc-400">{fragrance.brand}</p>
          <p className="truncate text-sm font-black text-black">{fragrance.name}</p>
        </div>
        <a
          href={links.override ? links.override.href : links.sephora}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-green-accent px-5 text-sm font-black text-black"
        >
          {links.override ? 'Shop →' : 'Shop at Sephora →'}
        </a>
      </div>
    </div>
  )
}
