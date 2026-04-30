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

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'

function addUnsubscribeFooter(html, token) {
  const unsubUrl = `${BASE}/unsubscribe?token=${token}`
  const footer = `
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:40px 0">
    <p style="font-size:12px;color:#a1a1aa;margin:0">
      You're receiving this because you signed up at picksniff.com. ·
      <a href="${unsubUrl}" style="color:#a1a1aa">Unsubscribe</a>
    </p>`
  return html.replace('</body>', `${footer}</body>`)
}

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
  if (!resend) return Response.json({ error: 'Resend not configured.' }, { status: 503 })

  const supabase = getAdminClient()
  if (!supabase) return Response.json({ error: 'Supabase not configured.' }, { status: 503 })

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email, token')

  if (error) {
    console.error('[broadcast] fetch subscribers', error)
    return Response.json({ error: 'Could not fetch subscribers.' }, { status: 500 })
  }

  const BATCH = 50
  let sent = 0

  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH)
    await Promise.all(
      batch.map(({ email, token }) =>
        resend.emails.send({
          from: FROM,
          to: email,
          subject: result.data.subject,
          html: addUnsubscribeFooter(result.data.html, token),
        }).catch((err) => console.error('[broadcast] send to', email, err)),
      ),
    )
    sent += batch.length
  }

  return Response.json({ ok: true, sent })
}
