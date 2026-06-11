'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

// ============================================================
// たしざん・ひきざん — おやつクイズ
// ============================================================

const FOOD_EMOJIS = ['🍎', '🍪', '🍬']
const MATH_BEST_KEY = 'tanq_math_youji_best_v1'

interface MathBest {
  best: number
}

function loadBest(): MathBest {
  try {
    const key = getDataKey(MATH_BEST_KEY)
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as MathBest) : { best: 0 }
  } catch {
    return { best: 0 }
  }
}

function saveBestScore(correct: number, total: number) {
  try {
    const key = getDataKey(MATH_BEST_KEY)
    const prev = loadBest()
    const pct = Math.round((correct / total) * 100)
    if (pct > prev.best) {
      localStorage.setItem(key, JSON.stringify({ best: pct }))
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
    u.rate = 0.9
    u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

interface MathQuestion {
  num1: number
  num2: number
  isAddition: boolean
  answer: number
  choices: number[]
  foodEmoji: string
  foodEmoji2: string
  equation: string
}

function generateQuestion(level: number): MathQuestion {
  const maxNum = level === 1 ? 5 : level === 2 ? 10 : 20
  const isAddition = Math.random() > 0.5
  let num1: number, num2: number, answer: number

  if (isAddition) {
    // 0をふくむ式は未就学児には分かりにくいので両項1以上にする
    answer = Math.floor(Math.random() * (maxNum - 1)) + 2 // 2..maxNum
    num1 = Math.floor(Math.random() * (answer - 1)) + 1   // 1..answer-1
    num2 = answer - num1
  } else {
    num1 = Math.floor(Math.random() * (maxNum - 1)) + 2   // 2..maxNum
    num2 = Math.floor(Math.random() * (num1 - 1)) + 1     // 1..num1-1
    answer = num1 - num2
  }

  // ありがちな間違いを優先して誤答に混ぜる
  // たし算: 数え飛ばし(±1) / ひき算: 逆に足す(num1+num2)・数え飛ばし(±1)
  const choicesSet = new Set<number>([answer])
  const typical = isAddition
    ? [Math.random() < 0.5 ? answer - 1 : answer + 1]
    : [num1 + num2, Math.random() < 0.5 ? answer - 1 : answer + 1]
  for (const d of typical) {
    if (choicesSet.size >= 3) break
    if (d >= 0 && d !== answer) choicesSet.add(d)
  }
  let attempts = 0
  while (choicesSet.size < 3 && attempts < 100) {
    attempts++
    const dummy = answer + Math.floor(Math.random() * 5) - 2
    if (dummy >= 0 && dummy <= maxNum && dummy !== answer) {
      choicesSet.add(dummy)
    }
  }
  // 万一3択が揃わない場合のフォールバック
  let fallback = 0
  while (choicesSet.size < 3) {
    if (!choicesSet.has(fallback)) choicesSet.add(fallback)
    fallback++
  }

  const foodEmoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
  const foodEmoji2 = FOOD_EMOJIS[(FOOD_EMOJIS.indexOf(foodEmoji) + 1) % FOOD_EMOJIS.length]
  const equation = `${num1} ${isAddition ? '+' : '-'} ${num2}`

  return {
    num1,
    num2,
    isAddition,
    answer,
    choices: shuffle(Array.from(choicesSet)),
    foodEmoji,
    foodEmoji2,
    equation,
  }
}

interface LogEntry {
  question: MathQuestion
  chosen: number
  ok: boolean
}

type Phase = 'menu' | 'game' | 'result'

function fireConfetti(canvas: HTMLCanvasElement, big: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const n = big ? 120 : 50
  interface Particle {
    x: number; y: number; vx: number; vy: number
    r: number; dy: number; color: string; alpha: number; shape: 'rect' | 'circle'
  }
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#FF8C42', '#5B8DEF']
  const particles: Particle[] = []
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 8
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      r: Math.random() * 6 + 3,
      dy: 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    })
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let active = false
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.015
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

export default function MathPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase, setPhase] = useState<Phase>('menu')
  const [level, setLevel] = useState<number>(1)
  const [count, setCount] = useState<number>(5)
  const [questions, setQuestions] = useState<MathQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [charEmoji, setCharEmoji] = useState('🐶')
  const [isJumping, setIsJumping] = useState(false)
  const [attempt, setAttempt] = useState<0 | 1>(0)      // 0=1かいめ, 1=もういちどチャレンジ
  const [firstWrong, setFirstWrong] = useState<number | null>(null)
  const finishedRef = useRef(false)                      // 「つぎへ」連打による結果二重保存ガード
  const [best, setBest] = useState<MathBest>(() => {
    if (typeof window !== 'undefined') return loadBest()
    return { best: 0 }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') setBest(loadBest())
  }, [])

  const startGame = useCallback(() => {
    const qs = Array.from({ length: count }, () => generateQuestion(level))
    setQuestions(qs)
    setIdx(0)
    setLog([])
    setChosen(null)
    setShowFeedback(false)
    setCharEmoji('🐶')
    setIsJumping(false)
    setAttempt(0)
    setFirstWrong(null)
    finishedRef.current = false
    setPhase('game')
    const q = qs[0]
    const readOperator = q.isAddition ? 'たす' : 'ひく'
    setTimeout(() => speak(`${q.num1} ${readOperator} ${q.num2} は？`), 300)
  }, [level, count])

  const handleAnswer = useCallback((c: number) => {
    if (chosen !== null || c === firstWrong) return
    const q = questions[idx]
    const ok = c === q.answer

    if (attempt === 0) {
      // スコアは1回目の解答のみ記録する
      setLog(prev => [...prev, { question: q, chosen: c, ok }])
      if (ok) {
        setChosen(c)
        setShowFeedback(true)
        speak('せいかい！すごいね！')
        setIsJumping(true)
        if (canvasRef.current) fireConfetti(canvasRef.current, false)
        setTimeout(() => setIsJumping(false), 1000)
      } else {
        // 1回目は答えを見せず、絵を数え直してもういちど
        setFirstWrong(c)
        setAttempt(1)
        setCharEmoji('🐱')
        setTimeout(() => setCharEmoji('🐶'), 1000)
        speak(q.isAddition
          ? 'おしい！えを ゆびで かぞえてみよう！'
          : 'おしい！のこった えを かぞえてみよう！')
      }
      return
    }

    // 2回目: 記録は変えず、答え合わせだけ行う
    setChosen(c)
    setShowFeedback(true)
    if (ok) {
      speak(`できたね！こたえは ${q.answer} だよ！`)
      if (canvasRef.current) fireConfetti(canvasRef.current, false)
    } else {
      speak(`こたえは ${q.answer} だよ！`)
    }
  }, [chosen, firstWrong, attempt, questions, idx])

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= count) {
      if (finishedRef.current) return  // 連打による二重保存を防ぐ
      finishedRef.current = true
      const correctCount = log.filter(l => l.ok).length
      saveBestScore(correctCount, count)
      setBest(loadBest())
      saveScore('youji-math', correctCount, count, `lv${level}`)
      const pct = correctCount / count
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
      setCharEmoji('🐶')
      setIsJumping(false)
      setAttempt(0)
      setFirstWrong(null)
      const q = questions[nextIdx]
      const readOperator = q.isAddition ? 'たす' : 'ひく'
      setTimeout(() => speak(`${q.num1} ${readOperator} ${q.num2} は？`), 300)
    }
  }, [idx, count, log, level, questions])

  // ── MENU ──────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🍎 たしざん・ひきざん</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {/* キャラクター */}
          <div className="flex justify-center gap-4 text-5xl py-2">
            <span>🐶</span>
            <span>🐱</span>
          </div>

          {/* さいこうスコア */}
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-3xl font-black text-orange-500">{best.best}%</div>
            <div className="text-xs text-gray-500 mt-1">さいこう せいかい りつ</div>
          </div>

          {/* レベル */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">レベル</p>
            <div className="flex gap-3">
              {[
                { lv: 1, label: 'かんたん（〜5）' },
                { lv: 2, label: 'ふつう（〜10）' },
                { lv: 3, label: 'むずかしい（〜20）' },
              ].map(({ lv, label }) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                    level === lv
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* もんだいの かず */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 7, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    count === n
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD700)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  // ── GAME ──────────────────────────────────────────────────
  if (phase === 'game') {
    const q = questions[idx]
    const total = count
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
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
                <span>{idx + 1} / {total}</span>
                <span>⭐ {log.filter(l => l.ok).length}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF8C42, #FFD700)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {/* キャラクター */}
          <div
            className="text-center text-5xl"
            style={{
              transition: 'transform 0.3s',
              transform: isJumping ? 'translateY(-16px)' : 'translateY(0)',
            }}
          >
            {charEmoji}
          </div>

          {/* 式 */}
          <div className="bg-white rounded-2xl shadow-md p-5 text-center">
            <p className="text-4xl font-black text-gray-800 mb-2">
              {q.num1} {q.isAddition ? '＋' : '－'} {q.num2} ＝ ？
            </p>
          </div>

          {/* おやつアイコン（答えの数字は見せず、数える足場にする） */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            {q.isAddition ? (
              <>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                    {Array.from({ length: q.num1 }, (_, i) => (
                      <span key={i} className="text-2xl leading-none">{q.foodEmoji}</span>
                    ))}
                  </div>
                  <span className="text-xl font-black text-gray-400">＋</span>
                  <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                    {Array.from({ length: q.num2 }, (_, i) => (
                      <span key={i} className="text-2xl leading-none">{q.foodEmoji2}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  ぜんぶで なんこに なるかな？
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-1 justify-center">
                  {Array.from({ length: q.num1 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-2xl leading-none ${i >= q.answer ? 'opacity-25' : ''}`}
                    >
                      {q.foodEmoji}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  {q.num2}こ なくなったよ。のこりは なんこかな？
                </p>
              </>
            )}
          </div>

          {/* 1かいめ まちがいのあとの はげまし */}
          {attempt === 1 && chosen === null && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
              <p className="font-bold text-amber-600">💪 おしい！もういちど！</p>
              <p className="text-sm text-gray-600 mt-1">
                {q.isAddition
                  ? `${q.foodEmoji}を ゆびで かぞえてみよう`
                  : 'のこっている えを ゆびで かぞえてみよう'}
              </p>
            </div>
          )}

          {/* 3択ボタン */}
          <div className="flex gap-3">
            {q.choices.map((c, i) => {
              let btnClass = 'flex-1 py-4 rounded-2xl text-2xl font-black transition-all '
              if (chosen === null && c === firstWrong) {
                btnClass += 'bg-gray-100 text-gray-300'
              } else if (chosen === null) {
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
                  disabled={chosen !== null || c === firstWrong}
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
                {chosen === q.answer ? (attempt === 0 ? '⭕' : '💪') : '❌'}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {chosen === q.answer
                  ? attempt === 0
                    ? `せいかい！ ${q.equation} ＝ ${q.answer} だよ！`
                    : `できたね！ ${q.equation} ＝ ${q.answer} だよ！`
                  : `こたえは ${q.answer} だよ！ ${q.equation} ＝ ${q.answer}！`}
              </p>
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD700)' }}
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
  const pctResult = correctCount / count
  const stars = pctResult === 1 ? 3 : pctResult >= 0.7 ? 2 : 1
  const resultChar = pctResult >= 0.5 ? '🐶' : '🐱'
  const title =
    stars === 3 ? 'かんぺき！すごい！！' : stars === 2 ? 'よくできました！' : 'またれんしゅうしよう！'

  return (
    <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🍎 けっか</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{resultChar}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-black text-orange-500">
                {correctCount}/{count}
              </div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-500">
                {best.best}%
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
                {l.question.equation} ＝ ?
              </span>
              <span
                className={`font-bold text-xs ${l.ok ? 'text-green-600' : 'text-red-500'}`}
              >
                {l.question.answer}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD700)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-orange-700 text-lg text-center bg-orange-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
