export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          student_id: string | null
          department: string | null
          year: string | null
          role: 'student' | 'admin' | 'moderator'
          avatar_url: string | null
          profile_visibility: 'public' | 'students' | 'private'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string
          full_name?: string | null
          student_id?: string | null
          department?: string | null
          year?: string | null
          role?: 'student' | 'admin' | 'moderator'
          avatar_url?: string | null
          profile_visibility?: 'public' | 'students' | 'private'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          student_id?: string | null
          department?: string | null
          year?: string | null
          role?: 'student' | 'admin' | 'moderator'
          avatar_url?: string | null
          profile_visibility?: 'public' | 'students' | 'private'
          created_at?: string
          updated_at?: string
        }
      }
      petitions: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          goal: number
          duration: number
          status: 'active' | 'completed' | 'expired'
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          goal: number
          duration: number
          status?: 'active' | 'completed' | 'expired'
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          goal?: number
          duration?: number
          status?: 'active' | 'completed' | 'expired'
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      signatures: {
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
          created_at?: string
        }
        Update: {
          id?: string
          petition_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          petition_id: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          petition_id: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          petition_id?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      security_settings: {
        Row: {
          user_id: string
          two_factor_enabled: boolean
          two_factor_secret: string | null
          failed_login_attempts: number
          last_failed_login: string | null
          locked_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          failed_login_attempts?: number
          last_failed_login?: string | null
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          failed_login_attempts?: number
          last_failed_login?: string | null
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      surveys: {
        Row: {
          id: string
          title: string
          description: string
          questions: Json
          status: string
          created_at: string
          end_date: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          questions: Json
          status?: string
          created_at?: string
          end_date: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          questions?: Json
          status?: string
          created_at?: string
          end_date?: string
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
          created_at?: string
        }
        Update: {
          id?: string
          survey_id?: string
          user_id?: string
          answers?: Json
          created_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string
          options: Json
          status: string
          created_at: string
          end_date: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          options: Json
          status?: string
          created_at?: string
          end_date: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          options?: Json
          status?: string
          created_at?: string
          end_date?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          option_index: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          option_index: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          option_index?: number
          created_at?: string
        }
      }
      complaints: {
        Row: {
          id: string
          title: string
          description: string
          location: string | null
          department: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'in_progress' | 'resolved' | 'closed'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location?: string | null
          department: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string | null
          department?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      forum_topics: {
        Row: {
          id: string
          title: string
          category: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          topic_id: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      forum_replies: {
        Row: {
          id: string
          post_id: string
          content: string
          author_id: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          author_id: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          author_id?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
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
      user_role: 'student' | 'admin' | 'moderator'
      petition_status: 'active' | 'completed' | 'expired'
      complaint_priority: 'low' | 'medium' | 'high' | 'urgent'
      complaint_status: 'pending' | 'in_progress' | 'resolved' | 'closed'
      profile_visibility: 'public' | 'students' | 'private'
    }
  }
}
