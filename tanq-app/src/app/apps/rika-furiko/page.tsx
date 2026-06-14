'use client'

// 中学受験 理科〈ふりこ〉— 計算・思考分野の単元（rika-buoy のひな型を踏襲）
// 方式: まなぶ（図解導入スライド）→ とく（演習）。
// 演習は2段階ヒント: 1回目不正解=考える足場 → 2回目不正解=答え＋図解説明。
// スコア・進捗は初回解答のみで記録（リトライで水増ししない）。
// 答えバレ防止: 求める量（周期・長さ・往復回数）は解答前に図へ実数を出さず「?」表示。
//   reveal 後のみ実数を表示する。

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FURIKO_SLIDES, FURIKO_PROBLEMS, FurikoProblem, FurikoSlide, FurikoFigure, FurikoDifficulty } from '@/data/rikaFurikoData'
import { Furigana } from '@/components/Furigana'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'   // Fisher-Yates
import { playCorrect, playWrong } from '@/lib/audio'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const TEAL = '#2BA39A'
const STRING = '#8A7D74'
const PROGRESS_KEY = 'tanq_rika_furiko_progress_v1'

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

const DIFF_LABEL: Record<FurikoDifficulty, { label: string; color: string; bg: string }> = {
  1: { label: '★ きほん', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★ れんしゅう', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★ おうよう', color: '#f87171', bg: '#FEF2F2' },
}

// 解答前は求める量を「?」、reveal 後に実数を出す。null = 求める量（解答前は「?」）
function valLabel(v: number | null | undefined, unit: string, reveal: boolean): string {
  if (v === undefined) return ''
  if (v === null) return reveal ? '' : '?'   // reveal でも値が来ないことがある（caption で説明）
  return `${v}${unit}`
}

// ─────────────────────────────────────
// SVG: 支点・糸・おもり・ふれはば角を描くふりこ
//  求める量（周期・長さ）は解答前に図へ実数を出さず「?」（answer バレ防止）。
//  lengthRatio で糸の長短を見せ分ける。nail でくぎ（途中から短くなる）を描く。
// ─────────────────────────────────────
function FurikoDiagram({ fig, reveal }: { fig: FurikoFigure; reveal: boolean }) {
  const W = 130, H = 150
  const px = W / 2          // 支点 x
  const py = 24             // 支点 y
  const maxLen = 96         // 最大の糸の長さ（描画px）
  const lr = fig.lengthRatio == null ? 0.8 : fig.lengthRatio
  const L = maxLen * lr     // この図の糸の長さ（px）
  const angle = (fig.angleDeg == null ? 24 : fig.angleDeg) * Math.PI / 180

  // おもりの位置（左にふれた状態で描く）
  const bobX = px - L * Math.sin(angle)
  const bobY = py + L * Math.cos(angle)
  // 真下（基準線）
  const downY = py + L

  // くぎの位置
  const nailY = fig.nail ? py + L * (fig.nailRatio == null ? 0.6 : fig.nailRatio) : 0

  const lengthUnit = fig.lengthUnit ?? 'cm'
  const periodUnit = fig.periodUnit ?? '秒'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[150px] mx-auto overflow-visible">
      {/* 天井（支点をつるすバー） */}
      <line x1={px - 26} y1={py} x2={px + 26} y2={py} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <rect x={px - 30} y={py - 8} width={60} height={6} fill="none" />
      {/* 支点 */}
      <circle cx={px} cy={py} r={3.2} fill={INK} />

      {/* ふれはばの円弧（基準線からおもりまで・うすく） */}
      <path d={`M ${px} ${downY} A ${L} ${L} 0 0 1 ${bobX} ${bobY}`}
        fill="none" stroke={TEAL} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
      {/* 真下の基準線（点線） */}
      <line x1={px} y1={py} x2={px} y2={downY} stroke={STRING} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />

      {/* くぎ（途中から糸が短くなる） */}
      {fig.nail && (
        <>
          <circle cx={px} cy={nailY} r={2.4} fill="#C0392B" />
          <text x={px + 6} y={nailY + 3} fontSize="7" fill="#C0392B" fontWeight="bold">くぎ</text>
        </>
      )}

      {/* 糸 */}
      <line x1={px} y1={py} x2={bobX} y2={bobY} stroke={INK} strokeWidth="1.8" />

      {/* おもり */}
      <circle cx={bobX} cy={bobY} r={8} fill="#E0A458" stroke={INK} strokeWidth="2" />

      {/* 糸の長さの注記（求める量は ? 表示） */}
      {(fig.lengthVal !== undefined) && (
        <text x={(px + bobX) / 2 - 4} y={(py + bobY) / 2} textAnchor="end" fontSize="8" fill={INK} fontWeight="bold">
          {valLabel(fig.lengthVal, lengthUnit, reveal)}
        </text>
      )}

      {/* 周期の注記（求める量は ? 表示・おもりの下に） */}
      {(fig.periodVal !== undefined) && (
        <text x={bobX} y={bobY + 18} textAnchor="middle" fontSize="8" fill={TEAL} fontWeight="bold">
          {(() => { const s = valLabel(fig.periodVal, periodUnit, reveal); return s ? `周期 ${s}` : '' })()}
        </text>
      )}

      {/* ラベル */}
      {fig.label && (
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill={TEAL} fontWeight="bold">{fig.label}</text>
      )}
    </svg>
  )
}

// 1つの図ユニット
function FigureUnit({ fig, reveal }: { fig: FurikoFigure; reveal: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <FurikoDiagram fig={fig} reveal={reveal} />
      {fig.caption && <p className="text-[9px] font-bold mt-0.5 text-center" style={{ color: SOFT }}>{fig.caption}</p>}
    </div>
  )
}

// 複数の図を並べる
function FurikoFigures({ figs, reveal = false }: { figs: FurikoFigure[]; reveal?: boolean }) {
  if (!figs || figs.length === 0) return null
  return (
    <div className={figs.length >= 2 ? 'grid grid-cols-2 gap-2' : 'flex justify-center'}>
      {figs.map((f, i) => <FigureUnit key={i} fig={f} reveal={reveal} />)}
    </div>
  )
}

// ─────────────────────────────────────
// まなぶ: スライド
// ─────────────────────────────────────
function SlideCard({ slide }: { slide: FurikoSlide }) {
  return (
    <div className="rounded-[22px] overflow-hidden" style={{ border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
      <div className="px-4 py-3" style={{ background: INK }}>
        <p className="font-black text-sm" style={{ color: '#FFF6E5' }}>📖 {slide.title}</p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{ background: '#FFFFFF' }}>
        {slide.diagrams && <FurikoFigures figs={slide.diagrams} reveal />}
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
  problem: FurikoProblem
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
        <p className="font-bold text-sm leading-relaxed whitespace-pre-line" style={{ color: INK }}>
          <Furigana text={problem.problemText} />
        </p>
      </div>

      {!finished && problem.diagrams.length > 0 && (
        <div className="rounded-[18px] p-3" style={{ background: '#FFFFFF', border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <FurikoFigures figs={problem.diagrams} />
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
            <FurikoFigures figs={problem.diagrams} reveal />
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
            <FurikoFigures figs={problem.diagrams} reveal />
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
export default function RikaFurikoPage() {
  const [phase, setPhase] = useState<Phase>('manabu')
  const [slideIdx, setSlideIdx] = useState(0)
  const [selectedDiff, setSelectedDiff] = useState<FurikoDifficulty>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSolvedIds(loadProgress().solvedIds)
  }, [])

  const problemsOf = useCallback((d: FurikoDifficulty) => FURIKO_PROBLEMS.filter(p => p.difficulty === d), [])
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
        saveScore('rika-furiko', score, attempted.length, `★${selectedDiff}`)
      }
      setSessionResults({})
      setProblemIndex(0)
      setPhase('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [problemIndex, currentList, sessionResults, selectedDiff])

  const totalSolved = solvedIds.filter(id => FURIKO_PROBLEMS.some(p => p.id === id)).length
  const totalProblems = FURIKO_PROBLEMS.length
  const pct = Math.round(totalSolved / totalProblems * 100)
  const slide = FURIKO_SLIDES[slideIdx]

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
              🕰️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold" style={{ color: SOFT }}>中学受験 理科〈物理〉</p>
              <h1 className="font-black text-lg leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                ふりこ
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
                  📖 まなぶ {slideIdx + 1}/{FURIKO_SLIDES.length}
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
                {slideIdx < FURIKO_SLIDES.length - 1 ? (
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
