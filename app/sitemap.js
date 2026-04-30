import { loadAllFragrances } from '@/lib/fragrances'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'

  const staticRoutes = [
    '', '/quiz', '/quiz/personality', '/encyclopedia', '/accords', '/trending',
    '/seasonal', '/notes', '/about', '/privacy', '/terms', '/contact',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  let fragranceRoutes = []
  let brandRoutes = []
  try {
    const fragrances = await loadAllFragrances()
    fragranceRoutes = fragrances.map((f) => ({
      url: `${base}/fragrance/${f.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    }))
    const brands = [...new Set(fragrances.map((f) => f.brand))]
    brandRoutes = brands.map((b) => ({
      url: `${base}/brand/${encodeURIComponent(b)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  } catch {
    // non-fatal
  }

  return [...staticRoutes, ...fragranceRoutes, ...brandRoutes]
}
