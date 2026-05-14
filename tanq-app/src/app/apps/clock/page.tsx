'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

type Difficulty = 'jidou' | 'sanjuppun' | 'all'

interface ClockQuestion {
  type: 'read' | 'diff' | 'add'
  h1: number; m1: number; h2?: number; m2?: number
  diffH?: number; diffM?: number
  question: string; correct: string; choices: string[]; explanation: string
}

const TOTAL = 10
const MINS_ALL    = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const MINS_JIDOU  = [0]
const MINS_30     = [0, 30]

function rndHour() { return Math.floor(Math.random() * 12) + 1 }
function rndFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

function formatTime(h: number, m: number) {
  return `${h}時${m === 0 ? 'ちょうど' : `${m}分`}`
}
function formatDiff(h: number, m: number) {
  if (h === 0) return `${m}分`
  if (m === 0) return `${h}時間`
  return `${h}時間${m}分`
}

function makeReadQuestion(mins: number[]): ClockQuestion {
  const h1 = rndHour(); const m1 = rndFrom(mins)
  const correct = formatTime(h1, m1)
  const wrongs = new Set<string>()
  while (wrongs.size < 3) { const w = formatTime(rndHour(), rndFrom(mins)); if (w !== correct) wrongs.add(w) }
  return {
    type: 'read', h1, m1,
    question: 'この時計は何時何分？',
    correct,
    choices: shuffle([correct, ...Array.from(wrongs)]),
    explanation: `長い針が${m1 === 0 ? '12' : m1 / 5}を指すと${m1}分、短い針が${h1}寄りなら${h1}時台。答えは「${correct}」！`,
  }
}

function makeDiffQuestion(): ClockQuestion {
  const h1 = rndHour(); const m1 = rndFrom(MINS_ALL)
  let diffH = rndFrom([0,1,2]); let diffM = rndFrom([0,5,10,15,20,30])
  if (diffH === 0 && diffM === 0) diffM = 15
  const totalMin2 = h1 * 60 + m1 + diffH * 60 + diffM
  const h2 = Math.floor(totalMin2 / 60) % 12 || 12; const m2 = totalMin2 % 60
  const correct = formatDiff(diffH, diffM)
  const wrongSet = new Set<string>()
  while (wrongSet.size < 3) {
    const wH = rndFrom([0,1,2]); const wM = rndFrom([0,5,10,15,20,30])
    const w = formatDiff(wH, wM); if (w !== correct && w !== '0分') wrongSet.add(w)
  }
  return {
    type: 'diff', h1, m1, h2, m2, diffH, diffM,
    question: `${formatTime(h1, m1)}から${formatTime(h2, m2)}まで何時間何分？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet)]),
    explanation: `${formatTime(h1, m1)}→${formatTime(h2, m2)} の差は「${correct}」！`,
  }
}

function makeAddQuestion(): ClockQuestion {
  const h1 = rndHour(); const m1 = rndFrom(MINS_ALL)
  const addH = rnd(0,2); const addM = rndFrom([0,10,15,20,30])
  const totalMin = h1 * 60 + m1 + addH * 60 + addM
  const h2 = Math.floor(totalMin / 60) % 12 || 12; const m2 = totalMin % 60
  const correct = formatTime(h2, m2)
  const wrongSet = new Set<string>()
  while (wrongSet.size < 3) { const w = formatTime(rndHour(), rndFrom(MINS_ALL)); if (w !== correct) wrongSet.add(w) }
  const addLabel = addH > 0 ? (addM > 0 ? `${addH}時間${addM}分` : `${addH}時間`) : `${addM}分`
  return {
    type: 'add', h1, m1, h2, m2,
    question: `${formatTime(h1, m1)}の${addLabel}後は何時？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet)]),
    explanation: `${formatTime(h1, m1)} ＋ ${addLabel} ＝ ${formatTime(h2, m2)}！`,
  }
}

function makeQuestion(diff: Difficulty): ClockQuestion {
  if (diff === 'jidou') return makeReadQuestion(MINS_JIDOU)
  if (diff === 'sanjuppun') return makeReadQuestion(MINS_30)
  const types = [makeReadQuestion, makeReadQuestion, makeDiffQuestion, makeAddQuestion]
  const fn = rndFrom(types)
  return fn === makeReadQuestion ? makeReadQuestion(MINS_ALL) : (fn as () => ClockQuestion)()
}

function AnalogClock({ h, m, size = 180 }: { h: number; m: number; size?: number }) {
  const cx = 100; const cy = 100; const r = 88
  const hourAngle = ((h % 12) + m / 60) * 30 - 90
  const minuteAngle = m * 6 - 90
  const toXY = (angle: number, len: number) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * len,
    y: cy + Math.sin((angle * Math.PI) / 180) * len,
  })
  const hourEnd = toXY(hourAngle, 50); const minuteEnd = toXY(minuteAngle, 70)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = i * 6 - 90; const major = i % 5 === 0
    return { p1: toXY(a, major ? 70 : 77), p2: toXY(a, 83), major }
  })
  const nums = [12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => ({ n, ...toXY(i * 30 - 90, 60) }))
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-[0_0_30px_rgba(0,229,195,0.35)]">
      <circle cx={cx} cy={cy} r={r} fill="#0d2248" stroke="#00e5c3" strokeWidth="3" />
      {ticks.map(({ p1, p2, major }, i) => (
        <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={major ? '#00e5c3' : 'rgba(0,229,195,0.3)'} strokeWidth={major ? 2.5 : 0.8} strokeLinecap="round" />
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

const DIFFICULTIES: { id: Difficulty; label: string; sub: string; badge: string; badgeColor: string; free: boolean }[] = [
  { id: 'jidou',     label: 'ちょうど',     sub: '1時、2時…ぴったりの時刻',       badge: '★',   badgeColor: '#4ade80', free: true  },
  { id: 'sanjuppun', label: '30分まで',     sub: 'ちょうどと30分の時刻',           badge: '★★',  badgeColor: '#f0c040', free: true  },
  { id: 'all',       label: 'ぜんぶ',       sub: '5分きざみ＋時間の計算（プレミアム）', badge: '★★★', badgeColor: '#c4a8ff', free: false },
]

export default function ClockChallenge() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [questions, setQuestions] = useState<ClockQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    setQuestions(Array.from({ length: TOTAL }, () => makeQuestion(diff)))
    setIndex(0); setScore(0); setMiss(0); setSelected(null)
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    if (c === q?.correct) setScore(s => s + 1); else setMiss(m => m + 1)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    setIndex(i => i + 1); setSelected(null)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f0c040] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-3">🕐</div>
        <h1 className="text-4xl font-black mb-1 text-[#f0c040]">時計チャレンジ</h1>
        <p className="text-[#94a3c4] mb-8 text-sm">難易度を選んでね！</p>
        <div className="w-full max-w-xs space-y-3">
          {DIFFICULTIES.map(d => (
            <button key={d.id} onClick={() => startGame(d.id)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all hover:scale-[1.02] text-left"
              style={{ borderColor: `${d.badgeColor}60`, background: `${d.badgeColor}10` }}>
              <span className="text-xl font-black w-12 flex-shrink-0" style={{ color: d.badgeColor }}>{d.badge}</span>
              <div className="flex-1">
                <div className="font-black text-[#e8f0fe]">{d.label}</div>
                <div className="text-xs text-[#94a3c4]">{d.sub}</div>
              </div>
              {d.free && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40">無料</span>
              )}
            </button>
          ))}
        </div>
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
          <div><div className="text-5xl font-black text-[#4ade80]">{score}</div><div className="text-[#94a3c4] text-sm mt-1">正解</div></div>
          <div><div className="text-5xl font-black text-[#f87171]">{miss}</div><div className="text-[#94a3c4] text-sm mt-1">まちがい</div></div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => difficulty && startGame(difficulty)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f0c040] hover:scale-[1.02] transition-all">
            もう一回！
          </button>
          <button onClick={() => setPhase('intro')}
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#f0c040] transition-all">
            難易度を変える
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/10 text-[#94a3c4] hover:text-white transition-all text-center">
            ラボに戻る
          </Link>
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
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{ background: `${typeBadgeColor}20`, color: typeBadgeColor, border: `1px solid ${typeBadgeColor}40` }}>
          {typeLabel}
        </div>
        <p className="text-[#e8f0fe] font-bold text-base mb-5">{q.question}</p>

        {q.type === 'read' && <div className="flex justify-center mb-5"><AnalogClock h={q.h1} m={q.m1} size={180} /></div>}
        {q.type === 'diff' && (
          <div className="flex justify-center gap-4 mb-5 items-center">
            <div className="text-center"><AnalogClock h={q.h1} m={q.m1} size={120} /><p className="text-[#94a3c4] text-xs mt-1">出発</p></div>
            <div className="text-[#94a3c4] text-2xl">→</div>
            <div className="text-center"><AnalogClock h={q.h2!} m={q.m2!} size={120} /><p className="text-[#94a3c4] text-xs mt-1">到着</p></div>
          </div>
        )}
        {q.type === 'add' && <div className="flex justify-center mb-5"><AnalogClock h={q.h1} m={q.m1} size={180} /></div>}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {q.choices.map((c) => {
            let bg = 'rgba(255,255,255,0.07)', border = 'rgba(255,255,255,0.15)', text = '#e8f0fe'
            if (selected !== null) {
              if (c === q.correct) { bg = 'rgba(240,192,64,0.25)'; border = '#f0c040'; text = '#f0c040' }
              else if (c === selected) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
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

        {selected !== null && (
          <div className={`rounded-2xl p-4 mb-4 text-left ${isCorrect ? 'bg-[#f0c040]/10 border border-[#f0c040]/40' : 'bg-[#f87171]/10 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#f0c040' : '#f87171' }}>
              {isCorrect ? '✓ 正解！' : `✗ 正解は「${q.correct}」`}
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
