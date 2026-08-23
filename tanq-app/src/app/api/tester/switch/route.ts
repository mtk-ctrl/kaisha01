import { NextRequest, NextResponse } from 'next/server'
import { normalizeTesterName, readTesterSession, requireAllowedOrigin, setTesterSession } from '@/lib/testerSession'

export async function POST(req: NextRequest) {
  if (!requireAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const current = readTesterSession(req)
  if (!current) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const name = normalizeTesterName(body?.name)
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!current.allowedNames.includes(name)) {
    return NextResponse.json({ error: 'tester id not allowed for this session' }, { status: 403 })
  }
  const res = NextResponse.json({ success: true, name, allowedNames: current.allowedNames })
  setTesterSession(res, name, current.allowedNames)
  return res
}
