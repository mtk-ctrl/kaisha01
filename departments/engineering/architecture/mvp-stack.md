# TANQ MVP — システムアーキテクチャ

*作成: Jobs | 2026-05-03*

---

## アーキテクチャ概要

```
┌─────────────────────────────────────────┐
│           ユーザーブラウザ（スマホ）        │
│  ┌──────────────┐  ┌─────────────────┐  │
│  │ 子ども画面    │  │ 親ダッシュボード  │  │
│  │ /tanq        │  │ /parent         │  │
│  └──────┬───────┘  └────────┬────────┘  │
└─────────┼──────────────────┼────────────┘
          │                  │
┌─────────▼──────────────────▼────────────┐
│         Next.js App（Vercel）            │
│  ┌─────────────────────────────────┐    │
│  │ App Router                       │    │
│  │ ├── /tanq         子ども用UI     │    │
│  │ ├── /parent       親ダッシュ     │    │
│  │ └── /api                         │    │
│  │     ├── /chat     会話API        │    │
│  │     └── /progress 進捗API        │    │
│  └─────────────────────────────────┘    │
└───────────┬──────────────────┬──────────┘
            │                  │
┌───────────▼──────┐  ┌────────▼─────────┐
│   Claude API      │  │    Supabase       │
│  (Anthropic)      │  │                   │
│                   │  │  Tables:          │
│  claude-haiku-4-5 │  │  - sessions       │
│  TANQuu 会話      │  │  - progress       │
│  エンジン         │  │  - collections    │
└───────────────────┘  └───────────────────┘
```

---

## 主要コンポーネント

### 1. 子ども用チャット画面 (`/tanq`)

```
┌──────────────────────────────┐
│ [TANQuu 表情画像]             │  ← 状態に応じて5種切り替え
│                              │
│ ふきだし: テキスト             │  ← ストリーミング表示
│                              │
│ [選択肢 A]                   │  ← タップで次へ
│ [選択肢 B]                   │
│ [選択肢 C]                   │
└──────────────────────────────┘
```

**実装:**
- TANQuu 画像: `<Image>` コンポーネント + 表情名で切り替え
- チャットバブル: Tailwind CSS でLINE風スタイル
- 選択ボタン: 大きめ (`py-4 px-6`) でタップしやすく

### 2. 会話状態管理

```typescript
type ConversationState = {
  sessionId: string
  unitId: string          // e.g. "s1u1" = Season1 Unit1
  stage: 1 | 2 | 3       // 探究ループのステージ
  stepIndex: number       // 現在のステップ
  tanquuEmotion: 'happy' | 'angry' | 'sad' | 'mischievous' | 'surprised'
  collectedSecrets: string[]
}
```

### 3. Claude API 呼び出し設計

```typescript
// 固定スクリプト部分は API を呼ばない（コスト削減）
// 子どもの選択への反応だけ Claude に生成させる

const FIXED_SCRIPTS = {
  's1u1_hook': 'ねえ！うんちって水に浮くか知ってる？...',
  's1u1_explore_1': '密度っていう言葉、聞いたことある？...',
  // ...
}

// Claude が生成するのは子どもの選択への「反応コメント」のみ
// → コストを最小化 + 品質を安定化
```

### 4. Supabase スキーマ

```sql
-- セッション管理
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT NOT NULL,  -- MVPはメール不要、コードのみ
  unit_id TEXT NOT NULL,
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 秘密コレクション
CREATE TABLE secret_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT NOT NULL,
  secret_id TEXT NOT NULL,    -- e.g. "s1u1_density"
  collected_at TIMESTAMP DEFAULT NOW()
);

-- 親ダッシュボード用サマリー（View）
CREATE VIEW parent_summary AS
  SELECT
    access_code,
    COUNT(DISTINCT unit_id) as units_completed,
    SUM(duration_seconds) as total_seconds,
    COUNT(*) as session_count
  FROM sessions
  WHERE completed_at IS NOT NULL
  GROUP BY access_code;
```

---

## 開発環境セットアップ

```bash
# 1. Next.js プロジェクト作成
npx create-next-app@latest tanq-app \
  --typescript --tailwind --app --src-dir

# 2. 必要パッケージ
npm install @anthropic-ai/sdk @supabase/supabase-js

# 3. 環境変数 (.env.local)
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
PARENT_PIN=0000  # 親ダッシュボードの PIN
```

---

## コスト試算（月次）

| 項目 | 無料枠 | 超過時 |
|------|-------|-------|
| Vercel | 無料（個人プラン） | $20/月〜 |
| Supabase | 無料（500MB・5万リクエスト） | $25/月〜 |
| Claude API | なし | 約 ¥0.25/セッション（haiku） |

**100ユーザー × 月12セッションの場合:**  
Claude API コスト = 約 ¥300/月  
**合計: ほぼ ¥0（MVPフェーズ）**

---

*最終更新: 2026-05-03 | Jobs (AI CEO / 暫定CTO)*
