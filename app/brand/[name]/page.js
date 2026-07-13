import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadAllFragrances } from '@/lib/fragrances'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'
import { buildRetailerLinks } from '@/app/_components/BuyButtons'

export async function generateMetadata({ params }) {
  const { name } = await params
  const brand = decodeURIComponent(name)
  return {
    title: `${brand} Fragrances`,
    description: `Explore all ${brand} fragrances in the PickSniff library. Find your perfect match.`,
  }
}

export async function generateStaticParams() {
  const all = await loadAllFragrances()
  const brands = [...new Set(all.map((f) => f.brand))]
  return brands.map((b) => ({ name: encodeURIComponent(b) }))
}



export default async function BrandPage({ params }) {
  const { name } = await params
  const brand = decodeURIComponent(name)
  const all = await loadAllFragrances()
  const fragrances = all.filter((f) => f.brand === brand)

  if (fragrances.length === 0) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-cream text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
          <Link href="/encyclopedia" className="mb-6 inline-flex items-center text-sm font-bold text-slate transition hover:text-black">
            ← Encyclopedia
          </Link>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-accent">
              <span className="text-2xl font-black text-black">{brand.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{brand}</h1>
              <p className="mt-1 text-sm text-slate">{fragrances.length} fragrance{fragrances.length !== 1 ? 's' : ''} in the PickSniff library</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {fragrances.map((f) => {
              const links = buildRetailerLinks(f)
              return (
                <div key={f.id} className="rounded-lg border border-sand bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/fragrance/${f.id}`} className="text-lg font-black text-black transition hover:text-green-deep">
                        {f.name}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {f.concentration && <Tag>{f.concentration}</Tag>}
                        <Tag>{f.tier}</Tag>
                        <Tag>{f.vibe?.replace('_', ' ')}</Tag>
                      </div>
                    </div>
                  </div>

                  {(f.accords || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {f.accords.map((a) => (
                        <span key={a} className="rounded-full bg-green-accent/15 px-2 py-0.5 text-xs font-bold text-zinc-700">{a}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {links.override ? (
                      <a href={links.override.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-green-accent py-2 text-xs font-black text-black transition hover:brightness-95">
                        {links.override.label} →
                      </a>
                    ) : (
                      <>
                        <a href={links.sephora}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-green-accent py-2 text-xs font-black text-black transition hover:brightness-95">
                          Shop at Sephora →
                        </a>
                        <a href={links.jomashop}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center rounded-xl border border-sand bg-white py-2 text-xs font-bold text-black transition hover:border-green-accent">
                          Shop at Jomashop
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-sand bg-zinc-50 px-2 py-0.5 text-xs font-bold capitalize text-slate">
      {children}
    </span>
  )
}
