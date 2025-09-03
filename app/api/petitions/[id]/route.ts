import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase-db'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const petition = await db.petitions.get(params.id)
    
    if (!petition) {
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
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const petition = await db.petitions.get(params.id)
    
    if (!petition) {
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
      .eq('id', params.id)
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
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const petition = await db.petitions.get(params.id)
    
    if (!petition) {
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
      .eq('id', params.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete petition' },
      { status: 500 }
    )
  }
}
