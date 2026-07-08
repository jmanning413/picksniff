import { createClient } from '@supabase/supabase-js'

// Health check (GAPS #17) + Supabase keep-alive. Hit daily by Vercel cron
// (vercel.json) so the free-tier Supabase project never pauses for inactivity
// (GAPS #0), and by uptime monitors to catch silent env loss.
export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    supabase: false,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && anon) {
      const supabase = createClient(url, anon)
      // Trivial query: verifies the project is up AND counts as activity
      const { error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
      checks.supabase = !error
    }
  } catch {
    // leave false
  }

  const ok = checks.supabase && checks.stripe && checks.resend
  return Response.json({ ok, ...checks }, { status: ok ? 200 : 503 })
}
