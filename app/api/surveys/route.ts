import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: surveys, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(surveys)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch surveys' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin/moderator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const json = await request.json()
    const { title, description, questions, end_date } = json

    const { data: survey, error } = await supabase
      .from('surveys')
      .insert({
        title,
        description,
        questions,
        end_date,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(survey)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create survey' },
      { status: 500 }
    )
  }
}
