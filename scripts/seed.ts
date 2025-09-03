import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabase.from('petition_signatures').delete().neq('id', 0)
    await supabase.from('poll_votes').delete().neq('id', 0)
    await supabase.from('survey_responses').delete().neq('id', 0)
    await supabase.from('forum_posts').delete().neq('id', 0)
    await supabase.from('complaints').delete().neq('id', 0)
    await supabase.from('petitions').delete().neq('id', 0)
    await supabase.from('polls').delete().neq('id', 0)
    await supabase.from('surveys').delete().neq('id', 0)
    await supabase.from('forums').delete().neq('id', 0)

    // Seed forums
    console.log('📝 Seeding forums...')
    const { data: forums } = await supabase.from('forums').insert([
      {
        title: 'General Discussion',
        description: 'General discussion about community issues and topics',
        category: 'general'
      },
      {
        title: 'Local Development',
        description: 'Discuss local development projects and initiatives',
        category: 'development'
      },
      {
        title: 'Environmental Issues',
        description: 'Environmental concerns and green initiatives',
        category: 'environment'
      }
    ]).select()

    // Seed surveys
    console.log('📊 Seeding surveys...')
    const { data: surveys } = await supabase.from('surveys').insert([
      {
        title: 'Community Infrastructure Priorities',
        description: 'Help us understand which infrastructure improvements are most important to you',
        questions: [
          {
            id: '1',
            question: 'What is your top infrastructure priority?',
            type: 'multiple_choice',
            options: ['Roads and Transportation', 'Public Parks', 'Internet Connectivity', 'Healthcare Facilities']
          },
          {
            id: '2',
            question: 'How satisfied are you with current public transportation?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: { 1: 'Very Dissatisfied', 5: 'Very Satisfied' } }
          }
        ],
        status: 'active',
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Community Safety Assessment',
        description: 'Share your thoughts on community safety and security',
        questions: [
          {
            id: '1',
            question: 'How safe do you feel in your neighborhood at night?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: { 1: 'Very Unsafe', 5: 'Very Safe' } }
          },
          {
            id: '2',
            question: 'What safety improvements would you like to see?',
            type: 'text'
          }
        ],
        status: 'active',
        ends_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]).select()

    // Seed polls
    console.log('🗳️ Seeding polls...')
    const { data: polls } = await supabase.from('polls').insert([
      {
        title: 'New Community Center Location',
        description: 'Vote on the preferred location for our new community center',
        options: ['Downtown Area', 'Near Schools District', 'Central Park Location', 'Suburban Area'],
        type: 'single_choice',
        status: 'active',
        ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Library Opening Hours',
        description: 'What should be the new library opening hours?',
        options: ['8 AM - 6 PM', '9 AM - 8 PM', '10 AM - 9 PM', 'Weekend Only'],
        type: 'single_choice',
        status: 'active',
        ends_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]).select()

    // Seed petitions
    console.log('📝 Seeding petitions...')
    const { data: petitions } = await supabase.from('petitions').insert([
      {
        title: 'Improve Public Transportation',
        description: 'We petition the local government to increase bus frequency and extend routes to underserved areas',
        content: 'Our community needs better public transportation. Current bus routes are insufficient and many residents struggle to access essential services. We propose: 1) Increased bus frequency during peak hours, 2) Extended routes to suburban areas, 3) Better accessibility for disabled residents.',
        target_signatures: 500,
        status: 'active',
        category: 'transportation'
      },
      {
        title: 'Install More Street Lights',
        description: 'Petition for better street lighting to improve safety in residential areas',
        content: 'Many residential streets lack adequate lighting, creating safety concerns for pedestrians, especially during evening hours. We request the installation of energy-efficient LED street lights on Main Street, Oak Avenue, and surrounding residential areas.',
        target_signatures: 200,
        status: 'active',
        category: 'safety'
      }
    ]).select()

    // Seed complaints
    console.log('📢 Seeding complaints...')
    await supabase.from('complaints').insert([
      {
        title: 'Pothole on Main Street',
        description: 'Large pothole causing vehicle damage',
        category: 'infrastructure',
        priority: 'high',
        status: 'pending',
        location: 'Main Street, near intersection with Oak Ave'
      },
      {
        title: 'Noise Complaint - Construction',
        description: 'Construction work starting too early in residential area',
        category: 'noise',
        priority: 'medium',
        status: 'in_progress',
        location: 'Residential area on Elm Street'
      },
      {
        title: 'Broken Streetlight',
        description: 'Streetlight has been broken for two weeks',
        category: 'utilities',
        priority: 'medium',
        status: 'pending',
        location: 'Corner of Pine St and 2nd Ave'
      }
    ])

    // Seed some forum posts
    if (forums && forums.length > 0) {
      console.log('💬 Seeding forum posts...')
      await supabase.from('forum_posts').insert([
        {
          forum_id: forums[0].id,
          title: 'Welcome to our community forum!',
          content: 'This is a place for residents to discuss local issues, share ideas, and stay informed about community developments. Please keep discussions respectful and on-topic.',
          author_name: 'Community Admin'
        },
        {
          forum_id: forums[1].id,
          title: 'Proposed bike lane on Main Street',
          content: 'What are your thoughts on adding a bike lane to Main Street? This could improve safety for cyclists and encourage more eco-friendly transportation.',
          author_name: 'Local Resident'
        },
        {
          forum_id: forums[2].id,
          title: 'Community garden project',
          content: 'Interested in starting a community garden in the vacant lot on Oak Street. Looking for volunteers and ideas on how to get started.',
          author_name: 'Green Thumb'
        }
      ])
    }

    // Add some sample votes and responses
    if (polls && polls.length > 0) {
      console.log('🗳️ Adding sample poll votes...')
      await supabase.from('poll_votes').insert([
        { poll_id: polls[0].id, option_index: 0, voter_ip: '192.168.1.1' },
        { poll_id: polls[0].id, option_index: 1, voter_ip: '192.168.1.2' },
        { poll_id: polls[0].id, option_index: 0, voter_ip: '192.168.1.3' },
        { poll_id: polls[1].id, option_index: 1, voter_ip: '192.168.1.1' },
        { poll_id: polls[1].id, option_index: 2, voter_ip: '192.168.1.4' }
      ])
    }

    if (petitions && petitions.length > 0) {
      console.log('✍️ Adding sample petition signatures...')
      await supabase.from('petition_signatures').insert([
        { petition_id: petitions[0].id, signer_name: 'John Smith', signer_email: 'john@example.com' },
        { petition_id: petitions[0].id, signer_name: 'Mary Johnson', signer_email: 'mary@example.com' },
        { petition_id: petitions[0].id, signer_name: 'David Wilson', signer_email: 'david@example.com' },
        { petition_id: petitions[1].id, signer_name: 'Sarah Brown', signer_email: 'sarah@example.com' },
        { petition_id: petitions[1].id, signer_name: 'Mike Davis', signer_email: 'mike@example.com' }
      ])
    }

    console.log('✅ Database seeding completed successfully!')
    console.log(`- ${forums?.length || 0} forums created`)
    console.log(`- ${surveys?.length || 0} surveys created`)
    console.log(`- ${polls?.length || 0} polls created`)
    console.log(`- ${petitions?.length || 0} petitions created`)
    console.log('- 3 complaints created')
    console.log('- Sample forum posts, votes, and signatures added')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
