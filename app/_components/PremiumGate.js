'use client'

import Link from 'next/link'
import { useIsPremium } from '@/lib/hooks/useIsPremium'

export default function PremiumGate({ children, label = 'This feature' }) {
  const { isPremium, loading } = useIsPremium()

  if (loading) return null

  if (isPremium) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-60" aria-hidden>
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/80 p-6 text-center backdrop-blur-sm">
        <span className="text-2xl">♛</span>
        <p className="text-sm font-black text-black">{label} is Premium</p>
        <p className="max-w-xs text-xs leading-5 text-zinc-500">
          Upgrade to PickSniff Premium for $4.99/month to unlock this and more.
        </p>
        <Link
          href="/premium"
          className="mt-1 inline-flex rounded-full bg-green-accent px-5 py-2.5 text-sm font-black text-black transition hover:brightness-95"
        >
          Unlock with Premium
        </Link>
      </div>
    </div>
  )
}
