-- Create study_settings table for storing user study preferences
create table if not exists study_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  difficulty text not null default 'intermediate',
  specialty text not null default 'medical',
  target_language text not null default 'spanish',
  provider_accent text not null default 'neutral',
  provider_gender text not null default 'any',
  response_time integer not null default 8,
  preferred_vocabulary text default '',
  auto_save boolean not null default true,
  audio_feedback boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint study_settings_user_id_key unique(user_id)
);

-- Add index for better query performance
create index if not exists study_settings_user_id_idx on study_settings(user_id);

-- Enable Row Level Security
alter table study_settings enable row level security;

-- RLS Policies for study_settings
DROP POLICY IF EXISTS "Users can view their own study settings" ON study_settings;
create policy "Users can view their own study settings"
  on study_settings for select
  using (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own study settings" ON study_settings;
create policy "Users can insert their own study settings"
  on study_settings for insert
  with check (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own study settings" ON study_settings;
create policy "Users can update their own study settings"
  on study_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own study settings" ON study_settings;
create policy "Users can delete their own study settings"
  on study_settings for delete
  using (auth.uid() = user_id);

-- Grant necessary permissions
grant select, insert, update, delete on study_settings to authenticated;

-- Add helpful comments
comment on table study_settings is 'Stores user study preferences for InterpreStudy sessions';
comment on column study_settings.difficulty is 'Study difficulty level: beginner, intermediate, advanced, expert';
comment on column study_settings.specialty is 'Field of study: medical, legal, business, education, social-services';
comment on column study_settings.target_language is 'Target language for practice: spanish, french, mandarin, arabic';
comment on column study_settings.provider_accent is 'Provider accent preference: neutral, regional, native, mixed';
comment on column study_settings.provider_gender is 'Provider gender preference: any, male, female';
comment on column study_settings.response_time is 'Maximum response time in seconds (5-15)';
comment on column study_settings.preferred_vocabulary is 'Comma-separated list of preferred vocabulary terms to practice';
comment on column study_settings.auto_save is 'Whether to automatically save study progress';
comment on column study_settings.audio_feedback is 'Whether to provide audio confirmation for correct answers';
