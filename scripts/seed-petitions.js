const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your .env.local file.')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample user profiles (petition authors)
const profiles = [
  {
    id: 'user1',
    email: 'alex.johnson@sxc.edu.np',
    full_name: 'Alex Johnson',
    student_id: 'SXC2024001',
    department: 'Computer Science',
    year: '2',
    role: 'student',
    avatar_url: null,
    profile_visibility: 'public'
  },
  {
    id: 'user2',
    email: 'sarah.davis@sxc.edu.np',
    full_name: 'Sarah Davis',
    student_id: 'SXC2023045',
    department: 'Business Administration',
    year: '3',
    role: 'student',
    avatar_url: null,
    profile_visibility: 'public'
  },
  {
    id: 'user3',
    email: 'michael.chen@sxc.edu.np',
    full_name: 'Michael Chen',
    student_id: 'SXC2022089',
    department: 'Engineering',
    year: '4',
    role: 'student',
    avatar_url: null,
    profile_visibility: 'public'
  },
  {
    id: 'user4',
    email: 'emma.wilson@sxc.edu.np',
    full_name: 'Emma Wilson',
    student_id: 'SXC2023112',
    department: 'Psychology',
    year: '2',
    role: 'student',
    avatar_url: null,
    profile_visibility: 'public'
  },
  {
    id: 'user5',
    email: 'david.kumar@sxc.edu.np',
    full_name: 'David Kumar',
    student_id: 'SXC2024067',
    department: 'Management',
    year: '1',
    role: 'student',
    avatar_url: null,
    profile_visibility: 'public'
  }
]

// Sample petitions
const petitions = [
  {
    id: 'petition1',
    title: 'Improve Campus WiFi Infrastructure',
    description: 'The current WiFi infrastructure is inadequate for the growing student population. We need faster and more reliable internet access in dormitories, libraries, and academic buildings.',
    category: 'infrastructure',
    goal: 500,
    duration: 30,
    status: 'active',
    author_id: 'user1',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'petition2',
    title: 'Extended Library Hours',
    description: 'Students need access to library resources beyond current operating hours. We propose extending library hours until 11 PM on weekdays and opening on weekends.',
    category: 'academic',
    goal: 300,
    duration: 30,
    status: 'active',
    author_id: 'user2',
    created_at: '2024-11-28T14:30:00Z',
    updated_at: '2024-11-28T14:30:00Z'
  },
  {
    id: 'petition3',
    title: 'Better Food Options in Cafeteria',
    description: 'We need more diverse and healthier food options in the campus cafeteria. This includes vegetarian, vegan, and international cuisine options.',
    category: 'facilities',
    goal: 250,
    duration: 30,
    status: 'completed',
    author_id: 'user3',
    created_at: '2024-11-15T09:15:00Z',
    updated_at: '2024-11-20T16:45:00Z'
  },
  {
    id: 'petition4',
    title: 'Mental Health Support Services',
    description: 'Students need better access to mental health counseling and support services. We propose hiring additional counselors and creating peer support groups.',
    category: 'student_welfare',
    goal: 400,
    duration: 30,
    status: 'active',
    author_id: 'user4',
    created_at: '2024-12-02T11:20:00Z',
    updated_at: '2024-12-02T11:20:00Z'
  },
  {
    id: 'petition5',
    title: 'Improved Parking Facilities',
    description: 'The current parking situation is chaotic and insufficient. We need designated parking areas, proper marking, and security measures.',
    category: 'infrastructure',
    goal: 200,
    duration: 30,
    status: 'active',
    author_id: 'user5',
    created_at: '2024-11-25T08:45:00Z',
    updated_at: '2024-11-25T08:45:00Z'
  }
]

// Generate sample signatures for each petition
function generateSignatures() {
  const signatureCounts = [234, 187, 312, 156, 89] // Matches the hardcoded data
  const allSignatures = []
  
  petitions.forEach((petition, petitionIndex) => {
    const count = signatureCounts[petitionIndex]
    
    for (let i = 0; i < count; i++) {
      allSignatures.push({
        petition_id: petition.id,
        user_id: `signer_${petitionIndex}_${i}`, // Generate fake user IDs for signers
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
      })
    }
  })
  
  return allSignatures
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // 1. Insert profiles first (referenced by petitions)
    console.log('📝 Inserting user profiles...')
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .upsert(profiles, { onConflict: 'id' })
    
    if (profilesError) {
      console.error('Error inserting profiles:', profilesError)
      return
    }
    console.log(`✅ Inserted ${profiles.length} user profiles`)
    
    // 2. Insert petitions
    console.log('📋 Inserting petitions...')
    const { data: petitionsData, error: petitionsError } = await supabase
      .from('petitions')
      .upsert(petitions, { onConflict: 'id' })
    
    if (petitionsError) {
      console.error('Error inserting petitions:', petitionsError)
      return
    }
    console.log(`✅ Inserted ${petitions.length} petitions`)
    
    // 3. Insert signatures
    const signatures = generateSignatures()
    console.log('✍️ Inserting signatures...')
    
    // Insert signatures in batches to avoid timeout
    const batchSize = 100
    let insertedSignatures = 0
    
    for (let i = 0; i < signatures.length; i += batchSize) {
      const batch = signatures.slice(i, i + batchSize)
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('signatures')
        .upsert(batch)
      
      if (signaturesError) {
        console.error(`Error inserting signature batch ${Math.floor(i/batchSize) + 1}:`, signaturesError)
        continue
      }
      
      insertedSignatures += batch.length
      console.log(`📝 Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} signatures (Total: ${insertedSignatures})`)
    }
    
    console.log(`✅ Inserted ${insertedSignatures} total signatures`)
    
    // 4. Verify the data
    console.log('🔍 Verifying inserted data...')
    
    const { data: verifyPetitions } = await supabase
      .from('petitions')
      .select('id, title, status')
    
    const { data: verifySignatures } = await supabase
      .from('signatures')
      .select('petition_id')
    
    const { data: verifyProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
    
    console.log('\n📊 Database Summary:')
    console.log(`   Profiles: ${verifyProfiles?.length || 0}`)
    console.log(`   Petitions: ${verifyPetitions?.length || 0}`)
    console.log(`   Signatures: ${verifySignatures?.length || 0}`)
    
    if (verifyPetitions) {
      console.log('\n📋 Petitions:')
      verifyPetitions.forEach(p => {
        const sigCount = verifySignatures?.filter(s => s.petition_id === p.id).length || 0
        console.log(`   • ${p.title} (${p.status}) - ${sigCount} signatures`)
      })
    }
    
    console.log('\n🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

// Run the seeding
seedDatabase()
