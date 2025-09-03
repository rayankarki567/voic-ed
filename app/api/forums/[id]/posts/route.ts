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
    
    const { data: posts, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles!forum_posts_author_id_fkey (
          full_name,
          student_id,
          avatar_url
        ),
        forum_replies (
          *,
          profiles!forum_replies_author_id_fkey (
            full_name,
            student_id,
            avatar_url
          )
        )
      `)
      .eq('topic_id', id)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
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
    const { content } = json

    const { data: post, error } = await supabase
      .from('forum_posts')
      .insert({
        topic_id: id,
        content,
        author_id: session.user.id
      })
      .select(`
        *,
        profiles!forum_posts_author_id_fkey (
          full_name,
          student_id,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    // Update topic's updated_at timestamp
    await supabase
      .from('forum_topics')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}
