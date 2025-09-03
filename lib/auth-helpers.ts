import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Provider } from '@supabase/supabase-js'

export const supabaseClient = createClientComponentClient()

export async function signInWithGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        hd: 'sxc.edu.np', // Restrict to sxc.edu.np domain
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    throw error
  }
}
