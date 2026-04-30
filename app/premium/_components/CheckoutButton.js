'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
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
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-green-accent py-3 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50"
      >
        {loading ? 'Redirecting to Stripe…' : 'Upgrade to Premium — $4.99/mo'}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
