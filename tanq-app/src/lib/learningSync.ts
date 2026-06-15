// Cross-device learning data sync via Supabase profiles.learning_data
// Pull on member login, push on quiz completion + page unload
// マージロジックは learningMerge.ts（純粋関数・サーバ共有）に集約

import { getDataKey } from './storage'
import { SYNC_KEYS, mergeValue, type LearningPayload } from './learningMerge'

export type { LearningPayload } from './learningMerge'

// ── localStorage I/O ───────────────────────────────────────────

function readRaw(key: string): unknown {
  try {
    const raw = localStorage.getItem(getDataKey(key))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeRaw(key: string, value: unknown) {
  try {
    localStorage.setItem(getDataKey(key), JSON.stringify(value))
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] writeRaw failed', key, e)
  }
}

// ── Public API ─────────────────────────────────────────────────

export function collectLocalData(): LearningPayload {
  const payload: LearningPayload = {}
  for (const key of SYNC_KEYS) {
    const val = readRaw(key)
    if (val != null) payload[key] = val
  }
  return payload
}

export function applyRemoteData(remote: LearningPayload) {
  for (const key of SYNC_KEYS) {
    const remoteVal = remote[key]
    if (remoteVal == null) continue
    const localVal = readRaw(key)
    const merged = mergeValue(key, localVal, remoteVal)
    writeRaw(key, merged)
  }
}

// member は /api/learning（cookie 認証）、tester は /api/tester/learning（テスター名キー）。
// guest は同期しない（null を返す）。
function syncTarget(): { kind: 'member' } | { kind: 'tester'; name: string } | null {
  if (typeof window === 'undefined') return null
  const auth = localStorage.getItem('tanq-lab-auth')
  if (auth === 'member') return { kind: 'member' }
  if (auth === 'tester') {
    const name = (localStorage.getItem('tanq-tester-name') || '').trim()
    if (name) return { kind: 'tester', name }
  }
  return null
}

export async function pushToSupabase(): Promise<void> {
  const target = syncTarget()
  if (!target) return
  const data = collectLocalData()
  if (Object.keys(data).length === 0) return
  try {
    const url = target.kind === 'member' ? '/api/learning' : '/api/tester/learning'
    const body = target.kind === 'member' ? { data } : { name: target.name, data }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok && process.env.NODE_ENV !== 'production') {
      console.warn('[learningSync] push failed', res.status)
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] push error', e)
  }
}

export async function pullFromSupabase(): Promise<void> {
  const target = syncTarget()
  if (!target) return
  try {
    const url = target.kind === 'member'
      ? '/api/learning'
      : `/api/tester/learning?name=${encodeURIComponent(target.name)}`
    const res = await fetch(url)
    if (!res.ok) return
    const { data } = await res.json()
    if (data && typeof data === 'object') applyRemoteData(data as LearningPayload)
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] pull error', e)
  }
}
