-- Add learning_data column to profiles for cross-device sync
alter table public.profiles
  add column if not exists learning_data jsonb not null default '{}'::jsonb;
