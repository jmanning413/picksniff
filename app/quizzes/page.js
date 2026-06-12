import Link from 'next/link'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Quizzes — PickSniff',
  description: 'Find your perfect fragrance through one of our guided quizzes. Signature scent, personality, seasonal, astrology, and gift quizzes.',
}

function IconPerfume() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="14" width="16" height="14" rx="3" />
      <path d="M12 14V10H20V14" />
      <rect x="13" y="6" width="6" height="4" rx="1.5" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4 L19 12 L28 12 L21 18 L24 27 L16 22 L8 27 L11 18 L4 12 L13 12 Z" />
    </svg>
  )
}

function IconMood() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" />
      <circle cx="12" cy="14" r="1" fill="#1A1A1A" stroke="none" />
      <circle cx="20" cy="14" r="1" fill="#1A1A1A" stroke="none" />
      <path d="M11.5 19.5 Q16 24 20.5 19.5" />
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4 C22 8 25 14 22 20 C19 24 17 26 16 27 C15 26 13 24 10 20 C7 14 10 8 16 4 Z" />
      <line x1="16" y1="4" x2="16" y2="27" />
    </svg>
  )
}

function IconZodiac() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="5" />
      <path d="M16 4 L16 11 M22 5.6 L18.5 11.7 M26.4 10 L20.3 13.5 M28 16 L21 16 M26.4 22 L20.3 18.5 M22 26.4 L18.5 20.3 M16 28 L16 21 M9.6 26.4 L13.5 20.3 M5.6 22 L11.7 18.5 M4 16 L11 16 M5.6 10 L11.7 13.5 M9.6 5.6 L13.5 11.7" />
    </svg>
  )
}

function IconGift() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#1A1A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="17" width="20" height="11" rx="1.5" />
      <rect x="5" y="12" width="22" height="5" rx="1.5" />
      <line x1="16" y1="12" x2="16" y2="28" />
      <path d="M16 12 C14 7 6 8 9 12 C11 14 15 13 16 12" />
      <path d="M16 12 C18 7 26 8 23 12 C21 14 17 13 16 12" />
    </svg>
  )
}

const QUIZZES = [
  {
    href: '/quiz',
    icon: <IconPerfume />,
    title: 'Signature Scent Quiz',
    description: 'Answer 4 questions — gender, budget, vibe, and accords — and get matched to your signature scent from 750 fragrances.',
    cta: 'Find My Signature Scent',
    accent: true,
  },
  {
    href: '/quiz/personality',
    icon: <IconStar />,
    title: 'Personality Quiz',
    description: 'Pick a vibe, a place, a time of day. Discover your fragrance archetype — The Dark Romantic, The Fresh Minimalist, and more.',
    cta: 'Find My Archetype',
    accent: false,
  },
  {
    href: '/quiz/mood',
    icon: <IconMood />,
    title: 'Mood Quiz',
    description: 'Three questions about your energy, headspace, and what you need today. Get a scent matched to this exact moment.',
    cta: 'Match My Mood',
    accent: false,
  },
  {
    href: '/quiz/seasonal',
    icon: <IconLeaf />,
    title: 'Seasonal Quiz',
    description: 'Find fragrances tuned to the current season. Summer calls for aquatics and citrus. Winter wants amber and spice.',
    cta: 'Find a Seasonal Scent',
    accent: false,
  },
  {
    href: '/quiz/astrology',
    icon: <IconZodiac />,
    title: 'Astrology Quiz',
    description: 'Your zodiac sign reveals your fragrance soul. From Aries fire to Pisces dreams — find the scent written in your stars.',
    cta: 'Find My Star Scent',
    accent: false,
  },
  {
    href: '/quiz/gift',
    icon: <IconGift />,
    title: 'Gift Quiz',
    description: 'Shopping for someone else? Answer a few questions about them and we\'ll find a fragrance they\'ll actually love.',
    cta: 'Find a Gift',
    accent: false,
  },
]

export default function QuizzesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-14 sm:px-8">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">
            All Quizzes
          </p>
          <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
            Find your scent,<br className="hidden sm:block" /> your way.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500">
            Six different ways to discover your perfect fragrance. Each quiz takes under two minutes.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {QUIZZES.map((quiz) => (
              <QuizCard key={quiz.href} {...quiz} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function QuizCard({ href, icon, title, description, cta, accent }) {
  return (
    <Link
      href={href}
      className={[
        'group flex flex-col rounded-2xl border p-6 transition hover:shadow-md',
        accent
          ? 'border-green-accent bg-green-accent/5 hover:bg-green-accent/10'
          : 'border-zinc-200 bg-white hover:border-green-accent',
      ].join(' ')}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-accent">
          {icon}
        </div>
        {accent && (
          <span className="rounded-full bg-green-accent px-3 py-1 text-xs font-black text-black">
            Most Popular
          </span>
        )}
      </div>

      <h2 className="text-xl font-black leading-tight text-black group-hover:text-green-accent transition">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">
        {description}
      </p>

      <div className="mt-5 flex justify-end">
        <span className={[
          'rounded-full px-4 py-2 text-sm font-black transition',
          accent
            ? 'bg-green-accent text-black group-hover:brightness-95'
            : 'border border-zinc-200 text-zinc-700 group-hover:border-green-accent group-hover:text-black',
        ].join(' ')}>
          {cta} →
        </span>
      </div>
    </Link>
  )
}
