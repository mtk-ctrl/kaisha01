'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { KANJI_DATA } from '@/data/kanjiData'
import type { Grade, KanjiEntry } from '@/data/kanjiData'
import { playCorrect, playWrong } from '@/lib/audio'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

type QuestionFormat = 'k2r' | 'r2k'

// Light-theme grade colors (contrast-adjusted for cream background)
const GRADE_COLORS: Record<Grade, string> = {
  '小1': '#16a34a', '小2': '#0d9488', '小3': '#2563eb',
  '小4': '#7c3aed', '小5': '#ca8a04', '小6': '#dc2626',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── 形が似ていて混同しやすい漢字グループ（誤答の選択肢に優先して混ぜ、弁別学習にする）──
const SIMILAR_GROUPS: string[][] = [
  ['土', '士'], ['未', '末'], ['人', '入'], ['大', '犬', '太'], ['王', '玉'],
  ['日', '目'], ['白', '百'], ['千', '干'], ['牛', '午'], ['右', '石'],
  ['貝', '見'], ['休', '体'], ['木', '本'], ['田', '由', '申'], ['天', '夫'],
  ['間', '問', '聞'], ['持', '待'], ['住', '注', '往'], ['遠', '園'], ['学', '字'],
  ['名', '各'], ['島', '鳥'], ['雪', '雲'], ['買', '貸'], ['績', '積', '責'],
  ['複', '復', '腹'], ['識', '職', '織'], ['設', '説'], ['仮', '反'], ['矢', '失'],
  ['少', '小'], ['力', '刀'], ['池', '地'], ['作', '昨'], ['科', '料'],
  ['官', '管'], ['険', '検', '験'], ['測', '側'], ['清', '晴', '精'], ['象', '像'],
  ['判', '半'], ['券', '巻'], ['暑', '署'], ['境', '鏡'], ['汽', '気'],
]
const SIMILAR_KANJI: Record<string, string[]> = {}
for (const group of SIMILAR_GROUPS) {
  for (const k of group) SIMILAR_KANJI[k] = group.filter(x => x !== k)
}

// ── SRS (Spaced Repetition) ──
const SRS_KEY = 'tanq_kanji_srs_v1'
const STREAK_KEY = 'tanq_kanji_streak_v1'
const SESSION_SIZE = 12

interface ItemState {
  b: 0 | 1 | 2   // bucket: 0=未学習, 1=学習中, 2=習得
  c: number       // 連続正解数
  s: number       // 出題回数
  ok: number      // 正解回数
  t: number       // 最終出題 timestamp
}
type SRSStore = Record<string, ItemState>

function loadSRS(): SRSStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(SRS_KEY)) || '{}') } catch { return {} }
}
function saveSRS(store: SRSStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getDataKey(SRS_KEY), JSON.stringify(store))
}
function getStreakCount(): number {
  if (typeof window === 'undefined') return 0
  try { return JSON.parse(localStorage.getItem(getDataKey(STREAK_KEY)) || '{"n":0}').n } catch { return 0 }
}
function recordStudy(): number {
  if (typeof window === 'undefined') return 0
  const today = new Date().toISOString().slice(0, 10)
  try {
    const d = JSON.parse(localStorage.getItem(getDataKey(STREAK_KEY)) || '{"n":0,"d":""}')
    if (d.d === today) return d.n
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const n = d.d === y ? d.n + 1 : 1
    localStorage.setItem(getDataKey(STREAK_KEY), JSON.stringify({ n, d: today }))
    return n
  } catch { return 1 }
}

function gradeStats(grade: Grade, store: SRSStore) {
  let mastered = 0, learning = 0, newCount = 0
  for (const item of KANJI_DATA[grade]) {
    const s = store[item.kanji]
    if (!s || s.b === 0) newCount++
    else if (s.b === 1) learning++
    else mastered++
  }
  return { mastered, learning, newCount, total: KANJI_DATA[grade].length }
}

function buildSession(grade: Grade, store: SRSStore, mode: 'normal' | 'weak'): KanjiEntry[] {
  const all = KANJI_DATA[grade]
  if (mode === 'weak') {
    const weak = all.filter(k => !store[k.kanji] || store[k.kanji].b < 2)
    return shuffle(weak.length >= 3 ? weak : all).slice(0, SESSION_SIZE)
  }
  const now = Date.now()
  const overdue = all.filter(k => store[k.kanji]?.b === 2 && now - store[k.kanji].t > 7 * 86400000)
  const learning = all.filter(k => store[k.kanji]?.b === 1)
  const newItems = all.filter(k => !store[k.kanji] || store[k.kanji].b === 0)
  return shuffle([
    ...shuffle(overdue).slice(0, 3),
    ...shuffle(learning).slice(0, 7),
    ...shuffle(newItems),
  ]).slice(0, SESSION_SIZE)
}

interface Question { fmt: QuestionFormat; item: KanjiEntry; correct: string; choices: string[] }

function getFullReading(item: KanjiEntry): string {
  return item.reading + (item.okurigana || '')
}

function pick4Unique(correct: string, candidates: string[]): string[] {
  const seen = new Set([correct])
  const others: string[] = []
  for (const c of candidates) {
    if (others.length === 3) break
    if (!seen.has(c)) { seen.add(c); others.push(c) }
  }
  return shuffle([correct, ...others])
}

// 全学年の漢字→エントリ（形似字は学年をまたいで誤答候補に使う）
const KANJI_BY_CHAR = new Map<string, KanjiEntry>()
for (const entries of Object.values(KANJI_DATA)) {
  for (const e of entries) if (!KANJI_BY_CHAR.has(e.kanji)) KANJI_BY_CHAR.set(e.kanji, e)
}

// 誤答候補（学年プール + 形似字）を重複なしで集める
function gatherCandidates(item: KanjiEntry, pool: KanjiEntry[]): { candidates: KanjiEntry[]; simSet: Set<string> } {
  const similar = SIMILAR_KANJI[item.kanji] || []
  const simSet = new Set(similar)
  const map = new Map<string, KanjiEntry>()
  for (const k of pool) if (k.kanji !== item.kanji) map.set(k.kanji, k)
  for (const c of similar) {
    const e = KANJI_BY_CHAR.get(c)
    if (e) map.set(e.kanji, e)
  }
  return { candidates: Array.from(map.values()), simSet }
}

function makeQuestion(item: KanjiEntry, pool: KanjiEntry[]): Question {
  const fmt: QuestionFormat = Math.random() < 0.65 ? 'k2r' : 'r2k'
  const { candidates, simSet } = gatherCandidates(item, pool)
  const reading = getFullReading(item)
  if (fmt === 'k2r') {
    // 誤答: 形が似た字の読み ＞ 最初の音が同じ読み ＞ 同じ長さの読み（「読み間違いあるある」を再現）
    const ranked = candidates
      .map(k => {
        const r = getFullReading(k)
        let score = Math.random()
        if (simSet.has(k.kanji)) score += 4
        if (r !== reading && r[0] === reading[0]) score += 2.5
        if (r.length === reading.length) score += 1
        return { r, score }
      })
      .sort((a, b) => b.score - a.score)
      .map(c => c.r)
    return { fmt, item, correct: reading, choices: pick4Unique(reading, ranked) }
  }
  // 誤答: 形が似た字 ＞ 同音異字 ＞ 最初の音が同じ字（見分ける練習になる）
  const ranked = candidates
    .map(k => {
      let score = Math.random()
      if (simSet.has(k.kanji)) score += 4
      const r = getFullReading(k)
      if (r === reading) score += 3
      else if (r[0] === reading[0]) score += 1.5
      return { c: k.kanji, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.c)
  return { fmt, item, correct: item.kanji, choices: pick4Unique(item.kanji, ranked) }
}

// 1回目のまちがいで出す「考える足場」ヒント（答えそのものは見せない）
function getHint(q: Question): string {
  if (q.fmt === 'k2r') {
    return `よみかたの さいしょの音は「${getFullReading(q.item)[0]}」だよ。`
  }
  if (q.item.example.includes(q.item.kanji)) {
    return `「${q.item.example.split(q.item.kanji).join('◯')}」の ◯ に入る字だよ。`
  }
  return 'かたちを よーく見くらべてみよう。'
}

function applySRS(store: SRSStore, key: string, correct: boolean, ms: number): {
  store: SRSStore; change: 'mastered' | 'advance' | 'same' | 'regress'
} {
  const old = store[key] || { b: 0, c: 0, s: 0, ok: 0, t: 0 }
  const fast = ms < 2500
  let b = old.b as number, c = old.c

  if (correct) {
    c = old.c + 1
    if (b === 0) { b = 1 }
    else if (b === 1 && fast && c >= 3) { b = 2 }
    else if (b === 2 && !fast) { b = 1 }
  } else {
    c = 0
    if (b === 2) b = 1
  }

  const entry: ItemState = { b: b as 0 | 1 | 2, c, s: old.s + 1, ok: old.ok + (correct ? 1 : 0), t: Date.now() }
  const newStore = { ...store, [key]: entry }
  let change: 'mastered' | 'advance' | 'same' | 'regress' = 'same'
  if (b > old.b) change = b === 2 ? 'mastered' : 'advance'
  else if (b < old.b) change = 'regress'
  return { store: newStore, change }
}

type Phase = 'home' | 'playing' | 'result' | 'overview'

const GRADES_ORDER: Grade[] = ['小1', '小2', '小3', '小4', '小5', '小6']

function isGuestUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('tanq-lab-auth') === 'guest'
}

const GUEST_GRADES: Grade[] = ['小1', '小2']

export default function KanjiQuiz() {
  const [phase, setPhase] = useState<Phase>('home')
  const [grade, setGrade] = useState<Grade>('小4')
  const [mode, setMode] = useState<'normal' | 'weak'>('normal')
  const [store, setStore] = useState<SRSStore>({})
  const [streak, setStreak] = useState(0)
  const [detailItem, setDetailItem] = useState<{ item: KanjiEntry; grade: Grade } | null>(null)

  const [questions, setQuestions] = useState<Question[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<0 | 1>(0)          // 0=1回目, 1=ヒントを見て再挑戦中
  const [firstWrong, setFirstWrong] = useState<string | null>(null) // 1回目に選んだまちがいの選択肢
  const [flashResult, setFlashResult] = useState<'correct' | 'wrong' | null>(null)
  const [lastMs, setLastMs] = useState(0)
  const [lastChange, setLastChange] = useState<'mastered' | 'advance' | 'same' | 'regress'>('same')
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionMastered, setSessionMastered] = useState(0)
  const [sessionWeak, setSessionWeak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)
  const qStartRef = useRef<number>(Date.now())

  useEffect(() => {
    setStore(loadSRS())
    setStreak(getStreakCount())
  }, [])

  useEffect(() => {
    if (phase === 'playing') qStartRef.current = Date.now()
  }, [qIdx, phase])

  const startGame = useCallback((g: Grade = grade, m: 'normal' | 'weak' = mode) => {
    const currentStore = loadSRS()
    setStore(currentStore)
    const items = buildSession(g, currentStore, m)
    setQuestions(items.map(item => makeQuestion(item, KANJI_DATA[g])))
    setQIdx(0)
    setSelected(null)
    setAttempt(0)
    setFirstWrong(null)
    setSessionCorrect(0)
    setSessionMastered(0)
    setSessionWeak(0)
    qStartRef.current = Date.now()
    setGrade(g)
    setMode(m)
    setPhase('playing')
  }, [grade, mode])

  function choose(c: string) {
    if (selected !== null) return
    if (c === firstWrong) return
    const q = questions[qIdx]
    const correct = c === q.correct
    correct ? playCorrect() : playWrong()
    setFlashResult(correct ? 'correct' : 'wrong')
    setTimeout(() => setFlashResult(null), 700)

    if (attempt === 0) {
      // スコア・SRSは初回解答のみで記録する（再挑戦で水増ししない）
      const ms = Date.now() - qStartRef.current
      setLastMs(ms)
      const { store: newStore, change } = applySRS(store, q.item.kanji, correct, ms)
      setStore(newStore)
      saveSRS(newStore)
      setLastChange(change)
      if (correct) {
        setSelected(c)
        setSessionCorrect(n => n + 1)
        if (change === 'mastered') setSessionMastered(n => n + 1)
      } else {
        // 1回目のまちがい: 答えは見せず、ヒントを出してもう一度考えてもらう
        setSessionWeak(n => n + 1)
        setFirstWrong(c)
        setAttempt(1)
      }
      return
    }

    // 2回目: 記録は変えず、答え合わせと覚え方の確認だけ行う
    setSelected(c)
  }

  function goNext() {
    setFlashResult(null)
    if (qIdx + 1 >= questions.length) {
      saveScore('kanji', sessionCorrect, questions.length, grade)
      const ns = recordStudy()
      setFinalStreak(ns)
      setStreak(ns)
      setPhase('result')
      return
    }
    setQIdx(i => i + 1)
    setSelected(null)
    setAttempt(0)
    setFirstWrong(null)
  }

  const color = GRADE_COLORS[grade]
  const stats = gradeStats(grade, store)

  // ── HOME ──
  if (phase === 'home') {
    const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0
    const studiedPct  = stats.total > 0 ? Math.round(((stats.mastered + stats.learning) / stats.total) * 100) : 0
    const isGuest = isGuestUser()
    return (
      <div className="min-h-screen bg-[#FFFEF7] text-[#3A2E2A] font-sans flex flex-col items-center px-6 py-16 pt-20">
        <Link href="/lab" className="absolute top-6 left-6 text-[#6B5A52] hover:text-[#3A2E2A] text-sm transition-colors">← ラボに戻る</Link>

        {streak > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FFC83D]/25 border-2 border-[#ca8a04] px-3 py-1.5 rounded-full shadow-[2px_2px_0_#3A2E2A]">
            <span>🔥</span>
            <span className="font-black text-[#ca8a04] text-sm">{streak}日連続</span>
          </div>
        )}

        <div className="text-5xl mb-2 mt-4">📖</div>
        <h1 className="text-3xl font-black mb-1 text-[#3A2E2A]">漢字クイズ</h1>
        <p className="text-[#6B5A52] text-xs mb-8 text-center">漢字→読み方 ＆ 読み方→漢字の2方向で練習。くり返しで、どんどん覚えられる！</p>

        {isGuest && (
          <div className="w-full max-w-sm mb-3 px-3 py-2 bg-[#FFC83D]/15 border-2 border-[#ca8a04] rounded-xl">
            <p className="text-[#ca8a04] text-xs font-bold">体験中: 小1・小2のみ使えます</p>
            <Link href="/register" className="text-[#7c3aed] text-[10px] hover:underline">無料登録すると全学年解放 →</Link>
          </div>
        )}

        {/* Grade selector */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm mb-5">
          {(Object.keys(KANJI_DATA) as Grade[]).map((g) => {
            const gs = gradeStats(g, store)
            const pct  = gs.total > 0 ? Math.round((gs.mastered / gs.total) * 100) : 0
            const spct = gs.total > 0 ? Math.round(((gs.mastered + gs.learning) / gs.total) * 100) : 0
            const sel = g === grade
            const locked = isGuest && !GUEST_GRADES.includes(g)
            if (locked) {
              return (
                <div key={g} className="py-3 px-2 rounded-xl text-sm text-center opacity-40 bg-[#3A2E2A]/5 border border-[#3A2E2A]/15 cursor-not-allowed">
                  🔒 {g}
                  <div className="text-[10px] mt-0.5">登録で解放</div>
                </div>
              )
            }
            return (
              <button key={g} onClick={() => setGrade(g)}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${sel ? 'scale-105 text-white' : 'text-[#6B5A52] hover:text-[#3A2E2A] bg-white border border-[#3A2E2A]/15 hover:border-[#3A2E2A]/30'}`}
                style={sel ? { background: GRADE_COLORS[g], border: '2px solid #3A2E2A', boxShadow: '3px 3px 0 #3A2E2A' } : {}}>
                {g}
                <div className="text-[10px] font-normal mt-0.5 flex justify-center gap-1">
                  <span style={{ color: sel ? 'rgba(255,255,255,0.95)' : GRADE_COLORS[g] }}>⭐{pct}%</span>
                  <span style={{ color: sel ? 'rgba(255,255,255,0.7)' : '#6B5A52' }}>📚{spct}%</span>
                </div>
              </button>
            )
          })}
        </div>

        {stats.mastered === 0 && stats.learning === 0 && (
          <div className="w-full max-w-sm mb-3 px-3 py-2 bg-[#EFE8FF] border-2 border-[#7c3aed] rounded-xl shadow-[2px_2px_0_#3A2E2A]">
            <p className="text-[#7c3aed] text-xs font-bold text-center">✨ まずは12問チャレンジしてみよう！</p>
          </div>
        )}

        {/* Grade progress */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-4 mb-5 border-2 border-[#3A2E2A]/15 shadow-[2px_2px_0_rgba(58,46,42,0.12)]">
          <div className="flex justify-between text-xs text-[#6B5A52] mb-2">
            <span>{grade}の漢字 {stats.total}字</span>
            <div className="flex gap-2">
              <span style={{ color }}>⭐ {masteredPct}% 習得</span>
              <span className="text-[#6B5A52]">📚 {studiedPct}% 学習中</span>
            </div>
          </div>
          {/* Dual progress bar: faint = studied, solid = mastered */}
          <div className="h-2.5 bg-[#3A2E2A]/8 rounded-full overflow-hidden mb-3 relative">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 opacity-30"
              style={{ width: `${studiedPct}%`, background: color }} />
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${masteredPct}%`, background: color }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-black text-xl" style={{ color }}>{stats.mastered}</div>
              <div className="text-[#6B5A52] text-[10px]">⭐ 習得済み</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#2563eb]">{stats.learning}</div>
              <div className="text-[#6B5A52] text-[10px]">📚 学習中</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#3A2E2A]">{stats.newCount}</div>
              <div className="text-[#6B5A52] text-[10px]">🆕 未学習</div>
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="flex w-full max-w-sm gap-3 mb-1">
          {(['normal', 'weak'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === m ? 'text-white' : 'text-[#6B5A52] bg-white border border-[#3A2E2A]/15 hover:border-[#3A2E2A]/30'}`}
              style={mode === m ? { background: color, border: '2px solid #3A2E2A', boxShadow: '2px 2px 0 #3A2E2A' } : {}}>
              {m === 'normal' ? '📚 通常モード' : '💪 苦手集中'}
            </button>
          ))}
        </div>
        <p className="text-[#6B5A52] text-[10px] w-full max-w-sm text-center mb-4">
          {mode === 'normal' ? 'バランスよく新しい漢字と復習を混ぜて出題' : '間違えた漢字・学習中の漢字を集中して出題'}
        </p>

        <button onClick={() => setPhase('overview')}
          className="w-full max-w-sm py-3 rounded-xl font-bold text-sm bg-white border-2 border-[#3A2E2A]/20 text-[#6B5A52] hover:text-[#3A2E2A] hover:border-[#3A2E2A]/40 transition-all mb-3 shadow-[2px_2px_0_rgba(58,46,42,0.10)]">
          🗾 全漢字マップを見る
        </button>

        <button onClick={() => startGame(grade, mode)}
          className="w-full max-w-sm py-5 rounded-2xl font-black text-xl text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: color, border: '2px solid #3A2E2A', boxShadow: '4px 4px 0 #3A2E2A' }}>
          スタート！（{SESSION_SIZE}問）
        </button>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    const total = questions.length
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const rank = acc >= 90 ? '🏆 完璧！' : acc >= 70 ? '🥇 すごい！' : acc >= 50 ? '🥈 よくできた' : '🥉 もう一回！'
    const newStats = gradeStats(grade, store)
    const newPct = newStats.total > 0 ? Math.round((newStats.mastered / newStats.total) * 100) : 0
    return (
      <div className="min-h-screen bg-[#FFFEF7] text-[#3A2E2A] font-sans flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="text-5xl mb-2">{rank.split(' ')[0]}</div>
        <h2 className="text-2xl font-black mb-3" style={{ color }}>{rank.split(' ').slice(1).join(' ')}</h2>

        {finalStreak > 0 && (
          <div className="flex items-center gap-2 bg-[#FFC83D]/25 border-2 border-[#ca8a04] px-4 py-2 rounded-full mb-4 shadow-[2px_2px_0_#3A2E2A]">
            <span>🔥</span>
            <span className="font-black text-[#ca8a04]">{finalStreak}日連続達成！</span>
          </div>
        )}

        <div className="text-7xl font-black mb-1" style={{ color }}>{acc}%</div>
        <p className="text-[#6B5A52] text-sm mb-6">{total}問中 {sessionCorrect}問正解</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-5">
          <div className="bg-white rounded-2xl p-3 border-2 border-[#3A2E2A]/15 text-center shadow-[2px_2px_0_rgba(58,46,42,0.12)]">
            <div className="text-2xl font-black mb-1" style={{ color }}>⭐ {sessionMastered}</div>
            <div className="text-[#6B5A52] text-xs">新規習得</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border-2 border-[#3A2E2A]/15 text-center shadow-[2px_2px_0_rgba(58,46,42,0.12)]">
            <div className="text-2xl font-black text-[#16a34a] mb-1">{sessionCorrect}</div>
            <div className="text-[#6B5A52] text-xs">正解数</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border-2 border-[#3A2E2A]/15 text-center shadow-[2px_2px_0_rgba(58,46,42,0.12)]">
            <div className="text-2xl font-black text-[#dc2626] mb-1">{sessionWeak}</div>
            <div className="text-[#6B5A52] text-xs">要復習</div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl p-4 mb-6 border-2 border-[#3A2E2A]/15 shadow-[2px_2px_0_rgba(58,46,42,0.12)]">
          <div className="flex justify-between text-xs text-[#6B5A52] mb-2">
            <span>{grade}の累計習得状況</span>
            <span style={{ color }}>{newPct}%</span>
          </div>
          <div className="h-2 bg-[#3A2E2A]/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${newPct}%`, background: color }} />
          </div>
          <p className="text-xs text-[#6B5A52] mt-2">習得済み {newStats.mastered}/{newStats.total}字</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => startGame(grade, mode)}
            className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-[1.02]"
            style={{ background: color, border: '2px solid #3A2E2A', boxShadow: '3px 3px 0 #3A2E2A' }}>もう一回！</button>
          {sessionWeak > 0 && (
            <button onClick={() => startGame(grade, 'weak')}
              className="w-full py-4 rounded-2xl font-bold text-base bg-[#FFE3EE] border-2 border-[#dc2626] text-[#dc2626] hover:bg-[#FFD0DC] transition-all shadow-[2px_2px_0_#3A2E2A]">
              💪 苦手 {sessionWeak}問を集中練習
            </button>
          )}
          <button onClick={() => setPhase('home')}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white border-2 border-[#3A2E2A]/20 text-[#6B5A52] hover:text-[#3A2E2A] transition-all">
            学年・モードを変える
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-base bg-white border-2 border-[#3A2E2A]/15 text-[#6B5A52] hover:text-[#3A2E2A] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  // ── OVERVIEW ──
  if (phase === 'overview') {
    const totalMastered = GRADES_ORDER.reduce((sum, g) => sum + gradeStats(g, store).mastered, 0)
    const totalKanji = GRADES_ORDER.reduce((sum, g) => sum + KANJI_DATA[g].length, 0)
    return (
      <div className="min-h-screen bg-[#FFFEF7] text-[#3A2E2A] font-sans">
        <div className="sticky top-0 bg-[#FFFEF7]/95 backdrop-blur-sm z-20 px-5 py-4 border-b-2 border-[#3A2E2A]/10">
          <button onClick={() => setPhase('home')} className="text-[#6B5A52] hover:text-[#3A2E2A] text-sm transition-colors">← ホームに戻る</button>
          <div className="mt-1 flex items-baseline gap-2">
            <h1 className="text-lg font-black text-[#3A2E2A]">🗾 全漢字マップ</h1>
            <span className="text-xs text-[#6B5A52]">{totalMastered}/{totalKanji}字 習得済み</span>
          </div>
        </div>

        <div className="px-4 py-5 pb-24 space-y-7">
          {GRADES_ORDER.map(g => {
            const gs = gradeStats(g, store)
            const pct  = gs.total > 0 ? Math.round((gs.mastered / gs.total) * 100) : 0
            const spct = gs.total > 0 ? Math.round(((gs.mastered + gs.learning) / gs.total) * 100) : 0
            const gColor = GRADE_COLORS[g]
            return (
              <div key={g}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm" style={{ color: gColor }}>{g}</span>
                  <span className="text-[10px] text-[#6B5A52]">⭐{gs.mastered}/{gs.total}字 &nbsp;📚{spct}%学習中</span>
                </div>
                <div className="h-1.5 bg-[#3A2E2A]/8 rounded-full overflow-hidden mb-2.5 relative">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 opacity-30"
                    style={{ width: `${spct}%`, background: gColor }} />
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: gColor }} />
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {KANJI_DATA[g].map(item => {
                    const s = store[item.kanji]
                    const b = s?.b ?? 0
                    let cellStyle: React.CSSProperties
                    if (b === 2) {
                      cellStyle = { background: `${gColor}20`, border: `2px solid ${gColor}`, color: gColor }
                    } else if (b === 1) {
                      cellStyle = { background: `${gColor}12`, border: `1.5px solid ${gColor}60`, color: '#6B5A52' }
                    } else {
                      cellStyle = { background: 'rgba(58,46,42,0.04)', border: '1.5px solid rgba(58,46,42,0.10)', color: '#C0B4AC' }
                    }
                    return (
                      <button key={item.kanji} onClick={() => setDetailItem({ item, grade: g })}
                        className="relative aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                        style={cellStyle}>
                        {item.kanji}
                        {b === 2 && <span className="absolute -top-1 -right-1 text-[9px] leading-none">⭐</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail modal */}
        {detailItem && (() => {
          const { item, grade: dGrade } = detailItem
          const dColor = GRADE_COLORS[dGrade]
          const s = store[item.kanji]
          const b = s?.b ?? 0
          const statusLabel = b === 2 ? '⭐ 習得済み' : b === 1 ? '📚 学習中' : '🆕 未学習'
          const statusColor = b === 2 ? '#ca8a04' : b === 1 ? '#2563eb' : '#6B5A52'
          return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center"
              onClick={() => setDetailItem(null)}>
              <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm border-2 border-[#3A2E2A]/20 shadow-[4px_4px_0_rgba(58,46,42,0.15)]"
                onClick={e => e.stopPropagation()}>
                <div className="text-center mb-5">
                  <div className="text-[6rem] font-black leading-none mb-2" style={{ color: dColor }}>
                    {item.kanji}
                  </div>
                  <div className="flex items-baseline justify-center mb-3">
                    <span className="text-2xl font-black" style={{ color: dColor }}>{item.reading}</span>
                    {item.okurigana && (
                      <span className="text-lg font-bold text-[#6B5A52]">{item.okurigana}</span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border-2"
                    style={{ background: `${statusColor}12`, color: statusColor, borderColor: statusColor }}>
                    {statusLabel}
                  </span>
                </div>
                <div className="bg-[#FFFEF7] rounded-2xl p-4 mb-4 space-y-3 text-sm border border-[#3A2E2A]/10">
                  <div>
                    <p className="text-[#6B5A52] text-[10px] font-bold mb-0.5">意味</p>
                    <p className="text-[#3A2E2A] font-bold">{item.meaning}</p>
                  </div>
                  <div>
                    <p className="text-[#6B5A52] text-[10px] font-bold mb-0.5">例文</p>
                    <p style={{ color: dColor }}>{item.example}</p>
                  </div>
                  <div>
                    <p className="text-[#6B5A52] text-[10px] font-bold mb-0.5">覚え方のヒント</p>
                    <p className="text-[#3A2E2A] leading-relaxed">{item.tip}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setDetailItem(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-white border-2 border-[#3A2E2A]/20 text-[#6B5A52] hover:text-[#3A2E2A] transition-all">
                    閉じる
                  </button>
                  <button onClick={() => { setDetailItem(null); startGame(dGrade, 'normal') }}
                    className="flex-1 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-[1.02]"
                    style={{ background: dColor, border: '2px solid #3A2E2A', boxShadow: '2px 2px 0 #3A2E2A' }}>
                    この学年を練習 →
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    )
  }

  // ── PLAYING ──
  const q = questions[qIdx]
  if (!q) return null
  const isCorrect = selected === q.correct
  const solvedFirstTry = attempt === 0
  const isFast = lastMs > 0 && lastMs < 1500
  const isSlow = lastMs > 2500
  const isKanjiChoices = q.fmt === 'r2k'
  const isRetrying = attempt === 1 && selected === null
  // 「意味」に読みがそのまま含まれる字（例: 暗→「暗い・くらやみ」）は、答えるまで意味を隠す
  const meaningLeaks = q.fmt === 'k2r' && q.item.reading.length >= 2 && q.item.meaning.includes(q.item.reading)

  const changeColor = lastChange === 'mastered' ? '#ca8a04' : lastChange === 'advance' ? '#16a34a' : lastChange === 'regress' ? '#dc2626' : '#6B5A52'
  const changeMsg = lastChange === 'mastered' ? '⭐ 習得！' : lastChange === 'advance' ? '📈 いい調子！' : lastChange === 'regress' ? '📉 要復習' : null

  return (
    <div className="min-h-screen bg-[#FFFEF7] text-[#3A2E2A] font-sans flex flex-col items-center justify-center px-4 py-20">
      {flashResult && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <span className="text-[12rem] font-black leading-none"
            style={{
              color: flashResult === 'correct' ? '#16a34a' : '#dc2626',
              textShadow: flashResult === 'correct' ? '0 0 80px #16a34a50' : '0 0 80px #dc262650',
            }}>
            {flashResult === 'correct' ? '○' : '×'}
          </span>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#FFFEF7]/95 backdrop-blur-sm z-10 border-b border-[#3A2E2A]/10">
        <button onClick={() => setPhase('home')} className="text-[#6B5A52] hover:text-[#3A2E2A] text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#6B5A52]">{qIdx + 1} / {questions.length}</span>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-[#16a34a]">○ {sessionCorrect}</span>
          <span className="text-[#dc2626]">× {sessionWeak}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-[#3A2E2A]/8 z-10">
        <div className="h-full transition-all duration-500" style={{ width: `${(qIdx / questions.length) * 100}%`, background: color }} />
      </div>

      <div className="w-full max-w-sm text-center">
        {/* Format badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 border-2"
          style={{ background: `${color}12`, color, borderColor: color }}>
          {q.fmt === 'k2r' ? '漢字 → 読み方' : '読み方 → 漢字'}
          <span className="opacity-40">|</span>
          <span className="opacity-75">{grade}</span>
        </div>

        {/* Question */}
        {q.fmt === 'k2r' ? (
          <>
            <div className="text-[9rem] font-black leading-none mb-2 select-none"
              style={{ color: selected ? (isCorrect ? '#16a34a' : '#dc2626') : '#3A2E2A' }}>
              {q.item.kanji}
            </div>
            {(!meaningLeaks || selected !== null) && (
              <p className="text-[#6B5A52] text-sm mb-1">{q.item.meaning}</p>
            )}
            <p className="text-xs mb-5" style={{ color: `${color}bb` }}>例）{q.item.example}</p>
          </>
        ) : (
          <>
            <p className="text-[#6B5A52] text-xs mb-2 font-bold tracking-widest">この読み方の漢字は？</p>
            <div className="flex items-baseline justify-center mb-4 select-none">
              <span className="text-5xl font-black"
                style={{ color: selected ? (isCorrect ? '#16a34a' : '#dc2626') : color }}>
                {q.item.reading}
              </span>
              {q.item.okurigana && (
                <span className="text-3xl font-bold"
                  style={{ color: selected ? (isCorrect ? '#16a34a' : '#dc2626') : '#6B5A52' }}>
                  {q.item.okurigana}
                </span>
              )}
            </div>
            {selected !== null ? (
              <>
                <p className="text-[#6B5A52] text-sm mb-1">{q.item.meaning}</p>
                <p className="text-xs mb-4" style={{ color: `${color}bb` }}>例）{q.item.example}</p>
              </>
            ) : (
              <div className="mb-5" />
            )}
          </>
        )}

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {q.choices.map((c) => {
            const isCor = c === q.correct
            const isSel = c === selected
            const isFirstWrong = c === firstWrong
            let bg = '#FFFFFF'
            let border = 'rgba(58,46,42,0.15)'
            let textColor = '#3A2E2A'
            let opacity = 1
            if (selected !== null) {
              if (isCor) { bg = `${color}15`; border = color; textColor = color }
              else if (isSel || isFirstWrong) { bg = 'rgba(220,38,38,0.08)'; border = '#dc2626'; textColor = '#dc2626' }
            } else if (isFirstWrong) {
              // 1回目にまちがえた選択肢は消して、残りからもう一度考えてもらう
              bg = 'rgba(220,38,38,0.06)'; border = '#dc2626'; textColor = '#dc2626'; opacity = 0.45
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null || isFirstWrong}
                className="py-4 rounded-2xl font-bold transition-all hover:scale-[1.03] disabled:cursor-default disabled:hover:scale-100 select-none"
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  color: textColor,
                  opacity,
                  fontSize: isKanjiChoices ? '2.2rem' : '1.1rem',
                  lineHeight: isKanjiChoices ? '1' : '1.5',
                  minHeight: '64px',
                  boxShadow: selected === null && !isFirstWrong ? '2px 2px 0 rgba(58,46,42,0.10)' : 'none',
                }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* 1回目のまちがい: 答えは見せずヒントで再挑戦 */}
        {isRetrying && (
          <div className="rounded-2xl p-4 mb-4 text-left border-2 bg-[#FFC83D]/15" style={{ borderColor: '#ca8a04' }}>
            <p className="font-black text-sm mb-1 text-[#ca8a04]">💡 ヒント</p>
            <p className="text-[#3A2E2A] text-sm leading-relaxed">{getHint(q)}</p>
            <p className="text-[#6B5A52] text-xs mt-1.5">もういちど えらんでみよう！</p>
          </div>
        )}

        {/* Feedback */}
        {selected !== null && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold" style={{ color: solvedFirstTry && isFast && isCorrect ? '#ca8a04' : solvedFirstTry && isSlow ? '#6B5A52' : 'transparent' }}>
                {solvedFirstTry && isCorrect && isFast ? '⚡ 速い！' : solvedFirstTry && isCorrect && isSlow ? '🤔 ゆっくり' : ''}
              </span>
              {changeMsg && (
                <span className="text-sm font-bold" style={{ color: changeColor }}>{changeMsg}</span>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4 text-left border-2"
              style={{
                background: isCorrect ? `${color}10` : 'rgba(220,38,38,0.06)',
                borderColor: isCorrect ? color : '#dc2626',
              }}>
              <p className="font-black text-sm mb-1.5" style={{ color: isCorrect ? color : '#dc2626' }}>
                {isCorrect
                  ? `${solvedFirstTry ? '✓ 正解！' : '✓ できた！'}${q.fmt === 'k2r' ? `「${q.item.kanji}」＝「${getFullReading(q.item)}」` : `「${getFullReading(q.item)}」＝「${q.item.kanji}」`}`
                  : `おしい！正解は「${q.correct}」`
                }
              </p>
              <p className="text-[#3A2E2A] text-sm leading-relaxed">{q.item.tip}</p>
            </div>

            <button onClick={goNext}
              className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-[1.02]"
              style={{ background: color, border: '2px solid #3A2E2A', boxShadow: '3px 3px 0 #3A2E2A' }}>
              {qIdx + 1 < questions.length ? '次の問題 →' : '結果を見る！'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
