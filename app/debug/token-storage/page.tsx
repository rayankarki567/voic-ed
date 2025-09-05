'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyzeTokenStorage, monitorStorageChanges, checkAuthState } from '@/lib/token-storage-analyzer'

export default function TokenStorageTest() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [authState, setAuthState] = useState<any>(null)

  useEffect(() => {
    // Start monitoring storage changes
    monitorStorageChanges()
    
    // Initial analysis
    runAnalysis()
  }, [])

  const runAnalysis = async () => {
    console.clear()
    const storageAnalysis = analyzeTokenStorage()
    const auth = await checkAuthState()
    
    setAnalysis(storageAnalysis)
    setAuthState(auth)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Session Token Storage Analysis</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Storage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runAnalysis} className="mb-4">
              Run Analysis
            </Button>
            
            <p className="text-sm text-muted-foreground mb-4">
              Check the browser console for detailed analysis. This page tests where Supabase stores session tokens.
            </p>

            {analysis && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">localStorage Keys:</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.localStorage.length === 0 
                      ? '✅ No Supabase tokens in localStorage' 
                      : `❌ Found ${analysis.localStorage.length} Supabase keys`}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">sessionStorage Keys:</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.sessionStorage.length === 0 
                      ? '✅ No Supabase tokens in sessionStorage' 
                      : `❌ Found ${analysis.sessionStorage.length} Supabase keys`}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Cookies:</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.cookies.length === 0 
                      ? '✅ No visible auth cookies (HTTP-only cookies are secure)' 
                      : `Found ${analysis.cookies.length} auth-related cookies`}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔐 Current Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            {authState ? (
              <div className="space-y-2">
                {authState.session ? (
                  <>
                    <p className="text-green-600">✅ User is authenticated</p>
                    <p className="text-sm text-muted-foreground">
                      Email: {authState.session.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Session tokens are handled securely by Supabase Auth Helpers
                    </p>
                  </>
                ) : (
                  <p className="text-red-600">❌ No active session</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Click "Run Analysis" to check auth state</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 How Supabase Auth Helpers Store Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-green-600">✅ Secure (What Supabase uses):</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><strong>HTTP-only cookies</strong> - Tokens stored in secure cookies not accessible via JavaScript</li>
                <li><strong>Automatic expiration</strong> - Tokens expire and refresh automatically</li>
                <li><strong>CSRF protection</strong> - Cookies have SameSite and Secure flags</li>
                <li><strong>Server-side access</strong> - API routes can access tokens securely</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600">❌ Insecure (What we avoid):</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><strong>localStorage</strong> - Persistent storage accessible via JavaScript (XSS risk)</li>
                <li><strong>sessionStorage</strong> - Tab-scoped but still JavaScript accessible</li>
                <li><strong>URL parameters</strong> - Tokens exposed in browser history</li>
                <li><strong>JavaScript variables</strong> - Accessible to any script</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
              <p className="text-sm">
                <strong>Note:</strong> Your app uses <code>@supabase/auth-helpers-nextjs</code> which 
                automatically handles tokens securely via HTTP-only cookies. No manual token management needed!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
