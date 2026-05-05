'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

interface ClockProblem {
  hour: number
  minute: number
}

function makeClockProblem(): ClockProblem {
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  return {
    hour: Math.floor(Math.random() * 12) + 1,
    minute: minutes[Math.floor(Math.random() * minutes.length)],
  }
}

function formatTime(h: number, m: number): string {
  return `${h}じ ${m === 0 ? 'ちょうど' : `${m}ふん`}`
}

function makeChoices(correct: ClockProblem): string[] {
  const correctStr = formatTime(correct.hour, correct.minute)
  const choices = new Set<string>([correctStr])
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  while (choices.size < 4) {
    const h = Math.floor(Math.random() * 12) + 1
    const m = minutes[Math.floor(Math.random() * minutes.length)]
    const s = formatTime(h, m)
    if (s !== correctStr) choices.add(s)
  }
  return [...choices].sort(() => Math.random() - 0.5)
}

/* ── SVG Analog Clock ── */
function AnalogClock({ hour, minute }: { hour: number; minute: number }) {
  const cx = 100
  const cy = 100
  const r = 90

  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90
  const minuteAngle = minute * 6 - 90

  const toXY = (angle: number, len: number) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * len,
    y: cy + Math.sin((angle * Math.PI) / 180) * len,
  })

  const hourEnd = toXY(hourAngle, 52)
  const minuteEnd = toXY(minuteAngle, 72)

  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30 - 90
    const inner = i % 3 === 0 ? 72 : 78
    const outer = 85
    const p1 = toXY(angle, inner)
    const p2 = toXY(angle, outer)
    return { p1, p2, major: i % 3 === 0 }
  })

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
    const angle = i * 30 - 90
    const pos = toXY(angle, 62)
    return { n, x: pos.x, y: pos.y }
  })

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" className="drop-shadow-[0_0_30px_rgba(0,229,195,0.3)]">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="#0d2248" stroke="#00e5c3" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 4} fill="transparent" stroke="rgba(0,229,195,0.15)" strokeWidth="1" />

      {/* Tick marks */}
      {tickMarks.map(({ p1, p2, major }, i) => (
        <line
          key={i}
          x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={major ? '#00e5c3' : 'rgba(0,229,195,0.4)'}
          strokeWidth={major ? 2.5 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Numbers */}
      {numbers.map(({ n, x, y }) => (
        <text
          key={n}
          x={x} y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#e8f0fe"
          fontSize="13"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          {n}
        </text>
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cy}
        x2={hourEnd.x} y2={hourEnd.y}
        stroke="#e8f0fe"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx} y1={cy}
        x2={minuteEnd.x} y2={minuteEnd.y}
        stroke="#00e5c3"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#c4a8ff" />
    </svg>
  )
}

const TOTAL = 10

export default function ClockChallenge() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [problem, setProblem] = useState<ClockProblem>(makeClockProblem())
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)
  const [index, setIndex] = useState(0)

  const startGame = useCallback(() => {
    const p = makeClockProblem()
    setProblem(p)
    setChoices(makeChoices(p))
    setSelected(null)
    setScore(0)
    setMiss(0)
    setIndex(0)
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    const correct = formatTime(problem.hour, problem.minute)
    if (c === correct) setScore((s) => s + 1)
    else setMiss((m) => m + 1)

    setTimeout(() => {
      if (index + 1 >= TOTAL) { setPhase('result'); return }
      const p = makeClockProblem()
      setProblem(p)
      setChoices(makeChoices(p))
      setSelected(null)
      setIndex((i) => i + 1)
    }, 900)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f0c040] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">🕐</div>
        <h1 className="text-4xl font-black mb-2 text-[#f0c040]">時計チャレンジ</h1>
        <p className="text-[#94a3c4] mb-6 max-w-xs leading-relaxed">
          アナログ時計を見て、正しい時刻を選ぼう！<br />全10問で何点取れるかな？
        </p>
        <button
          onClick={startGame}
          className="px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]"
          style={{ background: '#f0c040', boxShadow: '0 0 40px rgba(240,192,64,0.4)' }}
        >
          スタート！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 完璧！' : score >= 7 ? '🥇 すごい！' : score >= 5 ? '🥈 よくできた！' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#f0c040]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">時計チャレンジ {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-[#4ade80]">{score}</div>
            <div className="text-[#94a3c4] text-sm mt-1">正解</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-[#f87171]">{miss}</div>
            <div className="text-[#94a3c4] text-sm mt-1">まちがい</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={startGame} className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f0c040] hover:scale-[1.02] transition-all">もう一回！</button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#f0c040] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const correctStr = formatTime(problem.hour, problem.minute)

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <button onClick={() => setPhase('intro')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{index + 1} / {TOTAL}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div className="h-full transition-all duration-500 bg-[#f0c040]" style={{ width: `${(index / TOTAL) * 100}%` }} />
      </div>

      <p className="text-[#94a3c4] text-sm mb-6 tracking-wide">なんじなんぷん？</p>
      <AnalogClock hour={problem.hour} minute={problem.minute} />

      <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm w-full">
        {choices.map((c) => {
          const isCorrect = c === correctStr
          const isSelected = c === selected
          let bg = 'rgba(255,255,255,0.07)'
          let border = 'rgba(255,255,255,0.15)'
          let text = '#e8f0fe'
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(240,192,64,0.2)'; border = '#f0c040'; text = '#f0c040' }
            else if (isSelected) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
          }
          return (
            <button
              key={c}
              onClick={() => choose(c)}
              disabled={selected !== null}
              className="py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] disabled:cursor-default"
              style={{ background: bg, border: `2px solid ${border}`, color: text }}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}
