'use client'

// 中学受験 理科〈ばねののび〉— 計算分野の単元（rika-teko のひな型を踏襲）
// 方式は算数/juku を踏襲: まなぶ（図解導入スライド）→ とく（演習）。
// 演習は2段階ヒント: 1回目不正解=考える足場 → 2回目不正解=答え＋図解説明。
// スコア・進捗は初回解答のみで記録（リトライで水増ししない）。

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BANE_SLIDES, BANE_PROBLEMS, BaneProblem, BaneSlide, BaneSpec, BaneDifficulty } from '@/data/rikaBaneData'
import { Furigana } from '@/components/Furigana'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'   // Fisher-Yates
import { playCorrect, playWrong } from '@/lib/audio'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const TEAL = '#2BA39A'
const PROGRESS_KEY = 'tanq_rika_bane_progress_v1'

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

const DIFF_LABEL: Record<BaneDifficulty, { label: string; color: string; bg: string }> = {
  1: { label: '★ きほん', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★ れんしゅう', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★ おうよう', color: '#f87171', bg: '#FEF2F2' },
}

// ─────────────────────────────────────
// SVG: ばねの図（自然長・のび・全長を縦に表す。直列＝縦2本、並列＝横2本）
// ─────────────────────────────────────
function coilPath(x: number, top: number, length: number, turns = 6): string {
  // x を中心に、top から下へ length 伸びるジグザグばね
  const amp = 9
  const step = length / (turns * 2)
  let d = `M ${x} ${top}`
  for (let i = 0; i < turns * 2; i++) {
    const y = top + step * (i + 1)
    const dir = i % 2 === 0 ? amp : -amp
    d += ` L ${x + dir} ${y}`
  }
  d += ` L ${x} ${top + length}`
  return d
}

function BaneSpring({ x, natural, nobi, reveal, scale }: {
  x: number; natural: number; nobi: number | null; reveal: boolean; scale: number
}) {
  const top = 18
  const naturalPx = natural * scale
  // のびは reveal 時のみ実際に伸ばす。未reveal で nobi=null（求める値）は自然長のまま「?」
  const nobiPx = (nobi === null ? 0 : nobi) * scale
  const springLen = naturalPx + (reveal || nobi !== null ? nobiPx : 0)
  const weightY = top + springLen
  return (
    <g>
      {/* 天井 */}
      <line x1={x - 26} y1={top} x2={x + 26} y2={top} stroke={INK} strokeWidth="3" />
      <line x1={x - 26} y1={top} x2={x - 20} y2={top - 6} stroke="#C4B8AE" strokeWidth="2" />
      <line x1={x - 12} y1={top} x2={x - 6} y2={top - 6} stroke="#C4B8AE" strokeWidth="2" />
      <line x1={x + 2} y1={top} x2={x + 8} y2={top - 6} stroke="#C4B8AE" strokeWidth="2" />
      {/* ばね */}
      <path d={coilPath(x, top, springLen)} fill="none" stroke="#2BA39A" strokeWidth="2.5" strokeLinejoin="round" />
      {/* おもり */}
      <rect x={x - 16} y={weightY} width="32" height="22" rx="5" fill="#FFF1B8" stroke={INK} strokeWidth="2" />
    </g>
  )
}

function BaneDiagram({ spec, reveal = false, answer }: {
  spec: BaneSpec
  reveal?: boolean
  answer?: string
}) {
  const scale = 2.4  // cm → px
  // もとめる量は解答前「?」、reveal 時に answer を表示（答えバレ防止）
  const isUnknown = (q: 'nobi' | 'load' | 'natural' | 'total') => spec.unknown === q
  const valText = (q: 'nobi' | 'load' | 'natural' | 'total', known: number | null, unit: string) => {
    if (isUnknown(q)) return reveal && answer ? `${answer}${unit}` : `?${unit}`
    return known === null ? `?${unit}` : `${known}${unit}`
  }
  const hiNobi = isUnknown('nobi') && !reveal
  const hiLoad = (isUnknown('load') || spec.load === null) && !reveal
  // のびが未知で解答前なら、ばねを伸ばさない（形でも答えをばらさない）
  const springNobi = hiNobi ? null : spec.nobi

  const loadText = valText('load', spec.load, 'g')
  const nobiText = valText('nobi', spec.nobi, 'cm')
  const naturalText = valText('natural', spec.natural, 'cm')
  const totalText = valText('total', spec.totalLen ?? null, 'cm')

  // 並列は横に2本、それ以外（single/series）は中央に表示（series は縦2本ぶんの長さ）
  if (spec.connect === 'parallel') {
    return (
      <svg viewBox="0 0 320 184" className="w-full max-w-xs mx-auto overflow-visible">
        <BaneSpring x={110} natural={spec.natural} nobi={springNobi} reveal={reveal} scale={scale} />
        <BaneSpring x={185} natural={spec.natural} nobi={springNobi} reveal={reveal} scale={scale} />
        <text x={250} y={60} fontSize="11" fill={SOFT} fontWeight="bold">のび {nobiText}</text>
        <text x={250} y={82} fontSize="11" fill={hiLoad ? '#FF6F9C' : SOFT} fontWeight="bold">おもさ {loadText}</text>
        {spec.showTotal && (
          <text x={250} y={104} fontSize="10" fill={TEAL} fontWeight="bold">全長 {totalText}</text>
        )}
        <text x={150} y={162} textAnchor="middle" fontSize="11" fill={TEAL} fontWeight="bold">
          並列（2本で支える）
        </text>
      </svg>
    )
  }

  const isSeries = spec.connect === 'series'
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-xs mx-auto overflow-visible">
      <BaneSpring x={120} natural={isSeries ? spec.natural * 2 : spec.natural} nobi={springNobi} reveal={reveal} scale={scale} />
      {/* 注記: のび・おもさ・自然長・全長 */}
      <g>
        <text x={205} y={60} fontSize="11" fill={hiNobi ? '#FF6F9C' : SOFT} fontWeight="bold">
          のび {nobiText}
        </text>
        <text x={205} y={82} fontSize="11" fill={hiLoad ? '#FF6F9C' : SOFT} fontWeight="bold">
          おもさ {loadText}
        </text>
        <text x={205} y={104} fontSize="10" fill={isUnknown('natural') && !reveal ? '#FF6F9C' : SOFT} fontWeight="bold">
          自然長 {naturalText}
        </text>
        {spec.showTotal && (
          <text x={205} y={126} fontSize="10" fill={isUnknown('total') && !reveal ? '#FF6F9C' : TEAL} fontWeight="bold">
            全長 {totalText}
          </text>
        )}
        {isSeries && (
          <text x={205} y={148} fontSize="9.5" fill="#b45309" fontWeight="bold">直列2本</text>
        )}
      </g>
      {spec.unknown && !reveal && (
        <text x={120} y={194} textAnchor="middle" fontSize="10" fill="#FF6F9C" fontWeight="bold">？をもとめよう</text>
      )}
    </svg>
  )
}

// 答え合わせで見せる式チップ（noteLeft / noteRight）
function BaneChips({ spec }: { spec: BaneSpec }) {
  if (!spec.noteLeft && !spec.noteRight) return null
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        {spec.noteLeft && (
          <div className="rounded-xl px-2 py-1.5 text-center" style={{ background: '#FFF1B8', border: `2px solid ${INK}` }}>
            <p className="text-[9px] font-black" style={{ color: SOFT }}>1gあたり / 力</p>
            <p className="text-[11px] font-black" style={{ color: INK }}>{spec.noteLeft}</p>
          </div>
        )}
        {spec.noteRight && (
          <div className="rounded-xl px-2 py-1.5 text-center" style={{ background: '#DBF6F0', border: `2px solid ${INK}` }}>
            <p className="text-[9px] font-black" style={{ color: SOFT }}>のび / 全長</p>
            <p className="text-[11px] font-black" style={{ color: INK }}>{spec.noteRight}</p>
          </div>
        )}
      </div>
      <p className="text-center text-[10px] font-black" style={{ color: TEAL }}>
        「のび ＝ 1gあたりのび × おもさ」だね！
      </p>
    </div>
  )
}

// ─────────────────────────────────────
// まなぶ: スライド
// ─────────────────────────────────────
function SlideCard({ slide }: { slide: BaneSlide }) {
  return (
    <div className="rounded-[22px] overflow-hidden" style={{ border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
      <div className="px-4 py-3" style={{ background: INK }}>
        <p className="font-black text-sm" style={{ color: '#FFF6E5' }}>📖 {slide.title}</p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{ background: '#FFFFFF' }}>
        {slide.diagram && (
          <>
            <BaneDiagram spec={slide.diagram} reveal />
            <div className="mt-2"><BaneChips spec={slide.diagram} /></div>
          </>
        )}
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
  problem: BaneProblem
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

      {!finished && (
        <div className="rounded-[18px] p-3" style={{ background: '#FFFFFF', border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <BaneDiagram spec={problem.diagram} />
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
                className="py-3 rounded-2xl font-black text-base transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                style={{
                  background: isWrong ? '#FFE3EE' : '#FFFFFF',
                  border: `2.5px solid ${isWrong ? '#FF6F9C' : INK}`,
                  boxShadow: isWrong ? 'none' : `2px 2px 0 0 ${INK}`,
                  color: INK,
                  opacity: isWrong ? 0.45 : 1,
                }}>
                {c}
                <span className="text-sm font-bold ml-1" style={{ color: SOFT }}>{problem.answerUnit}</span>
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
            <BaneDiagram spec={problem.diagram} reveal answer={problem.answer} />
            <BaneChips spec={problem.diagram} />
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
            <span className="font-black text-base ml-1" style={{ color: SOFT }}>{problem.answerUnit}</span>
          </div>
          <div className="rounded-2xl bg-white/70 p-2">
            <BaneDiagram spec={problem.diagram} reveal answer={problem.answer} />
            <BaneChips spec={problem.diagram} />
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
export default function RikaBanePage() {
  const [phase, setPhase] = useState<Phase>('manabu')
  const [slideIdx, setSlideIdx] = useState(0)
  const [selectedDiff, setSelectedDiff] = useState<BaneDifficulty>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSolvedIds(loadProgress().solvedIds)
  }, [])

  const problemsOf = useCallback((d: BaneDifficulty) => BANE_PROBLEMS.filter(p => p.difficulty === d), [])
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
        saveScore('rika-bane', score, attempted.length, `★${selectedDiff}`)
      }
      setSessionResults({})
      setProblemIndex(0)
      setPhase('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [problemIndex, currentList, sessionResults, selectedDiff])

  const totalSolved = solvedIds.filter(id => BANE_PROBLEMS.some(p => p.id === id)).length
  const totalProblems = BANE_PROBLEMS.length
  const pct = Math.round(totalSolved / totalProblems * 100)
  const slide = BANE_SLIDES[slideIdx]

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
              🪝
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold" style={{ color: SOFT }}>中学受験 理科〈物理〉</p>
              <h1 className="font-black text-lg leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                ばねののび
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
                  📖 まなぶ {slideIdx + 1}/{BANE_SLIDES.length}
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
                {slideIdx < BANE_SLIDES.length - 1 ? (
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
