'use client'

// 中学受験 理科〈てこのつり合い〉— 計算分野の単元（構造転換のひな型）
// 方式は算数/juku を踏襲: まなぶ（図解導入スライド）→ とく（演習）。
// 演習は2段階ヒント: 1回目不正解=考える足場 → 2回目不正解=答え＋図解説明。
// スコア・進捗は初回解答のみで記録（リトライで水増ししない）。

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TEKO_SLIDES, TEKO_PROBLEMS, TekoProblem, TekoSlide, TekoDiagramSpec, TekoDifficulty } from '@/data/rikaTekoData'
import { Furigana } from '@/components/Furigana'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'   // Fisher-Yates
import { playCorrect, playWrong } from '@/lib/audio'

const INK = '#3A2E2A'
const SOFT = '#6B5A52'
const TEAL = '#2BA39A'
const PROGRESS_KEY = 'tanq_rika_teko_progress_v1'

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

const DIFF_LABEL: Record<TekoDifficulty, { label: string; color: string; bg: string }> = {
  1: { label: '★ きほん', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★ れんしゅう', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★ おうよう', color: '#f87171', bg: '#FEF2F2' },
}

// ─────────────────────────────────────
// SVG: てこの図
// ─────────────────────────────────────
function TekoDiagram({ spec, reveal = false, answer }: {
  spec: TekoDiagramSpec
  reveal?: boolean
  answer?: string          // reveal 時に「?」へ入れる値（単位つき表示は呼び出し側の unit を使う）
}) {
  const allDists = [...spec.left, ...spec.right].map(l => l.dist)
  if (spec.barWeight) allDists.push(spec.barWeight.dist)
  const maxDist = Math.max(...allDists, 1)

  const fmtW = (w: number | null) =>
    w === null ? (reveal && answer ? `${answer}${spec.wUnit}` : '?') : `${w}${spec.wUnit}`
  const distText = (load: { dist: number; label?: string }) =>
    !reveal && load.label?.startsWith('?') ? load.label : `${load.dist}${spec.armUnit}`

  // ── lever: 支点が端の棒（石を持ち上げる・くぎぬき）──
  if (spec.mode === 'lever') {
    const ppu = 240 / maxDist
    const fx = 44               // 支点 x
    const beamY = 62
    const px = (d: number) => fx + d * ppu
    return (
      <svg viewBox="0 0 320 150" className="w-full max-w-sm mx-auto overflow-visible">
        {/* 地面 */}
        <line x1="16" y1="96" x2="304" y2="96" stroke="#C4B8AE" strokeWidth="2" />
        {/* 支点（三角） */}
        <polygon points={`${fx},${beamY + 6} ${fx - 13},96 ${fx + 13},96`} fill="#8A7D74" stroke={INK} strokeWidth="2" />
        <text x={fx} y="110" textAnchor="middle" fontSize="10" fill={TEAL} fontWeight="bold">支点</text>
        {/* 棒 */}
        <rect x={fx - 14} y={beamY - 2} width={maxDist * ppu + 28} height="9" rx="4" fill="#D9B36C" stroke={INK} strokeWidth="2" />
        {/* 作用点側（支点に近い・おもいもの） */}
        {spec.left.map((l, i) => {
          const x = px(l.dist)
          return (
            <g key={`l${i}`}>
              <rect x={x - 23} y={beamY - 32} width="46" height="24" rx="6"
                fill={l.w === null ? '#FFE3EE' : '#FFF1B8'} stroke={l.w === null ? '#FF6F9C' : INK} strokeWidth="2" />
              <text x={x} y={beamY - 16} textAnchor="middle" fontSize="11" fill={INK} fontWeight="bold">{fmtW(l.w)}</text>
              {l.label && !l.label.startsWith('?') && (
                <text x={x} y={beamY - 38} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{l.label}</text>
              )}
              <line x1={x} y1={beamY - 8} x2={x} y2={beamY - 2} stroke={INK} strokeWidth="1.5" />
            </g>
          )
        })}
        {/* 力点側（端をおし下げる力＝下向き矢印） */}
        {spec.right.map((l, i) => {
          const x = px(l.dist)
          const col = l.w === null && !reveal ? '#FF6F9C' : TEAL
          return (
            <g key={`r${i}`}>
              <line x1={x} y1={beamY - 38} x2={x} y2={beamY - 8} stroke={col} strokeWidth="3" />
              <polygon points={`${x},${beamY - 4} ${x - 6},${beamY - 12} ${x + 6},${beamY - 12}`} fill={col} />
              <text x={x} y={beamY - 44} textAnchor="middle" fontSize="11" fill={col} fontWeight="bold">{fmtW(l.w)}</text>
              {l.label && !l.label.startsWith('?') && (
                <text x={x} y={beamY - 56} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{l.label}</text>
              )}
            </g>
          )
        })}
        {/* 支点からの距離ブラケット */}
        {[...spec.left, ...spec.right].map((l, i) => {
          const x = px(l.dist)
          const y = 122 + (i % 2) * 14
          return (
            <g key={`d${i}`}>
              <line x1={fx} y1={y} x2={x} y2={y} stroke={SOFT} strokeWidth="1.2" />
              <line x1={fx} y1={y - 4} x2={fx} y2={y + 4} stroke={SOFT} strokeWidth="1.2" />
              <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={SOFT} strokeWidth="1.2" />
              <text x={(fx + x) / 2} y={y - 3} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{distText(l)}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // ── balance: 支点が中央のてこ ──
  const ppu = 118 / maxDist
  const cx = 160
  const beamY = 46
  return (
    <svg viewBox="0 0 320 150" className="w-full max-w-sm mx-auto overflow-visible">
      {/* 支点（三角）＋ 台 */}
      <polygon points={`${cx},${beamY + 8} ${cx - 14},92 ${cx + 14},92`} fill="#8A7D74" stroke={INK} strokeWidth="2" />
      <line x1={cx - 40} y1="92" x2={cx + 40} y2="92" stroke="#C4B8AE" strokeWidth="2" />
      <text x={cx} y="106" textAnchor="middle" fontSize="10" fill={TEAL} fontWeight="bold">支点</text>
      {/* 棒 */}
      <rect x={cx - 130} y={beamY - 2} width="260" height="9" rx="4" fill="#D9B36C" stroke={INK} strokeWidth="2" />
      {/* 目もり */}
      {maxDist <= 12 && Array.from({ length: maxDist }, (_, i) => i + 1).map(d => (
        <g key={`t${d}`}>
          <line x1={cx - d * ppu} y1={beamY - 2} x2={cx - d * ppu} y2={beamY + 7} stroke={INK} strokeWidth="0.8" opacity="0.35" />
          <line x1={cx + d * ppu} y1={beamY - 2} x2={cx + d * ppu} y2={beamY + 7} stroke={INK} strokeWidth="0.8" opacity="0.35" />
        </g>
      ))}
      {/* おもり（左右） */}
      {(['left', 'right'] as const).map(side =>
        spec[side].map((l, i) => {
          const x = side === 'left' ? cx - l.dist * ppu : cx + l.dist * ppu
          const unknown = l.w === null
          return (
            <g key={`${side}${i}`}>
              {/* 支点からの距離 */}
              <text x={x} y={beamY - 10} textAnchor="middle" fontSize="9.5"
                fill={!reveal && l.label?.startsWith('?') ? '#FF6F9C' : SOFT} fontWeight="bold">
                {distText(l)}
              </text>
              {/* ひも */}
              <line x1={x} y1={beamY + 7} x2={x} y2={beamY + 24} stroke={INK} strokeWidth="1.5" />
              {/* おもり箱 */}
              <rect x={x - 22} y={beamY + 24} width="44" height="24" rx="6"
                fill={unknown && !reveal ? '#FFE3EE' : unknown ? '#DBF6F0' : '#FFF1B8'}
                stroke={unknown && !reveal ? '#FF6F9C' : INK} strokeWidth="2" />
              <text x={x} y={beamY + 40} textAnchor="middle" fontSize="11" fill={INK} fontWeight="bold">{fmtW(l.w)}</text>
              {l.label && !l.label.startsWith('?') && (
                <text x={x} y={beamY + 60} textAnchor="middle" fontSize="9" fill={SOFT} fontWeight="bold">{l.label}</text>
              )}
            </g>
          )
        }),
      )}
      {/* 棒の重さ（重心マーク） */}
      {spec.barWeight && (() => {
        const bw = spec.barWeight
        const x = bw.side === 'left' ? cx - bw.dist * ppu : cx + bw.dist * ppu
        return (
          <g>
            <text x={x} y={beamY - 10} textAnchor="middle" fontSize="9.5" fill="#b45309" fontWeight="bold">{bw.dist}{spec.armUnit}</text>
            <circle cx={x} cy={beamY + 2.5} r="7" fill="#FFC83D" stroke={INK} strokeWidth="2" />
            <text x={x} y={beamY + 26} textAnchor="middle" fontSize="9" fill="#b45309" fontWeight="bold">棒のおもさ {bw.w}{spec.wUnit}</text>
          </g>
        )
      })()}
    </svg>
  )
}

// 答え合わせで見せるモーメント式チップ
function MomentChips({ spec }: { spec: TekoDiagramSpec }) {
  if (!spec.momentLeft && !spec.momentRight) return null
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        {spec.momentLeft && (
          <div className="rounded-xl px-2 py-1.5 text-center" style={{ background: '#FFF1B8', border: `2px solid ${INK}` }}>
            <p className="text-[9px] font-black" style={{ color: SOFT }}>{spec.mode === 'lever' ? 'おもい もの側' : 'ひだり'}</p>
            <p className="text-[11px] font-black" style={{ color: INK }}>{spec.momentLeft}</p>
          </div>
        )}
        {spec.momentRight && (
          <div className="rounded-xl px-2 py-1.5 text-center" style={{ background: '#DBF6F0', border: `2px solid ${INK}` }}>
            <p className="text-[9px] font-black" style={{ color: SOFT }}>{spec.mode === 'lever' ? '力を加える側' : 'みぎ'}</p>
            <p className="text-[11px] font-black" style={{ color: INK }}>{spec.momentRight}</p>
          </div>
        )}
      </div>
      <p className="text-center text-[10px] font-black" style={{ color: TEAL }}>
        ひとしいから つり合う！
      </p>
    </div>
  )
}

// ─────────────────────────────────────
// まなぶ: スライド
// ─────────────────────────────────────
function ThreePointsSvg() {
  // 支点・力点・作用点の図（中央支点のシーソー）
  return (
    <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto overflow-visible">
      <line x1="110" y1="92" x2="210" y2="92" stroke="#C4B8AE" strokeWidth="2" />
      <polygon points="160,56 146,92 174,92" fill="#8A7D74" stroke={INK} strokeWidth="2" />
      <rect x="36" y="44" width="248" height="9" rx="4" fill="#D9B36C" stroke={INK} strokeWidth="2" />
      {/* 作用点（おもり） */}
      <line x1="52" y1="53" x2="52" y2="66" stroke={INK} strokeWidth="1.5" />
      <rect x="32" y="66" width="40" height="24" rx="6" fill="#FFF1B8" stroke={INK} strokeWidth="2" />
      <text x="52" y="82" textAnchor="middle" fontSize="11" fill={INK} fontWeight="bold">おもり</text>
      <text x="52" y="32" textAnchor="middle" fontSize="11" fill="#2563eb" fontWeight="bold">作用点</text>
      {/* 支点 */}
      <text x="160" y="110" textAnchor="middle" fontSize="11" fill={TEAL} fontWeight="bold">支点</text>
      {/* 力点（手） */}
      <text x="268" y="36" textAnchor="middle" fontSize="14">✋</text>
      <text x="268" y="20" textAnchor="middle" fontSize="11" fill="#FF6F9C" fontWeight="bold">力点</text>
      <line x1="268" y1="40" x2="268" y2="42" stroke="#FF6F9C" strokeWidth="2" />
      <polygon points="268,50 262,42 274,42" fill="#FF6F9C" />
    </svg>
  )
}

function ToolsCards() {
  const tools = [
    { emoji: '🔨', name: 'くぎぬき' },
    { emoji: '✂️', name: 'はさみ' },
    { emoji: '🥢', name: 'ピンセット' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {tools.map(t => (
        <div key={t.name} className="rounded-2xl py-3 text-center" style={{ background: '#FFF6E5', border: `2px solid ${INK}` }}>
          <div className="text-3xl mb-1">{t.emoji}</div>
          <div className="text-[10px] font-black" style={{ color: INK }}>{t.name}</div>
        </div>
      ))}
    </div>
  )
}

function SlideCard({ slide }: { slide: TekoSlide }) {
  return (
    <div className="rounded-[22px] overflow-hidden" style={{ border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
      <div className="px-4 py-3" style={{ background: INK }}>
        <p className="font-black text-sm" style={{ color: '#FFF6E5' }}>📖 {slide.title}</p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{ background: '#FFFFFF' }}>
        {slide.kind === 'three-points' && <ThreePointsSvg />}
        {slide.kind === 'tools' && <ToolsCards />}
        {slide.diagram && (
          <>
            <TekoDiagram spec={slide.diagram} reveal />
            <div className="mt-2"><MomentChips spec={slide.diagram} /></div>
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
  problem: TekoProblem
  onDone: (id: string, firstTry: boolean, solved: boolean) => void
  onNext: () => void
  isLast: boolean
}) {
  // 選択肢は Fisher-Yates で初回マウント時に1度だけシャッフル
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
      // 1回目: 答えは見せず、考える足場ヒントで再挑戦
      setAttempt(1)
    } else {
      // 2回目: 答え＋図解説明を見せる（解けた扱いにはしない）
      setStatus('revealed')
      onDone(problem.id, false, false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 難易度・タイトル */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: diff.bg, border: `2px solid ${diff.color}`, color: diff.color }}>
          {diff.label}
        </span>
        <span className="text-[11px] font-bold" style={{ color: SOFT }}>{problem.title}</span>
      </div>

      {/* 問題文 */}
      <div className="rounded-[18px] p-4" style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
        <p className="font-bold text-sm leading-relaxed" style={{ color: INK }}>
          <Furigana text={problem.problemText} />
        </p>
      </div>

      {/* 図（解答中は「?」のまま。答えはバラさない） */}
      {!finished && (
        <div className="rounded-[18px] p-3" style={{ background: '#FFFFFF', border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <TekoDiagram spec={problem.diagram} />
        </div>
      )}

      {/* 1回目不正解 → 考える足場ヒント */}
      {status === 'try' && attempt === 1 && (
        <div className="rounded-[18px] p-4" style={{ background: '#FFF6D6', border: `3px solid ${INK}`, boxShadow: `3px 3px 0 0 ${INK}` }}>
          <p className="font-black text-sm mb-1" style={{ color: '#ca8a04' }}>💡 おしい！いっしょに考えよう</p>
          <p className="text-xs font-bold leading-relaxed" style={{ color: INK }}>
            <Furigana text={problem.scaffoldHint} />
          </p>
        </div>
      )}

      {/* 選択肢 */}
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

      {/* 正解 */}
      {status === 'correct' && (
        <div className="rounded-[18px] p-4 space-y-3" style={{ background: '#DBF6F0', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-lg" style={{ color: TEAL }}>
              {firstTryCorrect ? 'せいかい！' : 'できた！'}
            </span>
          </div>
          <div className="rounded-2xl bg-white/70 p-2">
            <TekoDiagram spec={problem.diagram} reveal answer={problem.answer} />
            <MomentChips spec={problem.diagram} />
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

      {/* 2回目不正解 → 答え＋図解説明 */}
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
            <TekoDiagram spec={problem.diagram} reveal answer={problem.answer} />
            <MomentChips spec={problem.diagram} />
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
export default function RikaTekoPage() {
  const [phase, setPhase] = useState<Phase>('manabu')
  const [slideIdx, setSlideIdx] = useState(0)
  const [selectedDiff, setSelectedDiff] = useState<TekoDifficulty>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  // 1セット（難易度）内の初回解答結果。スコア保存は初回解答のみで集計
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSolvedIds(loadProgress().solvedIds)
  }, [])

  const problemsOf = useCallback((d: TekoDifficulty) => TEKO_PROBLEMS.filter(p => p.difficulty === d), [])
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
      // セット終了 → 初回解答の正解数だけをスコアとして保存（コイン獲得もここに統合済み）
      const attempted = currentList.filter(p => p.id in sessionResults)
      if (attempted.length > 0) {
        const score = attempted.filter(p => sessionResults[p.id]).length
        saveScore('rika-teko', score, attempted.length, `★${selectedDiff}`)
      }
      setSessionResults({})
      setProblemIndex(0)
      setPhase('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [problemIndex, currentList, sessionResults, selectedDiff])

  const totalSolved = solvedIds.filter(id => TEKO_PROBLEMS.some(p => p.id === id)).length
  const totalProblems = TEKO_PROBLEMS.length
  const pct = Math.round(totalSolved / totalProblems * 100)
  const slide = TEKO_SLIDES[slideIdx]

  return (
    <div className="min-h-screen pb-24 font-sans"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}>
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="px-4 pt-6 pb-2">
          <Link href="/juken#rika" className="inline-flex items-center gap-1 text-sm font-bold mb-3" style={{ color: SOFT }}>
            ← 理科の単元マップにもどる
          </Link>
          <div className="rounded-[22px] p-4 flex items-center gap-3"
            style={{ background: '#FFFFFF', border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#DBF6F0', border: `2.5px solid ${INK}`, boxShadow: `2px 2px 0 0 ${INK}` }}>
              ⚖️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold" style={{ color: SOFT }}>中学受験 理科〈物理〉</p>
              <h1 className="font-black text-lg leading-tight" style={{ color: INK, fontFamily: 'var(--font-zen)' }}>
                てこのつり合い
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
          {/* まなぶ（図解導入スライド） */}
          {phase === 'manabu' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background: '#DBF6F0', border: `2px solid ${INK}`, color: TEAL }}>
                  📖 まなぶ {slideIdx + 1}/{TEKO_SLIDES.length}
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
                {slideIdx < TEKO_SLIDES.length - 1 ? (
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

          {/* とく: 問題一覧 */}
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

          {/* とく: 解答中 */}
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
