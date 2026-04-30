import Stripe from 'stripe'

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
