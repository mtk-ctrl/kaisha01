# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **最終更新**: 2026-05-17 | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中 | `claude/*` → main 自動マージ |
| Vercel | ✅ 手動デプロイ済 / CI準備完了 | https://tanq-app.vercel.app（音声機能反映済）。CI自動化はVERCEL_TOKEN Secret登録で完成 |
| Supabase | ✅ 接続済み | プロジェクトID: `jdrhnxqvmohzikmfqzbl` |
| GA4 | ✅ 計測中 | 測定ID: G-TK27G02856 |
| Resend | ❌ 未設定 | X投稿メール用（Secret未登録） |
| Anthropic API | ❌ 未設定 | X投稿文案生成用（Secret未登録） |

**各サービスの確認コマンド・詳細設定 → `product/infra.md` を参照**

---

## ② 情報マップ（どこに何があるか）

| 知りたいこと | 場所 |
|------------|------|
| CEOの役割・行動ルール | `CLAUDE.md` |
| 現在地・次アクション・サービス状態 | `NOW.md`（このファイル） |
| サービス確認コマンド・環境変数詳細 | `product/infra.md` |
| 全アプリ一覧・URLとデータファイル | `product/apps.md` |
| 料金プラン・収益戦略 | `company/monetization.md` |
| ターゲットユーザー詳細 | `company/users.md` |
| スタッフ定義（リン・Ken等） | `agents/` フォルダ |
| 作業ログ（タスク完了後即書く） | `logs/sessions/YYYY-MM-DD_NNN_担当者_内容.md` |
| 重要判断記録 | `logs/decisions/YYYY-MM-DD_topic.md` |
| オーナー向けダッシュボード | `OWNER.md` |
| アプリコード | `tanq-app/src/` |
| DBマイグレーション | `tanq-app/supabase/migrations/` |

---

## ③ 現在のフェーズと次アクション TOP3

**フェーズ**: Phase 1 — プロダクト完成 + 初期ユーザー獲得

**今すぐやること（優先順）**:
1. **リアルユーザー（小学生）へのテスト提供** — 招待フロー・メール文案を整備
2. **ゆい（小1）UXレビュー** — 時計・漢字アプリを低学年目線でチェック
3. **ソラにGA4分析依頼** — 現時点のアクセス・離脱ポイントを把握

---

## ④ オーナー対応待ち（物理的にJobsができないもの）

### CI自動デプロイの完成（1ステップのみ残り）

GitHub Actions に Vercel デプロイジョブ追加済み。あと1つのSecret登録で完全自動化。

**GitHub Secrets に追加** → https://github.com/mtk-ctrl/kaisha01/settings/secrets/actions

| Secret名 | 取得方法 | 優先度 |
|---------|---------|------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens で生成 | 🔴 最優先（CI自動化） |
| `RESEND_API_KEY` | resend.com → 無料登録 → API Keys | 🟡 X文案メール用 |
| `ANTHROPIC_API_KEY` | Claude Code で使用中のキー | 🟡 X文案生成用 |

**登録後**: 次回スマホからの変更も自動でVercelにデプロイされる

---

## ⑤ 直近の完了タスク（参考）

| 日付 | 内容 | ログ |
|------|------|------|
| 2026-05-17 | 音声機能を本番デプロイ・GitHub Actions CI自動化追加 | `logs/sessions/2026-05-17_001_jobs_deploy-and-ci-setup.md` |
| 2026-05-16 | 音声読み上げ＋正誤サウンド追加（スマホセッション） | `logs/sessions/2026-05-16_001_jobs_trial-button-and-ui-fix.md` |
| 2026-05-16 | ゲスト体験ボタン実装（[TRIAL]タグ付き・削除可能） | 同上 |
| 2026-05-16 | TANQ Story UIバグ修正（余白・hook-emoji・ナビゲーション） | 同上 |
| 2026-05-16 | リン QAチェックリスト強化（観点7・8追加） | 同上 |
| 2026-05-16 | CLAUDE.md・NOW.md 再設計（エフェメラルセッション対応） | 同上 |
| 2026-05-14 | Supabase接続・GA4・プライバシーポリシー・料金2本化 | `logs/sessions/2026-05-14_001_*.md` |

---

## ⑥ 現在の作業ブランチ

`claude/naughty-lewin-4447d6` → GitHub Actions で main に自動マージ → Vercel 自動デプロイ（VERCEL_TOKEN登録後）
