-- Enable necessary extensions
create extension if not exists "uuid-ossp" schema extensions;

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  website text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_roles table for role-based access control
create table public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'user' check (role in ('user', 'admin', 'moderator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, role)
);

-- Create user_settings table for user preferences
create table public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  pay_rate numeric(10,2) default 0,
  pay_rate_type text default 'per_hour' check (pay_rate_type in ('per_hour', 'per_minute')),
  preferred_currency text default 'USD',
  preferred_language text default 'en',
  timezone text default 'UTC',
  notifications_enabled boolean default true,
  email_notifications boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create call_logs table for tracking interpretation sessions
create table public.call_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration_seconds integer,
  earnings numeric(10,2),
  currency text default 'USD',
  client_name text,
  client_phone text,
  language_pair text,
  interpretation_type text check (interpretation_type in ('consecutive', 'simultaneous', 'sight_translation', 'phone', 'video')),
  notes text,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create assessment_results table for InterpreBot assessments
create table public.assessment_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  assessment_type text not null check (assessment_type in ('vocabulary', 'grammar', 'listening', 'speaking', 'cultural', 'medical', 'legal', 'technical')),
  language_code text not null,
  score numeric(5,2),
  max_score numeric(5,2),
  percentage numeric(5,2),
  time_taken_seconds integer,
  questions_total integer,
  questions_correct integer,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  results jsonb,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create glossary_terms table for personal and public terminology
create table public.glossary_terms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  term text not null,
  definition text not null,
  pronunciation text,
  category text,
  subcategory text,
  language_code text default 'en',
  source_language text,
  target_language text,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  usage_example text,
  notes text,
  tags text[],
  is_public boolean default false,
  is_verified boolean default false,
  usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_sessions table for tracking learning progress
create table public.study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_type text not null check (session_type in ('flashcards', 'quiz', 'practice', 'assessment')),
  topic text,
  language_code text,
  duration_seconds integer,
  questions_attempted integer default 0,
  questions_correct integer default 0,
  score numeric(5,2),
  completed boolean default false,
  session_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coaching_sessions table for InterpreCoach
create table public.coaching_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_type text not null check (session_type in ('pronunciation', 'fluency', 'vocabulary', 'grammar', 'conversation')),
  language_code text not null,
  topic text,
  duration_seconds integer,
  audio_url text,
  transcript text,
  feedback jsonb,
  score numeric(5,2),
  areas_for_improvement text[],
  strengths text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table for gamification
create table public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_type text not null,
  achievement_name text not null,
  description text,
  points_earned integer default 0,
  badge_url text,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_type, achievement_name)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.user_settings enable row level security;
alter table public.call_logs enable row level security;
alter table public.assessment_results enable row level security;
alter table public.glossary_terms enable row level security;
alter table public.study_sessions enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.user_achievements enable row level security;

-- Create policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Create policies for user_roles
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);

-- Create policies for user_settings
create policy "Users can manage own settings" on public.user_settings
  for all using (auth.uid() = user_id);

-- Create policies for call_logs
create policy "Users can manage own call logs" on public.call_logs
  for all using (auth.uid() = user_id);

-- Create policies for assessment_results
create policy "Users can manage own assessment results" on public.assessment_results
  for all using (auth.uid() = user_id);

-- Create policies for glossary_terms
create policy "Users can manage own glossary terms" on public.glossary_terms
  for all using (auth.uid() = user_id);

create policy "Users can view public glossary terms" on public.glossary_terms
  for select using (is_public = true);

-- Create policies for study_sessions
create policy "Users can manage own study sessions" on public.study_sessions
  for all using (auth.uid() = user_id);

-- Create policies for coaching_sessions
create policy "Users can manage own coaching sessions" on public.coaching_sessions
  for all using (auth.uid() = user_id);

-- Create policies for user_achievements
create policy "Users can view own achievements" on public.user_achievements
  for select using (auth.uid() = user_id);

create policy "System can insert achievements" on public.user_achievements
  for insert with check (true);

-- Create functions for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.user_settings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.call_logs
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.glossary_terms
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.study_sessions
  for each row execute procedure public.handle_updated_at();

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes for better performance
create index idx_call_logs_user_id_start_time on public.call_logs(user_id, start_time desc);
create index idx_assessment_results_user_id_type on public.assessment_results(user_id, assessment_type);
create index idx_glossary_terms_user_id_category on public.glossary_terms(user_id, category);
create index idx_glossary_terms_public on public.glossary_terms(is_public) where is_public = true;
create index idx_study_sessions_user_id_created on public.study_sessions(user_id, created_at desc);
create index idx_coaching_sessions_user_id_created on public.coaching_sessions(user_id, created_at desc);

-- Create views for analytics
create or replace view public.user_stats as
select
  u.id as user_id,
  p.first_name,
  p.last_name,
  count(cl.id) as total_calls,
  sum(cl.duration_seconds) as total_duration_seconds,
  sum(cl.earnings) as total_earnings,
  avg(cl.duration_seconds) as avg_call_duration,
  count(ar.id) as total_assessments,
  avg(ar.percentage) as avg_assessment_score,
  count(ss.id) as total_study_sessions,
  count(cs.id) as total_coaching_sessions
from auth.users u
left join public.profiles p on u.id = p.id
left join public.call_logs cl on u.id = cl.user_id
left join public.assessment_results ar on u.id = ar.user_id
left join public.study_sessions ss on u.id = ss.user_id
left join public.coaching_sessions cs on u.id = cs.user_id
group by u.id, p.first_name, p.last_name;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;

