'use client'

import { useTransition } from 'react'
import { signOut } from '@/app/auth/actions'

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => signOut())}
      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-zinc-400 hover:text-black disabled:opacity-50"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
