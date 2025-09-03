import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';


interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: survey, error } = await supabase
      .from('surveys')
      .select(`
        *,
        survey_responses (
          id,
          answers,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(survey)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Survey not found' },
      { status: 404 }
    )
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { answers } = json

    // Check if user already responded
    const { data: existingResponse } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_id', id)
      .eq('user_id', session.user.id)
      .single()

    if (existingResponse) {
      return NextResponse.json(
        { error: 'You have already responded to this survey' },
        { status: 400 }
      )
    }

    const { data: response, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: id,
        user_id: session.user.id,
        answers
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit response' },
      { status: 500 }
    )
  }
}
