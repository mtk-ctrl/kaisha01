# インフラ・デプロイ

> 変更頻度: 低

---

## デプロイフロー（完全自動）

```
Jobs が claude/* ブランチに push
    ↓
GitHub Actions (.github/workflows/) が起動
    ↓
main ブランチに自動マージ
    ↓
Vercel が自動デプロイ
    ↓
本番反映（約2〜3分）
```

**オーナー操作: 不要**

---

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番（直接コミットしない） |
| `claude/*` | Jobs の作業ブランチ（自動マージされる） |

---

## 環境変数（Vercel に設定が必要）

| 変数名 | 用途 | 状態 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | ⚠️ 未設定 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ⚠️ 未設定 |

---

## Supabase スキーマ

実行ファイル: `tanq-app/supabase-schema.sql`  
実行場所: Supabase ダッシュボード → SQL Editor

---

## ローカル開発

```bash
cd tanq-app
npm install
npm run dev   # http://localhost:3000
npx tsc --noEmit  # 型チェック
```
