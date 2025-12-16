create table if not exists glossary_terms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table glossary_terms enable row level security;

create policy "Users can view their own glossary terms or public ones"
  on glossary_terms for select
  using ( auth.uid() = user_id or is_public = true );

create policy "Users can insert their own glossary terms"
  on glossary_terms for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own glossary terms"
  on glossary_terms for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own glossary terms"
  on glossary_terms for delete
  using ( auth.uid() = user_id );

-- Create an index on user_id for faster lookups
create index if not exists glossary_terms_user_id_idx on glossary_terms(user_id);
