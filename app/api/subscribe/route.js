import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { getResend, FROM } from '@/lib/resend'
import { welcomeEmail } from '@/lib/emails/welcome'

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

  const { email } = result.data
  const supabase = getAdminClient()
  if (!supabase) return Response.json({ error: 'Service unavailable.' }, { status: 503 })

  const { data: row, error } = await supabase
    .from('subscribers')
    .insert({ email })
    .select('token')
    .single()

  if (error) {
    if (error.code === '23505') return Response.json({ ok: true })
    console.error('[subscribe]', error)
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }

  const resend = getResend()
  if (resend && row?.token) {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'
    const { subject, html } = welcomeEmail(`${base}/unsubscribe?token=${row.token}`)
    resend.emails.send({ from: FROM, to: email, subject, html }).catch((err) => {
      console.error('[subscribe/welcome-email]', err)
    })
  }

  return Response.json({ ok: true })
}
