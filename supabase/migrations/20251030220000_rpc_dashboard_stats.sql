-- supabase/migrations/20251030220000_rpc_dashboard_stats.sql

create or replace function get_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  auth_user_id uuid := auth.uid();
  result jsonb;
  month_start timestamptz := date_trunc('month', now());
  month_end timestamptz := date_trunc('month', now()) + interval '1 month - 1 second';
  year_start timestamptz := date_trunc('year', now());
  year_end timestamptz := date_trunc('year', now()) + interval '1 year - 1 second';
begin
  select jsonb_build_object(
    'settings', (select row_to_json(s) from user_settings s where s.user_id = auth_user_id limit 1),
    'month_stats', (
      select jsonb_build_object(
        'totalDuration', coalesce(sum(cl.duration_seconds), 0),
        'totalEarnings', coalesce(sum(cl.earnings), 0),
        'callCount', count(cl.id)
      ) from call_logs cl
      where cl.user_id = auth_user_id
      and cl.start_time between month_start and month_end
    ),
    'year_stats', (
      select jsonb_build_object(
        'totalDuration', coalesce(sum(cl.duration_seconds), 0),
        'totalEarnings', coalesce(sum(cl.earnings), 0),
        'callCount', count(cl.id)
      ) from call_logs cl
      where cl.user_id = auth_user_id
      and cl.start_time between year_start and year_end
    ),
    'all_time_stats', (
      select jsonb_build_object(
        'totalDuration', coalesce(sum(cl.duration_seconds), 0),
        'totalEarnings', coalesce(sum(cl.earnings), 0),
        'callCount', count(cl.id),
        'avgDuration', coalesce(avg(cl.duration_seconds), 0)
      ) from call_logs cl
      where cl.user_id = auth_user_id
    ),
    'recent_calls', (
      select jsonb_agg(rc) from (
        select * from call_logs rc
        where rc.user_id = auth_user_id
        order by rc.start_time desc
        limit 5
      ) rc
    )
  ) into result;

  return result;
end;
$$;

grant execute on function get_dashboard_stats() to authenticated;
