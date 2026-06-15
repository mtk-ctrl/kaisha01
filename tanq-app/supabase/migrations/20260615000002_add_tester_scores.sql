-- テスター（auth.users を持たない）のスコア履歴。member は scores テーブル（profiles にFK）に保存するが、
-- tester は FK を張れないため別テーブルにする。家族テストの正答率・プレイ実データ収集にも使う。
-- service role でのみ読み書きする（RLS 有効・公開ポリシー無し）。
create table if not exists tester_scores (
  id          uuid primary key default gen_random_uuid(),
  tester_name text not null,
  app_id      text not null,
  score       int  not null,
  total       int  not null,
  difficulty  text,
  created_at  timestamptz default now()
);

alter table tester_scores enable row level security;

create index if not exists tester_scores_name_idx   on tester_scores(tester_name);
create index if not exists tester_scores_app_id_idx  on tester_scores(app_id);
