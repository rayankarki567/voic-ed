# Vercel Deployment Best Practices

## Runtime Configuration for API Routes

Add these exports to ALL your API route files to avoid Vercel errors:

```typescript
// Add to every API route file (app/api/**/*.ts)
export const runtime = 'nodejs18'
export const maxDuration = 30 // seconds
export const dynamic = 'force-dynamic' // for routes that use cookies/auth
```

## Common Error Prevention

### 1. Function Timeout Prevention
- Set `maxDuration = 30` (max for Hobby plan)
- Use database connection pooling
- Implement query timeouts

### 2. Payload Size Management
```typescript
// Check request size before processing
const contentLength = request.headers.get('content-length');
if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB
  return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
}
```

### 3. Response Size Management
```typescript
// Paginate large responses
const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '10'), 100);
const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');
```

### 4. Error Handling
```typescript
try {
  // Your API logic
  return NextResponse.json(result);
} catch (error) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' }, 
    { status: 500 }
  );
}
```

## Environment Variables

Ensure these are set in Vercel dashboard:
- `NEXT_PUBLIC_APP_URL` = your-domain.vercel.app
- `NODE_ENV` = production
- All Supabase credentials
- All Google OAuth credentials

## Build Optimization

1. **Tree Shaking**: Remove unused dependencies
2. **Bundle Analysis**: Run `npm run analyze` before deploy
3. **Image Optimization**: Use `next/image` for all images
4. **Static Generation**: Use ISR where possible

## Monitoring Setup

Add error tracking to catch issues early:
```typescript
// In app/layout.tsx or error.tsx
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Add Sentry, LogRocket, or similar
}
```

## Deployment Checklist

✅ All API routes have runtime exports
✅ Environment variables configured
✅ Database connection limits set appropriately  
✅ Error handling implemented
✅ Response pagination for large datasets
✅ Image optimization configured
✅ Build warnings resolved
✅ Performance tested with realistic data

## Emergency Response

If you encounter errors after deployment:

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard > Functions
   - Check real-time logs for specific errors

2. **Quick Fixes**
   - Increase `maxDuration` if timing out
   - Add pagination if payloads too large
   - Check environment variables

3. **Rollback Plan**
   - Keep previous working deployment
   - Use Vercel's instant rollback feature

## Performance Targets

- API response time: < 1000ms
- Page load time: < 2000ms  
- Time to Interactive: < 3000ms
- Largest Contentful Paint: < 2500ms
