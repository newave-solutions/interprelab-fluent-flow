-- Fix search_path for all functions to prevent SQL injection and privilege escalation
-- This migration adds SET search_path to all functions that were missing it

-- Fix handle_updated_at function
drop function if exists public.handle_updated_at() cascade;
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Recreate triggers for handle_updated_at
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

create trigger handle_updated_at before update on public.posts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.post_comments
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.connections
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.discussions
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.discussion_replies
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.job_postings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.user_goals
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.contacts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.waitlist
  for each row execute procedure public.handle_updated_at();

-- Fix handle_new_user function
drop function if exists public.handle_new_user() cascade;
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

-- Recreate trigger for handle_new_user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Fix get_user_stats function
drop function if exists public.get_user_stats(uuid);
create or replace function public.get_user_stats(target_user_id uuid default null)
returns table (
  user_id uuid,
  first_name text,
  last_name text,
  total_calls bigint,
  total_duration_seconds bigint,
  total_earnings numeric,
  avg_call_duration numeric,
  total_assessments bigint,
  avg_assessment_score numeric,
  total_study_sessions bigint,
  total_coaching_sessions bigint
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  query_user_id uuid;
begin
  query_user_id := coalesce(target_user_id, (select auth.uid()));

  if query_user_id != (select auth.uid()) then
    if not exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid()) and role = 'admin'
    ) then
      raise exception 'Unauthorized: You can only view your own statistics';
    end if;
  end if;

  return query
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
  where u.id = query_user_id
  group by u.id, p.first_name, p.last_name;
end;
$$;

grant execute on function public.get_user_stats(uuid) to authenticated;
revoke execute on function public.get_user_stats(uuid) from anon, public;

-- Fix InterpreStudy functions
drop function if exists update_study_streak(uuid);
create or replace function update_study_streak(user_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  streak_record record;
  today_date date := current_date;
  yesterday_date date := current_date - interval '1 day';
begin
  select * into streak_record from public.study_streaks where user_id = user_uuid;

  if not found then
    insert into public.study_streaks (user_id, current_streak, longest_streak, last_study_date, total_study_days)
    values (user_uuid, 1, 1, today_date, 1);
    return;
  end if;

  if streak_record.last_study_date = today_date then
    return;
  end if;

  if streak_record.last_study_date = yesterday_date then
    update public.study_streaks
    set
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1),
      last_study_date = today_date,
      total_study_days = total_study_days + 1,
      updated_at = now()
    where user_id = user_uuid;
  else
    update public.study_streaks
    set
      current_streak = 1,
      last_study_date = today_date,
      total_study_days = total_study_days + 1,
      updated_at = now()
    where user_id = user_uuid;
  end if;
end;
$$;

grant execute on function update_study_streak(uuid) to authenticated;

drop function if exists get_flashcards_for_review(uuid, integer);
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
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
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
    case when fr.next_review_date is null then 0 else 1 end,
    fr.next_review_date asc,
    f.created_at asc
  limit limit_count;
end;
$$;

grant execute on function get_flashcards_for_review(uuid, integer) to authenticated;

drop function if exists calculate_learning_path_progress(uuid, uuid);
create or replace function calculate_learning_path_progress(path_uuid uuid, user_uuid uuid)
returns numeric
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  total_lessons integer;
  completed_lessons integer;
  progress_percentage numeric;
begin
  select count(*) into total_lessons
  from public.lessons
  where learning_path_id = path_uuid;

  if total_lessons = 0 then
    return 0;
  end if;

  select count(*) into completed_lessons
  from public.lesson_progress lp
  join public.lessons l on lp.lesson_id = l.id
  where l.learning_path_id = path_uuid
    and lp.user_id = user_uuid
    and lp.status = 'completed';

  progress_percentage := (completed_lessons::numeric / total_lessons::numeric) * 100;

  update public.learning_paths
  set
    completed_lessons = completed_lessons,
    updated_at = now()
  where id = path_uuid and user_id = user_uuid;

  return round(progress_percentage, 2);
end;
$$;

grant execute on function calculate_learning_path_progress(uuid, uuid) to authenticated;

-- Fix InterpreLink functions
drop function if exists increment_post_likes();
create or replace function increment_post_likes()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  update public.posts
  set likes_count = likes_count + 1
  where id = new.post_id;
  return new;
end;
$$;

create trigger on_post_like_created
  after insert on public.post_likes
  for each row execute procedure increment_post_likes();

drop function if exists decrement_post_likes();
create or replace function decrement_post_likes()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  update public.posts
  set likes_count = likes_count - 1
  where id = old.post_id;
  return old;
end;
$$;

create trigger on_post_like_deleted
  after delete on public.post_likes
  for each row execute procedure decrement_post_likes();

drop function if exists increment_post_comments();
create or replace function increment_post_comments()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  update public.posts
  set comments_count = comments_count + 1
  where id = new.post_id;
  return new;
end;
$$;

create trigger on_post_comment_created
  after insert on public.post_comments
  for each row execute procedure increment_post_comments();

drop function if exists increment_discussion_replies();
create or replace function increment_discussion_replies()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  update public.discussions
  set replies_count = replies_count + 1
  where id = new.discussion_id;
  return new;
end;
$$;

create trigger on_discussion_reply_created
  after insert on public.discussion_replies
  for each row execute procedure increment_discussion_replies();
