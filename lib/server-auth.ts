import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export const createServerSupabaseClient = () =>
  createServerComponentClient<Database>({
    cookies,
  })

export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch additional user data including profile and security settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: security } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return {
      ...user,
      profile,
      security
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
