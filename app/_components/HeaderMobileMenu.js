'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HeaderMobileMenu({ isLoggedIn, username }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-green-accent hover:text-black"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-x-0 top-[57px] z-40 border-b border-zinc-100 bg-white px-5 py-4 shadow-sm"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col gap-1">
            <Link href="/quiz" className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black">
              Quiz
            </Link>
            <Link href="/encyclopedia" className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black">
              Encyclopedia
            </Link>
            <Link href="/accords" className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black">
              Accords
            </Link>
            <Link href="/trending" className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black">
              Trending
            </Link>
            <div className="my-2 border-t border-zinc-100" />
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black"
              >
                {username ? `@${username}` : 'Profile'}
              </Link>
            ) : (
              <>
                <Link href="/auth" className="rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-black">
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="mt-1 inline-flex rounded-full bg-green-accent px-4 py-2.5 text-sm font-black text-black"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
