# 自動マージ設定ガイド（オーナー向け）

Jobs が `claude/*` ブランチにプッシュすると自動で main にマージ → Vercel が即時デプロイされます。
**オーナーの作業はゼロ**になります。

---

## 必要なGitHub設定（1回だけ）

### ステップ1: main ブランチ保護ルールを確認・緩和

1. GitHub → `mtk-ctrl/kaisha01` リポジトリ
2. **Settings → Branches**
3. `main` のブランチ保護ルールがある場合 → **Edit**
4. 以下を確認：
   - `Require a pull request before merging` → **オフ** にする（最も簡単）
   - または `Allow specified actors to bypass required pull requests` に **GitHub Actions** を追加

> ルールが存在しない場合はステップ1は不要です。

### ステップ2: Actions の書き込み権限を確認

1. **Settings → Actions → General**
2. `Workflow permissions` → **Read and write permissions** を選択
3. `Allow GitHub Actions to create and approve pull requests` → チェック ✓
4. **Save**

---

## 設定後の動作フロー

```
Jobs がコードを書く
     ↓
claude/xxx ブランチにプッシュ
     ↓ （自動・約30秒）
GitHub Actions が main にマージ
     ↓ （自動・約1〜2分）
Vercel が本番環境にデプロイ
     ↓
公開URLに即時反映
```

オーナーの操作：**ゼロ**

---

## 現在の状態

- workflow ファイル: `.github/workflows/auto-merge.yml` ✅ 作成済み
- GitHub Actions 権限設定: **オーナーが上記ステップ2を実施する必要あり**
- ブランチ保護: **確認してください（ステップ1）**

設定完了後、次回 Jobs がプッシュした時点から自動化が始まります。
