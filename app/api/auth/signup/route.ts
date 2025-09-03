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

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        role: 'student', // Default role
      }
    }
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  // Create initial profile and security settings
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: data.user.id,
          student_id: formData.studentId,
          department: formData.department,
          year: formData.year,
        }
      ])

    const { error: securityError } = await supabase
      .from('security_settings')
      .insert([
        {
          user_id: data.user.id,
          two_factor_enabled: false,
          failed_login_attempts: 0,
          profile_visibility: 'public'
        }
      ])

    if (profileError || securityError) {
      console.error('Error creating user data:', { profileError, securityError })
    }
  }

  return NextResponse.json(
    { 
      user: data.user,
      session: data.session
    },
    {
      status: 200,
      headers: { Location: `${requestUrl.origin}/login` }
    }
  )
}
