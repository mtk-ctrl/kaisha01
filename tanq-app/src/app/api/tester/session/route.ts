import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import {
  normalizeTesterName,
  readTesterSession,
  requireAllowedOrigin,
  safeCodeEquals,
  setTesterSession,
} from '@/lib/testerSession'

const RATE_KEY = 'tester-entry:global'

async function checkRateLimit(failed: boolean): Promise<{ blocked: boolean; retryAfter: number }> {
  const svc = getServiceClient()
  const { data, error } = await svc.rpc('check_tester_auth_rate_limit', {
    p_rate_key: RATE_KEY,
    p_failed: failed,
    p_window_seconds: 300,
    p_max_failures: 10,
  })
  if (error || !Array.isArray(data) || !data[0] || typeof data[0].blocked !== 'boolean') {
    throw new Error('tester auth rate limit unavailable')
  }
  return { blocked: data[0].blocked, retryAfter: Number(data[0].retry_after) || 0 }
}

export async function GET(req: NextRequest) {
  const session = readTesterSession(req)
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 })
  return NextResponse.json({ authenticated: true, name: session.name })
}

export async function POST(req: NextRequest) {
  if (!requireAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null)
  const name = normalizeTesterName(body?.name)
  if (!name || typeof body?.code !== 'string') {
    return NextResponse.json({ error: 'name and code required' }, { status: 400 })
  }

  const validCode = safeCodeEquals(body.code)
  let limit: { blocked: boolean; retryAfter: number }
  try {
    limit = await checkRateLimit(!validCode)
  } catch {
    return NextResponse.json({ error: 'temporarily unavailable' }, { status: 503 })
  }
  if (limit.blocked) {
    return NextResponse.json(
      { error: 'too many attempts' },
      { status: 429, headers: { 'Retry-After': String(Math.max(1, limit.retryAfter)) } },
    )
  }
  if (!validCode) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })

  const res = NextResponse.json({ authenticated: true, name })
  setTesterSession(res, name)
  return res
}
