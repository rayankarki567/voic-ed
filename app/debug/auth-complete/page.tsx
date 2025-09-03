'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthUserCheckPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [authState, setAuthState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    setLogs(prev => [logMessage, ...prev])
    console.log(logMessage)
  }

  const checkFullAuthState = async () => {
    setIsLoading(true)
    try {
      addLog('=== CHECKING COMPLETE AUTH STATE ===')
      
      // 1. Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addLog(`❌ Session Error: ${sessionError.message}`)
      } else if (session?.user) {
        addLog(`✅ AUTH USER FOUND!`)
        addLog(`   - User ID: ${session.user.id}`)
        addLog(`   - Email: ${session.user.email}`)
        addLog(`   - Email Confirmed: ${session.user.email_confirmed_at ? 'YES' : 'NO'}`)
        addLog(`   - Provider: ${session.user.app_metadata?.provider || 'email'}`)
        addLog(`   - Created: ${session.user.created_at}`)
        addLog(`   - Last Sign In: ${session.user.last_sign_in_at}`)
        
        setAuthState({
          authenticated: true,
          user: session.user,
          session: session
        })

        // 2. Check if profile exists
        addLog('\n=== CHECKING PROFILE DATA ===')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            addLog(`❌ NO PROFILE FOUND for user ${session.user.id}`)
          } else {
            addLog(`❌ Profile Error: ${profileError.message}`)
          }
        } else {
          addLog(`✅ PROFILE FOUND!`)
          addLog(`   - Name: ${profile.first_name} ${profile.last_name}`)
          addLog(`   - Student ID: ${profile.student_id || 'Not set'}`)
          addLog(`   - Email: ${profile.email}`)
        }

        // 3. Check security settings
        addLog('\n=== CHECKING SECURITY SETTINGS ===')
        const { data: security, error: securityError } = await supabase
          .from('security_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (securityError) {
          if (securityError.code === 'PGRST116') {
            addLog(`❌ NO SECURITY SETTINGS FOUND for user ${session.user.id}`)
          } else {
            addLog(`❌ Security Settings Error: ${securityError.message}`)
          }
        } else {
          addLog(`✅ SECURITY SETTINGS FOUND!`)
          addLog(`   - 2FA Enabled: ${security.two_factor_enabled}`)
          addLog(`   - Profile Visibility: ${security.profile_visibility}`)
        }

      } else {
        addLog(`❌ NO AUTH USER - User is not signed in`)
        setAuthState({ authenticated: false })
      }

      // 4. Check all profiles in database
      addLog('\n=== CHECKING ALL PROFILES IN DATABASE ===')
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, created_at')
        .limit(10)

      if (allProfilesError) {
        addLog(`❌ Error fetching all profiles: ${allProfilesError.message}`)
      } else {
        addLog(`📊 Total profiles in database: ${allProfiles?.length || 0}`)
        if (allProfiles && allProfiles.length > 0) {
          allProfiles.forEach((profile, index) => {
            addLog(`   ${index + 1}. ${profile.first_name} ${profile.last_name} (${profile.email}) - ID: ${profile.user_id.slice(0, 8)}...`)
          })
        }
      }

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const manualCreateProfile = async () => {
    if (!authState?.user) {
      addLog('❌ No authenticated user to create profile for')
      return
    }

    try {
      addLog('\n=== MANUALLY CREATING PROFILE ===')
      const user = authState.user

      const profileData = {
        user_id: user.id,
        first_name: user.user_metadata?.given_name || user.user_metadata?.full_name?.split(' ')[0] || 'Unknown',
        last_name: user.user_metadata?.family_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'User',
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      addLog(`Creating profile with data: ${JSON.stringify(profileData, null, 2)}`)

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()

      if (error) {
        addLog(`❌ Profile creation failed: ${error.message}`)
        addLog(`   Error code: ${error.code}`)
        addLog(`   Error details: ${error.details}`)
        addLog(`   Error hint: ${error.hint}`)
      } else {
        addLog(`✅ Profile created successfully!`)
        addLog(`   Created data: ${JSON.stringify(data, null, 2)}`)
        
        // Now create security settings
        const securityData = {
          user_id: user.id,
          two_factor_enabled: false,
          failed_login_attempts: 0,
          profile_visibility: 'public' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: secData, error: secError } = await supabase
          .from('security_settings')
          .insert(securityData)
          .select()

        if (secError) {
          addLog(`❌ Security settings creation failed: ${secError.message}`)
        } else {
          addLog(`✅ Security settings created successfully!`)
        }
      }
      
      // Refresh the auth state check
      await checkFullAuthState()
      
    } catch (error: any) {
      addLog(`❌ Unexpected error creating profile: ${error.message}`)
    }
  }

  const testGoogleSignIn = async () => {
    try {
      addLog('\n=== TESTING GOOGLE SIGN IN ===')
      addLog('Initiating Google OAuth...')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        addLog(`❌ Google OAuth error: ${error.message}`)
      } else {
        addLog('🔄 Redirecting to Google...')
      }
    } catch (error: any) {
      addLog(`❌ Unexpected Google sign in error: ${error.message}`)
    }
  }

  const signOut = async () => {
    try {
      addLog('🚪 Signing out...')
      await supabase.auth.signOut()
      setAuthState(null)
      addLog('✅ Signed out successfully')
    } catch (error: any) {
      addLog(`❌ Sign out error: ${error.message}`)
    }
  }

  useEffect(() => {
    checkFullAuthState()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Complete Auth State Check</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent>
            {authState ? (
              authState.authenticated ? (
                <div className="space-y-2 text-sm">
                  <p className="text-green-600 font-medium">✅ User is authenticated</p>
                  <p><strong>Email:</strong> {authState.user.email}</p>
                  <p><strong>Provider:</strong> {authState.user.app_metadata?.provider}</p>
                </div>
              ) : (
                <p className="text-red-600 font-medium">❌ User is NOT authenticated</p>
              )
            ) : (
              <p className="text-gray-600">Checking...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Test authentication functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={checkFullAuthState} disabled={isLoading} className="w-full">
              {isLoading ? 'Checking...' : 'Check Auth State'}
            </Button>
            <Button onClick={testGoogleSignIn} variant="outline" className="w-full">
              Test Google Sign In
            </Button>
            <Button 
              onClick={manualCreateProfile} 
              disabled={!authState?.authenticated} 
              variant="secondary" 
              className="w-full"
            >
              Create Profile Manually
            </Button>
            <Button onClick={signOut} disabled={!authState?.authenticated} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Logs</CardTitle>
          <CardDescription>Complete authentication flow analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-400">Loading authentication state...</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800">What This Page Shows:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
          <li><strong>Auth Users:</strong> Created automatically by Supabase (no password visible for security)</li>
          <li><strong>Profiles:</strong> Your custom table that should link to auth users</li>
          <li><strong>Security Settings:</strong> Additional user preferences</li>
          <li><strong>Missing Links:</strong> If auth user exists but no profile, callback failed</li>
        </ul>
      </div>
    </div>
  )
}
