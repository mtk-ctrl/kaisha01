// テスター（PIN認証・auth ユーザー無し）のスコア履歴。member の /api/scores と対になる。
// 認証はテスター名（クライアントの PIN ゲートを通過した識別子）で行い、保存は service role。
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

function normName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const n = raw.trim().slice(0, 40)
  return n.length > 0 ? n : null
}

export async function GET(req: NextRequest) {
  const name = normName(req.nextUrl.searchParams.get('name'))
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  // 同期不可（環境変数未設定等）でもアプリを止めないよう、常に配列を返す
  try {
    const svc = getServiceClient()
    const { data, error } = await svc
      .from('tester_scores')
      .select('*')
      .eq('tester_name', name)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[api/tester/scores] GET error', error.message)
      return NextResponse.json({ scores: [] })
    }
    return NextResponse.json({ scores: data ?? [] })
  } catch (e) {
    console.error('[api/tester/scores] GET threw', e)
    return NextResponse.json({ scores: [] })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const name = normName(body?.name)
  const appId = typeof body?.appId === 'string' ? body.appId : null
  const score = Number(body?.score)
  const total = Number(body?.total)
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!appId || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
    return NextResponse.json({ error: 'appId, score, total は必須です' }, { status: 400 })
  }
  try {
    const svc = getServiceClient()
    const { error } = await svc.from('tester_scores').insert({
      tester_name: name,
      app_id: appId,
      score: Math.max(0, Math.floor(score)),
      total: Math.floor(total),
      difficulty: typeof body?.difficulty === 'string' ? body.difficulty : null,
    })
    if (error) {
      console.error('[api/tester/scores] POST error', error.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/tester/scores] POST threw', e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
