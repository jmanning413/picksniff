import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import QuizIcon from '@/app/_components/QuizIcons'
import TipButton from './_components/TipButton'

export const metadata = {
  title: 'Support PickSniff',
  description: 'PickSniff is free for everyone. If you love it, a small tip keeps the lights on.',
}

export default function SupportPage({ searchParams }) {
  const thanked = searchParams?.thanks === '1'

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-sm text-center">
          {thanked ? (
            <>
              <div className="flex justify-center text-green-deep"><QuizIcon name="heart" size={48} /></div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-black">Thank you!</h1>
              <p className="mt-3 text-sm leading-6 text-slate">
                Your tip means a lot and helps keep PickSniff free for everyone.
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-deep">
                Support PickSniff
              </p>
              <h1 className="text-3xl font-black tracking-tight text-black">
                Keep the sniffs coming
              </h1>
              <p className="mt-3 mb-8 text-sm leading-6 text-slate">
                PickSniff is 100% free. No subscriptions, no ads.
                If it helped you find a fragrance you love, a small tip keeps the lights on.
              </p>
              <TipButton />
              <p className="mt-6 text-xs text-slate">
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
