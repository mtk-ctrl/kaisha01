import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('child_name, grade, mode, lab_unlocked')
    .eq('id', data.user.id)
    .single()

  return NextResponse.json({
    success: true,
    session: data.session,
    user: { ...data.user, profile },
  })
}
