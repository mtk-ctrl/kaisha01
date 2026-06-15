// テスター（PIN認証・auth ユーザー無し）の学習データ同期。
// member の /api/learning と同じく「既存 + 受信」をマージしてから保存する。
// 認証はテスター名（クライアントの PIN ゲートを通過した識別子）で行い、保存は service role。
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { mergePayloads, type LearningPayload } from '@/lib/learningMerge'

const MAX_PAYLOAD_BYTES = 256 * 1024

function normName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const n = raw.trim().slice(0, 40)
  return n.length > 0 ? n : null
}

export async function GET(req: NextRequest) {
  const name = normName(req.nextUrl.searchParams.get('name'))
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  // 同期が不可能な状況（環境変数未設定・テーブル未作成など）でもアプリを止めないよう、
  // GET は常にグレースフルに {data:{}} を返す（ローカルデータでそのまま動作する）。
  try {
    const svc = getServiceClient()
    const { data, error } = await svc
      .from('tester_data')
      .select('learning_data')
      .eq('tester_name', name)
      .maybeSingle()
    if (error) {
      console.error('[api/tester/learning] GET error', error.message)
      return NextResponse.json({ data: {} })
    }
    return NextResponse.json({ data: data?.learning_data ?? {} })
  } catch (e) {
    console.error('[api/tester/learning] GET threw', e)
    return NextResponse.json({ data: {} })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const name = normName(body?.name)
  const payload = body?.data
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
  if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 })
  }

  try {
    const svc = getServiceClient()
    // 既存のリモートデータとマージしてから保存（多端末で進捗が消えないように）
    const { data: existing, error: readErr } = await svc
      .from('tester_data')
      .select('learning_data')
      .eq('tester_name', name)
      .maybeSingle()

    if (readErr) {
      console.error('[api/tester/learning] POST read error', readErr.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }

    const base = (existing?.learning_data ?? {}) as LearningPayload
    const merged = mergePayloads(base, payload as LearningPayload)

    const { error } = await svc
      .from('tester_data')
      .upsert({ tester_name: name, learning_data: merged, updated_at: new Date().toISOString() })

    if (error) {
      console.error('[api/tester/learning] POST upsert error', error.message)
      return NextResponse.json({ error: 'failed to save' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/tester/learning] POST threw', e)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
