'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

// ============================================================
// 10のなかよし — じゅうコンボ
// ============================================================

interface Pair {
  a: number
  b: number
}

const PAIRS: Pair[] = [
  { a: 1, b: 9 }, { a: 2, b: 8 }, { a: 3, b: 7 }, { a: 4, b: 6 }, { a: 5, b: 5 },
  { a: 6, b: 4 }, { a: 7, b: 3 }, { a: 8, b: 2 }, { a: 9, b: 1 },
]

const DOT_COLORS = ['#5B8DEF', '#FF6B9D', '#4ECDC4', '#A855F7', '#FF8C42', '#FFD700']

const JUUCOMBO_BEST_KEY = 'tanq_juucombo_best_v1'

interface JuucomboBest {
  best: number
}

function loadBest(): JuucomboBest {
  try {
    const key = getDataKey(JUUCOMBO_BEST_KEY)
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as JuucomboBest) : { best: 0 }
  } catch {
    return { best: 0 }
  }
}

function saveBestScore(correct: number) {
  try {
    const key = getDataKey(JUUCOMBO_BEST_KEY)
    const prev = loadBest()
    if (correct > prev.best) {
      localStorage.setItem(key, JSON.stringify({ best: correct }))
    }
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

interface Question {
  pair: Pair
  askRight: boolean // true=右(b)を問う, false=左(a)を問う
  knownNum: number
  answer: number
  choices: number[]
}

interface LogEntry {
  question: Question
  chosen: number
  ok: boolean
}

type Phase = 'menu' | 'game' | 'result'

function buildQuestions(): Question[] {
  const pool: Question[] = []
  PAIRS.forEach(p => {
    // askRight=false → □ + b = 10（aを問う）
    // askRight=true  → a + □ = 10（bを問う）
    ;[false, true].forEach(askRight => {
      const knownNum = askRight ? p.a : p.b
      const answer = askRight ? p.b : p.a
      const choicesSet = new Set<number>([answer])
      while (choicesSet.size < 4) {
        choicesSet.add(Math.floor(Math.random() * 9) + 1)
      }
      pool.push({
        pair: p,
        askRight,
        knownNum,
        answer,
        choices: shuffle(Array.from(choicesSet)),
      })
    })
  })
  return shuffle(pool).slice(0, 10)
}

interface DotGridProps {
  filled: number
  empty: number
  allFilled?: boolean
}

function DotGrid({ filled, empty, allFilled }: DotGridProps) {
  const color = DOT_COLORS[filled % DOT_COLORS.length]
  const dots = Array.from({ length: 10 }, (_, i) => {
    const isFilled = allFilled ? true : i < filled
    return { isFilled, idx: i }
  })

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)', width: 'fit-content', margin: '0 auto' }}>
      {dots.map(({ isFilled, idx }) => (
        <div
          key={idx}
          className="rounded-full transition-all duration-300"
          style={{
            width: 36,
            height: 36,
            background: isFilled ? color : 'transparent',
            border: isFilled ? 'none' : '2.5px dashed #CBD5E1',
            boxShadow: isFilled ? `0 2px 6px ${color}66` : 'none',
          }}
        />
      ))}
    </div>
  )
}

function fireConfetti(canvas: HTMLCanvasElement, big: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const n = big ? 100 : 40
  interface Particle {
    x: number; y: number; vx: number; vy: number
    r: number; dy: number; color: string; alpha: number; shape: 'rect' | 'circle'
  }
  const COLORS = ['#5B8DEF', '#FF6B9D', '#4ECDC4', '#A855F7', '#FF8C42', '#FFD700']
  const particles: Particle[] = []
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 8
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      r: Math.random() * 6 + 3,
      dy: 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    })
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let active = false
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.014
      if (p.alpha > 0) {
        active = true
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill() }
        ctx.restore()
      }
    })
    if (active) requestAnimationFrame(animate)
    else ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  animate()
}

export default function JuucomboPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase, setPhase] = useState<Phase>('menu')
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [allFilled, setAllFilled] = useState(false)
  const [best, setBest] = useState<JuucomboBest>(() => {
    if (typeof window !== 'undefined') return loadBest()
    return { best: 0 }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') setBest(loadBest())
  }, [])

  const TOTAL = 10

  const startGame = useCallback(() => {
    const qs = buildQuestions()
    setQuestions(qs)
    setIdx(0)
    setLog([])
    setChosen(null)
    setShowFeedback(false)
    setAllFilled(false)
    setPhase('game')
    setTimeout(() => speak(`${qs[0].knownNum} たす いくつが じゅう に なるかな？`), 300)
  }, [])

  const handleAnswer = useCallback((c: number) => {
    if (chosen !== null) return
    const q = questions[idx]
    const ok = c === q.answer
    setChosen(c)
    setShowFeedback(true)
    if (ok) {
      setAllFilled(true)
      speak(`せいかい！ ${q.knownNum} と ${q.answer} で じゅう！`)
      if (canvasRef.current) fireConfetti(canvasRef.current, false)
    } else {
      speak(`ざんねん！ こたえは ${q.answer} だよ！ ${q.knownNum} と ${q.answer} で じゅう！`)
    }
    setLog(prev => [...prev, { question: q, chosen: c, ok }])
  }, [chosen, questions, idx])

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= TOTAL) {
      const correctCount = log.filter(l => l.ok).length
      saveBestScore(correctCount)
      setBest(loadBest())
      saveScore('youji-juucombo', correctCount, TOTAL, 'combo')
      const pct = correctCount / TOTAL
      if (pct >= 0.8 && canvasRef.current) fireConfetti(canvasRef.current, true)
      speak(
        pct === 1
          ? 'かんぺき！すごいね！'
          : pct >= 0.8
          ? 'よくできました！おめでとう！'
          : 'またれんしゅうしてね！'
      )
      setPhase('result')
    } else {
      setIdx(nextIdx)
      setChosen(null)
      setShowFeedback(false)
      setAllFilled(false)
      setTimeout(() => speak(`${questions[nextIdx].knownNum} たす いくつが じゅう に なるかな？`), 300)
    }
  }, [idx, log, questions])

  // ── MENU ──────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen pb-20">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🔟 10の なかよし</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {/* さいこうスコア */}
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl font-black" style={{ color: '#5B8DEF' }}>
              {best.best} / {TOTAL}
            </div>
            <div className="text-xs text-gray-500 mt-1">さいこう せいかい</div>
          </div>

          {/* 10の組み合わせデモ */}
          <div className="bg-white rounded-2xl shadow-md p-5 text-center">
            <p className="text-sm text-gray-500 mb-3">たして <span className="font-black text-blue-600">じゅう</span> になるよ！</p>
            <div className="flex justify-center gap-4 text-lg font-black text-blue-600 mb-4">
              {PAIRS.map(p => (
                <span key={`${p.a}${p.b}`} className="text-xs">{p.a}+{p.b}</span>
              ))}
            </div>
            <p className="text-xs text-gray-400">ぜんぶ おぼえよう！</p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #5B8DEF, #4ECDC4)' }}
          >
            スタート！（10もん）
          </button>
        </div>
      </div>
    )
  }

  // ── GAME ──────────────────────────────────────────────────
  if (phase === 'game') {
    const q = questions[idx]
    const pct = (idx / TOTAL) * 100

    return (
      <div className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen pb-20">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => { window.speechSynthesis?.cancel(); setPhase('menu') }}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{idx + 1} / {TOTAL}</span>
                <span>⭐ {log.filter(l => l.ok).length}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #5B8DEF, #4ECDC4)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {/* 方程式 */}
          <div className="bg-white rounded-2xl shadow-md p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-black">
              {q.askRight ? (
                <>
                  <span className="px-3 py-1 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#5B8DEF,#A855F7)' }}>
                    {q.knownNum}
                  </span>
                  <span className="text-gray-500">＋</span>
                  <span className="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-600 border-2 border-dashed border-yellow-400">□</span>
                  <span className="text-gray-500">＝</span>
                  <span className="px-3 py-1 rounded-xl bg-blue-600 text-white">10</span>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-600 border-2 border-dashed border-yellow-400">□</span>
                  <span className="text-gray-500">＋</span>
                  <span className="px-3 py-1 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#5B8DEF,#A855F7)' }}>
                    {q.knownNum}
                  </span>
                  <span className="text-gray-500">＝</span>
                  <span className="px-3 py-1 rounded-xl bg-blue-600 text-white">10</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">□ に はいる かずは どれかな？</p>
          </div>

          {/* ドットグリッド */}
          <div className="bg-white rounded-2xl shadow-md p-5 flex justify-center">
            <DotGrid filled={q.knownNum} empty={q.answer} allFilled={allFilled} />
          </div>

          {/* 4択ボタン */}
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((c, i) => {
              let btnClass = 'w-full py-4 rounded-2xl text-2xl font-black transition-all '
              if (chosen === null) {
                btnClass += 'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
              } else if (c === q.answer) {
                btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
              } else if (c === chosen && c !== q.answer) {
                btnClass += 'bg-red-100 text-red-600 border-2 border-red-400'
              } else {
                btnClass += 'bg-gray-100 text-gray-400'
              }
              return (
                <button
                  key={i}
                  className={btnClass}
                  onClick={() => handleAnswer(c)}
                  disabled={chosen !== null}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {/* フィードバック */}
          {showFeedback && chosen !== null && (
            <div
              className={`rounded-2xl p-4 text-center ${
                chosen === q.answer ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="text-3xl mb-1">
                {chosen === q.answer ? '⭕' : '❌'}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {chosen === q.answer
                  ? `せいかい！ ${q.knownNum} ＋ ${q.answer} ＝ 10 だよ！`
                  : `こたえは ${q.answer} だよ！ ${q.knownNum} ＋ ${q.answer} ＝ 10 だね！`}
              </p>
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #5B8DEF, #4ECDC4)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────
  const correctCount = log.filter(l => l.ok).length
  const pctResult = correctCount / TOTAL
  const stars = pctResult === 1 ? 3 : pctResult >= 0.7 ? 2 : 1
  const emoji = stars === 3 ? '🎉' : stars === 2 ? '😄' : '😊'
  const title =
    stars === 3 ? 'かんぺき！すごい！！' : stars === 2 ? 'よくできました！' : 'またれんしゅうしよう！'

  return (
    <div className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen pb-20">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🔟 けっか</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-black" style={{ color: '#5B8DEF' }}>
                {correctCount}/{TOTAL}
              </div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-teal-500">
                {best.best}
              </div>
              <div className="text-xs text-gray-500">さいこう</div>
            </div>
          </div>
        </div>

        {/* 問題ごとの結果 */}
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm p-2 rounded-xl ${
                l.ok ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span>{l.ok ? '✓' : '✗'}</span>
              <span className="flex-1 text-gray-700 text-xs">
                {l.question.askRight
                  ? `${l.question.knownNum} ＋ □ ＝ 10`
                  : `□ ＋ ${l.question.knownNum} ＝ 10`}
              </span>
              <span
                className={`font-bold text-xs ${l.ok ? 'text-green-600' : 'text-red-500'}`}
              >
                □＝{l.question.answer}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #5B8DEF, #4ECDC4)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-blue-700 text-lg text-center bg-blue-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
