# 作業ログ: TANQ Inc. コーポレートサイト実装

| 項目 | 内容 |
|------|------|
| **日付** | 2026-05-04 |
| **担当** | Jobs (AI CEO) |
| **ブランチ** | `claude/create-company-website-8iSxs` |
| **コミット** | `bac4e94` → main `728e9d4`（auto-merge済み） |
| **ステータス** | ✅ 本番デプロイ完了 |

---

## オーナーの依頼

> 「会社のホームページ作ってよ。ゴージャスでおしゃれな感じに。アプリ紹介・登録画面・問い合わせフォームも。所在地は福岡市。近未来と自然が融合したデザインで。」

---

## 実施したこと

### 1. コーポレートサイト全体設計・実装

**デザインコンセプト**: 近未来 × 自然（バイオルミネッセント・フォレスト）

| ページ | URL | 内容 |
|-------|-----|------|
| トップページ | `/` | ヒーロー・ミッション・アプリ紹介・探究ループ・バリュー・会社概要 |
| 登録ページ | `/register` | アカウント作成フォーム（学年・モード選択） |
| お問い合わせ | `/contact` | お問い合わせフォーム（会社情報パネル付き） |

**デザインシステム**:
- カラーパレット: 深紺 `#050b14` + バイオルミネッセントティール `#00e5c3` + ラベンダー `#c4a8ff`
- 18個の浮遊パーティクル（純CSS、上昇アニメーション）
- グラスモーフィズムカード（backdrop-blur + 半透明ボーダー）
- グラデーションテキスト（ティール→ラベンダー）
- スクロール連動スティッキーナビゲーション（ガラス変化）
- テックグリッドオーバーレイ

**新規作成ファイル**:
- `tanq-app/src/app/page.tsx` — コーポレートホームページ（既存のリダイレクトを置き換え）
- `tanq-app/src/app/register/page.tsx` — 登録ページ
- `tanq-app/src/app/contact/page.tsx` — お問い合わせページ
- `tanq-app/src/components/Navbar.tsx` — 共通ナビゲーション
- `tanq-app/src/components/Footer.tsx` — 共通フッター

**更新ファイル**:
- `tanq-app/src/app/globals.css` — コーポレートスタイル追加（既存アプリスタイル維持）
- `tanq-app/src/app/layout.tsx` — Google Fonts (Inter + Noto Sans JP) 追加
- `tanq-app/tailwind.config.ts` — コーポレートカラーパレット・アニメーション追加

### 2. 既存アプリとの共存確認

- `/tanq` の子供向けアプリはそのまま動作（独自の `bg-tanquu-light` を保持）
- コーポレートサイトは `/` に配置、アプリは `/tanq` に分離

### 3. デプロイ確認

- `claude/create-company-website-8iSxs` をプッシュ
- auto-merge ワークフローが自動発火 → main にマージ完了
- Vercel が自動デプロイ実行

### 4. PR #4 クローズ

- PR #4 (`claude/improve-jobs-story-fwodX`) が古いブランチのまま残存
- 同ブランチの変更は PR #3 で既にマージ済みのため、クローズ処理

### 5. 作業ログフォルダ・ルール整備

- `logs/` フォルダ新設
- `logs/README.md` に運用ルール記載
- `CLAUDE.md` を更新（ログルール追加・ファイルマップ更新・現状反映）

---

## 判断の背景

**なぜ `/` にコーポレートサイトを置いたか**:
既存の `page.tsx` は `/tanq` へのリダイレクトのみで実質空だった。コーポレートサイトを `/` に置き、アプリを `/tanq` に維持することで、「会社サイトで興味を持ったユーザーがアプリを体験する」自然な導線が生まれる。

**なぜ純CSSパーティクルにしたか**:
Next.js の SSR と相性が良く、`'use client'` なしで動作するため。hydration エラーが発生しない。

---

## 本番URL

| 用途 | URL |
|-----|-----|
| コーポレートトップ | https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/ |
| アプリ（子供向け） | https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/tanq |
| 登録ページ | https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/register |
| お問い合わせ | https://kaisha01-git-main-mtk-ctrls-projects.vercel.app/contact |

---

## 次のアクション

1. **オーナーにデザイン確認依頼** — 近未来×自然の方向性フィードバック
2. フィードバックを反映してデザイン調整
3. 独自ドメイン取得検討（例: `tanq.jp`）
4. 登録・問い合わせフォームのバックエンド接続（現在はUIのみ）
