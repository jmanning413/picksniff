import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Terms of Service — PickSniff',
  description: 'PickSniff terms of service.',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-black">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-400">Last updated: April 2026</p>

        <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600">
          <section>
            <h2 className="mb-2 text-lg font-black text-black">Using PickSniff</h2>
            <p>
              PickSniff is a fragrance recommendation service. By using this site you agree to use it
              lawfully and not attempt to abuse, scrape, or disrupt the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Accounts</h2>
            <p>
              You are responsible for maintaining the security of your account. PickSniff is not
              liable for any loss resulting from unauthorised access to your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Premium subscriptions</h2>
            <p>
              Premium is billed monthly at $4.99/month via Stripe. You can cancel at any time from
              your profile. No refunds are issued for partial months.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Affiliate links</h2>
            <p>
              PickSniff uses affiliate links. When you purchase through our links, we earn a small
              commission at no extra cost to you. Fragrance recommendations are never influenced by
              affiliate relationships.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Disclaimer</h2>
            <p>
              Fragrance is subjective. PickSniff provides recommendations based on your preferences
              but cannot guarantee you will love every match. We recommend sampling before buying a
              full bottle.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-black text-black">Changes</h2>
            <p>
              We may update these terms. Continued use of PickSniff after changes means you accept
              the updated terms.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
