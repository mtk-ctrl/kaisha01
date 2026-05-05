'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

type QuestionType = 'read' | 'diff' | 'add'

interface ClockQuestion {
  type: QuestionType
  h1: number
  m1: number
  h2?: number
  m2?: number
  diffH?: number
  diffM?: number
  question: string
  correct: string
  choices: string[]
  explanation: string
}

const MINS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const TOTAL = 10

function rndHour() { return Math.floor(Math.random() * 12) + 1 }
function rndMin() { return MINS[Math.floor(Math.random() * MINS.length)] }
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function formatTime(h: number, m: number): string {
  return `${h}時${m === 0 ? 'ちょうど' : `${m}分`}`
}
function formatDiff(h: number, m: number): string {
  if (h === 0) return `${m}分`
  if (m === 0) return `${h}時間`
  return `${h}時間${m}分`
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeReadQuestion(): ClockQuestion {
  const h1 = rndHour()
  const m1 = rndMin()
  const correct = formatTime(h1, m1)
  const wrongs = new Set<string>()
  while (wrongs.size < 3) {
    const w = formatTime(rndHour(), rndMin())
    if (w !== correct) wrongs.add(w)
  }
  return {
    type: 'read', h1, m1,
    question: 'この時計は何時何分？',
    correct,
    choices: shuffle([correct, ...Array.from(wrongs)]),
    explanation: `長い針（分針）が${m1 === 0 ? '12' : m1 / 5}を指すと${m1}分、短い針（時針）が${h1}と${h1 % 12 + 1}の間にあると${h1}時台だよ。答えは「${correct}」！`,
  }
}

function makeDiffQuestion(): ClockQuestion {
  const h1 = rndHour()
  const m1 = rndMin()
  const diffHOptions = [0, 1, 2, 3]
  const diffMOptions = [0, 5, 10, 15, 20, 30]
  let diffH = diffHOptions[rnd(0, diffHOptions.length - 1)]
  let diffM = diffMOptions[rnd(0, diffMOptions.length - 1)]
  if (diffH === 0 && diffM === 0) diffM = 15
  const totalMin1 = h1 * 60 + m1
  const totalMin2 = totalMin1 + diffH * 60 + diffM
  const h2 = Math.floor(totalMin2 / 60) % 12 || 12
  const m2 = totalMin2 % 60
  const correct = formatDiff(diffH, diffM)
  const wrongSet = new Set<string>()
  while (wrongSet.size < 3) {
    const wH = diffHOptions[rnd(0, diffHOptions.length - 1)]
    const wM = diffMOptions[rnd(0, diffMOptions.length - 1)]
    const w = formatDiff(wH, wM)
    if (w !== correct && w !== '0分') wrongSet.add(w)
  }
  return {
    type: 'diff', h1, m1, h2, m2, diffH, diffM,
    question: `${formatTime(h1, m1)}から${formatTime(h2, m2)}まで何時間何分？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet)]),
    explanation: `${formatTime(h1, m1)}→${formatTime(h2, m2)} の計算: ${diffH > 0 ? `時間は${h2 > h1 ? `${h2 - h1}時間` : `${12 - h1 + h2}時間`}` : ''}${diffM > 0 ? `分は${diffM}分` : ''}。合わせると「${correct}」！`,
  }
}

function makeAddQuestion(): ClockQuestion {
  const h1 = rndHour()
  const m1 = rndMin()
  const addH = rnd(0, 2)
  const addM = [0, 10, 15, 20, 30][rnd(0, 4)]
  const totalMin = h1 * 60 + m1 + addH * 60 + addM
  const h2 = Math.floor(totalMin / 60) % 12 || 12
  const m2 = totalMin % 60
  const correct = formatTime(h2, m2)
  const wrongSet = new Set<string>()
  while (wrongSet.size < 3) {
    const w = formatTime(rndHour(), rndMin())
    if (w !== correct) wrongSet.add(w)
  }
  const addLabel = addH > 0 ? (addM > 0 ? `${addH}時間${addM}分` : `${addH}時間`) : `${addM}分`
  return {
    type: 'add', h1, m1, h2, m2,
    question: `${formatTime(h1, m1)}の${addLabel}後は何時？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet)]),
    explanation: `${formatTime(h1, m1)} + ${addLabel} = ${formatTime(h2, m2)}。${m1 + (addM || 0) >= 60 ? '分が60以上になったら1時間くり上がるよ！' : '時間と分を足すだけ！'} 答えは「${correct}」。`,
  }
}

function makeQuestion(): ClockQuestion {
  const types: (() => ClockQuestion)[] = [makeReadQuestion, makeReadQuestion, makeDiffQuestion, makeAddQuestion]
  return types[rnd(0, types.length - 1)]()
}

function AnalogClock({ h, m, size = 180 }: { h: number; m: number; size?: number }) {
  const cx = 100; const cy = 100; const r = 88
  const hourAngle = ((h % 12) + m / 60) * 30 - 90
  const minuteAngle = m * 6 - 90
  const toXY = (angle: number, len: number) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * len,
    y: cy + Math.sin((angle * Math.PI) / 180) * len,
  })
  const hourEnd = toXY(hourAngle, 50)
  const minuteEnd = toXY(minuteAngle, 70)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = i * 6 - 90
    const major = i % 5 === 0
    const p1 = toXY(a, major ? 70 : 77)
    const p2 = toXY(a, 83)
    return { p1, p2, major }
  })
  const nums = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
    const pos = toXY(i * 30 - 90, 60)
    return { n, ...pos }
  })
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-[0_0_30px_rgba(0,229,195,0.35)]">
      <circle cx={cx} cy={cy} r={r} fill="#0d2248" stroke="#00e5c3" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 5} fill="transparent" stroke="rgba(0,229,195,0.1)" strokeWidth="1" />
      {ticks.map(({ p1, p2, major }, i) => (
        <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={major ? '#00e5c3' : 'rgba(0,229,195,0.3)'}
          strokeWidth={major ? 2.5 : 0.8} strokeLinecap="round" />
      ))}
      {nums.map(({ n, x, y }) => (
        <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill="#e8f0fe" fontSize="13" fontWeight="bold" fontFamily="sans-serif">{n}</text>
      ))}
      <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y} stroke="#e8f0fe" strokeWidth="6" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minuteEnd.x} y2={minuteEnd.y} stroke="#00e5c3" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#c4a8ff" />
    </svg>
  )
}

export default function ClockChallenge() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [questions, setQuestions] = useState<ClockQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback(() => {
    setQuestions(Array.from({ length: TOTAL }, makeQuestion))
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    if (c === q.correct) setScore((s) => s + 1)
    else setMiss((m) => m + 1)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f0c040] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">🕐</div>
        <h1 className="text-4xl font-black mb-2 text-[#f0c040]">時計チャレンジ</h1>
        <p className="text-[#94a3c4] mb-2 max-w-xs leading-relaxed">
          時計の読み方・時間の計算を練習しよう！<br />
          「何時何分？」だけじゃなく、「何時間後？」「どれくらいかかった？」も出るよ。
        </p>
        <p className="text-[#94a3c4] text-sm mb-6">全{TOTAL}問。解説付き！</p>
        <button onClick={startGame}
          className="px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]"
          style={{ background: '#f0c040', boxShadow: '0 0 40px rgba(240,192,64,0.4)' }}>
          スタート！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 時計マスター！' : score >= 7 ? '🥇 すごい！' : score >= 5 ? '🥈 よくできた！' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#f0c040]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">時計チャレンジ {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center"><div className="text-5xl font-black text-[#4ade80]">{score}</div><div className="text-[#94a3c4] text-sm mt-1">正解</div></div>
          <div className="text-center"><div className="text-5xl font-black text-[#f87171]">{miss}</div><div className="text-[#94a3c4] text-sm mt-1">まちがい</div></div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={startGame} className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f0c040] hover:scale-[1.02] transition-all">もう一回！</button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#f0c040] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const q = questions[index]
  if (!q) return null
  const isCorrect = selected === q.correct

  const typeLabel = q.type === 'read' ? '時計の読み方' : q.type === 'diff' ? '時間の差' : '時間の計算'
  const typeBadgeColor = q.type === 'read' ? '#00e5c3' : q.type === 'diff' ? '#c4a8ff' : '#f0c040'

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm">
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

      <div className="w-full max-w-sm text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: `${typeBadgeColor}20`, color: typeBadgeColor, border: `1px solid ${typeBadgeColor}40` }}>
          {typeLabel}
        </div>
        <p className="text-[#e8f0fe] font-bold text-base mb-5">{q.question}</p>

        {/* Clock display */}
        {q.type === 'read' && (
          <div className="flex justify-center mb-5">
            <AnalogClock h={q.h1} m={q.m1} size={180} />
          </div>
        )}
        {q.type === 'diff' && (
          <div className="flex justify-center gap-4 mb-5 items-center">
            <div className="text-center">
              <AnalogClock h={q.h1} m={q.m1} size={120} />
              <p className="text-[#94a3c4] text-xs mt-1">出発</p>
            </div>
            <div className="text-[#94a3c4] text-2xl">→</div>
            <div className="text-center">
              <AnalogClock h={q.h2!} m={q.m2!} size={120} />
              <p className="text-[#94a3c4] text-xs mt-1">到着</p>
            </div>
          </div>
        )}
        {q.type === 'add' && (
          <div className="flex justify-center mb-5">
            <AnalogClock h={q.h1} m={q.m1} size={180} />
          </div>
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
              if (isCor) { bg = 'rgba(240,192,64,0.25)'; border = '#f0c040'; text = '#f0c040' }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {selected !== null && (
          <div className={`rounded-2xl p-4 mb-4 text-left ${isCorrect ? 'bg-[#f0c040]/10 border border-[#f0c040]/40' : 'bg-[#f87171]/10 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#f0c040' : '#f87171' }}>
              {isCorrect ? '✓ 正解！' : `✗ 正解は「${q.correct}」だよ`}
            </p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={goNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: '#f0c040', boxShadow: '0 0 25px rgba(240,192,64,0.35)' }}>
            {index + 1 < TOTAL ? '次の問題 →' : '結果を見る！'}
          </button>
        )}
      </div>
    </div>
  )
}
