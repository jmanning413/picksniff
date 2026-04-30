import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import TipButton from './_components/TipButton'

export const metadata = {
  title: 'Support PickSniff',
  description: 'PickSniff is free for everyone. If you love it, a small tip keeps the lights on.',
}

export default function SupportPage({ searchParams }) {
  const thanked = searchParams?.thanks === '1'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-sm text-center">
          {thanked ? (
            <>
              <p className="text-5xl">💚</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-black">Thank you!</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Your tip means a lot and helps keep PickSniff free for everyone.
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-accent">
                Support PickSniff
              </p>
              <h1 className="text-3xl font-black tracking-tight text-black">
                Keep the sniffs coming
              </h1>
              <p className="mt-3 mb-8 text-sm leading-6 text-zinc-500">
                PickSniff is 100% free — no subscriptions, no ads.
                If it helped you find a fragrance you love, a small tip keeps the lights on.
              </p>
              <TipButton />
              <p className="mt-6 text-xs text-zinc-400">
                One-time payment · Processed securely by Stripe
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
