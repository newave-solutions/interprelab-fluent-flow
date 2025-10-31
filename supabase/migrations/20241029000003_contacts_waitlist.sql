-- Create contacts and waitlist tables
-- These tables support the /contact and /waitlist pages

-- Create contacts table for contact form submissions
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  name text not null,
  email text not null,
  phone text,
  organization text,
  inquiry_type text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contacts
alter table public.contacts enable row level security;

-- Contacts RLS policies (optimized with scalar subqueries)
create policy "Anyone can submit contact form"
  on public.contacts for insert
  with check (true);

create policy "Users can view their own contacts"
  on public.contacts for select
  using ((select auth.uid()) = user_id);

create policy "Admins can view all contacts"
  on public.contacts for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Admins can update contacts"
  on public.contacts for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- Create waitlist table for waitlist signups
create table public.waitlist (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  company text,
  role text,
  interest_area text,
  referral_source text,
  status text default 'pending' check (status in ('pending', 'invited', 'registered', 'declined')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on waitlist
alter table public.waitlist enable row level security;

-- Waitlist RLS policies (optimized with scalar subqueries)
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

create policy "Admins can view waitlist"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Admins can update waitlist"
  on public.waitlist for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );

-- Create indexes for performance
create index idx_contacts_user_id on public.contacts(user_id);
create index idx_contacts_created_at on public.contacts(created_at desc);
create index idx_contacts_status on public.contacts(status);
create index idx_waitlist_email on public.waitlist(email);
create index idx_waitlist_created_at on public.waitlist(created_at desc);
create index idx_waitlist_status on public.waitlist(status);

-- Add updated_at triggers
create trigger handle_updated_at before update on public.contacts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.waitlist
  for each row execute procedure public.handle_updated_at();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant insert on public.contacts to anon, authenticated;
grant select on public.contacts to authenticated;
grant insert on public.waitlist to anon, authenticated;
grant select on public.waitlist to authenticated;
