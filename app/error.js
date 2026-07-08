'use client'

import Image from 'next/image'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 text-center">
      <Image src="/logo-mark.png" alt="PickSniff" width={64} height={64} priority />
      <h1 className="mt-6 text-4xl font-black tracking-tight text-black">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-base text-slate">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex rounded-xl bg-green-accent px-8 py-3 text-sm font-black text-black transition hover:brightness-95"
      >
        Try again
      </button>
    </main>
  )
}
