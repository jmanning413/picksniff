import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HeaderMobileMenu from './HeaderMobileMenu'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-black" aria-label="PickSniff home">
          <Image src="/logo.svg" alt="" width={32} height={32} priority />
          <span className="text-base">
            Pick<span className="text-green-accent">Sniff</span>
          </span>
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/quiz"
            className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-black"
          >
            Quiz
          </Link>
          <Link
            href="/encyclopedia"
            className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-black"
          >
            Encyclopedia
          </Link>
          <Link
            href="/accords"
            className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-black"
          >
            Accords
          </Link>
          <Link
            href="/trending"
            className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-black"
          >
            Trending
          </Link>
        </nav>

        {/* Right — desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-green-accent hover:text-black"
            >
              {profile?.username ? `@${profile.username}` : 'Profile'}
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:text-black"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="rounded-full bg-green-accent px-4 py-2 text-sm font-black text-black transition hover:brightness-95"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <HeaderMobileMenu
          isLoggedIn={!!user}
          username={profile?.username ?? null}
        />
      </div>
    </header>
  )
}
