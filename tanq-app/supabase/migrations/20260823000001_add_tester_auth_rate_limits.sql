create table if not exists public.tester_auth_rate_limits (
  rate_key text primary key,
  window_started_at timestamptz not null,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.tester_auth_rate_limits enable row level security;

-- No anon/authenticated policies: this table is service-role only.

create or replace function public.check_tester_auth_rate_limit(
  p_rate_key text,
  p_failed boolean,
  p_window_seconds integer default 300,
  p_max_failures integer default 10
)
returns table(blocked boolean, retry_after integer, attempt_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_row public.tester_auth_rate_limits%rowtype;
  v_elapsed integer;
begin
  insert into public.tester_auth_rate_limits(rate_key, window_started_at, attempt_count, updated_at)
  values (p_rate_key, v_now, 0, v_now)
  on conflict (rate_key) do nothing;

  select * into v_row
  from public.tester_auth_rate_limits
  where rate_key = p_rate_key
  for update;

  v_elapsed := greatest(0, floor(extract(epoch from (v_now - v_row.window_started_at)))::integer);
  if v_elapsed >= p_window_seconds then
    update public.tester_auth_rate_limits as rl
      set window_started_at = v_now, attempt_count = 0, updated_at = v_now
      where rl.rate_key = p_rate_key
      returning rl.* into v_row;
    v_elapsed := 0;
  end if;

  -- Once ten failures have already been consumed, the next request is blocked.
  -- A correct code cannot clear the block; only the time window can.
  if v_row.attempt_count >= p_max_failures then
    return query select true, greatest(1, p_window_seconds - v_elapsed), v_row.attempt_count;
    return;
  end if;

  if p_failed then
    update public.tester_auth_rate_limits as rl
      set attempt_count = rl.attempt_count + 1, updated_at = v_now
      where rl.rate_key = p_rate_key
      returning rl.* into v_row;
  end if;

  -- The first ten failed requests are 401 responses; request 11+ is 429.
  return query select false, 0, v_row.attempt_count;
end;
$$;

revoke all on function public.check_tester_auth_rate_limit(text, boolean, integer, integer) from public, anon, authenticated;
grant execute on function public.check_tester_auth_rate_limit(text, boolean, integer, integer) to service_role;

-- Rollback after the old app version is restored:
-- drop function if exists public.check_tester_auth_rate_limit(text, boolean, integer, integer);
-- drop table if exists public.tester_auth_rate_limits;
