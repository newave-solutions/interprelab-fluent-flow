-- Fix Multiple Permissive Policies warnings
-- Combine multiple SELECT policies into single policies with OR conditions

-- Fix glossary_terms policies
drop policy if exists "Users can manage own glossary terms" on public.glossary_terms;
drop policy if exists "Users can view public glossary terms" on public.glossary_terms;

-- Create combined policies for glossary_terms
create policy "Users can view glossary terms" on public.glossary_terms
  for select using (
    (select auth.uid()) = user_id or is_public = true
  );

create policy "Users can insert own glossary terms" on public.glossary_terms
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own glossary terms" on public.glossary_terms
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own glossary terms" on public.glossary_terms
  for delete using ((select auth.uid()) = user_id);

-- Fix learning_paths policies
drop policy if exists "Users can view own learning paths" on public.learning_paths;
drop policy if exists "Users can manage own learning paths" on public.learning_paths;

-- Create combined policies for learning_paths
create policy "Users can view learning paths" on public.learning_paths
  for select using (
    (select auth.uid()) = user_id or is_public = true
  );

create policy "Users can insert own learning paths" on public.learning_paths
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own learning paths" on public.learning_paths
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own learning paths" on public.learning_paths
  for delete using ((select auth.uid()) = user_id);
