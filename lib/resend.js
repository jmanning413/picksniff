import { Resend } from 'resend'

let client

export function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}

export const FROM = 'PickSniff <hello@picksniff.com>'
