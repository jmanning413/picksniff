import { createClient } from '@/lib/supabase/server'
import { getSiteUrl, getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST() {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    return Response.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'You must be signed in to upgrade.' }, { status: 401 })
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, username')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id, username: profile?.username ?? '' },
      })
      customerId = customer.id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)

      if (updateError) throw updateError
    }

    const siteUrl = getSiteUrl()
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${siteUrl}/profile?upgraded=1`,
      cancel_url: `${siteUrl}/premium`,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return Response.json({ error: 'Could not create checkout session.' }, { status: 500 })
  }
}
