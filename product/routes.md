# 訪問者ルートマップ

> 最終更新: 2026-05-23 | 更新者: Jobs

TANQ Inc. サービスを訪れるユーザーの種別・通り道・権限を一元管理するドキュメント。
新機能追加・アクセス制御変更時は必ずこのファイルを更新する。

---

## 訪問者 5 種と通り道

### ① 登録済みユーザー（Supabase 認証済みの保護者）

```
/login
  → メール＋パスワード入力
  → /api/auth/login（signInWithPassword）
  → localStorage: tanq-lab-auth = 'member'
  → /lab（全アプリ、ただし tanq アプリは除外）
```

**lab での権限**: `tanq` 以外のすべてのアプリにアクセス可

---

### ② 新規登録ユーザー

```
/ (トップ) → 「はじめる」ボタン → /register
  → 保護者名・メールアドレス・パスワード入力
  → /api/auth/register（signUp）
  → localStorage: tanq-lab-auth = 'member'
  → サンクスページ表示（/register 内）
  → /lab（全アプリ、ただし tanq アプリは除外）
```

**lab での権限**: ① と同じ（member）

---

### ③ お試し体験ユーザー（ゲスト）

```
/lab?trial=1  （または /login の「とりあえず体験する」カード）
  → URL パラメータ trial=1 を検出
  → localStorage: tanq-lab-auth = 'guest'
  → /lab（制限付きアプリのみ）
```

**lab での権限**: 以下のアプリのみ
- math / kanji / word-math / kuku / todofuken / thinking / thinking-youji / youji-* 系

---

### ④ テスター（招待コード所持者）

```
/tester
  → お名前＋テスターコード（PIN: 2026）入力
  → localStorage: tanq-lab-auth = 'tester'
  → /lab（制限なし・全アプリ）
```

**lab での権限**: すべてのアプリに無制限アクセス（member より広い）

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
  → 3秒後 /login へリダイレクト
  → /login から ① のルートへ
```

**権限**: ログイン成功後は ① と同じ（member）

---

## アクセス制御ロジック（lab/page.tsx）

```typescript
type UserType = 'guest' | 'tester' | 'member'

function canAccessApp(appId: string, userType: UserType): boolean {
  if (userType === 'tester') return true                          // ④ 全開放
  if (userType === 'member') return appId !== 'tanq'             // ①② tanq以外
  // guest: 体験用アプリのみ                                       // ③
  return ['math','kanji','word-math','kuku','todofuken',
          'thinking','thinking-youji'].includes(appId)
         || appId.startsWith('youji-')
}
```

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
| `/api/auth/login` | `src/app/api/auth/login/route.ts` |
| `/api/auth/register` | `src/app/api/auth/register/route.ts` |
