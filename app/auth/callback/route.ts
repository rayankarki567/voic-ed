import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  console.log('=== Auth Callback Started ===')
  console.log('URL:', requestUrl.toString())
  console.log('Code present:', !!code)
  console.log('Error present:', error)
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      console.log('Exchanging code for session...')
      const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth callback error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      if (!user) {
        console.error('No user returned after code exchange')
        return NextResponse.redirect(
          new URL('/login?error=Authentication+failed', request.url)
        )
      }

      console.log('User authenticated successfully:', {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at
      })

      // NOTE: Profile creation is now handled automatically by database trigger!
      // The handle_new_user() function in the database creates profiles automatically
      // when a user is inserted into auth.users

      console.log('Authentication successful - profile should be auto-created by database trigger')
      console.log('Redirecting to dashboard...')
      return NextResponse.redirect(new URL('/dashboard', request.url))
      
    } catch (error: any) {
      console.error('Unexpected auth callback error:', error)
      console.error('Error stack:', error.stack)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
      )
    }
  }

  // Return the user to an error page with instructions
  console.error('No code in auth callback')
  return NextResponse.redirect(
    new URL('/login?error=No+code+in+redirect', request.url)
  )
}
