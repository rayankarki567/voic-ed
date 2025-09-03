import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        *,
        votes (
          id,
          option_index,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    // Calculate vote counts
    const vote_counts = poll.votes.reduce((acc: number[], vote: any) => {
      acc[vote.option_index] = (acc[vote.option_index] || 0) + 1
      return acc
    }, [])

    return NextResponse.json({
      ...poll,
      vote_counts,
      total_votes: poll.votes.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Poll not found' },
      { status: 404 }
    )
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { option_index } = json

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this poll' },
        { status: 400 }
      )
    }

    const { data: vote, error } = await supabase
      .from('votes')
      .insert({
        poll_id: params.id,
        user_id: session.user.id,
        option_index
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(vote)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit vote' },
      { status: 500 }
    )
  }
}
