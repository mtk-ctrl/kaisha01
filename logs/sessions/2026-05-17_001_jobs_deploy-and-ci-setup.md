# 2026-05-17 | Jobs | 本番デプロイ・CI自動化構築

## 状況
スマホセッション（claude/company-analysis-consulting-mlKeC）でサービスと連携できない問題が発生。
PCのClaude Codeでセッション継続。GitHub mainブランチには音声機能が反映済みだったがVercelにデプロイされていなかった。

## 確認内容
- GitHub main: 最新（feat(audio): 音声読み上げ＋正誤サウンド追加）まで反映済み
- Vercel: 最終デプロイ3日前（スマホセッション変更が未反映）
- Vercel CLI: mtk-ctrl でログイン済み
- GitHub Actions: auto-merge のみ。Vercelデプロイステップなし

## 実施内容

### 1. 即時デプロイ（手動）
```
cd tanq-app && vercel --prod
```
- デプロイURL: https://tanq-app.vercel.app
- プロジェクトID: prj_ZyQ7idSXjxL9sK5QtcdiYuoZZrCn
- OrgID: team_pHV8kt9g3wxGNxcX4zJ14aIP
- ステータス: READY（音声機能・全アプリ正常ビルド）

### 2. GitHub Actions CI自動化
`.github/workflows/auto-merge.yml` に `deploy-to-vercel` ジョブを追加。
- merge-to-main 完了後に自動実行
- `vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --yes`
- working-directory: tanq-app

## 残タスク（オーナーへの依頼）
GitHub Secrets に `VERCEL_TOKEN` を登録するだけで完全自動化完成。
URL: https://github.com/mtk-ctrl/kaisha01/settings/secrets/actions

## スタッフへの指示

### リン（QA）へ
音声機能が https://tanq-app.vercel.app にデプロイされました。以下をチェックしてください：
- TANQ Story の🔊ボタンが動作するか
- 正解・不正解のサウンドが鳴るか
- 漢字・算数アプリのサウンドが鳴るか
- 小4目線で「うるさい」「消したい」と思わないか

### ゆい（小1 QA）へ
音声読み上げ機能で漢字のふりがな読み上げが正しくできているか確認してください。

### ハナ（マーケ）へ
「音声読み上げ対応！」を X 投稿の素材として使えます。次の文案に入れてください。
