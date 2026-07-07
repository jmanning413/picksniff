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
      <span className="text-sm font-bold text-green-deep">✓ Saved to profile</span>
    )
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={isPending}
      className="rounded-xl border border-sand px-4 py-2 text-sm font-bold text-slate transition hover:border-green-accent hover:text-black disabled:opacity-50"
    >
      {isPending ? 'Saving…' : 'Save to profile'}
    </button>
  )
}
