'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    setLogs(prev => [logMessage, ...prev])
    console.log(logMessage)
  }

  const testSignUp = async () => {
    if (!email || !password) {
      addLog('❌ Please enter email and password')
      return
    }

    setIsLoading(true)
    try {
      addLog('=== TESTING SIGN UP PROCESS ===')
      addLog(`📧 Email: ${email}`)
      addLog(`🔑 Password: ${'*'.repeat(password.length)} (hidden)`)
      
      // Step 1: Sign up with Supabase
      addLog('\n📝 Step 1: Creating auth user...')
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        addLog(`❌ Sign up failed: ${error.message}`)
        return
      }

      if (data.user) {
        addLog(`✅ AUTH USER CREATED!`)
        addLog(`   - User ID: ${data.user.id}`)
        addLog(`   - Email: ${data.user.email}`)
        addLog(`   - Email Confirmed: ${data.user.email_confirmed_at ? 'YES' : 'NO'}`)
        addLog(`   - Created At: ${data.user.created_at}`)

        // Step 2: Try to create profile manually (since callback might not work)
        addLog('\n📝 Step 2: Creating profile manually...')
        
        const profileData = {
          user_id: data.user.id,
          first_name: 'Test',
          last_name: 'User',
          email: data.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        addLog(`Profile data: ${JSON.stringify(profileData, null, 2)}`)

        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()

        if (profileError) {
          addLog(`❌ Profile creation failed: ${profileError.message}`)
          addLog(`   Error code: ${profileError.code}`)
          addLog(`   Error details: ${profileError.details}`)
          addLog(`   Error hint: ${profileError.hint}`)
          
          // This tells us exactly what's wrong with the database setup
          if (profileError.code === '42501') {
            addLog(`🔍 DIAGNOSIS: Permission denied - RLS policies blocking insert`)
          } else if (profileError.code === '23505') {
            addLog(`🔍 DIAGNOSIS: Duplicate key - user already has profile`)
          } else if (profileError.code === '42P01') {
            addLog(`🔍 DIAGNOSIS: Table doesn't exist`)
          }
          
        } else {
          addLog(`✅ PROFILE CREATED SUCCESSFULLY!`)
          addLog(`   Profile ID: ${profileResult[0]?.id}`)
          
          // Step 3: Create security settings
          addLog('\n📝 Step 3: Creating security settings...')
          
          const securityData = {
            user_id: data.user.id,
            two_factor_enabled: false,
            failed_login_attempts: 0,
            profile_visibility: 'public' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: securityResult, error: securityError } = await supabase
            .from('security_settings')
            .insert(securityData)
            .select()

          if (securityError) {
            addLog(`❌ Security settings creation failed: ${securityError.message}`)
          } else {
            addLog(`✅ SECURITY SETTINGS CREATED!`)
            addLog(`   Settings ID: ${securityResult[0]?.id}`)
          }
        }

        // Step 4: Check what we can query back
        addLog('\n📝 Step 4: Verifying created data...')
        
        const { data: createdProfile, error: queryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single()

        if (queryError) {
          addLog(`❌ Can't query back profile: ${queryError.message}`)
        } else {
          addLog(`✅ Profile query successful:`)
          addLog(`   ${JSON.stringify(createdProfile, null, 2)}`)
        }

      } else {
        addLog(`❌ No user returned from sign up`)
      }

      if (data.session) {
        addLog(`✅ Session created automatically`)
      } else {
        addLog(`ℹ️ No session (email confirmation required)`)
      }

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignIn = async () => {
    if (!email || !password) {
      addLog('❌ Please enter email and password')
      return
    }

    try {
      addLog('\n=== TESTING SIGN IN PROCESS ===')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        addLog(`❌ Sign in failed: ${error.message}`)
      } else {
        addLog(`✅ SIGN IN SUCCESSFUL!`)
        addLog(`   User: ${data.user.email}`)
        addLog(`   Session: ${data.session ? 'Created' : 'None'}`)
      }
    } catch (error: any) {
      addLog(`❌ Unexpected sign in error: ${error.message}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sign Up Flow Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
            <CardDescription>Enter test email and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>Test the complete authentication flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={testSignUp} 
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              {isLoading ? 'Testing Sign Up...' : 'Test Sign Up'}
            </Button>
            <Button 
              onClick={testSignIn} 
              disabled={!email || !password}
              variant="outline" 
              className="w-full"
            >
              Test Sign In
            </Button>
            <Button onClick={clearLogs} variant="secondary" className="w-full">
              Clear Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Process Logs</CardTitle>
          <CardDescription>Watch exactly what happens during sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-400">Enter email/password above and click "Test Sign Up" to see the complete process...</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800">What This Shows:</h3>
        <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
          <li><strong>Step 1:</strong> Supabase creates user in auth.users (with hashed password)</li>
          <li><strong>Step 2:</strong> We manually try to create profile in public.profiles</li>
          <li><strong>Step 3:</strong> We try to create security settings</li>
          <li><strong>Step 4:</strong> We verify we can query the data back</li>
          <li><strong>Errors:</strong> Will show exact database error codes and messages</li>
        </ul>
      </div>
    </div>
  )
}
