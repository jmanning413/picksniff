'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'
import { checkAuthLimit, ipFromHeaders } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getResend, FROM } from '@/lib/resend'
import { welcomeEmail } from '@/lib/emails/welcome'

function getAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signIn(prevState, formData) {
  const { success: withinLimit } = await checkAuthLimit(ipFromHeaders(await headers()))
  if (!withinLimit) return { error: 'Too many attempts. Please wait a minute and try again.' }

  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: 'Incorrect email or password.' }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signUp(prevState, formData) {
  const { success: withinLimit } = await checkAuthLimit(ipFromHeaders(await headers()))
  if (!withinLimit) return { error: 'Too many attempts. Please wait a minute and try again.' }

  const parsed = signUpSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .maybeSingle()

  if (existing) return { error: 'That username is already taken.' }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { error: 'Could not create account. Try a different email.' }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: parsed.data.username,
    })
    if (profileError) {
      // Don't strand an account without a profile (GAPS #9)
      await supabase.auth.signOut()
      return { error: 'That username may have just been taken. Please try a different one.' }
    }

    // Auto-enroll in newsletter — only send welcome email if not already subscribed
    const admin = getAdmin()
    if (admin) {
      const { data: subRow, error: subError } = await admin
        .from('subscribers')
        .insert({ email: parsed.data.email })
        .select('token')
        .single()
      const isNewSubscriber = !subError
      if (isNewSubscriber && subRow?.token) {
        const resend = getResend()
        if (resend) {
          const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picksniff.com'
          const { subject, html } = welcomeEmail(`${base}/unsubscribe?token=${subRow.token}`)
          resend.emails.send({ from: FROM, to: parsed.data.email, subject, html }).catch(() => {})
        }
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
