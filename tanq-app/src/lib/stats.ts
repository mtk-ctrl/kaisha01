// 全アプリの統計を計算する純粋関数
// AppHub の useStats hook から呼ばれる。直接呼ばない。

import { KANJI_DATA } from '@/data/kanjiData'
import { WORDS } from '@/data/englishData'
import { PROBLEMS as WORD_MATH_PROBLEMS } from '@/data/wordMathData'
import { SCIENCE_QUESTIONS } from '@/data/scienceData'
import { KOKUGO_LEVEL_META } from '@/data/kokugoData'
import { KANYO_LEVEL_META } from '@/data/kanyoData'
import { YOJI_LEVEL_META } from '@/data/yojiData'
import { getDataKey } from '@/lib/storage'
import { STORAGE_KEYS } from '@/lib/storageKeys'

/** 各アプリの全問題数・総ステージ数 */
export const TOTALS = {
  KANJI:        Object.values(KANJI_DATA).reduce((sum, arr) => sum + arr.length, 0),
  ENGLISH:      WORDS.length,
  WORDMATH:     WORD_MATH_PROBLEMS.length,
  CODING:       9,
  SCIENCE:      SCIENCE_QUESTIONS.length,
  KOKUGO_LEVELS: KOKUGO_LEVEL_META.length,
  KANYO_LEVELS:  KANYO_LEVEL_META.length,
  YOJI_LEVELS:   YOJI_LEVEL_META.length,
} as const

// ─── ヘルパー ─────────────────────────────────────────────────

function readSRSStore(key: string): Record<string, { b: number }> {
  try { return JSON.parse(localStorage.getItem(getDataKey(key)) || '{}') } catch { return {} }
}

function countSRS(store: Record<string, { b: number }>, b: number): number {
  return Object.values(store).filter(x => x.b === b).length
}

function readLevelStars(key: string): Record<number, 0 | 1 | 2 | 3> {
  try {
    const raw = localStorage.getItem(getDataKey(key))  // getDataKey で tester 分離
    if (!raw) return {}
    return (JSON.parse(raw) as { levelStars?: Record<number, 0 | 1 | 2 | 3> }).levelStars || {}
  } catch { return {} }
}

function getStreak(key: string): number {
  try { return JSON.parse(localStorage.getItem(getDataKey(key)) || '{"n":0}').n } catch { return 0 }
}

// ─── メイン ───────────────────────────────────────────────────

export function computeStats() {
  if (typeof window === 'undefined') return null

  const kanjiStore   = readSRSStore(STORAGE_KEYS.KANJI_SRS)
  const englishStore = readSRSStore(STORAGE_KEYS.ENGLISH_SRS)
  const wmStore      = readSRSStore(STORAGE_KEYS.WORDMATH_SRS)
  const scienceStore = readSRSStore(STORAGE_KEYS.SCIENCE_SRS)

  const kanjiMastered = countSRS(kanjiStore, 2)
  const kanjiLearning = countSRS(kanjiStore, 1)
  const engMastered   = countSRS(englishStore, 2)
  const engLearning   = countSRS(englishStore, 1)

  const SCIENCE_DOMAINS = ['生物', '地学', '化学', '物理'] as const
  const scienceByDomain = SCIENCE_DOMAINS.map(domain => {
    const pool     = SCIENCE_QUESTIONS.filter(q => q.domain === domain)
    const mastered = pool.filter(q => scienceStore[q.id]?.b === 2).length
    return { domain, total: pool.length, mastered }
  })
  const scienceMastered = scienceByDomain.reduce((sum, d) => sum + d.mastered, 0)

  // kokugo/kanyo/yoji は getDataKey 経由で読む（tester 分離対応）
  const kokugoLevelStars = readLevelStars(STORAGE_KEYS.KOKUGO)
  const kanyoLevelStars  = readLevelStars(STORAGE_KEYS.KANYO)
  const yojiLevelStars   = readLevelStars(STORAGE_KEYS.YOJI)

  const kokugoCleared = Object.values(kokugoLevelStars).filter(s => s >= 1).length
  const kokugoStars3  = Object.values(kokugoLevelStars).filter(s => s === 3).length
  const kanyoCleared  = Object.values(kanyoLevelStars).filter(s => s >= 1).length
  const yojiCleared   = Object.values(yojiLevelStars).filter(s => s >= 1).length

  const wmByGrade = (['小1', '小2', '小3'] as const).map(grade => {
    const pool     = WORD_MATH_PROBLEMS.filter(p => p.grade === grade)
    const mastered = pool.filter(p => wmStore[p.id]?.b === 2).length
    return { grade, total: pool.length, mastered, done: mastered === pool.length && pool.length > 0 }
  })

  let thinkingMaxLevel = 0, thinkingBadgeCount = 0
  try {
    const p = JSON.parse(localStorage.getItem(getDataKey(STORAGE_KEYS.THINKING)) || '{}')
    for (const [lvl, lp] of Object.entries(p.levels || {})) {
      if ((lp as { bestScore: number }).bestScore >= 3)
        thinkingMaxLevel = Math.max(thinkingMaxLevel, Number(lvl))
    }
    thinkingBadgeCount = Object.values(p.badges || {}).filter(
      (b) => (b as { silver?: boolean; gold?: boolean }).silver || (b as { silver?: boolean; gold?: boolean }).gold
    ).length
  } catch {}

  let youjiMaxLevel = 0, youjiBadgeCount = 0
  try {
    const p = JSON.parse(localStorage.getItem(getDataKey(STORAGE_KEYS.THINKING_YOUJI)) || '{}')
    for (const [lvl, lp] of Object.entries(p.levels || {})) {
      if ((lp as { bestScore: number }).bestScore >= 4)
        youjiMaxLevel = Math.max(youjiMaxLevel, Number(lvl))
    }
    youjiBadgeCount = Object.values(p.badges || {}).filter(
      (b) => (b as { silver?: boolean; gold?: boolean }).silver || (b as { silver?: boolean; gold?: boolean }).gold
    ).length
  } catch {}

  let codingCleared = 0
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEYS.CODING_CLEARED))
    if (raw) codingCleared = (JSON.parse(raw) as number[]).length
  } catch {}

  type MathBest = { easy: number; normal: number; hard: number }
  let mathBest: MathBest = { easy: 0, normal: 0, hard: 0 }
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEYS.MATH_BEST))
    if (raw) mathBest = { ...mathBest, ...JSON.parse(raw) }
  } catch {}

  type ClockBest = { jidou: number; sanjuppun: number; all: number }
  let clockBest: ClockBest = { jidou: 0, sanjuppun: 0, all: 0 }
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEYS.CLOCK_BEST))
    if (raw) clockBest = { ...clockBest, ...JSON.parse(raw) }
  } catch {}

  let shapesBest = 0
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEYS.SHAPES_BEST))
    if (raw) shapesBest = (JSON.parse(raw) as { best: number }).best || 0
  } catch {}

  const streak = Math.max(
    getStreak(STORAGE_KEYS.KANJI_STREAK),
    getStreak(STORAGE_KEYS.ENGLISH_STREAK),
    getStreak(STORAGE_KEYS.WORDMATH_STREAK),
  )

  return {
    kanjiMastered, kanjiLearning, kanjiTotal: TOTALS.KANJI,
    engMastered,   engLearning,   engTotal:   TOTALS.ENGLISH,
    wmByGrade,
    scienceByDomain, scienceMastered, scienceTotal: TOTALS.SCIENCE,
    kokugoCleared, kokugoStars3, kokugoTotal: TOTALS.KOKUGO_LEVELS,
    kanyoCleared,                kanyoTotal:  TOTALS.KANYO_LEVELS,
    yojiCleared,                 yojiTotal:   TOTALS.YOJI_LEVELS,
    thinkingMaxLevel, thinkingBadgeCount,
    youjiMaxLevel,    youjiBadgeCount,
    codingCleared,
    mathBest, clockBest, shapesBest,
    streak,
  }
}

export type AppStats = NonNullable<ReturnType<typeof computeStats>>
