import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
)

// Helper function to handle database errors
export const handleError = (error: any) => {
  console.error('Database error:', error)
  throw new Error(error.message || 'An unexpected error occurred')
}

// Helper function to check if a user has required permissions
export const checkPermissions = async (userId: string, requiredRole: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error) {
    handleError(error)
  }

  return data?.role === requiredRole
}

// Type-safe database queries
export const db = {
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) handleError(error)
      return data
    },
    update: async (userId: string, profile: Database['public']['Tables']['profiles']['Update']) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) handleError(error)
      return data
    }
  },
  petitions: {
    list: async () => {
      const { data, error } = await supabase
        .from('petitions')
        .select('*, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })

      if (error) handleError(error)
      return data
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('petitions')
        .select('*, profiles(first_name, last_name), petition_signatures(count)')
        .eq('id', id)
        .single()

      if (error) handleError(error)
      return data
    },
    create: async (petition: Database['public']['Tables']['petitions']['Insert']) => {
      const { data, error } = await supabase
        .from('petitions')
        .insert(petition)
        .select()
        .single()

      if (error) handleError(error)
      return data
    }
  },
  surveys: {
    list: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })

      if (error) handleError(error)
      return data
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*, profiles(first_name, last_name), survey_questions(*)')
        .eq('id', id)
        .single()

      if (error) handleError(error)
      return data
    },
    create: async (survey: Database['public']['Tables']['surveys']['Insert']) => {
      const { data, error } = await supabase
        .from('surveys')
        .insert(survey)
        .select()
        .single()

      if (error) handleError(error)
      return data
    }
  }
}
