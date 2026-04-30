'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleWishlist(fragranceId) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not signed in' }

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('fragrance_id', fragranceId)
    .maybeSingle()

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id)
    revalidatePath('/profile')
    return { wishlisted: false }
  }

  await supabase.from('wishlist').insert({ user_id: user.id, fragrance_id: fragranceId })
  revalidatePath('/profile')
  return { wishlisted: true }
}

export async function toggleOwned(fragranceId) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not signed in' }

  const { data: existing } = await supabase
    .from('owned')
    .select('id')
    .eq('user_id', user.id)
    .eq('fragrance_id', fragranceId)
    .maybeSingle()

  if (existing) {
    await supabase.from('owned').delete().eq('id', existing.id)
    revalidatePath('/profile')
    return { owned: false }
  }

  await supabase.from('owned').insert({ user_id: user.id, fragrance_id: fragranceId })
  revalidatePath('/profile')
  return { owned: true }
}

export async function saveQuizResult({ genders, tier, vibe, accords }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not signed in' }

  await supabase.from('quiz_results').insert({
    user_id: user.id,
    genders,
    tier,
    vibe,
    accords: accords ?? [],
  })

  revalidatePath('/profile')
  return { saved: true }
}
