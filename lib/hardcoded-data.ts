// ========================================
// HARDCODED DATA - STRUCTURED & REALISTIC
// ========================================
// This file contains all the hardcoded data for the app
// Only users/profiles use the database - everything else is here

export interface Petition {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
  }
  targetSignatures: number
  currentSignatures: number
  status: 'active' | 'completed' | 'expired'
  category: string
  createdAt: string
  expiresAt?: string
  tags: string[]
}

export interface Survey {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
  }
  status: 'active' | 'completed' | 'draft'
  totalResponses: number
  createdAt: string
  expiresAt?: string
  questions: {
    id: string
    question: string
    type: 'multiple_choice' | 'text' | 'rating' | 'yes_no'
    options?: string[]
  }[]
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  category: string
  replies: number
  likes: number
  createdAt: string
  tags: string[]
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  description?: string
  author: {
    name: string
    avatar?: string
  }
  options: PollOption[]
  totalVotes: number
  status: 'active' | 'completed'
  createdAt: string
  expiresAt?: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  category: 'academic' | 'facilities' | 'administration' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'submitted' | 'under_review' | 'resolved' | 'closed'
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

// ========================================
// HARDCODED PETITIONS DATA
// ========================================
export const hardcodedPetitions: Petition[] = [
  {
    id: '1',
    title: 'Extend Library Hours During Exam Season',
    description: 'We request that the university library extend its operating hours to 24/7 during the final exam period to provide students with adequate study space and resources.',
    author: {
      name: 'Sarah Johnson',
      avatar: '/placeholder-user.jpg'
    },
    targetSignatures: 500,
    currentSignatures: 347,
    status: 'active',
    category: 'Academic',
    createdAt: '2025-08-28T10:00:00Z',
    expiresAt: '2025-09-15T23:59:59Z',
    tags: ['library', 'study', 'exams', 'facilities']
  },
  {
    id: '2',
    title: 'Improve Campus Wi-Fi Infrastructure',
    description: 'The current Wi-Fi network is insufficient for the growing student body. We need faster, more reliable internet access across all campus buildings.',
    author: {
      name: 'Michael Chen',
      avatar: '/placeholder-user.jpg'
    },
    targetSignatures: 750,
    currentSignatures: 623,
    status: 'active',
    category: 'Technology',
    createdAt: '2025-08-25T14:30:00Z',
    expiresAt: '2025-09-20T23:59:59Z',
    tags: ['wifi', 'technology', 'infrastructure', 'internet']
  },
  {
    id: '3',
    title: 'Add More Healthy Food Options in Cafeteria',
    description: 'Students need access to nutritious, affordable meal options. We propose adding a dedicated healthy food station with fresh salads, fruits, and vegetarian options.',
    author: {
      name: 'Emily Rodriguez',
      avatar: '/placeholder-user.jpg'
    },
    targetSignatures: 300,
    currentSignatures: 289,
    status: 'active',
    category: 'Food Services',
    createdAt: '2025-08-20T09:15:00Z',
    expiresAt: '2025-09-10T23:59:59Z',
    tags: ['food', 'health', 'cafeteria', 'nutrition']
  },
  {
    id: '4',
    title: 'Create More Student Parking Spaces',
    description: 'The current parking situation is inadequate. Many students arrive early just to find parking, affecting their academic schedule.',
    author: {
      name: 'David Kim',
      avatar: '/placeholder-user.jpg'
    },
    targetSignatures: 400,
    currentSignatures: 234,
    status: 'active',
    category: 'Transportation',
    createdAt: '2025-08-22T16:45:00Z',
    expiresAt: '2025-09-12T23:59:59Z',
    tags: ['parking', 'transportation', 'campus', 'accessibility']
  },
  {
    id: '5',
    title: 'Implement Mental Health Support Program',
    description: 'We need a comprehensive mental health support program including counselors, support groups, and stress management workshops.',
    author: {
      name: 'Lisa Wang',
      avatar: '/placeholder-user.jpg'
    },
    targetSignatures: 600,
    currentSignatures: 445,
    status: 'active',
    category: 'Health & Wellness',
    createdAt: '2025-08-18T11:20:00Z',
    expiresAt: '2025-09-25T23:59:59Z',
    tags: ['mental health', 'wellness', 'counseling', 'support']
  }
]

// ========================================
// HARDCODED SURVEYS DATA
// ========================================
export const hardcodedSurveys: Survey[] = [
  {
    id: '1',
    title: 'Campus Dining Experience Survey',
    description: 'Help us improve our dining services by sharing your feedback about food quality, variety, and service.',
    author: {
      name: 'Student Services',
      avatar: '/placeholder-logo.png'
    },
    status: 'active',
    totalResponses: 456,
    createdAt: '2025-08-30T08:00:00Z',
    expiresAt: '2025-09-30T23:59:59Z',
    questions: [
      {
        id: '1',
        question: 'How would you rate the overall food quality?',
        type: 'rating'
      },
      {
        id: '2',
        question: 'Which dining hall do you visit most frequently?',
        type: 'multiple_choice',
        options: ['Main Dining Hall', 'Student Union', 'Coffee Shop', 'Food Court']
      },
      {
        id: '3',
        question: 'What improvements would you like to see?',
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    title: 'Course Registration System Feedback',
    description: 'Your input will help us improve the online course registration process for next semester.',
    author: {
      name: 'Academic Affairs',
      avatar: '/placeholder-logo.png'
    },
    status: 'active',
    totalResponses: 298,
    createdAt: '2025-08-27T10:30:00Z',
    expiresAt: '2025-09-15T23:59:59Z',
    questions: [
      {
        id: '1',
        question: 'How easy was it to register for courses this semester?',
        type: 'rating'
      },
      {
        id: '2',
        question: 'Did you experience any technical issues?',
        type: 'yes_no'
      },
      {
        id: '3',
        question: 'What was the most frustrating part of registration?',
        type: 'text'
      }
    ]
  }
]

// ========================================
// HARDCODED FORUM POSTS DATA
// ========================================
export const hardcodedForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Tips for First-Year Students',
    content: 'Starting college can be overwhelming. Here are some tips that helped me during my first year...',
    author: {
      name: 'Alex Thompson',
      avatar: '/placeholder-user.jpg'
    },
    category: 'Academic Help',
    replies: 23,
    likes: 45,
    createdAt: '2025-09-01T14:20:00Z',
    tags: ['tips', 'first-year', 'advice']
  },
  {
    id: '2',
    title: 'Study Group for CS 101',
    content: 'Looking to form a study group for Computer Science 101. Anyone interested in meeting twice a week?',
    author: {
      name: 'Jamie Liu',
      avatar: '/placeholder-user.jpg'
    },
    category: 'Study Groups',
    replies: 12,
    likes: 18,
    createdAt: '2025-08-31T09:45:00Z',
    tags: ['study group', 'computer science', 'CS101']
  },
  {
    id: '3',
    title: 'Campus Events This Weekend',
    content: 'Here\'s a list of all the exciting events happening on campus this weekend...',
    author: {
      name: 'Student Activities',
      avatar: '/placeholder-logo.png'
    },
    category: 'Events',
    replies: 8,
    likes: 32,
    createdAt: '2025-08-30T16:00:00Z',
    tags: ['events', 'weekend', 'campus life']
  }
]

// ========================================
// HARDCODED POLLS DATA
// ========================================
export const hardcodedPolls: Poll[] = [
  {
    id: '1',
    question: 'What time should the gym open on weekends?',
    description: 'Help us decide the best weekend hours for the campus fitness center.',
    author: {
      name: 'Recreation Center',
      avatar: '/placeholder-logo.png'
    },
    options: [
      { id: '1', text: '6:00 AM', votes: 45 },
      { id: '2', text: '8:00 AM', votes: 78 },
      { id: '3', text: '10:00 AM', votes: 23 },
      { id: '4', text: 'Keep current hours', votes: 12 }
    ],
    totalVotes: 158,
    status: 'active',
    createdAt: '2025-08-29T12:00:00Z',
    expiresAt: '2025-09-05T23:59:59Z'
  },
  {
    id: '2',
    question: 'Which guest speaker would you like to see next semester?',
    description: 'Vote for your preferred guest speaker for our leadership series.',
    author: {
      name: 'Student Government',
      avatar: '/placeholder-logo.png'
    },
    options: [
      { id: '1', text: 'Tech Industry Leader', votes: 89 },
      { id: '2', text: 'Environmental Activist', votes: 67 },
      { id: '3', text: 'Social Entrepreneur', votes: 54 },
      { id: '4', text: 'Artist/Creative', votes: 32 }
    ],
    totalVotes: 242,
    status: 'active',
    createdAt: '2025-08-26T15:30:00Z',
    expiresAt: '2025-09-10T23:59:59Z'
  }
]

// ========================================
// HARDCODED COMPLAINTS DATA
// ========================================
export const hardcodedComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Broken Air Conditioning in Science Building',
    description: 'The AC has been broken in Room 204 of the Science Building for over a week, making it difficult to concentrate during lectures.',
    category: 'facilities',
    priority: 'high',
    status: 'under_review',
    author: {
      name: 'Anonymous Student',
      avatar: '/placeholder-user.jpg'
    },
    createdAt: '2025-09-01T10:30:00Z',
    updatedAt: '2025-09-02T14:15:00Z'
  },
  {
    id: '2',
    title: 'Inconsistent Grading in Mathematics Department',
    description: 'There seems to be a significant disparity in grading standards between different sections of the same math course.',
    category: 'academic',
    priority: 'medium',
    status: 'submitted',
    author: {
      name: 'Concerned Student',
      avatar: '/placeholder-user.jpg'
    },
    createdAt: '2025-08-30T16:45:00Z',
    updatedAt: '2025-08-30T16:45:00Z'
  }
]

// ========================================
// HELPER FUNCTIONS
// ========================================
export const getPetitionById = (id: string): Petition | undefined => {
  return hardcodedPetitions.find(petition => petition.id === id)
}

export const getSurveyById = (id: string): Survey | undefined => {
  return hardcodedSurveys.find(survey => survey.id === id)
}

export const getForumPostById = (id: string): ForumPost | undefined => {
  return hardcodedForumPosts.find(post => post.id === id)
}

export const getPollById = (id: string): Poll | undefined => {
  return hardcodedPolls.find(poll => poll.id === id)
}

export const getComplaintById = (id: string): Complaint | undefined => {
  return hardcodedComplaints.find(complaint => complaint.id === id)
}

// Filter functions
export const getActivePetitions = (): Petition[] => {
  return hardcodedPetitions.filter(petition => petition.status === 'active')
}

export const getActiveSurveys = (): Survey[] => {
  return hardcodedSurveys.filter(survey => survey.status === 'active')
}

export const getActivePolls = (): Poll[] => {
  return hardcodedPolls.filter(poll => poll.status === 'active')
}

export const getOpenComplaints = (): Complaint[] => {
  return hardcodedComplaints.filter(complaint => 
    complaint.status === 'submitted' || complaint.status === 'under_review'
  )
}
