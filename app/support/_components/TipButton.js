'use client'

import { useState } from 'react'

const AMOUNTS = [
  { label: '$3', value: '3' },
  { label: '$5', value: '5' },
  { label: '$10', value: '10' },
]

export default function TipButton() {
  const [selected, setSelected] = useState('5')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTip() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selected }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {AMOUNTS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setSelected(a.value)}
            className={`flex-1 rounded-full border py-3 text-sm font-black transition ${
              selected === a.value
                ? 'border-green-accent bg-green-accent text-black'
                : 'border-zinc-200 text-zinc-600 hover:border-green-accent hover:text-black'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleTip}
        disabled={loading}
        className="w-full rounded-full bg-green-accent py-3.5 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50"
      >
        {loading ? 'Redirecting to Stripe…' : `Send ${AMOUNTS.find((a) => a.value === selected)?.label} tip`}
      </button>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
