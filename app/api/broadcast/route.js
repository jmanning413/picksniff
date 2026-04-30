import { createClient } from '@supabase/supabase-js'
import { getResend, FROM } from '@/lib/resend'
import { z } from 'zod'

const schema = z.object({
  secret: z.string(),
  subject: z.string().min(1),
  html: z.string().min(1),
})

function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// POST /api/broadcast  { secret, subject, html }
// Sends to all subscribers in batches of 50.
// Protected by BROADCAST_SECRET env var.
export async function POST(request) {
  let body
  try { body = await request.json() } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: 'Missing subject, html, or secret.' }, { status: 400 })
  }

  if (result.data.secret !== process.env.BROADCAST_SECRET) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const resend = getResend()
  if (!resend) {
    return Response.json({ error: 'Resend not configured.' }, { status: 503 })
  }

  const supabase = getAdminClient()
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured.' }, { status: 503 })
  }

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email')

  if (error) {
    console.error('[broadcast] fetch subscribers', error)
    return Response.json({ error: 'Could not fetch subscribers.' }, { status: 500 })
  }

  const emails = subscribers.map((s) => s.email)
  const BATCH = 50
  let sent = 0

  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH)
    await Promise.all(
      batch.map((to) =>
        resend.emails.send({
          from: FROM,
          to,
          subject: result.data.subject,
          html: result.data.html,
        }).catch((err) => console.error('[broadcast] send to', to, err)),
      ),
    )
    sent += batch.length
  }

  return Response.json({ ok: true, sent })
}
