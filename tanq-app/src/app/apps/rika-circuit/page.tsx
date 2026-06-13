'use client'

// 中学受験 理科〈電気回路（豆電球と乾電池）〉— 計算・思考分野の単元（rika-bane のひな型を踏襲）
// 方式は算数/juku を踏襲: まなぶ（図解導入スライド）→ とく（演習）。
// 演習は2段階ヒント: 1回目不正解=考える足場 → 2回目不正解=答え＋図解説明。
// スコア・進捗は初回解答のみで記録（リトライで水増ししない）。
// 答えバレ防止: 図には電池/電球の配置だけ描き、明るさ（光）は reveal 後のみ表示する。

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CIRCUIT_SLIDES, CIRCUIT_PROBLEMS, CircuitProblem, CircuitSlide, CircuitSpec, CircuitDifficulty } from '@/data/rikaCircuitData'
import { Furigana } from '@/components/Furigana'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'   // Fisher-Yates
import { playCorrect, playWrong } from '@/lib/audio'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const TEAL = '#2BA39A'
const PROGRESS_KEY = 'tanq_rika_circuit_progress_v1'

type Phase = 'manabu' | 'list' | 'solving'

interface ProgressStore { solvedIds: string[] }

function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return { solvedIds: [] }
  try {
    const raw = JSON.parse(localStorage.getItem(getDataKey(PROGRESS_KEY)) || '{}')
    return { solvedIds: Array.isArray(raw.solvedIds) ? raw.solvedIds : [] }
  } catch { return { solvedIds: [] } }
}

function saveSolved(id: string) {
  if (typeof window === 'undefined') return
  const store = loadProgress()
  if (!store.solvedIds.includes(id)) store.solvedIds.push(id)
  try { localStorage.setItem(getDataKey(PROGRESS_KEY), JSON.stringify(store)) } catch {}
}

const DIFF_LABEL: Record<CircuitDifficulty, { label: string; color: string; bg: string }> = {
  1: { label: '★ きほん', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★ れんしゅう', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★ おうよう', color: '#f87171', bg: '#FEF2F2' },
}

// ─────────────────────────────────────
// SVG: 回路図（乾電池🔋・豆電球💡を導線でつなぐ簡易図）
//  解答前は明るさ（光）を出さず中立に描く。reveal 時のみ glow を表示。
// ─────────────────────────────────────

// 1つの豆電球を描く。lit が true（reveal かつ brightness 既知）のとき明るさに応じて光らせる。
function Bulb({ cx, cy, brightness, lit }: { cx: number; cy: number; brightness: number | null; lit: boolean }) {
  // 明るさ→光の半径・色の濃さ。brightness: 0.5=暗い / 1=ふつう / 2=明るい
  const b = brightness ?? 1
  const glowR = lit ? (b >= 2 ? 22 : b >= 1 ? 16 : 11) : 0
  const glowOpacity = lit ? (b >= 2 ? 0.85 : b >= 1 ? 0.6 : 0.3) : 0
  const bulbFill = lit ? (b >= 2 ? '#FFD400' : b >= 1 ? '#FFE873' : '#FFF3B8') : '#FFFFFF'
  return (
    <g>
      {lit && <circle cx={cx} cy={cy} r={glowR} fill="#FFE873" opacity={glowOpacity} />}
      <circle cx={cx} cy={cy} r={11} fill={bulbFill} stroke={INK} strokeWidth="2.2" />
      {/* フィラメント（×印） */}
      <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke={INK} strokeWidth="1.6" />
      <line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} stroke={INK} strokeWidth="1.6" />
    </g>
  )
}

// 乾電池記号（長い線＝＋、短い太線＝−）。count 個を直列/並列で配置。
function BatteryCell({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 9} x2={x} y2={y + 9} stroke={INK} strokeWidth="2.4" />
      <line x1={x + 7} y1={y - 5} x2={x + 7} y2={y + 5} stroke={INK} strokeWidth="4.5" />
    </g>
  )
}

function CircuitDiagram({ spec, reveal = false }: { spec: CircuitSpec; reveal?: boolean }) {
  // reveal かつ brightness が既知のときのみ光らせる（解答前は中立＝答えバレ防止）
  const lit = reveal && spec.brightness !== null

  // 電池の配置文言
  const batLabel = spec.batteryConnect === 'series' && spec.batteries > 1 ? `🔋×${spec.batteries} 直列`
    : spec.batteryConnect === 'parallel' && spec.batteries > 1 ? `🔋×${spec.batteries} 並列`
    : '🔋'
  const bulbLabel = spec.bulbConnect === 'series' && spec.bulbs > 1 ? `💡×${spec.bulbs} 直列`
    : spec.bulbConnect === 'parallel' && spec.bulbs > 1 ? `💡×${spec.bulbs} 並列`
    : '💡'

  // 上辺=導線、左に電池、右(上辺)に豆電球を配置した長方形の回路。
  const W = 220, H = 124
  const L = 24, R = W - 24, T = 30, B = H - 22
  const wire = (d: string) => <path d={d} fill="none" stroke="#8A7D74" strokeWidth="2.4" strokeLinejoin="round" />

  // 豆電球の中心座標（上辺）。直列は横並び、並列は上下2段（上辺から枝分かれ）。
  const bulbXs = spec.bulbs === 1 ? [(L + R) / 2]
    : spec.bulbConnect === 'series' ? [(L + R) / 2 - 26, (L + R) / 2 + 26]
    : [(L + R) / 2, (L + R) / 2]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[240px] mx-auto overflow-visible">
      {/* 外周の導線（長方形） */}
      {wire(`M ${L} ${T} L ${R} ${T}`)}
      {wire(`M ${R} ${T} L ${R} ${B}`)}
      {wire(`M ${R} ${B} L ${L} ${B}`)}
      {wire(`M ${L} ${B} L ${L} ${T}`)}

      {/* 電池（左辺の中央） */}
      <g>
        {spec.batteryConnect === 'series' && spec.batteries > 1 ? (
          <>
            <BatteryCell x={L - 4} y={(T + B) / 2 - 9} />
            <BatteryCell x={L - 4} y={(T + B) / 2 + 13} />
          </>
        ) : spec.batteryConnect === 'parallel' && spec.batteries > 1 ? (
          <>
            <BatteryCell x={L - 11} y={(T + B) / 2} />
            <BatteryCell x={L + 3} y={(T + B) / 2} />
          </>
        ) : (
          <BatteryCell x={L - 4} y={(T + B) / 2} />
        )}
      </g>

      {/* 豆電球 */}
      {spec.bulbs >= 1 && spec.bulbConnect === 'parallel' && spec.bulbs > 1 ? (
        // 並列: 上辺から2本の枝に分けて2個ぶら下げる
        <>
          {wire(`M ${(L + R) / 2 - 30} ${T} L ${(L + R) / 2 - 30} ${T - 12} M ${(L + R) / 2 + 30} ${T} L ${(L + R) / 2 + 30} ${T - 12}`)}
          <Bulb cx={(L + R) / 2 - 30} cy={T - 12} brightness={spec.brightness} lit={lit} />
          <Bulb cx={(L + R) / 2 + 30} cy={T - 12} brightness={spec.brightness} lit={lit} />
        </>
      ) : (
        bulbXs.map((bx, i) => <Bulb key={i} cx={bx} cy={T} brightness={spec.brightness} lit={lit} />)
      )}

      {/* ラベル */}
      {spec.label && (
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="11" fill={TEAL} fontWeight="bold">{spec.label}</text>
      )}
      <text x={L - 4} y={B + 16} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{batLabel}</text>
      <text x={R} y={B + 16} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{bulbLabel}</text>
    </svg>
  )
}

// 複数の回路図を並べて表示（比較問題用）
function CircuitFigures({ specs, reveal = false }: { specs: CircuitSpec[]; reveal?: boolean }) {
  if (!specs || specs.length === 0) return null
  return (
    <div className={specs.length >= 3 ? 'grid grid-cols-1 gap-3' : specs.length === 2 ? 'grid grid-cols-2 gap-2' : ''}>
      {specs.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <CircuitDiagram spec={s} reveal={reveal} />
          {s.caption && <p className="text-[9px] font-bold mt-0.5" style={{ color: SOFT }}>{s.caption}</p>}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────
// まなぶ: スライド
// ─────────────────────────────────────
function SlideCard({ slide }: { slide: CircuitSlide }) {
  return (
    <div className="rounded-[22px] overflow-hidden" style={{ border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
      <div className="px-4 py-3" style={{ background: INK }}>
        <p className="font-black text-sm" style={{ color: '#FFF6E5' }}>📖 {slide.title}</p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{ background: '#FFFFFF' }}>
        {slide.diagrams && <CircuitFigures specs={slide.diagrams} reveal />}
      </div>
      <div className="px-4 pb-4 pt-2 space-y-1.5" style={{ background: '#FFFFFF' }}>
        {slide.points.map((point, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
              style={{ background: '#FFC83D', border: `1.5px solid ${INK}`, color: INK, marginTop: 1 }}>
              {i + 1}
            </span>
            <p className="text-xs font-bold leading-relaxed" style={{ color: INK }}>
              <Furigana text={point} />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────
// とく: 問題ソルバー（2段階ヒント）
// ─────────────────────────────────────
type SolveStatus = 'try' | 'correct' | 'revealed'

function ProblemSolver({ problem, onDone, onNext, isLast }: {
  problem: CircuitProblem
  onDone: (id: string, firstTry: boolean, solved: boolean) => void
  onNext: () => void
  isLast: boolean
}) {
  const [choices] = useState<string[]>(() => shuffle([...problem.choices]))
  const [status, setStatus] = useState<SolveStatus>('try')
  const [attempt, setAttempt] = useState<0 | 1>(0)
  const [wrongChoices, setWrongChoices] = useState<string[]>([])
  const [firstTryCorrect, setFirstTryCorrect] = useState(false)

  const diff = DIFF_LABEL[problem.difficulty]
  const finished = status !== 'try'

  function handleChoice(val: string) {
    if (finished || wrongChoices.includes(val)) return
    if (val === problem.answer) {
      playCorrect()
      const first = attempt === 0
      setFirstTryCorrect(first)
      setStatus('correct')
      onDone(problem.id, first, true)
      return
    }
    playWrong()
    setWrongChoices(prev => [...prev, val])
    if (attempt === 0) {
      setAttempt(1)
    } else {
      setStatus('revealed')
      onDone(problem.id, false, false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: diff.bg, border: `2px solid ${diff.color}`, color: diff.color }}>
          {diff.label}
        </span>
        <span className="text-[11px] font-bold" style={{ color: SOFT }}>{problem.title}</span>
      </div>

      <div className="rounded-[18px] p-4" style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
        <p className="font-bold text-sm leading-relaxed" style={{ color: INK }}>
          <Furigana text={problem.problemText} />
        </p>
      </div>

      {!finished && problem.diagrams.length > 0 && (
        <div className="rounded-[18px] p-3" style={{ background: '#FFFFFF', border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <CircuitFigures specs={problem.diagrams} />
        </div>
      )}

      {status === 'try' && attempt === 1 && (
        <div className="rounded-[18px] p-4" style={{ background: '#FFF6D6', border: `3px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <p className="font-black text-sm mb-1" style={{ color: '#ca8a04' }}>💡 おしい！いっしょに考えよう</p>
          <p className="text-xs font-bold leading-relaxed" style={{ color: INK }}>
            <Furigana text={problem.scaffoldHint} />
          </p>
        </div>
      )}

      {!finished && (
        <div className="grid grid-cols-2 gap-2">
          {choices.map(c => {
            const isWrong = wrongChoices.includes(c)
            return (
              <button key={c} onClick={() => handleChoice(c)} disabled={isWrong}
                className="py-3 px-2 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                style={{
                  background: isWrong ? '#FFE3EE' : '#FFFFFF',
                  border: `2.5px solid ${isWrong ? '#FF6F9C' : INK}`,
                  boxShadow: isWrong ? 'none' : `2px 2px 0 0 ${INK}`,
                  color: INK,
                  opacity: isWrong ? 0.45 : 1,
                }}>
                {c}
                {problem.answerUnit && <span className="text-xs font-bold ml-1" style={{ color: SOFT }}>{problem.answerUnit}</span>}
              </button>
            )
          })}
        </div>
      )}

      {status === 'correct' && (
        <div className="rounded-[18px] p-4 space-y-3" style={{ background: '#DBF6F0', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-lg" style={{ color: TEAL }}>
              {firstTryCorrect ? 'せいかい！' : 'できた！'}
            </span>
          </div>
          <div className="rounded-2xl bg-white/70 p-2">
            <CircuitFigures specs={problem.diagrams} reveal />
          </div>
          <p className="text-sm font-bold leading-relaxed" style={{ color: INK }}>
            <Furigana text={problem.explanation} />
          </p>
          <button onClick={onNext}
            className="w-full py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, color: INK }}>
            {isLast ? 'このセットをおわる 🏁' : 'つぎの問題 →'}
          </button>
        </div>
      )}

      {status === 'revealed' && (
        <div className="rounded-[18px] p-4 space-y-3" style={{ background: '#FFF1B8', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span className="font-black text-lg" style={{ color: '#C99700' }}>こたえは…</span>
          </div>
          <div className="rounded-2xl px-4 py-3 text-center" style={{ background: '#FFFFFF', border: `2.5px solid ${INK}` }}>
            <span className="font-black text-2xl" style={{ color: INK }}>{problem.answer}</span>
            {problem.answerUnit && <span className="font-black text-base ml-1" style={{ color: SOFT }}>{problem.answerUnit}</span>}
          </div>
          <div className="rounded-2xl bg-white/70 p-2">
            <CircuitFigures specs={problem.diagrams} reveal />
          </div>
          <p className="text-sm font-bold leading-relaxed" style={{ color: INK }}>
            <Furigana text={problem.explanation} />
          </p>
          <p className="text-[11px] font-bold leading-relaxed" style={{ color: '#8A7D74' }}>
            ※ この問題はまだ「クリア」になっていないよ。あとでもう一度ちょうせんしてみてね。
          </p>
          <button onClick={onNext}
            className="w-full py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, color: INK }}>
            {isLast ? 'このセットをおわる 🏁' : 'つぎの問題 →'}
          </button>
        </div>
      )}

      {!finished && attempt === 0 && (
        <p className="text-center text-[10px] font-bold" style={{ color: '#B0A49C' }}>
          まちがえてもだいじょうぶ。ヒントが出るよ
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────
// メインページ
// ─────────────────────────────────────
export default function RikaCircuitPage() {
  const [phase, setPhase] = useState<Phase>('manabu')
  const [slideIdx, setSlideIdx] = useState(0)
  const [selectedDiff, setSelectedDiff] = useState<CircuitDifficulty>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSolvedIds(loadProgress().solvedIds)
  }, [])

  const problemsOf = useCallback((d: CircuitDifficulty) => CIRCUIT_PROBLEMS.filter(p => p.difficulty === d), [])
  const currentList = problemsOf(selectedDiff)
  const currentProblem = currentList[problemIndex]

  const handleDone = useCallback((id: string, firstTry: boolean, solved: boolean) => {
    setSessionResults(prev => (id in prev ? prev : { ...prev, [id]: firstTry }))
    if (solved) {
      setSolvedIds(prev => prev.includes(id) ? prev : [...prev, id])
      saveSolved(id)
    }
  }, [])

  const goNext = useCallback(() => {
    if (problemIndex < currentList.length - 1) {
      setProblemIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const attempted = currentList.filter(p => p.id in sessionResults)
      if (attempted.length > 0) {
        const score = attempted.filter(p => sessionResults[p.id]).length
        saveScore('rika-circuit', score, attempted.length, `★${selectedDiff}`)
      }
      setSessionResults({})
      setProblemIndex(0)
      setPhase('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [problemIndex, currentList, sessionResults, selectedDiff])

  const totalSolved = solvedIds.filter(id => CIRCUIT_PROBLEMS.some(p => p.id === id)).length
  const totalProblems = CIRCUIT_PROBLEMS.length
  const pct = Math.round(totalSolved / totalProblems * 100)
  const slide = CIRCUIT_SLIDES[slideIdx]

  return (
    <div className="min-h-screen pb-24 font-sans"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}>
      <div className="max-w-md mx-auto">
        <div className="px-4 pt-6 pb-2">
          <Link href="/juken#rika" className="inline-flex items-center gap-1 text-sm font-bold mb-3" style={{ color: SOFT }}>
            ← 理科の単元マップにもどる
          </Link>
          <div className="rounded-[22px] p-4 flex items-center gap-3"
            style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#DBF6F0', border: `2.5px solid ${INK}`, boxShadow: `2px 2px 0 0 ${INK}` }}>
              🔋
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold" style={{ color: SOFT }}>中学受験 理科〈物理〉</p>
              <h1 className="font-black text-lg leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                電気回路（豆電球と乾電池）
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: TEAL }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: SOFT }}>{totalSolved}/{totalProblems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4 space-y-4">
          {phase === 'manabu' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background: '#DBF6F0', border: `2px solid ${INK}`, color: TEAL }}>
                  📖 まなぶ {slideIdx + 1}/{CIRCUIT_SLIDES.length}
                </span>
                <button onClick={() => setPhase('list')} className="text-xs font-bold" style={{ color: '#B0A49C' }}>
                  スキップして問題へ →
                </button>
              </div>
              <SlideCard slide={slide} />
              <div className="flex gap-2">
                {slideIdx > 0 && (
                  <button onClick={() => setSlideIdx(i => i - 1)}
                    className="flex-1 py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}`, color: INK }}>
                    ← まえ
                  </button>
                )}
                {slideIdx < CIRCUIT_SLIDES.length - 1 ? (
                  <button onClick={() => setSlideIdx(i => i + 1)}
                    className="flex-[2] py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: TEAL, border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, color: '#FFFFFF' }}>
                    つぎへ →
                  </button>
                ) : (
                  <button onClick={() => setPhase('list')}
                    className="flex-[2] py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: '#FFC83D', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, color: INK }}>
                    問題をとく →
                  </button>
                )}
              </div>
            </>
          )}

          {phase === 'list' && (
            <>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map(d => {
                  const dl = DIFF_LABEL[d]
                  const list = problemsOf(d)
                  const solved = list.filter(p => solvedIds.includes(p.id)).length
                  return (
                    <button key={d}
                      onClick={() => { setSelectedDiff(d); setProblemIndex(0); setSessionResults({}) }}
                      className="flex-1 rounded-2xl py-2.5 px-1 text-center font-black text-[11px] transition-all"
                      style={{
                        background: selectedDiff === d ? dl.bg : '#FFFFFF',
                        border: `2.5px solid ${selectedDiff === d ? dl.color : '#C4B8AE'}`,
                        boxShadow: selectedDiff === d ? `2px 2px 0 0 ${dl.color}` : 'none',
                        color: selectedDiff === d ? dl.color : SOFT,
                      }}>
                      {dl.label}<br />
                      <span style={{ fontSize: 9, fontWeight: 700 }}>{solved}/{list.length}</span>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-2">
                {currentList.map((p, i) => {
                  const isSolved = solvedIds.includes(p.id)
                  return (
                    <button key={p.id}
                      onClick={() => { setProblemIndex(i); setSessionResults({}); setPhase('solving') }}
                      className="w-full text-left rounded-[18px] px-4 py-3 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                      style={{
                        background: isSolved ? '#DBF6F0' : '#FFFFFF',
                        border: `2.5px solid ${INK}`,
                        boxShadow: `2px 2px 0 0 ${INK}`,
                      }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs"
                        style={{ background: isSolved ? TEAL : '#DBF6F0', border: `2px solid ${INK}`, color: isSolved ? '#FFFFFF' : INK }}>
                        {isSolved ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-xs truncate" style={{ color: INK }}>{p.title}</p>
                      </div>
                      <span style={{ color: SOFT, fontSize: 14 }}>›</span>
                    </button>
                  )
                })}
              </div>

              <button onClick={() => { setSlideIdx(0); setPhase('manabu') }}
                className="w-full py-3 rounded-full font-black text-xs transition-all hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: `2.5px solid ${TEAL}`, boxShadow: `3px 3px 0 0 ${TEAL}`, color: TEAL }}>
                📖 「まなぶ」をもういちど見る
              </button>
            </>
          )}

          {phase === 'solving' && currentProblem && (
            <>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setPhase('list')} className="text-xs font-bold" style={{ color: SOFT }}>
                  ← 問題一覧
                </button>
                <span className="text-xs font-bold" style={{ color: SOFT }}>
                  {problemIndex + 1} / {currentList.length}
                </span>
              </div>
              <ProblemSolver
                key={currentProblem.id}
                problem={currentProblem}
                onDone={handleDone}
                onNext={goNext}
                isLast={problemIndex === currentList.length - 1}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
