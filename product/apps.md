# プロダクト一覧

> 最終更新: 2026-06-11 | 更新者: Jobs  
> 変更頻度: 中（アプリ追加・更新のたびに更新）

---

## 二層構造（2026-06-11 構造改革・承認済み構想）

```
🏠 TANQ
├─ 🎓 TANQ 中学受験（有料の主戦場・小4〜小6）… ハブ = /juken
│    算数・国語・理科・社会の4教科を単元別に攻略。未実装単元は「近日公開」と正直に表示。
└─ 🌱 TANQ ジュニア（無料の入口・年中〜小3）… /lab 内「小学生」「就学前」サブセクション
     既存アプリ = 遊びで先取り。進捗は中受側に引き継ぐ。
```

- **呼称ルール**: 「クイズ」は全廃。中受側は「教科＋単元」で呼ぶ（例: 中学受験 理科）。ナンバリング（①等）はカードに出さない。
- 国語の語彙3本（語彙/慣用句/四字熟語）は「国語〈ことば〉」群として /juken からまとめて導線。

## URL

| ページ | URL |
|--------|-----|
| コーポレート TOP | https://tanq-app.vercel.app/ |
| **中学受験ハブ（4教科・単元一覧＋進捗）** | **…/juken** |
| TANQ Story | …/tanq |
| アプリラボ（PW or ログイン制） | …/lab |
| 料金ページ | …/pricing |
| ログイン | …/login |
| 新規登録 | …/register |
| テスター入口 | …/tester（PIN: 2026） |
| お問い合わせ | …/contact |

---

## アプリ一覧

### 🎓 中学受験（ハブ: /juken）

| アプリ名 | パス | 問題数・規模 | ゲストアクセス |
|---------|------|-------------|--------------|
| 中学受験 算数 | /apps/juku | 特殊算（公開中単元は動的算出）・図解 | ✅（第1層のみ） |
| 中学受験 理科 | /apps/science | 4領域（生物・地学・化学・物理） | ❌ |
| 中学受験 歴史〈旧石器〜平安〉 | /apps/rekishi | 76問・6レベル（時代別5＋ごちゃまぜ1）・年代ならべかえ9問・⭐評価・バッジ4種 | ❌ |
| 国語〈ことば〉（語彙） | /apps/kokugo | 140問・20レベル・⭐評価・バッジ5種 | ❌ |
| 慣用句 | /apps/kanyo | 140問・20レベル・⭐評価・バッジ5種 | ❌ |
| 四字熟語 | /apps/yoji | 140問・20レベル・⭐評価・バッジ5種 | ❌ |

> 社会は 都道府県マスター（/apps/todofuken）＋ 歴史〈旧石器〜平安〉（/apps/rekishi）を /juken の社会枠から導線。歴史〈鎌倉〜現代〉・公民、理科計算分野、国語読解は「近日公開」枠で表示。歴史アプリ内のタイムラインで鎌倉以降の全体像を「近日公開」として提示。

### 📘 小学生向け（TANQ ジュニア・学年別カリキュラム）

| アプリ名 | パス | 問題数・規模 | ゲストアクセス |
|---------|------|-------------|--------------|
| TANQ 理科 | /tanq | Season 1（Unit 1〜5） | ❌（member/tester のみ） |
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
| `src/data/scienceData.ts` | 中学受験 理科 問題データ（4領域） |
| `src/data/kokugoData.ts` | 国語〈ことば〉問題データ（140問・20レベル） |
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
