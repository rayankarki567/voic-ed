import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Validate email domain
  if (!formData.email.endsWith('@sxc.edu.np')) {
    return NextResponse.json(
      { error: 'Only @sxc.edu.np email addresses are allowed' },
      { status: 400 }
    )
  }

  console.log('=== Signup Attempt ===')
  console.log('Email:', formData.email)
  console.log('Additional data:', { 
    studentId: formData.studentId, 
    department: formData.department, 
    year: formData.year 
  })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        data: {
          student_id: formData.studentId,
          department: formData.department,
          year: formData.year,
          first_name: formData.firstName || '',
          last_name: formData.lastName || '',
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('Signup successful:', {
      userId: data.user?.id,
      email: data.user?.email,
      emailConfirmed: data.user?.email_confirmed_at,
      needsConfirmation: !data.user?.email_confirmed_at
    })

    // Check if email confirmation is required
    if (data.user && !data.user.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful! Please check your email and click the confirmation link to activate your account.',
        user: {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: false
        },
        requiresEmailConfirmation: true
      }, { status: 200 })
    }

    // If user is immediately confirmed (shouldn't happen with email confirmation enabled)
    return NextResponse.json({
      success: true,
      message: 'Account created and verified successfully! You can now sign in.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        emailConfirmed: true
      },
      requiresEmailConfirmation: false
    }, { status: 200 })

  } catch (error: any) {
    console.error('Unexpected signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    )
  }
}
