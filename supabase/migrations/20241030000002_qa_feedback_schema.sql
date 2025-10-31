-- QA Feedback System Schema for InterpreCoach
-- Supports post-session quality assurance analysis with LLM-generated feedback

-- Create interpreter_profiles table
create table public.interpreter_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique,
  full_name text not null,
  email text not null unique,
  interpreter_id text unique, -- External ID (e.g., certification number)
  certification_level text check (certification_level in ('certified', 'registered', 'in_training', 'none')),
  certifying_organizations text[], -- e.g., ['NBCMI', 'CCHI', 'IMIA']
  languages text[] not null default '{}', -- Language pairs, e.g., ['en-es', 'en-fr']
  specializations text[], -- e.g., ['medical', 'legal', 'mental_health']
  total_sessions integer default 0,
  total_session_minutes integer default 0,
  overall_performance_score numeric(5,2) default 0,
  premium_status boolean default false,
  premium_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create interpreter_sessions table
create table public.interpreter_sessions (
  id uuid default gen_random_uuid() primary key,
  interpreter_id uuid references public.interpreter_profiles on delete cascade not null,
  session_start timestamp with time zone not null,
  session_end timestamp with time zone,
  duration_minutes integer,
  session_type text check (session_type in ('consecutive', 'simultaneous', 'sight_translation', 'phone', 'video', 'in_person')),
  language_pair text not null, -- e.g., 'en-es'
  setting text check (setting in ('hospital', 'clinic', 'mental_health', 'legal', 'educational', 'community', 'other')),
  patient_age_group text check (patient_age_group in ('pediatric', 'adult', 'geriatric', 'mixed')),
  complexity_level text check (complexity_level in ('routine', 'moderate', 'complex', 'critical')),
  transcript_url text, -- S3 URL to session transcript
  audio_url text, -- S3 URL to session audio (if recorded)
  metadata jsonb, -- Additional session data
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create qa_feedback table
create table public.qa_feedback (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interpreter_sessions on delete cascade not null unique,
  interpreter_id uuid references public.interpreter_profiles on delete cascade not null,
  overall_score numeric(5,2) not null check (overall_score >= 0 and overall_score <= 100),
  feedback_data jsonb not null, -- Structured feedback from LLM
  -- feedback_data structure:
  -- {
  --   "strengths": [{"title": "...", "description": "...", "standardReference": {...}}],
  --   "improvements": [{"title": "...", "description": "...", "coachingSteps": [...], "standardReference": {...}}],
  --   "categories": {"accuracy": 95, "ethics": 90, "professionalism": 88, ...},
  --   "encouragement": "...",
  --   "keyInsights": [...]
  -- }
  llm_model_used text, -- e.g., 'gpt-4', 'gemini-pro', 'claude-3'
  llm_prompt_version text, -- Track prompt version for quality control
  tokens_used integer,
  processing_time_ms integer,
  feedback_generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_by_human boolean default false,
  human_reviewer_id uuid references auth.users on delete set null,
  human_review_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create interprelab_recommendations table
create table public.interprelab_recommendations (
  id uuid default gen_random_uuid() primary key,
  feedback_id uuid references public.qa_feedback on delete cascade not null,
  interpreter_id uuid references public.interpreter_profiles on delete cascade not null,
  recommended_lab text not null, -- e.g., 'Medical Terminology Mastery'
  area_of_opportunity text not null, -- What needs improvement
  priority text not null check (priority in ('high', 'medium', 'low')),
  rationale text, -- Why this lab is recommended
  completed boolean default false,
  completed_at timestamp with time zone,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create performance_trends table for tracking improvement over time
create table public.performance_trends (
  id uuid default gen_random_uuid() primary key,
  interpreter_id uuid references public.interpreter_profiles on delete cascade not null,
  date date not null,
  sessions_count integer default 0,
  avg_overall_score numeric(5,2),
  avg_accuracy_score numeric(5,2),
  avg_ethics_score numeric(5,2),
  avg_professionalism_score numeric(5,2),
  avg_terminology_score numeric(5,2),
  avg_cultural_competence_score numeric(5,2),
  total_minutes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(interpreter_id, date)
);

-- Create standards_references table for tracking which standards are referenced
create table public.standards_references (
  id uuid default gen_random_uuid() primary key,
  organization text not null, -- e.g., 'NBCMI', 'CCHI', 'IMIA', 'NCHIC'
  standard_code text not null, -- e.g., 'NBCMI-1.1', 'CCHI-Ethics-2'
  standard_title text not null,
  standard_description text,
  category text, -- e.g., 'ethics', 'accuracy', 'professionalism'
  reference_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization, standard_code)
);

-- Enable RLS
alter table public.interpreter_profiles enable row level security;
alter table public.interpreter_sessions enable row level security;
alter table public.qa_feedback enable row level security;
alter table public.interprelab_recommendations enable row level security;
alter table public.performance_trends enable row level security;
alter table public.standards_references enable row level security;

-- RLS Policies for interpreter_profiles
create policy "Users can view own interpreter profile" on public.interpreter_profiles
  for select using ((select auth.uid()) = user_id);

create policy "Users can update own interpreter profile" on public.interpreter_profiles
  for update using ((select auth.uid()) = user_id);

create policy "Users can insert own interpreter profile" on public.interpreter_profiles
  for insert with check ((select auth.uid()) = user_id);

create policy "Admins can view all interpreter profiles" on public.interpreter_profiles
  for select using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- RLS Policies for interpreter_sessions
create policy "Interpreters can view own sessions" on public.interpreter_sessions
  for select using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "Interpreters can create own sessions" on public.interpreter_sessions
  for insert with check (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "Interpreters can update own sessions" on public.interpreter_sessions
  for update using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "Admins can view all sessions" on public.interpreter_sessions
  for select using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- RLS Policies for qa_feedback
create policy "Interpreters can view own feedback" on public.qa_feedback
  for select using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "System can insert feedback" on public.qa_feedback
  for insert with check (true);

create policy "Admins can view all feedback" on public.qa_feedback
  for select using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Admins can update feedback" on public.qa_feedback
  for update using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- RLS Policies for interprelab_recommendations
create policy "Interpreters can view own recommendations" on public.interprelab_recommendations
  for select using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "Interpreters can update own recommendations" on public.interprelab_recommendations
  for update using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "System can insert recommendations" on public.interprelab_recommendations
  for insert with check (true);

-- RLS Policies for performance_trends
create policy "Interpreters can view own trends" on public.performance_trends
  for select using (
    exists (
      select 1 from public.interpreter_profiles
      where id = interpreter_id and user_id = (select auth.uid())
    )
  );

create policy "System can manage trends" on public.performance_trends
  for all using (true);

-- RLS Policies for standards_references
create policy "Anyone can view standards" on public.standards_references
  for select using (true);

create policy "Admins can manage standards" on public.standards_references
  for all using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- Create indexes for performance
create index idx_interpreter_profiles_user_id on public.interpreter_profiles(user_id);
create index idx_interpreter_profiles_email on public.interpreter_profiles(email);
create index idx_interpreter_sessions_interpreter_id on public.interpreter_sessions(interpreter_id, session_start desc);
create index idx_interpreter_sessions_dates on public.interpreter_sessions(session_start, session_end);
create index idx_qa_feedback_session_id on public.qa_feedback(session_id);
create index idx_qa_feedback_interpreter_id on public.qa_feedback(interpreter_id, feedback_generated_at desc);
create index idx_interprelab_recommendations_feedback_id on public.interprelab_recommendations(feedback_id);
create index idx_interprelab_recommendations_interpreter_id on public.interprelab_recommendations(interpreter_id, priority);
create index idx_performance_trends_interpreter_date on public.performance_trends(interpreter_id, date desc);
create index idx_standards_references_org_code on public.standards_references(organization, standard_code);

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.interpreter_profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.interpreter_sessions
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.qa_feedback
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.interprelab_recommendations
  for each row execute procedure public.handle_updated_at();

-- Create function to update interpreter profile stats after feedback
create or replace function update_interpreter_stats_after_feedback()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  -- Update interpreter profile with new session and score
  update public.interpreter_profiles
  set
    total_sessions = total_sessions + 1,
    overall_performance_score = (
      select avg(overall_score)
      from public.qa_feedback
      where interpreter_id = new.interpreter_id
    ),
    updated_at = now()
  where id = new.interpreter_id;

  -- Update or insert performance trend for today
  insert into public.performance_trends (
    interpreter_id,
    date,
    sessions_count,
    avg_overall_score
  )
  values (
    new.interpreter_id,
    current_date,
    1,
    new.overall_score
  )
  on conflict (interpreter_id, date)
  do update set
    sessions_count = performance_trends.sessions_count + 1,
    avg_overall_score = (
      select avg(overall_score)
      from public.qa_feedback qf
      join public.interpreter_sessions s on qf.session_id = s.id
      where qf.interpreter_id = new.interpreter_id
        and date(s.session_start) = current_date
    ),
    created_at = now();

  return new;
end;
$$;

create trigger on_qa_feedback_created
  after insert on public.qa_feedback
  for each row execute procedure update_interpreter_stats_after_feedback();

-- Create function to get interpreter performance summary
create or replace function get_interpreter_performance_summary(target_interpreter_id uuid)
returns table (
  total_sessions bigint,
  total_minutes bigint,
  overall_score numeric,
  recent_trend text,
  top_strength text,
  top_improvement_area text,
  recommended_labs_count bigint
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  current_user_interpreter_id uuid;
begin
  -- Get interpreter_id for current user
  select id into current_user_interpreter_id
  from public.interpreter_profiles
  where user_id = (select auth.uid());

  -- Security check: users can only query their own stats unless they're admin
  if target_interpreter_id != current_user_interpreter_id then
    if not exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid()) and role = 'admin'
    ) then
      raise exception 'Unauthorized: You can only view your own performance summary';
    end if;
  end if;

  return query
  select
    count(distinct s.id) as total_sessions,
    sum(s.duration_minutes)::bigint as total_minutes,
    avg(qf.overall_score) as overall_score,
    case
      when avg(qf.overall_score) > (
        select avg(overall_score)
        from public.qa_feedback
        where interpreter_id = target_interpreter_id
          and feedback_generated_at < now() - interval '30 days'
      ) then 'improving'
      when avg(qf.overall_score) < (
        select avg(overall_score)
        from public.qa_feedback
        where interpreter_id = target_interpreter_id
          and feedback_generated_at < now() - interval '30 days'
      ) then 'declining'
      else 'stable'
    end as recent_trend,
    (
      select (feedback_data->'strengths'->0->>'title')
      from public.qa_feedback
      where interpreter_id = target_interpreter_id
      order by feedback_generated_at desc
      limit 1
    ) as top_strength,
    (
      select (feedback_data->'improvements'->0->>'title')
      from public.qa_feedback
      where interpreter_id = target_interpreter_id
      order by feedback_generated_at desc
      limit 1
    ) as top_improvement_area,
    (
      select count(*)
      from public.interprelab_recommendations
      where interpreter_id = target_interpreter_id
        and completed = false
    ) as recommended_labs_count
  from public.interpreter_sessions s
  left join public.qa_feedback qf on s.id = qf.session_id
  where s.interpreter_id = target_interpreter_id
    and s.session_start >= now() - interval '90 days';
end;
$$;

grant execute on function get_interpreter_performance_summary(uuid) to authenticated;

-- Insert sample standards references
insert into public.standards_references (organization, standard_code, standard_title, standard_description, category) values
  ('NBCMI', 'NBCMI-1.1', 'Accuracy', 'Interpret accurately without omissions or additions', 'accuracy'),
  ('NBCMI', 'NBCMI-2.1', 'Confidentiality', 'Maintain confidentiality of all information', 'ethics'),
  ('NBCMI', 'NBCMI-3.1', 'Impartiality', 'Remain impartial and unbiased', 'ethics'),
  ('NBCMI', 'NBCMI-4.1', 'Professional Boundaries', 'Maintain appropriate professional boundaries', 'professionalism'),
  ('CCHI', 'CCHI-Ethics-1', 'Accuracy and Completeness', 'Strive for accuracy and completeness in interpretation', 'accuracy'),
  ('CCHI', 'CCHI-Ethics-2', 'Confidentiality', 'Respect the confidentiality of information', 'ethics'),
  ('CCHI', 'CCHI-Ethics-3', 'Impartiality', 'Maintain impartiality and avoid conflicts of interest', 'ethics'),
  ('IMIA', 'IMIA-1', 'Accuracy', 'Convey the message accurately', 'accuracy'),
  ('IMIA', 'IMIA-2', 'Confidentiality', 'Treat all information as confidential', 'ethics'),
  ('IMIA', 'IMIA-3', 'Impartiality', 'Maintain impartiality', 'ethics'),
  ('NCIHC', 'NCIHC-1', 'Accuracy', 'Interpret accurately and completely', 'accuracy'),
  ('NCIHC', 'NCIHC-2', 'Confidentiality', 'Maintain confidentiality', 'ethics'),
  ('NCIHC', 'NCIHC-3', 'Impartiality', 'Remain impartial', 'ethics'),
  ('NCIHC', 'NCIHC-4', 'Respect', 'Respect cultural differences', 'cultural_competence')
on conflict (organization, standard_code) do nothing;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.interpreter_profiles to authenticated;
grant insert, update on public.interpreter_profiles to authenticated;
grant select on public.interpreter_sessions to authenticated;
grant insert, update on public.interpreter_sessions to authenticated;
grant select on public.qa_feedback to authenticated;
grant select on public.interprelab_recommendations to authenticated;
grant update on public.interprelab_recommendations to authenticated;
grant select on public.performance_trends to authenticated;
grant select on public.standards_references to authenticated, anon;
