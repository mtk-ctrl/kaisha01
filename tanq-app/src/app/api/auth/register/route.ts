import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, childName, grade, mode } = await req.json()

  if (!email || !password || !childName) {
    return NextResponse.json({ error: 'メールアドレス・パスワード・お子さんのお名前は必須です' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: childName, grade, mode },
  })

  if (authError) {
    const msg = authError.message.includes('already registered')
      ? 'このメールアドレスは既に登録されています'
      : authError.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user!.id,
      email,
      child_name: childName,
      grade,
      mode,
      lab_unlocked: false,
    })

  if (profileError) {
    return NextResponse.json({ error: 'プロフィール作成に失敗しました' }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId: authData.user!.id })
}
