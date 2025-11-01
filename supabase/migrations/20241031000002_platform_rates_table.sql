-- Create platform_rates table for user-specific platform pay rates
create table public.platform_rates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  platform_name text not null,
  rate_per_minute numeric(10,2) not null,
  currency text default 'USD' not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.platform_rates enable row level security;

-- Create policies
create policy "Users can manage own platform rates" on public.platform_rates
  for all using ((select auth.uid()) = user_id);

-- Create indexes
create index idx_platform_rates_user_id on public.platform_rates(user_id);
create index idx_platform_rates_user_active on public.platform_rates(user_id, is_active) where is_active = true;

-- Create trigger for updated_at
create trigger handle_updated_at before update on public.platform_rates
  for each row execute procedure public.handle_updated_at();

-- Grant permissions
grant all on public.platform_rates to authenticated;
