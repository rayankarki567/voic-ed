import { Database } from './supabase'

// Export specific table types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Petition = Database['public']['Tables']['petitions']['Row']
export type PetitionInsert = Database['public']['Tables']['petitions']['Insert']
export type PetitionUpdate = Database['public']['Tables']['petitions']['Update']

export type Survey = Database['public']['Tables']['surveys']['Row']
export type SurveyInsert = Database['public']['Tables']['surveys']['Insert']
export type SurveyUpdate = Database['public']['Tables']['surveys']['Update']

export type Poll = Database['public']['Tables']['polls']['Row']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollUpdate = Database['public']['Tables']['polls']['Update']

export type ForumTopic = Database['public']['Tables']['forum_topics']['Row']
export type ForumTopicInsert = Database['public']['Tables']['forum_topics']['Insert']
export type ForumTopicUpdate = Database['public']['Tables']['forum_topics']['Update']

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type PetitionStatus = Database['public']['Enums']['petition_status']
export type ComplaintPriority = Database['public']['Enums']['complaint_priority']
export type ComplaintStatus = Database['public']['Enums']['complaint_status']
export type ProfileVisibility = Database['public']['Enums']['profile_visibility']
