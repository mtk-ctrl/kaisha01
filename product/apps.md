# プロダクト一覧

> 変更頻度: 中（アプリ追加・更新のたびに更新）

---

## URL

| ページ | URL |
|--------|-----|
| コーポレート TOP | https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/ |
| TANQ Story | …/tanq |
| アプリハブ（PW制） | …/lab |
| 料金ページ | …/pricing |
| 登録 | …/register |
| お問い合わせ | …/contact |

**アプリハブのパスワード**: CLAUDE.md には記載しない。オーナーに口頭確認。

---

## アプリ一覧

| アプリ | パス | 問題数 | 特徴 |
|--------|------|--------|------|
| TANQ Story | /tanq | Unit 1〜5 | 理科ストーリー形式・SRS |
| 計算チャレンジ | /apps/math | ランダム（無限） | 難易度3段階・タイムアタック |
| 漢字クイズ | /apps/kanji | **944字**（小1-6） | SRS・学年別・2問形式 |
| 時計チャレンジ | /apps/clock | ランダム（無限） | 読む・差・足す の3タイプ |
| 英語クイズ | /apps/english | **120語**（8カテゴリ） | SRS・例文つき |
| 図形クイズ | /apps/shapes | **17形 × 3タイプ** | SVGアニメーション |
| コーディング思考 | /apps/coding | **20問**（4難易度） | グリッドナビ・コマンド並べ |

---

## データファイル

| ファイル | 内容 |
|---------|------|
| `src/data/kanjiData.ts` | 漢字データ（kanji/grade1〜6.tsを統合） |
| `src/data/kanji/grade{1-6}.ts` | 学年別漢字データ（分割管理） |
| `src/data/englishData.ts` | 英語120語 |
| `src/data/unit{1-5}.ts` | TANQ Story スクリプト |

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイル | Tailwind CSS |
| バックエンド | Supabase（登録・ログイン・スコア保存） |
| ホスティング | Vercel |
| リポジトリ | github.com/mtk-ctrl/kaisha01 |
