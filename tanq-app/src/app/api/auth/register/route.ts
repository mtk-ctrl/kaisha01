import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, childName, grade, mode } = await req.json()

  if (!email || !password || !childName) {
    return NextResponse.json({ error: 'メールアドレス・パスワード・お子さんのお名前は必須です' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // auth ユーザー作成
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: childName, grade, mode },
  })

  if (authError) {
    const msg = /already registered|already exists|already been registered/i.test(authError.message)
      ? 'このメールアドレスは既に登録されています'
      : authError.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const userId = authData.user!.id

  // profiles テーブルへ保存（失敗しても auth 作成は成功とする）
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userId, email, child_name: childName, grade, mode, lab_unlocked: true })

  if (profileError) {
    // orphan 防止: profiles 失敗したら auth ユーザーも削除してやり直せるようにする
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({
      error: `プロフィール保存に失敗しました。Supabase の SQL Editor で supabase-schema.sql を実行してください。（詳細: ${profileError.message}）`,
    }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId })
}
