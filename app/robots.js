export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/profile'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
