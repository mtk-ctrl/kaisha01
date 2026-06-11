'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { saveScore } from '@/lib/scoreApi'

// --- Math helpers ---
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b
}

// --- Types ---
type Mode = 'lcm' | 'gcd' | 'prime'
type Phase = 'top' | 'levelSelect' | 'countSelect' | 'quiz' | 'result'
type Feedback = 'correct' | 'wrong' | null

type LcmGcdQ = { kind: 'lcmgcd'; a: number; b: number; answer: number; choices: number[]; hint: string }
type PrimeQ   = { kind: 'prime';   n: number; answer: string; choices: string[]; hint: string }
type QuizQuestion = LcmGcdQ | PrimeQ

interface LcmGcdSet { level: number; name: string; badge: string; desc: string; color: string; pairs: [number,number][] }
interface PrimeItem  { n: number; factors: number[] }
interface PrimeSet   { level: number; name: string; badge: string; desc: string; color: string; items: PrimeItem[] }

// --- GCD problem sets (both numbers ≤ 100) ---
const GCD_L1: [number,number][] = [[2,4],[3,6],[3,9],[4,8],[5,10],[5,15],[4,12],[6,12],[6,18],[8,16]]
const GCD_L2: [number,number][] = [[12,18],[15,20],[16,24],[20,30],[18,24],[25,35],[24,36],[21,28],[30,45],[32,48]]
const GCD_L3: [number,number][] = [[36,48],[42,56],[45,60],[48,72],[50,75],[35,49],[28,42],[40,60],[56,70],[54,72]]
const GCD_L4: [number,number][] = [[60,80],[63,84],[72,90],[75,100],[70,98],[65,91],[80,100],[54,90],[44,66],[52,78]]

const GCD_SETS: LcmGcdSet[] = [
  { level:1, name:'レベル1',     badge:'⭐',     desc:'20までの数',              color:'#dbeafe', pairs:GCD_L1 },
  { level:2, name:'レベル2',     badge:'⭐⭐',    desc:'50までの数',              color:'#bfdbfe', pairs:GCD_L2 },
  { level:3, name:'レベル3',     badge:'⭐⭐⭐',   desc:'80までの数',              color:'#93c5fd', pairs:GCD_L3 },
  { level:4, name:'レベル4',     badge:'⭐⭐⭐⭐',  desc:'100までの数',             color:'#60a5fa', pairs:GCD_L4 },
  { level:5, name:'ぜんぶまぜまぜ', badge:'🌀',   desc:'レベル1〜4をシャッフル',  color:'#dbeafe', pairs:[...GCD_L1,...GCD_L2,...GCD_L3,...GCD_L4] },
]

// --- LCM problem sets (LCM ≤ 100) ---
const LCM_L1: [number,number][] = [[2,4],[3,6],[3,9],[4,8],[5,10],[2,10],[5,15],[4,12],[3,12],[6,12]]
const LCM_L2: [number,number][] = [[2,3],[3,4],[4,5],[2,7],[3,5],[4,7],[5,6],[3,8],[4,9],[5,7]]
const LCM_L3: [number,number][] = [[4,6],[6,9],[6,10],[9,12],[8,12],[10,15],[6,14],[8,20],[9,15],[12,18]]
const LCM_L4: [number,number][] = [[7,9],[5,8],[7,8],[9,10],[5,12],[8,9],[7,11],[5,16],[4,25],[9,11]]

const LCM_SETS: LcmGcdSet[] = [
  { level:1, name:'レベル1',     badge:'⭐',     desc:'小さい数から',              color:'#d1fae5', pairs:LCM_L1 },
  { level:2, name:'レベル2',     badge:'⭐⭐',    desc:'少し大きい数',             color:'#a7f3d0', pairs:LCM_L2 },
  { level:3, name:'レベル3',     badge:'⭐⭐⭐',   desc:'さらに大きい数',           color:'#6ee7b7', pairs:LCM_L3 },
  { level:4, name:'レベル4',     badge:'⭐⭐⭐⭐',  desc:'100までの数',              color:'#34d399', pairs:LCM_L4 },
  { level:5, name:'ぜんぶまぜまぜ', badge:'🌀',   desc:'レベル1〜4をシャッフル',   color:'#d1fae5', pairs:[...LCM_L1,...LCM_L2,...LCM_L3,...LCM_L4] },
]

// --- Prime factorization problem sets ---
const PRIME_L1: PrimeItem[] = [
  {n:4,  factors:[2,2]}, {n:6,  factors:[2,3]}, {n:9,  factors:[3,3]},
  {n:10, factors:[2,5]}, {n:14, factors:[2,7]}, {n:15, factors:[3,5]},
  {n:21, factors:[3,7]}, {n:22, factors:[2,11]},{n:25, factors:[5,5]},
  {n:35, factors:[5,7]},
]
const PRIME_L2: PrimeItem[] = [
  {n:8,  factors:[2,2,2]}, {n:12, factors:[2,2,3]}, {n:18, factors:[2,3,3]},
  {n:20, factors:[2,2,5]}, {n:27, factors:[3,3,3]}, {n:28, factors:[2,2,7]},
  {n:30, factors:[2,3,5]}, {n:44, factors:[2,2,11]},{n:45, factors:[3,3,5]},
  {n:50, factors:[2,5,5]},
]
const PRIME_L3: PrimeItem[] = [
  {n:16,  factors:[2,2,2,2]},   {n:24, factors:[2,2,2,3]},  {n:36, factors:[2,2,3,3]},
  {n:40,  factors:[2,2,2,5]},   {n:60, factors:[2,2,3,5]},  {n:72, factors:[2,2,2,3,3]},
  {n:80,  factors:[2,2,2,2,5]}, {n:84, factors:[2,2,3,7]},  {n:90, factors:[2,3,3,5]},
  {n:100, factors:[2,2,5,5]},
]

const PRIME_SETS: PrimeSet[] = [
  { level:1, name:'レベル1',     badge:'⭐',    desc:'25までの数',               color:'#fce7f3', items:PRIME_L1 },
  { level:2, name:'レベル2',     badge:'⭐⭐',   desc:'50までの数',               color:'#fbcfe8', items:PRIME_L2 },
  { level:3, name:'レベル3',     badge:'⭐⭐⭐',  desc:'100までの数',              color:'#f9a8d4', items:PRIME_L3 },
  { level:4, name:'ぜんぶまぜまぜ', badge:'🌀', desc:'レベル1〜3をシャッフル',   color:'#fce7f3', items:[...PRIME_L1,...PRIME_L2,...PRIME_L3] },
]

// --- Utilities ---
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getLcmGcdChoices(answer: number, a: number, b: number, m: 'lcm' | 'gcd'): number[] {
  const candidates = new Set<number>()
  if (m === 'gcd') {
    for (let i = 1; i <= Math.max(a, b); i++) {
      if ((a % i === 0 || b % i === 0) && i !== answer) candidates.add(i)
    }
  } else {
    for (let k = 1; k * a <= 200; k++) { const v = k * a; if (v !== answer) candidates.add(v) }
    for (let k = 1; k * b <= 200; k++) { const v = k * b; if (v !== answer) candidates.add(v) }
    if (a * b !== answer && a * b <= 200) candidates.add(a * b)
  }
  for (let d = 1; candidates.size < 6; d++) {
    if (answer + d > 0) candidates.add(answer + d)
    if (answer - d > 0) candidates.add(answer - d)
  }
  const pool = shuffle(Array.from(candidates))
  return shuffle([answer, ...pool.slice(0, 3)])
}

const PRIME_LIST = [2, 3, 5, 7, 11, 13, 17, 19]

function getPrimeChoices(factors: number[]): string[] {
  const correct = factors.join(' × ')
  const seen = new Set([correct])
  const candidates: string[] = []

  // Replace each factor with the adjacent prime
  for (let i = 0; i < factors.length; i++) {
    const pi = PRIME_LIST.indexOf(factors[i])
    const alts = [
      pi > 0 ? PRIME_LIST[pi - 1] : -1,
      pi < PRIME_LIST.length - 1 ? PRIME_LIST[pi + 1] : -1,
    ].filter(p => p > 0)
    for (const alt of alts) {
      const f = [...factors]; f[i] = alt; f.sort((x, y) => x - y)
      const label = f.join(' × ')
      if (!seen.has(label)) { seen.add(label); candidates.push(label); break }
    }
  }
  // Merge first two primes into composite
  if (factors.length >= 2) {
    const merged = [...factors.slice(2), factors[0] * factors[1]].sort((x, y) => x - y)
    const label = merged.join(' × ')
    if (!seen.has(label)) { seen.add(label); candidates.push(label) }
  }
  // Add one extra factor of 2
  {
    const extra = [...factors, 2].sort((x, y) => x - y)
    const label = extra.join(' × ')
    if (!seen.has(label)) { seen.add(label); candidates.push(label) }
  }
  // Remove the last factor
  if (factors.length >= 2) {
    const fewer = factors.slice(0, -1).sort((x, y) => x - y)
    const label = fewer.join(' × ')
    if (!seen.has(label)) { seen.add(label); candidates.push(label) }
  }

  const pool = shuffle(candidates)
  return shuffle([correct, ...pool.slice(0, 3)])
}

// --- Hint generators ---
function gcdHint(a: number, b: number, ans: number): string {
  const fa = Array.from({ length: a }, (_, i) => i + 1).filter(i => a % i === 0)
  const fb = Array.from({ length: b }, (_, i) => i + 1).filter(i => b % i === 0)
  const common = fa.filter(f => b % f === 0)
  return `${a}のやくすう：${fa.join('・')}　／　${b}のやくすう：${fb.join('・')}　→　共通：${common.join('・')}　→　最大：${ans}`
}

function lcmHint(a: number, b: number, ans: number): string {
  const take = 5
  const ma = Array.from({ length: take }, (_, i) => (i + 1) * a)
  const mb = Array.from({ length: take }, (_, i) => (i + 1) * b)
  const ellA = ma[take - 1] < ans ? '…' : ''
  const ellB = mb[take - 1] < ans ? '…' : ''
  return `${a}のばいすう：${ma.join('・')}${ellA}　／　${b}のばいすう：${mb.join('・')}${ellB}　→　共通でいちばん小さい：${ans}`
}

function primeHint(n: number, factors: number[]): string {
  const steps: string[] = []
  let cur = n
  for (let i = 0; i < factors.length - 1; i++) {
    const next = cur / factors[i]
    steps.push(`${cur} ÷ ${factors[i]} = ${next}`)
    cur = next
  }
  steps.push(`${cur} は素数`)
  return `${steps.join('　→　')}　→　${n} = ${factors.join(' × ')}`
}

// --- Question builders ---
function buildLcmGcdQuestions(pairs: [number,number][], m: 'lcm' | 'gcd', count: number): LcmGcdQ[] {
  return shuffle(
    pairs.map(([a, b]) => {
      const answer = m === 'gcd' ? gcd(a, b) : lcm(a, b)
      return { kind: 'lcmgcd' as const, a, b, answer, choices: getLcmGcdChoices(answer, a, b, m), hint: m === 'gcd' ? gcdHint(a, b, answer) : lcmHint(a, b, answer) }
    })
  ).slice(0, count)
}

function buildPrimeQuestions(items: PrimeItem[], count: number): PrimeQ[] {
  return shuffle(items).slice(0, count).map(({ n, factors }) => ({
    kind: 'prime' as const,
    n,
    answer: factors.join(' × '),
    choices: getPrimeChoices(factors),
    hint: primeHint(n, factors),
  }))
}

const COUNTS = [5, 10]

export default function KoubaiPage() {
  const [phase, setPhase] = useState<Phase>('top')
  const [mode, setMode] = useState<Mode>('lcm')
  const [selectedLevel, setSelectedLevel] = useState(0)
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [wrongChoice, setWrongChoice] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [waitingNext, setWaitingNext] = useState(false)
  const savedRef = useRef(false) // 連打による saveScore 二重送信防止

  function startQuiz(lvlIdx: number, cnt: number, m: Mode) {
    let qs: QuizQuestion[]
    if (m === 'prime') {
      qs = buildPrimeQuestions(PRIME_SETS[lvlIdx].items, cnt)
    } else {
      const sets = m === 'lcm' ? LCM_SETS : GCD_SETS
      qs = buildLcmGcdQuestions(sets[lvlIdx].pairs, m, cnt)
    }
    setQuestions(qs)
    setQIndex(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setFeedback(null)
    setWrongChoice(null)
    setCorrectCount(0)
    setWaitingNext(false)
    savedRef.current = false
    setPhase('quiz')
  }

  const handleChoice = useCallback((choice: string) => {
    if (waitingNext) return
    const q = questions[qIndex]
    const answerStr = q.kind === 'lcmgcd' ? String(q.answer) : q.answer
    if (choice === answerStr) {
      const newCombo = combo + 1
      setScore(s => s + 10 + Math.min(newCombo - 1, 5) * 2)
      setCombo(newCombo)
      setMaxCombo(mc => Math.max(mc, newCombo))
      setCorrectCount(c => c + 1)
      setFeedback('correct')
    } else {
      setCombo(0)
      setWrongChoice(choice)
      setFeedback('wrong')
    }
    setWaitingNext(true)
  }, [waitingNext, questions, qIndex, combo])

  const handleNext = useCallback(() => {
    setFeedback(null)
    setWrongChoice(null)
    setWaitingNext(false)
    if (qIndex + 1 >= questions.length) {
      if (!savedRef.current) {
        savedRef.current = true
        saveScore('koubai', correctCount, questions.length, `${mode}-lv${selectedLevel + 1}`)
      }
      setPhase('result')
    } else {
      setQIndex(i => i + 1)
    }
  }, [qIndex, questions.length, correctCount, mode, selectedLevel])

  const currentSets = mode === 'lcm' ? LCM_SETS : mode === 'gcd' ? GCD_SETS : PRIME_SETS
  const modeColor = mode === 'lcm' ? '#10b981' : mode === 'gcd' ? '#3b82f6' : '#a855f7'
  const modeKanji = mode === 'lcm' ? '最小公倍数' : mode === 'gcd' ? '最大公約数' : '素因数分解'
  const modeFuri  = mode === 'lcm' ? 'さいしょうこうばいすう' : mode === 'gcd' ? 'さいだいこうやくすう' : 'そいんすうぶんかい'

  const stars = (): number => {
    const pct = questions.length > 0 ? correctCount / questions.length : 0
    return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0
  }

  // ---- TOP ----
  if (phase === 'top') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <Link href="/lab" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← ラボへもどる</Link>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>🔢 最小公倍数・最大公約数</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, marginBottom: 28 }}>れんしゅうする もんだいを えらぼう</p>

          {[
            { m: 'lcm' as Mode, emoji: '🔢', kanji: '最小公倍数', furi: 'さいしょうこうばいすう', color: '#10b981', desc: '両方の数の倍数のうち、いちばん小さい数' },
            { m: 'gcd' as Mode, emoji: '📐', kanji: '最大公約数', furi: 'さいだいこうやくすう',   color: '#3b82f6', desc: '両方の数を割り切れる、いちばん大きい数' },
            { m: 'prime' as Mode, emoji: '🔬', kanji: '素因数分解', furi: 'そいんすうぶんかい',  color: '#a855f7', desc: '数を素数だけのかけ算に分解しよう' },
          ].map(({ m, emoji, kanji, furi, color, desc }) => (
            <button
              key={m}
              onClick={() => { setMode(m); setPhase('levelSelect') }}
              style={{
                width: '100%', padding: '22px 20px', marginBottom: 14,
                background: 'white', border: `3px solid ${color}`, borderRadius: 16,
                cursor: 'pointer', textAlign: 'left',
                boxShadow: `0 4px 12px ${color}26`,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color, marginBottom: 2 }}>{kanji}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{furi}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- LEVEL SELECT ----
  if (phase === 'levelSelect') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>← もどる</button>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: modeColor, marginBottom: 2 }}>{modeKanji}</h2>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 20 }}>{modeFuri} — レベルをえらぼう</p>
          {currentSets.map((set, idx) => (
            <button
              key={set.level}
              onClick={() => { setSelectedLevel(idx); setPhase('countSelect') }}
              style={{
                width: '100%', padding: '18px 20px', marginBottom: 10,
                background: set.color, border: `2px solid ${modeColor}`,
                borderRadius: 14, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 2 }}>{set.name}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{set.desc}</div>
                </div>
                <div style={{ fontSize: 18 }}>{set.badge}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- COUNT SELECT ----
  if (phase === 'countSelect') {
    const set = currentSets[selectedLevel]
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button onClick={() => setPhase('levelSelect')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>← もどる</button>
          <h2 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 2 }}>{set.name}</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>なんもん れんしゅうする？</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {COUNTS.map(cnt => (
              <button
                key={cnt}
                onClick={() => { setCount(cnt); startQuiz(selectedLevel, cnt, mode) }}
                style={{
                  padding: '28px 20px', background: 'white',
                  border: `2px solid ${modeColor}`, borderRadius: 14,
                  cursor: 'pointer', fontSize: 26, fontWeight: 'bold', color: modeColor,
                }}
              >
                {cnt}もん
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ---- QUIZ ----
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[qIndex]
    const answerStr = q.kind === 'lcmgcd' ? String(q.answer) : q.answer
    const choices: string[] = q.kind === 'lcmgcd' ? q.choices.map(String) : q.choices
    const isPrime = q.kind === 'prime'
    const bgColor = feedback === 'correct' ? '#d1fae5' : feedback === 'wrong' ? '#fee2e2' : '#f8fafc'

    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button onClick={() => setPhase('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>✕</button>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{qIndex + 1} / {questions.length}もん</div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: modeColor }}>
              {score}点
              {combo > 1 && <span style={{ marginLeft: 6, fontSize: 12, color: '#f59e0b' }}>🔥×{combo}</span>}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 20 }}>
            <div style={{ height: '100%', borderRadius: 3, background: modeColor, width: `${(qIndex / questions.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>

          {/* Question card */}
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', textAlign: 'center', marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{modeKanji}</div>

            {isPrime ? (
              <>
                <div style={{ fontSize: 52, fontWeight: 'bold', marginBottom: 8 }}>{(q as PrimeQ).n}</div>
                <div style={{ fontSize: 15, color: '#374151' }}>を 素因数分解 すると？</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 42, fontWeight: 'bold', letterSpacing: 4, marginBottom: 8 }}>
                  {(q as LcmGcdQ).a} と {(q as LcmGcdQ).b}
                </div>
                <div style={{ fontSize: 15, color: '#374151' }}>の {modeKanji} は？</div>
              </>
            )}

            {/* Feedback + Hint (shown for BOTH correct and wrong) */}
            {waitingNext && (
              <div style={{ marginTop: 14 }}>
                {feedback === 'correct'
                  ? <div style={{ fontSize: 30 }}>⭕ <span style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>せいかい！</span></div>
                  : <div style={{ fontSize: 30 }}>❌ <span style={{ fontSize: 15, color: '#dc2626' }}>せいかいは <strong>{answerStr}</strong></span></div>
                }
                <div style={{
                  marginTop: 10, padding: '10px 14px', background: '#fef3c7',
                  borderRadius: 10, fontSize: 11, color: '#92400e', lineHeight: 1.8, textAlign: 'left',
                }}>
                  💡 {q.hint}
                </div>
              </div>
            )}
          </div>

          {/* Choices */}
          <div style={{ display: 'grid', gridTemplateColumns: isPrime ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {choices.map((choice, idx) => {
              let bg = 'white', border = '2px solid #e5e7eb', textColor = '#1f2937'
              if (waitingNext) {
                if (choice === answerStr) { bg = '#d1fae5'; border = '2px solid #10b981'; textColor = '#065f46' }
                else if (choice === wrongChoice) { bg = '#fee2e2'; border = '2px solid #ef4444'; textColor = '#991b1b' }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  disabled={waitingNext}
                  style={{
                    padding: isPrime ? '14px 16px' : '20px 12px',
                    background: bg, border, borderRadius: 12,
                    cursor: waitingNext ? 'default' : 'pointer',
                    fontSize: isPrime ? 15 : 28,
                    fontWeight: 'bold', color: textColor,
                    textAlign: isPrime ? 'left' : 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {/* Next button — shown only after answering */}
          {waitingNext && (
            <button
              onClick={handleNext}
              style={{
                width: '100%', padding: '16px',
                background: modeColor, color: 'white',
                border: 'none', borderRadius: 14,
                cursor: 'pointer', fontSize: 16, fontWeight: 'bold',
              }}
            >
              {qIndex + 1 >= questions.length ? 'けっかを見る →' : 'つぎへ →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- RESULT ----
  if (phase === 'result') {
    const pct = Math.round((correctCount / questions.length) * 100)
    const starCount = stars()
    const set = currentSets[selectedLevel]
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>{'⭐'.repeat(starCount)}{'☆'.repeat(3 - starCount)}</div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>
            {starCount >= 3 ? 'かんぺき！' : starCount >= 2 ? 'よくできました！' : 'がんばったね！'}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>{modeKanji} / {set.name}</p>

          <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: modeColor }}>{score}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>てん</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{pct}%</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>せいかいりつ</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f59e0b' }}>{maxCombo}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>さいこうコンボ</div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>{correctCount} / {questions.length} もん せいかい</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => startQuiz(selectedLevel, count, mode)}
              style={{ padding: '16px', background: modeColor, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}
            >
              もういちど
            </button>
            <button
              onClick={() => setPhase('levelSelect')}
              style={{ padding: '16px', background: 'white', color: modeColor, border: `2px solid ${modeColor}`, borderRadius: 14, cursor: 'pointer', fontSize: 14 }}
            >
              レベルをえらぶ
            </button>
            <Link
              href="/lab"
              style={{ display: 'block', padding: '16px', background: '#f3f4f6', color: '#6b7280', borderRadius: 14, textDecoration: 'none', fontSize: 14 }}
            >
              ラボへもどる
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
