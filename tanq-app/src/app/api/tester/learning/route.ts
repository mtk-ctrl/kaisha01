// テスター学習データ同期。対象IDはクライアント送信値ではなく署名済みtester sessionから決める。
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { mergePayloads, type LearningPayload } from '@/lib/learningMerge'
import { readTesterSession, requireAllowedOrigin } from '@/lib/testerSession'

const MAX_PAYLOAD_BYTES = 256 * 1024

export async function GET(req: NextRequest) {
  const session = readTesterSession(req)
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const svc = getServiceClient()
    const { data, error } = await svc.from('tester_data').select('learning_data').eq('tester_name', session.name).maybeSingle()
    if (error) {
      console.error('[api/tester/learning] GET error', error.message)
      return NextResponse.json({ data: {} })
    }
    return NextResponse.json({ data: data?.learning_data ?? {}, name: session.name })
  } catch (e) {
    console.error('[api/tester/learning] GET threw', e)
    return NextResponse.json({ data: {} })
  }
}

export async function POST(req: NextRequest) {
  if (!requireAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const session = readTesterSession(req)
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const payload = body?.data
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) return NextResponse.json({ error: 'payload too large' }, { status: 413 })

  try {
    const svc = getServiceClient()
    const { data: existing, error: readErr } = await svc.from('tester_data').select('learning_data').eq('tester_name', session.name).maybeSingle()
    if (readErr) {
      console.error('[api/tester/learning] POST read error', readErr.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }
    const merged = mergePayloads((existing?.learning_data ?? {}) as LearningPayload, payload as LearningPayload)
    const { error } = await svc.from('tester_data').upsert({ tester_name: session.name, learning_data: merged, updated_at: new Date().toISOString() })
    if (error) {
      console.error('[api/tester/learning] POST upsert error', error.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }
    return NextResponse.json({ success: true, name: session.name })
  } catch (e) {
    console.error('[api/tester/learning] POST threw', e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
