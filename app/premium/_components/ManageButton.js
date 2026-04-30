'use client'

import { useState } from 'react'

export default function ManageButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handlePortal}
      disabled={loading}
      className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 py-3 text-sm font-bold text-zinc-600 transition hover:border-green-accent hover:text-black disabled:opacity-50"
    >
      {loading ? 'Loading…' : 'Manage subscription'}
    </button>
  )
}
