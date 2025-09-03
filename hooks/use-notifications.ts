'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import type { UserPreferences } from '@/types/profile'

export function useNotifications() {
  const { user, refreshSession } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    survey_reminders: true,
    petition_updates: true,
    forum_replies: true,
    voting_reminders: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  useEffect(() => {
    if (user) {
      loadPreferences()
    }
  }, [user])

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setPreferences(data)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = async (key: keyof UserPreferences, value: boolean) => {
    if (!user) return

    try {
      setIsSaving(true)

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          [key]: value,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setPreferences(prev => ({
        ...prev,
        [key]: value,
      }))

      await refreshSession()

      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreference,
  }
}
