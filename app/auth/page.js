'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { signIn, signUp } from './actions'

export default function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [signInState, signInAction, signInPending] = useActionState(signIn, null)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, null)

  const isSignIn = mode === 'signin'
  const error = isSignIn ? signInState?.error : signUpState?.error
  const pending = isSignIn ? signInPending : signUpPending
  const action = isSignIn ? signInAction : signUpAction

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-100 px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold" aria-label="PickSniff home">
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          <span>
            Pick<span className="text-green-accent">Sniff</span>
          </span>
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-black">
            {isSignIn ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mb-8 text-sm text-zinc-500">
            {isSignIn
              ? 'Sign in to access your profile and saved fragrances.'
              : 'Save quiz results, build a wishlist, track your collection.'}
          </p>

          <div className="mb-6 flex rounded-full border border-zinc-200 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${
                isSignIn ? 'bg-green-accent text-black' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${
                !isSignIn ? 'bg-green-accent text-black' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form action={action} className="space-y-4">
            {!isSignIn && (
              <Field label="Username" name="username" type="text" placeholder="yourname" autoComplete="username" />
            )}
            <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
            />

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-full bg-green-accent py-3.5 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50"
            >
              {pending ? 'Please wait…' : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-400">
            No account required to take the quiz.{' '}
            <Link href="/quiz" className="font-bold text-zinc-600 hover:text-black">
              Try it now →
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({ label, name, type, placeholder, autoComplete }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-green-accent"
      />
    </div>
  )
}
