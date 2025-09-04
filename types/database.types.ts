export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'admin' | 'moderator'
export type ProfileVisibility = 'public' | 'students' | 'private'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: UserRole
        }
        Update: {
          email?: string
          role?: UserRole
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          email_notifications: boolean
          survey_reminders: boolean
          petition_updates: boolean
          forum_replies: boolean
          voting_reminders: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email_notifications?: boolean
          survey_reminders?: boolean
          petition_updates?: boolean
          forum_replies?: boolean
          voting_reminders?: boolean
        }
        Update: {
          email_notifications?: boolean
          survey_reminders?: boolean
          petition_updates?: boolean
          forum_replies?: boolean
          voting_reminders?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          student_id: string | null
          department: string | null
          year: string | null
          bio: string | null
          phone: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          student_id?: string | null
          department?: string | null
          year?: string | null
          bio?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          student_id?: string | null
          department?: string | null
          year?: string | null
          bio?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
        }
      }
      security_settings: {
        Row: {
          id: string
          user_id: string
          two_factor_enabled: boolean
          two_factor_secret: string | null
          failed_login_attempts: number
          last_failed_login: string | null
          locked_until: string | null
          profile_visibility: ProfileVisibility
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          failed_login_attempts?: number
          last_failed_login?: string | null
          locked_until?: string | null
          profile_visibility?: ProfileVisibility
        }
        Update: {
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          failed_login_attempts?: number
          last_failed_login?: string | null
          locked_until?: string | null
          profile_visibility?: ProfileVisibility
        }
      }
      petitions: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string
          target_signatures: number
          current_signatures: number
          status: string
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description: string
          target_signatures: number
          current_signatures?: number
          status?: string
          expires_at?: string | null
        }
        Update: {
          title?: string
          description?: string
          target_signatures?: number
          current_signatures?: number
          status?: string
          expires_at?: string | null
        }
      }
      petition_signatures: {
        Row: {
          id: string
          petition_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          petition_id: string
          user_id: string
        }
        Update: {
          petition_id?: string
          user_id?: string
        }
      }
      surveys: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string
          status: string
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description: string
          status?: string
          expires_at?: string | null
        }
        Update: {
          title?: string
          description?: string
          status?: string
          expires_at?: string | null
        }
      }
      survey_questions: {
        Row: {
          id: string
          survey_id: string
          question: string
          question_type: string
          options: Json | null
          required: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          question: string
          question_type: string
          options?: Json | null
          required?: boolean
          order_index: number
        }
        Update: {
          question?: string
          question_type?: string
          options?: Json | null
          required?: boolean
          order_index?: number
        }
      }
      survey_responses: {
        Row: {
          id: string
          survey_id: string
          user_id: string
          answers: Json
          created_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          user_id: string
          answers: Json
        }
        Update: {
          answers?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      profile_visibility: ProfileVisibility
    }
  }
}
