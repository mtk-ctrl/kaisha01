// Cross-device learning data sync via Supabase profiles.learning_data
import { getDataKey } from './storage'
import { SYNC_KEYS, mergeValue, type LearningPayload } from './learningMerge'
export type { LearningPayload } from './learningMerge'

function readRaw(key: string): unknown {
  try { const raw = localStorage.getItem(getDataKey(key)); return raw ? JSON.parse(raw) : null } catch { return null }
}
function writeRaw(key: string, value: unknown) {
  try { localStorage.setItem(getDataKey(key), JSON.stringify(value)) } catch (e) { if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] writeRaw failed', key, e) }
}
export function collectLocalData(): LearningPayload {
  const payload: LearningPayload = {}
  for (const key of SYNC_KEYS) { const val = readRaw(key); if (val != null) payload[key] = val }
  return payload
}
export function applyRemoteData(remote: LearningPayload) {
  for (const key of SYNC_KEYS) { const remoteVal = remote[key]; if (remoteVal == null) continue; writeRaw(key, mergeValue(key, readRaw(key), remoteVal)) }
}
function syncTarget(): 'member' | 'tester' | null {
  if (typeof window === 'undefined') return null
  const auth = localStorage.getItem('tanq-lab-auth')
  return auth === 'member' || auth === 'tester' ? auth : null
}
export async function pushToSupabase(): Promise<void> {
  const target = syncTarget(); if (!target) return
  const data = collectLocalData(); if (Object.keys(data).length === 0) return
  try {
    const res = await fetch(target === 'member' ? '/api/learning' : '/api/tester/learning', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) })
    if (!res.ok && process.env.NODE_ENV !== 'production') console.warn('[learningSync] push failed', res.status)
  } catch (e) { if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] push error', e) }
}
export async function pullFromSupabase(): Promise<void> {
  const target = syncTarget(); if (!target) return
  try {
    const res = await fetch(target === 'member' ? '/api/learning' : '/api/tester/learning')
    if (!res.ok) return
    const { data } = await res.json(); if (data && typeof data === 'object') applyRemoteData(data as LearningPayload)
  } catch (e) { if (process.env.NODE_ENV !== 'production') console.warn('[learningSync] pull error', e) }
}
