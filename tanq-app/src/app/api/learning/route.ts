import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mergePayloads, type LearningPayload } from '@/lib/learningMerge'

// 学習データJSONの上限（肥大化・DoS防止）。全アプリ分でも数十KBに収まる想定
const MAX_PAYLOAD_BYTES = 256 * 1024

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('learning_data')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('[api/learning] GET error', error.message)
    return NextResponse.json({ error: 'failed to load' }, { status: 500 })
  }
  return NextResponse.json({ data: data?.learning_data ?? {} })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const payload = body?.data
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
  if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 })
  }

  // 既存のリモートデータを読み、受信データとマージしてから保存する。
  // これにより別端末で先に保存された進捗が上書きで消えるのを防ぐ。
  const { data: existing, error: readErr } = await supabase
    .from('profiles')
    .select('learning_data')
    .eq('id', user.id)
    .single()

  if (readErr) {
    console.error('[api/learning] POST read error', readErr.message)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }

  const base = (existing?.learning_data ?? {}) as LearningPayload
  const merged = mergePayloads(base, payload as LearningPayload)

  const { error } = await supabase
    .from('profiles')
    .update({ learning_data: merged })
    .eq('id', user.id)

  if (error) {
    console.error('[api/learning] POST update error', error.message)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
