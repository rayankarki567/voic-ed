'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface NotificationSetting {
  id: string
  label: string
  description: string
  key: string
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'email-notifications',
    label: 'Email Notifications',
    description: 'Receive email notifications about important updates',
    key: 'emailNotifications'
  },
  {
    id: 'survey-reminders',
    label: 'Survey Reminders',
    description: 'Get reminded about pending surveys',
    key: 'surveyReminders'
  },
  {
    id: 'petition-updates',
    label: 'Petition Updates',
    description: 'Receive updates about petitions you have signed',
    key: 'petitionUpdates'
  },
  {
    id: 'forum-replies',
    label: 'Forum Replies',
    description: 'Get notified when someone replies to your posts',
    key: 'forumReplies'
  },
  {
    id: 'voting-reminders',
    label: 'Voting Reminders',
    description: 'Receive reminders about active voting events',
    key: 'votingReminders'
  }
]

export function NotificationSettings() {
  const { user, refreshSession } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [settings, setSettings] = useState<Record<string, boolean>>({
    emailNotifications: true,
    surveyReminders: true,
    petitionUpdates: true,
    forumReplies: true,
    votingReminders: true
  })

  const handleToggle = async (key: string) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const newValue = !settings[key]
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          [key]: newValue,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSettings(prev => ({
        ...prev,
        [key]: newValue
      }))

      await refreshSession()
      
      toast({
        title: 'Settings Updated',
        description: 'Your notification preferences have been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_SETTINGS.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <label
                htmlFor={setting.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {setting.label}
              </label>
              <p className="text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              checked={settings[setting.key]}
              onCheckedChange={() => handleToggle(setting.key)}
              disabled={isLoading}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
