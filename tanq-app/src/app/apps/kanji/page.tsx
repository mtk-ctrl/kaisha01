'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { KANJI_DATA } from '@/data/kanjiData'
import type { Grade, KanjiEntry } from '@/data/kanjiData'
import { playCorrect, playWrong } from '@/lib/audio'
import { getDataKey } from '@/lib/storage'

type QuestionFormat = 'k2r' | 'r2k'

const GRADE_COLORS: Record<Grade, string> = {
  '小1': '#4ade80', '小2': '#34d399', '小3': '#60a5fa',
  '小4': '#c4a8ff', '小5': '#f0c040', '小6': '#f87171',
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
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

/** 重複なし・必ず4択を保証するヘルパー */
function pick4Unique(correct: string, candidates: string[]): string[] {
  const seen = new Set([correct])
  const others: string[] = []
  for (const c of candidates) {
    if (others.length === 3) break
    if (!seen.has(c)) { seen.add(c); others.push(c) }
  }
  return shuffle([correct, ...others])
}

function makeQuestion(item: KanjiEntry, pool: KanjiEntry[]): Question {
  const fmt: QuestionFormat = Math.random() < 0.65 ? 'k2r' : 'r2k'
  if (fmt === 'k2r') {
    const correct = getFullReading(item)
    const candidates = shuffle(pool.filter(k => getFullReading(k) !== getFullReading(item))).map(getFullReading)
    return { fmt, item, correct, choices: pick4Unique(correct, candidates) }
  }
  const correct = item.kanji
  const candidates = shuffle(pool.filter(k => k.kanji !== item.kanji)).map(k => k.kanji)
  return { fmt, item, correct, choices: pick4Unique(correct, candidates) }
}

function applySRS(store: SRSStore, key: string, correct: boolean, ms: number): {
  store: SRSStore; change: 'mastered' | 'advance' | 'same' | 'regress'
} {
  const old = store[key] || { b: 0, c: 0, s: 0, ok: 0, t: 0 }
  const fast = ms < 2500
  let b = old.b as number, c = old.c

  if (correct) {
    c = old.c + 1
    if (b === 0) { b = 1 } // any correct answer: new → learning
    else if (b === 1 && fast && c >= 3) { b = 2 } // mastery requires fast+consecutive
    else if (b === 2 && !fast) { b = 1 } // demote mastered if slow
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

type Phase = 'home' | 'playing' | 'result'

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

  const [questions, setQuestions] = useState<Question[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
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
    const ms = Date.now() - qStartRef.current
    setLastMs(ms)
    setSelected(c)
    const q = questions[qIdx]
    const correct = c === q.correct
    correct ? playCorrect() : playWrong()
    setFlashResult(correct ? 'correct' : 'wrong')
    setTimeout(() => setFlashResult(null), 700)
    if (correct) setSessionCorrect(n => n + 1)
    else setSessionWeak(n => n + 1)
    const { store: newStore, change } = applySRS(store, q.item.kanji, correct, ms)
    setStore(newStore)
    saveSRS(newStore)
    setLastChange(change)
    if (change === 'mastered') setSessionMastered(n => n + 1)
  }

  function goNext() {
    setFlashResult(null)
    if (qIdx + 1 >= questions.length) {
      const ns = recordStudy()
      setFinalStreak(ns)
      setStreak(ns)
      setPhase('result')
      return
    }
    setQIdx(i => i + 1)
    setSelected(null)
  }

  const color = GRADE_COLORS[grade]
  const stats = gradeStats(grade, store)

  // ── HOME ──
  if (phase === 'home') {
    const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0
    const isGuest = isGuestUser()
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center px-6 py-16 pt-20">
        <Link href="/lab" className="absolute top-6 left-6 text-[#8892b0] hover:text-[#c4a8ff] text-sm transition-colors">← ラボに戻る</Link>

        {streak > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#f0c040]/15 border border-[#f0c040]/30 px-3 py-1.5 rounded-full">
            <span>🔥</span>
            <span className="font-black text-[#f0c040] text-sm">{streak}日連続</span>
          </div>
        )}

        <div className="text-5xl mb-2 mt-4">📖</div>
        <h1 className="text-3xl font-black mb-1 text-[#c4a8ff]">漢字クイズ</h1>
        <p className="text-[#8892b0] text-xs mb-8 text-center">漢字→読み方 ＆ 読み方→漢字の2方向で練習。くり返しで、どんどん覚えられる！</p>

        {/* Grade selector */}
        {isGuest && (
          <div className="w-full max-w-sm mb-3 px-3 py-2 bg-[#f0c040]/10 border border-[#f0c040]/30 rounded-xl">
            <p className="text-[#f0c040] text-xs font-bold">体験中: 小1・小2のみ使えます</p>
            <Link href="/register" className="text-[#c4a8ff] text-[10px] hover:underline">登録すると全学年解放 →</Link>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm mb-5">
          {(Object.keys(KANJI_DATA) as Grade[]).map((g) => {
            const gs = gradeStats(g, store)
            const pct = gs.total > 0 ? Math.round((gs.mastered / gs.total) * 100) : 0
            const sel = g === grade
            const locked = isGuest && !GUEST_GRADES.includes(g)
            if (locked) {
              return (
                <div key={g} className="py-3 px-2 rounded-xl text-sm text-center opacity-40 bg-white/4 border border-white/8 cursor-not-allowed">
                  🔒 {g}
                  <div className="text-[10px] mt-0.5">登録で解放</div>
                </div>
              )
            }
            return (
              <button key={g} onClick={() => setGrade(g)}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${sel ? 'scale-105 text-[#050b14]' : 'text-[#8892b0] hover:text-white'}`}
                style={sel
                  ? { background: GRADE_COLORS[g], boxShadow: `0 0 20px ${GRADE_COLORS[g]}50` }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
                }>
                {g}
                <div className="text-[10px] font-normal mt-0.5 opacity-75">{pct}% 習得</div>
              </button>
            )
          })}
        </div>

        {/* 初回ユーザー向け背中押し */}
        {stats.mastered === 0 && stats.learning === 0 && (
          <div className="w-full max-w-sm mb-3 px-3 py-2 bg-[#c4a8ff]/10 border border-[#c4a8ff]/30 rounded-xl">
            <p className="text-[#c4a8ff] text-xs font-bold text-center">✨ まずは12問チャレンジしてみよう！</p>
          </div>
        )}

        {/* Grade progress */}
        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-5 border border-white/10">
          <div className="flex justify-between text-xs text-[#8892b0] mb-2">
            <span>{grade}の漢字 {stats.total}字</span>
            <span style={{ color }}>{masteredPct}% 習得済み</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${masteredPct}%`, background: color }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-black text-xl" style={{ color }}>{stats.mastered}</div>
              <div className="text-[#8892b0] text-[10px]">⭐ 習得済み</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#60a5fa]">{stats.learning}</div>
              <div className="text-[#8892b0] text-[10px]">📚 学習中</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#e8f0fe]">{stats.newCount}</div>
              <div className="text-[#8892b0] text-[10px]">🆕 未学習</div>
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="flex w-full max-w-sm gap-3 mb-1">
          {(['normal', 'weak'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === m ? 'text-[#050b14]' : 'text-[#8892b0] bg-white/5 border border-white/10 hover:border-white/20'}`}
              style={mode === m ? { background: color } : {}}>
              {m === 'normal' ? '📚 通常モード' : '💪 苦手集中'}
            </button>
          ))}
        </div>
        <p className="text-[#8892b0] text-[10px] w-full max-w-sm text-center mb-4">
          {mode === 'normal' ? 'バランスよく新しい漢字と復習を混ぜて出題' : '間違えた漢字・学習中の漢字を集中して出題'}
        </p>

        <button onClick={() => startGame(grade, mode)}
          className="w-full max-w-sm py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: color, boxShadow: `0 0 30px ${color}50` }}>
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
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="text-5xl mb-2">{rank.split(' ')[0]}</div>
        <h2 className="text-2xl font-black mb-3" style={{ color }}>{rank.split(' ').slice(1).join(' ')}</h2>

        {finalStreak > 0 && (
          <div className="flex items-center gap-2 bg-[#f0c040]/15 border border-[#f0c040]/30 px-4 py-2 rounded-full mb-4">
            <span>🔥</span>
            <span className="font-black text-[#f0c040]">{finalStreak}日連続達成！</span>
          </div>
        )}

        <div className="text-7xl font-black mb-1" style={{ color }}>{acc}%</div>
        <p className="text-[#8892b0] text-sm mb-6">{total}問中 {sessionCorrect}問正解</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-5">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black mb-1" style={{ color }}>⭐ {sessionMastered}</div>
            <div className="text-[#8892b0] text-xs">新規習得</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#4ade80] mb-1">{sessionCorrect}</div>
            <div className="text-[#8892b0] text-xs">正解数</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#f87171] mb-1">{sessionWeak}</div>
            <div className="text-[#8892b0] text-xs">要復習</div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex justify-between text-xs text-[#8892b0] mb-2">
            <span>{grade}の累計習得状況</span>
            <span style={{ color }}>{newPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${newPct}%`, background: color }} />
          </div>
          <p className="text-xs text-[#8892b0] mt-2">習得済み {newStats.mastered}/{newStats.total}字</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => startGame(grade, mode)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: color }}>もう一回！</button>
          {sessionWeak > 0 && (
            <button onClick={() => startGame(grade, 'weak')}
              className="w-full py-4 rounded-2xl font-bold text-base border border-[#f87171]/50 text-[#f87171] hover:bg-[#f87171]/10 transition-all">
              💪 苦手 {sessionWeak}問を集中練習
            </button>
          )}
          <button onClick={() => setPhase('home')}
            className="w-full py-4 rounded-2xl font-bold text-base border border-white/20 text-[#8892b0] hover:text-white transition-all">
            学年・モードを変える
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-base border border-white/10 text-[#8892b0] hover:text-[#c4a8ff] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  // ── PLAYING ──
  const q = questions[qIdx]
  if (!q) return null
  const isCorrect = selected === q.correct
  const isFast = lastMs > 0 && lastMs < 1500
  const isSlow = lastMs > 2500
  const isKanjiChoices = q.fmt === 'r2k'

  const changeColor = lastChange === 'mastered' ? '#f0c040' : lastChange === 'advance' ? '#4ade80' : lastChange === 'regress' ? '#f87171' : '#8892b0'
  const changeMsg = lastChange === 'mastered' ? '⭐ 習得！' : lastChange === 'advance' ? '📈 いい調子！' : lastChange === 'regress' ? '📉 要復習' : null

  return (
    <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      {flashResult && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <span className="text-[12rem] font-black leading-none"
            style={{
              color: flashResult === 'correct' ? '#4ade80' : '#f87171',
              textShadow: flashResult === 'correct' ? '0 0 60px #4ade8080' : '0 0 60px #f8717180',
            }}>
            {flashResult === 'correct' ? '○' : '×'}
          </span>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#071628]/90 backdrop-blur-sm z-10">
        <button onClick={() => setPhase('home')} className="text-[#8892b0] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#8892b0]">{qIdx + 1} / {questions.length}</span>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-[#4ade80]">○ {sessionCorrect}</span>
          <span className="text-[#f87171]">× {sessionWeak}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10 z-10">
        <div className="h-full transition-all duration-500" style={{ width: `${(qIdx / questions.length) * 100}%`, background: color }} />
      </div>

      <div className="w-full max-w-sm text-center">
        {/* Format badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
          {q.fmt === 'k2r' ? '漢字 → 読み方' : '読み方 → 漢字'}
          <span className="opacity-50">|</span>
          <span className="opacity-75">{grade}</span>
        </div>

        {/* Question */}
        {q.fmt === 'k2r' ? (
          <>
            <div className="text-[9rem] font-black leading-none mb-2 select-none"
              style={{ color: selected ? (isCorrect ? '#4ade80' : '#f87171') : '#e8f0fe' }}>
              {q.item.kanji}
            </div>
            {/* k2r: 漢字が問題なのでヒントは常に表示OK */}
            <p className="text-[#8892b0] text-sm mb-1">{q.item.meaning}</p>
            <p className="text-xs mb-5" style={{ color: `${color}90` }}>例）{q.item.example}</p>
          </>
        ) : (
          <>
            <p className="text-[#8892b0] text-xs mb-2 uppercase tracking-widest">この読み方の漢字は？</p>
            <div className="flex items-baseline justify-center mb-4 select-none">
              <span className="text-5xl font-black"
                style={{ color: selected ? (isCorrect ? '#4ade80' : '#f87171') : color }}>
                {q.item.reading}
              </span>
              {q.item.okurigana && (
                <span className="text-3xl font-bold"
                  style={{ color: selected ? (isCorrect ? '#4ade80' : '#f87171') : '#8892b0' }}>
                  {q.item.okurigana}
                </span>
              )}
            </div>
            {/* r2k: 選択前はヒント非表示（意味・例に答えの漢字が含まれるため） */}
            {selected !== null ? (
              <>
                <p className="text-[#8892b0] text-sm mb-1">{q.item.meaning}</p>
                <p className="text-xs mb-4" style={{ color: `${color}90` }}>例）{q.item.example}</p>
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
            let bg = 'rgba(255,255,255,0.06)'
            let border = 'rgba(255,255,255,0.12)'
            let textColor = '#e8f0fe'
            if (selected !== null) {
              if (isCor) { bg = `${color}28`; border = color; textColor = color }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; textColor = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold transition-all hover:scale-[1.03] disabled:cursor-default select-none"
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  color: textColor,
                  fontSize: isKanjiChoices ? '2.2rem' : '1.1rem',
                  lineHeight: isKanjiChoices ? '1' : '1.5',
                  minHeight: '64px',
                }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold" style={{ color: isFast && isCorrect ? '#f0c040' : isSlow ? '#94a3b8' : 'transparent' }}>
                {isCorrect && isFast ? '⚡ 速い！' : isCorrect && isSlow ? '🤔 ゆっくり' : ''}
              </span>
              {changeMsg && (
                <span className="text-sm font-bold" style={{ color: changeColor }}>{changeMsg}</span>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4 text-left border"
              style={{
                background: isCorrect ? `${color}12` : 'rgba(248,113,113,0.1)',
                borderColor: isCorrect ? `${color}40` : 'rgba(248,113,113,0.4)',
              }}>
              <p className="font-black text-sm mb-1.5" style={{ color: isCorrect ? color : '#f87171' }}>
                {isCorrect
                  ? `✓ 正解！${q.fmt === 'k2r' ? `「${q.item.kanji}」＝「${getFullReading(q.item)}」` : `「${getFullReading(q.item)}」＝「${q.item.kanji}」`}`
                  : `✗ 正解は「${q.correct}」`
                }
              </p>
              <p className="text-[#e8f0fe] text-sm leading-relaxed">{q.item.tip}</p>
            </div>

            <button onClick={goNext}
              className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
              style={{ background: color, boxShadow: `0 0 25px ${color}50` }}>
              {qIdx + 1 < questions.length ? '次の問題 →' : '結果を見る！'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
