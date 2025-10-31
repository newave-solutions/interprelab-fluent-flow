-- InterpreStudy Enhanced Schema Migration
-- This migration adds tables and functions specifically for InterpreStudy features

-- Create learning_paths table for structured learning journeys
create table public.learning_paths (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category text not null check (category in ('medical', 'legal', 'business', 'technical', 'general')),
  difficulty_level text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  language_pair text not null, -- e.g., 'en-es', 'fr-en'
  total_lessons integer default 0,
  completed_lessons integer default 0,
  estimated_duration_minutes integer,
  is_public boolean default false,
  created_by_ai boolean default false,
  ai_prompt text, -- Store the original prompt used to generate this path
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lessons table for individual learning units
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  learning_path_id uuid references public.learning_paths on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  lesson_type text not null check (lesson_type in ('vocabulary', 'grammar', 'listening', 'reading', 'practice', 'assessment')),
  order_index integer not null,
  estimated_duration_minutes integer default 15,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  learning_objectives text[],
  key_terms jsonb, -- Store terms and definitions
  practice_exercises jsonb, -- Store exercises and answers
  multimedia_content jsonb, -- Store audio/video/image references
  ai_generated boolean default false,
  ai_source_prompt text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lesson_progress table to track user progress through lessons
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  learning_path_id uuid references public.learning_paths on delete cascade not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'skipped')),
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  time_spent_seconds integer default 0,
  score numeric(5,2), -- For assessments
  attempts integer default 0,
  last_accessed_at timestamp with time zone,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- Create flashcards table for spaced repetition learning
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade,
  front_text text not null,
  back_text text not null,
  front_language text not null,
  back_language text not null,
  category text,
  subcategory text,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  tags text[],
  audio_url_front text,
  audio_url_back text,
  image_url text,
  example_sentence text,
  pronunciation_guide text,
  is_public boolean default false,
  ai_generated boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create flashcard_reviews table for spaced repetition algorithm
create table public.flashcard_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  flashcard_id uuid references public.flashcards on delete cascade not null,
  quality integer not null check (quality >= 0 and quality <= 5), -- SM-2 algorithm quality rating
  easiness_factor numeric(3,2) default 2.5,
  interval_days integer default 1,
  repetitions integer default 0,
  next_review_date date not null,
  review_duration_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: We allow multiple reviews per day for the same flashcard
-- The application logic will handle review scheduling
-- If you need one review per day, add this constraint at the application level

-- Create ai_content_requests table to track LLM generation requests
create table public.ai_content_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  request_type text not null check (request_type in ('learning_path', 'lesson', 'flashcards', 'quiz', 'explanation')),
  prompt text not null,
  parameters jsonb, -- Store additional parameters like language, difficulty, etc.
  response_data jsonb, -- Store the AI response
  tokens_used integer,
  processing_time_ms integer,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  model_used text, -- e.g., 'gemini-pro', 'gemini-pro-vision'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Create quizzes table for assessments
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade,
  learning_path_id uuid references public.learning_paths on delete cascade,
  title text not null,
  description text,
  quiz_type text not null check (quiz_type in ('multiple_choice', 'fill_blank', 'matching', 'true_false', 'mixed')),
  questions jsonb not null, -- Store questions and answers
  time_limit_minutes integer,
  passing_score integer default 70,
  max_attempts integer default 3,
  is_public boolean default false,
  ai_generated boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz_attempts table to track quiz performance
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  quiz_id uuid references public.quizzes on delete cascade not null,
  attempt_number integer not null,
  answers jsonb not null, -- Store user answers
  score numeric(5,2) not null,
  percentage numeric(5,2) not null,
  time_taken_seconds integer,
  passed boolean not null,
  feedback jsonb, -- Store detailed feedback for each question
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_streaks table for gamification
create table public.study_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_study_date date,
  total_study_days integer default 0,
  streak_freeze_count integer default 0, -- Allow users to "freeze" streaks
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.learning_paths enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.ai_content_requests enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.study_streaks enable row level security;

-- Create RLS policies (optimized with scalar subqueries)
-- Learning paths policies
create policy "Users can view own learning paths" on public.learning_paths
  for select using ((select auth.uid()) = user_id or is_public = true);

create policy "Users can manage own learning paths" on public.learning_paths
  for all using ((select auth.uid()) = user_id);

-- Lessons policies
create policy "Users can view own lessons" on public.lessons
  for select using ((select auth.uid()) = user_id or exists (
    select 1 from public.learning_paths lp
    where lp.id = learning_path_id and (lp.user_id = (select auth.uid()) or lp.is_public = true)
  ));

create policy "Users can manage own lessons" on public.lessons
  for all using ((select auth.uid()) = user_id);

-- Lesson progress policies
create policy "Users can manage own lesson progress" on public.lesson_progress
  for all using ((select auth.uid()) = user_id);

-- Flashcards policies
create policy "Users can view flashcards" on public.flashcards
  for select using ((select auth.uid()) = user_id or is_public = true);

create policy "Users can manage own flashcards" on public.flashcards
  for all using ((select auth.uid()) = user_id);

-- Flashcard reviews policies
create policy "Users can manage own flashcard reviews" on public.flashcard_reviews
  for all using ((select auth.uid()) = user_id);

-- AI content requests policies
create policy "Users can manage own AI requests" on public.ai_content_requests
  for all using ((select auth.uid()) = user_id);

-- Quizzes policies
create policy "Users can view quizzes" on public.quizzes
  for select using ((select auth.uid()) = user_id or is_public = true);

create policy "Users can manage own quizzes" on public.quizzes
  for all using ((select auth.uid()) = user_id);

-- Quiz attempts policies
create policy "Users can manage own quiz attempts" on public.quiz_attempts
  for all using ((select auth.uid()) = user_id);

-- Study streaks policies
create policy "Users can manage own study streaks" on public.study_streaks
  for all using ((select auth.uid()) = user_id);

-- Create triggers for updated_at timestamps
create trigger handle_updated_at before update on public.learning_paths
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.lessons
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.lesson_progress
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.flashcards
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.quizzes
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.study_streaks
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index idx_learning_paths_user_category on public.learning_paths(user_id, category);
create index idx_learning_paths_public on public.learning_paths(is_public) where is_public = true;
create index idx_lessons_path_order on public.lessons(learning_path_id, order_index);
create index idx_lesson_progress_user_path on public.lesson_progress(user_id, learning_path_id);
create index idx_flashcards_user_category on public.flashcards(user_id, category);
create index idx_flashcard_reviews_next_review on public.flashcard_reviews(user_id, next_review_date);
create index idx_ai_requests_user_status on public.ai_content_requests(user_id, status);
create index idx_quiz_attempts_user_quiz on public.quiz_attempts(user_id, quiz_id, attempt_number);

-- Create functions for InterpreStudy features

-- Function to update study streak
create or replace function update_study_streak(user_uuid uuid)
returns void as $$
declare
  streak_record record;
  today_date date := current_date;
  yesterday_date date := current_date - interval '1 day';
begin
  -- Get or create streak record
  select * into streak_record from public.study_streaks where user_id = user_uuid;

  if not found then
    insert into public.study_streaks (user_id, current_streak, longest_streak, last_study_date, total_study_days)
    values (user_uuid, 1, 1, today_date, 1);
    return;
  end if;

  -- Check if user already studied today
  if streak_record.last_study_date = today_date then
    return; -- Already counted for today
  end if;

  -- Update streak logic
  if streak_record.last_study_date = yesterday_date then
    -- Continue streak
    update public.study_streaks
    set
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1),
      last_study_date = today_date,
      total_study_days = total_study_days + 1,
      updated_at = now()
    where user_id = user_uuid;
  else
    -- Reset streak
    update public.study_streaks
    set
      current_streak = 1,
      last_study_date = today_date,
      total_study_days = total_study_days + 1,
      updated_at = now()
    where user_id = user_uuid;
  end if;
end;
$$ language plpgsql security definer;

-- Function to get next flashcards for review (spaced repetition)
create or replace function get_flashcards_for_review(user_uuid uuid, limit_count integer default 20)
returns table (
  flashcard_id uuid,
  front_text text,
  back_text text,
  front_language text,
  back_language text,
  category text,
  difficulty_level text,
  next_review_date date,
  interval_days integer
) as $$
begin
  return query
  select
    f.id,
    f.front_text,
    f.back_text,
    f.front_language,
    f.back_language,
    f.category,
    f.difficulty_level,
    coalesce(fr.next_review_date, current_date),
    coalesce(fr.interval_days, 1)
  from public.flashcards f
  left join public.flashcard_reviews fr on f.id = fr.flashcard_id and fr.user_id = user_uuid
  where f.user_id = user_uuid
    and (fr.next_review_date is null or fr.next_review_date <= current_date)
  order by
    case when fr.next_review_date is null then 0 else 1 end, -- New cards first
    fr.next_review_date asc,
    f.created_at asc
  limit limit_count;
end;
$$ language plpgsql security definer;

-- Function to calculate learning path progress
create or replace function calculate_learning_path_progress(path_uuid uuid, user_uuid uuid)
returns numeric as $$
declare
  total_lessons integer;
  completed_lessons integer;
  progress_percentage numeric;
begin
  -- Count total lessons in the path
  select count(*) into total_lessons
  from public.lessons
  where learning_path_id = path_uuid;

  if total_lessons = 0 then
    return 0;
  end if;

  -- Count completed lessons for the user
  select count(*) into completed_lessons
  from public.lesson_progress lp
  join public.lessons l on lp.lesson_id = l.id
  where l.learning_path_id = path_uuid
    and lp.user_id = user_uuid
    and lp.status = 'completed';

  progress_percentage := (completed_lessons::numeric / total_lessons::numeric) * 100;

  -- Update the learning path progress
  update public.learning_paths
  set
    completed_lessons = completed_lessons,
    updated_at = now()
  where id = path_uuid and user_id = user_uuid;

  return round(progress_percentage, 2);
end;
$$ language plpgsql security definer;

-- Grant execute permissions on functions
grant execute on function update_study_streak(uuid) to authenticated;
grant execute on function get_flashcards_for_review(uuid, integer) to authenticated;
grant execute on function calculate_learning_path_progress(uuid, uuid) to authenticated;

