# プロダクト一覧

> 最終更新: 2026-05-26 | 更新者: Jobs  
> 変更頻度: 中（アプリ追加・更新のたびに更新）

---

## URL

| ページ | URL |
|--------|-----|
| コーポレート TOP | https://tanq-app.vercel.app/ |
| TANQ Story | …/tanq |
| アプリラボ（PW or ログイン制） | …/lab |
| 料金ページ | …/pricing |
| ログイン | …/login |
| 新規登録 | …/register |
| テスター入口 | …/tester（PIN: 2026） |
| お問い合わせ | …/contact |

---

## アプリ一覧（全26本）

### 📘 小学生向け（内製・学年別カリキュラム）

| アプリ名 | パス | 問題数・規模 | ゲストアクセス |
|---------|------|-------------|--------------|
| TANQ 理科 | /tanq | Season 1（Unit 1〜5） | ❌（member/tester のみ） |
| 中学受験 算数① | /apps/juku | 12単元・図解 | ✅ |
| 理科クイズ | /apps/science | 4領域（生物・地学・化学・物理） | ❌ |
| 国語クイズ | /apps/kokugo | 140問・20レベル・⭐評価・バッジ5種 | ❌ |
| 慣用句クイズ | /apps/kanyo | 140問・20レベル・⭐評価・バッジ5種 | ❌ |
| 四字熟語クイズ | /apps/yoji | 140問・20レベル・⭐評価・バッジ5種 | ❌ |
| 計算チャレンジ | /apps/math | ランダム（無限）・難易度3段階 | ✅ |
| 漢字マスター | /apps/kanji | 944字（小1〜6）・SRS | ✅ |
| 時計・時間計算 | /apps/clock | ランダム（無限）・読む/差/足す | ❌ |
| 英語ボキャブラリー | /apps/english | 120語・8カテゴリ・SRS | ❌ |
| かんがえる力ジム | /apps/thinking | 100問・25バッジ・10レベル | ✅ |
| 算数文章題 | /apps/word-math | 小1〜小3・SRS | ✅ |
| 図形トレーニング | /apps/shapes | 8図形・SVGアニメーション | ❌ |
| プログラミング | /apps/coding | 5ステージ | ❌ |
| ぞくせい仕分け工場 | /youji/apps/zokusei/ | ベン図・分類（静的HTML） | ✅ |
| 九九マスター | /youji/apps/kuku/ | 2〜9の段（静的HTML） | ✅ |
| 都道府県マスター | /apps/todofuken | 47都道府県・4モード・難易度3段階 | ✅ |

### 🌱 就学前向け（静的HTML・ひらがな・絵・音声）

| アプリ名 | パス | 特徴 | ゲストアクセス |
|---------|------|------|--------------|
| ようちえん かんがえるジム | /apps/thinking-youji | 50問・10バッジ | ✅ |
| カタカナ れんしゅう | /youji/apps/katakana/ | ア〜ン 46字 | ✅ |
| いろと かたち | /youji/apps/iro-katachi/ | 10色・8かたち | ✅ |
| はじめての かんじ | /youji/apps/kanji/ | にちじょうご80字 | ✅ |
| たべものと かずあそび | /youji/apps/math/ | 20まで | ✅ |
| 10に なる かず | /youji/apps/juucombo/ | たして10 | ✅ |
| にたもじ どっち？ | /youji/apps/no5/ | おう/づ/ぢ識別 | ✅ |
| なんじ かな？ | /youji/apps/clock/ | 何時・何時半 | ✅ |
| どうぶつ さんすう | /youji/apps/animals/ | たし引き20まで | ✅ |

> 静的HTMLアプリ（/youji/apps/配下）はlocalStorage進捗・記録タブ連携は未実装（将来タスク）

---

## データファイル

| ファイル | 内容 |
|---------|------|
| `src/data/kanjiData.ts` | 漢字データ（grade1〜6 統合、944字） |
| `src/data/kanji/grade{1-6}.ts` | 学年別漢字データ |
| `src/data/englishData.ts` | 英語 120語 |
| `src/data/wordMathData.ts` | 算数文章題データ（小1〜3） |
| `src/data/scienceData.ts` | 理科クイズデータ（4領域） |
| `src/data/kokugoData.ts` | 国語クイズデータ（140問・20レベル） |
| `src/data/kanyoData.ts` | 慣用句データ（140問・20レベル） |
| `src/data/yojiData.ts` | 四字熟語データ（140問・20レベル） |
| `src/data/unit{1-5}.ts` | TANQ Story スクリプト |

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 14（App Router） |
| 言語 | TypeScript |
| スタイル | Tailwind CSS |
| 認証・DB | Supabase（`@supabase/ssr` + Cookie セッション） |
| ホスティング | Vercel（`trailingSlash: true`） |
| リポジトリ | github.com/mtk-ctrl/kaisha01 |
| CI/CD | GitHub Actions → merge-to-main → migration → Vercel deploy |
