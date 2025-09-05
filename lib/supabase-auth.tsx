'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { getAuthCallbackUrl } from '@/lib/config'
import { cleanAuthParams } from '@/lib/secure-auth'
import { userCompletenessChecker } from '@/lib/user-completeness-checker'

type Profile = {
  id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

type SecuritySettings = {
  id: string
  user_id: string
  two_factor_enabled: boolean
  failed_login_attempts: number
  last_failed_login?: string
  locked_until?: string
  profile_visibility: 'public' | 'students' | 'private'
  email_notifications: boolean
  created_at: string
  updated_at: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  securitySettings: SecuritySettings | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  // Fetch additional user data from profiles and security_settings tables
  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId)
      
      // First, ensure user completeness (check/repair missing entries)
      const completenessResult = await userCompletenessChecker.ensureUserCompleteness(false)
      
      if (completenessResult && completenessResult.action_taken !== 'complete') {
        console.log('User entries were repaired:', completenessResult.action_taken)
      }
      
      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
      })
      
      const dataPromise = Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('security_settings')
          .select('*')
          .eq('user_id', userId)
          .single()
      ])

      const [profileResponse, securityResponse] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as any

      // Handle profile data
      if (profileResponse.error) {
        console.warn('Profile not found after completeness check:', profileResponse.error.message)
        // Try to force repair if profile is still missing
        await userCompletenessChecker.forceUserCompletenessCheck()
        setProfile(null)
      } else {
        console.log('Profile loaded:', profileResponse.data)
        setProfile(profileResponse.data)
      }

      // Handle security settings
      if (securityResponse.error) {
        console.warn('Security settings not found after completeness check:', securityResponse.error.message)
        setSecuritySettings(null)
      } else {
        console.log('Security settings loaded:', securityResponse.data)
        setSecuritySettings(securityResponse.data)
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Try force completeness check as last resort
      try {
        await userCompletenessChecker.forceUserCompletenessCheck()
      } catch (repairError) {
        console.error('Failed to repair user completeness:', repairError)
      }
      // Set defaults and continue
      setProfile(null)
      setSecuritySettings(null)
    }
  }

  useEffect(() => {
    // Initialize completeness checker
    userCompletenessChecker.initializeAutoCheck()
    
    // Check for existing session on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          // Fetch user data in parallel with setting loading to false
          fetchUserData(session.user.id).catch(console.error)
        }
        
        // Always set loading to false after session check, don't wait for user data
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking initial session:', error)
        setIsLoading(false)
      }
    }

    checkInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Don't await this - let it load in background
        fetchUserData(session.user.id).catch(console.error)
        // Only redirect on SIGNED_IN event, not on initial load
        if (event === 'SIGNED_IN' && window.location.pathname !== '/dashboard') {
          console.log('Redirecting to dashboard after sign in')
          router.push('/dashboard')
        }
      } else {
        setProfile(null)
        setSecuritySettings(null)
        // Redirect to login page when signed out
        if (event === 'SIGNED_OUT') {
          console.log('Redirecting to login after sign out')
          router.push('/login')
        }
      }
      
      // Always set loading to false for auth state changes
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Clean URL parameters after sign in
    if (!error) {
      cleanAuthParams()
    }
    
    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthCallbackUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Clean any auth parameters from URL after sign out
    cleanAuthParams()
  }

  const refreshSession = async () => {
    if (user?.id) {
      await fetchUserData(user.id)
    }
    // Clean any auth parameters after refresh
    cleanAuthParams()
  }

  const value = {
    user,
    profile,
    securitySettings,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
