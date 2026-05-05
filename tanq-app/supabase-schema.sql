-- TANQ Inc. Supabase スキーマ
-- Supabase Dashboard > SQL Editor で実行してください

-- ユーザープロフィール
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  child_name  text not null,
  grade       text,
  mode        text default 'spark',
  lab_unlocked boolean default false,
  created_at  timestamptz default now()
);

-- スコア履歴
create table if not exists scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  app_id      text not null,           -- 'math', 'kanji', 'clock', 'english', 'shapes', 'coding', 'tanq'
  score       int  not null,
  total       int  not null,
  difficulty  text,                    -- 'かんたん' | 'ふつう' | 'むずかしい' | null
  created_at  timestamptz default now()
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table scores   enable row level security;

-- プロフィールは本人のみ読み書き
create policy "profiles_self" on profiles
  using (auth.uid() = id);

-- スコアは本人のみ読み書き
create policy "scores_self" on scores
  using (auth.uid() = user_id);

-- インデックス
create index if not exists scores_user_id_idx on scores(user_id);
create index if not exists scores_app_id_idx  on scores(app_id);
