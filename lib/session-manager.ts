import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { sessionConfig } from './security-config'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || ''
})

// Session manager
export class SessionManager {
  private supabase = createClientComponentClient()
  
  // Validate session and rotate if needed
  async validateSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    
    if (!session) return null
    
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at
    const timeLeft = expiresAt - now
    
    // If session is expired, sign out
    if (timeLeft <= 0) {
      await this.supabase.auth.signOut()
      return null
    }
    
    // If session is close to expiry, rotate the token
    if (timeLeft <= sessionConfig.renewalThreshold) {
      const { data: { session: newSession }, error } = await this.supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }
      return newSession
    }
    
    return session
  }
  
  // Track failed login attempts
  async trackLoginAttempt(email: string, success: boolean) {
    const key = `login_attempts:${email}`
    
    if (success) {
      // Clear failed attempts on successful login
      await redis.del(key)
      return true
    }
    
    // Increment failed attempts
    const attempts = await redis.incr(key)
    await redis.expire(key, 15 * 60) // Reset after 15 minutes
    
    if (attempts > 5) {
      // Lock account for 15 minutes after 5 failed attempts
      await redis.set(`account_locked:${email}`, 'true', { ex: 15 * 60 })
      throw new Error('Account temporarily locked. Please try again later.')
    }
    
    return true
  }
  
  // Check if account is locked
  async isAccountLocked(email: string): Promise<boolean> {
    const locked = await redis.get(`account_locked:${email}`)
    return locked === 'true'
  }
}
