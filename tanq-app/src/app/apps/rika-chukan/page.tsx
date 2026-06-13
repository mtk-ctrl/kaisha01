'use client'

// 中学受験 理科〈水溶液と中和〉— 計算・思考分野の単元（rika-circuit のひな型を踏襲）
// 方式は算数/juku を踏襲: まなぶ（図解導入スライド）→ とく（演習）。
// 演習は2段階ヒント: 1回目不正解=考える足場 → 2回目不正解=答え＋図解説明。
// スコア・進捗は初回解答のみで記録（リトライで水増ししない）。
// 答えバレ防止: 図には液性の色を出さず無色（中立）に描き、reveal 後のみ液性の色を表示する。

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CHUKAN_SLIDES, CHUKAN_PROBLEMS, ChukanProblem, ChukanSlide, BeakerSpec, ChukanDifficulty } from '@/data/rikaChukanData'
import { Furigana } from '@/components/Furigana'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'   // Fisher-Yates
import { playCorrect, playWrong } from '@/lib/audio'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const TEAL = '#2BA39A'
const PROGRESS_KEY = 'tanq_rika_chukan_progress_v1'

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

const DIFF_LABEL: Record<ChukanDifficulty, { label: string; color: string; bg: string }> = {
  1: { label: '★ きほん', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★ れんしゅう', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★ おうよう', color: '#f87171', bg: '#FEF2F2' },
}

// 液性 → reveal 後の液の色（BTB相当: 酸性=黄 / 中性=緑 / アルカリ性=青）
// 解答前は無色（うすいグレー）で描く＝答えバレ防止。
const LIQUID_COLOR: Record<'acid' | 'neutral' | 'alkali', { fill: string; label: string }> = {
  acid: { fill: '#FFE873', label: '酸性（黄）' },
  neutral: { fill: '#9AE6B4', label: '中性（緑）' },
  alkali: { fill: '#7FB8F0', label: 'アルカリ性（青）' },
}
const NEUTRAL_FILL = '#E3DCD5'   // 解答前の無色（中立）

// ─────────────────────────────────────
// SVG: ビーカー（液の色＋目盛り）。
//  解答前は液性の色を出さず無色に描く。reveal 時のみ液性の色を表示する。
// ─────────────────────────────────────
function Beaker({ spec, reveal }: { spec: BeakerSpec; reveal: boolean }) {
  const show = reveal && spec.liquid !== null
  const fill = show ? LIQUID_COLOR[spec.liquid as 'acid' | 'neutral' | 'alkali'].fill : NEUTRAL_FILL

  // ビーカー本体（台形ぎみの長方形）。液面は上から少し下げる。
  const W = 96, H = 110
  const bx = 18, bw = 60, btop = 24, bbot = H - 12
  const liqTop = btop + 26   // 液面（固定: 量は別途バーで表す）

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[110px] mx-auto overflow-visible">
      {/* 液（reveal 前は無色） */}
      <path d={`M ${bx + 2} ${liqTop} L ${bx + bw - 2} ${liqTop} L ${bx + bw - 4} ${bbot - 2} Q ${bx + bw / 2} ${bbot + 4} ${bx + 4} ${bbot - 2} Z`}
        fill={fill} opacity={show ? 0.85 : 0.6} />
      {/* ビーカーのガラス（口は開いた形） */}
      <path d={`M ${bx} ${btop} L ${bx + 4} ${bbot} Q ${bx + bw / 2} ${bbot + 6} ${bx + bw - 4} ${bbot} L ${bx + bw} ${btop}`}
        fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {/* 注ぎ口 */}
      <path d={`M ${bx - 3} ${btop - 3} L ${bx} ${btop} M ${bx + bw} ${btop} L ${bx + bw + 3} ${btop - 3}`}
        fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      {/* 目盛り（右側に3本） */}
      {[0, 1, 2].map(i => (
        <line key={i} x1={bx + bw - 12} y1={liqTop + 10 + i * 16} x2={bx + bw - 4} y2={liqTop + 10 + i * 16}
          stroke={SOFT} strokeWidth="1.4" />
      ))}
      {/* ラベル */}
      {spec.label && (
        <text x={W / 2} y={btop - 8} textAnchor="middle" fontSize="10" fill={TEAL} fontWeight="bold">{spec.label}</text>
      )}
      {/* reveal 後は液性名を下に出す */}
      {show && (
        <text x={W / 2} y={H - 1} textAnchor="middle" fontSize="9" fill={INK} fontWeight="bold">
          {LIQUID_COLOR[spec.liquid as 'acid' | 'neutral' | 'alkali'].label}
        </text>
      )}
    </svg>
  )
}

// 体積バー（酸とアルカリの量・ちょうど中和の点を可視化）。答え（液性）は出さない。
function VolumeBar({ spec }: { spec: BeakerSpec }) {
  if (spec.acidVol == null && spec.alkaliVol == null) return null
  const maxV = Math.max(spec.acidVol ?? 0, spec.alkaliVol ?? 0, spec.justVol ?? 0, 1)
  const W = 150, rowH = 16, gap = 8, padL = 4
  const barMax = W - 44
  const scale = (v: number) => (v / maxV) * barMax
  const rows: { name: string; v: number; color: string }[] = []
  if (spec.acidVol != null) rows.push({ name: '酸', v: spec.acidVol, color: '#F0A04B' })
  if (spec.alkaliVol != null) rows.push({ name: 'アルカリ', v: spec.alkaliVol, color: '#5B8DCE' })
  const H = rows.length * (rowH + gap) + 16
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[180px] mx-auto overflow-visible">
      {rows.map((r, i) => {
        const y = i * (rowH + gap) + 4
        return (
          <g key={r.name}>
            <text x={padL} y={y + rowH - 4} fontSize="8" fill={SOFT} fontWeight="bold">{r.name}</text>
            <rect x={36} y={y} width={scale(r.v)} height={rowH} rx="3" fill={r.color} opacity="0.85" stroke={INK} strokeWidth="1" />
            <text x={36 + scale(r.v) + 3} y={y + rowH - 4} fontSize="8" fill={INK} fontWeight="bold">{r.v}</text>
          </g>
        )
      })}
      {/* ちょうど中和の目印線（アルカリ軸上） */}
      {spec.justVol != null && (
        <>
          <line x1={36 + scale(spec.justVol)} y1={0} x2={36 + scale(spec.justVol)} y2={H - 12}
            stroke="#C99700" strokeWidth="1.6" strokeDasharray="3 2" />
          <text x={36 + scale(spec.justVol)} y={H - 3} textAnchor="middle" fontSize="7.5" fill="#C99700" fontWeight="bold">
            ちょうど中和={spec.justVol}
          </text>
        </>
      )}
    </svg>
  )
}

// 1つの図ユニット（ビーカー＋必要なら体積バー）
function FigureUnit({ spec, reveal }: { spec: BeakerSpec; reveal: boolean }) {
  const hasBar = spec.acidVol != null || spec.alkaliVol != null
  return (
    <div className="flex flex-col items-center">
      <Beaker spec={spec} reveal={reveal} />
      {hasBar && <div className="mt-1"><VolumeBar spec={spec} /></div>}
      {spec.caption && <p className="text-[9px] font-bold mt-0.5 text-center" style={{ color: SOFT }}>{spec.caption}</p>}
    </div>
  )
}

// 複数のビーカーを並べて表示
function BeakerFigures({ specs, reveal = false }: { specs: BeakerSpec[]; reveal?: boolean }) {
  if (!specs || specs.length === 0) return null
  return (
    <div className={specs.length >= 3 ? 'grid grid-cols-3 gap-2' : specs.length === 2 ? 'grid grid-cols-2 gap-2' : 'flex justify-center'}>
      {specs.map((s, i) => <FigureUnit key={i} spec={s} reveal={reveal} />)}
    </div>
  )
}

// ─────────────────────────────────────
// まなぶ: スライド
// ─────────────────────────────────────
function SlideCard({ slide }: { slide: ChukanSlide }) {
  return (
    <div className="rounded-[22px] overflow-hidden" style={{ border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
      <div className="px-4 py-3" style={{ background: INK }}>
        <p className="font-black text-sm" style={{ color: '#FFF6E5' }}>📖 {slide.title}</p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{ background: '#FFFFFF' }}>
        {slide.diagrams && <BeakerFigures specs={slide.diagrams} reveal />}
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
  problem: ChukanProblem
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
          <BeakerFigures specs={problem.diagrams} />
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
            <BeakerFigures specs={problem.diagrams} reveal />
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
            <BeakerFigures specs={problem.diagrams} reveal />
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
export default function RikaChukanPage() {
  const [phase, setPhase] = useState<Phase>('manabu')
  const [slideIdx, setSlideIdx] = useState(0)
  const [selectedDiff, setSelectedDiff] = useState<ChukanDifficulty>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSolvedIds(loadProgress().solvedIds)
  }, [])

  const problemsOf = useCallback((d: ChukanDifficulty) => CHUKAN_PROBLEMS.filter(p => p.difficulty === d), [])
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
        saveScore('rika-chukan', score, attempted.length, `★${selectedDiff}`)
      }
      setSessionResults({})
      setProblemIndex(0)
      setPhase('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [problemIndex, currentList, sessionResults, selectedDiff])

  const totalSolved = solvedIds.filter(id => CHUKAN_PROBLEMS.some(p => p.id === id)).length
  const totalProblems = CHUKAN_PROBLEMS.length
  const pct = Math.round(totalSolved / totalProblems * 100)
  const slide = CHUKAN_SLIDES[slideIdx]

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
              🧪
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold" style={{ color: SOFT }}>中学受験 理科〈化学〉</p>
              <h1 className="font-black text-lg leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                水溶液と中和
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
                  📖 まなぶ {slideIdx + 1}/{CHUKAN_SLIDES.length}
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
                {slideIdx < CHUKAN_SLIDES.length - 1 ? (
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
