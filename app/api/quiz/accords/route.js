import { getAvailableAccords } from '@/lib/matchFragrances'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const gender = searchParams.get('gender') || 'unisex'
  const tier = searchParams.get('tier') || 'quality'
  const vibe = searchParams.get('vibe') || 'daily'

  const accords = await getAvailableAccords(gender, tier, vibe)
  return Response.json({ accords })
}
