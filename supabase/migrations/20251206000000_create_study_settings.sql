create table study_settings (
  user_id uuid references auth.users(id) primary key,
  difficulty text not null default 'intermediate',
  specialty text not null default 'medical',
  target_language text not null default 'spanish',
  provider_accent text not null default 'neutral',
  provider_gender text not null default 'any',
  response_time integer not null default 8,
  preferred_vocabulary text not null default '',
  auto_save boolean not null default true,
  audio_feedback boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table study_settings enable row level security;

create policy "Users can view their own study settings"
  on study_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study settings"
  on study_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study settings"
  on study_settings for update
  using (auth.uid() = user_id);

-- Create a trigger to update the updated_at column
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on study_settings
  for each row execute procedure moddatetime (updated_at);
