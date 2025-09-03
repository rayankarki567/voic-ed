'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type PrivacyLevel = 'public' | 'students' | 'private'

export function PrivacySettings() {
  const { user, security, refreshSession } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handlePrivacyChange = async (value: PrivacyLevel) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({ profile_visibility: value })
        .eq('user_id', user.id)

      if (error) throw error

      await refreshSession()
      
      toast({
        title: 'Privacy Settings Updated',
        description: 'Your profile privacy settings have been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="privacy" className="text-sm font-medium">
            Profile Visibility
          </label>
          <Select
            disabled={isLoading}
            value={security?.profile_visibility || 'public'}
            onValueChange={handlePrivacyChange}
          >
            <SelectTrigger id="privacy">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Visible to everyone</SelectItem>
              <SelectItem value="students">Students Only - Visible to verified students</SelectItem>
              <SelectItem value="private">Private - Only visible to you</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {security?.profile_visibility === 'public' && 
              'Your profile is visible to everyone'}
            {security?.profile_visibility === 'students' && 
              'Your profile is only visible to verified students'}
            {security?.profile_visibility === 'private' && 
              'Your profile is only visible to you'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
