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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3D7A16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></svg>
        <p className="text-sm font-black text-black">{label} requires a free account</p>
        <p className="max-w-xs text-xs leading-5 text-slate">
          Create a free PickSniff account to unlock this feature and more — no payment required.
        </p>
        <Link
          href="/auth"
          className="mt-1 inline-flex rounded-xl bg-green-accent px-5 py-2.5 text-sm font-black text-black transition hover:brightness-95"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  )
}
