-- profiles に role カラムを追加
alter table public.profiles
  add column if not exists role text not null default 'member';

-- feedback に user_id カラムを追加（任意: ゲスト送信も許可するため nullable）
alter table public.feedback
  add column if not exists user_id uuid references public.profiles(id) on delete set null;
