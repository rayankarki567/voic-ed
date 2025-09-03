import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  
  console.log('=== CALLBACK TEST ENDPOINT HIT ===')
  console.log('Full URL:', url.toString())
  console.log('Search params:', Object.fromEntries(url.searchParams.entries()))
  console.log('Headers:', Object.fromEntries(request.headers.entries()))
  
  return NextResponse.json({
    message: 'Callback test endpoint working',
    url: url.toString(),
    params: Object.fromEntries(url.searchParams.entries()),
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  return GET(request)
}
