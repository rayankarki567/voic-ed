import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { 
      user: data.user,
      session: data.session
    },
    {
      status: 200,
      headers: { Location: requestUrl.origin }
    }
  )
}
