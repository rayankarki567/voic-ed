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
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: complaints, error } = await supabase
      .from('complaints')
      .select(`
        *,
        profiles!complaints_user_id_fkey (
          full_name,
          student_id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(complaints)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch complaints' },
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

    const json = await request.json()
    const { title, description, location, department, priority } = json

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        title,
        description,
        location,
        department,
        priority,
        user_id: session.user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create complaint' },
      { status: 500 }
    )
  }
}
