/**
 * User Completeness Checker
 * Ensures all user entries exist across tables and repairs missing ones
 */

import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface UserCompletenessResult {
  user_id: string
  email: string
  users_exists: boolean
  profiles_exists: boolean
  security_exists: boolean
  preferences_exists: boolean
  action_taken: string
}

export class UserCompletenessChecker {
  private supabase = createClientComponentClient()
  private lastCheck: number = 0
  private checkInterval: number = 5 * 60 * 1000 // 5 minutes

  /**
   * Check and repair user completeness
   * Runs automatically but respects rate limiting
   */
  async ensureUserCompleteness(forceCheck: boolean = false): Promise<UserCompletenessResult | null> {
    try {
      // Rate limiting - don't check too frequently
      const now = Date.now()
      if (!forceCheck && (now - this.lastCheck < this.checkInterval)) {
        console.log('User completeness check skipped (rate limited)')
        return null
      }

      // Get current user
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        console.log('No authenticated user, skipping completeness check')
        return null
      }

      console.log('Checking user completeness for:', user.email)
      this.lastCheck = now

      // Call the database function to check/repair user entries
      const { data, error } = await this.supabase
        .rpc('ensure_user_completeness', { user_id_param: user.id })

      if (error) {
        console.error('Error checking user completeness:', error)
        throw error
      }

      const result = data?.[0] as UserCompletenessResult
      
      if (result) {
        console.log('User completeness result:', result)
        
        // Log if any repairs were made
        if (result.action_taken !== 'complete') {
          console.warn('User entries repaired:', result.action_taken)
          
          // Optionally trigger a refresh of user data in the app
          this.notifyUserDataChanged()
        }
        
        return result
      }

      return null
    } catch (error) {
      console.error('User completeness check failed:', error)
      return null
    }
  }

  /**
   * Force check user completeness (ignores rate limiting)
   */
  async forceUserCompletenessCheck(): Promise<UserCompletenessResult | null> {
    return this.ensureUserCompleteness(true)
  }

  /**
   * Check if all user entries exist without repairing
   */
  async checkUserExists(): Promise<{
    users: boolean
    profiles: boolean
    security: boolean
    preferences: boolean
  }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        return { users: false, profiles: false, security: false, preferences: false }
      }

      // Check each table
      const [usersCheck, profilesCheck, securityCheck, preferencesCheck] = await Promise.all([
        this.supabase.from('users').select('id').eq('id', user.id).single(),
        this.supabase.from('profiles').select('id').eq('user_id', user.id).single(),
        this.supabase.from('security_settings').select('id').eq('user_id', user.id).single(),
        this.supabase.from('user_preferences').select('id').eq('user_id', user.id).single()
      ])

      return {
        users: !usersCheck.error,
        profiles: !profilesCheck.error,
        security: !securityCheck.error,
        preferences: !preferencesCheck.error
      }
    } catch (error) {
      console.error('Error checking user existence:', error)
      return { users: false, profiles: false, security: false, preferences: false }
    }
  }

  /**
   * Get detailed user information from all tables
   */
  async getUserCompleteData() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      const [userData, profileData, securityData, preferencesData] = await Promise.all([
        this.supabase.from('users').select('*').eq('id', user.id).single(),
        this.supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        this.supabase.from('security_settings').select('*').eq('user_id', user.id).single(),
        this.supabase.from('user_preferences').select('*').eq('user_id', user.id).single()
      ])

      return {
        auth: user,
        users: userData.data,
        profile: profileData.data,
        security: securityData.data,
        preferences: preferencesData.data,
        errors: {
          users: userData.error,
          profile: profileData.error,
          security: securityData.error,
          preferences: preferencesData.error
        }
      }
    } catch (error) {
      console.error('Error getting complete user data:', error)
      return null
    }
  }

  /**
   * Notify the app that user data has changed (for state management)
   */
  private notifyUserDataChanged() {
    // Dispatch custom event that components can listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userDataRepaired', {
        detail: { timestamp: Date.now() }
      }))
    }
  }

  /**
   * Initialize automatic checking on app load
   */
  initializeAutoCheck() {
    if (typeof window !== 'undefined') {
      // Check on page load
      setTimeout(() => {
        this.ensureUserCompleteness()
      }, 2000) // Wait 2 seconds for auth to settle

      // Check on auth state changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, checking completeness...')
          setTimeout(() => {
            this.ensureUserCompleteness(true)
          }, 1000)
        }
      })

      // Periodic checks while app is active
      setInterval(() => {
        this.ensureUserCompleteness()
      }, this.checkInterval)
    }
  }
}

// Singleton instance
export const userCompletenessChecker = new UserCompletenessChecker()

/**
 * React hook for user completeness checking
 */
export function useUserCompleteness() {
  const [isChecking, setIsChecking] = React.useState(false)
  const [lastResult, setLastResult] = React.useState<UserCompletenessResult | null>(null)

  const checkCompleteness = async (force: boolean = false) => {
    setIsChecking(true)
    try {
      const result = await userCompletenessChecker.ensureUserCompleteness(force)
      setLastResult(result)
      return result
    } finally {
      setIsChecking(false)
    }
  }

  React.useEffect(() => {
    // Listen for user data repairs
    const handleUserDataRepaired = (event: CustomEvent) => {
      console.log('User data was repaired at:', new Date(event.detail.timestamp))
      // Optionally refresh app state here
    }

    window.addEventListener('userDataRepaired', handleUserDataRepaired as EventListener)
    
    return () => {
      window.removeEventListener('userDataRepaired', handleUserDataRepaired as EventListener)
    }
  }, [])

  return {
    isChecking,
    lastResult,
    checkCompleteness
  }
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  userCompletenessChecker.initializeAutoCheck()
}
