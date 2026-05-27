# インフラ・デプロイ詳細

> 概要は `NOW.md` のサービス状態テーブルを見ること。  
> このファイルは確認コマンドと設定詳細の置き場。

---

## デプロイフロー全体図

```
【Jobs が claude/* ブランチに push】
         │
         ▼
【GitHub】リポジトリにコードが届く
         │  トリガー: push to claude/**
         ▼
【GitHub Actions】.github/workflows/auto-merge.yml が起動
   ┌─────────────────────────────────────────────┐
   │ job1: merge-to-main                         │
   │   使う Secret: GITHUB_TOKEN（自動付与）      │
   │   → main ブランチへ --no-ff マージ           │
   │   → git push origin main                    │
   │   ※ 失敗してもjob2は動く（if: always()）    │
   └─────────────────────────────────────────────┘
         │（成功/失敗どちらでも）
         ▼
   ┌─────────────────────────────────────────────┐
   │ job2: deploy-to-vercel                      │
   │                                             │
   │ Step1: Run DB migrations（条件付き）         │
   │   使う Secret: SUPABASE_ACCESS_TOKEN        │
   │   条件: supabase/migrations/ に変更がある時だけ│
   │   → npx supabase@2 db push                 │
   │   → Supabase DB にスキーマ変更を適用        │
   │   ※ 失敗してもStep2は動く（continue-on-error）│
   │                                             │
   │ Step2: Deploy to Vercel                     │
   │   使う Secret: VERCEL_TOKEN                 │
   │              VERCEL_ORG_ID                  │
   │              VERCEL_PROJECT_ID              │
   │   → vercel --prod → Vercel にコードを送信   │
   │   → Vercel がビルド & Edge にデプロイ       │
   │                                             │
   │ Step3: 本番確認                              │
   │   使う Secret: VERCEL_AUTOMATION_BYPASS_SECRET│
   │   → 本番URLにリクエストして200を確認        │
   └─────────────────────────────────────────────┘
         │
         ▼
【Vercel】Next.js アプリが Edge/Serverless で動作
   ┌─────────────────────────────────────────────┐
   │ アプリ実行中に使う環境変数（Vercel Dashで設定）│
   │                                             │
   │ NEXT_PUBLIC_SUPABASE_URL   ← ブラウザ/Edge │
   │ NEXT_PUBLIC_SUPABASE_ANON_KEY ← 同上        │
   │ SUPABASE_SERVICE_ROLE_KEY  ← サーバーのみ  │
   │ NEXT_PUBLIC_GA_ID          ← ブラウザ計測  │
   │ NEXT_PUBLIC_LAB_PASSWORD   ← ラボ入室パス  │
   └─────────────────────────────────────────────┘
         │  リクエスト/レスポンス
         ▼
【Supabase】認証・DB・RLS
   - auth.users（ユーザー管理）
   - public.profiles（プロフィール）
   - public.scores（スコア）
   - public.feedback（フィードバック）
```

---

## シークレット・環境変数 完全マップ

> ⚠️ **重要**: GitHub Secrets と Vercel 環境変数は**完全に別の場所**。  
> GitHub Secrets は CI パイプライン専用。アプリ本体は Vercel の環境変数を使う。

### GitHub Secrets（Actions が使う）
設定場所: GitHub → リポジトリ Settings → Secrets and variables → Actions

| Secret 名 | 何のために | 現状 |
|-----------|-----------|------|
| `VERCEL_TOKEN` | Vercel CLI 認証（vercel --prod） | ✅ 登録済み |
| `VERCEL_ORG_ID` | Vercel 組織ID | ✅ 登録済み |
| `VERCEL_PROJECT_ID` | Vercel プロジェクトID | ✅ 登録済み |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | 本番確認ステップの bypass | ✅ 登録済み |
| `SUPABASE_ACCESS_TOKEN` | `supabase db push`（CLI認証） | ✅ 登録済み |
| `RESEND_API_KEY` | Resend メール送信 | ⚠️ 登録済み・動作未確認 |
| `ANTHROPIC_API_KEY` | Claude API | ❌ 未登録 |
| `GEMINI_API_KEY` | Gemini API | ❌ 未登録 |

### Vercel 環境変数（アプリ本体が使う）
設定場所: Vercel Dashboard → Project → Settings → Environment Variables

| 変数名 | 何のために | 現状 | 値の取得元 |
|--------|-----------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 接続URL（全クライアント） | ❌ **未設定** | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（公開可） | ❌ **未設定** | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin 操作（register API） | ❌ **未設定** | 同上（service_role） |
| `NEXT_PUBLIC_GA_ID` | GA4 測定 | ❌ **未設定** | `G-TK27G02856` で固定 |
| `NEXT_PUBLIC_LAB_PASSWORD` | ラボ入室パスワード | ❌ **未設定** | `tanq2026`（任意変更可） |

---

## オーナー作業：Vercel 環境変数の設定手順

**今すぐやらないと壊れ続けるもの:**

1. Vercel Dashboard にアクセス → tanq-app プロジェクト → Settings → Environment Variables
2. 以下を「Production / Preview / Development 全環境」に追加:

```
NEXT_PUBLIC_SUPABASE_URL      = https://jdrhnxqvmohzikmfqzbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = （Supabase → Project Settings → API → anon key）
SUPABASE_SERVICE_ROLE_KEY     = （Supabase → Project Settings → API → service_role key）
NEXT_PUBLIC_GA_ID             = G-TK27G02856
NEXT_PUBLIC_LAB_PASSWORD      = tanq2026
```

3. 設定後、Vercel で Redeploy（または次の claude/* push で自動反映）

**Supabase のキーはここ**: Supabase Dashboard → jdrhnxqvmohzikmfqzbl プロジェクト → Settings → API

---

## 現状と理想の比較

| 項目 | 現状 | 理想 |
|------|------|------|
| コードのデプロイ | ✅ claude/* push → Vercel 自動デプロイ | 変更なし |
| DB マイグレーション | ✅ SQL変更時のみ自動実行（continue-on-error） | 変更なし |
| Supabase 認証 | ❌ env var 未設定で動作不可 | ✅ Vercel に env var 設定後 |
| ユーザー登録 | ❌ SUPABASE_SERVICE_ROLE_KEY なし | ✅ 同上 |
| GA4 計測 | ❌ env var 未設定 | ✅ 同上 |
| ミドルウェア | ✅ null ガード済み（env var なしでもクラッシュしない） | 変更なし |

**Vercel に env var を設定するだけで残り全部解決する。**

---

## サービス確認コマンド

```bash
# ① GitHub Actions（auto-mergeが動いているか）
git log origin/main -3 --oneline
# → 最新に「🚀 Auto-deploy」があればOK

# ② Vercel 本番疎通確認
curl -s -o /dev/null -w "Vercel: %{http_code}\n" https://tanq-app.vercel.app/
# → 200 = OK

# ③ Supabase エンドポイント疎通
curl -s -o /dev/null -w "Supabase: %{http_code}\n" \
  "https://jdrhnxqvmohzikmfqzbl.supabase.co/rest/v1/" -H "apikey: dummy"
# → 401か403 = OK（エンドポイント生きている）

# ④ GitHub Secrets 設定状況（使用中のキー一覧）
grep -h "secrets\." /home/user/kaisha01/.github/workflows/*.yml | grep -oP "secrets\.\w+" | sort -u

# ⑤ GA4 実装確認
grep "NEXT_PUBLIC_GA_ID" /home/user/kaisha01/tanq-app/src/app/layout.tsx
```

---

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番（直接コミットしない） |
| `claude/*` | Jobsの作業ブランチ（自動マージされる） |

---

## Supabase

| 項目 | 値 |
|------|---|
| プロジェクトID | `jdrhnxqvmohzikmfqzbl` |
| エンドポイント | `https://jdrhnxqvmohzikmfqzbl.supabase.co` |
| マイグレーション置き場 | `tanq-app/supabase/migrations/` |
| migration 適用方法 | `claude/*` push → GitHub Actions が `supabase db push` を自動実行（SQL変更時のみ） |
| migration 命名規則 | `YYYYMMDD000001_説明.sql`（同日複数は末尾 000002, 000003…）。**ファイル名順が実行順** |
| セッション管理 | `@supabase/ssr`（Cookie ベース）+ `src/middleware.ts` で自動リフレッシュ |

### DB スキーマ（テーブル一覧）

| テーブル | 主な用途 |
|---------|---------|
| `profiles` | ユーザープロフィール（id・email・child_name・grade・mode・role） |
| `scores` | アプリスコア履歴（user_id・app_id・score・total・difficulty） |
| `feedback` | フィードバック送信（user_id nullable・fav_app・quit_note・again・memo） |

RLS有効：`profiles`・`scores` は本人のみ読み書き可。`feedback` は insert のみ全許可。

---

## ローカル開発

```bash
cd tanq-app
cp .env.local.example .env.local   # Supabase のキーを記入してから
npm install
npm run dev   # http://localhost:3000
npm run build # 本番ビルド確認（push前に必ず通す）
```

---

*最終更新: 2026-05-27 | 更新者: Jobs（全フロー整理・Vercel env var 未設定問題を記録）*
