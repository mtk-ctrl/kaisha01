// きょうのミッション3つ（Phase C-2）
// 開いた瞬間「今日はこの3つ」が決まっている日課ユニット。「選ぶ疲れ」の排除が目的。
// - 日替わり: 日付シードの決定的選択（同日内は何度開いても同じ3つ）
// - 達成判定: そのアプリで当日コインを earn したか（coinsEarnedOn）。開いただけでは達成にならない
// - 報酬: 1ミッション +🪙5 / 3つ全達成でさらに +🪙15（claimed/allClaimed で重複付与ガード）
// - Phase D（AIつまずき診断）への置き換え境界は generateMissions()。選定ロジックだけ差し替えられる

import { getDataKey, parseStorage } from './storage'
import { STORAGE_KEYS } from './storageKeys'
import { loadCoins, coinsEarnedOn, grantCoins, todayStr } from './coins'

export const MISSION_REWARD = 5
export const ALL_CLEAR_BONUS = 15
/** ボーナス付与時にコインログへ記録するアプリ名 */
export const MISSION_COIN_APP = 'mission'

export type MissionSlot = 'tsuzuki' | 'fukushu' | 'tanken' | 'osusume'

export interface Mission {
  id: MissionSlot
  app: string
  title: string
  emoji: string
  reward: number
  done: boolean
  claimed: boolean // +5 付与済みフラグ（重複付与ガード）
}

export interface MissionsState {
  date: string // YYYY-MM-DD（ローカル日付）
  missions: Mission[]
  allClaimed: boolean // 全達成ボーナス +15 付与済みフラグ
}

export interface MissionRefreshResult {
  state: MissionsState
  earnedNow: number // 今回のリフレッシュで付与したコイン（演出用）
  justAllCleared: boolean // 今回のリフレッシュで全達成になった（演出用）
}

// ─────────────────────────────────────────
// ミッション候補カタログ
// - app はコインログのアプリ名（= saveScore の appId）と一致させること
// - juku（中受算数）と TANQ理科 は saveScore 未接続のため達成検知できず、候補から除外
// - explore=false: ③たんけん枠（未プレイのおすすめ）には出さない（就学前向け等）。
//   ログにあれば ①つづき/②ふくしゅう枠には出る
// - guest=true: ゲストでも遊べるアプリ（ゲスト時はこれだけから選ぶ）
// ─────────────────────────────────────────
interface MissionApp {
  app: string
  name: string // ひらがな主体（小1でも読める）
  emoji: string
  url: string
  juken?: boolean // 中学受験系（文言が「とりくもう」になる・たんけん枠で優先=/juken導線）
  explore?: boolean
  guest?: boolean
  earnApps?: string[] // コインログ上のアプリ名が複数あるとき（省略時は [app]）
}

const MISSION_APPS: MissionApp[] = [
  // ── 小学生向け ──
  { app: 'math',      name: 'けいさんチャレンジ',     emoji: '🔢', url: '/apps/math',      guest: true,  explore: true },
  { app: 'kanji',     name: 'かんじマスター',         emoji: '📖', url: '/apps/kanji',     guest: true,  explore: true },
  { app: 'thinking',  name: 'かんがえるジム',         emoji: '🧩', url: '/apps/thinking',  guest: true,  explore: true },
  { app: 'kuku',      name: 'くくマスター',           emoji: '✖️', url: '/apps/kuku',      guest: true,  explore: true },
  { app: 'word-math', name: 'さんすう ぶんしょうだい', emoji: '📐', url: '/apps/word-math', guest: true,  explore: true },
  { app: 'bunsuu',    name: 'ぶんすう',               emoji: '🍕', url: '/apps/bunsuu',    guest: true,  explore: true },
  { app: 'clock',     name: 'とけい',                 emoji: '🕐', url: '/apps/clock',     guest: false, explore: true },
  { app: 'romaji',    name: 'ローマじ',               emoji: '🔠', url: '/apps/romaji',    guest: true,  explore: true },
  { app: 'english',   name: 'えいご',                 emoji: '🌍', url: '/apps/english',   guest: false, explore: true },
  { app: 'shapes',    name: 'ずけい',                 emoji: '🔷', url: '/apps/shapes',    guest: false, explore: true },
  { app: 'coding',    name: 'プログラミング',         emoji: '💻', url: '/apps/coding',    guest: false, explore: true },
  { app: 'koubai',    name: 'こうばいすう',           emoji: '🔢', url: '/apps/koubai',    guest: true,  explore: true },
  { app: 'todofuken', name: 'とどうふけんマスター',   emoji: '🗾', url: '/apps/todofuken', guest: true,  explore: true,
    earnApps: ['todofuken-capital', 'todofuken-famous', 'todofuken-shape'] },
  { app: 'youji-zokusei',  name: 'しわけこうじょう',   emoji: '🏭', url: '/apps/youji-zokusei',  guest: true, explore: true },
  { app: 'youji-hiragana', name: 'にたもじ どっち？', emoji: '🔤', url: '/apps/youji-hiragana', guest: true, explore: false },
  // ── 中学受験（③たんけん枠で優先・文言は「とりくもう」）──
  { app: 'kokugo',  name: 'こくご〈ことば〉',   emoji: '📖', url: '/apps/kokugo',  juken: true, guest: false, explore: true },
  { app: 'kanyo',   name: 'かんようく',         emoji: '🗣️', url: '/apps/kanyo',   juken: true, guest: false, explore: true },
  { app: 'yoji',    name: 'よじじゅくご',       emoji: '📝', url: '/apps/yoji',    juken: true, guest: false, explore: true },
  { app: 'dokkai',  name: 'こくご〈どっかい〉', emoji: '📚', url: '/apps/dokkai',  juken: true, guest: false, explore: true },
  { app: 'science', name: 'りか',               emoji: '⚗️', url: '/apps/science', juken: true, guest: false, explore: true },
  { app: 'rekishi', name: 'れきし',             emoji: '🏛️', url: '/apps/rekishi', juken: true, guest: false, explore: true },
  { app: 'chiri',   name: 'ちり〈地形と気候〉',  emoji: '🗺️', url: '/apps/chiri',   juken: true, guest: false, explore: true },
  { app: 'koumin',  name: 'こうみん',            emoji: '⚖️', url: '/apps/koumin',  juken: true, guest: false, explore: true },
  // ── 就学前向け（ログにあれば つづき/ふくしゅう枠に出る。たんけん枠には出さない）──
  { app: 'thinking-youji', name: 'ようちえん かんがえるジム', emoji: '🐰', url: '/apps/thinking-youji', guest: true, explore: false },
  { app: 'youji-iro',      name: 'いろと かたち',             emoji: '🌈', url: '/apps/youji-iro',      guest: true, explore: false },
  { app: 'youji-math',     name: 'かずあそび',                emoji: '🍎', url: '/apps/youji-math',     guest: true, explore: false },
  { app: 'youji-kanji',    name: 'はじめての かんじ',         emoji: '📚', url: '/apps/youji-kanji',    guest: true, explore: false },
  { app: 'youji-clock',    name: 'なんじかな？',              emoji: '🕑', url: '/apps/youji-clock',    guest: true, explore: false },
  { app: 'youji-animals',  name: 'どうぶつ さんすう',         emoji: '🐾', url: '/apps/youji-animals',  guest: true, explore: false },
  { app: 'youji-katakana', name: 'カタカナ れんしゅう',       emoji: '🔡', url: '/apps/youji-katakana', guest: true, explore: false },
  { app: 'youji-juucombo', name: '10になる かずさがし',       emoji: '🔟', url: '/apps/youji-juucombo', guest: true, explore: false },
]

/** 初回（ログが全くない日）の固定おすすめ3つ */
const FIRST_TIME_APPS = ['math', 'kanji', 'thinking']

function findApp(app: string): MissionApp | undefined {
  return MISSION_APPS.find((a) => a.app === app)
}

/** ミッション行タップで遷移する先（カタログ外のappが残っていても/labに留まる） */
export function missionUrl(app: string): string {
  return findApp(app)?.url ?? '/lab'
}

// ─────────────────────────────────────────
// 日替わり生成
// ─────────────────────────────────────────

/** 日付文字列 → 決定的な非負整数シード */
function dateSeed(date: string): number {
  let h = 0
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) >>> 0
  return h
}

function daysAgoStr(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

/** 誘い文（命令形にしない・ひらがな主体・短く） */
function missionTitle(slot: MissionSlot, a: MissionApp): string {
  if (slot === 'tsuzuki') return a.juken ? `きょうも ${a.name}に とりくもう` : `きょうも ${a.name}で あそぼう`
  if (slot === 'fukushu') return a.juken ? `ひさしぶりに ${a.name}に とりくもう` : `ひさしぶりに ${a.name}で あそぼう`
  if (slot === 'tanken') return a.juken ? `あたらしい ${a.name}に とりくんでみよう` : `はじめての ${a.name}で あそんでみよう`
  return a.juken ? `${a.name}に 1かい とりくもう` : `${a.name}で 1かい あそぼう`
}

function toMission(slot: MissionSlot, a: MissionApp): Mission {
  return {
    id: slot,
    app: a.app,
    title: missionTitle(slot, a),
    emoji: a.emoji,
    reward: MISSION_REWARD,
    done: false,
    claimed: false,
  }
}

/**
 * 日替わりミッション3つを決定的に生成する。
 * ① つづき: 直近7日に earn したアプリ
 * ② ふくしゅう: 記録があるうち earn が最も古いもの（=久しぶり枠）。①とは別
 * ③ たんけん: earn ログにないアプリ。中受系を優先（/juken 導線）
 * 足りない枠は固定おすすめ（計算・漢字・かんがえるジム）で補充。
 * ※ Phase D ではこの関数を AIつまずき診断ベースの選定に置き換える。
 */
function generateMissions(date: string): Mission[] {
  const seed = dateSeed(date)
  const isGuest =
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.LAB_AUTH) === 'guest'
  const catalog = MISSION_APPS.filter((a) => !isGuest || a.guest)

  // コインログをカタログのアプリ単位に集約（最後に earn した日）
  const lastEarn = new Map<string, string>()
  for (const e of loadCoins().log) {
    const entry = catalog.find((a) => (a.earnApps ?? [a.app]).includes(e.app))
    if (!entry) continue
    const prev = lastEarn.get(entry.app)
    if (!prev || e.d > prev) lastEarn.set(entry.app, e.d)
  }

  const picked: { slot: MissionSlot; entry: MissionApp }[] = []
  const used = new Set<string>()
  const add = (slot: MissionSlot, entry: MissionApp) => {
    picked.push({ slot, entry })
    used.add(entry.app)
  }

  // 初回（earn ログが全くない日）は固定のおすすめ3つ
  if (lastEarn.size === 0) {
    for (const id of FIRST_TIME_APPS) {
      const entry = catalog.find((a) => a.app === id)
      if (entry) add('osusume', entry)
    }
    for (const entry of catalog) {
      if (picked.length >= 3) break
      if (!used.has(entry.app)) add('osusume', entry)
    }
    return picked.slice(0, 3).map(({ slot, entry }) => toMission(slot, entry))
  }

  // ① つづき: 直近7日に earn したアプリから1つ
  const recentCut = daysAgoStr(7)
  const recent = catalog.filter((a) => (lastEarn.get(a.app) ?? '') >= recentCut)
  if (recent.length > 0) add('tsuzuki', pick(recent, seed))

  // ② ふくしゅう: 記録があるうち earn が最も古いもの（①と別）
  const played = catalog
    .filter((a) => lastEarn.has(a.app) && !used.has(a.app))
    .sort((a, b) => (lastEarn.get(a.app)! + a.app).localeCompare(lastEarn.get(b.app)! + b.app))
  if (played.length > 0) add('fukushu', played[0])

  // ③ たんけん: 未プレイのアプリ。中受系があれば優先（/juken への導線）
  const fresh = catalog.filter((a) => a.explore && !lastEarn.has(a.app) && !used.has(a.app))
  const freshJuken = fresh.filter((a) => a.juken)
  const pool = freshJuken.length > 0 ? freshJuken : fresh
  if (pool.length > 0) add('tanken', pick(pool, (seed >>> 3) + 7))

  // 補充: 固定おすすめ → それでも足りなければカタログ先頭から
  for (const id of FIRST_TIME_APPS) {
    if (picked.length >= 3) break
    const entry = catalog.find((a) => a.app === id && !used.has(a.app))
    if (entry) add('osusume', entry)
  }
  for (const entry of catalog) {
    if (picked.length >= 3) break
    if (!used.has(entry.app)) add('osusume', entry)
  }

  return picked.slice(0, 3).map(({ slot, entry }) => toMission(slot, entry))
}

// ─────────────────────────────────────────
// 永続化
// ─────────────────────────────────────────

function missionsKey(): string {
  return getDataKey(STORAGE_KEYS.MISSIONS)
}

function isValidMission(m: unknown): m is Mission {
  if (!m || typeof m !== 'object') return false
  const r = m as Partial<Mission>
  return (
    typeof r.id === 'string' &&
    typeof r.app === 'string' &&
    typeof r.title === 'string' &&
    typeof r.emoji === 'string' &&
    typeof r.reward === 'number' &&
    typeof r.done === 'boolean' &&
    typeof r.claimed === 'boolean'
  )
}

/** 壊れたJSON・古い日付・形の崩れは null（=再生成）にする */
function loadState(today: string): MissionsState | null {
  const raw = parseStorage<Partial<MissionsState> | null>(missionsKey(), null)
  if (!raw || typeof raw !== 'object') return null
  if (raw.date !== today) return null
  if (!Array.isArray(raw.missions) || raw.missions.length !== 3) return null
  if (!raw.missions.every(isValidMission)) return null
  return {
    date: raw.date,
    missions: raw.missions as Mission[],
    allClaimed: raw.allClaimed === true,
  }
}

function saveState(state: MissionsState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(missionsKey(), JSON.stringify(state))
  } catch {
    // 容量超過等はサイレントスキップ
  }
}

/**
 * /lab 表示時に呼ぶメインエントリ。
 * 今日のミッションを用意（日付が変わっていれば再生成）→ コインログで達成判定 →
 * 未付与の報酬を合算して1回で付与（'mission' 名でコインログに残る）→ 保存。
 */
export function refreshMissions(): MissionRefreshResult {
  const empty: MissionRefreshResult = {
    state: { date: '', missions: [], allClaimed: false },
    earnedNow: 0,
    justAllCleared: false,
  }
  if (typeof window === 'undefined') return empty
  try {
    const today = todayStr()
    const state =
      loadState(today) ?? { date: today, missions: generateMissions(today), allClaimed: false }

    let bonus = 0
    for (const m of state.missions) {
      const earnApps = findApp(m.app)?.earnApps ?? [m.app]
      m.done = earnApps.some((id) => coinsEarnedOn(today, id) > 0)
      if (m.done && !m.claimed) {
        m.claimed = true
        bonus += m.reward
      }
    }

    let justAllCleared = false
    const allDone = state.missions.length === 3 && state.missions.every((m) => m.done)
    if (allDone && !state.allClaimed) {
      state.allClaimed = true
      justAllCleared = true
      bonus += ALL_CLEAR_BONUS
    }

    if (bonus > 0) grantCoins(MISSION_COIN_APP, bonus)
    saveState(state)
    return { state, earnedNow: bonus, justAllCleared }
  } catch {
    return empty
  }
}
