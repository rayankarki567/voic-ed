'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import type { SecuritySettings } from '@/types/profile'

export function usePrivacySettings() {
  const { user, security, refreshSession } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const updatePrivacy = async (visibility: SecuritySettings['profile_visibility']) => {
    if (!user) return

    try {
      setIsLoading(true)

      const { error } = await supabase
        .from('security_settings')
        .update({
          profile_visibility: visibility,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (error) throw error

      await refreshSession()

      toast({
        title: 'Privacy Updated',
        description: 'Your privacy settings have been updated successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update privacy settings',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    visibility: security?.profile_visibility || 'public',
    isLoading,
    updatePrivacy,
  }
}
