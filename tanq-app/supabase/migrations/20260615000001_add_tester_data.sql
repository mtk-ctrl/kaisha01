-- テスター（PIN認証・auth.users を持たない）の学習データをテスター名キーで保存する。
-- member は profiles.learning_data に保存するが、tester は auth ユーザーが無いため別テーブルにする。
-- API は service role（getServiceClient）でのみ読み書きするため、公開ポリシーは作らない
-- （RLS 有効＋ポリシー無し＝anon/authenticated からは不可、service_role はバイパス）。
create table if not exists tester_data (
  tester_name   text primary key,
  learning_data jsonb not null default '{}'::jsonb,
  updated_at    timestamptz default now()
);

alter table tester_data enable row level security;
