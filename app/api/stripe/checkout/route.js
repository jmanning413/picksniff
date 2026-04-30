import { getSiteUrl, getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

const TIP_AMOUNTS = {
  '3': 300,
  '5': 500,
  '10': 1000,
}

export async function POST(request) {
  const stripe = getStripe()
  if (!stripe) {
    return Response.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
  }

  let amount = 500
  try {
    const body = await request.json()
    const cents = TIP_AMOUNTS[String(body.amount)]
    if (cents) amount = cents
  } catch {
    // use default $5
  }

  try {
    const siteUrl = getSiteUrl()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: 'Support PickSniff',
              description: 'A one-time tip to help keep PickSniff free.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/support?thanks=1`,
      cancel_url: `${siteUrl}/support`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return Response.json({ error: 'Could not create checkout session.' }, { status: 500 })
  }
}
