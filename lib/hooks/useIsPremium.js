'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useIsPremium() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, premium_expires_at')
        .eq('id', user.id)
        .single()

      if (profile?.is_premium) {
        const expired =
          profile.premium_expires_at &&
          new Date(profile.premium_expires_at) < new Date()
        setIsPremium(!expired)
      }
      setLoading(false)
    }

    check()
  }, [])

  return { isPremium, loading }
}
