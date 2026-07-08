import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// All limiters no-op (allow) when Upstash env vars are absent (local dev).
function makeLimiter(prefix, tokens, window) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `picksniff:${prefix}`,
  })
}

const quizLimiter = makeLimiter('quiz', 10, '1 m')
const subscribeLimiter = makeLimiter('subscribe', 5, '1 m')
const authLimiter = makeLimiter('auth', 5, '1 m')
const resultsLimiter = makeLimiter('results', 30, '1 m')

async function check(limiter, ip) {
  if (!limiter) return { success: true }
  return limiter.limit(ip || 'anonymous')
}

export const checkRateLimit = (ip) => check(quizLimiter, ip)
export const checkSubscribeLimit = (ip) => check(subscribeLimiter, ip)
export const checkAuthLimit = (ip) => check(authLimiter, ip)
export const checkResultsLimit = (ip) => check(resultsLimiter, ip)

export function ipFromHeaders(headersList) {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'anonymous'
  )
}
