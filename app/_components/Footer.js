import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-5 py-8 text-center sm:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/about" className="text-sm text-zinc-400 transition hover:text-black">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-zinc-400 transition hover:text-black">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-zinc-400 transition hover:text-black">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-zinc-400 transition hover:text-black">
            Contact
          </Link>
          <Link href="/accords" className="text-sm text-zinc-400 transition hover:text-black">
            Accords
          </Link>
          <Link href="/trending" className="text-sm text-zinc-400 transition hover:text-black">
            Trending
          </Link>
        </nav>
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} PickSniff. All rights reserved.</p>
      </div>
    </footer>
  )
}
