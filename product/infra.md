# インフラ・デプロイ詳細

> 概要は `NOW.md` のサービス状態テーブルを見ること。  
> このファイルは確認コマンドと設定詳細の置き場。

---

## サービス確認コマンド（セッション開始時に使う）

```bash
# ① GitHub Actions（auto-mergeが動いているか）
git log origin/main -3 --oneline
# → 最新に「🚀 Auto-deploy」があればOK

# ② Vercel GitHub App接続確認（0件なら未接続）
curl -s "https://api.github.com/repos/mtk-ctrl/kaisha01/commits/$(git rev-parse origin/main)/status" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('Vercel statuses:', len(d.get('statuses',[])))"
# → 0件 = 連携なし（要修正） / 1件以上 = 連携OK

# ③ Supabase エンドポイント疎通
curl -s -o /dev/null -w "Supabase: %{http_code}\n" \
  "https://jdrhnxqvmohzikmfqzbl.supabase.co/rest/v1/" -H "apikey: dummy"
# → 401か403 = OK（エンドポイント生きている）

# ④ GitHub Secrets 設定状況
grep -h "secrets\." /home/user/kaisha01/.github/workflows/*.yml | grep -oP "secrets\.\w+" | sort -u
# → VERCEL_TOKEN / RESEND_API_KEY / ANTHROPIC_API_KEY が出なければ未設定

# ⑤ GA4 実装確認
grep "NEXT_PUBLIC_GA_ID" /home/user/kaisha01/tanq-app/src/app/layout.tsx
# → 1行でも出ればOK
```

---

## デプロイフロー

```
Jobs が claude/* ブランチに push
    ↓
GitHub Actions (.github/workflows/auto-merge.yml) が起動
    ↓
main ブランチに自動マージ
    ↓
Vercel が自動デプロイ（※GitHub App接続後に有効）
    ↓
本番反映（約2〜3分）
```

**本番URL**: https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/

---

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番（直接コミットしない） |
| `claude/*` | Jobsの作業ブランチ（自動マージされる） |

---

## Vercel 未接続問題（2026-05-16 根本原因判明）

**原因**: Vercel GitHub AppがリポジトリにWebhook未登録。  
→ GitHub commitのstatus件数を確認すると0件（上記②コマンドで確認可能）。

**恒久解決（オーナー5分作業・未完了）**:
1. Vercel → kaisha01プロジェクト → Settings → Git → GitHubリポジトリ連携
2. GitHub Secrets に `VERCEL_TOKEN` を追加
3. Jobs が GitHub Actions に `vercel --prod --token=$VERCEL_TOKEN` ステップを追加 → 完了

**完了後は `NOW.md` のVercel行を ✅ に更新すること**

---

## 環境変数

| 変数名 | 用途 | 状態 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | ✅ 設定済み |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ 設定済み |
| `NEXT_PUBLIC_GA_ID` | GA4 測定ID | ✅ `G-TK27G02856` |
| `VERCEL_TOKEN` | Vercel CLI認証（GitHub Actions用） | ❌ 未設定 |
| `RESEND_API_KEY` | Resend メール送信 | ❌ 未設定 |
| `ANTHROPIC_API_KEY` | Claude API（X投稿文案） | ❌ 未設定 |

---

## Supabase

| 項目 | 値 |
|------|---|
| プロジェクトID | `jdrhnxqvmohzikmfqzbl` |
| エンドポイント | `https://jdrhnxqvmohzikmfqzbl.supabase.co` |
| マイグレーション | `tanq-app/supabase/migrations/` |
| SQL変更方法 | ファイルを書いて `supabase db push` を実行（Jobsが自動実行可能） |

---

## ローカル開発

```bash
cd tanq-app
npm install
npm run dev   # http://localhost:3000
npx tsc --noEmit  # 型チェック
```

---

*最終更新: 2026-05-16 | 更新者: Jobs*
