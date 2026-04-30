import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'About — PickSniff',
  description: 'Learn about PickSniff, the fragrance matchmaking app.',
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-black">About PickSniff</h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600">
          <p>
            PickSniff is the fragrance matchmaking app — built for people who love the idea of wearing
            a great fragrance but have no idea where to start.
          </p>
          <p>
            We built a quiz that asks you 4 simple questions and matches you to the perfect scent from
            our hand-curated library of 750 fragrances across every style, gender, and budget. No
            jargon. No overwhelming lists. Just your perfect match.
          </p>
          <p>
            PickSniff is independently owned and not affiliated with any retailer. We earn a small
            commission if you buy through our links — at no extra cost to you. This keeps the app free
            and lets us keep adding fragrances.
          </p>
          <p>
            Built with love by Joseph, a fragrance obsessive who got tired of googling "best cologne
            for men" and getting 47 different answers.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
