# 自動マージ設定ガイド（オーナー向け・1回だけ）

Jobs が `claude/*` ブランチにプッシュすると自動で main にマージ → Vercel が即時デプロイされます。
**オーナーの作業はゼロ**になります。

---

## 必要なGitHub設定（1回だけ）

### ステップ1: Actions の書き込み権限を設定

1. GitHub → `mtk-ctrl/kaisha01` リポジトリ
2. **Settings → Actions → General**
3. `Workflow permissions` → **Read and write permissions** を選択
4. `Allow GitHub Actions to create and approve pull requests` → チェック ✓
5. **Save**

### ステップ2: main ブランチ保護ルールを確認

1. **Settings → Branches**
2. `main` にブランチ保護ルールがある場合 → **Edit**
3. `Require a pull request before merging` → **オフ**
   （または「Allow specified actors to bypass」に GitHub Actions を追加）

> ルールが存在しない場合はステップ2は不要です。

---

## 設定後の動作フロー

```
Jobs がコードを書く
     ↓
claude/xxx ブランチにプッシュ（自動）
     ↓ 約30秒
GitHub Actions が main にマージ（自動）
     ↓ 約1〜2分
Vercel が本番環境にデプロイ（自動）
     ↓
公開URLに即時反映
```

オーナーの操作：**ゼロ**
