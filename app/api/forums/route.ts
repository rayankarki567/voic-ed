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
    
    const { data: topics, error } = await supabase
      .from('forum_topics')
      .select(`
        *,
        forum_posts (
          id,
          content,
          created_at,
          profiles!forum_posts_author_id_fkey (
            full_name,
            student_id
          ),
          forum_replies (
            id
          )
        )
      `)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })

    if (error) throw error

    // Add post counts and latest post info
    const topicsWithStats = topics?.map(topic => ({
      ...topic,
      post_count: topic.forum_posts.length,
      reply_count: topic.forum_posts.reduce((acc: number, post: any) => 
        acc + post.forum_replies.length, 0
      ),
      latest_post: topic.forum_posts[0] || null
    }))

    return NextResponse.json(topicsWithStats)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch forum topics' },
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
    const { title, category } = json

    const { data: topic, error } = await supabase
      .from('forum_topics')
      .insert({
        title,
        category,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(topic)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create forum topic' },
      { status: 500 }
    )
  }
}
