# NOW — 現在地（新セッション開始時は CLAUDE.md の次に必読）

> **更新ルール**: インフラ変更時・タスク完了直後に即更新。セッション終了を待たない。  
> **ログ**: コミットメッセージ ＋ 下記「直近の完了タスク」テーブル1行（`logs/sessions/` は使わない）  
> **最終更新**: 2026-05-26 | 更新者: Jobs

---

## ① サービス状態（一覧）

| サービス | 状態 | 備考 |
|---------|------|------|
| GitHub Actions | ✅ 稼働中 | `claude/*` push → Vercel デプロイ（main マージは失敗することがあるが deploy は独立して動く）詳細は下記⑦参照 |
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
2. **テスター招待** — `/tester` のURLと PIN「2026」をシェア
3. **中学受験算数①の続き** — Unit5以降（旅人算・ニュートン算等）実装

**📋 記録タブ 将来タスク（今回スコープ外）**:
- 静的HTMLアプリ（九九・都道府県・カタカナ等）のlocalStorage連携 → records tab への統合
- バッジ獲得瞬間のポップアップ演出（アプリ内で初取得時に「バッジゲット！」表示）
- 保護者向け詳細レポート画面（「先週から漢字10字増えた」等の時系列表示）— Phase 2

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
| 2026-05-26 | Supabase migration 手動実行完了（profiles.role・feedback.user_id カラム追加）| オーナー実行済み |
| 2026-05-26 | Supabase SSR抜本修正（@supabase/ssr・middleware・Cookie認証・scores API 401解消・登録後自動ログイン） | `258fa8c` |
| 2026-05-26 | 優先度中リファクタ（storageKeys・stats分離・useStats hook・parseStorage・SRSItem型統一） | `6e4f1e8` |
| 2026-05-26 | 高優先度バグ3件修正：kanyo/yoji getDataKey追加・canAccessApp APPS一元管理・auto-merge -X theirs廃止 | `8afb381` |
| 2026-05-26 | 中学受験セクション カード統一（算数①を他3枚と同じグリッドカードに。横長専用カード廃止）| `ce4332a` |
| 2026-05-26 | GitHub Actions インフラ修正：deploy-to-vercel を needs+if:always() で逐次実行化・並列checkout 403解消 | `56c365d` |
| 2026-05-26 | 慣用句・四字熟語クイズ新規実装（各140問・20レベル・⭐評価・バッジ5種）+ labページ統合 | `f6ed316` |
| 2026-05-26 | 鶴亀算（Unit4）実装：AreaDiagram＋10問＋仮定法introSlide | `305de42` |
| 2026-05-24 | 国語クイズ新規実装（140問・20レベル・慣用句＋四字熟語・⭐評価・バッジ5種）+ labページ統合 | `69a8d9d` |
| 2026-05-24 | 和差算 線分図をヒント連動の段階表示に刷新（Stage0〜3でSVGが変化） | `a18f8c9` |
| 2026-05-24 | 和差算 線分図を2セクション方式に刷新（①差を確認＋②和を確認の2段）・sd-08空カードバグ修正 | `a147aa7` |
| 2026-05-24 | 和差算（第3単元）：10問・線分図SVG・図の読み方スライド・年齢算専用レイアウト | `d4f2d94` |
| 2026-05-24 | 中学受験算数①UX改善：ヒント段階表示・選択式入力・木emoji・とばすボタン | `f4665b6` |
| 2026-05-24 | 中学受験算数①Phase1：単位変換・植木算（各15問）+ 単元メニュー + ラボ3分割セクション追加 | `96e3428` |
| 2026-05-24 | めいぶつクイズ 解説UX改善（問題カードからnote削除・回答後に記憶定着パネル追加・フォールバック文自動生成） | `4bdbf59` |
| 2026-05-24 | 都道府県マスター チームレビュー4項目実装（重複出題防止・ふりがな・間違い一覧・note制限） | `da27357` |
| 2026-05-24 | 都道府県クイズ 自動遷移廃止→次へボタン化・県庁所在地に「市」表記・東京除外 | `c7da7a4` |
| 2026-05-24 | 県庁所在地クイズ UX改善（ふりがな追加・視覚フィードバックバナー・ヒントバッジ削除）+ capitalDiffers 10県分データ修正 | `b63e289` |
| 2026-05-24 | 全都道府県データをチームレビューで強化（+64件）農業・産業・歴史・環境問題など。計465件に | `52e9510` |
| 2026-05-24 | 都道府県データに難易度2・3の地理・産業知識を28アイテム追加（15都道府県：石狩平野・筑後川など） | `dd9e2b1` |
| 2026-05-23 | 都道府県マスター Next.js全面リニューアル（国土地理院SVG・4モード・難易度3段階） | `8b31018` |
| 2026-05-23 | 記録タブ全面刷新 + 全アプリのベストスコア・バッジ保存 | `098eb3e` |
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

---

## ⑦ デプロイパイプライン（現状と運用）

### 現在の動作フロー

```
Jobs が claude/* ブランチに push
  └→ GitHub Actions: merge-to-main ジョブ（main へ fast-forward merge を試みる）
       ↓ 成功・失敗どちらでも（if: always()）
  └→ GitHub Actions: deploy-to-vercel ジョブ（main の最新を Vercel へ本番デプロイ）
       ↓ 約2〜3分
  └→ tanq-app.vercel.app に反映 ✅
```

### merge-to-main について

- **現状**: `GITHUB_TOKEN` の権限で main への push が失敗することがある
- **影響なし**: `deploy-to-vercel` は `if: always()` で独立実行するためデプロイには影響しない
- **根本解決策（未実施）**: リポジトリ Settings → Actions → General → Workflow permissions を「Read and write permissions」に変更するか、PAT（Personal Access Token）を `GH_PAT` Secretとして登録してワークフローのtokenを差し替える

### 今後の開発ルール

| やること | やらないこと |
|---------|------------|
| 必ず `claude/*` ブランチに push して Actions 経由でデプロイ | `main` に直接 push（deploy-to-vercel が動かない） |
| 複数セッション同時作業は避ける（コンフリクト原因） | 複数 Claude Code セッションで同じファイルを並行編集 |
| push 前に `npm run build` を通す | ビルドエラーのまま push |
| PRは不要（Actions が自動マージ） | オーナーが手動でマージ（その場合 Actions が動かない） |
