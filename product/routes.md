# 訪問者ルートマップ

> 最終更新: 2026-05-26 | 更新者: Jobs

TANQ Inc. サービスを訪れるユーザーの種別・通り道・権限を一元管理するドキュメント。
新機能追加・アクセス制御変更時は必ずこのファイルを更新する。

---

## 訪問者 5 種と通り道

### ① 登録済みユーザー（Supabase 認証済みの保護者）

```
/login
  → メール＋パスワード入力
  → ブラウザ側で supabase.auth.signInWithPassword()（@supabase/ssr が Cookie にセッション保存）
  → localStorage: tanq-lab-auth = 'member'
  → /lab（全アプリ、ただし tanq アプリは除外）
```

**lab での権限**: `tanq` 以外のすべてのアプリにアクセス可

> ※ `/api/auth/login` は残っているが未使用（ブラウザ直接認証に切り替え済み）

---

### ② 新規登録ユーザー

```
/ (トップ) → 「はじめる」ボタン → /register
  → 保護者名・メールアドレス・パスワード入力
  → /api/auth/register（admin.createUser でユーザー作成 + profiles 保存）
  → 登録成功後すぐ supabase.auth.signInWithPassword() でセッション Cookie を発行
  → localStorage: tanq-lab-auth = 'member'
  → サンクスページ表示（/register 内）→ /lab
```

**lab での権限**: ① と同じ（member）

---

### ③ お試し体験ユーザー（ゲスト）

```
/lab?trial=1  （または /login の「とりあえず体験する」カード）
  → URL パラメータ trial=1 を検出
  → localStorage: tanq-lab-auth = 'guest'
  → /lab（guestAccess: true のアプリのみ）
```

**lab での権限**: APPS 配列の `guestAccess: true` フラグで管理。現在の解放アプリ:
- `juku`（中学受験算数①）/ `math`（計算チャレンジ）/ `kanji`（漢字マスター）
- `thinking`（かんがえる力ジム）/ `word-math`（算数文章題）/ `kuku`（九九マスター）
- `todofuken`（都道府県マスター）/ `youji-zokusei` / `youji-katakana` / `youji-iro`
- `youji-kanji` / `youji-math` / `youji-juucombo` / `youji-hiragana` / `youji-clock`
- `youji-animals` / `thinking-youji`（ようちえんかんがえるジム）

**ゲスト不可**（member/tester のみ）:
- `science`・`kokugo`・`kanyo`・`yoji`・`english`・`clock`・`shapes`・`coding`・`tanq`

---

### ④ テスター（招待コード所持者）

```
/tester
  → お名前＋テスターコード（PIN: 2026）入力
  → localStorage: tanq-lab-auth = 'tester'・tanq-tester-name = 入力名
  → /lab（制限なし・全アプリ）
```

**lab での権限**: すべてのアプリに無制限アクセス（Supabase セッション不要）

---

### ⑤ パスワードを忘れたユーザー（既存の登録者）

```
/login → 「パスワードを わすれた方」リンク → /reset-password
  → メールアドレス入力
  → supabase.auth.resetPasswordForEmail（redirectTo: /reset-password/confirm）
  → メール受信 → リンククリック
  → /reset-password/confirm?code=XXXXXX
  → exchangeCodeForSession（code を Supabase セッションに変換）
  → 新パスワード入力 → supabase.auth.updateUser
  → 3秒後 /login へリダイレクト → ① のルートへ
```

**権限**: ログイン成功後は ① と同じ（member）

---

## ログアウト

```
Navbar の「ログアウト」ボタン（ログイン済みのみ表示）
  → member: supabase.auth.signOut()（Cookie セッション削除）+ localStorage 削除 → /
  → tester: localStorage 削除のみ → /
```

---

## セッション管理

| 仕組み | 説明 |
|--------|------|
| Cookie セッション | `@supabase/ssr` が自動管理。`src/middleware.ts` が全リクエストでリフレッシュ |
| localStorage フラグ | `tanq-lab-auth` で UserType を判定（guest/tester/member） |
| セッション期限切れ検出 | `/lab` 起動時に `getSession()` を呼び、セッションなければ localStorage クリア → PasswordGate へ |

---

## アクセス制御ロジック（lab/page.tsx）

```typescript
type UserType = 'guest' | 'tester' | 'member'

function canAccessApp(appId: string, userType: UserType): boolean {
  if (userType === 'tester') return true
  if (userType === 'member') return appId !== 'tanq'
  // guest: APPS 配列の guestAccess フラグで一元管理
  return APPS.find(a => a.id === appId)?.guestAccess ?? false
}
```

> guestAccess フラグの一覧は `src/app/lab/page.tsx` の APPS 配列が唯一の正ソース。

---

## localStorage セッションキー

| キー | 値 | 対応ユーザー |
|-----|-----|------------|
| `tanq-lab-auth` | `'member'` | ①②⑤ |
| `tanq-lab-auth` | `'tester'` | ④ |
| `tanq-lab-auth` | `'guest'` | ③ |
| `tanq-tester-name` | 入力した名前 | ④ のみ |

---

## 各ルートの実装ファイル

| ルート | ファイル |
|-------|---------|
| `/login` | `src/app/login/page.tsx` |
| `/register` | `src/app/register/page.tsx` |
| `/tester` | `src/app/tester/page.tsx` |
| `/lab` | `src/app/lab/page.tsx` |
| `/reset-password` | `src/app/reset-password/page.tsx` |
| `/reset-password/confirm` | `src/app/reset-password/confirm/page.tsx` |
| `/api/auth/register` | `src/app/api/auth/register/route.ts` |
| `/api/scores` | `src/app/api/scores/route.ts`（Cookie 認証） |
| `src/middleware.ts` | セッション Cookie の自動リフレッシュ |
| `src/lib/supabase/client.ts` | ブラウザ用 Supabase クライアント |
| `src/lib/supabase/server.ts` | サーバー用 Supabase クライアント |
