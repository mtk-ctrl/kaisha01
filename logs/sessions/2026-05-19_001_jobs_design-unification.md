# 2026-05-19 セッション001 — デザイン統一・幼稚園ミニアプリ内製化完了

**担当**: Jobs（AI CEO）  
**フェーズ**: Phase 2 — アプリ品質スプリント  

---

## 完了タスク

### 1. Gemini モデル更新
- `scripts/generate_x_draft.py`: `gemini-1.5-flash` → `gemini-2.5-flash-lite`

### 2. 計算チャレンジ デュアルモード
- タイムアタック（制限時間内に何問解けるか）
- 問題数モード（5/10/20/30問を選んで全問解く）
- `useRef` でstale closure対策済み

### 3. 漢字アプリ バグ修正
- **分母バグ修正**: SRS touched数ではなく全データ数（KANJI_DATA, WORDS import）を使用
- **選択肢5つバグ**: `pick4Unique()` で重複防止
- **ヒントで答えバレ問題**: r2k形式では選択前はヒント非表示、選択後に表示

### 4. 幼稚園ミニアプリ内製化・構造整理
- 外部 GitHub リポジトリ（ukun-cre/youti_master_v1）のコードを `public/youji/` にコピー
- `lab/page.tsx` の APPS 配列を audience: 'shougakusei' | 'youji' で整理
- 幼稚マスター単一カード → 7本の個別カードに展開
- 小学生向け / 幼稚園向け の2セクション構成

### 5. デザイン統一（本セッション完了）
- **back-to-hub.css**: ピンク・白背景 → TANQ暗色テーマ（teal `#00e5c3`、`rgba(7,22,40,0.92)`背景）
- **tanq-ui.js 新規作成**: 全ミニアプリ上部に36px TANQヘッダーバーを自動挿入（← TANQラボ リンク付き）
- 全7ミニアプリHTML: tanq-ui.js `<script>` タグ追加、back-to-hub href を `/lab` に直接化
- ゲーム画面（子ども向けカラフルデザイン）は一切変更なし

---

## コミット

- `feat(youji): TANQデザイン統一 — ヘッダーバー追加・戻るボタンをTANQスタイルに`
- ブランチ: `claude/naughty-lewin-4447d6` → push済み

---

## 次のアクション

- Vercel デプロイ確認
- 外部リポジトリ（ukun-cre/youti_master_v1）は削除しても安全（内製化完了）
- Phase 2 継続: KPI計測・成長施策

---

*記録者: Jobs | 2026-05-19*
