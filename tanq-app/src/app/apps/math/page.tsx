'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { playCorrect, playWrong } from '@/lib/audio'

type Op = '+' | '-' | '×' | '÷'
type Difficulty = 'かんたん' | 'ふつう' | 'むずかしい'

interface Problem {
  question: string
  answer: number
  op: Op
  a: number
  b: number
}

const DIFFICULTY_CONFIG: Record<Difficulty, { max: number; ops: Op[]; time: number }> = {
  'かんたん':   { max: 10,  ops: ['+', '-'],           time: 60 },
  'ふつう':     { max: 20,  ops: ['+', '-', '×'],      time: 45 },
  'むずかしい': { max: 50,  ops: ['+', '-', '×', '÷'], time: 30 },
}

function makeProblem(difficulty: Difficulty): Problem {
  const { max, ops } = DIFFICULTY_CONFIG[difficulty]
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a = Math.floor(Math.random() * max) + 1
  let b = Math.floor(Math.random() * max) + 1
  let answer: number

  if (op === '-') {
    if (a < b) [a, b] = [b, a]
    answer = a - b
  } else if (op === '×') {
    a = Math.floor(Math.random() * 9) + 1
    b = Math.floor(Math.random() * 9) + 1
    answer = a * b
  } else if (op === '÷') {
    b = Math.floor(Math.random() * 9) + 1
    answer = Math.floor(Math.random() * 9) + 1
    a = b * answer
  } else {
    answer = a + b
  }

  return { question: `${a} ${op} ${b}`, answer, op, a, b }
}

type Phase = 'select' | 'playing' | 'result'

export default function MathChallenge() {
  const [phase, setPhase] = useState<Phase>('select')
  const [difficulty, setDifficulty] = useState<Difficulty>('ふつう')
  const [problem, setProblem] = useState<Problem>({ question: '', answer: 0, op: '+', a: 0, b: 0 })
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback((diff: Difficulty) => {
    setProblem(makeProblem(diff))
    setInput('')
    setFeedback(null)
    inputRef.current?.focus()
  }, [])

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    setScore(0)
    setMiss(0)
    setTimeLeft(DIFFICULTY_CONFIG[diff].time)
    setProblem(makeProblem(diff))
    setInput('')
    setFeedback(null)
    setShowAnswer(false)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    inputRef.current?.focus()
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase('result')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || phase !== 'playing') return
    const val = parseInt(input, 10)
    if (val === problem.answer) {
      playCorrect()
      setScore((s) => s + 1)
      setFeedback('correct')
      setShowAnswer(false)
      setTimeout(() => { next(difficulty); setShowAnswer(false) }, 400)
    } else {
      playWrong()
      setMiss((m) => m + 1)
      setFeedback('wrong')
      setShowAnswer(true)
      setInput('')
      setTimeout(() => { setFeedback(null); setShowAnswer(false); inputRef.current?.focus() }, 1800)
    }
  }

  const total = DIFFICULTY_CONFIG[difficulty].time
  const pct = (timeLeft / total) * 100
  const timeColor = timeLeft > 10 ? '#00e5c3' : '#f87171'

  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
        <Link href="/lab" className="absolute top-6 left-6 text-[#8892b0] hover:text-[#00e5c3] text-sm transition-colors">
          ← ラボに戻る
        </Link>
        <div className="text-6xl mb-4">🔢</div>
        <h1 className="text-4xl font-black mb-2 text-[#60a5fa]">計算チャレンジ</h1>
        <p className="text-[#8892b0] mb-10 text-center">制限時間内に何問解けるかな？</p>

        <div className="grid gap-4 w-full max-w-sm">
          {(['かんたん', 'ふつう', 'むずかしい'] as Difficulty[]).map((d) => {
            const cfg = DIFFICULTY_CONFIG[d]
            const colors: Record<Difficulty, string> = {
              'かんたん': '#4ade80',
              'ふつう': '#60a5fa',
              'むずかしい': '#f87171',
            }
            return (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="w-full py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.03]"
                style={{ background: colors[d], boxShadow: `0 0 20px ${colors[d]}40` }}
              >
                {d}
                <span className="block text-xs font-normal mt-1 opacity-70">
                  {cfg.ops.join(' ')} &nbsp;|&nbsp; {cfg.time}秒
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 20 ? '🏆 天才！' : score >= 12 ? '🥇 すごい！' : score >= 6 ? '🥈 よくできました' : '🥉 次は頑張ろう'
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-2 text-[#60a5fa]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#8892b0] mb-8">難易度: {difficulty}</p>

        <div className="flex gap-10 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-[#4ade80]">{score}</div>
            <div className="text-[#8892b0] text-sm mt-1">正解</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-[#f87171]">{miss}</div>
            <div className="text-[#8892b0] text-sm mt-1">ミス</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => startGame(difficulty)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#60a5fa] hover:scale-[1.02] transition-all"
          >
            もう一回！
          </button>
          <button
            onClick={() => setPhase('select')}
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#8892b0] hover:text-white hover:border-white/40 transition-all"
          >
            難易度を変える
          </button>
          <Link
            href="/lab"
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/10 text-[#8892b0] hover:text-[#00e5c3] transition-all text-center"
          >
            ラボに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => { clearInterval(timerRef.current!); setPhase('select') }}
          className="text-[#8892b0] hover:text-white text-sm transition-colors"
        >
          ← やめる
        </button>
        <div className="flex items-center gap-6 text-sm font-bold">
          <span className="text-[#4ade80]">正解: {score}</span>
          <span className="text-[#f87171]">ミス: {miss}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: timeColor }}
        />
      </div>

      {/* Timer countdown */}
      <div className="absolute top-20 right-6 text-3xl font-black tabular-nums" style={{ color: timeColor }}>
        {timeLeft}
      </div>

      {/* Problem */}
      <div
        className={`text-center transition-all duration-150 ${feedback === 'correct' ? 'scale-110' : feedback === 'wrong' ? 'shake-x' : ''}`}
      >
        <p className="text-[#8892b0] text-sm mb-6 tracking-widest uppercase">= ?</p>
        <div className="text-7xl font-black mb-10 tracking-tight" style={{ color: feedback === 'wrong' ? '#f87171' : '#e8f0fe' }}>
          {problem.question}
        </div>

        {feedback === 'correct' && (
          <div className="text-3xl font-black text-[#4ade80] mb-6 animate-bounce">✓ 正解！</div>
        )}
        {showAnswer && feedback === 'wrong' && (
          <div className="text-xl font-black text-[#f0c040] mb-4">
            答え: <span className="text-3xl">{problem.answer}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="こたえは？"
            className="text-center text-3xl font-black w-52 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/30 transition-all"
            autoComplete="off"
          />
          <button
            type="submit"
            className="block mx-auto mt-5 px-10 py-3.5 rounded-2xl font-black text-[#050b14] text-lg bg-[#60a5fa] hover:scale-[1.03] transition-all"
          >
            決定 →
          </button>
        </form>
      </div>

      <style jsx>{`
        .shake-x { animation: shakeX 0.3s ease; }
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-8px); }
          75%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}
