-- InterpreLink Social Platform Schema Migration
-- Creates tables for posts, connections, reels, discussions, and jobs

-- Posts table for user content
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  post_type text not null check (post_type in ('text', 'image', 'video', 'reel')),
  media_url text,
  thumbnail_url text,
  likes_count integer default 0,
  comments_count integer default 0,
  shares_count integer default 0,
  tags text[],
  visibility text default 'public' check (visibility in ('public', 'connections', 'private')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Post likes
create table public.post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id)
);

-- Post comments
create table public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  parent_comment_id uuid references public.post_comments on delete cascade,
  content text not null,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Connections (professional networking)
create table public.connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references auth.users on delete cascade not null,
  recipient_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'blocked')),
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(requester_id, recipient_id),
  check (requester_id != recipient_id)
);

-- Reels (short-form video content)
create table public.reels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  views_count integer default 0,
  likes_count integer default 0,
  comments_count integer default 0,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Discussions (forum topics)
create table public.discussions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  category text not null check (category in ('best_practices', 'terminology', 'day_to_day', 'ask_community', 'professional_development', 'general')),
  replies_count integer default 0,
  views_count integer default 0,
  is_pinned boolean default false,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Discussion replies
create table public.discussion_replies (
  id uuid default gen_random_uuid() primary key,
  discussion_id uuid references public.discussions on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  parent_reply_id uuid references public.discussion_replies on delete cascade,
  content text not null,
  likes_count integer default 0,
  is_solution boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Job postings
create table public.job_postings (
  id uuid default gen_random_uuid() primary key,
  posted_by_user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text not null,
  company text not null,
  location text,
  job_type text check (job_type in ('full_time', 'part_time', 'contract', 'freelance', 'remote')),
  salary_range text,
  requirements text[],
  languages_required text[],
  application_url text,
  application_email text,
  is_active boolean default true,
  views_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User goals table
create table public.user_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal_type text not null check (goal_type in ('daily_earnings', 'monthly_earnings', 'call_duration', 'call_count', 'platform_specific')),
  target_amount numeric(10,2) not null,
  target_currency text default 'USD',
  target_period text not null check (target_period in ('daily', 'weekly', 'monthly', 'yearly')),
  platform_name text,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.connections enable row level security;
alter table public.reels enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_replies enable row level security;
alter table public.job_postings enable row level security;
alter table public.user_goals enable row level security;

-- RLS Policies for posts (optimized with scalar subqueries)
create policy "Users can view public posts" on public.posts
  for select using (visibility = 'public' or (select auth.uid()) = user_id);

create policy "Users can create own posts" on public.posts
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own posts" on public.posts
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own posts" on public.posts
  for delete using ((select auth.uid()) = user_id);

-- RLS Policies for post_likes
create policy "Users can view all likes" on public.post_likes
  for select using (true);

create policy "Users can manage own likes" on public.post_likes
  for all using ((select auth.uid()) = user_id);

-- RLS Policies for post_comments
create policy "Users can view comments on visible posts" on public.post_comments
  for select using (exists (
    select 1 from public.posts p
    where p.id = post_id and (p.visibility = 'public' or p.user_id = (select auth.uid()))
  ));

create policy "Users can create comments" on public.post_comments
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own comments" on public.post_comments
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own comments" on public.post_comments
  for delete using ((select auth.uid()) = user_id);

-- RLS Policies for connections
create policy "Users can view own connections" on public.connections
  for select using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

create policy "Users can create connection requests" on public.connections
  for insert with check ((select auth.uid()) = requester_id);

create policy "Users can update connections they're part of" on public.connections
  for update using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

create policy "Users can delete own connection requests" on public.connections
  for delete using ((select auth.uid()) = requester_id);

-- RLS Policies for reels
create policy "Users can view all reels" on public.reels
  for select using (true);

create policy "Users can create own reels" on public.reels
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own reels" on public.reels
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own reels" on public.reels
  for delete using ((select auth.uid()) = user_id);

-- RLS Policies for discussions
create policy "Users can view all discussions" on public.discussions
  for select using (true);

create policy "Users can create discussions" on public.discussions
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own discussions" on public.discussions
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own discussions" on public.discussions
  for delete using ((select auth.uid()) = user_id);

-- RLS Policies for discussion_replies
create policy "Users can view all replies" on public.discussion_replies
  for select using (true);

create policy "Users can create replies" on public.discussion_replies
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own replies" on public.discussion_replies
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own replies" on public.discussion_replies
  for delete using ((select auth.uid()) = user_id);

-- RLS Policies for job_postings
create policy "Users can view active job postings" on public.job_postings
  for select using (is_active = true or (select auth.uid()) = posted_by_user_id);

create policy "Users can create job postings" on public.job_postings
  for insert with check ((select auth.uid()) = posted_by_user_id);

create policy "Users can update own job postings" on public.job_postings
  for update using ((select auth.uid()) = posted_by_user_id);

create policy "Users can delete own job postings" on public.job_postings
  for delete using ((select auth.uid()) = posted_by_user_id);

-- RLS Policies for user_goals
create policy "Users can manage own goals" on public.user_goals
  for all using ((select auth.uid()) = user_id);

-- Triggers for updated_at
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

-- Indexes for performance
create index idx_posts_user_created on public.posts(user_id, created_at desc);
create index idx_posts_visibility on public.posts(visibility, created_at desc);
create index idx_posts_tags on public.posts using gin(tags);
create index idx_post_likes_post on public.post_likes(post_id);
create index idx_post_likes_user on public.post_likes(user_id);
create index idx_post_comments_post on public.post_comments(post_id, created_at);
create index idx_connections_users on public.connections(requester_id, recipient_id);
create index idx_connections_status on public.connections(status);
create index idx_reels_user_created on public.reels(user_id, created_at desc);
create index idx_reels_tags on public.reels using gin(tags);
create index idx_discussions_category on public.discussions(category, created_at desc);
create index idx_discussions_pinned on public.discussions(is_pinned, created_at desc) where is_pinned = true;
create index idx_discussion_replies_discussion on public.discussion_replies(discussion_id, created_at);
create index idx_job_postings_active on public.job_postings(is_active, created_at desc) where is_active = true;
create index idx_user_goals_user_active on public.user_goals(user_id, is_active);

-- Functions for InterpreLink

-- Function to increment post likes count
create or replace function increment_post_likes()
returns trigger as $$
begin
  update public.posts
  set likes_count = likes_count + 1
  where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_post_like_created
  after insert on public.post_likes
  for each row execute procedure increment_post_likes();

-- Function to decrement post likes count
create or replace function decrement_post_likes()
returns trigger as $$
begin
  update public.posts
  set likes_count = likes_count - 1
  where id = old.post_id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_post_like_deleted
  after delete on public.post_likes
  for each row execute procedure decrement_post_likes();

-- Function to increment post comments count
create or replace function increment_post_comments()
returns trigger as $$
begin
  update public.posts
  set comments_count = comments_count + 1
  where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_post_comment_created
  after insert on public.post_comments
  for each row execute procedure increment_post_comments();

-- Function to increment discussion replies count
create or replace function increment_discussion_replies()
returns trigger as $$
begin
  update public.discussions
  set replies_count = replies_count + 1
  where id = new.discussion_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_discussion_reply_created
  after insert on public.discussion_replies
  for each row execute procedure increment_discussion_replies();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.posts to authenticated;
grant all on public.post_likes to authenticated;
grant all on public.post_comments to authenticated;
grant all on public.connections to authenticated;
grant all on public.reels to authenticated;
grant all on public.discussions to authenticated;
grant all on public.discussion_replies to authenticated;
grant all on public.job_postings to authenticated;
grant all on public.user_goals to authenticated;
