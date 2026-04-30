import { z } from 'zod'
import { headers } from 'next/headers'
import { matchFragrances } from '@/lib/matchFragrances'
import { checkRateLimit } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'

const VALID_GENDERS = ['male', 'female', 'unisex']
const VALID_TIERS = ['budget', 'quality', 'niche']
const VALID_VIBES = ['daily', 'date_night', 'sport', 'chill', 'formal']
const VALID_ACCORDS = [
  'Citrus', 'Floral', 'Woody', 'Vanilla', 'Amber',
  'Spicy', 'Fresh', 'Aromatic', 'Fruity', 'Aquatic', 'Green',
]
const VALID_CONCENTRATIONS = ['EDT', 'EDP', 'Parfum', 'Cologne']

const quizSchema = z.object({
  genders: z.array(z.enum(VALID_GENDERS)).min(1).max(3),
  tier: z.enum(VALID_TIERS),
  vibe: z.enum(VALID_VIBES),
  accords: z.array(z.enum(VALID_ACCORDS)).max(3).default([]),
  concentrations: z.array(z.enum(VALID_CONCENTRATIONS)).max(4).default([]),
  notes: z.array(z.string().max(50)).max(5).default([]),
})

export async function POST(request) {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'anonymous'

  const { success: rateLimitOk } = await checkRateLimit(ip)
  if (!rateLimitOk) {
    return Response.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = quizSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 422 },
    )
  }

  const { genders, tier, vibe, accords, concentrations, notes } = parsed.data

  let isLoggedIn = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
  } catch {
    // non-fatal — default to guest limit
  }

  const limit = isLoggedIn ? 20 : 10
  const fragrances = await matchFragrances({ genders, tier, vibe, accords, concentrations, notes, limit })

  return Response.json({ fragrances, isLoggedIn })
}
