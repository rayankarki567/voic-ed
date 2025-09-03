import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import * as dotenv from 'dotenv'
import { SupabaseClient } from '@supabase/supabase-js'
import { 
  ProfileInsert, 
  PetitionInsert, 
  ForumTopicInsert, 
  SurveyInsert, 
  PollInsert,
  UserRole,
  PetitionStatus,
  ProfileVisibility 
} from '@/types/types'

// Custom type for Supabase client
type TypedSupabaseClient = SupabaseClient<Database>

// Load environment variables from .env file
dotenv.config()

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables')
}

// Initialize Supabase client with types
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

// Sample data
const sampleData = {
  petitionCategories: [
    'Academic',
    'Campus Facilities',
    'Student Services',
    'University Policies',
    'Student Life',
    'Others'
  ],
  forumCategories: [
    'General Discussion',
    'Academic',
    'Campus Life',
    'Events',
    'Student Organizations',
    'Career'
  ],
  departments: [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts',
    'Science',
    'Medicine'
  ],
  years: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
  complaintPriorities: ['low', 'medium', 'high', 'urgent'] as const,
  complaintStatuses: ['pending', 'in_progress', 'resolved', 'closed'] as const,
  petitionStatuses: ['active', 'completed', 'expired'] as const,
  profileVisibilities: ['public', 'students', 'private'] as const,
  userRoles: ['student', 'admin', 'moderator'] as const
} as const

// Sample profiles for seeding
const sampleProfiles: ProfileInsert[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@university.edu',
    full_name: 'Admin User',
    student_id: 'ADMIN001',
    department: sampleData.departments[0],
    year: sampleData.years[3],
    role: 'admin',
    profile_visibility: 'public'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'moderator@university.edu',
    full_name: 'Moderator User',
    student_id: 'MOD001',
    department: sampleData.departments[1],
    year: sampleData.years[2],
    role: 'moderator',
    profile_visibility: 'students'
  }
]

// Sample petitions for seeding
// Sample petitions for seeding
const samplePetitions: PetitionInsert[] = [
  {
    title: 'Improve Campus Wi-Fi Coverage',
    description: 'Request for better Wi-Fi coverage in all campus buildings',
    category: sampleData.petitionCategories[1],
    goal: 500,
    duration: 30,
    author_id: sampleProfiles[0].id,
    status: 'active'
  },
  {
    title: 'Extended Library Hours During Finals',
    description: 'Petition to keep the library open 24/7 during final exams',
    category: sampleData.petitionCategories[0],
    goal: 1000,
    duration: 14,
    author_id: sampleProfiles[1].id,
    status: 'active'
  }
]

// Sample forum topics for seeding
const sampleForumTopics: ForumTopicInsert[] = [
  {
    title: 'Welcome to the Student Forum',
    category: sampleData.forumCategories[0],
    status: 'active'
  },
  {
    title: 'Final Exam Study Groups',
    category: sampleData.forumCategories[1],
    status: 'active'
  }
]

// Sample survey for seeding
const sampleSurveys: SurveyInsert[] = [
  {
    title: 'Student Satisfaction Survey',
    description: 'Help us improve your campus experience',
    questions: [
      {
        type: 'multiple_choice',
        question: 'How satisfied are you with campus facilities?',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
      },
      {
        type: 'text',
        question: 'What improvements would you like to see on campus?'
      }
    ],
    status: 'active',
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  }
]

// Sample polls for seeding
const samplePolls: PollInsert[] = [
  {
    title: 'Preferred Study Location',
    description: 'Help us understand where students prefer to study',
    options: ['Library', 'Student Center', 'Dormitory', 'Cafeteria', 'Outdoor Spaces'],
    status: 'active',
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  }
]

const departments = [
  'Computer Science',
  'Engineering',
  'Business',
  'Arts',
  'Sciences',
  'Medicine'
] as const

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...')

    // Sample departments
    const departments = [
      'Computer Science',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Business Administration'
    ]

    // Sample forum categories
    const forumCategories = [
      'Academic',
      'Campus Life',
      'Events',
      'Career',
      'General Discussion'
    ]

    // Sample petition categories
    const petitionCategories = [
      'Academic Policy',
      'Campus Facilities',
      'Student Services',
      'Environmental',
      'Student Welfare'
    ]

    // Create a test admin user
    const adminProfile: ProfileInsert = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'admin@university.edu',
      full_name: 'System Admin',
      role: 'admin',
      profile_visibility: 'public',
      student_id: 'ADMIN001'
    }
    
      const { data: admin, error: adminError } = await supabase
        .from('profiles')
        .upsert(adminProfile as any)
        .select('id')
        .single() as { data: { id: string } | null, error: any }

    if (adminError) throw adminError
    console.log('✅ Admin user created')

    // Create forum topics
    const forumTopics = forumCategories.map(category => ({
      title: `Welcome to ${category}`,
      category,
      status: 'active'
    })) as ForumTopicInsert[]

    const { error: topicsError } = await supabase
      .from('forum_topics')
      .upsert(forumTopics as any)

    if (topicsError) throw topicsError
    console.log('✅ Forum topics created')

    // Create a sample petition
    const samplePetition: PetitionInsert = {
      title: 'Extend Library Hours During Finals',
      description: 'We request the university to extend library hours during finals week to 24/7.',
      category: petitionCategories[0],
      goal: 1000,
      duration: 30,
      status: 'active',
      author_id: admin?.id ?? '00000000-0000-0000-0000-000000000000'
    }

    const { error: petitionError } = await supabase
      .from('petitions')
      .upsert(samplePetition as any)

    if (petitionError) throw petitionError
    console.log('✅ Sample petition created')

    // Create a sample survey
    const sampleSurvey: SurveyInsert = {
      title: 'Student Satisfaction Survey',
      description: 'Help us improve your university experience',
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'How satisfied are you with the current academic resources?',
          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
        },
        {
          id: 2,
          type: 'text',
          question: 'What improvements would you like to see in campus facilities?'
        }
      ] as any,
      status: 'active',
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    }

    const { error: surveyError } = await supabase
      .from('surveys')
      .upsert(sampleSurvey as any)

    if (surveyError) throw surveyError
    console.log('✅ Sample survey created')

    // Create a sample poll
    const samplePoll: PollInsert = {
      title: 'Preferred Study Space',
      description: 'Help us understand where students prefer to study',
      options: [
        'Library',
        'Student Center',
        'Department Building',
        'Cafeteria',
        'Outdoor Spaces'
      ] as any,
      status: 'active',
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    }

    const { error: pollError } = await supabase
      .from('polls')
      .upsert(samplePoll as any)

    if (pollError) throw pollError
    console.log('✅ Sample poll created')

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
