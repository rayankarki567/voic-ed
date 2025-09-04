/**
 * URL Redirect Test Utility
 * This utility tests the URL configuration for both localhost and production
 */

// Test the getBaseUrl function logic
function testUrlConfig() {
  console.log('=== URL Configuration Test ===')
  
  // Simulate localhost environment
  const localhostOrigin = 'http://localhost:3000'
  const productionOrigin = 'https://voic-ed.vercel.app'
  
  console.log('Localhost URLs:')
  console.log('- Base:', localhostOrigin)
  console.log('- Auth Callback:', `${localhostOrigin}/auth/callback`)
  console.log('- Email Confirm:', `${localhostOrigin}/auth/confirm`)
  console.log('- Dashboard:', `${localhostOrigin}/dashboard`)
  
  console.log('\nProduction URLs:')
  console.log('- Base:', productionOrigin)
  console.log('- Auth Callback:', `${productionOrigin}/auth/callback`)
  console.log('- Email Confirm:', `${productionOrigin}/auth/confirm`)
  console.log('- Dashboard:', `${productionOrigin}/dashboard`)
  
  console.log('\n=== URL Detection Logic ===')
  
  // Test hostname detection logic
  if (typeof window !== 'undefined') {
    const currentHostname = window.location.hostname
    console.log('Current hostname:', currentHostname)
    console.log('Is production?', currentHostname === 'voic-ed.vercel.app')
    console.log('Current origin:', window.location.origin)
  }
  
  // Test environment variable fallback
  console.log('\nEnvironment Variables:')
  console.log('- NODE_ENV:', process.env.NODE_ENV)
  console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
  console.log('- VERCEL_URL:', process.env.VERCEL_URL)
}

// Test URL parameters cleaning
function testUrlCleaning() {
  console.log('\n=== URL Cleaning Test ===')
  
  const sensitiveParams = [
    'code=abc123',
    'token=xyz789', 
    'token_hash=hash456',
    'access_token=at_123',
    'refresh_token=rt_456',
    'error=auth_failed',
    'state=random_state'
  ]
  
  const testUrl = 'https://voic-ed.vercel.app/dashboard?' + sensitiveParams.join('&')
  console.log('URL with sensitive params:', testUrl)
  
  // Show what would be cleaned
  const url = new URL(testUrl)
  const paramsToRemove = ['code', 'token', 'token_hash', 'access_token', 'refresh_token', 'error', 'state']
  
  paramsToRemove.forEach(param => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
      console.log(`Removed: ${param}`)
    }
  })
  
  const cleanUrl = url.pathname + (url.search || '')
  console.log('Cleaned URL:', `${url.origin}${cleanUrl}`)
}

export { testUrlConfig, testUrlCleaning }
