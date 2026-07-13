import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// OAuth callback (Google / Apple via Supabase). Exchanges the auth code for a
// session cookie, then lands the user on their profile. OAuth users have no
// username yet; /profile self-heals by creating a fallback profile (GAPS #9).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}/profile`)
      }
      console.error('[auth/callback]', error.message)
    } catch (err) {
      console.error('[auth/callback]', err)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=oauth`)
}
