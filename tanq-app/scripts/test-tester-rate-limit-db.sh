#!/usr/bin/env bash
set -euo pipefail

DB_URL="${TEST_DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/postgres}"
MIGRATION="supabase/migrations/20260823000001_add_tester_auth_rate_limits.sql"

psql "$DB_URL" -v ON_ERROR_STOP=1 <<'SQL'
-- Supabase migrations reference these platform roles. Plain postgres:16 does not
-- create them, so emulate only the role names needed to execute the real migration.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN; END IF;
END
$$;

create table if not exists public.tester_data (tester_name text primary key, payload jsonb);
create table if not exists public.tester_scores (tester_name text primary key, score integer);
truncate public.tester_data, public.tester_scores;
insert into public.tester_data values ('existing-tester', '{"kept":true}');
insert into public.tester_scores values ('existing-tester', 42);
SQL

psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$MIGRATION"

# Migration must not alter or destroy existing tester records.
[[ "$(psql "$DB_URL" -Atqc "select payload->>'kept' from public.tester_data where tester_name='existing-tester'")" == "true" ]]
[[ "$(psql "$DB_URL" -Atqc "select score from public.tester_scores where tester_name='existing-tester'")" == "42" ]]

psql "$DB_URL" -v ON_ERROR_STOP=1 -c "delete from public.tester_auth_rate_limits where rate_key='boundary'"
for _ in $(seq 1 10); do
  [[ "$(psql "$DB_URL" -Atqc "select blocked from public.check_tester_auth_rate_limit('boundary', true, 300, 10)")" == "f" ]]
done
# Request 11 is blocked, and a correct-code equivalent call cannot clear the block.
[[ "$(psql "$DB_URL" -Atqc "select blocked from public.check_tester_auth_rate_limit('boundary', true, 300, 10)")" == "t" ]]
[[ "$(psql "$DB_URL" -Atqc "select blocked from public.check_tester_auth_rate_limit('boundary', false, 300, 10)")" == "t" ]]

# State is shared across independent DB connections (app restart / separate process equivalent).
[[ "$(psql "$DB_URL" -Atqc "select attempt_count from public.tester_auth_rate_limits where rate_key='boundary'")" == "10" ]]

# Concurrent failures must serialize on the row lock and cannot lose increments.
psql "$DB_URL" -v ON_ERROR_STOP=1 -c "delete from public.tester_auth_rate_limits where rate_key='concurrent'"
pids=()
for _ in $(seq 1 10); do
  psql "$DB_URL" -v ON_ERROR_STOP=1 -Atqc "select blocked from public.check_tester_auth_rate_limit('concurrent', true, 300, 10)" >/tmp/tester-rate-limit-$RANDOM.out &
  pids+=("$!")
done
for pid in "${pids[@]}"; do wait "$pid"; done
[[ "$(psql "$DB_URL" -Atqc "select attempt_count from public.tester_auth_rate_limits where rate_key='concurrent'")" == "10" ]]
[[ "$(psql "$DB_URL" -Atqc "select blocked from public.check_tester_auth_rate_limit('concurrent', true, 300, 10)")" == "t" ]]

echo "tester rate-limit postgres integration checks passed"
