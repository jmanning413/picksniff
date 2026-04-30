import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'Contact — PickSniff',
  description: 'Get in touch with the PickSniff team.',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-black">Contact</h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600">
          <p>
            Have a question, found a bug, or want to suggest a fragrance? We'd love to hear from you.
          </p>

          <div className="rounded-xl border border-zinc-200 p-6">
            <h2 className="mb-1 font-black text-black">Email</h2>
            <p className="text-zinc-500">
              Reach us at{' '}
              <a
                href="mailto:hello@picksniff.com"
                className="font-bold text-black underline underline-offset-2 hover:text-green-accent"
              >
                hello@picksniff.com
              </a>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-6">
            <h2 className="mb-1 font-black text-black">Response time</h2>
            <p className="text-zinc-500">We aim to reply within 48 hours on business days.</p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-6">
            <h2 className="mb-1 font-black text-black">Suggest a fragrance</h2>
            <p className="text-zinc-500">
              Think we're missing a gem from our 750-fragrance library? Tell us the name, brand, and
              why it belongs — we review all suggestions.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
