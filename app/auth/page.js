'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { signIn, signUp } from './actions'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.1 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29V6.6H1.28a12 12 0 0 0 0 10.78l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77z" />
    </svg>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [oauthPending, setOauthPending] = useState('')
  const [signInState, signInAction, signInPending] = useActionState(signIn, null)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, null)

  const isSignIn = mode === 'signin'
  const error = isSignIn ? signInState?.error : signUpState?.error
  const pending = isSignIn ? signInPending : signUpPending
  const action = isSignIn ? signInAction : signUpAction

  // Surface OAuth callback failures (redirected back with ?error=oauth)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'oauth') {
      toast.error('Sign-in was cancelled or failed. Please try again.')
      window.history.replaceState(null, '', '/auth')
    }
  }, [])

  async function oauthSignIn(provider) {
    setOauthPending(provider)
    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (oauthError) {
        toast.error('Google sign-in is not available right now.')
        setOauthPending('')
      }
      // on success the browser navigates away to the provider
    } catch {
      toast.error('Something went wrong. Please try again.')
      setOauthPending('')
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-sand px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold" aria-label="PickSniff home">
          <Image src="/logo-mark.png" alt="" width={48} height={48} priority />
          <span className="text-2xl font-black tracking-tight">
            Pick<span className="text-green-accent">Sniff</span>
          </span>
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-black">
            {isSignIn ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mb-8 text-sm text-slate">
            {isSignIn
              ? 'Sign in to access your profile and saved fragrances.'
              : 'Save quiz results, build a wishlist, track your collection.'}
          </p>

          <div className="mb-6 flex rounded-full border border-sand p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${
                isSignIn ? 'bg-green-accent text-black' : 'text-slate hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${
                !isSignIn ? 'bg-green-accent text-black' : 'text-slate hover:text-black'
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

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => oauthSignIn('google')}
              disabled={oauthPending !== ''}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-sand bg-white py-3 text-sm font-bold text-black transition hover:border-green-accent disabled:opacity-50"
            >
              <GoogleIcon />
              {oauthPending === 'google' ? 'Redirecting…' : `${isSignIn ? 'Sign in' : 'Sign up'} with Google`}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-sand" />
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">or</span>
            <div className="h-px flex-1 bg-sand" />
          </div>

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
            <Link href="/quiz" className="font-bold text-slate hover:text-black">
              Try it now →
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({ label, name, type, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-lg border border-sand px-4 py-3 text-sm outline-none transition focus:border-green-accent pr-11"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-slate transition"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
