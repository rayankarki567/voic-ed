import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    console.log('Testing database trigger...')
    
    // Test 1: Check if our repair function exists and works
    const { data: repairResult, error: repairError } = await supabase
      .rpc('ensure_user_completeness')
    
    if (repairError) {
      console.error('Repair function error:', repairError)
      return NextResponse.json({
        success: false,
        error: 'Repair function failed',
        details: repairError.message
      }, { status: 500 })
    }

    console.log('Repair function result:', repairResult)

    // Test 2: Check if trigger exists
    const { data: triggerData, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation, event_object_table')
      .eq('trigger_name', 'on_auth_user_created')
    
    if (triggerError) {
      console.error('Trigger check error:', triggerError)
    } else {
      console.log('Trigger data:', triggerData)
    }

    // Test 3: Check table structures
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      repairResult,
      triggerExists: (triggerData?.length ?? 0) > 0,
      triggerData,
      tableTests: {
        users: { error: usersError?.message, hasData: !!usersData?.length },
        profiles: { error: profilesError?.message, hasData: !!profilesData?.length }
      }
    })

  } catch (error: any) {
    console.error('Test trigger error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message
    }, { status: 500 })
  }
}
