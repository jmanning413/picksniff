'use client'

import { useState, useTransition } from 'react'
import { saveQuizResult } from '@/app/_actions/collection'

export default function SaveQuizButton({ genders, tier, vibe, accords }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handle() {
    startTransition(async () => {
      const result = await saveQuizResult({ genders, tier, vibe, accords })
      if (result && !result.error) setSaved(true)
    })
  }

  if (saved) {
    return (
      <span className="text-sm font-bold text-green-accent">✓ Saved to profile</span>
    )
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={isPending}
      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black disabled:opacity-50"
    >
      {isPending ? 'Saving…' : 'Save to profile'}
    </button>
  )
}
