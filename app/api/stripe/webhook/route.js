import { createClient } from '@supabase/supabase-js'
import {
  getInvoiceSubscriptionId,
  getStripe,
  getStripeObjectId,
  getSubscriptionPeriodEnd,
  isPremiumSubscription,
} from '@/lib/stripe'

export const runtime = 'nodejs'

function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

async function syncSubscriptionToProfile({ supabase, subscription, userId }) {
  const customerId = getStripeObjectId(subscription.customer)
  const resolvedUserId = userId || subscription.metadata?.supabase_user_id

  const updates = {
    is_premium: isPremiumSubscription(subscription),
    premium_expires_at: getSubscriptionPeriodEnd(subscription),
    stripe_customer_id: customerId,
  }

  let query = supabase.from('profiles').update(updates)

  if (resolvedUserId) {
    query = query.eq('id', resolvedUserId)
  } else if (customerId) {
    query = query.eq('stripe_customer_id', customerId)
  } else {
    return
  }

  const { error } = await query
  if (error) throw error
}

async function syncInvoiceSubscription({ stripe, supabase, invoice }) {
  const subscriptionId = getInvoiceSubscriptionId(invoice)
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  await syncSubscriptionToProfile({
    supabase,
    subscription,
    userId: invoice.parent?.subscription_details?.metadata?.supabase_user_id,
  })
}

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

  const supabase = getAdminClient()
  if (!supabase) {
    return new Response('Supabase admin client not configured.', { status: 503 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscriptionId = getStripeObjectId(session.subscription)
        const userId = session.metadata?.supabase_user_id || session.client_reference_id
        const customerId = getStripeObjectId(session.customer)

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          await syncSubscriptionToProfile({ supabase, subscription, userId })
        } else if (userId && customerId) {
          const { error } = await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId)

          if (error) throw error
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await syncSubscriptionToProfile({
          supabase,
          subscription: event.data.object,
        })
        break
      }

      case 'invoice.payment_succeeded': {
        await syncInvoiceSubscription({ stripe, supabase, invoice: event.data.object })
        break
      }

      case 'invoice.payment_failed': {
        await syncInvoiceSubscription({ stripe, supabase, invoice: event.data.object })
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error', err)
    return new Response('Webhook handler error.', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}
