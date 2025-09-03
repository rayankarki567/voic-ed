import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Generate unique secret for user
  const secret = authenticator.generateSecret()
  
  // Generate QR code
  const otpauth = authenticator.keyuri(
    session.user.email!,
    'Student E-Governance',
    secret
  )
  
  const qrCode = await QRCode.toDataURL(otpauth)

  // Store secret in security_settings
  const { error } = await supabase
    .from('security_settings')
    .update({
      two_factor_secret: secret,
      two_factor_enabled: false // Will be enabled after verification
    })
    .eq('user_id', session.user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 })
  }

  return NextResponse.json({ 
    secret,
    qrCode
  })
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const { token } = await request.json()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's secret
  const { data: security } = await supabase
    .from('security_settings')
    .select('two_factor_secret')
    .eq('user_id', session.user.id)
    .single()

  if (!security?.two_factor_secret) {
    return NextResponse.json({ error: '2FA not setup' }, { status: 400 })
  }

  // Verify token
  const isValid = authenticator.verify({
    token,
    secret: security.two_factor_secret
  })

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  // Enable 2FA
  const { error } = await supabase
    .from('security_settings')
    .update({
      two_factor_enabled: true
    })
    .eq('user_id', session.user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to enable 2FA' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
