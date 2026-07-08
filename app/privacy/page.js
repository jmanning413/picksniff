import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Privacy Policy | PickSniff',
  description: 'PickSniff privacy policy.',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-black">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-400">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 text-base leading-7 text-slate">
          <section>
            <h2 className="mb-2 text-lg font-black text-black">What we collect</h2>
            <p>
              When you create an account, we collect your email address and username. When you take
              the quiz, we store your quiz preferences if you choose to save them. PickSniff is free
              to use and we never charge you for anything. If you choose to make an optional
              donation, payment details go directly to Stripe and are never stored by us.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">How we use it</h2>
            <p>
              Your data is used solely to power the PickSniff experience: saving your quiz history,
              wishlist, and owned fragrances. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Cookies</h2>
            <p>
              We use cookies only for authentication (Supabase session). We do not use tracking
              cookies or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Third-party services</h2>
            <p>
              We use Supabase (database), Stripe (optional donations only), and optionally Google
              Analytics (anonymous usage data). Each has its own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Your rights</h2>
            <p>
              You can request account and data deletion at any time by contacting us, and we will
              honor the request promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Contact</h2>
            <p>Questions? Email us via the <a href="/contact" className="font-bold text-black underline">Contact page</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
