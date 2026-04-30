'use client'

import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'

export default function AccountGate({ children, label = 'This feature' }) {
  const { isLoggedIn, loading } = useUser()

  if (loading) return null
  if (isLoggedIn) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50" aria-hidden>
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 p-6 text-center backdrop-blur-sm">
        <span className="text-2xl">🔓</span>
        <p className="text-sm font-black text-black">{label} requires a free account</p>
        <p className="max-w-xs text-xs leading-5 text-zinc-500">
          Create a free PickSniff account to unlock this feature and more — no payment required.
        </p>
        <Link
          href="/auth"
          className="mt-1 inline-flex rounded-full bg-green-accent px-5 py-2.5 text-sm font-black text-black transition hover:brightness-95"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  )
}
