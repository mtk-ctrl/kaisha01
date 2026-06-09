'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

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
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

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
  // ありがちなまちがい①: 短いはりが次の数字寄りに見えて「時」を1すすめて読む
  if (m1 >= 30) {
    const w = formatTime((h1 % 12) + 1, m1)
    if (w !== correct) wrongs.add(w)
  }
  // ありがちなまちがい②: 長いはりと短いはりの取りちがえ（5分きざみモードのみ）
  if (mins.length >= 12) {
    const w = formatTime(m1 === 0 ? 12 : m1 / 5, (h1 % 12) * 5)
    if (w !== correct) wrongs.add(w)
  }
  while (wrongs.size < 3) { const w = formatTime(rndHour(), rndFrom(mins)); if (w !== correct) wrongs.add(w) }
  const explanation = m1 === 0
    ? `長いはりが12をさして、短いはりが${h1}なら「${correct}」！`
    : `長いはりが${m1 / 5}をさすと${m1}分（5×${m1 / 5}）。短いはりは${h1}をすぎたところだから${h1}時。答えは「${correct}」！`
  return {
    type: 'read', h1, m1,
    question: 'この時計は何時何分？',
    correct,
    choices: shuffle([correct, ...Array.from(wrongs).slice(0, 3)]),
    explanation,
  }
}

function makeDiffQuestion(): ClockQuestion {
  const m1 = rndFrom(MINS_ALL)
  let diffH = rndFrom([0,1,2]); let diffM = rndFrom([0,5,10,15,20,30])
  if (diffH === 0 && diffM === 0) diffM = 15
  const carry = m1 + diffM >= 60 ? 1 : 0
  // 12時をまたぐと「逆もどり」に見えて混乱するので、またがない範囲で出題する
  const h1 = rnd(1, 12 - diffH - carry)
  const totalMin2 = h1 * 60 + m1 + diffH * 60 + diffM
  const h2 = Math.floor(totalMin2 / 60); const m2 = totalMin2 % 60
  const correct = formatDiff(diffH, diffM)
  const wrongSet = new Set<string>()
  while (wrongSet.size < 3) {
    const wH = rndFrom([0,1,2]); const wM = rndFrom([0,5,10,15,20,30])
    const w = formatDiff(wH, wM); if (w !== correct && w !== '0分') wrongSet.add(w)
  }
  const explanation = diffH === 0
    ? `${formatTime(h1, m1)}から${formatTime(h2, m2)}まで、長いはりは${diffM}分すすんだよ。答えは「${correct}」！`
    : diffM === 0
    ? `分はおなじで、時だけ${h1}→${h2}と${diffH}すすんだから「${correct}」！`
    : `${formatTime(h1, m1)}から${diffH}時間で${formatTime(h1 + diffH, m1)}、さらに${diffM}分で${formatTime(h2, m2)}。だから「${correct}」！`
  return {
    type: 'diff', h1, m1, h2, m2, diffH, diffM,
    question: `${formatTime(h1, m1)}から${formatTime(h2, m2)}まで何時間何分？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet)]),
    explanation,
  }
}

function makeAddQuestion(): ClockQuestion {
  const h1 = rndHour(); const m1 = rndFrom(MINS_ALL)
  let addH = rnd(0,2); let addM = rndFrom([0,10,15,20,30])
  if (addH === 0 && addM === 0) addM = 30
  const totalMin = h1 * 60 + m1 + addH * 60 + addM
  const h2 = Math.floor(totalMin / 60) % 12 || 12; const m2 = totalMin % 60
  const correct = formatTime(h2, m2)
  const wrongSet = new Set<string>()
  // ありがちなまちがい: 60分のくり上がりわすれ（時が1つ少ない答え）
  if (m1 + addM >= 60) {
    const wH = h2 - 1 === 0 ? 12 : h2 - 1
    const w = formatTime(wH, m2)
    if (w !== correct) wrongSet.add(w)
  }
  while (wrongSet.size < 3) { const w = formatTime(rndHour(), rndFrom(MINS_ALL)); if (w !== correct) wrongSet.add(w) }
  const addLabel = addH > 0 ? (addM > 0 ? `${addH}時間${addM}分` : `${addH}時間`) : `${addM}分`
  const explanation = m1 + addM >= 60
    ? `分は${m1}＋${addM}＝${m1 + addM}分。60分＝1時間だから、1時間くり上がって「${correct}」！`
    : `${formatTime(h1, m1)}から${addLabel}すすめると「${correct}」！`
  return {
    type: 'add', h1, m1, h2, m2, diffH: addH, diffM: addM,
    question: `${formatTime(h1, m1)}の${addLabel}後は何時？`,
    correct,
    choices: shuffle([correct, ...Array.from(wrongSet).slice(0, 3)]),
    explanation,
  }
}

// 間違いの「原因」を推測して、答えを見せずに考える足場になるヒントを返す
function getClockMistakeHint(q: ClockQuestion, wrong: string): string {
  if (q.type === 'read') {
    const nextHourWrong = formatTime((q.h1 % 12) + 1, q.m1)
    if (wrong === nextHourWrong) return `短いはりは、つぎの数字にまだとどいてないよ。とおりすぎた数字が「何時」だよ！`
    const swapped = formatTime(q.m1 === 0 ? 12 : q.m1 / 5, (q.h1 % 12) * 5)
    if (wrong === swapped) return `はりが反対かも！ 太くて短いはりが「何時」、細くて長いはりが「何分」だよ`
    return `短いはりで「何時」、長いはりで「何分」をよもう。長いはりは、さしている数字×5分だよ`
  }
  if (q.type === 'add') {
    if (q.m1 + (q.diffM ?? 0) >= 60) return `分どうしをたすと60分をこえるよ。60分＝1時間にくり上がるのをわすれてないかな？`
    return `まず「時」をたして、つぎに「分」をたしてみよう`
  }
  // diff
  return `2つの時計をくらべよう。まず「時」がいくつすすんだか、つぎに「分」がいくつすすんだかかぞえてみよう`
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

const CLOCK_BEST_KEY = 'tanq_clock_best_v1'
type ClockBest = { jidou: number; sanjuppun: number; all: number }

function loadClockBest(): ClockBest {
  if (typeof window === 'undefined') return { jidou: 0, sanjuppun: 0, all: 0 }
  try { return { jidou: 0, sanjuppun: 0, all: 0, ...JSON.parse(localStorage.getItem(getDataKey(CLOCK_BEST_KEY)) || '{}') } } catch { return { jidou: 0, sanjuppun: 0, all: 0 } }
}
function saveClockBest(difficulty: Difficulty, score: number) {
  if (typeof window === 'undefined') return
  const best = loadClockBest()
  if (score > best[difficulty]) {
    best[difficulty] = score
    try { localStorage.setItem(getDataKey(CLOCK_BEST_KEY), JSON.stringify(best)) } catch {}
  }
}

const DIFFICULTIES: { id: Difficulty; label: string; sub: string; badge: string; badgeColor: string; free: boolean }[] = [
  { id: 'jidou',     label: 'ちょうど',     sub: '1時、2時…ぴったりのじこく',       badge: '★',   badgeColor: '#4ade80', free: true  },
  { id: 'sanjuppun', label: '30分まで',     sub: 'ちょうどと30分のじこく',           badge: '★★',  badgeColor: '#f0c040', free: true  },
  { id: 'all',       label: 'ぜんぶ',       sub: '5分きざみ＋時間の計算（プレミアム）', badge: '★★★', badgeColor: '#c4a8ff', free: false },
]

export default function ClockChallenge() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [questions, setQuestions] = useState<ClockQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [firstWrong, setFirstWrong] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    setQuestions(Array.from({ length: TOTAL }, () => makeQuestion(diff)))
    setIndex(0); setScore(0); setMiss(0); setSelected(null); setFirstWrong(null); setHint(null)
    setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase === 'result' && difficulty !== null) {
      saveClockBest(difficulty, score)
      saveScore('clock', score, TOTAL, difficulty)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function choose(c: string) {
    if (selected !== null || c === firstWrong) return
    if (c === q.correct) {
      // 正解。スコアは1回目で正解したときだけ加算（ヒント後の正解で水増ししない）
      if (firstWrong === null) setScore(s => s + 1)
      setSelected(c); setHint(null)
      return
    }
    if (firstWrong === null) {
      // 1回目のまちがい: 答えは見せず、原因に合わせたヒントでもう一度考えさせる
      setFirstWrong(c)
      setMiss(m => m + 1)
      setHint(getClockMistakeHint(q, c))
      return
    }
    // 2回目のまちがい: 答えと説明を見せる
    setSelected(c); setHint(null)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    setIndex(i => i + 1); setSelected(null); setFirstWrong(null); setHint(null)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f0c040] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-3">🕐</div>
        <h1 className="text-4xl font-black mb-1 text-[#f0c040]">時計チャレンジ</h1>
        <p className="text-[#94a3c4] mb-8 text-sm">レベルをえらんでね！</p>
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
            レベルをかえる
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
            let bg = 'rgba(255,255,255,0.07)', border = 'rgba(255,255,255,0.15)', text = '#e8f0fe', opacity = 1
            if (selected !== null) {
              if (c === q.correct) { bg = 'rgba(240,192,64,0.25)'; border = '#f0c040'; text = '#f0c040' }
              else if (c === selected || c === firstWrong) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            } else if (c === firstWrong) {
              bg = 'rgba(248,113,113,0.15)'; border = '#f87171'; text = '#f87171'; opacity = 0.6
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null || c === firstWrong}
                className="py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text, opacity }}>
                {c}
              </button>
            )
          })}
        </div>

        {selected === null && hint !== null && (
          <div className="rounded-2xl p-4 mb-4 text-left bg-[#f0c040]/10 border border-[#f0c040]/40">
            <p className="font-black text-sm mb-1 text-[#f0c040]">🤔 おしい！ ヒント</p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{hint}</p>
            <p className="text-[#94a3c4] text-xs mt-1">もういちど えらんでみよう！</p>
          </div>
        )}

        {selected !== null && (
          <div className={`rounded-2xl p-4 mb-4 text-left ${isCorrect ? 'bg-[#f0c040]/10 border border-[#f0c040]/40' : 'bg-[#f87171]/10 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#f0c040' : '#f87171' }}>
              {isCorrect ? (firstWrong === null ? '✓ 正解！' : '✓ せいかい！よく気づいたね！') : `✗ 正解は「${q.correct}」`}
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
