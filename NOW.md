# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **ログ**: コミットメッセージ ＋ ⑤に直近のみ1行（全履歴は `logs/CHANGELOG.md` 記録庫＝必要なときだけ読む）。`logs/sessions/` は廃止・削除済み  
> **最終更新**: 2026-07-11（**コンテンツ拡張の優先順位をオーナー承認**＝現状分析（強み5・弱み7）から 優先1: 国語読解の本格化 → 優先2: 既存単元の演習量3層化 と決定。全文は `logs/decisions/2026-07-11_content-expansion-priority.md`。今回は仕様議論のみ・実装は次セッションから③の順で着手） | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中 | `claude/*` push → env var 自動同期 → migration（SQL変更時のみ）→ Vercel デプロイ。詳細は `product/infra.md` |
| Vercel | ✅ 本番稼働 | tanq-app.vercel.app / 環境変数は GitHub Secrets から CI が自動同期（2026-05-27〜） |
| Supabase | ✅ 接続済み | プロジェクトID: `jdrhnxqvmohzikmfqzbl` / 環境変数は Vercel に反映済み / テーブル: profiles・scores・feedback・**tester_data**（テスター学習データ）・**tester_scores**（テスター スコア履歴）2026-06-15追加 |
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
| 幼稚園・就学前ミニアプリ（React版） | `tanq-app/src/app/apps/youji-*` |
| 完了タスクの全履歴（記録庫） | `logs/CHANGELOG.md`（必要なときだけ読む） |
| DBマイグレーション | `tanq-app/supabase/migrations/` |

---

## ③ 現在のフェーズと次アクション TOP3

**フェーズ**: Phase 1 — プロダクト完成（中受カリキュラム ライン生産中）
**プロダクト構想**: 二層構造（🎓中学受験×🌱ジュニア）/ 到達目標「**このサービスだけで中受偏差値60**」— `logs/decisions/2026-06-11_chuju-vision.md` 参照
**方式**: 教科＝単元マップ。各単元「まなぶ（図解導入）→とく（演習・2段階ヒント）」。全単元で確立パターン（1回目不正解=答えを見せず足場ヒント→再挑戦→2回目で答え+因果解説／スコアは初回解答のみ／求める量は解答前「?」で答えバレ防止／全問ふりがな／Ken が全問検証）。

### ✅ ライン生産で完成した中受コンテンツ（2026-06-13〜14・すべて本番反映済み）
- **算数**（/apps/juku）: 特殊算9単元 ＋ 速さ系3単元（旅人算12・流水算12・仕事算/ニュートン算12）＋ **数の性質12・規則性12・平面図形13・場合の数12（2026-06-14 ライン生産⑮）** ＝全16単元・5層（第5層＝図形と場合の数）。別に分数・公倍数
- **理科**（/juken 理科＝単元マップ）: 知識25単元（既存260問を割当）＋ **計算分野6単元 完成**＝てこ(rika-teko)・ばね(rika-bane)・電気回路(rika-circuit)・水溶液と中和(rika-chukan)・浮力(rika-buoy)・ふりこ(rika-furiko)
- **社会**: 地理(/apps/chiri・12レベル128問＝地形気候+農業水産)・**歴史(/apps/rekishi・通史完成 旧石器〜現代 21レベル251問)**・都道府県(既存)
- **国語**: 漢字1026字・ことば/慣用句/四字熟語 ＋ 読解(/apps/dokkai・ステップ1〜3・AI生成オリジナル46問・「ためしてみる版」) ＋ **文法・敬語(/apps/bunpo・6レベル48問＝敬語の種類/言いかえ/品詞/文の組み立て/こそあど・接続語/きまり・2026-06-14 ライン生産⑯)**。KOKUGO_SOONの近日公開はゼロに

### 🔜 次にやること（優先順・新セッションはここから）— 2026-07-11 オーナー承認の優先順位（`logs/decisions/2026-07-11_content-expansion-priority.md`）
1. **国語読解の本格化（優先1・次セッションの第一候補）** — /apps/dokkai にステップ4＝長文（800〜1200字・物語/説明 各数本×設問3〜4問）を新設。AI生成オリジナル文（転載禁止は既決）・紛らわしい選択肢3類型（問いに合わない/言い過ぎ/本文にない）・根拠文ハイライト継承。**細切れ原則＝1本仕上げ→画面確認→オーナー判定→次へ**。記述＋AI採点は今回スコープ外（後続）
2. **既存単元の演習量3層化（優先2）** — 主要単元から順に基本→練習→応用で20〜25問/単元へ。対象選定はテツ＋Ken起案→Jobs＋アキ承認。全問 `product/hint-design.md` 準拠・Ken検証。国語系3本の「正解=最長」バイアスは触った単元のついでに解消
3. **算数 立体図形・ダイヤグラム（優先3）** — diagramType 新設の要否判断を先に行ってから着手
4. **理科知識21単元への「まなぶ」追加（優先4）** → **社会 地理続き＝工業・貿易・地形図（優先5）**
5. **次点（コンテンツ拡張の区切りで再上申）**: Phase D＝AIつまずき診断（missions.ts `generateMissions()` 置換）・親向け週次AIレポート／家族テスト＝日課ループ＋読解感想3択（localStorage `tanq_dokkai_feedback_v1`）の回収

### ⚠️ ライン生産の運用メモ（新セッションで踏襲すること）
- 既存テンプレを複製: 計算系=rika-furiko、社会4択系=chiri、通史拡張=rekishi。**前セッションが「META だけ先行設定し問題本体ゼロ」の半完成を残す事故が頻発**したので、着手前に既存データの空レベル有無を必ず確認
- 画面レビュー: `ss -ltnp` で port3000 のPIDをkill ＋ `pkill -9 -f next-server`（`pkill -f "next start"` は next-server に素通りする）→ `nohup npm run start -- -p 3000 >/tmp/next.log 2>&1 & disown` を**単独コマンド**で（複数行ブロックだとSIGHUPで死ぬ）。起動後 curl で 200＆新内容を確認してから Playwright
- push は claude/app-review-improvements-cx7pcg → GitHub Actions が main マージ＆Vercelデプロイ。`git config user.email noreply@anthropic.com`

**📋 記録タブ 将来タスク（スコープ外）**:
- ~~静的HTMLアプリのlocalStorage連携~~ **完了**（youji系・九九・都道府県等は React `/apps/youji-*` へ移行済み＝記録タブ統合済み）
- 国語の選択肢「正解＝最長」バイアス（kokugo/kanyo/yoji 約9割）の是正・国語クイズ3本の統廃合検討
- ~~コイン/相棒/ミッションのサーバ同期~~ **完了（2026-06-15）**＝SYNC_KEYSに追加し member/tester とも同期。tester のスコア履歴も `tester_scores` テーブルで同期（member/tester で保存方法を統一完了）

---

## ④ オーナー対応待ち（物理的にJobsができないもの）

| 項目 | 内容 |
|------|------|
| RESEND_API_KEY | resend.com → 無料登録 → API Keys → GitHub Secrets登録 |
| ANTHROPIC_API_KEY | Claude Code使用中のキー → GitHub Secrets登録 |
| テスター招待 | /tester のURLと PIN「2026」を対象者にシェア |

---

## ⑤ 直近の完了タスク（直近8件・全履歴は `logs/CHANGELOG.md`）

> ログの一次情報はコミットメッセージ。ここは直近の流れを把握するための要約のみ。
> **8件より前は `logs/CHANGELOG.md`（記録庫・必要なときだけ読む）** を参照。

| 日付 | 内容 |
|------|------|
| 2026-07-11 | コンテンツ拡張の優先順位を決定（オーナー承認・仕様議論のみ）：現状分析＝強み5（4教科骨格完成・品質パターン文書化・継続基盤・二層構造・インフラ）×弱み7（演習量薄い・読解プロト止まり・たしかめ未実装ほか）→ 優先1 国語読解の本格化・優先2 演習量3層化。全文 `logs/decisions/2026-07-11_content-expansion-priority.md` |
| 2026-06-15 | テスターのスコア履歴もクラウド保存（member/tester で保存方法を統一・`tester_scores` 新設） |
| 2026-06-15 | データ同期漏れ解消＋テスターもクラウド保存（`SYNC_KEYS`拡張・`learningMerge`・`tester_data` 新設） |
| 2026-06-14 | ライン生産⑯ 国語〈文法・敬語〉公開（/apps/bunpo・6レベル48問） |
| 2026-06-14 | ライン生産⑮ 算数〈数の性質・規則性・平面図形・場合の数〉公開（/apps/juku・全16単元） |
| 2026-06-14 | 算数ヒント全面改訂（答えバレ一掃＋WHY埋め込み） |
| 2026-06-14 | ライン生産⑭ 社会〈公民〉公開（/apps/koumin・70問） |

---

## ⑥ 現在の作業ブランチ

`main`（本番反映は `claude/*` ブランチ push → GitHub Actions 経由）

**テスター入口URL**: `https://tanq-app.vercel.app/tester` | PIN: `2026`

---

## ⑦ デプロイパイプライン（詳細は `product/infra.md` を参照）

### 現在の動作フロー（2026-05-27 整備完了）

```
Jobs が claude/* ブランチに push
  └→ GitHub Actions: merge-to-main（main へマージ）
       ↓ 成功・失敗どちらでも（if: always()）
  └→ GitHub Actions: deploy-to-vercel
       ① DB migration（SQL 変更時のみ自動実行）
       ② Vercel 環境変数を GitHub Secrets から自動同期
       ③ vercel --prod（本番デプロイ）
       ④ HTTP 200 確認
       ↓ 約3〜4分
  └→ tanq-app.vercel.app に反映 ✅
```

### 開発ルール

| やること | やらないこと |
|---------|------------|
| `claude/*` ブランチに push → Actions 経由でデプロイ | `main` に直接 push |
| push 前に `npm run build` を通す | ビルドエラーのまま push |
| Secret 変更は GitHub Secrets だけ更新 | Vercel Dashboard を直接触る |
