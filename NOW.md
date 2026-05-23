# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **ログ**: コミットメッセージ ＋ 下記「直近の完了タスク」テーブル1行（`logs/sessions/` は使わない）  
> **最終更新**: 2026-05-23 | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中 | `claude/*` push → main マージ → Vercel デプロイ（`main` 直 push のみではデプロイジョブ未実行） |
| Vercel | ✅ 本番稼働 | tanq-app.vercel.app / `trailingSlash: true`・youji各HTMLに `<base href>` 済（2026-05-23） |
| Supabase | ✅ 接続済み | プロジェクトID: `jdrhnxqvmohzikmfqzbl` |
| GA4 | ✅ 計測中 | 測定ID: G-TK27G02856 |
| Resend | ⚠️ 登録済み（要動作確認） | X投稿メール用・Secret登録済み |
| Gemini API | ❌ 未設定 | X投稿文案生成用・無料・GEMINI_API_KEY をGitHub Secretsに登録 |

**各サービスの確認コマンド・詳細設定 → `product/infra.md` を参照**

---

## ② 情報マップ（どこに何があるか）

| 知りたいこと | 場所 |
|------------|------|
| CEOの役割・行動ルール | `CLAUDE.md` |
| 現在地・次アクション・サービス状態 | `NOW.md`（このファイル） |
| サービス確認コマンド・環境変数詳細 | `product/infra.md` |
| 全アプリ一覧・URLとデータファイル | `product/apps.md` |
| 訪問者ルート・アクセス制御・ユーザー種別 | `product/routes.md` |
| 料金プラン・収益戦略 | `company/monetization.md` |
| ターゲットユーザー詳細 | `company/users.md` |
| スタッフ定義（リン・Ken等） | `agents/` フォルダ |
| 作業ログ（タスクごと） | **git コミットメッセージ** ＋ NOW.md「直近の完了タスク」 |
| 重要判断記録 | `logs/decisions/YYYY-MM-DD_topic.md` |
| オーナー向けダッシュボード | `OWNER.md` |
| アプリコード | `tanq-app/src/` |
| 幼稚園ミニアプリ（静的） | `tanq-app/public/youji/apps/` |
| DBマイグレーション | `tanq-app/supabase/migrations/` |

---

## ③ 現在のフェーズと次アクション TOP3

**フェーズ**: Phase 1 — プロダクト完成 + 初期ユーザー獲得（家族テスト中）

**今すぐやること（優先順）**:
1. **幼稚園アプリの家族テスト** — カタカナ・かずあそび等を `/tester` から実機確認
2. **都道府県アプリ・ようちえんかんがえるジム 本番確認** — `/youji/apps/todofuken/`・`/apps/thinking-youji` を実機確認
3. **テスター招待** — `/tester` のURLと PIN「2026」をシェア

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
| 2026-05-23 | reset-password/confirm シール風リデザイン・リダイレクト先 /login 修正・訪問者ルート整理（⑤パスワード忘れ対応） | `0fba561` |
| 2026-05-23 | コーポレートサイト全面リデザイン（ダーク→シール風ファンタジー）・loginページ新規作成 | `73b95c6` `e795b06` `567793a` |
| 2026-05-23 | CLAUDE.md ガバナンス整理（ルール6本化・軽微/中規模・デプロイ確認）と NOW.md 同期 | （本コミット） |
| 2026-05-23 | 幼稚園ミニアプリ表示崩れ修正（`<base href>`・trailingSlash・ラボ幼稚園おすすめ）・youji-clockビルド修正 | `82422bd` `1a5eca9` |
| 2026-05-23 | 都道府県アプリ全面修正（バグ7件・GeoJSON刷新・Playwright画面レビュー導入） | コミット履歴参照 |
| 2026-05-23 | ようちえん かんがえるジム 新規実装（50問・10Lv・10バッジ） | `logs/sessions/2026-05-23_002_*`（旧） |
| 2026-05-23 | かんがえる力ジム UX改善（つぎへボタン・ふりがな追加） | `logs/sessions/2026-05-23_001_*`（旧） |
| 2026-05-22 | かんがえる力ジム QA第2弾・思考力アプリ関連 | sessions（旧） |

※ 2026-05-23 より新規タスクはコミットSHAを「ログ」列に記載。`logs/sessions/` は新規作成しない。

---

## ⑥ 現在の作業ブランチ

`main`（本番反映は `claude/*` ブランチ push → GitHub Actions 経由）

**テスター入口URL**: `https://tanq-app.vercel.app/tester` | PIN: `2026`
