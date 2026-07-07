import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import HomepageClient from '@/app/_components/HomepageClient'
import { loadAllFragrances } from '@/lib/fragrances'

export const metadata = {
  title: 'PickSniff — Find Your Perfect Fragrance',
  description:
    'Answer 4 questions. Get matched to your perfect scent from 750 fragrances across every style and budget.',
}

function getSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'Spring'
  if (month >= 6 && month <= 8) return 'Summer'
  if (month >= 9 && month <= 11) return 'Autumn'
  return 'Winter'
}

function getFragranceOfDay(fragrances) {
  const day = Math.floor(Date.now() / 86400000)
  return fragrances[day % fragrances.length]
}

const QUIZ_STRIP = [
  { href: '/quiz', title: 'Signature Scent', hint: 'The classic 4-question match' },
  { href: '/quiz/personality', title: 'Personality', hint: 'What fragrance are you?' },
  { href: '/quiz/mood', title: 'Mood', hint: 'A scent for right now' },
  { href: '/quiz/seasonal', title: 'Seasonal', hint: 'Tuned to the weather' },
  { href: '/quiz/astrology', title: 'Astrology', hint: 'Written in your stars' },
  { href: '/quiz/gift', title: 'Gift', hint: 'Shopping for someone else?' },
]

export default async function Home() {
  const fragrances = await loadAllFragrances()
  const fotd = getFragranceOfDay(fragrances)
  const season = getSeason()

  // Sample trending: pick 5 spread from the list for now
  const trendingSnap = [
    fragrances[0], fragrances[12], fragrances[27], fragrances[41], fragrances[55],
  ].filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* ── Seasonal banner ── */}
        <div className="border-b border-sand bg-green-wash px-5 py-2 text-center text-xs font-black text-black tracking-wide">
          Best fragrances for {season} {new Date().getFullYear()} — <Link href="/seasonal" className="underline underline-offset-2">See the list</Link>
        </div>

        {/* ── Hero: start the quiz in one tap ── */}
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-16 pt-14 text-center sm:px-8 sm:pt-20">
          <Image src="/logo.svg" alt="PickSniff logo" width={72} height={72} priority />
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl">
            Find a fragrance you&apos;ll <span className="text-green-deep">actually love.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate">
            4 easy questions. 750 hand-picked scents. Zero fragrance knowledge needed.
          </p>

          <div className="mt-9 w-full max-w-lg rounded-2xl border border-sand bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
              Question 1 of 4
            </p>
            <p className="mt-1.5 text-xl font-black text-black">Who are you shopping for?</p>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { g: 'male', label: 'Male' },
                { g: 'female', label: 'Female' },
                { g: 'unisex', label: 'Unisex' },
              ].map(({ g, label }) => (
                <Link
                  key={g}
                  href={`/quiz?g=${g}`}
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border border-sand text-base font-black text-black transition hover:border-green-accent hover:bg-green-accent/10 active:bg-green-accent/20"
                >
                  {label}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-400">Tap one to start — takes about a minute.</p>
          </div>

          <Link
            href="/quizzes"
            className="mt-5 text-sm font-bold text-zinc-400 transition hover:text-black"
          >
            Or explore all 6 quizzes →
          </Link>
        </section>

        {/* ── How it works ── */}
        <section className="border-t border-sand bg-white/70 px-5 py-16 sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <p className="mb-2 text-center text-sm font-black uppercase tracking-[0.18em] text-green-deep">
              How it works
            </p>
            <h2 className="mb-10 text-center text-3xl font-black tracking-tight text-black sm:text-4xl">
              Three steps to your perfect scent
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <HowStep number="1" title="Answer 4 questions" description="Who it's for, your budget, the occasion, and what smells good to you — all in plain English." />
              <HowStep number="2" title="Get ranked matches" description="Every fragrance is scored against your answers and ranked with a match percentage — your best match first." />
              <HowStep number="3" title="Buy with one click" description="Every result links straight to Sephora and Jomashop so you can shop immediately." />
            </div>
          </div>
        </section>

        {/* ── Example result ── */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <p className="mb-2 text-center text-sm font-black uppercase tracking-[0.18em] text-green-deep">
              Example result
            </p>
            <h2 className="mb-10 text-center text-3xl font-black tracking-tight text-black sm:text-4xl">
              This is what you&apos;ll get
            </h2>
            <div className="mx-auto max-w-lg rounded-xl border border-sand bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-accent">
                  <span className="text-2xl font-black text-black">D</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">Dior</p>
                      <h3 className="mt-0.5 text-xl font-black text-black">Sauvage EDT</h3>
                      <p className="mt-0.5 text-sm font-bold text-slate">EDT</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-black text-green-deep">94%</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Match</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-[94%] rounded-full bg-green-accent" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Fresh', 'Aromatic', 'Citrus'].map((accord) => (
                  <span key={accord} className="rounded-full bg-green-accent/15 px-3 py-1 text-xs font-bold text-zinc-700">
                    {accord}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate">
                <span className="font-black text-black">Top notes: </span>Bergamot, Pepper, Lavender
              </p>
              <p className="mt-2 text-sm leading-6 text-slate">
                A fragrance with clean freshness, aromatic texture, and bright citrus lift.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <div className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-green-accent text-sm font-black text-black">
                  Sephora
                </div>
                <div className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-green-accent text-sm font-black text-black">
                  Jomashop
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Six ways in ── */}
        <section className="border-t border-sand bg-white/70 px-5 py-16 sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm font-black uppercase tracking-[0.18em] text-green-deep">Quizzes</p>
                <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">Six ways to find your scent</h2>
              </div>
              <Link href="/quizzes" className="hidden text-sm font-bold text-slate transition hover:text-black sm:block">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {QUIZ_STRIP.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="group rounded-xl border border-sand bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
                >
                  <p className="text-base font-black text-black group-hover:text-green-deep transition">{q.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate">{q.hint}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fragrance of the Day ── */}
        {fotd && (
          <section className="px-5 py-16 sm:px-8">
            <div className="mx-auto w-full max-w-4xl">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-deep">
                Fragrance of the Day
              </p>
              <h2 className="mb-8 text-3xl font-black tracking-tight text-black sm:text-4xl">
                Today&apos;s featured pick
              </h2>
              <Link
                href={`/fragrance/${fotd.id}`}
                className="group flex gap-5 rounded-xl border border-sand bg-white p-6 shadow-sm transition hover:border-green-accent hover:shadow-md sm:gap-8"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-accent">
                  <span className="text-3xl font-black text-black">{fotd.brand.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{fotd.brand}</p>
                  <h3 className="mt-1 text-xl font-black text-black group-hover:text-green-deep transition">{fotd.name}</h3>
                  {fotd.concentration && (
                    <p className="mt-1 text-sm font-bold text-slate">{fotd.concentration}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(fotd.accords || []).slice(0, 3).map((a) => (
                      <span key={a} className="rounded-full bg-green-accent/15 px-3 py-1 text-xs font-bold text-zinc-700">{a}</span>
                    ))}
                  </div>
                  {fotd.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate">{fotd.description}</p>
                  )}
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── Trending this week ── */}
        {trendingSnap.length > 0 && (
          <section className="border-t border-sand bg-white/70 px-5 py-16 sm:px-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-1 text-sm font-black uppercase tracking-[0.18em] text-green-deep">Trending</p>
                  <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">Popular this week</h2>
                </div>
                <Link href="/trending" className="text-sm font-bold text-slate transition hover:text-black">
                  See all →
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {trendingSnap.map((f) => (
                  <Link
                    key={f.id}
                    href={`/fragrance/${f.id}`}
                    className="group flex-none w-44 snap-start rounded-xl border border-sand bg-white p-4 transition hover:border-green-accent hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-accent">
                      <span className="text-lg font-black text-black">{f.brand.charAt(0)}</span>
                    </div>
                    <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{f.brand}</p>
                    <h3 className="mt-1 text-sm font-black leading-tight text-black group-hover:text-green-deep transition line-clamp-2">{f.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(f.accords || []).slice(0, 2).map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Social proof ── */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
            <div className="text-5xl font-black text-green-deep">750</div>
            <p className="text-xl font-black text-black">Fragrances across every style and budget</p>
            <p className="max-w-lg text-base leading-7 text-slate">
              From everyday budget picks to rare niche bottles — every fragrance hand-selected, scored,
              and categorised so you don&apos;t have to think.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {['Budget', 'Quality', 'Niche', 'Daily', 'Date Night', 'Sport', 'Chill', 'Formal'].map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-bold text-slate">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/quiz"
              className="mt-4 inline-flex min-h-14 items-center rounded-xl bg-green-accent px-10 text-lg font-black text-black transition hover:brightness-95"
            >
              Find My Scent
            </Link>
          </div>
        </section>

        {/* ── Email capture ── */}
        <section className="border-t border-sand bg-white/70 px-5 py-16 sm:px-8">
          <div className="mx-auto w-full max-w-md text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-deep">Weekly Picks</p>
            <h2 className="mb-3 text-2xl font-black text-black">Get weekly fragrance picks</h2>
            <p className="mb-6 text-sm leading-6 text-slate">
              One fragrance tip, one trending pick, delivered every week. No spam.
            </p>
            <HomepageClient />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function HowStep({ number, title, description }) {
  return (
    <div className="rounded-xl border border-sand bg-white p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-wash">
        <span className="text-base font-black text-green-deep">{number}</span>
      </div>
      <h3 className="mb-2 text-lg font-black text-black">{title}</h3>
      <p className="text-sm leading-6 text-slate">{description}</p>
    </div>
  )
}
