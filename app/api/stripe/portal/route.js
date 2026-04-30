import { createClient } from '@/lib/supabase/server'
import { getSiteUrl, getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST() {
  const stripe = getStripe()
  if (!stripe) {
    return Response.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'You must be signed in.' }, { status: 401 })
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return Response.json({ error: 'No subscription found.' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${getSiteUrl()}/profile`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/portal]', err)
    return Response.json({ error: 'Could not open billing portal.' }, { status: 500 })
  }
}
