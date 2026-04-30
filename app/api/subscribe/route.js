import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const supabase = getAdminClient()
  if (!supabase) {
    return Response.json({ error: 'Service unavailable.' }, { status: 503 })
  }

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: result.data.email })

  if (error) {
    if (error.code === '23505') {
      // already subscribed — treat as success so we don't leak info
      return Response.json({ ok: true })
    }
    console.error('[subscribe]', error)
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
