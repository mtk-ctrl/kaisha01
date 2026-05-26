# インフラ・デプロイ詳細

> 概要は `NOW.md` のサービス状態テーブルを見ること。  
> このファイルは確認コマンドと設定詳細の置き場。

---

## サービス確認コマンド（セッション開始時に使う）

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

## デプロイフロー

```
Jobs が claude/* ブランチに push
    ↓
GitHub Actions (.github/workflows/auto-merge.yml) が起動
    ↓
merge-to-main: main ブランチに自動マージ（失敗しても次に進む）
    ↓
deploy-to-vercel（if: always()）:
  1. Run DB migrations（SUPABASE_ACCESS_TOKEN があれば supabase db push）
  2. vercel --prod --token=$VERCEL_TOKEN
  3. 本番URLのHTTPステータスと画面要素を確認
    ↓
本番反映（約2〜3分）
```

**本番URL**: https://tanq-app.vercel.app/

---

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番（直接コミットしない） |
| `claude/*` | Jobsの作業ブランチ（自動マージされる） |

---

## GitHub Secrets（登録済み一覧）

| Secret名 | 用途 | 状態 |
|---------|------|------|
| `VERCEL_TOKEN` | Vercel CLI 認証 | ✅ 登録済み |
| `VERCEL_ORG_ID` | Vercel 組織ID | ✅ 登録済み |
| `VERCEL_PROJECT_ID` | Vercel プロジェクトID | ✅ 登録済み |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | 本番確認ステップ用 | ✅ 登録済み |
| `SUPABASE_ACCESS_TOKEN` | migration 自動化（supabase db push） | ✅ 登録済み（2026-05-26） |
| `RESEND_API_KEY` | Resend メール送信 | ⚠️ 登録済み・動作未確認 |
| `ANTHROPIC_API_KEY` | Claude API（X投稿文案等） | ❌ 未登録 |
| `GEMINI_API_KEY` | Gemini API（X投稿文案等） | ❌ 未登録 |

---

## Vercel 環境変数（Vercel Dashboard で設定）

| 変数名 | 用途 | 状態 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | ✅ 設定済み |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ 設定済み |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロール（admin操作用） | ✅ 設定済み |
| `NEXT_PUBLIC_GA_ID` | GA4 測定ID | ✅ `G-TK27G02856` |

---

## Supabase

| 項目 | 値 |
|------|---|
| プロジェクトID | `jdrhnxqvmohzikmfqzbl` |
| エンドポイント | `https://jdrhnxqvmohzikmfqzbl.supabase.co` |
| マイグレーション置き場 | `tanq-app/supabase/migrations/` |
| migration 適用方法 | `claude/*` push → GitHub Actions が `supabase db push` を自動実行 |
| migration 命名規則 | `YYYYMMDD000001_説明.sql`（同日複数は末尾 000002, 000003…）。**ファイル名順が実行順**になる |
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
npm install
npm run dev   # http://localhost:3000
npm run build # 本番ビルド確認（push前に必ず通す）
npx tsc --noEmit  # 型チェック
```

---

*最終更新: 2026-05-26 | 更新者: Jobs*
