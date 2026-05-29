// Cross-device learning data sync via Supabase profiles.learning_data
// Pull on member login, push on quiz completion + page unload

import { STORAGE_KEYS } from './storageKeys'
import { getDataKey } from './storage'

type SRSCard = { b: number }
type SRSStore = Record<string, SRSCard>
type LevelData = { levelStars?: Record<string, number>; [k: string]: unknown }
type StreakData = { n: number; d: string }
export type LearningPayload = Record<string, unknown>

// Coding v2 scores key is not in STORAGE_KEYS (it's per-page), include explicitly
const CODING_SCORES_KEY = 'tanq_coding_v2_chapter_scores'

const SYNC_KEYS = [
  STORAGE_KEYS.KANJI_SRS,
  STORAGE_KEYS.ENGLISH_SRS,
  STORAGE_KEYS.WORDMATH_SRS,
  STORAGE_KEYS.SCIENCE_SRS,
  STORAGE_KEYS.KOKUGO,
  STORAGE_KEYS.KANYO,
  STORAGE_KEYS.YOJI,
  STORAGE_KEYS.THINKING,
  STORAGE_KEYS.THINKING_YOUJI,
  STORAGE_KEYS.CODING_CLEARED,
  STORAGE_KEYS.JUKU,
  STORAGE_KEYS.MATH_BEST,
  STORAGE_KEYS.CLOCK_BEST,
  STORAGE_KEYS.SHAPES_BEST,
  STORAGE_KEYS.KANJI_STREAK,
  STORAGE_KEYS.ENGLISH_STREAK,
  STORAGE_KEYS.WORDMATH_STREAK,
  STORAGE_KEYS.KATAKANA_RECORDS,
  STORAGE_KEYS.ANIMALS_BEST,
  STORAGE_KEYS.HIRAGANA_BEST,
  STORAGE_KEYS.JUUCOMBO_BEST,
  STORAGE_KEYS.MATH_YOUJI_BEST,
  STORAGE_KEYS.IRO_RECORDS,
  STORAGE_KEYS.YOUJI_KANJI_BEST,
  STORAGE_KEYS.KUKU_RECORDS,
  STORAGE_KEYS.CLOCK_RECORDS,
  STORAGE_KEYS.ZOKUSEI_RECORDS,
  CODING_SCORES_KEY,
] as const

// ── Merge helpers ──────────────────────────────────────────────

const SRS_KEYS: string[] = [
  STORAGE_KEYS.KANJI_SRS,
  STORAGE_KEYS.ENGLISH_SRS,
  STORAGE_KEYS.WORDMATH_SRS,
  STORAGE_KEYS.SCIENCE_SRS,
]
const LEVEL_KEYS: string[] = [STORAGE_KEYS.KOKUGO, STORAGE_KEYS.KANYO, STORAGE_KEYS.YOJI]
const STREAK_KEYS: string[] = [
  STORAGE_KEYS.KANJI_STREAK,
  STORAGE_KEYS.ENGLISH_STREAK,
  STORAGE_KEYS.WORDMATH_STREAK,
]
const ARRAY_KEYS: string[] = [
  STORAGE_KEYS.KATAKANA_RECORDS,
  STORAGE_KEYS.IRO_RECORDS,
  STORAGE_KEYS.YOUJI_KANJI_BEST,
  STORAGE_KEYS.KUKU_RECORDS,
]

function mergeSRS(local: SRSStore, remote: SRSStore): SRSStore {
  const merged = { ...local }
  for (const [id, val] of Object.entries(remote)) {
    if (!merged[id] || val.b > merged[id].b) merged[id] = val
  }
  return merged
}

function mergeLevelData(local: LevelData, remote: LevelData): LevelData {
  const ls = { ...(local.levelStars || {}) }
  for (const [lvl, stars] of Object.entries(remote.levelStars || {})) {
    ls[lvl] = Math.max(ls[lvl] ?? 0, stars)
  }
  return { ...local, ...remote, levelStars: ls }
}

function mergeStreak(local: StreakData, remote: StreakData): StreakData {
  return remote.n > local.n ? remote : local
}

function mergeCodingScores(local: (number | null)[], remote: (number | null)[]): (number | null)[] {
  const len = Math.max(local.length, remote.length)
  return Array.from({ length: len }, (_, i) => {
    const l = local[i] ?? null
    const r = remote[i] ?? null
    if (l == null) return r
    if (r == null) return l
    return Math.max(l, r)
  })
}

function mergeValue(key: string, local: unknown, remote: unknown): unknown {
  if (local == null) return remote
  if (remote == null) return local

  if (SRS_KEYS.includes(key)) return mergeSRS(local as SRSStore, remote as SRSStore)
  if (LEVEL_KEYS.includes(key)) return mergeLevelData(local as LevelData, remote as LevelData)
  if (STREAK_KEYS.includes(key)) return mergeStreak(local as StreakData, remote as StreakData)
  if (ARRAY_KEYS.includes(key)) {
    const la = local as unknown[]
    const ra = remote as unknown[]
    return ra.length > la.length ? ra : la
  }
  if (key === CODING_SCORES_KEY) {
    return mergeCodingScores(local as (number | null)[], remote as (number | null)[])
  }
  // Numeric objects (best scores): per key take max
  if (typeof local === 'object' && !Array.isArray(local) && typeof remote === 'object' && !Array.isArray(remote)) {
    const merged: Record<string, unknown> = { ...(local as Record<string, unknown>) }
    for (const [k, v] of Object.entries(remote as Record<string, unknown>)) {
      const lv = (local as Record<string, unknown>)[k]
      if (typeof v === 'number' && typeof lv === 'number') {
        merged[k] = Math.max(lv, v)
      } else if (lv == null) {
        merged[k] = v
      }
    }
    return merged
  }
  // Scalar: take max if numeric
  if (typeof local === 'number' && typeof remote === 'number') return Math.max(local, remote)
  return remote
}

// ── localStorage I/O ───────────────────────────────────────────

function readRaw(key: string): unknown {
  try {
    const raw = localStorage.getItem(getDataKey(key))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeRaw(key: string, value: unknown) {
  try {
    localStorage.setItem(getDataKey(key), JSON.stringify(value))
  } catch {}
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
    await fetch('/api/learning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
  } catch {}
}

export async function pullFromSupabase(): Promise<void> {
  try {
    const res = await fetch('/api/learning')
    if (!res.ok) return
    const { data } = await res.json()
    if (data && typeof data === 'object') applyRemoteData(data as LearningPayload)
  } catch {}
}
