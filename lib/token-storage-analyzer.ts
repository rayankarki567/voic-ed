/**
 * Session Token Storage Analysis
 * This utility checks where Supabase stores session tokens in the browser
 */

'use client'

export function analyzeTokenStorage() {
  console.log('=== Session Token Storage Analysis ===')
  
  // Check localStorage
  console.log('\n1. LOCALSTORAGE:')
  if (typeof window !== 'undefined' && window.localStorage) {
    const localStorageKeys = Object.keys(localStorage)
    console.log(`Total localStorage items: ${localStorageKeys.length}`)
    
    localStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('auth') || key.includes('token')) {
        const value = localStorage.getItem(key)
        console.log(`🔑 ${key}:`, value ? `${value.substring(0, 50)}...` : 'null')
      }
    })
    
    if (localStorageKeys.filter(k => k.includes('supabase') || k.includes('sb-')).length === 0) {
      console.log('✅ No Supabase tokens found in localStorage')
    }
  }
  
  // Check sessionStorage
  console.log('\n2. SESSIONSTORAGE:')
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const sessionStorageKeys = Object.keys(sessionStorage)
    console.log(`Total sessionStorage items: ${sessionStorageKeys.length}`)
    
    sessionStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('auth') || key.includes('token')) {
        const value = sessionStorage.getItem(key)
        console.log(`🔑 ${key}:`, value ? `${value.substring(0, 50)}...` : 'null')
      }
    })
    
    if (sessionStorageKeys.filter(k => k.includes('supabase') || k.includes('sb-')).length === 0) {
      console.log('✅ No Supabase tokens found in sessionStorage')
    }
  }
  
  // Check cookies
  console.log('\n3. COOKIES:')
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';')
    console.log(`Total cookies: ${cookies.length}`)
    
    const authCookies = cookies.filter(cookie => {
      const name = cookie.split('=')[0].trim()
      return name.includes('sb-') || name.includes('supabase') || name.includes('auth')
    })
    
    if (authCookies.length > 0) {
      console.log('🍪 Auth-related cookies found:')
      authCookies.forEach(cookie => {
        const [name] = cookie.split('=')
        console.log(`  - ${name.trim()} (HTTP-only cookies not visible here)`)
      })
    } else {
      console.log('ℹ️ No auth cookies visible (HTTP-only cookies are hidden)')
    }
  }
  
  // Check IndexedDB (where Supabase might store session data)
  console.log('\n4. INDEXEDDB:')
  if (typeof window !== 'undefined' && window.indexedDB) {
    // This is async, so we'll just log that we're checking
    indexedDB.databases().then(databases => {
      console.log('Available IndexedDB databases:', databases.map(db => db.name))
      
      databases.forEach(db => {
        if (db.name && (db.name.includes('supabase') || db.name.includes('sb'))) {
          console.log(`🗄️ Found Supabase database: ${db.name}`)
        }
      })
    }).catch(err => {
      console.log('Could not access IndexedDB:', err.message)
    })
  }
  
  return {
    localStorage: typeof window !== 'undefined' ? Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase')) : [],
    sessionStorage: typeof window !== 'undefined' ? Object.keys(sessionStorage).filter(k => k.includes('sb-') || k.includes('supabase')) : [],
    cookies: typeof document !== 'undefined' ? document.cookie.split(';').filter(c => c.includes('sb-')) : []
  }
}

// Function to monitor storage changes
export function monitorStorageChanges() {
  console.log('\n=== Monitoring Storage Changes ===')
  
  if (typeof window !== 'undefined') {
    // Monitor localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('sb-') || e.key.includes('supabase'))) {
        console.log('📦 localStorage change:', {
          key: e.key,
          oldValue: e.oldValue ? `${e.oldValue.substring(0, 30)}...` : null,
          newValue: e.newValue ? `${e.newValue.substring(0, 30)}...` : null
        })
      }
    })
    
    console.log('✅ Storage monitoring active')
  }
}

// Function to check current auth state
export async function checkAuthState() {
  console.log('\n=== Current Auth State ===')
  
  try {
    // Dynamic import to avoid SSR issues
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs')
    const supabase = createClientComponentClient()
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (session) {
      console.log('🔐 Session found:', {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : 'No expiry',
        tokenType: session.token_type,
        // Don't log the actual tokens for security
        hasAccessToken: !!session.access_token,
        hasRefreshToken: !!session.refresh_token
      })
    } else {
      console.log('❌ No active session found')
    }
    
    if (error) {
      console.error('Session error:', error)
    }
    
    return { session, error }
  } catch (err) {
    console.error('Failed to check auth state:', err)
    return { session: null, error: err }
  }
}
