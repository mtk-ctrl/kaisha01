'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

// --- Math helpers ---
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b
}

// --- Types ---
type Mode = 'lcm' | 'gcd'
type Phase = 'top' | 'levelSelect' | 'countSelect' | 'quiz' | 'result'
type Feedback = 'correct' | 'wrong' | null

interface Problem { a: number; b: number; answer: number }
interface QuizQuestion { problem: Problem; choices: number[] }

// --- Problem sets ---
const GCD_SETS = [
  {
    level: 1, name: 'レベル1', badge: '⭐', desc: '20以下でかんたん', color: '#dbeafe',
    pairs: [[2,4],[3,6],[3,9],[4,8],[5,10],[5,15],[4,12],[6,12],[6,18],[8,16]] as [number,number][],
  },
  {
    level: 2, name: 'レベル2', badge: '⭐⭐', desc: 'もう少しむずかしく', color: '#bfdbfe',
    pairs: [[4,6],[6,9],[8,12],[6,10],[9,12],[10,15],[8,20],[12,16],[12,18],[9,15]] as [number,number][],
  },
  {
    level: 3, name: 'レベル3', badge: '⭐⭐⭐', desc: '大きい数にチャレンジ', color: '#93c5fd',
    pairs: [[15,20],[14,20],[16,20],[18,20],[15,18],[14,16],[12,20],[7,14],[9,18],[6,20]] as [number,number][],
  },
]

const LCM_SETS = [
  {
    level: 1, name: 'レベル1', badge: '⭐', desc: '一方が他方の倍数', color: '#d1fae5',
    pairs: [[2,4],[3,6],[3,9],[4,8],[5,10],[2,10],[5,15],[4,12],[3,12],[6,12]] as [number,number][],
  },
  {
    level: 2, name: 'レベル2', badge: '⭐⭐', desc: '共通の倍数を探そう', color: '#a7f3d0',
    pairs: [[2,3],[3,4],[4,5],[2,7],[3,5],[4,7],[5,6],[3,8],[4,9],[5,7]] as [number,number][],
  },
  {
    level: 3, name: 'レベル3', badge: '⭐⭐⭐', desc: '共通の因数あり', color: '#6ee7b7',
    pairs: [[4,6],[6,9],[6,10],[9,12],[8,12],[10,15],[6,14],[8,20],[9,15],[12,18]] as [number,number][],
  },
  {
    level: 4, name: 'レベル4', badge: '⭐⭐⭐⭐', desc: '100以下の大きな数', color: '#34d399',
    pairs: [[7,9],[5,8],[7,8],[9,10],[5,12],[8,9],[7,11],[5,16],[4,25],[9,11]] as [number,number][],
  },
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

function getChoices(answer: number, a: number, b: number, mode: Mode): number[] {
  const candidates = new Set<number>()
  if (mode === 'gcd') {
    for (let i = 1; i <= Math.max(a, b); i++) {
      if ((a % i === 0 || b % i === 0) && i !== answer) candidates.add(i)
    }
  } else {
    for (let m = 1; m * a <= 150; m++) {
      const v = m * a; if (v !== answer) candidates.add(v)
    }
    for (let m = 1; m * b <= 150; m++) {
      const v = m * b; if (v !== answer) candidates.add(v)
    }
    if (a * b !== answer && a * b <= 150) candidates.add(a * b)
  }
  for (let d = 1; candidates.size < 6; d++) {
    if (answer + d > 0) candidates.add(answer + d)
    if (answer - d > 0) candidates.add(answer - d)
  }
  const pool = shuffle(Array.from(candidates))
  return shuffle([answer, ...pool.slice(0, 3)])
}

function buildQuestions(pairs: [number,number][], mode: Mode, count: number): QuizQuestion[] {
  const problems: Problem[] = pairs.map(([a, b]) => ({
    a, b, answer: mode === 'gcd' ? gcd(a, b) : lcm(a, b),
  }))
  return shuffle(problems).slice(0, count).map(p => ({
    problem: p,
    choices: getChoices(p.answer, p.a, p.b, mode),
  }))
}

// --- Educational hints shown after wrong answer ---
function gcdHint(a: number, b: number, ans: number): string {
  const fa = Array.from({ length: a }, (_, i) => i + 1).filter(i => a % i === 0)
  const fb = Array.from({ length: b }, (_, i) => i + 1).filter(i => b % i === 0)
  const common = fa.filter(f => b % f === 0)
  return `${a}のやくすう：${fa.join('・')}　${b}のやくすう：${fb.join('・')}　→ 共通：${common.join('・')}　→ いちばん大きい：${ans}`
}

function lcmHint(a: number, b: number, ans: number): string {
  const take = 6
  const ma: number[] = Array.from({ length: take }, (_, i) => (i + 1) * a)
  const mb: number[] = Array.from({ length: take }, (_, i) => (i + 1) * b)
  const ellA = ma[take - 1] < ans ? '…' : ''
  const ellB = mb[take - 1] < ans ? '…' : ''
  return `${a}のばいすう：${ma.join('・')}${ellA}　${b}のばいすう：${mb.join('・')}${ellB}　→ 共通：${ans}`
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
  const [wrongChoice, setWrongChoice] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const currentSet = mode === 'gcd' ? GCD_SETS : LCM_SETS
  const modeColor = mode === 'lcm' ? '#10b981' : '#3b82f6'
  const modeLabel = mode === 'lcm' ? 'さいしょうこうばいすう' : 'さいだいこうやくすう'
  const modeKanji = mode === 'lcm' ? '最小公倍数' : '最大公約数'

  const startQuiz = useCallback((lvlIdx: number, cnt: number) => {
    const set = (mode === 'gcd' ? GCD_SETS : LCM_SETS)[lvlIdx]
    setQuestions(buildQuestions(set.pairs, mode, cnt))
    setQIndex(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setFeedback(null)
    setWrongChoice(null)
    setCorrectCount(0)
    setPhase('quiz')
  }, [mode])

  const handleChoice = useCallback((choice: number) => {
    if (feedback !== null) return
    const q = questions[qIndex]
    const isCorrect = choice === q.problem.answer
    if (isCorrect) {
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
    setTimeout(() => {
      setFeedback(null)
      setWrongChoice(null)
      if (qIndex + 1 >= questions.length) {
        setPhase('result')
      } else {
        setQIndex(i => i + 1)
      }
    }, 2200)
  }, [feedback, questions, qIndex, combo])

  const stars = (): number => {
    const pct = questions.length > 0 ? correctCount / questions.length : 0
    if (pct >= 0.9) return 3
    if (pct >= 0.6) return 2
    if (pct >= 0.3) return 1
    return 0
  }

  // ---- TOP ----
  if (phase === 'top') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <Link href="/lab" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>
              ← ラボへもどる
            </Link>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>
            🔢 こうばいすう・こうやくすう
          </h1>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginBottom: 32 }}>
            れんしゅうする もんだいを えらぼう
          </p>

          <button
            onClick={() => { setMode('lcm'); setPhase('levelSelect') }}
            style={{
              width: '100%', padding: '24px 20px', marginBottom: 16,
              background: 'white', border: '3px solid #10b981', borderRadius: 16,
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 12px rgba(16,185,129,0.15)',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔢</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#10b981', marginBottom: 2 }}>
              さいしょうこうばいすう
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>最小公倍数</div>
            <div style={{ fontSize: 12, color: '#555' }}>
              両方の数の倍数のうち、いちばん小さい数を求めよう／レベル1〜4（100以下）
            </div>
          </button>

          <button
            onClick={() => { setMode('gcd'); setPhase('levelSelect') }}
            style={{
              width: '100%', padding: '24px 20px',
              background: 'white', border: '3px solid #3b82f6', borderRadius: 16,
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 12px rgba(59,130,246,0.15)',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📐</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#3b82f6', marginBottom: 2 }}>
              さいだいこうやくすう
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>最大公約数</div>
            <div style={{ fontSize: 12, color: '#555' }}>
              両方の数を割り切れる、いちばん大きい数を求めよう／レベル1〜3（20以下）
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ---- LEVEL SELECT ----
  if (phase === 'levelSelect') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button
            onClick={() => setPhase('top')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}
          >
            ← もどる
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', color: modeColor, marginBottom: 2 }}>
            {modeLabel}
          </h2>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 24 }}>{modeKanji} — レベルをえらぼう</p>

          {currentSet.map((set, idx) => (
            <button
              key={set.level}
              onClick={() => { setSelectedLevel(idx); setPhase('countSelect') }}
              style={{
                width: '100%', padding: '20px', marginBottom: 12,
                background: set.color, border: `2px solid ${modeColor}`,
                borderRadius: 14, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>{set.name}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{set.desc}</div>
                </div>
                <div style={{ fontSize: 20 }}>{set.badge}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- COUNT SELECT ----
  if (phase === 'countSelect') {
    const set = currentSet[selectedLevel]
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button
            onClick={() => setPhase('levelSelect')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', marginBottom: 16 }}
          >
            ← もどる
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>{set.name}</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>なんもん れんしゅうする？</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {COUNTS.map(cnt => (
              <button
                key={cnt}
                onClick={() => { setCount(cnt); startQuiz(selectedLevel, cnt) }}
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
    const bgColor = feedback === 'correct' ? '#d1fae5' : feedback === 'wrong' ? '#fee2e2' : '#f8fafc'
    const hint = feedback === 'wrong'
      ? (mode === 'gcd' ? gcdHint(q.problem.a, q.problem.b, q.problem.answer) : lcmHint(q.problem.a, q.problem.b, q.problem.answer))
      : null

    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button
              onClick={() => setPhase('top')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}
            >
              ✕
            </button>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              {qIndex + 1} / {questions.length}もん
            </div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: modeColor }}>
              {score}点
              {combo > 1 && (
                <span style={{ marginLeft: 6, fontSize: 12, color: '#f59e0b' }}>🔥×{combo}</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 24 }}>
            <div style={{
              height: '100%', borderRadius: 3, background: modeColor,
              width: `${(qIndex / questions.length) * 100}%`,
              transition: 'width 0.3s',
            }} />
          </div>

          {/* Question card */}
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px 24px',
            textAlign: 'center', marginBottom: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{modeLabel}</div>
            <div style={{ fontSize: 44, fontWeight: 'bold', letterSpacing: 6, marginBottom: 8 }}>
              {q.problem.a} と {q.problem.b}
            </div>
            <div style={{ fontSize: 16, color: '#374151' }}>
              の {modeKanji} は？
            </div>

            {feedback === 'correct' && (
              <div style={{ fontSize: 36, marginTop: 12 }}>⭕</div>
            )}
            {feedback === 'wrong' && (
              <>
                <div style={{ fontSize: 36, marginTop: 12 }}>❌</div>
                <div style={{ fontSize: 15, color: '#dc2626', marginTop: 4 }}>
                  せいかいは <strong>{q.problem.answer}</strong>
                </div>
                {hint && (
                  <div style={{
                    marginTop: 10, padding: '10px 12px', background: '#fef3c7',
                    borderRadius: 10, fontSize: 11, color: '#92400e', lineHeight: 1.7, textAlign: 'left',
                  }}>
                    💡 {hint}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Choices */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {q.choices.map((choice, idx) => {
              let bg = 'white'
              let border = '2px solid #e5e7eb'
              let textColor = '#1f2937'
              if (feedback !== null) {
                if (choice === q.problem.answer) {
                  bg = '#d1fae5'; border = '2px solid #10b981'; textColor = '#065f46'
                } else if (choice === wrongChoice) {
                  bg = '#fee2e2'; border = '2px solid #ef4444'; textColor = '#991b1b'
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  disabled={feedback !== null}
                  style={{
                    padding: '22px 12px', background: bg, border, borderRadius: 14,
                    cursor: feedback !== null ? 'default' : 'pointer',
                    fontSize: 30, fontWeight: 'bold', color: textColor,
                    transition: 'all 0.2s',
                  }}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ---- RESULT ----
  if (phase === 'result') {
    const pct = Math.round((correctCount / questions.length) * 100)
    const starCount = stars()
    const set = currentSet[selectedLevel]
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>
            {'⭐'.repeat(starCount)}{'☆'.repeat(3 - starCount)}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>
            {starCount >= 3 ? 'かんぺき！' : starCount >= 2 ? 'よくできました！' : 'がんばったね！'}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
            {modeKanji} / {set.name}
          </p>

          <div style={{
            background: 'white', borderRadius: 20, padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.07)', marginBottom: 24,
          }}>
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
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
              {correctCount} / {questions.length} もん せいかい
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => startQuiz(selectedLevel, count)}
              style={{
                padding: '16px', background: modeColor, color: 'white',
                border: 'none', borderRadius: 14, cursor: 'pointer',
                fontSize: 16, fontWeight: 'bold',
              }}
            >
              もういちど
            </button>
            <button
              onClick={() => setPhase('levelSelect')}
              style={{
                padding: '16px', background: 'white', color: modeColor,
                border: `2px solid ${modeColor}`, borderRadius: 14, cursor: 'pointer',
                fontSize: 14,
              }}
            >
              レベルをえらぶ
            </button>
            <Link
              href="/lab"
              style={{
                display: 'block', padding: '16px', background: '#f3f4f6', color: '#6b7280',
                borderRadius: 14, textDecoration: 'none', fontSize: 14,
              }}
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
