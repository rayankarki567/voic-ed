import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase-db'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Vercel deployment configuration
export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: petition, error } = await supabase
      .from('petitions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !petition) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(petition)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch petition' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: petition, error: fetchError } = await supabase
      .from('petitions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !petition) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 }
      )
    }

    // Check if user owns the petition
    if (petition.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this petition' },
        { status: 403 }
      )
    }

    const json = await request.json()
    const { data, error } = await supabase
      .from('petitions')
      .update(json)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update petition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: petition, error: fetchError } = await supabase
      .from('petitions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !petition) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 }
      )
    }

    // Check if user owns the petition
    if (petition.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this petition' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('petitions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete petition' },
      { status: 500 }
    )
  }
}
