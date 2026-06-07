'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

// ---- SVG: Pizza ----
function PizzaSvg({ n, d, color = '#ef4444', size = 130 }: {
  n: number; d: number; color?: string; size?: number
}) {
  const cx = size / 2, cy = size / 2, r = size * 0.44
  if (d <= 1) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill={n > 0 ? color : '#f3f4f6'} stroke="#d1d5db" strokeWidth={1.5} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="#f3f4f6" />
      {Array.from({ length: d }, (_, i) => {
        const a1 = (i / d) * 2 * Math.PI - Math.PI / 2
        const a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
        const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
        const large = 1 / d > 0.5 ? 1 : 0
        return (
          <path key={i}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}Z`}
            fill={i < n ? color : '#f3f4f6'}
            stroke="white" strokeWidth={2}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d1d5db" strokeWidth={1.5} />
    </svg>
  )
}

// ---- SVG: Bar ----
function BarSvg({ n, d, color = '#f59e0b', w = 220, h = 64 }: {
  n: number; d: number; color?: string; w?: number; h?: number
}) {
  const sw = w / d
  return (
    <svg width={w} height={h}>
      <rect x={0} y={0} width={w} height={h} rx={6} fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1.5} />
      {Array.from({ length: d }, (_, i) => (
        <rect key={i} x={i * sw + 2} y={2} width={sw - 4} height={h - 4} rx={3}
          fill={i < n ? color : 'transparent'} />
      ))}
      {Array.from({ length: d - 1 }, (_, i) => (
        <line key={i} x1={(i + 1) * sw} y1={4} x2={(i + 1) * sw} y2={h - 4}
          stroke="#d1d5db" strokeWidth={1.5} />
      ))}
    </svg>
  )
}

// ---- Fraction text display ----
function Frac({ n, d, size = 28, color = '#1f2937' }: {
  n: number; d: number; size?: number; color?: string
}) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, lineHeight: 1.1, color }}>
      <span style={{ fontSize: size, fontWeight: 'bold', lineHeight: 1 }}>{n}</span>
      <span style={{ display: 'block', height: 2.5, background: color, borderRadius: 1, minWidth: size * 0.9 }} />
      <span style={{ fontSize: size, fontWeight: 'bold', lineHeight: 1 }}>{d}</span>
    </span>
  )
}

// ---- Types ----
type VisType = 'pizza' | 'bar'
type Phase = 'top' | 'levelSelect' | 'countSelect' | 'quiz' | 'result'
type Feedback = 'correct' | 'wrong' | null

interface ReadQ {
  kind: 'read'
  n: number; d: number; vis: VisType
  choices: { n: number; d: number }[]
  answerIdx: number
  hint: string
}

interface CompareQ {
  kind: 'compare'
  left: { n: number; d: number }
  right: { n: number; d: number }
  vis: VisType
  answer: 'left' | 'right'
  hint: string
}

type Question = ReadQ | CompareQ

// ---- Utilities ----
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function ri(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)] }

// ---- Question generators ----
function makeReadQ(denoms: number[]): ReadQ {
  const d = pick(denoms)
  const n = ri(1, d - 1)
  const vis: VisType = Math.random() < 0.5 ? 'pizza' : 'bar'

  // Build wrong choices — same denom first, cross-denom to fill gaps
  const seen = new Set<string>([`${n}/${d}`])
  const wrong: { n: number; d: number }[] = []

  // Same-denom candidates
  for (let w = 1; w <= d && wrong.length < 3; w++) {
    if (w !== n) { wrong.push({ n: w, d }); seen.add(`${w}/${d}`) }
  }
  // Cross-denom filler (avoid equivalent fractions)
  const fillers = [2, 3, 4, 6, 8, 12].filter(od => od !== d)
  for (const od of fillers) {
    if (wrong.length >= 3) break
    const on = ri(1, od - 1)
    const key = `${on}/${od}`
    // Skip if equivalent to correct answer
    if (on * d === n * od) continue
    if (!seen.has(key)) { wrong.push({ n: on, d: od }); seen.add(key) }
  }

  const all = shuffle([{ n, d }, ...wrong.slice(0, 3)])
  const answerIdx = all.findIndex(c => c.n === n && c.d === d)
  const hint = `${d}つに等分されていて、色がついているのが${n}つ分 → ${d}分の${n}`
  return { kind: 'read', n, d, vis, choices: all, answerIdx, hint }
}

function makeCompareQ(denoms: number[], sameDenom: boolean): CompareQ {
  const vis: VisType = Math.random() < 0.5 ? 'pizza' : 'bar'
  let ld: number, rd: number, ln: number, rn: number

  if (sameDenom || denoms.length < 2) {
    ld = rd = pick(denoms)
    ln = ri(1, ld - 1)
    do { rn = ri(1, rd - 1) } while (rn === ln)
  } else {
    const sd = shuffle(Array.from(new Set(denoms)))
    ld = sd[0]; rd = sd[1] ?? sd[0]
    if (ld === rd) rd = sd[2] ?? sd[0]  // try to pick different denom
    ln = ri(1, ld - 1); rn = ri(1, rd - 1)
    // Avoid equal fractions
    let t = 0
    while (ln * rd === rn * ld && t < 20) { rn = ri(1, rd - 1); t++ }
    if (ln * rd === rn * ld) { rn = Math.max(1, rn === rd - 1 ? rn - 1 : rn + 1) }
  }

  const answer: 'left' | 'right' = ln / ld >= rn / rd ? 'left' : 'right'
  const winner = answer === 'left' ? { n: ln, d: ld } : { n: rn, d: rd }
  const loser  = answer === 'left' ? { n: rn, d: rd } : { n: ln, d: ld }

  let hint: string
  if (ld === rd) {
    hint = `分母（下）が同じ ${ld}。分子（上）が大きいほうが大きい → ${winner.n}/${winner.d} > ${loser.n}/${loser.d}`
  } else {
    hint = `図で比べると ${winner.n}/${winner.d}（${Math.round(winner.n / winner.d * 100)}%）のほうが ${loser.n}/${loser.d}（${Math.round(loser.n / loser.d * 100)}%）より大きい`
  }
  return { kind: 'compare', left: { n: ln, d: ld }, right: { n: rn, d: rd }, vis, answer, hint }
}

// ---- Levels ----
interface LevelDef {
  id: number; name: string; badge: string; desc: string; color: string
  kind: 'read' | 'compare' | 'mix'; denoms: number[]; sameDenom?: boolean
}

const LEVELS: LevelDef[] = [
  { id:1, name:'レベル1', badge:'⭐',     desc:'図を見て分数を読もう（分母 2〜4）',       color:'#fef9c3', kind:'read',    denoms:[2,3,4] },
  { id:2, name:'レベル2', badge:'⭐⭐',    desc:'図を見て分数を読もう（分母 4〜12）',      color:'#fef08a', kind:'read',    denoms:[4,6,8,12] },
  { id:3, name:'レベル3', badge:'⭐⭐⭐',   desc:'どちらが大きい？（同じ分母）',           color:'#fed7aa', kind:'compare', denoms:[2,3,4,6,8],    sameDenom:true },
  { id:4, name:'レベル4', badge:'⭐⭐⭐⭐',  desc:'どちらが大きい？（ちがう分母）',         color:'#fca5a5', kind:'compare', denoms:[2,3,4,6,8,12], sameDenom:false },
  { id:5, name:'ぜんぶまぜまぜ', badge:'🌀', desc:'レベル1〜4をシャッフル',               color:'#fef9c3', kind:'mix',     denoms:[2,3,4,6,8,12] },
]

function buildQuestions(lv: LevelDef, count: number): Question[] {
  return Array.from({ length: count }, (_, i) => {
    if (lv.kind === 'mix') {
      return i % 2 === 0
        ? makeReadQ(lv.denoms)
        : makeCompareQ(lv.denoms, Math.random() < 0.5)
    }
    if (lv.kind === 'read') return makeReadQ(lv.denoms)
    return makeCompareQ(lv.denoms, lv.sameDenom ?? false)
  })
}

const COUNTS = [5, 10]
const ACCENT = '#f59e0b'
const PIZZA_COLOR = '#ef4444'
const BAR_COLOR = '#f59e0b'

export default function BunsuuPage() {
  const [phase, setPhase] = useState<Phase>('top')
  const [selLv, setSelLv] = useState(0)
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState<Question[]>([])
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [selAns, setSelAns] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [waiting, setWaiting] = useState(false)

  function startQuiz(lvIdx: number, cnt: number) {
    setQuestions(buildQuestions(LEVELS[lvIdx], cnt))
    setQi(0); setScore(0); setCombo(0); setMaxCombo(0)
    setFeedback(null); setSelAns(null); setCorrect(0); setWaiting(false)
    setPhase('quiz')
  }

  const handleAnswer = useCallback((key: string) => {
    if (waiting) return
    const q = questions[qi]
    const ok = q.kind === 'read' ? key === String(q.answerIdx) : key === q.answer
    setSelAns(key)
    if (ok) {
      const nc = combo + 1
      setScore(s => s + 10 + Math.min(nc - 1, 5) * 2)
      setCombo(nc); setMaxCombo(mc => Math.max(mc, nc))
      setCorrect(c => c + 1); setFeedback('correct')
    } else {
      setCombo(0); setFeedback('wrong')
    }
    setWaiting(true)
  }, [waiting, questions, qi, combo])

  const handleNext = useCallback(() => {
    setFeedback(null); setSelAns(null); setWaiting(false)
    if (qi + 1 >= questions.length) setPhase('result')
    else setQi(i => i + 1)
  }, [qi, questions.length])

  function stars(): number {
    const p = questions.length > 0 ? correct / questions.length : 0
    return p >= 0.9 ? 3 : p >= 0.6 ? 2 : p >= 0.3 ? 1 : 0
  }

  const diagram = (n: number, d: number, vis: VisType, sm?: boolean) =>
    vis === 'pizza'
      ? <PizzaSvg n={n} d={d} color={PIZZA_COLOR} size={sm ? 88 : 140} />
      : <BarSvg   n={n} d={d} color={BAR_COLOR}   w={sm ? 150 : 240} h={sm ? 50 : 68} />

  // ---- TOP ----
  if (phase === 'top') return (
    <div style={{ minHeight: '100vh', background: '#fffbeb', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <Link href="/lab" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← ラボへもどる</Link>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '28px 0 20px' }}>
          <div style={{ fontSize: 56 }}>🍕</div>
          <h1 style={{ fontSize: 30, fontWeight: 'bold', margin: '8px 0 4px' }}>分数</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>ぶんすう — 図で分数を理解しよう</p>
        </div>

        {/* Mini preview */}
        <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ textAlign: 'center' }}>
            <PizzaSvg n={3} d={4} color={PIZZA_COLOR} size={72} />
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
              <Frac n={3} d={4} size={16} />
            </div>
          </div>
          <div style={{ fontSize: 22, color: '#d1d5db' }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <BarSvg n={3} d={4} color={BAR_COLOR} w={110} h={44} />
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
              <Frac n={3} d={4} size={16} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setPhase('levelSelect')}
          style={{ width: '100%', padding: 18, background: ACCENT, color: 'white', border: 'none', borderRadius: 16, cursor: 'pointer', fontSize: 18, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245,158,11,0.35)' }}
        >
          レベルをえらぶ →
        </button>
      </div>
    </div>
  )

  // ---- LEVEL SELECT ----
  if (phase === 'levelSelect') return (
    <div style={{ minHeight: '100vh', background: '#fffbeb', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>← もどる</button>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', color: ACCENT, marginBottom: 2 }}>分数</h2>
        <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 20 }}>ぶんすう — レベルをえらぼう</p>
        {LEVELS.map((lv, idx) => (
          <button key={lv.id} onClick={() => { setSelLv(idx); setPhase('countSelect') }}
            style={{ width: '100%', padding: '18px 20px', marginBottom: 10, background: lv.color, border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 2 }}>{lv.name}</div>
                <div style={{ fontSize: 12, color: '#374151' }}>{lv.desc}</div>
              </div>
              <div style={{ fontSize: 18 }}>{lv.badge}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ---- COUNT SELECT ----
  if (phase === 'countSelect') return (
    <div style={{ minHeight: '100vh', background: '#fffbeb', padding: 20 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setPhase('levelSelect')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>← もどる</button>
        <h2 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 24 }}>{LEVELS[selLv].name} — なんもん？</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {COUNTS.map(cnt => (
            <button key={cnt} onClick={() => { setCount(cnt); startQuiz(selLv, cnt) }}
              style={{ padding: '28px 20px', background: 'white', border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', fontSize: 26, fontWeight: 'bold', color: ACCENT }}>
              {cnt}もん
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ---- QUIZ ----
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[qi]
    const bg = feedback === 'correct' ? '#d1fae5' : feedback === 'wrong' ? '#fee2e2' : '#fffbeb'

    return (
      <div style={{ minHeight: '100vh', background: bg, padding: 20, transition: 'background 0.3s' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>✕</button>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{qi + 1} / {questions.length}もん</div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: ACCENT }}>
              {score}点 {combo > 1 && <span style={{ fontSize: 12, color: '#f59e0b' }}>🔥×{combo}</span>}
            </div>
          </div>
          <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 20 }}>
            <div style={{ height: '100%', borderRadius: 3, background: ACCENT, width: `${(qi / questions.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>

          {/* Question card */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            {q.kind === 'read' ? (
              <>
                <p style={{ fontSize: 15, color: '#374151', marginBottom: 16 }}>この図は 何分の何？</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  {diagram(q.n, q.d, q.vis)}
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, color: '#374151', marginBottom: 16 }}>どちらが 大きい？</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    {diagram(q.left.n, q.left.d, q.vis, true)}
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                      <Frac n={q.left.n} d={q.left.d} size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: 22, color: '#d1d5db', fontWeight: 'bold' }}>?</div>
                  <div style={{ textAlign: 'center' }}>
                    {diagram(q.right.n, q.right.d, q.vis, true)}
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                      <Frac n={q.right.n} d={q.right.d} size={18} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Feedback + hint */}
            {waiting && (
              <div style={{ marginTop: 14 }}>
                {feedback === 'correct'
                  ? <div style={{ fontSize: 28 }}>⭕ <span style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>せいかい！</span></div>
                  : <div style={{ fontSize: 28 }}>❌ <span style={{ fontSize: 14, color: '#dc2626' }}>まちがい</span></div>}
                <div style={{ marginTop: 10, padding: '10px 14px', background: '#fef3c7', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.8, textAlign: 'left' }}>
                  💡 {q.hint}
                </div>
              </div>
            )}
          </div>

          {/* Choices */}
          {q.kind === 'read' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {q.choices.map((c, idx) => {
                let bg2 = 'white', border = '2px solid #e5e7eb', col = '#1f2937'
                if (waiting) {
                  if (idx === q.answerIdx)            { bg2 = '#d1fae5'; border = '2px solid #10b981'; col = '#065f46' }
                  else if (selAns === String(idx))    { bg2 = '#fee2e2'; border = '2px solid #ef4444'; col = '#991b1b' }
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(String(idx))} disabled={waiting}
                    style={{ padding: '20px 8px', background: bg2, border, borderRadius: 12, cursor: waiting ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }}>
                    <Frac n={c.n} d={c.d} size={30} color={col} />
                  </button>
                )
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {(['left', 'right'] as const).map(side => {
                const isCorrect = q.answer === side
                let bg2 = 'white', border = '2px solid #e5e7eb', col = '#374151'
                if (waiting) {
                  if (isCorrect)              { bg2 = '#d1fae5'; border = '2px solid #10b981'; col = '#065f46' }
                  else if (selAns === side)   { bg2 = '#fee2e2'; border = '2px solid #ef4444'; col = '#991b1b' }
                }
                return (
                  <button key={side} onClick={() => handleAnswer(side)} disabled={waiting}
                    style={{ padding: '18px 8px', background: bg2, border, borderRadius: 12, cursor: waiting ? 'default' : 'pointer', fontSize: 14, fontWeight: 'bold', color: col, transition: 'all 0.2s' }}>
                    {side === 'left' ? '← 左が大きい' : '右が大きい →'}
                  </button>
                )
              })}
            </div>
          )}

          {waiting && (
            <button onClick={handleNext}
              style={{ width: '100%', padding: 16, background: ACCENT, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
              {qi + 1 >= questions.length ? 'けっかを見る →' : 'つぎへ →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- RESULT ----
  if (phase === 'result') {
    const pct = Math.round((correct / questions.length) * 100)
    const sc = stars()
    return (
      <div style={{ minHeight: '100vh', background: '#fffbeb', padding: 20 }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>{'⭐'.repeat(sc)}{'☆'.repeat(3 - sc)}</div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>
            {sc >= 3 ? 'かんぺき！' : sc >= 2 ? 'よくできました！' : 'がんばったね！'}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>分数 / {LEVELS[selLv].name}</p>

          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 28, fontWeight: 'bold', color: ACCENT }}>{score}</div><div style={{ fontSize: 11, color: '#6b7280' }}>てん</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 'bold' }}>{pct}%</div><div style={{ fontSize: 11, color: '#6b7280' }}>せいかいりつ</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#f59e0b' }}>{maxCombo}</div><div style={{ fontSize: 11, color: '#6b7280' }}>さいこうコンボ</div></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>{correct} / {questions.length} もん せいかい</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => startQuiz(selLv, count)}
              style={{ padding: 16, background: ACCENT, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
              もういちど
            </button>
            <button onClick={() => setPhase('levelSelect')}
              style={{ padding: 16, background: 'white', color: ACCENT, border: `2px solid ${ACCENT}`, borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>
              レベルをえらぶ
            </button>
            <Link href="/lab" style={{ display: 'block', padding: 16, background: '#f3f4f6', color: '#6b7280', borderRadius: 14, textDecoration: 'none', fontSize: 14 }}>
              ラボへもどる
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
