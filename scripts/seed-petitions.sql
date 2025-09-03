-- Seed data for petitions system
-- Run this in your Supabase SQL editor
-- This script bypasses RLS for seeding purposes

-- Disable RLS temporarily for seeding
SET session_replication_role = replica;

-- Generate UUIDs for our test users (these will represent auth.users)
-- In real scenario, these would be actual Supabase Auth user IDs
DO $$
DECLARE
    user1_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    user2_id uuid := 'b1ffdc99-8c1b-5ef8-ab7d-5bb8bd381b22';
    user3_id uuid := 'c2eeac99-7c2b-6ef8-9b8d-4bb7bd382c33';
    user4_id uuid := 'd3ddbc99-6c3b-7ef8-8b9d-3bb6bd383d44';
    user5_id uuid := 'e4cccc99-5c4b-8ef8-7bad-2bb5bd384e55';
    
    petition1_id uuid := 'f5bbbc99-4c5b-9ef8-6bad-1bb4bd385f66';
    petition2_id uuid := 'f6aaac99-3c6b-aef8-5bad-0bb3bd386f77';
    petition3_id uuid := 'f799bc99-2c7b-bef8-4bad-9bb2bd387f88';
    petition4_id uuid := 'f888cc99-1c8b-cef8-3bad-8bb1bd388f99';
    petition5_id uuid := 'f977dc99-0c9b-def8-2bad-7bb0bd389faa';
BEGIN

-- 1. Insert user profiles
-- Delete existing test profiles first to avoid conflicts
DELETE FROM profiles WHERE user_id IN (user1_id, user2_id, user3_id, user4_id, user5_id);

INSERT INTO profiles (user_id, first_name, last_name, student_id, department, year, bio, phone, address, avatar_url, created_at, updated_at) VALUES
(user1_id, 'Alex', 'Johnson', '202CS001', 'Computer Science', '2', 'Passionate about technology and campus improvements.', null, null, null, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user2_id, 'Sarah', 'Davis', '202BA045', 'Business Administration', '3', 'Student leader focused on academic resources.', null, null, null, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user3_id, 'Michael', 'Chen', '202ENG089', 'Engineering', '4', 'Final year student passionate about campus facilities.', null, null, null, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user4_id, 'Emma', 'Wilson', '202PSY112', 'Psychology', '2', 'Mental health advocate and peer counselor.', null, null, null, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user5_id, 'David', 'Kumar', '202MGT067', 'Management', '1', 'First year student with fresh perspectives.', null, null, null, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 2. Insert security settings for each user
-- Delete existing test security settings first to avoid conflicts
DELETE FROM security_settings WHERE user_id IN (user1_id, user2_id, user3_id, user4_id, user5_id);

INSERT INTO security_settings (user_id, two_factor_enabled, two_factor_secret, failed_login_attempts, last_failed_login, locked_until, profile_visibility, created_at, updated_at) VALUES
(user1_id, false, null, 0, null, null, 'public', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user2_id, false, null, 0, null, null, 'public', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user3_id, false, null, 0, null, null, 'public', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user4_id, false, null, 0, null, null, 'public', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
(user5_id, false, null, 0, null, null, 'public', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 3. Insert petitions
-- Delete existing test petitions first to avoid conflicts
DELETE FROM petitions WHERE id IN (petition1_id, petition2_id, petition3_id, petition4_id, petition5_id);

INSERT INTO petitions (id, user_id, title, description, target_signatures, current_signatures, status, created_at, updated_at) VALUES
(petition1_id, user1_id, 'Improve Campus WiFi Infrastructure', 'The current WiFi infrastructure is inadequate for the growing student population. We need faster and more reliable internet access in dormitories, libraries, and academic buildings. This petition aims to address connectivity issues that affect students'' ability to study, research, and participate in online learning activities.', 500, 234, 'active', '2024-12-01T10:00:00Z', '2024-12-01T10:00:00Z'),
(petition2_id, user2_id, 'Extended Library Hours', 'Students need access to library resources beyond current operating hours. We propose extending library hours until 11 PM on weekdays and opening on weekends during exam periods. Many students rely on the library as their primary study space and need flexible access to support their academic success.', 300, 187, 'active', '2024-11-28T14:30:00Z', '2024-11-28T14:30:00Z'),
(petition3_id, user3_id, 'Better Food Options in Cafeteria', 'We need more diverse and healthier food options in the campus cafeteria. This includes vegetarian, vegan, and international cuisine options. The current menu lacks variety and healthy choices, making it difficult for students with different dietary preferences and requirements to find suitable meals on campus.', 250, 312, 'completed', '2024-11-15T09:15:00Z', '2024-11-20T16:45:00Z'),
(petition4_id, user4_id, 'Mental Health Support Services', 'Students need better access to mental health counseling and support services. We propose hiring additional counselors, creating peer support groups, and implementing mental wellness programs. The current student-to-counselor ratio is inadequate, and many students face long wait times for appointments.', 400, 156, 'active', '2024-12-02T11:20:00Z', '2024-12-02T11:20:00Z'),
(petition5_id, user5_id, 'Improved Parking Facilities', 'The current parking situation is chaotic and insufficient for the campus community. We need designated parking areas, proper marking, security measures, and potentially a parking permit system. Students and staff often struggle to find parking, leading to tardiness and safety concerns.', 200, 89, 'active', '2024-11-25T08:45:00Z', '2024-11-25T08:45:00Z');

-- 4. Generate petition signatures
-- Delete existing signatures for these petitions first
DELETE FROM petition_signatures WHERE petition_id IN (petition1_id, petition2_id, petition3_id, petition4_id, petition5_id);

-- Generate signatures for petition 1 (WiFi Infrastructure) - 234 signatures
FOR i IN 1..234 LOOP
    INSERT INTO petition_signatures (petition_id, user_id) VALUES
    (petition1_id, uuid_generate_v4());
END LOOP;

-- Generate signatures for petition 2 (Library Hours) - 187 signatures  
FOR i IN 1..187 LOOP
    INSERT INTO petition_signatures (petition_id, user_id) VALUES
    (petition2_id, uuid_generate_v4());
END LOOP;

-- Generate signatures for petition 3 (Food Options) - 312 signatures
FOR i IN 1..312 LOOP
    INSERT INTO petition_signatures (petition_id, user_id) VALUES
    (petition3_id, uuid_generate_v4());
END LOOP;

-- Generate signatures for petition 4 (Mental Health) - 156 signatures
FOR i IN 1..156 LOOP
    INSERT INTO petition_signatures (petition_id, user_id) VALUES
    (petition4_id, uuid_generate_v4());
END LOOP;

-- Generate signatures for petition 5 (Parking) - 89 signatures
FOR i IN 1..89 LOOP
    INSERT INTO petition_signatures (petition_id, user_id) VALUES
    (petition5_id, uuid_generate_v4());
END LOOP;

RAISE NOTICE 'Successfully generated all petition signatures';

END $$;

-- Re-enable RLS
SET session_replication_role = DEFAULT;

-- 5. Verify the seeded data
SELECT 
    p.id,
    p.title,
    p.status,
    p.target_signatures,
    p.current_signatures,
    COUNT(ps.id) as actual_signatures,
    ROUND((COUNT(ps.id)::decimal / p.target_signatures) * 100, 1) as progress_percentage,
    p.created_at
FROM petitions p
LEFT JOIN petition_signatures ps ON p.id = ps.petition_id
WHERE p.id::text LIKE 'f%'
GROUP BY p.id, p.title, p.status, p.target_signatures, p.current_signatures, p.created_at
ORDER BY p.created_at;

-- Show summary counts
SELECT 
    'Profiles' as table_name, 
    COUNT(*) as record_count 
FROM profiles p
JOIN petitions pt ON p.user_id = pt.user_id
WHERE pt.id::text LIKE 'f%'

UNION ALL

SELECT 
    'Security Settings' as table_name, 
    COUNT(*) as record_count 
FROM security_settings s
JOIN petitions pt ON s.user_id = pt.user_id
WHERE pt.id::text LIKE 'f%'

UNION ALL

SELECT 
    'Petitions' as table_name, 
    COUNT(*) as record_count 
FROM petitions
WHERE id::text LIKE 'f%'

UNION ALL

SELECT 
    'Petition Signatures' as table_name, 
    COUNT(*) as record_count 
FROM petition_signatures ps
JOIN petitions p ON ps.petition_id = p.id
WHERE p.id::text LIKE 'f%';
