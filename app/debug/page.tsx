"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from '@/types/database.types'

export default function DatabaseTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const runTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting database tests...')
      
      // Test 1: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        addResult(`❌ Auth Error: ${authError.message}`)
        return
      }
      
      if (user) {
        addResult(`✅ User authenticated: ${user.email} (${user.id})`)
      } else {
        addResult('❌ No authenticated user')
        return
      }

      // Test 2: Try to read from profiles
      addResult('Testing profiles SELECT...')
      const { data: profiles, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3)
      
      if (selectError) {
        addResult(`❌ Profiles SELECT Error: ${selectError.message} (Code: ${selectError.code})`)
      } else {
        addResult(`✅ Profiles SELECT Success: Found ${profiles?.length || 0} profiles`)
      }

      // Test 3: Try to insert a test profile
      addResult('Testing profiles INSERT...')
      const testProfileData = {
        user_id: user.id,
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert(testProfileData)
        .select()
      
      if (insertError) {
        addResult(`❌ Profiles INSERT Error: ${insertError.message} (Code: ${insertError.code})`)
        addResult(`❌ Insert Error Details: ${JSON.stringify(insertError, null, 2)}`)
      } else {
        addResult(`✅ Profiles INSERT Success: Created profile`)
        
        // Clean up the test profile
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('user_id', user.id)
        
        if (!deleteError) {
          addResult('✅ Test profile cleaned up')
        }
      }

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>
            Test the database connection and RLS policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Running Tests...' : 'Run Database Tests'}
            </Button>
            
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <h3 className="font-medium mb-2">Test Results:</h3>
              {testResults.length === 0 ? (
                <p className="text-gray-500">Click "Run Database Tests" to start</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
