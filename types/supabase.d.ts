import '@supabase/auth-helpers-nextjs'

declare module '@supabase/auth-helpers-nextjs' {
  interface User {
    email_verified: boolean
  }
}
