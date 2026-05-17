# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **最終更新**: 2026-05-18 | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中 | `claude/*` → main 自動マージ |
| Vercel | ✅ CI自動デプロイ完成 | https://tanq-app.vercel.app / VERCEL_TOKEN登録済・GitHub Actions自動化動作確認済み |
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
1. **LPから理科アプリの過度な露出を削除** — アキ指摘: 理科bias除去（体験版は計算・漢字が主役）
2. **テスター招待フローの確認** — `/tester` ページのURLを招待する人にシェアする
3. **ゆい（小1）UXレビュー** — 時計・漢字アプリを低学年目線でチェック

---

## ④ オーナー対応待ち（物理的にJobsができないもの）

| 項目 | 内容 |
|------|------|
| RESEND_API_KEY | resend.com → 無料登録 → API Keys → GitHub Secrets登録 |
| ANTHROPIC_API_KEY | Claude Code使用中のキー → GitHub Secrets登録 |
| テスター招待 | /tester のURLと PIN「2026」を対象者にシェア |

---

## ⑤ 直近の完了タスク（参考）

| 日付 | 内容 | ログ |
|------|------|------|
| 2026-05-18 | 3階層アクセス制御実装（guest/tester/member）、/tester新設、ガバナンス改革 | `logs/sessions/2026-05-18_001_jobs_3tier-access-governance.md` |
| 2026-05-16 | ゲスト体験ボタン実装・ボタン文言統一・ナビゲーション修正 | `logs/sessions/2026-05-16_001_jobs_trial-button-and-ui-fix.md` |
| 2026-05-14 | Supabase接続・GA4・プライバシーポリシー・料金2本化 | `logs/sessions/2026-05-14_001_*.md` |

---

## ⑥ 現在の作業ブランチ

`claude/naughty-lewin-4447d6` → GitHub Actions で main に自動マージ → Vercel自動デプロイ

**テスター入口URL**: `https://tanq-app.vercel.app/tester` | PIN: `2026`
