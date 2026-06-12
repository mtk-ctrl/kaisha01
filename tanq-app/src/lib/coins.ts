// 共通コイン基盤（Phase C-1）
// 獲得は src/lib/scoreApi.ts の saveScore に統合済み（全アプリの唯一の合流点）。
// 1正解 = 1コイン + セッション完了ボーナス 5コイン。
// log は「日付 × アプリ」で集計して直近30日分のみ保持（Phase C-2 ミッション判定に使う）。

import { getDataKey, parseStorage } from './storage'
import { STORAGE_KEYS } from './storageKeys'

export const SESSION_BONUS = 5
const LOG_DAYS = 30

export interface CoinLogEntry {
  d: string // YYYY-MM-DD（ローカル日付）
  app: string
  earned: number
}

export interface CoinState {
  balance: number // 現在の残高（使うと減る）
  lifetime: number // 累計獲得（単調増加。相棒の経験値に使う）
  log: CoinLogEntry[]
  lastEarn?: string // `${app}@${epoch秒}` — 同一秒の重複 earn を無視するガード
}

const DEFAULT_STATE: CoinState = { balance: 0, lifetime: 0, log: [] }

export function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function coinsKey(): string {
  return getDataKey(STORAGE_KEYS.COINS)
}

/** 壊れたJSONや負数が入っていてもクラッシュせずに正規化して返す */
export function loadCoins(): CoinState {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE, log: [] }
  const raw = parseStorage<Partial<CoinState> | null>(coinsKey(), null)
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_STATE, log: [] }
  const num = (v: unknown): number =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0
  return {
    balance: num(raw.balance),
    lifetime: num(raw.lifetime),
    log: Array.isArray(raw.log)
      ? raw.log.filter(
          (e): e is CoinLogEntry =>
            !!e && typeof e.d === 'string' && typeof e.app === 'string' && typeof e.earned === 'number',
        )
      : [],
    lastEarn: typeof raw.lastEarn === 'string' ? raw.lastEarn : undefined,
  }
}

function saveCoins(state: CoinState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(coinsKey(), JSON.stringify(state))
  } catch {
    // 容量超過等はサイレントスキップ（ゲームを止めない）
  }
}

/** 直近30日より古いログを落とす（d は YYYY-MM-DD なので文字列比較でよい） */
function pruneLog(log: CoinLogEntry[]): CoinLogEntry[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - LOG_DAYS)
  const m = String(cutoff.getMonth() + 1).padStart(2, '0')
  const day = String(cutoff.getDate()).padStart(2, '0')
  const cutoffStr = `${cutoff.getFullYear()}-${m}-${day}`
  return log.filter((e) => e.d >= cutoffStr)
}

/** earn 系の共通処理: ガード・残高/累計加算・日付×アプリのログ集計・保存 */
function addEarned(app: string, earned: number): number {
  const state = loadCoins()
  const guard = `${app}@${Math.floor(Date.now() / 1000)}`
  if (state.lastEarn === guard) return 0
  state.balance += earned
  state.lifetime += earned
  state.lastEarn = guard
  const d = todayStr()
  const entry = state.log.find((e) => e.d === d && e.app === app)
  if (entry) entry.earned += earned
  else state.log.push({ d, app, earned })
  state.log = pruneLog(state.log)
  saveCoins(state)
  return earned
}

/**
 * コインを獲得する（1正解=1コイン + セッションボーナス5コイン）。
 * 同一秒×同一アプリの重複呼び出しは無視（連打・二重発火ガード）。
 * @returns 実際に付与したコイン数（ガードで弾いた場合は 0）
 */
export function earnCoins(app: string, correctCount: number): number {
  if (typeof window === 'undefined') return 0
  try {
    return addEarned(app, Math.max(0, Math.floor(correctCount)) + SESSION_BONUS)
  } catch {
    return 0
  }
}

/**
 * 固定額のコイン付与（ミッション報酬等）。SESSION_BONUS を足さない。
 * 複数報酬は呼び出し側で合算して1回で渡すこと（同一秒ガードで2回目が落ちるため）。
 */
export function grantCoins(app: string, amount: number): number {
  if (typeof window === 'undefined') return 0
  if (!Number.isFinite(amount) || amount <= 0) return 0
  try {
    return addEarned(app, Math.floor(amount))
  } catch {
    return 0
  }
}

/** コインを使う。残高不足なら false（減らさない） */
export function spendCoins(amount: number): boolean {
  if (typeof window === 'undefined') return false
  if (!Number.isFinite(amount) || amount <= 0) return false
  try {
    const state = loadCoins()
    if (state.balance < amount) return false
    state.balance -= Math.floor(amount)
    saveCoins(state)
    return true
  } catch {
    return false
  }
}

/** 指定日（省略時は今日）に獲得したコイン数。app 指定でアプリ別集計（C-2 ミッション用） */
export function coinsEarnedOn(date?: string, app?: string): number {
  const d = date ?? todayStr()
  return loadCoins()
    .log.filter((e) => e.d === d && (app === undefined || e.app === app))
    .reduce((sum, e) => sum + e.earned, 0)
}
