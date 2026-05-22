'use client'

import { THINKING_QUESTIONS, UNLOCK_THRESHOLD, QUESTIONS_PER_LEVEL, TOTAL_LEVELS } from '@/data/thinkingData'
import { BADGES, TYPE_TO_BADGE } from '@/data/thinkingBadges'

const PROGRESS_KEY = 'tanq_thinking_progress_v1'

export interface LevelProgress {
  bestScore: number    // 0〜5
  attempts: number
  answeredCorrectly: number[]  // 正解した問題ID
}

export interface BadgeProgress {
  badgeId: string
  silver: boolean       // 初回正解で取得
  gold: boolean         // タイプ全問正解で取得
  silverDate?: string
  goldDate?: string
}

export interface ThinkingProgress {
  levels: Record<number, LevelProgress>   // level → progress
  badges: Record<string, BadgeProgress>   // badgeId → progress
  totalCorrect: number
  consecutiveCorrect: number              // 現在の連続正解数
  allBadgesGold: boolean                  // 全バッジゴールド達成
}

function defaultProgress(): ThinkingProgress {
  return {
    levels: {},
    badges: {},
    totalCorrect: 0,
    consecutiveCorrect: 0,
    allBadgesGold: false,
  }
}

export function loadProgress(): ThinkingProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress()
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: ThinkingProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}

export function isLevelUnlocked(level: number, progress: ThinkingProgress): boolean {
  if (level === 1) return true
  const prev = progress.levels[level - 1]
  return !!prev && prev.bestScore >= UNLOCK_THRESHOLD
}

export function getLevelProgress(level: number, progress: ThinkingProgress): LevelProgress {
  return progress.levels[level] ?? { bestScore: 0, attempts: 0, answeredCorrectly: [] }
}

export function getLevelStars(score: number): number {
  if (score >= QUESTIONS_PER_LEVEL) return 3
  if (score >= QUESTIONS_PER_LEVEL - 1) return 2
  if (score >= UNLOCK_THRESHOLD) return 1
  return 0
}

// レベル完了時の処理。返値：{ newBadges: BadgeProgress[], levelUnlocked: boolean }
export function recordLevelResult(
  level: number,
  correctIds: number[],
  progress: ThinkingProgress
): { updated: ThinkingProgress; newSilver: string[]; newGold: string[] } {
  const score = correctIds.length
  const today = new Date().toISOString().slice(0, 10)

  // レベル進捗更新
  const prev = getLevelProgress(level, progress)
  const updatedLevel: LevelProgress = {
    bestScore: Math.max(prev.bestScore, score),
    attempts: prev.attempts + 1,
    answeredCorrectly: Array.from(new Set([...prev.answeredCorrectly, ...correctIds])),
  }

  const newProgress = {
    ...progress,
    levels: { ...progress.levels, [level]: updatedLevel },
    totalCorrect: progress.totalCorrect + score,
  }

  // バッジ更新
  const newSilver: string[] = []
  const newGold: string[] = []

  const levelQuestions = THINKING_QUESTIONS.filter(q => q.level === level)
  for (const q of levelQuestions) {
    if (!correctIds.includes(q.id)) continue
    const badgeId = TYPE_TO_BADGE[q.type]
    if (!badgeId) continue

    const badge = BADGES.find(b => b.id === badgeId)
    if (!badge) continue

    const prev = newProgress.badges[badgeId] ?? { badgeId, silver: false, gold: false }

    // シルバー：タイプ初回正解
    if (!prev.silver) {
      newProgress.badges = {
        ...newProgress.badges,
        [badgeId]: { ...prev, silver: true, silverDate: today },
      }
      newSilver.push(badgeId)
    }

    // ゴールド：タイプ全問正解チェック
    const badgeQuestions = THINKING_QUESTIONS.filter(q2 => TYPE_TO_BADGE[q2.type] === badgeId)
    // 他レベルの正解も含める
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

  // 全バッジゴールドチェック
  const allGold = BADGES.every(b => newProgress.badges[b.id]?.gold)
  newProgress.allBadgesGold = allGold

  return { updated: newProgress, newSilver, newGold }
}

export function updateStreak(correct: boolean, progress: ThinkingProgress): ThinkingProgress {
  return {
    ...progress,
    consecutiveCorrect: correct ? progress.consecutiveCorrect + 1 : 0,
  }
}
