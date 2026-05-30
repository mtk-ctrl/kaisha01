// 学習データのマージロジック（純粋関数・localStorage 非依存）
// クライアント（learningSync）とサーバ（/api/learning POST）の両方から使う。
// サーバ側で「既存リモート + 受信データ」をマージしてから保存することで、
// 多端末同時利用時の上書きによる進捗消失を防ぐ。

import { STORAGE_KEYS } from './storageKeys'

type SRSCard = { b: number }
type SRSStore = Record<string, SRSCard>
type LevelData = { levelStars?: Record<string, number>; [k: string]: unknown }
type StreakData = { n: number; d: string }
export type LearningPayload = Record<string, unknown>

// Coding v2 scores key is not in STORAGE_KEYS (it's per-page), include explicitly
export const CODING_SCORES_KEY = 'tanq_coding_v2_chapter_scores'

export const SYNC_KEYS = [
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

// ── 型ガード ────────────────────────────────────────────────────
// リモート JSON が壊れていてもクラッシュせず安全側に倒すための検査

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v != null && !Array.isArray(v)
}

function isSRSStore(v: unknown): v is SRSStore {
  if (!isPlainObject(v)) return false
  return Object.values(v).every(
    (card) => isPlainObject(card) && typeof (card as SRSCard).b === 'number',
  )
}

function isStreakData(v: unknown): v is StreakData {
  return isPlainObject(v) && typeof (v as StreakData).n === 'number'
}

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

/** 1キー分の local と remote をマージ。型が想定外なら remote を優先して安全に倒す */
export function mergeValue(key: string, local: unknown, remote: unknown): unknown {
  if (local == null) return remote
  if (remote == null) return local

  if (SRS_KEYS.includes(key)) {
    if (isSRSStore(local) && isSRSStore(remote)) return mergeSRS(local, remote)
    return isSRSStore(remote) ? remote : local
  }
  if (LEVEL_KEYS.includes(key)) {
    if (isPlainObject(local) && isPlainObject(remote)) {
      return mergeLevelData(local as LevelData, remote as LevelData)
    }
    return remote
  }
  if (STREAK_KEYS.includes(key)) {
    if (isStreakData(local) && isStreakData(remote)) return mergeStreak(local, remote)
    return isStreakData(remote) ? remote : local
  }
  if (ARRAY_KEYS.includes(key)) {
    if (Array.isArray(local) && Array.isArray(remote)) {
      return remote.length > local.length ? remote : local
    }
    return Array.isArray(remote) ? remote : local
  }
  if (key === CODING_SCORES_KEY) {
    if (Array.isArray(local) && Array.isArray(remote)) {
      return mergeCodingScores(local as (number | null)[], remote as (number | null)[])
    }
    return remote
  }
  // Numeric objects (best scores): per key take max
  if (isPlainObject(local) && isPlainObject(remote)) {
    const merged: Record<string, unknown> = { ...local }
    for (const [k, v] of Object.entries(remote)) {
      const lv = local[k]
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

/** 2つの payload を全 SYNC_KEYS にわたってマージする */
export function mergePayloads(base: LearningPayload, incoming: LearningPayload): LearningPayload {
  const merged: LearningPayload = { ...base }
  for (const key of SYNC_KEYS) {
    const b = base[key]
    const inc = incoming[key]
    if (inc == null && b == null) continue
    merged[key] = mergeValue(key, b, inc)
  }
  return merged
}
