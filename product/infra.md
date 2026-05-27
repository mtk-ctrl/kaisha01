# インフラ・デプロイ詳細

> 概要は `NOW.md` のサービス状態テーブルを見ること。  
> このファイルは確認コマンドと設定詳細の置き場。

---

## デプロイフロー全体図（理想形・現在の実装）

```
【Jobs が claude/* ブランチに push】
         │
         ▼
【GitHub】リポジトリにコードが届く
         │  トリガー: push to claude/**
         ▼
【GitHub Actions】auto-merge.yml が起動
         │
    ┌────┴────────────────────────────────────────┐
    │ job1: merge-to-main                         │
    │   Secret: GITHUB_TOKEN（自動）              │
    │   → main に --no-ff マージ & push           │
    │   ※ 失敗しても job2 は動く（if: always()） │
    └────┬────────────────────────────────────────┘
         │（成功/失敗どちらでも）
    ┌────┴────────────────────────────────────────┐
    │ job2: deploy-to-vercel                      │
    │                                             │
    │ Step1: Run DB migrations（条件付き）         │
    │   Secret: SUPABASE_ACCESS_TOKEN             │
    │   条件: supabase/migrations/ に変更がある時 │
    │   → supabase@2 db push → Supabase DB 更新  │
    │   ※ 失敗しても続行（continue-on-error）     │
    │                                             │
    │ Step2: Sync env vars to Vercel ★           │
    │   Secret: VERCEL_TOKEN                      │
    │           NEXT_PUBLIC_SUPABASE_ANON_KEY     │
    │           SUPABASE_SERVICE_ROLE_KEY         │
    │   → vercel env add で Vercel Dashboard を   │
    │     GitHub Secrets から自動更新             │
    │   （Vercel Dashboard を手動で触る不要）      │
    │                                             │
    │ Step3: Deploy to Vercel                     │
    │   Secret: VERCEL_TOKEN / ORG_ID / PROJECT_ID│
    │   → vercel --prod → ビルド & Edge デプロイ  │
    │                                             │
    │ Step4: 本番確認                              │
    │   Secret: VERCEL_AUTOMATION_BYPASS_SECRET   │
    │   → HTTP 200 を確認                         │
    └─────────────────────────────────────────────┘
         │
         ▼
【Vercel】Next.js アプリ稼働（env vars は Step2 で自動設定済み）
         │
         ▼
【Supabase】認証・DB・RLS
```

---

## シークレット管理（GitHub Secrets のみで完結）

> **原則**: Vercel Dashboard・Supabase Dashboard を手動で触る必要はない。  
> すべて GitHub Secrets に登録すれば CI が各サービスに自動同期する。

### GitHub Secrets 一覧
設定場所: GitHub → Settings → Secrets and variables → Actions

| Secret 名 | 用途 | 状態 |
|-----------|------|------|
| `VERCEL_TOKEN` | Vercel CLI 認証 | ✅ 登録済み |
| `VERCEL_ORG_ID` | Vercel 組織 ID | ✅ 登録済み |
| `VERCEL_PROJECT_ID` | Vercel プロジェクト ID | ✅ 登録済み |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | 本番確認 bypass | ✅ 登録済み |
| `SUPABASE_ACCESS_TOKEN` | supabase CLI 認証（migration 用） | ✅ 登録済み |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key → Vercel に自動同期 | ❌ **要登録** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role → Vercel に自動同期 | ❌ **要登録** |
| `RESEND_API_KEY` | Resend メール送信 | ⚠️ 登録済み・動作未確認 |
| `ANTHROPIC_API_KEY` | Claude API | ❌ 未登録（Phase 3） |
| `GEMINI_API_KEY` | Gemini API | ❌ 未登録（Phase 3） |

### Vercel 環境変数（CI が自動管理・手動設定不要）
以下は CI の "Sync env vars" ステップが毎デプロイ時に自動で設定する。

| 変数名 | 値 | 管理方法 |
|--------|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jdrhnxqvmohzikmfqzbl.supabase.co` | ワークフローに直接記述（非シークレット） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | GitHub Secret `NEXT_PUBLIC_SUPABASE_ANON_KEY` から |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | GitHub Secret `SUPABASE_SERVICE_ROLE_KEY` から |
| `NEXT_PUBLIC_GA_ID` | `G-TK27G02856` | ワークフローに直接記述 |
| `NEXT_PUBLIC_LAB_PASSWORD` | `tanq2026` | ワークフローに直接記述 |

---

## オーナー作業（残り 2 件）

GitHub → mtk-ctrl/kaisha01 → Settings → Secrets and variables → Actions に追加:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY  = （Supabase → Project Settings → API → anon public key）
SUPABASE_SERVICE_ROLE_KEY      = （Supabase → Project Settings → API → service_role key）
```

> **これだけ。Vercel Dashboard での設定は一切不要。**

---

## サービス確認コマンド

```bash
# ① GitHub Actions（auto-merge が動いているか）
git log origin/main -3 --oneline
# → 最新に「🚀 Auto-deploy」があればOK

# ② Vercel 本番疎通確認
curl -s -o /dev/null -w "Vercel: %{http_code}\n" https://tanq-app.vercel.app/
# → 200 = OK

# ③ Supabase エンドポイント疎通
curl -s -o /dev/null -w "Supabase: %{http_code}\n" \
  "https://jdrhnxqvmohzikmfqzbl.supabase.co/rest/v1/" -H "apikey: dummy"
# → 401 か 403 = OK（エンドポイント生きている）

# ④ GitHub Secrets 使用一覧
grep -h "secrets\." /home/user/kaisha01/.github/workflows/*.yml | grep -oP "secrets\.\w+" | sort -u
```

---

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番（直接コミットしない） |
| `claude/*` | Jobs の作業ブランチ（自動マージされる） |

---

## Supabase

| 項目 | 値 |
|------|---|
| プロジェクト ID | `jdrhnxqvmohzikmfqzbl` |
| エンドポイント | `https://jdrhnxqvmohzikmfqzbl.supabase.co` |
| マイグレーション置き場 | `tanq-app/supabase/migrations/` |
| migration 適用方法 | `claude/*` push → SQL 変更検知 → supabase@2 db push（自動） |
| migration 命名規則 | `YYYYMMDD000001_説明.sql`（同日複数は末尾 000002, 000003…）|
| セッション管理 | `@supabase/ssr`（Cookie）+ `middleware.ts` で自動リフレッシュ |

### DB スキーマ

| テーブル | 主な用途 |
|---------|---------|
| `profiles` | ユーザープロフィール（id・email・child_name・grade・mode・role） |
| `scores` | アプリスコア履歴（user_id・app_id・score・total・difficulty） |
| `feedback` | フィードバック送信（user_id nullable・fav_app・quit_note・again・memo） |

RLS 有効：`profiles`・`scores` は本人のみ。`feedback` は insert のみ全許可。

---

## ローカル開発

```bash
cd tanq-app
cp .env.local.example .env.local   # Supabase のキーを記入
npm install
npm run dev   # http://localhost:3000
npm run build # push 前に必ず通す
```

---

*最終更新: 2026-05-27 | 更新者: Jobs（理想形フロー実装：GitHub Secrets → Vercel 自動同期）*
