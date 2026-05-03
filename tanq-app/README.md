# TANQ App

TANQuu と一緒に科学のひみつを発見する学習アプリ（小4向け・スマホ対応）

---

## デプロイ（ワンクリック）

下のボタンを押すと Vercel に自動デプロイされます。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmtk-ctrl%2Fkaisha01&root=tanq-app)

ボタンを押す → GitHub でログイン → Deploy → URL が発行される。以上。  
以後は `git push` するたびに自動で更新される。

---

## ローカルで動かす

```bash
cd tanq-app
npm install
npm run dev
# → http://localhost:3000
```

---

## ファイル構成

```
src/
├── app/tanq/page.tsx   ★ メインゲーム画面
├── data/unit1.ts       ★ 会話スクリプト
└── app/globals.css     アニメーション定義

public/tanquu/
├── happy.png           TANQuu ハッピー表情
├── angry.png           TANQuu おこ表情
├── sad.png             TANQuu えーん表情
├── mischievous.png     TANQuu いたずら表情
└── surprised.png       TANQuu びっくり表情
```

## セリフを変えるだけなら

`src/data/unit1.ts` の `messages` や `label` を編集。コード知識不要。
