import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import CheckoutButton from './_components/CheckoutButton'
import ManageButton from './_components/ManageButton'

export const metadata = {
  title: 'Premium — PickSniff',
  description: 'Unlock advanced filters, 20 results, compare tool, and more with PickSniff Premium.',
}

const FREE_FEATURES = [
  '4-step quiz',
  '10 fragrance matches',
  'Full 750-fragrance encyclopedia',
  'Basic gender, tier, vibe filters',
  'Wishlist & owned collection',
  'Affiliate buy buttons',
]

const PREMIUM_FEATURES = [
  'Everything in Free',
  '20 fragrance matches (2× more)',
  'Concentration filter (EDT, EDP, Parfum)',
  'Notes filter (top 5 notes)',
  'Compare tool — side-by-side up to 3',
  'Advanced encyclopedia filters',
  '♛ Crown icon on profile',
  'Custom profile border color',
  'No sponsored placements',
]

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  let hasStripeCustomer = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, premium_expires_at, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profile?.is_premium) {
      const expired = profile.premium_expires_at && new Date(profile.premium_expires_at) < new Date()
      isPremium = !expired
    }
    hasStripeCustomer = !!profile?.stripe_customer_id
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 px-5 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">

          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">
              Premium
            </p>
            <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
              Upgrade your nose
            </h1>
            <p className="mt-4 text-lg text-zinc-500">
              More matches, smarter filters, and premium profile perks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-zinc-200 p-8">
              <p className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-zinc-400">Free</p>
              <p className="text-3xl font-black text-black">$0</p>
              <p className="mt-1 text-sm text-zinc-400">Forever free</p>

              <ul className="mt-6 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-600">
                    <span className="mt-0.5 text-zinc-300">✓</span> {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/quiz"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-zinc-200 py-3 text-sm font-black text-zinc-600 transition hover:border-green-accent hover:text-black"
              >
                Take the quiz
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border-2 border-green-accent p-8">
              <p className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-green-accent">
                ♛ Premium
              </p>
              <p className="text-3xl font-black text-black">$4.99</p>
              <p className="mt-1 text-sm text-zinc-400">per month · cancel any time</p>

              <ul className="mt-6 space-y-3">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-bold text-zinc-700">
                    <span className="mt-0.5 text-green-accent">✓</span> {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {!user ? (
                  <Link
                    href="/auth"
                    className="inline-flex w-full items-center justify-center rounded-full bg-green-accent py-3 text-sm font-black text-black transition hover:brightness-95"
                  >
                    Sign up to upgrade
                  </Link>
                ) : isPremium ? (
                  <div className="space-y-3">
                    <div className="rounded-full bg-green-accent/15 py-3 text-center text-sm font-black text-black">
                      ♛ You&apos;re Premium
                    </div>
                    {hasStripeCustomer && <ManageButton />}
                  </div>
                ) : (
                  <CheckoutButton />
                )}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-400">
            Payments processed securely by Stripe. Cancel any time — no questions asked.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
