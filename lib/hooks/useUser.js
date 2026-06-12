'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch {
      setUser(null)
      setLoading(false)
      return
    }

    async function load() {
      let u = null
      try {
        const { data: { user: fetched } } = await supabase.auth.getUser()
        u = fetched ?? null
      } catch {
        setUser(null)
        setLoading(false)
        return
      }

      setUser(u)

      if (u) {
        const { data } = await supabase
          .from('profiles')
          .select('username, bio, favorite_fragrance')
          .eq('id', u.id)
          .single()
        setProfile(data ?? null)
      }
      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading, isLoggedIn: !!user }
}
