# TANQ App — セットアップガイド

## 1. TANQuu 画像を配置する（必須・最初にやること）

Gemini で生成した 5枚の PNG を以下のファイル名で保存:

```
tanq-app/public/tanquu/
├── happy.png        ← ハッピー！
├── angry.png        ← おこ！
├── sad.png          ← えーん…
├── mischievous.png  ← いたずら♪
└── surprised.png    ← びっくり！（目が丸いやつ）
```

## 2. ローカルで動かす

```bash
cd tanq-app
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。  
スマホで確認したい場合は http://[PCのIPアドレス]:3000 でOK。

## 3. Vercel にデプロイする（無料）

1. https://vercel.com でアカウント作成（GitHub連携）
2. 「New Project」→ このリポジトリを選択
3. **Root Directory を `tanq-app` に設定する（重要）**
4. Deploy ボタンを押す → URLが発行される

環境変数は不要（このバージョンはAPI不使用）。

## 4. 動作確認チェックリスト

- [ ] TANQuu が表示される
- [ ] メッセージが順番に表示される
- [ ] 選択肢ボタンが押せる
- [ ] 選択後にリアクションが出る
- [ ] 最後に「ひみつゲット！」画面が出る
- [ ] スマホで崩れない

## ファイル構成

```
src/
├── app/
│   ├── layout.tsx       レイアウト
│   ├── page.tsx         /tanq にリダイレクト
│   └── tanq/page.tsx    ★ メインゲーム画面
├── data/
│   └── unit1.ts         ★ 会話スクリプト（ここを編集してセリフ調整）
└── app/globals.css      アニメーション定義
```

## セリフを変えたい場合

`src/data/unit1.ts` の `messages` や `label` を編集するだけでOK。  
コードの知識は不要。日本語テキストを書き換えるだけ。
