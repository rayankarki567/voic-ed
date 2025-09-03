'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/supabase-auth'

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [logs, setLogs] = useState<string[]>([])
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        addLog('Starting auth check...')
        
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        addLog(`Session check: ${session ? 'Found session' : 'No session'} ${sessionError ? `Error: ${sessionError.message}` : ''}`)
        
        if (session?.user) {
          setDebugInfo(prev => ({
            ...prev,
            session: {
              userId: session.user.id,
              email: session.user.email,
              metadata: session.user.user_metadata,
              emailConfirmed: session.user.email_confirmed_at,
              provider: session.user.app_metadata?.provider
            }
          }))

          // Try to fetch profile
          addLog('Attempting to fetch profile...')
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

          if (profileError) {
            addLog(`Profile fetch error: ${profileError.message}`)
            setDebugInfo(prev => ({ ...prev, profileError: profileError.message }))
          } else {
            addLog('Profile found successfully')
            setDebugInfo(prev => ({ ...prev, profile }))
          }

          // Test database connection
          addLog('Testing database connection...')
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1)

          if (testError) {
            addLog(`Database test error: ${testError.message}`)
            setDebugInfo(prev => ({ ...prev, dbError: testError.message }))
          } else {
            addLog('Database connection successful')
            setDebugInfo(prev => ({ ...prev, dbConnected: true }))
          }
        }
      } catch (error: any) {
        addLog(`Unexpected error: ${error.message}`)
        setDebugInfo(prev => ({ ...prev, unexpectedError: error.message }))
      }
    }

    checkAuth()
  }, [])

  const testGoogleSignIn = async () => {
    try {
      addLog('Testing Google sign-in...')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        addLog(`Google sign-in error: ${error.message}`)
      } else {
        addLog('Google sign-in initiated')
      }
    } catch (error: any) {
      addLog(`Google sign-in unexpected error: ${error.message}`)
    }
  }

  const testCreateProfile = async () => {
    if (!user) {
      addLog('No user found for profile creation test')
      return
    }

    try {
      addLog('Testing profile creation...')
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: 'Test',
          last_name: 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()

      if (error) {
        addLog(`Profile creation error: ${error.message}`)
      } else {
        addLog('Profile creation successful')
        setDebugInfo(prev => ({ ...prev, createdProfile: data }))
      }
    } catch (error: any) {
      addLog(`Profile creation unexpected error: ${error.message}`)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Current State</h2>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono">
            <pre>{JSON.stringify({ user, debugInfo }, null, 2)}</pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Actions</h2>
          <div className="space-y-2">
            <button
              onClick={testGoogleSignIn}
              className="block w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Google Sign In
            </button>
            <button
              onClick={testCreateProfile}
              className="block w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Create Profile
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Debug Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded text-sm font-mono max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
