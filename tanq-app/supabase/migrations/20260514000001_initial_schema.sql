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
  app_id      text not null,
  score       int  not null,
  total       int  not null,
  difficulty  text,
  created_at  timestamptz default now()
);

-- フィードバック
create table if not exists feedback (
  id         uuid primary key default gen_random_uuid(),
  fav_app    text,
  quit_note  text,
  again      text,
  memo       text,
  grade      text,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table scores   enable row level security;
alter table feedback enable row level security;

create policy "profiles_self" on profiles using (auth.uid() = id);
create policy "scores_self"   on scores   using (auth.uid() = user_id);
create policy "feedback_insert" on feedback for insert with check (true);
create policy "feedback_select" on feedback for select using (false);

-- インデックス
create index if not exists scores_user_id_idx on scores(user_id);
create index if not exists scores_app_id_idx  on scores(app_id);
