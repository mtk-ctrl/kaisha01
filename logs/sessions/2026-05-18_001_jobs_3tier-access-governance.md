# 2026-05-18 | セッション001 | Jobs | 3階層アクセス制御 & ガバナンス改革

## 概要
- 3階層ユーザーアクセス制御の設計・社内レビュー・実装
- ガバナンス改革：アキ（副社長）・ヨシコ（保護者UXレビュアー）を体制に追加
- CLAUDE.md に絶対ルールE・F（一発実装禁止）を追記

## 担当スタッフ
- アキ（副社長/CPO）：事業・設計レビュー → 修正してGO
- ヨシコ（保護者UXレビュアー）：親目線UXレビュー → 要修正コメント付きGO
- リン（小4 QA）：子ども目線 → たのしさ:ふつう（修正ありでOK）
- Jobs：実装

## 実装内容

### ガバナンス
- `agents/aki.md` 新設：副社長/CPO。実装前に必ずGO/NO-GO判定
- `agents/yoshiko.md` 新設：38歳保護者UXレビュアー。親目線チェック
- `CLAUDE.md` 絶対ルールE・F追加：「Jobs単独一発実装禁止」「社内レビュー必須」
- スタッフ表にアキ・ヨシコを追記

### 3階層アクセス制御
| UserType | 入口 | アクセス範囲 |
|----------|------|------------|
| guest | ボタン1クリック / ?trial=1 | 計算(かんたん・ふつう) + 漢字(小1・小2) |
| tester | /tester + PIN 2026 | 全アプリ（理科含む） |
| member | パスワード(tanq2026) | 全アプリ（理科は近日公開） |

### 変更ファイル
- `CLAUDE.md`: 絶対ルールE・F追加、スタッフ表更新
- `tanq-app/src/app/lab/page.tsx`: sessionStorage→localStorage、userType型管理、AppsTab/HomeTab ロック表示
- `tanq-app/src/app/tester/page.tsx`: 新設（テスター入口）
- `tanq-app/src/app/apps/kanji/page.tsx`: 小3以上ゲストロック
- `tanq-app/src/app/apps/math/page.tsx`: むずかしいゲストロック  
- `tanq-app/src/app/tanq/page.tsx`: href="/" → href="/lab" 修正

## アキレビュー判定
**修正してGO** — localStorage採用・/tester専用URL・ロック理由テキスト追加を条件に承認

## ヨシコレビュー判定  
**要修正（修正後GO）** — ロック理由文言・体験範囲の明示を条件に承認

## リンレビュー判定
**たのしさ: ふつう** — ロック説明が子ども言葉でないと怖いとのコメント

## デプロイ
- ブランチ: `claude/naughty-lewin-4447d6`
- push: 2026-05-18
- GitHub Actions → main自動マージ → Vercel自動デプロイ待ち

## 次アクション
- CIデプロイ完了後、本番確認
- LP から理科アプリの過度な露出を削除（アキ指摘：理科biasの除去）
- NOW.md 更新（完了・次フェーズ記録）
