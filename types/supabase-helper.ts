import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

declare module '@supabase/supabase-js' {
  interface PostgrestBuilder {
    upsert<T>(values: T, options?: { onConflict?: string; ignoreDuplicates?: boolean; count?: 'exact' | 'planned' | 'estimated' }): this
  }
}

export type SupabaseClientType = SupabaseClient<Database>
