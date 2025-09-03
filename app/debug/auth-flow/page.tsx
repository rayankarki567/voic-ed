'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthFlowDebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [authUsers, setAuthUsers] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [securitySettings, setSecuritySettings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    setLogs(prev => [logMessage, ...prev])
    console.log(logMessage)
  }

  const loadData = async () => {
    setIsLoading(true)
    addLog('Loading current data...')
    
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        addLog(`Session error: ${sessionError.message}`)
      } else {
        addLog(`Current session: ${session ? `User ${session.user.email}` : 'No session'}`)
      }

      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (profilesError) {
        addLog(`Profiles error: ${profilesError.message}`)
      } else {
        setProfiles(profilesData || [])
        addLog(`Found ${profilesData?.length || 0} profiles`)
      }

      // Get security settings data
      const { data: securityData, error: securityError } = await supabase
        .from('security_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (securityError) {
        addLog(`Security settings error: ${securityError.message}`)
      } else {
        setSecuritySettings(securityData || [])
        addLog(`Found ${securityData?.length || 0} security settings`)
      }

    } catch (error: any) {
      addLog(`Unexpected error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateProfile = async () => {
    if (!user) {
      addLog('No authenticated user found')
      return
    }

    try {
      addLog(`Attempting to create profile for user: ${user.email}`)
      
      const profileData = {
        user_id: user.id,
        first_name: user.user_metadata?.given_name || 'Test',
        last_name: user.user_metadata?.family_name || 'User',
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      addLog(`Profile data: ${JSON.stringify(profileData, null, 2)}`)

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()

      if (error) {
        addLog(`Profile creation error: ${error.message}`)
        addLog(`Error details: ${JSON.stringify(error, null, 2)}`)
      } else {
        addLog(`Profile created successfully: ${JSON.stringify(data, null, 2)}`)
        await loadData() // Refresh data
      }
    } catch (error: any) {
      addLog(`Unexpected profile creation error: ${error.message}`)
    }
  }

  const testCreateSecurity = async () => {
    if (!user) {
      addLog('No authenticated user found')
      return
    }

    try {
      addLog(`Attempting to create security settings for user: ${user.email}`)
      
      const securityData = {
        user_id: user.id,
        two_factor_enabled: false,
        failed_login_attempts: 0,
        profile_visibility: 'public' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      addLog(`Security data: ${JSON.stringify(securityData, null, 2)}`)

      const { data, error } = await supabase
        .from('security_settings')
        .upsert(securityData, { onConflict: 'user_id' })
        .select()

      if (error) {
        addLog(`Security creation error: ${error.message}`)
        addLog(`Error details: ${JSON.stringify(error, null, 2)}`)
      } else {
        addLog(`Security settings created successfully: ${JSON.stringify(data, null, 2)}`)
        await loadData() // Refresh data
      }
    } catch (error: any) {
      addLog(`Unexpected security creation error: ${error.message}`)
    }
  }

  const signOut = async () => {
    try {
      addLog('Signing out...')
      await supabase.auth.signOut()
      addLog('Signed out successfully')
      await loadData()
    } catch (error: any) {
      addLog(`Sign out error: ${error.message}`)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Flow Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Information about the currently authenticated user</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                <p><strong>Provider:</strong> {user.app_metadata?.provider}</p>
                <p><strong>Given Name:</strong> {user.user_metadata?.given_name}</p>
                <p><strong>Family Name:</strong> {user.user_metadata?.family_name}</p>
                <p><strong>Full Name:</strong> {user.user_metadata?.full_name}</p>
              </div>
            ) : (
              <p>No authenticated user</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>Manual testing of database operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={loadData} disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </Button>
            <Button onClick={testCreateProfile} disabled={!user} variant="outline" className="w-full">
              Test Create Profile
            </Button>
            <Button onClick={testCreateSecurity} disabled={!user} variant="outline" className="w-full">
              Test Create Security Settings
            </Button>
            <Button onClick={signOut} disabled={!user} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profiles Data */}
        <Card>
          <CardHeader>
            <CardTitle>Profiles Table ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              {profiles.length > 0 ? (
                <div className="space-y-2">
                  {profiles.map((profile, index) => (
                    <div key={index} className="p-2 border rounded text-xs">
                      <p><strong>User ID:</strong> {profile.user_id}</p>
                      <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                      <p><strong>Email:</strong> {profile.email}</p>
                      <p><strong>Student ID:</strong> {profile.student_id}</p>
                      <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No profiles found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Data */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings ({securitySettings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              {securitySettings.length > 0 ? (
                <div className="space-y-2">
                  {securitySettings.map((setting, index) => (
                    <div key={index} className="p-2 border rounded text-xs">
                      <p><strong>User ID:</strong> {setting.user_id}</p>
                      <p><strong>2FA:</strong> {setting.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
                      <p><strong>Failed Attempts:</strong> {setting.failed_login_attempts}</p>
                      <p><strong>Visibility:</strong> {setting.profile_visibility}</p>
                      <p><strong>Created:</strong> {new Date(setting.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No security settings found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            ) : (
              <div>No logs yet...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
