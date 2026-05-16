# NOW — 今この瞬間の状態

> Jobs が毎セッション終了時に更新する。新セッション開始時は CLAUDE.md の次にこれを読む。

**最終更新**: 2026-05-16  
**更新者**: Jobs

---

## ⚠️ Jobs への重要注意（2026-05-16 オーナー決定・CLAUDE.mdにも記載）

- **完了報告の前に本番URLで自分が確認する。確認なしに「完了しました」と言わない**
- 「オーナーが確認してください」は禁止。自分で確認できない理由を明示した上で、オーナー操作が必要な最小限のみ依頼する
- このセッションでの失敗: デプロイ確認をオーナーに投げた → 以後やらない

---

## インフラ構成（セットアップ済み・触らない）

| ツール | 状態 | 用途 |
|--------|------|------|
| Vercel CLI | ⚠️ 要確認 | セッションをまたぐと認証が消える（下記参照） |
| Supabase CLI | ✅ ログイン・プロジェクト紐付け済み | `supabase db push` でSQL変更を Jobs が自動実行 |
| GitHub Actions | ✅ 稼働中 | push → main 自動マージ → Vercel デプロイ |
| Node.js / npm | ✅ インストール済み | 各CLIの動作基盤 |

## 各サービス確認コマンド（Jobs がセッション開始時に使う）

```bash
# GitHub Actions（auto-mergeが動いているか）
git log origin/main -3 --oneline
# → 「🚀 Auto-deploy」が最新にあればOK

# Vercel GitHub App連携（0件なら連携切れ）
curl -s "https://api.github.com/repos/mtk-ctrl/kaisha01/commits/$(git rev-parse origin/main)/status" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('Vercel statuses:', len(d.get('statuses',[])))"
# → 0件 = 連携なし（要修正） / 1件以上 = 連携OK

# Supabase エンドポイント疎通
curl -s -o /dev/null -w "Supabase: %{http_code}\n" \
  "https://jdrhnxqvmohzikmfqzbl.supabase.co/rest/v1/" -H "apikey: dummy"
# → 401か403 = OK（エンドポイント生きている）

# GitHub Secrets 設定状況（参照しているSecret名の一覧）
grep -h "secrets\." /home/user/kaisha01/.github/workflows/*.yml | grep -oP "secrets\.\w+" | sort -u
# → VERCEL_TOKEN / RESEND_API_KEY / ANTHROPIC_API_KEY が出なければ未設定

# GA4 実装確認
grep "NEXT_PUBLIC_GA_ID" /home/user/kaisha01/tanq-app/src/app/layout.tsx
# → 1行でも出ればOK
```

---

## ⚠️ Vercel 自動デプロイ問題（2026-05-16 根本原因判明・未解決）

**根本原因**: VercelのGitHub Appがこのリポジトリに**未接続**。
- GitHub commitのstatusが0件 = Vercelはpushを検知していない
- デスクトップ版では `vercel --prod` をローカルCLIで直接実行していたため動いていた
- クラウド環境ではVercel CLIの認証情報もGitHub連携もないため自動デプロイが機能しない

**恒久解決策（オーナー操作が必要・2ステップのみ）**:
1. Vercel → kaisha01プロジェクト → Settings → Git → **GitHubリポジトリを連携**
2. GitHub Secrets に以下を追加（Settings → Secrets → Actions）:
   - `VERCEL_TOKEN`（Vercel → Settings → Tokens で生成）
   - `RESEND_API_KEY`（X投稿メール用・未設定）
   - `ANTHROPIC_API_KEY`（X投稿文案生成用・未設定）

**上記完了後、Jobs がやること**: GitHub Actionsに `vercel --prod --token=$VERCEL_TOKEN` を追加 → 永続解決

**今すぐ使える回避策**: デスクトップ版Claude Codeでセッションを開く（Vercel CLIが使える）

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
