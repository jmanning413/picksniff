'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function HomepageClient() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      // Store email capture — integrate Resend/Mailchimp here when ready
      await new Promise((r) => setTimeout(r, 400))
      setSubmitted(true)
      toast.success('You\'re on the list!')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-accent/30 bg-green-accent/10 px-6 py-4 text-sm font-bold text-green-accent">
        You&apos;re on the list — first pick drops next week.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border border-zinc-200 px-5 py-3 text-sm outline-none transition focus:border-green-accent"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-green-accent px-6 py-3 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}
