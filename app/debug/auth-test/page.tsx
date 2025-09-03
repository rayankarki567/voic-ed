'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    setLogs(prev => [logMessage, ...prev])
    console.log(logMessage)
  }

  const testCallbackEndpoint = async () => {
    try {
      addLog('Testing callback endpoint...')
      const response = await fetch('/auth/callback/test?code=test&state=test')
      const data = await response.json()
      addLog(`Callback test response: ${JSON.stringify(data, null, 2)}`)
    } catch (error: any) {
      addLog(`Callback test error: ${error.message}`)
    }
  }

  const checkCurrentSession = async () => {
    try {
      addLog('Checking current session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        addLog(`Session error: ${error.message}`)
      } else if (session) {
        addLog(`Current session found:`)
        addLog(`- User ID: ${session.user.id}`)
        addLog(`- Email: ${session.user.email}`)
        addLog(`- Provider: ${session.user.app_metadata?.provider}`)
        addLog(`- Email confirmed: ${session.user.email_confirmed_at}`)
      } else {
        addLog('No current session')
      }
    } catch (error: any) {
      addLog(`Session check error: ${error.message}`)
    }
  }

  const triggerGoogleOAuth = async () => {
    setIsLoading(true)
    try {
      addLog('Starting Google OAuth flow...')
      
      // Get the current URL origin
      const origin = window.location.origin
      const redirectTo = `${origin}/auth/callback`
      
      addLog(`Redirect URL: ${redirectTo}`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        addLog(`Google OAuth error: ${error.message}`)
        addLog(`Error details: ${JSON.stringify(error, null, 2)}`)
      } else {
        addLog(`OAuth initiated successfully`)
        addLog(`Response data: ${JSON.stringify(data, null, 2)}`)
        // The page should redirect to Google at this point
      }
      
    } catch (error: any) {
      addLog(`Unexpected OAuth error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>Manual testing of authentication components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testCallbackEndpoint} className="w-full">
              Test Callback Endpoint
            </Button>
            <Button onClick={checkCurrentSession} variant="outline" className="w-full">
              Check Current Session
            </Button>
            <Button 
              onClick={triggerGoogleOAuth} 
              disabled={isLoading}
              variant="default" 
              className="w-full"
            >
              {isLoading ? 'Starting OAuth...' : 'Trigger Google OAuth'}
            </Button>
            <Button onClick={clearLogs} variant="secondary" className="w-full">
              Clear Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>1. Test Callback Endpoint</strong>
              <p>Verify that the callback route is accessible</p>
            </div>
            <div>
              <strong>2. Check Current Session</strong>
              <p>See if you're already signed in</p>
            </div>
            <div>
              <strong>3. Trigger Google OAuth</strong>
              <p>Start the OAuth flow manually</p>
            </div>
            <div>
              <strong>4. Check Browser Console</strong>
              <p>Look for any JavaScript errors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
          <CardDescription>Real-time logging of authentication flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-400">No logs yet. Click a test button above.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
