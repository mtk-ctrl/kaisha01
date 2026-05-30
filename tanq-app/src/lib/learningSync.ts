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

export async function pushToSupabase(): Promise<void> {
  const data = collectLocalData()
  if (Object.keys(data).length === 0) return
  try {
    const res = await fetch('/api/learning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
    if (!res.ok && process.env.NODE_ENV !== 'production') {
      console.warn('[learningSync] push failed', res.status)
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] push error', e)
  }
}

export async function pullFromSupabase(): Promise<void> {
  try {
    const res = await fetch('/api/learning')
    if (!res.ok) return
    const { data } = await res.json()
    if (data && typeof data === 'object') applyRemoteData(data as LearningPayload)
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] pull error', e)
  }
}
