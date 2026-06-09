'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { playCorrect, playWrong } from '@/lib/audio'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

type Op = '+' | '-' | '×' | '÷'
type Difficulty = 'かんたん' | 'ふつう' | 'むずかしい'
type Mode = 'タイムアタック' | '問題数'

interface Problem {
  question: string
  answer: number
  op: Op
  a: number
  b: number
}

const MATH_BEST_KEY = 'tanq_math_best_v1'
type MathBest = { easy: number; normal: number; hard: number }

function loadMathBest(): MathBest {
  if (typeof window === 'undefined') return { easy: 0, normal: 0, hard: 0 }
  try { return { easy: 0, normal: 0, hard: 0, ...JSON.parse(localStorage.getItem(getDataKey(MATH_BEST_KEY)) || '{}') } } catch { return { easy: 0, normal: 0, hard: 0 } }
}
function saveMathBest(difficulty: Difficulty, score: number) {
  if (typeof window === 'undefined') return
  const DIFF_MAP: Record<Difficulty, keyof MathBest> = { かんたん: 'easy', ふつう: 'normal', むずかしい: 'hard' }
  const best = loadMathBest()
  const key = DIFF_MAP[difficulty]
  if (score > best[key]) {
    best[key] = score
    try { localStorage.setItem(getDataKey(MATH_BEST_KEY), JSON.stringify(best)) } catch {}
  }
}

const DIFFICULTY_CONFIG: Record<Difficulty, { max: number; ops: Op[]; time: number }> = {
  'かんたん':   { max: 10,  ops: ['+', '-'],           time: 60 },
  'ふつう':     { max: 20,  ops: ['+', '-', '×'],      time: 45 },
  'むずかしい': { max: 50,  ops: ['+', '-', '×', '÷'], time: 30 },
}

const PROBLEM_COUNTS = [5, 10, 20, 30] as const

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

// 間違いの「原因」を推測して、答えを見せずに考える足場になるヒントを返す
function getMistakeHint(p: Problem, wrong: number): string {
  const diff = Math.abs(wrong - p.answer)
  if (p.op === '+') {
    if (diff === 10) return 'くり上がりを わすれていないかな？'
    if (diff <= 2) return 'おしい！あと すこし。ゆびで かぞえて たしかめよう'
    return 'ゆっくり もういちど たしてみよう'
  }
  if (p.op === '-') {
    if (diff === 10) return 'くり下がりに 気をつけて！'
    if (diff <= 2) return 'おしい！あと すこし。1ずつ かぞえて たしかめよう'
    return 'ゆっくり もういちど ひいてみよう'
  }
  if (p.op === '×') {
    if (wrong === p.a * (p.b + 1) || wrong === p.a * (p.b - 1) || wrong === (p.a + 1) * p.b || wrong === (p.a - 1) * p.b)
      return `おしい！九九の だんが 1つ ずれてるかも。${p.a}のだんを となえてみよう`
    return `${p.a}を ${p.b}かい たした かずだよ。九九で かんがえよう`
  }
  // ÷
  return `${p.b} に なにを かけたら ${p.a} に なるかな？ 九九の ${p.b}のだんだよ`
}

type Phase = 'select' | 'playing' | 'result'

const GUEST_DIFFICULTIES: Difficulty[] = ['かんたん', 'ふつう']

function isGuestUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('tanq-lab-auth') === 'guest'
}

export default function MathChallenge() {
  const [phase, setPhase] = useState<Phase>('select')
  const [mode, setMode] = useState<Mode>('タイムアタック')
  const [difficulty, setDifficulty] = useState<Difficulty>('ふつう')
  const [targetCount, setTargetCount] = useState<number>(10)
  const [problem, setProblem] = useState<Problem>({ question: '', answer: 0, op: '+', a: 0, b: 0 })
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [missed, setMissed] = useState<Problem[]>([])
  const [timeTaken, setTimeTaken] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  // refでリアルタイム管理（stale closure防止）
  const answeredRef = useRef(0)
  const attemptRef = useRef(0) // いまの問題で何回まちがえたか
  const [answeredDisplay, setAnsweredDisplay] = useState(0)

  const next = useCallback((diff: Difficulty) => {
    setProblem(makeProblem(diff))
    setInput('')
    setFeedback(null)
    setShowAnswer(false)
    setHint(null)
    attemptRef.current = 0
  }, [])

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    setScore(0)
    setMiss(0)
    answeredRef.current = 0
    attemptRef.current = 0
    setAnsweredDisplay(0)
    setTimeLeft(DIFFICULTY_CONFIG[diff].time)
    setTimeTaken(0)
    setProblem(makeProblem(diff))
    setInput('')
    setFeedback(null)
    setShowAnswer(false)
    setHint(null)
    setMissed([])
    startTimeRef.current = Date.now()
    setPhase('playing')
  }, [])

  // タイムアタック用タイマー
  useEffect(() => {
    if (phase !== 'playing' || mode !== 'タイムアタック') return
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
  }, [phase, mode])

  const submitAnswer = useCallback((currentInput: string) => {
    if (!currentInput.trim() || phase !== 'playing') return
    const val = parseInt(currentInput, 10)

    if (val === problem.answer) {
      playCorrect()
      if (attemptRef.current === 0) setScore((s) => s + 1) // 1回目で正解したときだけ得点
      setFeedback('correct')
      setShowAnswer(false)
      setHint(null)

      if (mode === '問題数') {
        const newAnswered = answeredRef.current + 1
        answeredRef.current = newAnswered
        setAnsweredDisplay(newAnswered)
        if (newAnswered >= targetCount) {
          setTimeTaken(Math.round((Date.now() - startTimeRef.current) / 1000))
          setTimeout(() => setPhase('result'), 400)
        } else {
          setTimeout(() => next(difficulty), 400)
        }
      } else {
        setTimeout(() => next(difficulty), 400)
      }
    } else {
      playWrong()
      setFeedback('wrong')
      setInput('')

      if (attemptRef.current === 0) {
        // 1回目のまちがい: 答えは見せず、原因に合わせたヒントを出してもう一度考えさせる
        attemptRef.current = 1
        setMiss((m) => m + 1)
        setMissed((arr) => [...arr, problem])
        setHint(getMistakeHint(problem, val))
        setTimeout(() => setFeedback(null), 600)
        return
      }

      // 2回目のまちがい: 答えを見せて次の問題へ
      setShowAnswer(true)
      setHint(null)

      if (mode === '問題数') {
        const newAnswered = answeredRef.current + 1
        answeredRef.current = newAnswered
        setAnsweredDisplay(newAnswered)
        setTimeout(() => {
          if (newAnswered >= targetCount) {
            setTimeTaken(Math.round((Date.now() - startTimeRef.current) / 1000))
            setPhase('result')
          } else {
            next(difficulty)
          }
        }, 1800)
      } else {
        setTimeout(() => next(difficulty), 1800)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, problem, mode, targetCount, difficulty, next])

  function handleNumpad(key: string) {
    if (phase !== 'playing' || feedback !== null) return
    if (key === '⌫') { setInput(prev => prev.slice(0, -1)); return }
    if (key === '✓') { submitAnswer(input); return }
    if (input.length >= 5) return
    setInput(prev => prev + key)
  }

  useEffect(() => {
    if (phase === 'result') {
      saveMathBest(difficulty, score)
      // タイムアタックは挑戦した問題数（正解+ミス）を total として記録する
      saveScore('math', score, mode === 'タイムアタック' ? score + miss : targetCount, difficulty)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    function onKey(e: KeyboardEvent) {
      if (feedback !== null) return
      if (e.key >= '0' && e.key <= '9') setInput(prev => prev.length < 5 ? prev + e.key : prev)
      else if (e.key === 'Backspace') setInput(prev => prev.slice(0, -1))
      else if (e.key === 'Enter') submitAnswer(input)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, feedback, input, submitAnswer])

  const total = DIFFICULTY_CONFIG[difficulty].time
  const timePct = (timeLeft / total) * 100
  const countPct = (answeredDisplay / targetCount) * 100
  const timeColor = timeLeft > 10 ? '#00e5c3' : '#f87171'

  // ── SELECT ──
  if (phase === 'select') {
    const isGuest = isGuestUser()
    const diffColors: Record<Difficulty, string> = {
      'かんたん': '#4ade80',
      'ふつう': '#60a5fa',
      'むずかしい': '#f87171',
    }
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 py-16">
        <Link href="/lab" className="absolute top-6 left-6 text-[#8892b0] hover:text-[#00e5c3] text-sm transition-colors">
          ← ラボに戻る
        </Link>
        <div className="text-6xl mb-3">🔢</div>
        <h1 className="text-4xl font-black mb-6 text-[#60a5fa]">計算チャレンジ</h1>

        <div className="w-full max-w-sm space-y-6">

          {/* ── モード選択 ── */}
          <div>
            <p className="text-[#8892b0] text-[10px] font-bold mb-2 tracking-widest uppercase">モード</p>
            <div className="flex gap-2">
              {(['タイムアタック', '問題数'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    mode === m
                      ? 'bg-[#60a5fa] text-[#050b14]'
                      : 'bg-white/8 border border-white/15 text-[#8892b0] hover:text-white'
                  }`}
                >
                  {m === 'タイムアタック' ? '⏱ タイムアタック' : '🔢 問題数'}
                </button>
              ))}
            </div>
            <p className="text-[#8892b0] text-[11px] mt-1.5 text-center">
              {mode === 'タイムアタック'
                ? '制限時間内に何問解けるか勝負！'
                : '設定した問題数を解いて正答率を出そう！'}
            </p>
          </div>

          {/* ── 問題数選択（問題数モードのみ） ── */}
          {mode === '問題数' && (
            <div>
              <p className="text-[#8892b0] text-[10px] font-bold mb-2 tracking-widest uppercase">問題数</p>
              <div className="grid grid-cols-4 gap-2">
                {PROBLEM_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setTargetCount(n)}
                    className={`py-3 rounded-xl font-black text-xl transition-all ${
                      targetCount === n
                        ? 'bg-[#60a5fa] text-[#050b14] scale-[1.05]'
                        : 'bg-white/8 border border-white/15 text-[#8892b0] hover:text-white'
                    }`}
                  >
                    {n}
                    <span className="block text-[10px] font-normal opacity-70">問</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 難易度 ── */}
          <div>
            <p className="text-[#8892b0] text-[10px] font-bold mb-2 tracking-widest uppercase">むずかしさを えらんで スタート！</p>
            {isGuest && (
              <div className="mb-3 px-3 py-2 bg-[#f0c040]/10 border border-[#f0c040]/30 rounded-xl text-center">
                <p className="text-[#f0c040] text-xs font-bold">体験中: かんたん・ふつうが使えます</p>
              </div>
            )}
            <div className="grid gap-3">
              {(['かんたん', 'ふつう', 'むずかしい'] as Difficulty[]).map((d) => {
                const cfg = DIFFICULTY_CONFIG[d]
                const locked = isGuest && !GUEST_DIFFICULTIES.includes(d)
                if (locked) {
                  return (
                    <div key={d} className="w-full py-4 rounded-2xl font-black text-xl text-center opacity-40 bg-white/5 border border-white/10 cursor-not-allowed">
                      🔒 {d}
                      <span className="block text-xs font-normal mt-0.5">登録で解放</span>
                    </div>
                  )
                }
                return (
                  <button
                    key={d}
                    onClick={() => startGame(d)}
                    className="w-full py-4 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{ background: diffColors[d], boxShadow: `0 0 20px ${diffColors[d]}40` }}
                  >
                    {d}
                    <span className="block text-xs font-normal mt-0.5 opacity-70">
                      {cfg.ops.join(' ')} &nbsp;|&nbsp;{' '}
                      {mode === 'タイムアタック' ? `${cfg.time}秒` : `${targetCount}問`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    // まちがえた問題の振り返りリスト（両モード共通）
    const missedList = missed.length > 0 ? (
      <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left">
        <p className="text-[#f0c040] text-xs font-bold mb-2">📝 まちがえた もんだい（あとで もういちど！）</p>
        <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
          {missed.map((m, i) => (
            <p key={i} className="text-sm font-bold text-[#e8f0fe] tabular-nums">
              {m.question} = <span className="text-[#4ade80]">{m.answer}</span>
            </p>
          ))}
        </div>
      </div>
    ) : null

    // 問題数モードのリザルト
    if (mode === '問題数') {
      const accuracy = targetCount > 0 ? Math.round((score / targetCount) * 100) : 0
      const rank = accuracy >= 90 ? '🏆 完璧！' : accuracy >= 70 ? '🥇 すごい！' : accuracy >= 50 ? '🥈 よくできました' : '🥉 もう一回！'
      return (
        <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
          <h2 className="text-3xl font-black mb-1 text-[#60a5fa]">{rank.split(' ').slice(1).join(' ')}</h2>
          <p className="text-[#8892b0] text-sm mb-8">
            {difficulty} | {targetCount}問チャレンジ
          </p>

          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <div className="text-5xl font-black text-[#4ade80]">{score}</div>
              <div className="text-[#8892b0] text-xs mt-1">正解</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#f87171]">{miss}</div>
              <div className="text-[#8892b0] text-xs mt-1">ミス</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#f0c040]">{accuracy}%</div>
              <div className="text-[#8892b0] text-xs mt-1">正答率</div>
            </div>
          </div>

          {timeTaken > 0 && (
            <p className="text-[#8892b0] text-sm mb-6">
              ⏱ タイム: <span className="text-[#e8f0fe] font-bold">{timeTaken}秒</span>
            </p>
          )}

          {missedList}

          <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
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
              設定を変える
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

    // タイムアタックのリザルト
    const rank = score >= 20 ? '🏆 天才！' : score >= 12 ? '🥇 すごい！' : score >= 6 ? '🥈 よくできました' : '🥉 つぎは がんばろう！'
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-2 text-[#60a5fa]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#8892b0] mb-8">むずかしさ: {difficulty}</p>

        <div className="flex gap-10 mb-6">
          <div className="text-center">
            <div className="text-5xl font-black text-[#4ade80]">{score}</div>
            <div className="text-[#8892b0] text-sm mt-1">正解</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-[#f87171]">{miss}</div>
            <div className="text-[#8892b0] text-sm mt-1">ミス</div>
          </div>
        </div>

        {missedList}

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
            むずかしさを変える
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

  // ── PLAYING ──
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
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">正解: {score}</span>
          <span className="text-[#f87171]">ミス: {miss}</span>
          {mode === '問題数' && (
            <span className="text-[#60a5fa] font-black">{answeredDisplay + 1}/{targetCount}問</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div
          className="h-full"
          style={{
            width: mode === 'タイムアタック' ? `${timePct}%` : `${countPct}%`,
            background: mode === 'タイムアタック' ? timeColor : '#60a5fa',
            transition: mode === 'タイムアタック' ? 'width 1s linear' : 'width 0.3s ease',
          }}
        />
      </div>

      {/* タイマー or カウンター */}
      {mode === 'タイムアタック' ? (
        <div className="absolute top-20 right-6 text-3xl font-black tabular-nums" style={{ color: timeColor }}>
          {timeLeft}
        </div>
      ) : (
        <div className="absolute top-20 right-6 text-right">
          <div className="text-2xl font-black text-[#60a5fa] tabular-nums leading-none">
            {answeredDisplay + 1}
            <span className="text-[#8892b0] text-base font-normal">/{targetCount}</span>
          </div>
          <div className="text-[#8892b0] text-[10px]">問目</div>
        </div>
      )}

      {/* Problem */}
      <div
        className={`text-center transition-all duration-150 ${feedback === 'correct' ? 'scale-110' : feedback === 'wrong' ? 'shake-x' : ''}`}
      >
        <p className="text-[#8892b0] text-sm mb-6 tracking-widest uppercase">= ?</p>
        <div className="text-7xl font-black mb-10 tracking-tight" style={{ color: feedback === 'wrong' ? '#f87171' : '#e8f0fe' }}>
          {problem.question}
        </div>

        {feedback === 'correct' && (
          <div className="text-3xl font-black text-[#4ade80] mb-6 animate-bounce">
            {attemptRef.current > 0 ? '✓ できた！' : '✓ 正解！'}
          </div>
        )}
        {/* 1回目のまちがい: 答えは見せずにヒントで再挑戦 */}
        {hint && !showAnswer && feedback !== 'correct' && (
          <div className="max-w-xs mx-auto rounded-2xl px-4 py-3 mb-4 border border-[#f0c040]/40 bg-[#f0c040]/10">
            <p className="text-[#f0c040] text-sm font-black mb-0.5">💡 ヒント</p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{hint}</p>
            <p className="text-[#8892b0] text-xs mt-1">もういちど やってみよう！</p>
          </div>
        )}
        {showAnswer && feedback === 'wrong' && (
          <div className="text-xl font-black text-[#f0c040] mb-4">
            答え: <span className="text-3xl">{problem.answer}</span>
            <span className="block text-sm font-normal text-[#8892b0] mt-1">次の問題へ…</span>
          </div>
        )}

        {/* Answer display */}
        <div className="w-52 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-4xl font-black text-center mb-6 min-h-[68px] transition-all"
          style={{ borderColor: feedback === 'correct' ? '#4ade80' : feedback === 'wrong' ? '#f87171' : undefined }}>
          {input || <span className="text-white/25 text-3xl">?</span>}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['7','8','9','4','5','6','1','2','3','⌫','0','✓'].map((key) => (
            <button
              key={key}
              onClick={() => handleNumpad(key)}
              disabled={feedback !== null}
              className={`py-4 rounded-2xl font-black text-2xl transition-all active:scale-90 select-none ${
                key === '✓'
                  ? 'bg-[#60a5fa] text-[#050b14] hover:brightness-110 disabled:opacity-40'
                  : key === '⌫'
                  ? 'bg-white/10 text-[#f87171] hover:bg-white/20 disabled:opacity-40'
                  : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-40'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
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
