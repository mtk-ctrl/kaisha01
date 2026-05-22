# 2026-05-22_003 — かんがえる力ジム QA第2弾 + ゲスト解放 + カード名変更

**担当**: Jobs（yuu・テツ・リン・Ken・Sarah・アキのレビュー反映）
**日時**: 2026-05-22
**ブランチ**: `claude/thinking-training-app-2M1Vj`

---

## バグ修正3件

### 修正1: 進捗ドットが review フェーズ中も青のまま（リン指摘）
- `phase === 'review' && i === current` の場合も `answered` フラグを立て、正解なら緑・不正解なら赤を表示

### 修正2: バッジ説明文が3カラム内で読めない（Sarah指摘）
- `text-xs` → `text-[10px]` + `line-clamp-2` で2行以内に制限、カード高さを均一化

### 修正3: 5/5全問正解時に特別メッセージなし（テツ指摘）
- `score >= QUESTIONS_PER_LEVEL` のとき「🎊パーフェクト！5問全部正解！すごい！！」バナーを追加

---

## ゲストLv1-2解放

- `lab/page.tsx` canAccessApp: 'thinking' をゲスト解放リストに追加
- `lab/page.tsx` ゲストバナー・PasswordGate説明文を更新（思考力→かんがえる力ジムを含む）
- `lab/page.tsx` ゲスト推薦アプリ: mathカード → thinkingカード（Lv1・Lv2が体験できます）に変更
- `thinking/page.tsx`: getUserType() を追加。ゲストはLv3+を🔐ロック表示し /register リンク
- `thinking/[level]/page.tsx`: getUserType() でゲスト判定、level > 2 なら /register へリダイレクト

---

## アプリカード・タイトル変更

チーム議論（テツ・リン・Ken・Sarah・アキ）の結果:
- 名前: 「思考力トレーニング」→「かんがえる力ジム」
  - 理由: リン（小4）「なぞときとかジムって楽しそう」 / Ken「問題内容と合致」 / Sarah「保護者も刺さる」
- emoji: 🧠 → 🧩（パズル感・ゲーム感UP）
- badge: '25バッジ・20Lv' → '100問 / 25バッジ'（問題数の訴求力UP）
- thinking/page.tsx ヘッダーも「🧩 かんがえる力ジム」に更新
