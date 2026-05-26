import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServiceClient } from '@/lib/supabase'

async function getUserFromCookies() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const svc = getServiceClient()
  const { data: scores } = await svc
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ scores: scores ?? [] })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { appId, score, total, difficulty } = await req.json()
  if (!appId || score === undefined || !total) {
    return NextResponse.json({ error: 'appId, score, total は必須です' }, { status: 400 })
  }

  const svc = getServiceClient()
  const { data, error: insertErr } = await svc
    .from('scores')
    .insert({ user_id: user.id, app_id: appId, score, total, difficulty: difficulty ?? null })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  return NextResponse.json({ success: true, record: data })
}
