// 相棒育成（Phase C-1）
// 経験値 = コイン lifetime（学習量に連動・単調増加）+ ごはんボーナスXP。
// キャラは4種・性別を固定しないテーマ色（オーナー指示: 女の子も男の子も楽しめること）。

import { getDataKey, parseStorage } from './storage'
import { STORAGE_KEYS } from './storageKeys'
import { loadCoins, spendCoins, todayStr } from './coins'

export type BuddyType = 'neko' | 'inu' | 'dragon' | 'usagi'

export interface BuddyCharacter {
  type: BuddyType
  label: string
  defaultName: string
  emoji: string // こども期までの姿
  grownEmoji: string // おとな・マスター期の姿
  color: string // テーマ色（濃）
  bg: string // テーマ色（淡・背景）
}

export const BUDDY_CHARACTERS: BuddyCharacter[] = [
  { type: 'neko',   label: 'ねこ',     defaultName: 'ミケ',  emoji: '🐱', grownEmoji: '🐈', color: '#E8930C', bg: '#FFF1B8' },
  { type: 'inu',    label: 'いぬ',     defaultName: 'ポチ',  emoji: '🐶', grownEmoji: '🐕', color: '#3B82F6', bg: '#DCEBFF' },
  { type: 'dragon', label: 'ドラゴン', defaultName: 'リュウ', emoji: '🐲', grownEmoji: '🐉', color: '#16A34A', bg: '#DBF6F0' },
  { type: 'usagi',  label: 'うさぎ',   defaultName: 'ミミ',  emoji: '🐰', grownEmoji: '🐇', color: '#FF6F9C', bg: '#FFE3EE' },
]

export function getCharacter(type: BuddyType): BuddyCharacter {
  return BUDDY_CHARACTERS.find((c) => c.type === type) ?? BUDDY_CHARACTERS[0]
}

export interface BuddyAccessory { id: string; label: string; emoji: string; price: number }

export const BUDDY_ACCESSORIES: BuddyAccessory[] = [
  { id: 'hat',     label: 'ぼうし',   emoji: '🎩', price: 30 },
  { id: 'ribbon',  label: 'リボン',   emoji: '🎀', price: 40 },
  { id: 'glasses', label: 'めがね',   emoji: '🕶️', price: 60 },
  { id: 'crown',   label: 'おうかん', emoji: '👑', price: 100 },
]

export const FEED_COST = 10 // ごはん1回のコイン
export const FEED_XP = 5 // ごはん1回のボーナスXP
export const FEED_LIMIT_PER_DAY = 3 // 1日の上限（無限消費の防止）

export interface BuddyStage { level: number; label: string; minXp: number }

export const BUDDY_STAGES: BuddyStage[] = [
  { level: 1, label: 'たまご',     minXp: 0 },
  { level: 2, label: 'あかちゃん', minXp: 30 },
  { level: 3, label: 'こども',     minXp: 100 },
  { level: 4, label: 'おとな',     minXp: 300 },
  { level: 5, label: 'マスター',   minXp: 800 },
]

export interface BuddyState {
  type: BuddyType
  name: string
  bonusXp: number // ごはんで得たXP（コインlifetimeに加算して総XPになる）
  feedDate: string // 最後にごはんをあげた日 YYYY-MM-DD
  feedCount: number // feedDate の日にあげた回数
  owned: string[] // 購入済みアクセサリ id
  equipped: string | null // 装備中アクセサリ id
}

const VALID_TYPES: BuddyType[] = ['neko', 'inu', 'dragon', 'usagi']

function buddyKey(): string {
  return getDataKey(STORAGE_KEYS.BUDDY)
}

/** 未作成なら null。壊れたデータは正規化して返す */
export function loadBuddy(): BuddyState | null {
  if (typeof window === 'undefined') return null
  const raw = parseStorage<Partial<BuddyState> | null>(buddyKey(), null)
  if (!raw || typeof raw !== 'object') return null
  if (!VALID_TYPES.includes(raw.type as BuddyType)) return null
  const num = (v: unknown): number =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0
  return {
    type: raw.type as BuddyType,
    name:
      typeof raw.name === 'string' && raw.name.trim()
        ? raw.name.trim().slice(0, 10)
        : getCharacter(raw.type as BuddyType).defaultName,
    bonusXp: num(raw.bonusXp),
    feedDate: typeof raw.feedDate === 'string' ? raw.feedDate : '',
    feedCount: num(raw.feedCount),
    owned: Array.isArray(raw.owned) ? raw.owned.filter((id): id is string => typeof id === 'string') : [],
    equipped: typeof raw.equipped === 'string' ? raw.equipped : null,
  }
}

export function saveBuddy(state: BuddyState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(buddyKey(), JSON.stringify(state))
  } catch {
    // サイレントスキップ
  }
}

export function createBuddy(type: BuddyType, name: string): BuddyState {
  const c = getCharacter(type)
  const state: BuddyState = {
    type,
    name: name.trim().slice(0, 10) || c.defaultName,
    bonusXp: 0,
    feedDate: '',
    feedCount: 0,
    owned: [],
    equipped: null,
  }
  saveBuddy(state)
  return state
}

/** 総経験値 = コイン累計 + ごはんボーナス */
export function getBuddyXp(buddy: BuddyState): number {
  return loadCoins().lifetime + buddy.bonusXp
}

export function getStage(xp: number): BuddyStage {
  let stage = BUDDY_STAGES[0]
  for (const s of BUDDY_STAGES) if (xp >= s.minXp) stage = s
  return stage
}

/** 次の段階（マスターなら null） */
export function getNextStage(xp: number): BuddyStage | null {
  return BUDDY_STAGES.find((s) => s.minXp > xp) ?? null
}

/** 段階に応じた見た目（たまご期は 🥚） */
export function buddyEmoji(buddy: BuddyState, stage: BuddyStage): string {
  const c = getCharacter(buddy.type)
  if (stage.level === 1) return '🥚'
  return stage.level >= 4 ? c.grownEmoji : c.emoji
}

export function feedsLeftToday(buddy: BuddyState): number {
  if (buddy.feedDate !== todayStr()) return FEED_LIMIT_PER_DAY
  return Math.max(0, FEED_LIMIT_PER_DAY - buddy.feedCount)
}

export type FeedResult = { ok: true; buddy: BuddyState } | { ok: false; reason: 'limit' | 'coins' }

/** ごはんをあげる: コイン10消費・ボーナスXP+5・1日3回まで */
export function feedBuddy(buddy: BuddyState): FeedResult {
  if (feedsLeftToday(buddy) <= 0) return { ok: false, reason: 'limit' }
  if (!spendCoins(FEED_COST)) return { ok: false, reason: 'coins' }
  const today = todayStr()
  const next: BuddyState = {
    ...buddy,
    bonusXp: buddy.bonusXp + FEED_XP,
    feedDate: today,
    feedCount: buddy.feedDate === today ? buddy.feedCount + 1 : 1,
  }
  saveBuddy(next)
  return { ok: true, buddy: next }
}

export type BuyResult = { ok: true; buddy: BuddyState } | { ok: false; reason: 'owned' | 'coins' | 'unknown' }

/** アクセサリを購入して装備する */
export function buyAccessory(buddy: BuddyState, id: string): BuyResult {
  const item = BUDDY_ACCESSORIES.find((a) => a.id === id)
  if (!item) return { ok: false, reason: 'unknown' }
  if (buddy.owned.includes(id)) return { ok: false, reason: 'owned' }
  if (!spendCoins(item.price)) return { ok: false, reason: 'coins' }
  const next: BuddyState = { ...buddy, owned: [...buddy.owned, id], equipped: id }
  saveBuddy(next)
  return { ok: true, buddy: next }
}

/** 装備切替（null で外す）。購入済みのみ装備できる */
export function equipAccessory(buddy: BuddyState, id: string | null): BuddyState {
  if (id !== null && !buddy.owned.includes(id)) return buddy
  const next: BuddyState = { ...buddy, equipped: id }
  saveBuddy(next)
  return next
}
