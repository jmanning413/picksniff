import Link from 'next/link'

const LINKS = [
  ['/about', 'About'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms of Service'],
  ['/contact', 'Contact'],
  ['/accords', 'Accords'],
  ['/trending', 'Trending'],
  ['/support', 'Support Us'],
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <span className="text-lg font-black">
            Pick<span className="text-green-accent">Sniff</span>
          </span>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-bold text-zinc-400 transition hover:text-cream">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} PickSniff. All rights reserved.</p>
          <Link href="/unsubscribe" className="text-xs text-zinc-500 transition hover:text-zinc-300">
            Unsubscribe from emails
          </Link>
        </div>
      </div>
    </footer>
  )
}
