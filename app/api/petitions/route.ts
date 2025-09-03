import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase-db'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createPetitionSchema } from '@/lib/validations/petition'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const petitions = await db.petitions.list()
    return NextResponse.json(petitions)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch petitions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const validatedData = createPetitionSchema.parse(json)

    const petition = await db.petitions.create({
      user_id: session.user.id,
      ...validatedData,
      status: 'active'
    })

    return NextResponse.json(petition)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A petition with this title already exists' },
        { status: 400 }
      )
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create petition' },
      { status: 500 }
    )
  }
}
