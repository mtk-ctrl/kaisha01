'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PROBLEMS } from '@/data/wordMathData'
import type { Grade, WordProblem } from '@/data/wordMathData'
import { getDataKey } from '@/lib/storage'
import { playCorrect, playWrong } from '@/lib/audio'
import { saveScore } from '@/lib/scoreApi'

// Fisher–Yates（sortベースのシャッフルは偏るため）
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── SRS ──
const SRS_KEY = 'tanq_wordmath_srs_v1'
const STREAK_KEY = 'tanq_wordmath_streak_v1'
const SESSION_SIZE = 8
const SESSION_KEY = 'tanq-lab-auth'

interface ItemState { b: 0 | 1 | 2; c: number; s: number; ok: number; t: number }
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

function getUserType(): 'guest' | 'tester' | 'member' {
  if (typeof window === 'undefined') return 'guest'
  const v = localStorage.getItem(SESSION_KEY)
  if (v === 'member') return 'member'
  if (v === 'tester') return 'tester'
  return 'guest'
}

function gradeStats(store: SRSStore, grade: Grade) {
  const pool = PROBLEMS.filter(p => p.grade === grade)
  let mastered = 0, learning = 0, newCount = 0
  for (const p of pool) {
    const s = store[p.id]
    if (!s || s.b === 0) newCount++
    else if (s.b === 1) learning++
    else mastered++
  }
  return { mastered, learning, newCount, total: pool.length }
}

function buildSession(store: SRSStore, grade: Grade, mode: 'normal' | 'weak'): WordProblem[] {
  const pool = PROBLEMS.filter(p => p.grade === grade)
  if (mode === 'weak') {
    const weak = pool.filter(p => !store[p.id] || store[p.id].b < 2)
    return shuffle(weak.length >= 3 ? weak : pool).slice(0, SESSION_SIZE)
  }
  const now = Date.now()
  const overdue = pool.filter(p => store[p.id]?.b === 2 && now - store[p.id].t > 7 * 86400000)
  const learning = pool.filter(p => store[p.id]?.b === 1)
  const newItems = pool.filter(p => !store[p.id] || store[p.id].b === 0)
  return shuffle([
    ...shuffle(overdue).slice(0, 2),
    ...shuffle(learning).slice(0, 5),
    ...shuffle(newItems),
  ]).slice(0, SESSION_SIZE)
}

function applySRS(store: SRSStore, id: string, correct: boolean): {
  store: SRSStore; change: 'mastered' | 'advance' | 'same' | 'regress'
} {
  const old = store[id] || { b: 0, c: 0, s: 0, ok: 0, t: 0 }
  let b = old.b as number, c = old.c
  if (correct) {
    c = old.c + 1
    if (b === 0) b = 1
    else if (b === 1 && c >= 3) b = 2
  } else {
    c = 0
    if (b === 2) b = 1
  }
  const entry: ItemState = { b: b as 0 | 1 | 2, c, s: old.s + 1, ok: old.ok + (correct ? 1 : 0), t: Date.now() }
  const newStore = { ...store, [id]: entry }
  let change: 'mastered' | 'advance' | 'same' | 'regress' = 'same'
  if (b > old.b) change = b === 2 ? 'mastered' : 'advance'
  else if (b < old.b) change = 'regress'
  return { store: newStore, change }
}

const GRADES: Grade[] = ['小1', '小2', '小3']
const GRADE_COLORS: Record<Grade, string> = { '小1': '#4ade80', '小2': '#60a5fa', '小3': '#f0a050' }
const GRADE_LABELS: Record<Grade, string> = { '小1': 'たし算・ひき算', '小2': '2けたの計算・かけ算', '小3': '大きい数・時間' }

type Phase = 'home' | 'playing' | 'result'

export default function WordMathQuiz() {
  const [phase, setPhase] = useState<Phase>('home')
  const [grade, setGrade] = useState<Grade>('小1')
  const [mode, setMode] = useState<'normal' | 'weak'>('normal')
  const [store, setStore] = useState<SRSStore>({})
  const [streak, setStreak] = useState(0)
  const [userType, setUserType] = useState<'guest' | 'tester' | 'member'>('guest')

  const [problems, setProblems] = useState<WordProblem[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  // 段階ヒント用: 1回目に間違えた選択肢（再挑戦中はヒントを表示）/ resolved=答え合わせ完了
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [resolved, setResolved] = useState(false)
  const [lastChange, setLastChange] = useState<'mastered' | 'advance' | 'same' | 'regress'>('same')
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionMastered, setSessionMastered] = useState(0)
  const [sessionWeak, setSessionWeak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    setStore(loadSRS())
    setStreak(getStreakCount())
    setUserType(getUserType())
  }, [])

  const isLocked = useCallback((g: Grade) => {
    if (userType === 'tester' || userType === 'member') return false
    return g !== '小1'
  }, [userType])

  const startGame = useCallback((g: Grade = grade, m: 'normal' | 'weak' = mode) => {
    const currentStore = loadSRS()
    setStore(currentStore)
    const items = buildSession(currentStore, g, m)
    setProblems(items)
    setQIdx(0)
    setSelected(null)
    setWrongPicks([])
    setResolved(false)
    setSessionCorrect(0)
    setSessionMastered(0)
    setSessionWeak(0)
    startTimeRef.current = Date.now()
    setGrade(g)
    setMode(m)
    setPhase('playing')
  }, [grade, mode])

  function choose(val: number) {
    if (resolved || wrongPicks.includes(val)) return
    const p = problems[qIdx]

    if (val === p.answer) {
      playCorrect()
      setSelected(val)
      setResolved(true)
      // 成績（SRS・正解数）は1回目の答えだけで記録する
      if (wrongPicks.length === 0) {
        setSessionCorrect(n => n + 1)
        const { store: newStore, change } = applySRS(store, p.id, true)
        setStore(newStore)
        saveSRS(newStore)
        setLastChange(change)
        if (change === 'mastered') setSessionMastered(n => n + 1)
      }
      return
    }

    playWrong()
    if (wrongPicks.length === 0) {
      // 1回目の不正解: まだ答えは見せない。SRSに記録し、ヒントを出してもう一度考えさせる
      setSessionWeak(n => n + 1)
      const { store: newStore, change } = applySRS(store, p.id, false)
      setStore(newStore)
      saveSRS(newStore)
      setLastChange(change)
      setWrongPicks([val])
    } else {
      // 2回目も不正解: 答えと解説を見せる
      setWrongPicks(prev => [...prev, val])
      setSelected(val)
      setResolved(true)
    }
  }

  function goNext() {
    if (!resolved) return // 連打・誤タップ対策
    if (qIdx + 1 >= problems.length) {
      const ns = recordStudy()
      setFinalStreak(ns)
      setStreak(ns)
      saveScore('word-math', sessionCorrect, problems.length, grade)
      setPhase('result')
      return
    }
    setQIdx(i => i + 1)
    setSelected(null)
    setWrongPicks([])
    setResolved(false)
  }

  const color = GRADE_COLORS[grade]

  // ── HOME ──
  if (phase === 'home') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center px-6 py-16 pt-20">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f87171] text-sm transition-colors">← ラボに戻る</Link>

        {streak > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#f0c040]/15 border border-[#f0c040]/30 px-3 py-1.5 rounded-full">
            <span>🔥</span>
            <span className="font-black text-[#f0c040] text-sm">{streak}日連続</span>
          </div>
        )}

        <div className="text-5xl mb-2 mt-4">📐</div>
        <h1 className="text-3xl font-black mb-1 text-[#f0a050]">算数・文章題</h1>
        <p className="text-[#94a3c4] text-xs mb-8 text-center">もんだいを 読んで 正しい 答えを えらぼう。まちがえた もんだいは くりかえし 出るよ！</p>

        {/* Grade selector */}
        <div className="w-full max-w-sm mb-4">
          <p className="text-xs text-[#94a3c4] font-bold mb-2">学年を選ぶ</p>
          <div className="grid grid-cols-3 gap-2">
            {GRADES.map((g) => {
              const locked = isLocked(g)
              const active = grade === g
              return (
                <button key={g} onClick={() => !locked && setGrade(g)} disabled={locked}
                  className="rounded-2xl py-4 font-black text-base transition-all relative"
                  style={locked
                    ? { background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', color: '#4a5a7a', cursor: 'not-allowed' }
                    : active
                      ? { background: `${GRADE_COLORS[g]}25`, border: `2px solid ${GRADE_COLORS[g]}`, color: GRADE_COLORS[g] }
                      : { background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)', color: '#94a3c4' }
                  }>
                  {g}
                  {locked && <span className="block text-[9px] mt-0.5">🔒</span>}
                </button>
              )
            })}
          </div>
          {userType === 'guest' && (
            <p className="text-[10px] text-[#94a3c4] mt-2 text-center">
              小2・小3は<Link href="/register" className="text-[#c4a8ff] font-bold">登録</Link>すると解放
            </p>
          )}
        </div>

        {/* Grade description */}
        <div className="w-full max-w-sm mb-4 px-4 py-2 rounded-xl border"
          style={{ background: `${color}10`, borderColor: `${color}30` }}>
          <p className="text-xs font-bold" style={{ color }}>{grade} — {GRADE_LABELS[grade]}</p>
        </div>

        {/* Per-grade stats */}
        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          {(() => {
            const s = gradeStats(store, grade)
            const pct = s.total > 0 ? Math.round(s.mastered / s.total * 100) : 0
            return (
              <>
                <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
                  <span>{grade}の問題 全{s.total}問</span>
                  <span style={{ color }}>{pct}% おぼえた</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-black text-xl" style={{ color }}>{s.mastered}</div>
                    <div className="text-[#94a3c4] text-[10px]">⭐ おぼえた</div>
                  </div>
                  <div>
                    <div className="font-black text-xl text-[#60a5fa]">{s.learning}</div>
                    <div className="text-[#94a3c4] text-[10px]">📚 れんしゅう中</div>
                  </div>
                  <div>
                    <div className="font-black text-xl text-[#e8f0fe]">{s.newCount}</div>
                    <div className="text-[#94a3c4] text-[10px]">🆕 これから</div>
                  </div>
                </div>
              </>
            )
          })()}
        </div>

        {/* Mode */}
        <div className="flex w-full max-w-sm gap-3 mb-5">
          {(['normal', 'weak'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
              style={mode === m
                ? { background: color, color: '#050b14' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3c4' }}>
              {m === 'normal' ? '📚 つうじょうモード' : '💪 にがて とっくん'}
            </button>
          ))}
        </div>

        <button onClick={() => startGame(grade, mode)}
          className="w-full max-w-sm py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: color, boxShadow: `0 0 30px ${color}50` }}>
          はじめる！（{SESSION_SIZE}問）
        </button>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    const total = problems.length
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const rank = acc >= 90 ? '🏆 パーフェクト！' : acc >= 70 ? '🥇 すごい！' : acc >= 50 ? '🥈 よくできました！' : '🥉 もう一回やってみよう！'
    const s = gradeStats(store, grade)
    const newPct = s.total > 0 ? Math.round(s.mastered / s.total * 100) : 0

    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="text-5xl mb-2">{rank.split(' ')[0]}</div>
        <h2 className="text-2xl font-black mb-3" style={{ color }}>{rank.split(' ').slice(1).join(' ')}</h2>

        {finalStreak > 0 && (
          <div className="flex items-center gap-2 bg-[#f0c040]/15 border border-[#f0c040]/30 px-4 py-2 rounded-full mb-4">
            <span>🔥</span>
            <span className="font-black text-[#f0c040]">{finalStreak}日連続達成！</span>
          </div>
        )}

        <div className="text-7xl font-black mb-1" style={{ color }}>{acc}%</div>
        <p className="text-[#94a3c4] text-sm mb-6">{total}問中 {sessionCorrect}問正解</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-5">
          {[
            { label: 'あたらしく おぼえた', value: `⭐ ${sessionMastered}`, c: color },
            { label: '正解数', value: sessionCorrect, c: '#4ade80' },
            { label: 'もういちど', value: sessionWeak, c: '#f87171' },
          ].map(({ label, value, c }) => (
            <div key={label} className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-2xl font-black mb-1" style={{ color: c }}>{value}</div>
              <div className="text-[#94a3c4] text-xs">{label}</div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
            <span>{grade}の おぼえた もんだい</span>
            <span style={{ color }}>{newPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${newPct}%`, background: color }} />
          </div>
          <p className="text-xs text-[#94a3c4] mt-2">おぼえた {s.mastered}/{s.total}問</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => startGame(grade, mode)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: color }}>
            もう一回！
          </button>
          {sessionWeak > 0 && (
            <button onClick={() => startGame(grade, 'weak')}
              className="w-full py-4 rounded-2xl font-bold text-base border transition-all"
              style={{ borderColor: `${color}50`, color }}>
              💪 まちがえた {sessionWeak}問を れんしゅう！
            </button>
          )}
          <button onClick={() => setPhase('home')}
            className="w-full py-4 rounded-2xl font-bold text-base border border-white/20 text-[#94a3c4] hover:text-white transition-all">
            ホームに戻る
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-base border border-white/10 text-[#94a3c4] hover:text-[#f0a050] transition-all text-center">
            ラボに戻る
          </Link>
        </div>
      </div>
    )
  }

  // ── PLAYING ──
  const p = problems[qIdx]
  if (!p) return null
  const isCorrect = selected === p.answer
  const firstTry = isCorrect && wrongPicks.length === 0
  const retrying = !resolved && wrongPicks.length > 0
  const changeColor = lastChange === 'mastered' ? '#f0c040' : lastChange === 'advance' ? '#4ade80' : lastChange === 'regress' ? '#f87171' : '#8892b0'
  const changeMsg = lastChange === 'mastered' ? '⭐ おぼえた！' : lastChange === 'advance' ? '📈 いい調子！' : lastChange === 'regress' ? '📉 もういちど れんしゅうしよう' : null
  const gradeColor = GRADE_COLORS[p.grade]

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={() => setPhase('home')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${gradeColor}20`, color: gradeColor, border: `1px solid ${gradeColor}40` }}>{p.grade}</span>
          <span className="text-sm text-[#94a3c4]">{qIdx + 1} / {problems.length}</span>
        </div>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-[#4ade80]">○ {sessionCorrect}</span>
          <span className="text-[#f87171]">✗ {sessionWeak}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10 z-10">
        <div className="h-full transition-all duration-500" style={{ width: `${(qIdx / problems.length) * 100}%`, background: gradeColor }} />
      </div>

      <div className="w-full max-w-sm">
        {/* Problem card */}
        <div className="bg-white/6 border border-white/12 rounded-3xl p-6 mb-5 text-center">
          <div className="text-6xl mb-4 select-none">{p.emoji}</div>
          <p className="text-base font-bold leading-relaxed text-[#e8f0fe]">{p.question}</p>
          <p className="text-xs text-[#94a3c4] mt-2">答えの単位: <span className="font-bold text-[#e8f0fe]">{p.unit}</span></p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {p.choices.map((c) => {
            const isCor = c === p.answer
            const isSel = c === selected
            const isPickedWrong = wrongPicks.includes(c)
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let textCol = '#e8f0fe'
            let opacity = 1
            if (resolved) {
              if (isCor) { bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; textCol = '#4ade80' }
              else if (isSel || isPickedWrong) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; textCol = '#f87171' }
            } else if (isPickedWrong) {
              // 再挑戦中: 間違えた選択肢はうすくして選べないように
              bg = 'rgba(248,113,113,0.1)'; border = 'rgba(248,113,113,0.4)'; textCol = '#f87171'; opacity = 0.45
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={resolved || isPickedWrong}
                className="py-5 rounded-2xl font-black text-2xl transition-all hover:scale-[1.03] disabled:cursor-default disabled:hover:scale-100"
                style={{ background: bg, border: `2px solid ${border}`, color: textCol, opacity }}>
                {c}
                <span className="block text-xs font-normal mt-0.5 opacity-70">{p.unit}</span>
              </button>
            )
          })}
        </div>

        {/* 段階ヒント（1回目の不正解 → 答えは見せずに考える足場を出す） */}
        {retrying && (
          <div className="rounded-2xl p-4 mb-4 border border-[#f0c040]/40 bg-[#f0c040]/10">
            <p className="font-black text-sm mb-1.5 text-[#f0c040]">💡 ヒント</p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{p.hint}</p>
            <p className="text-[#f0c040] text-xs font-bold mt-2">もういちど えらんでみよう！</p>
          </div>
        )}

        {/* Feedback */}
        {resolved && (
          <>
            <div className="flex items-center justify-end mb-2">
              {changeMsg && (
                <span className="text-sm font-bold" style={{ color: changeColor }}>{changeMsg}</span>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4 border"
              style={{
                background: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.1)',
                borderColor: isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)',
              }}>
              <p className="font-black text-sm mb-2" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                {firstTry
                  ? `✓ 正解！ 答えは ${p.answer}${p.unit}`
                  : isCorrect
                    ? `✓ できた！ 答えは ${p.answer}${p.unit}`
                    : `✗ 正解は ${p.answer}${p.unit}`}
              </p>
              <p className="text-[#e8f0fe] text-sm leading-relaxed">{p.explanation}</p>
            </div>

            <button onClick={goNext}
              className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
              style={{ background: gradeColor, boxShadow: `0 0 25px ${gradeColor}50` }}>
              {qIdx + 1 < problems.length ? '次の問題 →' : '結果を見る！'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
