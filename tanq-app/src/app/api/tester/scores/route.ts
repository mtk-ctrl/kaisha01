// テスタースコア履歴。対象IDは署名済みtester sessionから決める。
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { readTesterSession, requireAllowedOrigin } from '@/lib/testerSession'

export async function GET(req: NextRequest) {
  const session = readTesterSession(req)
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const svc = getServiceClient()
    const { data, error } = await svc.from('tester_scores').select('*').eq('tester_name', session.name).order('created_at', { ascending: false })
    if (error) {
      console.error('[api/tester/scores] GET error', error.message)
      return NextResponse.json({ scores: [] })
    }
    return NextResponse.json({ scores: data ?? [], name: session.name })
  } catch (e) {
    console.error('[api/tester/scores] GET threw', e)
    return NextResponse.json({ scores: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!requireAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const session = readTesterSession(req)
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const appId = typeof body?.appId === 'string' ? body.appId : null
  const score = Number(body?.score)
  const total = Number(body?.total)
  if (!appId || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return NextResponse.json({ error: 'appId, score, total は必須です' }, { status: 400 })
  try {
    const svc = getServiceClient()
    const { error } = await svc.from('tester_scores').insert({ tester_name: session.name, app_id: appId, score: Math.max(0, Math.floor(score)), total: Math.floor(total), difficulty: typeof body?.difficulty === 'string' ? body.difficulty : null })
    if (error) {
      console.error('[api/tester/scores] POST error', error.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }
    return NextResponse.json({ success: true, name: session.name })
  } catch (e) {
    console.error('[api/tester/scores] POST threw', e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
