'use client'

/**
 * Secure client-side session management utilities
 * This module provides functions to handle authentication tokens securely
 * without exposing them in URLs or browser history
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Session storage keys
const SESSION_KEYS = {
  TEMP_TOKEN: '_sb_temp_token',
  TEMP_CODE: '_sb_temp_code',
  LOGIN_REDIRECT: '_sb_login_redirect',
} as const

/**
 * Secure session storage wrapper
 * Uses sessionStorage (cleared when tab closes) instead of localStorage
 * for temporary auth data
 */
class SecureSessionStorage {
  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'sessionStorage' in window
    } catch {
      return false
    }
  }

  set(key: string, value: string): void {
    if (!this.isAvailable()) return
    try {
      sessionStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to store session data:', error)
    }
  }

  get(key: string): string | null {
    if (!this.isAvailable()) return null
    try {
      return sessionStorage.getItem(key)
    } catch (error) {
      console.warn('Failed to retrieve session data:', error)
      return null
    }
  }

  remove(key: string): void {
    if (!this.isAvailable()) return
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove session data:', error)
    }
  }

  clear(): void {
    if (!this.isAvailable()) return
    try {
      Object.values(SESSION_KEYS).forEach(key => {
        sessionStorage.removeItem(key)
      })
    } catch (error) {
      console.warn('Failed to clear session data:', error)
    }
  }
}

export const secureStorage = new SecureSessionStorage()

/**
 * Clean URL from authentication parameters
 * Removes sensitive parameters from browser URL and history
 */
export function cleanAuthParams(): void {
  if (typeof window === 'undefined') return

  try {
    const url = new URL(window.location.href)
    const sensitiveParams = [
      'code',
      'token',
      'token_hash',
      'access_token',
      'refresh_token',
      'error',
      'error_description',
      'state'
    ]

    let hasChanges = false
    sensitiveParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param)
        hasChanges = true
      }
    })

    // Only update URL if there were sensitive parameters
    if (hasChanges) {
      const cleanUrl = url.pathname + (url.search || '')
      window.history.replaceState({}, document.title, cleanUrl)
      console.log('Cleaned auth parameters from URL')
    }
  } catch (error) {
    console.warn('Failed to clean URL parameters:', error)
  }
}

/**
 * Store temporary authentication data securely
 */
export function storeTempAuthData(key: string, value: string): void {
  secureStorage.set(key, value)
}

/**
 * Retrieve and clean temporary authentication data
 */
export function getTempAuthData(key: string, remove: boolean = true): string | null {
  const value = secureStorage.get(key)
  if (remove && value) {
    secureStorage.remove(key)
  }
  return value
}

/**
 * Handle secure authentication redirect
 * Stores redirect URL securely without exposing it in URL parameters
 */
export function handleSecureAuthRedirect(redirectTo?: string): void {
  if (redirectTo) {
    secureStorage.set(SESSION_KEYS.LOGIN_REDIRECT, redirectTo)
  }
}

/**
 * Get and clear stored redirect URL
 */
export function getSecureAuthRedirect(): string | null {
  return getTempAuthData(SESSION_KEYS.LOGIN_REDIRECT, true)
}

/**
 * Enhanced auth state manager with secure session handling
 */
export class SecureAuthManager {
  private supabase = createClientComponentClient()

  /**
   * Sign in with automatic session cleanup
   */
  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error) {
      // Clean URL immediately after successful login
      cleanAuthParams()
      // Clear any temporary session data
      secureStorage.clear()
    }

    return { data, error }
  }

  /**
   * Sign in with Google with secure redirect handling
   */
  async signInWithGoogle(redirectTo?: string): Promise<void> {
    // Store redirect securely
    if (redirectTo) {
      handleSecureAuthRedirect(redirectTo)
    }

    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })

    if (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  /**
   * Sign out with session cleanup
   */
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut()
    // Clean all temporary data
    secureStorage.clear()
    // Clean URL parameters
    cleanAuthParams()
  }

  /**
   * Get current session securely
   */
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    return { session, error }
  }

  /**
   * Refresh session and clean any exposed tokens
   */
  async refreshSession(): Promise<void> {
    await this.supabase.auth.refreshSession()
    cleanAuthParams()
  }
}

export const secureAuth = new SecureAuthManager()

/**
 * React hook for secure authentication
 */
export function useSecureAuth() {
  return {
    signIn: secureAuth.signIn.bind(secureAuth),
    signInWithGoogle: secureAuth.signInWithGoogle.bind(secureAuth),
    signOut: secureAuth.signOut.bind(secureAuth),
    getSession: secureAuth.getSession.bind(secureAuth),
    refreshSession: secureAuth.refreshSession.bind(secureAuth),
    cleanAuthParams,
    handleSecureAuthRedirect,
    getSecureAuthRedirect,
  }
}
