'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { WORDS } from '@/data/englishData'
import type { WordEntry } from '@/data/englishData'
import { getDataKey } from '@/lib/storage'

type QuestionFormat = 'en2jp' | 'jp2en'

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  u.pitch = 1.0
  window.speechSynthesis.speak(u)
}

function SpeakButton({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl px-4 py-2' : size === 'sm' ? 'text-base px-2 py-1' : 'text-xl px-3 py-1.5'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text) }}
      className={`${cls} rounded-full bg-[#f87171]/15 border border-[#f87171]/30 hover:bg-[#f87171]/30 active:scale-95 transition-all select-none`}
      title="発音を聞く" aria-label="発音">
      🔊
    </button>
  )
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(fmt: QuestionFormat, correct: WordEntry, pool: WordEntry[]): string[] {
  if (fmt === 'jp2en') {
    const others = shuffle(pool.filter(w => w.english !== correct.english)).slice(0, 3).map(w => w.english)
    return shuffle([correct.english, ...others])
  }
  const others = shuffle(pool.filter(w => w.japanese !== correct.japanese)).slice(0, 3).map(w => w.japanese)
  return shuffle([correct.japanese, ...others])
}

// ── SRS ──
const SRS_KEY = 'tanq_english_srs_v1'
const STREAK_KEY = 'tanq_english_streak_v1'
const SESSION_SIZE = 10

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

function globalStats(store: SRSStore) {
  let mastered = 0, learning = 0, newCount = 0
  for (const w of WORDS) {
    const s = store[w.english]
    if (!s || s.b === 0) newCount++
    else if (s.b === 1) learning++
    else mastered++
  }
  return { mastered, learning, newCount, total: WORDS.length }
}

function buildSession(store: SRSStore, mode: 'normal' | 'weak'): WordEntry[] {
  if (mode === 'weak') {
    const weak = WORDS.filter(w => !store[w.english] || store[w.english].b < 2)
    return shuffle(weak.length >= 3 ? weak : WORDS).slice(0, SESSION_SIZE)
  }
  const now = Date.now()
  const overdue = WORDS.filter(w => store[w.english]?.b === 2 && now - store[w.english].t > 7 * 86400000)
  const learning = WORDS.filter(w => store[w.english]?.b === 1)
  const newItems = WORDS.filter(w => !store[w.english] || store[w.english].b === 0)
  return shuffle([
    ...shuffle(overdue).slice(0, 2),
    ...shuffle(learning).slice(0, 6),
    ...shuffle(newItems),
  ]).slice(0, SESSION_SIZE)
}

function applySRS(store: SRSStore, key: string, correct: boolean, ms: number): {
  store: SRSStore; change: 'mastered' | 'advance' | 'same' | 'regress'
} {
  const old = store[key] || { b: 0, c: 0, s: 0, ok: 0, t: 0 }
  const fast = ms < 2500
  let b = old.b as number, c = old.c
  if (correct) {
    c = old.c + 1
    if (b === 0) {
      b = 1  // any correct answer: new → learning
    } else if (b === 1 && fast && c >= 3) {
      b = 2  // mastery still requires fast answers
    } else if (b === 2 && !fast) {
      b = 1  // mastered demoted if slow
    }
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

interface Question { fmt: QuestionFormat; word: WordEntry; correct: string; choices: string[] }

function makeQuestion(word: WordEntry): Question {
  const fmt: QuestionFormat = Math.random() < 0.5 ? 'jp2en' : 'en2jp'
  return { fmt, word, correct: fmt === 'jp2en' ? word.english : word.japanese, choices: makeChoices(fmt, word, WORDS) }
}

type Phase = 'home' | 'playing' | 'result'

export default function EnglishQuiz() {
  const [phase, setPhase] = useState<Phase>('home')
  const [mode, setMode] = useState<'normal' | 'weak'>('normal')
  const [store, setStore] = useState<SRSStore>({})
  const [streak, setStreak] = useState(0)

  const [questions, setQuestions] = useState<Question[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [lastMs, setLastMs] = useState(0)
  const [lastChange, setLastChange] = useState<'mastered' | 'advance' | 'same' | 'regress'>('same')
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionMastered, setSessionMastered] = useState(0)
  const [sessionWeak, setSessionWeak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)
  const [flashResult, setFlashResult] = useState<'correct' | 'wrong' | null>(null)
  const qStartRef = useRef<number>(Date.now())

  useEffect(() => {
    setStore(loadSRS())
    setStreak(getStreakCount())
  }, [])

  useEffect(() => {
    if (phase === 'playing') qStartRef.current = Date.now()
  }, [qIdx, phase])

  const startGame = useCallback((m: 'normal' | 'weak' = mode) => {
    const currentStore = loadSRS()
    setStore(currentStore)
    const items = buildSession(currentStore, m)
    setQuestions(items.map(makeQuestion))
    setQIdx(0)
    setSelected(null)
    setSessionCorrect(0)
    setSessionMastered(0)
    setSessionWeak(0)
    qStartRef.current = Date.now()
    setMode(m)
    setPhase('playing')
  }, [mode])

  function choose(c: string) {
    if (selected !== null) return
    // Speak the tapped English word immediately in jp2en mode
    if (questions[qIdx].fmt === 'jp2en') speak(c)
    const ms = Date.now() - qStartRef.current
    setLastMs(ms)
    setSelected(c)
    const q = questions[qIdx]
    const correct = c === q.correct
    setFlashResult(correct ? 'correct' : 'wrong')
    setTimeout(() => setFlashResult(null), 700)
    if (correct) setSessionCorrect(n => n + 1)
    else setSessionWeak(n => n + 1)
    const { store: newStore, change } = applySRS(store, q.word.english, correct, ms)
    setStore(newStore)
    saveSRS(newStore)
    setLastChange(change)
    if (change === 'mastered') setSessionMastered(n => n + 1)
  }

  function goNext() {
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

  const stats = globalStats(store)
  const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0

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

        <div className="text-5xl mb-2 mt-4">🌍</div>
        <h1 className="text-3xl font-black mb-1 text-[#f87171]">英語クイズ</h1>
        <p className="text-[#94a3c4] text-xs mb-8 text-center">英語→日本語 ＆ 日本語→英語の2方向で練習。間隔反復で効率的に覚えよう！</p>

        {/* Overall progress */}
        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-5 border border-white/10">
          <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
            <span>全{stats.total}単語の習得状況</span>
            <span className="text-[#f87171]">{masteredPct}% 習得済み</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700 bg-[#f87171]" style={{ width: `${masteredPct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-black text-xl text-[#f87171]">{stats.mastered}</div>
              <div className="text-[#94a3c4] text-[10px]">⭐ 習得済み</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#60a5fa]">{stats.learning}</div>
              <div className="text-[#94a3c4] text-[10px]">📚 学習中</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#e8f0fe]">{stats.newCount}</div>
              <div className="text-[#94a3c4] text-[10px]">🆕 未学習</div>
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="flex w-full max-w-sm gap-3 mb-5">
          {(['normal', 'weak'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === m ? 'text-[#050b14] bg-[#f87171]' : 'text-[#94a3c4] bg-white/5 border border-white/10 hover:border-white/20'}`}>
              {m === 'normal' ? '📚 通常モード' : '💪 苦手集中'}
            </button>
          ))}
        </div>

        <button onClick={() => startGame(mode)}
          className="w-full max-w-sm py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: '#f87171', boxShadow: '0 0 30px rgba(248,113,113,0.4)' }}>
          Let&apos;s go！（{SESSION_SIZE}問）
        </button>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    const total = questions.length
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const rank = acc >= 90 ? '🏆 Perfect!' : acc >= 70 ? '🥇 Excellent!' : acc >= 50 ? '🥈 Good job!' : '🥉 Try again!'
    const newStats = globalStats(store)
    const newPct = newStats.total > 0 ? Math.round((newStats.mastered / newStats.total) * 100) : 0
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="text-5xl mb-2">{rank.split(' ')[0]}</div>
        <h2 className="text-2xl font-black mb-3 text-[#f87171]">{rank.split(' ').slice(1).join(' ')}</h2>

        {finalStreak > 0 && (
          <div className="flex items-center gap-2 bg-[#f0c040]/15 border border-[#f0c040]/30 px-4 py-2 rounded-full mb-4">
            <span>🔥</span>
            <span className="font-black text-[#f0c040]">{finalStreak}日連続達成！</span>
          </div>
        )}

        <div className="text-7xl font-black text-[#f87171] mb-1">{acc}%</div>
        <p className="text-[#94a3c4] text-sm mb-6">{total}問中 {sessionCorrect}問正解</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-5">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#f87171] mb-1">⭐ {sessionMastered}</div>
            <div className="text-[#94a3c4] text-xs">新規習得</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#4ade80] mb-1">{sessionCorrect}</div>
            <div className="text-[#94a3c4] text-xs">正解数</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#f87171] mb-1">{sessionWeak}</div>
            <div className="text-[#94a3c4] text-xs">要復習</div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
            <span>全単語の累計習得状況</span>
            <span className="text-[#f87171]">{newPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#f87171]" style={{ width: `${newPct}%` }} />
          </div>
          <p className="text-xs text-[#94a3c4] mt-2">習得済み {newStats.mastered}/{newStats.total}単語</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => startGame(mode)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f87171] transition-all hover:scale-[1.02]">もう一回！</button>
          {sessionWeak > 0 && (
            <button onClick={() => startGame('weak')}
              className="w-full py-4 rounded-2xl font-bold text-base border border-[#f87171]/50 text-[#f87171] hover:bg-[#f87171]/10 transition-all">
              💪 苦手 {sessionWeak}問を集中練習
            </button>
          )}
          <button onClick={() => setPhase('home')}
            className="w-full py-4 rounded-2xl font-bold text-base border border-white/20 text-[#94a3c4] hover:text-white transition-all">
            ホームに戻る
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-base border border-white/10 text-[#94a3c4] hover:text-[#f87171] transition-all text-center">ラボに戻る</Link>
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
  const changeColor = lastChange === 'mastered' ? '#f0c040' : lastChange === 'advance' ? '#4ade80' : lastChange === 'regress' ? '#f87171' : '#8892b0'
  const changeMsg = lastChange === 'mastered' ? '⭐ 習得！' : lastChange === 'advance' ? '📈 いい調子！' : lastChange === 'regress' ? '📉 要復習' : null

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      {flashResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: flashResult === 'correct' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)' }}
        >
          <span
            className="font-black select-none"
            style={{
              fontSize: '180px',
              lineHeight: 1,
              color: flashResult === 'correct' ? '#4ade80' : '#f87171',
              textShadow: flashResult === 'correct'
                ? '0 0 60px rgba(74,222,128,0.8)'
                : '0 0 60px rgba(248,113,113,0.8)',
            }}
          >
            {flashResult === 'correct' ? '○' : '×'}
          </span>
        </div>
      )}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={() => setPhase('home')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{qIdx + 1} / {questions.length}</span>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-[#4ade80]">○ {sessionCorrect}</span>
          <span className="text-[#f87171]">× {sessionWeak}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10 z-10">
        <div className="h-full transition-all duration-500 bg-[#f87171]" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
      </div>

      <div className="w-full max-w-sm text-center">
        {/* Format badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/40">
          {q.fmt === 'jp2en' ? '日本語 → English' : 'English → 日本語'}
        </div>

        {/* Question */}
        {q.fmt === 'jp2en' ? (
          <>
            {/* Emoji only shown after answering in jp2en mode to avoid giving away the answer */}
            {selected !== null && (
              <div className="text-[7rem] leading-none mb-2 select-none">{q.word.emoji}</div>
            )}
            <p className="text-2xl font-black mb-1">{q.word.japanese}</p>
            <p className="text-[#94a3c4] text-xs mb-5">{q.word.category}</p>
          </>
        ) : (
          <>
            <div className="text-[7rem] leading-none mb-2 select-none">{q.word.emoji}</div>
            <div className="flex items-center justify-center gap-3 mb-1">
              <p className="text-3xl font-black text-[#f87171]">{q.word.english}</p>
              <SpeakButton text={q.word.english} size="md" />
            </div>
            <p className="text-[#94a3c4] text-xs mb-5">{q.word.category}</p>
          </>
        )}

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {q.choices.map((c) => {
            const isCor = c === q.correct
            const isSel = c === selected
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let text = '#e8f0fe'
            if (selected !== null) {
              if (isCor) { bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; text = '#4ade80' }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold" style={{ color: isFast && isCorrect ? '#f0c040' : 'transparent' }}>
                {isCorrect && isFast ? '⚡ 速い！' : isCorrect && isSlow ? '🤔 ゆっくり' : ''}
              </span>
              {changeMsg && (
                <span className="text-sm font-bold" style={{ color: changeColor }}>{changeMsg}</span>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4 text-left border"
              style={{
                background: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.1)',
                borderColor: isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-sm" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect
                    ? `✓ 正解！「${q.word.japanese}」 = "${q.word.english}"`
                    : `✗ 正解は「${q.correct}」`}
                </p>
                <SpeakButton text={q.word.english} size="sm" />
              </div>
              <p className="text-[#e8f0fe] text-sm leading-relaxed mb-2">{q.word.tip}</p>
              <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <p className="text-[#94a3c4] text-xs italic">"{q.word.sentence}"</p>
                <p className="text-[#e8f0fe] text-xs mt-0.5">{q.word.sentenceJP}</p>
              </div>
            </div>

            <button onClick={goNext}
              className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
              style={{ background: '#f87171', boxShadow: '0 0 25px rgba(248,113,113,0.35)' }}>
              {qIdx + 1 < questions.length ? '次の問題 →' : '結果を見る！'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
