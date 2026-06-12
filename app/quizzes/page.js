import Link from 'next/link'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Quizzes — PickSniff',
  description: 'Find your perfect fragrance through one of our guided quizzes. Signature scent, personality, seasonal, astrology, and gift quizzes.',
}

const QUIZZES = [
  {
    href: '/quiz',
    icon: '👃',
    eyebrow: 'Most Popular',
    title: 'Signature Scent Quiz',
    description: 'Answer 4 questions — gender, budget, vibe, and accords — and get matched to your signature scent from 750 fragrances.',
    cta: 'Find My Signature Scent',
    accent: true,
    steps: '4 steps · ~1 min',
  },
  {
    href: '/quiz/personality',
    icon: '✨',
    eyebrow: 'Personality',
    title: 'Personality Quiz',
    description: 'Pick a vibe, a place, a time of day. Discover your fragrance archetype — The Dark Romantic, The Fresh Minimalist, and more.',
    cta: 'Find My Archetype',
    accent: false,
    steps: '4 steps · ~1 min',
  },
  {
    href: '/quiz/mood',
    icon: '🎭',
    eyebrow: 'Mood',
    title: 'Mood Quiz',
    description: 'Three questions about your energy, headspace, and what you need today. Get a scent matched to this exact moment.',
    cta: 'Match My Mood',
    accent: false,
    steps: '4 steps · ~1 min',
  },
  {
    href: '/quiz/seasonal',
    icon: '🌸',
    eyebrow: 'Seasonal',
    title: 'Seasonal Quiz',
    description: 'Find fragrances tuned to the current season. Summer calls for aquatics and citrus. Winter wants amber and spice.',
    cta: 'Find a Seasonal Scent',
    accent: false,
    steps: '3–4 steps · ~1 min',
  },
  {
    href: '/quiz/astrology',
    icon: '⭐',
    eyebrow: 'Astrology',
    title: 'Astrology Quiz',
    description: 'Your zodiac sign reveals your fragrance soul. From Aries fire to Pisces dreams — find the scent written in your stars.',
    cta: 'Find My Star Scent',
    accent: false,
    steps: '2 steps · 30 sec',
  },
  {
    href: '/quiz/gift',
    icon: '🎁',
    eyebrow: 'Gift Finder',
    title: 'Gift Quiz',
    description: 'Shopping for someone else? Answer a few questions about them and we\'ll find a fragrance they\'ll actually love.',
    cta: 'Find a Gift',
    accent: false,
    steps: '4–5 steps · ~1 min',
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

function QuizCard({ href, icon, eyebrow, title, description, cta, accent, steps }) {
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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-accent text-2xl">
          {icon}
        </div>
        {accent && (
          <span className="rounded-full bg-green-accent px-3 py-1 text-xs font-black text-black">
            Most Popular
          </span>
        )}
      </div>

      <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-green-accent">
        {eyebrow}
      </p>
      <h2 className="text-xl font-black leading-tight text-black group-hover:text-green-accent transition">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400">{steps}</span>
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
