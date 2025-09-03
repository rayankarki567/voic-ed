-- ========================================
-- MINIMAL DATABASE SETUP - USERS, PROFILES & SECURITY SETTINGS
-- ========================================
-- This script sets up automatic profile and security_settings creation
-- for every new user that signs up via Google OAuth or email

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for user role and profile visibility
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_visibility AS ENUM ('public', 'students', 'private');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================
-- 1. PROFILES TABLE (essential user profile data)
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name text,
    last_name text,
    student_id text,
    department text,
    year text,
    bio text,
    phone text,
    address text,
    avatar_url text,
    role user_role DEFAULT 'student' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- ========================================
-- 2. SECURITY SETTINGS TABLE (user security preferences)
-- ========================================
CREATE TABLE IF NOT EXISTS public.security_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    two_factor_enabled boolean DEFAULT false NOT NULL,
    two_factor_secret text,
    failed_login_attempts integer DEFAULT 0 NOT NULL,
    last_failed_login timestamptz,
    locked_until timestamptz,
    profile_visibility profile_visibility DEFAULT 'public' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- ========================================
-- 3. AUTO-CREATE PROFILES & SECURITY SETTINGS TRIGGER FUNCTION
-- ========================================
-- This function automatically creates BOTH profile AND security_settings
-- when a new user is created in auth.users (Google OAuth, email signup, etc.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Create profile entry with Google OAuth data
    INSERT INTO public.profiles (
        user_id, 
        first_name, 
        last_name, 
        avatar_url,
        role
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'given_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1)),
        COALESCE(NEW.raw_user_meta_data->>'family_name', 
            CASE 
                WHEN array_length(string_to_array(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' '), 1) > 1 
                THEN array_to_string((string_to_array(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' '))[2:], ' ')
                ELSE NULL 
            END
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        'student'
    );
    
    -- Create security settings entry with defaults
    INSERT INTO public.security_settings (
        user_id, 
        two_factor_enabled, 
        failed_login_attempts, 
        profile_visibility
    )
    VALUES (
        NEW.id, 
        false, 
        0, 
        'public'
    );
    
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- ========================================
-- 4. CREATE TRIGGER FOR AUTO PROFILE & SECURITY CREATION
-- ========================================
-- This trigger fires whenever a new user is created in auth.users
-- (Google OAuth, email signup, etc.)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 5. UPDATED_AT TRIGGERS
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_security_settings_updated_at ON public.security_settings;
CREATE TRIGGER handle_security_settings_updated_at
    BEFORE UPDATE ON public.security_settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- ========================================
-- 6. RLS POLICIES (Simple and permissive for development)
-- ========================================
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own security settings" ON public.security_settings;
DROP POLICY IF EXISTS "Users can update their own security settings" ON public.security_settings;
DROP POLICY IF EXISTS "Users can insert their own security settings" ON public.security_settings;

-- Profile policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Security settings policies
CREATE POLICY "Users can view their own security settings"
    ON public.security_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
    ON public.security_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
    ON public.security_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 7. INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS security_settings_user_id_idx ON public.security_settings(user_id);

-- ========================================
-- 8. VERIFY SETUP
-- ========================================
-- Check if everything is set up correctly
SELECT 
    'Setup completed!' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') as profiles_table_exists,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'security_settings' AND table_schema = 'public') as security_settings_table_exists,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') as trigger_function_exists;

-- Show table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'security_settings') 
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;
