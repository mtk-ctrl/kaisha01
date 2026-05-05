# 作業ログ: アプリ2本追加・マネタイズ戦略策定・ホームページ改善

## オーナーへの報告

| 項目 | 内容 |
|------|------|
| **完了** | ホームページ明るい配色・アプリラボ充実・計算チャレンジ・漢字クイズ・料金ページ・マネタイズ戦略 |
| **新アプリURL** | `/apps/math`（計算チャレンジ）・`/apps/kanji`（漢字クイズ） |
| **料金ページ** | `/pricing` |
| **次のアクション** | 登録バックエンド接続・Marketing AI「Hana」採用 |

---

## 実施内容

### 1. ホームページ明るい配色

- aurora グラデーション明るく（ネイビー強め → 少し青みある深め）
- glass-card 透明度アップ（0.03 → 0.06）・glass-card-bright（0.06 → 0.10）
- ボタンホバーグロー強化
- ヒーローセクションの glow blob を全体的に大きく・濃く
- `#0a1628` セクション → `#091c35`（わずかに明るいネイビー）

### 2. アプリラボ改善

- ボタンを `py-3.5 rounded-full text-base` → `py-5 rounded-2xl text-lg font-black` に大型化
- ホバー時グロー効果追加（内部リンクボタンにも）
- APPS に 計算チャレンジ・漢字クイズを追加（4アプリに拡充）
- グリッドを `sm:grid-cols-2` に変更（4枚対応）

### 3. 計算チャレンジ (`/apps/math`)

- 難易度3段階（かんたん60秒・ふつう45秒・むずかしい30秒）
- 四則演算（難易度で出る演算子が変わる）
- カウントダウンタイマーバー・残り10秒で赤色警告
- 正解/ミスフィードバック（0.3秒後に次問）
- 結果画面にランク表示（天才！〜次は頑張ろう）

### 4. 漢字クイズ (`/apps/kanji`)

- 小1〜小6 各15問ストック、毎回10問ランダム出題
- 4択（他の読み方からランダム3つ）
- 正解=緑・不正解=赤でビジュアルフィードバック（0.9秒後に次問）
- 進捗バーで残り問数可視化
- 結果画面にランク表示

### 5. 料金ページ (`/pricing`)

- 無料 / TANQ Plus ¥980/月 / TANQ Family ¥1,480/月 の3プラン
- B2Bスクールライセンスセクション付き
- Navbar・Footer に「料金」リンク追加

### 6. マネタイズ戦略

詳細: `executive/ceo/decisions/2026-05-05_001_monetization-strategy.md`

フリーミアム × B2B ハイブリッドモデルを決定。
- Phase 1: 無料ユーザー 1,000人（90日）
- Phase 2: 有料転換 5%（MRR ¥49,000）
- Phase 3: スクールライセンスで B2B 拡大

---

## 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `tanq-app/src/app/globals.css` | 色・グロー強化 |
| `tanq-app/src/app/page.tsx` | ヒーロー glow 強化・セクション bg |
| `tanq-app/src/app/lab/page.tsx` | APPS 配列拡充・ボタン大型化 |
| `tanq-app/src/app/apps/math/page.tsx` | 新規作成 |
| `tanq-app/src/app/apps/kanji/page.tsx` | 新規作成 |
| `tanq-app/src/app/pricing/page.tsx` | 新規作成 |
| `tanq-app/src/components/Navbar.tsx` | 料金リンク追加 |
| `tanq-app/src/components/Footer.tsx` | 料金リンク追加 |
| `executive/ceo/decisions/2026-05-05_001_monetization-strategy.md` | 新規作成 |
