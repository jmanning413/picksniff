import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request) {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Stripe not configured.', { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err.message)
    return new Response('Webhook signature invalid.', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    console.log('[stripe/webhook] tip received:', event.data.object.amount_total)
  }

  return new Response('OK', { status: 200 })
}
