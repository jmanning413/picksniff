import { z } from 'zod'

// Lightweight client-error beacon: app/error.js posts here so production
// client crashes show up in Vercel logs instead of vanishing in user consoles.
const schema = z.object({
  message: z.string().max(500),
  stack: z.string().max(2000).optional(),
  url: z.string().max(300).optional(),
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (parsed.success) {
      console.error('[client-error]', JSON.stringify(parsed.data))
    }
  } catch {
    // never let the beacon itself error
  }
  return new Response(null, { status: 204 })
}
