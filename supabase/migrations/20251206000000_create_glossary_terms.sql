create table if not exists public.glossary_terms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  term text not null,
  definition text not null,
  pronunciation text,
  category text,
  subcategory text,
  language_code text,
  source_language text,
  target_language text,
  difficulty_level text,
  usage_example text,
  notes text,
  tags text[],
  is_public boolean default false,
  is_verified boolean default false,
  usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.glossary_terms enable row level security;

create policy "Users can view their own terms"
  on public.glossary_terms for select
  using (auth.uid() = user_id);

create policy "Users can insert their own terms"
  on public.glossary_terms for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own terms"
  on public.glossary_terms for update
  using (auth.uid() = user_id);

create policy "Users can delete their own terms"
  on public.glossary_terms for delete
  using (auth.uid() = user_id);

-- Optional: public terms policy if is_public is true
create policy "Users can view public terms"
  on public.glossary_terms for select
  using (is_public = true);

-- Add triggers for updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.glossary_terms
  for each row execute procedure moddatetime (updated_at);
