-- Migration: Add tables for InterpreCoach Chrome Extension
-- Date: October 31, 2025
-- Purpose: Create tables needed by the InterpreCoach extension

-- Create session_transcripts table
create table public.session_transcripts (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interpreter_sessions on delete cascade not null,
  text text not null,
  speaker text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create medical_terms table for extension
create table public.medical_terms (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interpreter_sessions on delete cascade not null,
  english_term text not null,
  spanish_translation text,
  phonetic_pronunciation text,
  definition text,
  category text,
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create session_highlights table
create table public.session_highlights (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interpreter_sessions on delete cascade not null,
  category text not null check (category in ('symptoms', 'medications', 'instructions', 'events', 'other')),
  content text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create interpreter_notes table
create table public.interpreter_notes (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interpreter_sessions on delete cascade not null unique,
  note_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.session_transcripts enable row level security;
alter table public.medical_terms enable row level security;
alter table public.session_highlights enable row level security;
alter table public.interpreter_notes enable row level security;

-- RLS Policies for session_transcripts
create policy "Users can view own session transcripts" on public.session_transcripts
  for select using (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

create policy "Users can insert own session transcripts" on public.session_transcripts
  for insert with check (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

-- RLS Policies for medical_terms
create policy "Users can view own medical terms" on public.medical_terms
  for select using (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

create policy "Users can insert own medical terms" on public.medical_terms
  for insert with check (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

-- RLS Policies for session_highlights
create policy "Users can view own session highlights" on public.session_highlights
  for select using (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

create policy "Users can insert own session highlights" on public.session_highlights
  for insert with check (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

-- RLS Policies for interpreter_notes
create policy "Users can manage own interpreter notes" on public.interpreter_notes
  for all using (
    exists (
      select 1 from public.interpreter_sessions s
      join public.interpreter_profiles p on s.interpreter_id = p.id
      where s.id = session_id and p.user_id = (select auth.uid())
    )
  );

-- Create indexes for performance
create index idx_session_transcripts_session_id on public.session_transcripts(session_id, timestamp);
create index idx_medical_terms_session_id on public.medical_terms(session_id, detected_at);
create index idx_session_highlights_session_id on public.session_highlights(session_id, category);
create index idx_interpreter_notes_session_id on public.interpreter_notes(session_id);

-- Add updated_at triggers
create trigger handle_updated_at before update on public.session_transcripts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.medical_terms
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.session_highlights
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.interpreter_notes
  for each row execute procedure public.handle_updated_at();

-- Grant permissions
grant select, insert on public.session_transcripts to authenticated;
grant select, insert on public.medical_terms to authenticated;
grant select, insert on public.session_highlights to authenticated;
grant select, insert, update on public.interpreter_notes to authenticated;
