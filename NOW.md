# NOW — 今この瞬間の状態

> Jobs が毎セッション終了時に更新する。新セッション開始時は CLAUDE.md の次にこれを読む。

**最終更新**: 2026-05-14  
**更新者**: Jobs

---

## インフラ構成（セットアップ済み・触らない）

| ツール | 状態 | 用途 |
|--------|------|------|
| Vercel CLI | ✅ ログイン済み | env var 変更を Jobs が自動実行 |
| Supabase CLI | ✅ ログイン・プロジェクト紐付け済み | `supabase db push` でSQL変更を Jobs が自動実行 |
| GitHub Actions | ✅ 稼働中 | push → main 自動マージ → Vercel デプロイ |
| Node.js / npm | ✅ インストール済み | 各CLIの動作基盤 |

**Supabase プロジェクトID**: `jdrhnxqvmohzikmfqzbl`  
**マイグレーションフォルダ**: `tanq-app/supabase/migrations/`  
次回以降のSQL変更 → Jobs がファイルを書いて `supabase db push` を実行。オーナー作業不要。

---

## 直近で完了したこと

| 日付 | 内容 |
|------|------|
| 2026-05-14 | **Supabase 接続完了** → ユーザー登録・ログイン・スコア保存が有効化 |
| 2026-05-14 | パスワードリセット機能実装（/reset-password + /reset-password/confirm） |
| 2026-05-14 | **GA4 設置完了** — 測定ID: G-TK27G02856・全ページのアクセス計測が有効化 |
| 2026-05-14 | **プライバシーポリシーページ公開** — /privacy・フッター・登録ページからリンク済み |
| 2026-05-14 | 料金プラン2本化（無料 / TANQ Premium ¥100/月）・フリー枠を漢字小1-2＋時計に限定 |
| 2026-05-14 | 時計アプリ 難易度別分割（ちょうど・30分=無料 / ぜんぶ=プレミアム） |
| 2026-05-14 | TANQ Story Unit1 4→10ステップ・Unit2 5→10ステップに強化 |
| 2026-05-14 | リン＋Ken＋ゆい（新設）チーム体制整備・ハナ（Marketing）再始動 |
| 2026-05-14 | **X投稿自動化 — GitHub Actions版** scripts/generate_x_draft.py + 4ワークフロー構築 |

---

## 現在の最優先タスク（この順番で）

1. **料金プランの確認** — ¥480プランがコードに存在しない（オーナー確認要）
2. **リアルユーザー（小学生）へのテスト提供** — 最重要KPI

---

## ブロッカー（オーナー作業 — 2ステップのみ）

### X投稿自動化を動かすために必要（5分で完了）

**STEP 1: Resend 無料アカウント作成**
1. https://resend.com にアクセス → 無料登録（月3000通まで無料）
2. 「API Keys」→「Create API Key」→ キーをコピー

**STEP 2: GitHub Secrets に2つ追加**  
→ https://github.com/mtk-ctrl/kaisha01/settings/secrets/actions  
→「New repository secret」で以下を追加:

| Secret名 | 値 |
|---------|---|
| `RESEND_API_KEY` | Resendで取得したキー（re_xxxxxxxxxx） |
| `ANTHROPIC_API_KEY` | Claude Code設定で使っているAPIキー |

追加後、GitHub Actions タブ → 「X文案 朝7時」→「Run workflow」で即テスト可能。

---

| ~~完了済み~~ | 詳細 |
|------------|------|
| ~~パスワードリセットURL設定~~ | ✅ supabase config push で完了 |
| ~~料金プラン確認~~ | ✅ 2プランに整理済み（無料/¥100/月） |

---

## 現在のブランチ

`claude/angry-sammet-1164b1` → GitHub Actions で main に自動マージ → Vercel 自動デプロイ

---

## 次セッションで Jobs がやること

1. **ゆい（小1）** による時計・漢字小1-2のUXレビュー実施
2. **ソラ（Analytics）** にGA4データ取得依頼（KPIダッシュボード着手）
3. **Unit3・Unit4** の強化（Ken優先度付け済み）
4. リアルユーザーへのテスト提供準備（招待メール文案・手順）
5. オーナーがResend/Secrets設定後 → X投稿システム稼働確認
