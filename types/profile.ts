export interface UserPreferences {
  email_notifications: boolean
  survey_reminders: boolean
  petition_updates: boolean
  forum_replies: boolean
  voting_reminders: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  email: string
  name: string | null
  avatar_url: string | null
  student_id: string | null
  department: string | null
  year: string | null
  created_at: string
  updated_at: string
}

export interface SecuritySettings {
  user_id: string
  two_factor_enabled: boolean
  two_factor_secret: string | null
  failed_login_attempts: number
  last_failed_login: string | null
  locked_until: string | null
  profile_visibility: 'public' | 'students' | 'private'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  profile: Profile | null
  security: SecuritySettings | null
  preferences: UserPreferences | null
}
