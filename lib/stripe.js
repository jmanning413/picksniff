import Stripe from 'stripe'

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing'])

let stripe

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripe
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function getStripeObjectId(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.id || null
}

export function getInvoiceSubscriptionId(invoice) {
  return getStripeObjectId(
    invoice.parent?.subscription_details?.subscription || invoice.subscription,
  )
}

export function getSubscriptionPeriodEnd(subscription) {
  const periodEnds = subscription.items?.data
    ?.map((item) => item.current_period_end)
    .filter((periodEnd) => Number.isFinite(periodEnd))

  if (!periodEnds?.length) return null
  return new Date(Math.max(...periodEnds) * 1000).toISOString()
}

export function isPremiumSubscription(subscription) {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)
}
