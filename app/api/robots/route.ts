import { NextResponse } from 'next/server'

// Vercel runtime configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';


export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
