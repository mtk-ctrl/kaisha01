'use client'

import { YOUJI_QUESTIONS, YOUJI_UNLOCK_THRESHOLD, YOUJI_QUESTIONS_PER_LEVEL } from '@/data/thinkingYoujiData'
import { YOUJI_BADGES, YOUJI_TYPE_TO_BADGE } from '@/data/thinkingYoujiBadges'
import { getDataKey } from '@/lib/storage'

const PROGRESS_KEY = 'tanq_thinking_youji_progress_v1'

export interface YoujiLevelProgress {
  bestScore: number
  attempts: number
  answeredCorrectly: number[]
}

export interface YoujiBadgeProgress {
  badgeId: string
  silver: boolean
  gold: boolean
  silverDate?: string
  goldDate?: string
}

export interface YoujiProgress {
  levels: Record<number, YoujiLevelProgress>
  badges: Record<string, YoujiBadgeProgress>
  totalCorrect: number
  consecutiveCorrect: number
  allBadgesGold: boolean
}

function defaultProgress(): YoujiProgress {
  return {
    levels: {},
    badges: {},
    totalCorrect: 0,
    consecutiveCorrect: 0,
    allBadgesGold: false,
  }
}

export function loadYoujiProgress(): YoujiProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(getDataKey(PROGRESS_KEY))
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress()
  } catch {
    return defaultProgress()
  }
}

export function saveYoujiProgress(p: YoujiProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getDataKey(PROGRESS_KEY), JSON.stringify(p))
}

export function isYoujiLevelUnlocked(level: number, progress: YoujiProgress): boolean {
  if (level === 1) return true
  const prev = progress.levels[level - 1]
  return !!prev && prev.bestScore >= YOUJI_UNLOCK_THRESHOLD
}

export function getYoujiLevelProgress(level: number, progress: YoujiProgress): YoujiLevelProgress {
  return progress.levels[level] ?? { bestScore: 0, attempts: 0, answeredCorrectly: [] }
}

export function getYoujiLevelStars(score: number): number {
  if (score >= YOUJI_QUESTIONS_PER_LEVEL) return 3    // 5/5 パーフェクト
  if (score >= YOUJI_UNLOCK_THRESHOLD) return 2       // 4/5 クリア
  if (score >= YOUJI_UNLOCK_THRESHOLD - 1) return 1   // 3/5 もうすこし
  return 0
}

export function recordYoujiLevelResult(
  level: number,
  correctIds: number[],
  progress: YoujiProgress
): { updated: YoujiProgress; newSilver: string[]; newGold: string[] } {
  const score = correctIds.length
  const today = new Date().toISOString().slice(0, 10)

  const prev = getYoujiLevelProgress(level, progress)
  const updatedLevel: YoujiLevelProgress = {
    bestScore: Math.max(prev.bestScore, score),
    attempts: prev.attempts + 1,
    answeredCorrectly: Array.from(new Set([...prev.answeredCorrectly, ...correctIds])),
  }

  const newProgress: YoujiProgress = {
    ...progress,
    levels: { ...progress.levels, [level]: updatedLevel },
    totalCorrect: progress.totalCorrect + score,
  }

  const newSilver: string[] = []
  const newGold: string[] = []

  const levelQuestions = YOUJI_QUESTIONS.filter(q => q.level === level)
  for (const q of levelQuestions) {
    if (!correctIds.includes(q.id)) continue
    const badgeId = YOUJI_TYPE_TO_BADGE[q.type]
    if (!badgeId) continue

    const badge = YOUJI_BADGES.find(b => b.id === badgeId)
    if (!badge) continue

    const prevBadge = newProgress.badges[badgeId] ?? { badgeId, silver: false, gold: false }

    if (!prevBadge.silver) {
      newProgress.badges = {
        ...newProgress.badges,
        [badgeId]: { ...prevBadge, silver: true, silverDate: today },
      }
      newSilver.push(badgeId)
    }

    const badgeQuestions = YOUJI_QUESTIONS.filter(q2 => YOUJI_TYPE_TO_BADGE[q2.type] === badgeId)
    const allAnswered = new Set<number>()
    Object.values(newProgress.levels).forEach(lp => lp.answeredCorrectly.forEach(id => allAnswered.add(id)))
    correctIds.forEach(id => allAnswered.add(id))

    const allTypeCorrect = badgeQuestions.every(q2 => allAnswered.has(q2.id))
    const current = newProgress.badges[badgeId] ?? { badgeId, silver: true, gold: false, silverDate: today }
    if (allTypeCorrect && !current.gold) {
      newProgress.badges = {
        ...newProgress.badges,
        [badgeId]: { ...current, gold: true, goldDate: today },
      }
      newGold.push(badgeId)
    }
  }

  const allGold = YOUJI_BADGES.every(b => newProgress.badges[b.id]?.gold)
  newProgress.allBadgesGold = allGold

  return { updated: newProgress, newSilver, newGold }
}

export function updateYoujiStreak(correct: boolean, progress: YoujiProgress): YoujiProgress {
  return {
    ...progress,
    consecutiveCorrect: correct ? progress.consecutiveCorrect + 1 : 0,
  }
}
