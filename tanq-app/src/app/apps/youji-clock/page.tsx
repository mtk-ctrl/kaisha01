'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { saveScore } from '@/lib/scoreApi'
import { getDataKey } from '@/lib/storage'

type LevelType = 'read' | 'ampm' | 'after' | 'before' | 'duration'

interface Level {
  id: number; name: string; desc: string; type: LevelType; minStep: number
}

interface Question {
  type: LevelType
  h?: number; m?: number
  fromH?: number; fromM?: number; toH?: number; toM?: number; durationMin?: number
  addMin?: number; subMin?: number; ansH?: number; ansM?: number
  sceneEmoji?: string; sceneText?: string
}

// 午前・午後はとけいの絵だけでは分からないので、生活シーンで判断させる
const AMPM_SCENES: { emoji: string; text: string; hours: number[] }[] = [
  { emoji: '🌅', text: 'あさ おきたよ',           hours: [6, 7] },
  { emoji: '🍳', text: 'あさごはんを たべるよ',   hours: [7, 8] },
  { emoji: '🏫', text: 'ようちえんに いくよ',     hours: [8, 9] },
  { emoji: '🍱', text: 'おひるごはんの じかん',   hours: [12] },
  { emoji: '⚽', text: 'こうえんで あそぶよ',     hours: [15, 16] },
  { emoji: '🍛', text: 'ばんごはんを たべるよ',   hours: [18, 19] },
  { emoji: '🛁', text: 'おふろに はいるよ',       hours: [19, 20] },
  { emoji: '🌙', text: 'もう ねる じかん',        hours: [20, 21] },
]

interface AnswerValue { h?: number; m?: number; ampm?: string }
interface RecordEntry { bestStars: number; bestScore: number; date: string }
type Records = Record<number, RecordEntry>

const LEVELS: Level[] = [
  { id:1, name:'ちょうど',     desc:'〇じ ちょうど',          type:'read',     minStep:60 },
  { id:2, name:'はん',         desc:'〇じはん',               type:'read',     minStep:30 },
  { id:3, name:'5ふんきざみ',  desc:'5ふんごと',              type:'read',     minStep:5  },
  { id:4, name:'1ふんきざみ',  desc:'1ふんごと',              type:'read',     minStep:1  },
  { id:5, name:'午前・午後',   desc:'ごぜん・ごごをこたえる', type:'ampm',     minStep:5  },
  { id:6, name:'なんぷんご？', desc:'〇ふんごは なんじ？',    type:'after',    minStep:5  },
  { id:7, name:'なんぷんまえ？',desc:'〇ふんまえは なんじ？', type:'before',   minStep:5  },
  { id:8, name:'かかった時間', desc:'どれだけかかった？',     type:'duration', minStep:5  },
]

const RECORD_KEY = 'tanq_clock_records_v1'
const COUNT_OPTIONS = [5, 7, 10]

function rand(min: number, max: number) { return min + Math.floor(Math.random() * (max - min + 1)) }
function randStep(step: number) { return Math.floor(Math.random() * (60 / step)) * step }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function makeQuestion(lv: Level): Question {
  const step = lv.minStep
  if (lv.type === 'duration') {
    const fromH = rand(7, 17), fromM = randStep(step)
    const durationMin = randStep(step === 1 ? 1 : 5) + step
    const toM = (fromM + durationMin) % 60
    const toH = (fromH + Math.floor((fromM + durationMin) / 60)) % 24
    return { type: 'duration', fromH, fromM, toH, toM, durationMin }
  }
  if (lv.type === 'after') {
    const h = rand(7, 17), m = randStep(step)
    const addMin = [5,10,15,20,30][Math.floor(Math.random()*5)]
    return { type: 'after', h, m, addMin, ansH: (h + Math.floor((m + addMin) / 60)) % 24, ansM: (m + addMin) % 60 }
  }
  if (lv.type === 'before') {
    const h = rand(8, 18), m = randStep(step)
    const subMin = [5,10,15,20,30][Math.floor(Math.random()*5)]
    return { type: 'before', h, m, subMin, ansH: h - (m < subMin ? 1 : 0), ansM: (m - subMin + 60) % 60 }
  }
  if (lv.type === 'ampm') {
    const scene = AMPM_SCENES[Math.floor(Math.random() * AMPM_SCENES.length)]
    const h = scene.hours[Math.floor(Math.random() * scene.hours.length)]
    return { type: 'ampm', h, m: randStep(step), sceneEmoji: scene.emoji, sceneText: scene.text }
  }
  return { type: 'read', h: rand(1, 12), m: randStep(step) }
}

function getCorrectAnswer(q: Question): AnswerValue {
  if (q.type === 'duration') return { h: Math.floor((q.durationMin ?? 0) / 60), m: (q.durationMin ?? 0) % 60 }
  if (q.type === 'after')    return { h: q.ansH, m: q.ansM }
  if (q.type === 'before')   return { h: q.ansH, m: q.ansM }
  if (q.type === 'ampm')     return { ampm: (q.h ?? 0) < 12 ? 'ごぜん' : 'ごご' }
  return { h: q.h, m: q.m }
}

function makeChoices(q: Question, correct: AnswerValue): AnswerValue[] {
  if (q.type === 'ampm') return shuffle([{ ampm: 'ごぜん' }, { ampm: 'ごご' }])
  const pool = new Set<string>()
  const key = (v: AnswerValue) => `${v.h}-${v.m}`
  const choices: AnswerValue[] = [correct]
  pool.add(key(correct))
  // 「なんじ」よみとりでは、短針のとりちがえでありがちな「1つとなりの じ」を必ず混ぜる
  if (q.type === 'read') {
    const altH = ((correct.h ?? 0) % 12) + 1
    const alt = { h: altH, m: correct.m }
    if (!pool.has(key(alt))) { pool.add(key(alt)); choices.push(alt) }
  }
  let tries = 0
  while (choices.length < 4 && tries++ < 100) {
    const offH = [-1, 0, 0, 1][Math.floor(Math.random()*4)]
    const offM = [-10, -5, 5, 10][Math.floor(Math.random()*4)]
    let dh = (correct.h ?? 0) + offH, dm = (correct.m ?? 0) + offM
    if (dm < 0) { dm += 60; dh-- }
    if (dm >= 60) { dm -= 60; dh++ }
    dh = ((dh - 1 + 12) % 12) + 1
    const v = { h: dh, m: dm }
    if (!pool.has(key(v))) { pool.add(key(v)); choices.push(v) }
  }
  return shuffle(choices)
}

function isCorrect(chosen: AnswerValue, correct: AnswerValue) {
  if (correct.ampm) return chosen.ampm === correct.ampm
  return chosen.h === correct.h && chosen.m === correct.m
}

function formatAnswer(v: AnswerValue, q: Question): string {
  if (v.ampm) return v.ampm
  if (q.type === 'duration') {
    const h = v.h ?? 0, m = v.m ?? 0
    if (h === 0) return `${m}ふん`
    if (m === 0) return `${h}じかん`
    return `${h}じかん ${m}ふん`
  }
  return `${v.h}じ ${v.m === 0 ? 'ちょうど' : v.m + 'ふん'}`
}

function qText(q: Question): string {
  if (q.type === 'duration') return 'どれだけ じかんが かかりましたか？'
  if (q.type === 'after')    return `${q.addMin}ぷん ごは なんじ なんぷん？`
  if (q.type === 'before')   return `${q.subMin}ぷん まえは なんじ なんぷん？`
  if (q.type === 'ampm') { const dh = (q.h ?? 0) % 12 || 12; return `${q.sceneEmoji} ${q.sceneText}。この ${dh}じは ごぜん？ ごご？` }
  return 'なんじ なんぷん ですか？'
}

// 1回目の誤答時に出す「考える足場」ヒント
function retryHint(q: Question): string {
  if (q.type === 'read') return 'おしい！みじかい はりが 「なんじ」だよ。もういちど！'
  return 'おしい！とけいを よくみて もういちど！'
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.2
  window.speechSynthesis.speak(u)
}

function ClockFace({ h, m, size = 160 }: { h: number; m: number; size?: number }) {
  const cx = 100, cy = 100
  const hDeg = (h % 12) * 30 + m * 0.5
  const mDeg = m * 6
  const toXY = (deg: number, r: number) => ({
    x: cx + r * Math.sin((deg * Math.PI) / 180),
    y: cy - r * Math.cos((deg * Math.PI) / 180),
  })
  const hp = toXY(hDeg, 42), mp = toXY(mDeg, 62)

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const deg = i * 6, isMaj = i % 5 === 0
    const rad = (deg - 90) * Math.PI / 180
    const r1 = isMaj ? 78 : 84
    return <line key={i}
      x1={(cx + r1 * Math.cos(rad)).toFixed(1)} y1={(cy + r1 * Math.sin(rad)).toFixed(1)}
      x2={(cx + 90 * Math.cos(rad)).toFixed(1)} y2={(cy + 90 * Math.sin(rad)).toFixed(1)}
      stroke={isMaj ? '#2c3e50' : '#bbb'} strokeWidth={isMaj ? 2.5 : 1}
    />
  })

  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1, deg = (n * 30 - 90) * Math.PI / 180
    return <text key={n}
      x={(cx + 68 * Math.cos(deg)).toFixed(1)} y={(cy + 68 * Math.sin(deg)).toFixed(1)}
      textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="bold" fill="#2c3e50"
    >{n}</text>
  })

  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <circle cx={cx} cy={cy} r="90" fill="white" stroke="#2c3e50" strokeWidth="4"/>
      {ticks}{nums}
      <line x1={cx} y1={cy} x2={hp.x.toFixed(1)} y2={hp.y.toFixed(1)} stroke="#2c3e50" strokeWidth="7" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={mp.x.toFixed(1)} y2={mp.y.toFixed(1)} stroke="#e74c3c" strokeWidth="4" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="5" fill="#2c3e50"/>
    </svg>
  )
}

function loadRecords(): Records {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(RECORD_KEY)) || '{}') } catch { return {} }
}

function saveRecord(lvId: number, stars: number, score: number) {
  const rec = loadRecords()
  const prev = rec[lvId] || { bestStars: 0, bestScore: 0, date: '' }
  rec[lvId] = { bestStars: Math.max(prev.bestStars, stars), bestScore: Math.max(prev.bestScore, score), date: new Date().toLocaleDateString('ja-JP') }
  localStorage.setItem(getDataKey(RECORD_KEY), JSON.stringify(rec))
}

type View = 'menu' | 'game' | 'result'

export default function YoujiClockPage() {
  const [view, setView] = useState<View>('menu')
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0])
  const [count, setCount] = useState(7)
  const [records, setRecords] = useState<Records>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [choices, setChoices] = useState<AnswerValue[]>([])
  const [answered, setAnswered] = useState(false)
  const [chosenIdx, setChosenIdx] = useState<number | null>(null)
  const [attempt, setAttempt] = useState<0 | 1>(0)              // 0=1かいめ, 1=もういちどチャレンジ
  const [firstWrongIdx, setFirstWrongIdx] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { setRecords(loadRecords()) }, [])

  function fireConfetti(big: boolean) {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const particles = Array.from({ length: big ? 120 : 50 }, () => {
      const angle = Math.random() * Math.PI * 2, speed = 3 + Math.random() * 8
      return { x: canvas.width / 2, y: canvas.height / 3, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4, r: Math.random() * 6 + 3, dy: 0.25, color: ['#FF6B6B','#FFD700','#5BA4EF','#4ECDC4','#FF8C42'][Math.floor(Math.random()*5)], alpha: 1, rect: Math.random() < 0.5 }
    })
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); let live = false
      for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.015; if (p.alpha > 0) { live = true; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); if (p.rect) ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); else { ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill() } ctx.restore() } }
      if (live) requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    draw()
  }

  const startGame = useCallback(() => {
    const qs = Array.from({ length: count }, () => makeQuestion(selectedLevel))
    const correctAns = getCorrectAnswer(qs[0])
    setQuestions(qs); setIdx(0); setCorrectCount(0); setScore(0); setCombo(0)
    setAnswered(false); setChosenIdx(null); setAttempt(0); setFirstWrongIdx(null)
    setChoices(makeChoices(qs[0], correctAns))
    setView('game')
    setTimeout(() => speak(qText(qs[0])), 300)
  }, [selectedLevel, count])

  const handleAnswer = useCallback((chosen: AnswerValue, ci: number) => {
    if (answered || ci === firstWrongIdx) return
    const q = questions[idx]
    if (!q) return
    const correctAns = getCorrectAnswer(q)
    const ok = isCorrect(chosen, correctAns)

    // 1回目の誤答は答えを見せず、ヒントを出してもういちど（2択のごぜん・ごごは除く）
    if (attempt === 0 && !ok && q.type !== 'ampm') {
      setAttempt(1); setFirstWrongIdx(ci); setCombo(0)
      speak(retryHint(q))
      return
    }

    setAnswered(true); setChosenIdx(ci)
    const okFirst = ok && attempt === 0   // スコアは1回目の正解のみ
    const newCorrect = correctCount + (okFirst ? 1 : 0)
    const newScore = score + (okFirst ? 10 : 0)
    const newCombo = okFirst ? combo + 1 : 0
    setCorrectCount(newCorrect); setScore(newScore); setCombo(newCombo)
    if (okFirst) { speak('せいかい！'); fireConfetti(false) }
    else if (ok) { speak('できたね！'); fireConfetti(false) }
    else { speak(`ざんねん！${formatAnswer(correctAns, q)} だよ！`) }

    setTimeout(() => {
      if (idx + 1 >= count) {
        const rate = newCorrect / count
        const stars = rate === 1 ? 3 : rate >= 0.7 ? 2 : 1
        saveRecord(selectedLevel.id, stars, newScore)
        saveScore('youji-clock', newCorrect, count, `lv${selectedLevel.id}`)
        if (rate >= 0.7) fireConfetti(true)
        setRecords(loadRecords()); setView('result')
      } else {
        const nextQ = questions[idx + 1]
        const nextAns = getCorrectAnswer(nextQ)
        setIdx(p => p + 1); setAnswered(false); setChosenIdx(null)
        setAttempt(0); setFirstWrongIdx(null)
        setChoices(makeChoices(nextQ, nextAns))
        setTimeout(() => speak(qText(nextQ)), 200)
      }
    }, ok ? 1200 : 2400)  // 誤答時は答えを確認する時間を長めにとる
  }, [answered, firstWrongIdx, attempt, questions, idx, correctCount, score, combo, count, selectedLevel])

  const GREEN = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'

  if (view === 'menu') {
    return (
      <div className="min-h-screen" style={{ background: GREEN }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: GREEN }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">🕑 なんじ かな？</h1>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
            <p className="font-black text-xs text-gray-400 mb-3">レベルをえらんでね</p>
            <div className="space-y-2">
              {LEVELS.map(lv => {
                const rec = records[lv.id]
                const active = selectedLevel.id === lv.id
                return (
                  <button key={lv.id} onClick={() => setSelectedLevel(lv)}
                    className={`w-full rounded-xl p-3 text-left flex items-center justify-between transition-all ${active ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent hover:bg-green-50'}`}>
                    <div>
                      <span className="text-xs font-black bg-green-500 text-white px-2 py-0.5 rounded-full mr-2">Lv{lv.id}</span>
                      <span className="font-black text-sm text-gray-800">{lv.name}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{lv.desc}</div>
                    </div>
                    <div className="text-sm shrink-0">{rec ? '⭐'.repeat(rec.bestStars) : '－'}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
            <p className="font-black text-xs text-gray-400 mb-3">もんすう</p>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${count === n ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}>
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-lg bg-white text-green-600 shadow-lg hover:-translate-y-0.5 transition-all">
            スタート！🕑
          </button>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    const rate = correctCount / count
    const stars = rate === 1 ? 3 : rate >= 0.7 ? 2 : 1
    const msg = rate === 1 ? '🎉 かんぺき！！！' : rate >= 0.7 ? '✨ すごい！！' : rate >= 0.5 ? '👍 よくできました！' : '💪 もう一回！'
    return (
      <div className="min-h-screen" style={{ background: GREEN }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: GREEN }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">けっか</h1>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4 text-center shadow-md">
            <div className="text-5xl mb-2">{rate === 1 ? '🎊' : rate >= 0.7 ? '🌟' : '💪'}</div>
            <div className="font-black text-xl mb-1">{msg}</div>
            <div className="font-black text-4xl text-green-500 my-2">{correctCount}<span className="text-2xl">/{count}</span></div>
            <div className="text-2xl">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
            <div className="text-sm text-gray-400 mt-2">Lv{selectedLevel.id} {selectedLevel.name}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 py-3 rounded-2xl font-black bg-white text-green-600 shadow-md hover:-translate-y-0.5 transition-all">もう一回</button>
            <Link href="/lab" className="flex-1 py-3 rounded-2xl font-black bg-green-700 text-white text-center shadow-md hover:-translate-y-0.5 transition-all">おわる</Link>
          </div>
        </div>
      </div>
    )
  }

  // Game view
  const q = questions[idx]
  if (!q) return null
  const correctAns = getCorrectAnswer(q)

  return (
    <div className="min-h-screen" style={{ background: GREEN }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="sticky top-0 z-10 py-3" style={{ background: GREEN }}>
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setView('menu')} className="text-white font-bold text-sm">← やめる</button>
            <span className="text-white font-black text-sm">{idx + 1}/{count}</span>
            <span className="text-white font-black text-sm">⭐ {score}</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(idx / count) * 100}%` }}/>
          </div>
          {combo >= 2 && (
            <div className="text-center mt-1">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-0.5 rounded-full">🔥 {combo}れんぞく！</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl px-4 py-3 mb-4 text-center font-black text-lg shadow-md">{qText(q)}</div>

        <div className="flex justify-center mb-4">
          {q.type === 'duration' ? (
            <div className="flex gap-3 items-center">
              <ClockFace h={(q.fromH ?? 0) % 12} m={q.fromM ?? 0} size={130}/>
              <span className="text-white font-black text-2xl">→</span>
              <ClockFace h={(q.toH ?? 0) % 12} m={q.toM ?? 0} size={130}/>
            </div>
          ) : (
            <ClockFace h={(q.h ?? 0) % 12} m={q.m ?? 0}/>
          )}
        </div>

        {/* 1かいめ まちがいのあとの はげまし */}
        {attempt === 1 && !answered && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center mb-3">
            <p className="font-black text-amber-600">💪 おしい！もういちど！</p>
            <p className="text-sm font-bold text-gray-600 mt-1">
              {q.type === 'read' ? 'みじかい はりが 「なんじ」だよ' : 'とけいを よく みてね'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {choices.map((c, i) => {
            const isCor = answered && isCorrect(c, correctAns)
            const isWrong = answered && i === chosenIdx && !isCorrect(c, correctAns)
            const isFirstWrong = !answered && i === firstWrongIdx
            return (
              <button key={i} onClick={() => handleAnswer(c, i)} disabled={answered || isFirstWrong}
                className={`py-4 rounded-2xl font-black text-base shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-default
                  ${isCor ? 'bg-green-200 border-2 border-green-500' : isWrong ? 'bg-red-200 border-2 border-red-400' : isFirstWrong ? 'bg-gray-200 text-gray-400' : 'bg-white'}`}>
                {formatAnswer(c, q)}{isCor ? ' ✓' : ''}{isWrong ? ' ✗' : ''}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`mt-4 rounded-2xl p-3 text-center font-black ${chosenIdx !== null && isCorrect(choices[chosenIdx], correctAns) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {chosenIdx !== null && isCorrect(choices[chosenIdx], correctAns)
              ? (attempt === 0 ? '⭕ せいかい！' : '💪 できたね！')
              : `❌ ざんねん！ ${formatAnswer(correctAns, q)} だよ！`}
          </div>
        )}
      </div>
    </div>
  )
}
