-- Enable the necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('student', 'admin', 'moderator');
create type petition_status as enum ('active', 'completed', 'expired');
create type complaint_priority as enum ('low', 'medium', 'high', 'urgent');
create type complaint_status as enum ('pending', 'in_progress', 'resolved', 'closed');
create type profile_visibility as enum ('public', 'students', 'private');

-- Users table (built-in to Supabase auth, we extend it)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  student_id text unique,
  department text,
  year text,
  role user_role default 'student',
  avatar_url text,
  profile_visibility profile_visibility default 'public',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Petitions
create table if not exists public.petitions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  goal integer not null,
  duration integer not null,
  status petition_status default 'active',
  author_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Petition signatures
create table if not exists public.signatures (
  id uuid default uuid_generate_v4() primary key,
  petition_id uuid references public.petitions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(petition_id, user_id)
);

-- Comments
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  petition_id uuid references public.petitions(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Surveys
create table if not exists public.surveys (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  questions jsonb not null, -- Array of questions with their type and options
  status text default 'active',
  created_at timestamptz default now(),
  end_date timestamptz not null
);

-- Survey responses
create table if not exists public.survey_responses (
  id uuid default uuid_generate_v4() primary key,
  survey_id uuid references public.surveys(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  answers jsonb not null, -- Array of answers corresponding to questions
  created_at timestamptz default now(),
  unique(survey_id, user_id)
);

-- Polls
create table if not exists public.polls (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  options jsonb not null, -- Array of options
  status text default 'active',
  created_at timestamptz default now(),
  end_date timestamptz not null
);

-- Poll votes
create table if not exists public.votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  option_index integer not null,
  created_at timestamptz default now(),
  unique(poll_id, user_id)
);

-- Complaints
create table if not exists public.complaints (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  location text,
  department text not null,
  priority complaint_priority not null,
  status complaint_status default 'pending',
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Forum topics
create table if not exists public.forum_topics (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Forum posts
create table if not exists public.forum_posts (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.forum_topics(id) on delete cascade,
  content text not null,
  author_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Forum replies (supports nested replies)
create table if not exists public.forum_replies (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.forum_posts(id) on delete cascade,
  content text not null,
  author_id uuid references public.profiles(id) on delete cascade,
  parent_id uuid references public.forum_replies(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security Policies
alter table public.profiles enable row level security;
alter table public.petitions enable row level security;
alter table public.signatures enable row level security;
alter table public.comments enable row level security;
alter table public.surveys enable row level security;
alter table public.survey_responses enable row level security;
alter table public.polls enable row level security;
alter table public.votes enable row level security;
alter table public.complaints enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

-- Create policies for each table (example for profiles)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( profile_visibility = 'public' );

create policy "Students can view student-only profiles"
  on public.profiles for select
  using (
    profile_visibility = 'students' and
    auth.role() = 'authenticated'
  );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Add similar policies for other tables
-- Remember to add appropriate policies based on your requirements
