import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        votes (
          id,
          option_index
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate vote counts for each poll
    const pollsWithVoteCounts = polls?.map(poll => ({
      ...poll,
      vote_counts: poll.votes.reduce((acc: number[], vote: any) => {
        acc[vote.option_index] = (acc[vote.option_index] || 0) + 1
        return acc
      }, []),
      total_votes: poll.votes.length
    }))

    return NextResponse.json(pollsWithVoteCounts)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch polls' },
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
    const { title, description, options, end_date } = json

    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        options,
        end_date,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(poll)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create poll' },
      { status: 500 }
    )
  }
}
