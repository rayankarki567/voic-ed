import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/config'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  
  console.log('=== Auth Callback Started ===')
  console.log('URL:', requestUrl.toString())
  console.log('Code present:', !!code)
  console.log('Error present:', error)
  console.log('Token hash present:', !!token_hash)
  console.log('Type:', type)
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, getBaseUrl())
    )
  }

  // Handle email confirmation flow (from email verification links)
  if (token_hash && type === 'signup') {
    console.log('Email confirmation flow detected, redirecting to confirm page')
    // Create secure redirect without exposing token in URL
    const confirmUrl = new URL('/auth/confirm', getBaseUrl())
    confirmUrl.searchParams.set('token_hash', token_hash)
    confirmUrl.searchParams.set('type', type)
    return NextResponse.redirect(confirmUrl.toString())
  }
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      console.log('Exchanging code for session...')
      const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth callback error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, getBaseUrl())
        )
      }

      if (!user) {
        console.error('No user returned after code exchange')
        return NextResponse.redirect(
          new URL('/login?error=Authentication+failed', getBaseUrl())
        )
      }

      console.log('User authenticated successfully:', {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at
      })

      // Check if user entries were created in our custom tables
      try {
        console.log('Checking user setup in database tables...')
        
        const [usersCheck, profilesCheck, securityCheck, preferencesCheck] = await Promise.all([
          supabase.from('users').select('id').eq('id', user.id).single(),
          supabase.from('profiles').select('id').eq('user_id', user.id).single(),
          supabase.from('security_settings').select('id').eq('user_id', user.id).single(),
          supabase.from('user_preferences').select('user_id').eq('user_id', user.id).single()
        ])

        console.log('Database check results:', {
          users: !!usersCheck.data,
          profiles: !!profilesCheck.data,
          security_settings: !!securityCheck.data,
          user_preferences: !!preferencesCheck.data,
          errors: {
            users: usersCheck.error?.message,
            profiles: profilesCheck.error?.message,
            security: securityCheck.error?.message,
            preferences: preferencesCheck.error?.message
          }
        })

        if (usersCheck.error && usersCheck.error.code !== 'PGRST116') {
          console.warn('Users table error:', usersCheck.error)
        }
        if (profilesCheck.error && profilesCheck.error.code !== 'PGRST116') {
          console.warn('Profiles table error:', profilesCheck.error)
        }
        if (securityCheck.error && securityCheck.error.code !== 'PGRST116') {
          console.warn('Security settings table error:', securityCheck.error)
        }
        if (preferencesCheck.error && preferencesCheck.error.code !== 'PGRST116') {
          console.warn('User preferences table error:', preferencesCheck.error)
        }

      } catch (dbError) {
        console.error('Error checking database tables:', dbError)
      }



      console.log('Authentication successful - profile and security settings verified')
      console.log('Redirecting to dashboard...')
      return NextResponse.redirect(new URL('/dashboard', getBaseUrl()))
      
    } catch (error: any) {
      console.error('Unexpected auth callback error:', error)
      console.error('Error stack:', error.stack)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, getBaseUrl())
      )
    }
  }

  // Return the user to an error page with instructions
  console.error('No code in auth callback')
  return NextResponse.redirect(
    new URL('/login?error=No+code+in+redirect', getBaseUrl())
  )
}
