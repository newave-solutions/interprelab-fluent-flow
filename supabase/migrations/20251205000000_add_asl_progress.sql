
create table if not exists public.asl_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  sign_letter text not null,
  attempts integer default 0,
  success_count integer default 0,
  last_practiced timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, sign_letter)
);

alter table public.asl_progress enable row level security;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.asl_progress;
create policy "Users can view their own progress"
  on public.asl_progress for select
  using (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.asl_progress;
create policy "Users can insert their own progress"
  on public.asl_progress for insert
  with check (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.asl_progress;
create policy "Users can update their own progress"
  on public.asl_progress for update
  using (auth.uid() = user_id);
