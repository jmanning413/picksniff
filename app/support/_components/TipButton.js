'use client'

import { useState } from 'react'

const PRESETS = ['3', '5', '10']

export default function TipButton() {
  const [selected, setSelected] = useState('5')
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amount = custom || selected

  async function handleTip() {
    const num = parseFloat(amount)
    if (!num || num < 1) { setError('Minimum tip is $1.'); return }
    if (num > 999) { setError('Maximum tip is $999.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: String(Math.round(num)) }),
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
        {PRESETS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => { setSelected(a); setCustom('') }}
            className={`flex-1 rounded-full border py-3 text-sm font-black transition ${
              selected === a && !custom
                ? 'border-green-accent bg-green-accent text-black'
                : 'border-sand text-slate hover:border-green-accent hover:text-black'
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">$</span>
        <input
          type="number"
          min="1"
          max="999"
          placeholder="Custom amount"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected('') }}
          className="w-full rounded-full border border-sand py-3 pl-8 pr-4 text-sm outline-none transition focus:border-green-accent"
        />
      </div>

      <button
        type="button"
        onClick={handleTip}
        disabled={loading || !amount}
        className="w-full rounded-full bg-green-accent py-3.5 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50"
      >
        {loading ? 'Redirecting to Stripe…' : `Send $${parseFloat(amount) || '?'} tip`}
      </button>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
