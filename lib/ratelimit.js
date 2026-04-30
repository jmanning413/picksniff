import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let quizRatelimit = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  quizRatelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'picksniff:quiz',
  })
}

export async function checkRateLimit(ip) {
  if (!quizRatelimit) return { success: true }
  const identifier = ip || 'anonymous'
  return quizRatelimit.limit(identifier)
}
