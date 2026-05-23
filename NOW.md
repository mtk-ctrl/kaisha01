# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **最終更新**: 2026-05-23 (Session 4) | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中・動作確認済 | `claude/*` → main 自動マージ → Vercel デプロイまで success確認（2026-05-18） |
| Vercel | ✅ CI自動デプロイ完成 | tanq-app.vercel.app / VERCEL_TOKEN Secret登録済・スマホからの指示だけで本番反映可能 |
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
1. **ようちえん かんがえるジム 本番確認** — Vercelデプロイ後：`/apps/thinking-youji` でゲスト体験（Lv1-2）、問題文・選択肢・フィードバック表示確認
2. **テスター招待フローの確認** — `/tester` ページのURLを招待する人にシェアする
3. **図形SRS実装** — 英語と同様のSRSパターンを移植（次スプリント）

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
| 2026-05-23 | ようちえん かんがえるジム 新規実装（50問・10Lv・10バッジ・4択・ひらがなのみ） | `logs/sessions/2026-05-23_002_yuu_youji-thinking-gym.md` |
| 2026-05-23 | かんがえる力ジム UX改善（つぎへボタン位置修正・ふりがな追加 Q5/Q14/Q22） | `logs/sessions/2026-05-23_001_yuu_thinking-button-furigana.md` |
| 2026-05-22 | かんがえる力ジム QA第2弾（ドット修正・パーフェクト画面・バッジ文字・ゲストLv1-2解放・カード名変更） | `logs/sessions/2026-05-22_003_jobs_thinking-qa2-guest-access.md` |
| 2026-05-22 | 思考力トレーニングアプリQAバグ修正（花火useMemo・BadgeToast useRef・ネコ削除・Q97型修正・バッジ説明追加・レビュールールCLAUDE.md追記） | `logs/sessions/2026-05-22_002_jobs_thinking-qa-bugfix.md` |
| 2026-05-22 | 思考力トレーニングアプリ新規実装（小4向け・100問・25タイプ・20Lv・25バッジ） | `logs/sessions/2026-05-22_001_tetsu_thinking-training-app.md` |
| 2026-05-18 | テツ初仕事: 算数文章題アプリ新規実装（小1〜小3・60問・SRS・4択） | `logs/sessions/2026-05-18_003_tetsu_word-math-app.md` |
| 2026-05-18 | アプリ品質スプリント: 英語120→275語、コーディング進捗保存 | `logs/sessions/2026-05-18_002_jobs_app-quality-sprint.md` |
| 2026-05-18 | 3階層アクセス制御実装（guest/tester/member）、/tester新設、ガバナンス改革 | `logs/sessions/2026-05-18_001_jobs_3tier-access-governance.md` |
| 2026-05-16 | ゲスト体験ボタン実装・ボタン文言統一・ナビゲーション修正 | `logs/sessions/2026-05-16_001_jobs_trial-button-and-ui-fix.md` |
| 2026-05-14 | Supabase接続・GA4・プライバシーポリシー・料金2本化 | `logs/sessions/2026-05-14_001_*.md` |

---

## ⑥ 現在の作業ブランチ

`claude/kindergarten-thinking-gym-Gpthq` → GitHub Actions で main に自動マージ → Vercel自動デプロイ

**テスター入口URL**: `https://tanq-app.vercel.app/tester` | PIN: `2026`
