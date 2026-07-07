-- Create profiles table to store app client data
-- This table extends Supabase auth.users with custom profile information

create table public.profiles (
  id uuid not null primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  school_name text,
  role text default 'teacher', -- 'admin', 'teacher', 'staff', 'parent'
  grade_level text,
  subscription_plan text default 'free', -- 'free', 'starter', 'pro', 'school'
  
  -- Preferences
  dashboard_display_name text default 'Teacher',
  dashboard_subtitle text,
  preferred_language text default 'en',
  theme_preference text default 'light', -- 'light', 'dark', 'auto'
  
  -- UI Customization
  color_scheme text default 'ocean',
  template_style text default 'default',
  layout_mode text default 'default',
  font_scale numeric default 1.0,
  
  -- Features & Settings
  calm_music_enabled boolean default false,
  tip_rotation_seconds integer default 8,
  tip_rotation_mode text default 'sequential',
  show_onboarding boolean default false,
  has_seen_onboarding boolean default false,
  
  -- Profile Completion
  profile_completed boolean default false,
  last_login_at timestamp with time zone,
  
  -- School Information
  school_id uuid,
  phone_number text,
  location text,
  bio text,
  
  -- Metadata
  preferences jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  constraint profiles_id_fk foreign key (id) references auth.users(id) on delete cascade
);

-- Create index for faster queries
create index idx_profiles_email on public.profiles(email);
create index idx_profiles_school_id on public.profiles(school_id);
create index idx_profiles_role on public.profiles(role);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles in their school
create policy "Admins can view school profiles"
  on public.profiles for select
  using (
    auth.jwt() ->> 'role' = 'admin'
    and school_id = (
      select school_id from public.profiles where id = auth.uid()
    )
  );

-- Insert new profiles on auth user creation (handled via trigger or API)
-- This would be set up via a database trigger or using Supabase functions
