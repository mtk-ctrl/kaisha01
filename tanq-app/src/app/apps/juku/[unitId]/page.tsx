'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { JUKU_UNITS, Problem, DiagramType } from '@/data/jukuData'
import { getDataKey } from '@/lib/storage'

const JUKU_PROGRESS_KEY = 'tanq_juku_progress_v1'
type Phase = 'unit-intro' | 'problem-list' | 'solving'
type ProgressStore = Record<string, { cleared: number; total: number; solvedIds: string[] }>

function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(JUKU_PROGRESS_KEY)) || '{}') } catch { return {} }
}

function saveUnitProgress(unitId: string, solvedId: string, total: number) {
  if (typeof window === 'undefined') return
  const store = loadProgress()
  const cur = store[unitId] || { cleared: 0, total, solvedIds: [] }
  if (!cur.solvedIds.includes(solvedId)) cur.solvedIds.push(solvedId)
  cur.cleared = cur.solvedIds.length
  cur.total = total
  store[unitId] = cur
  try { localStorage.setItem(getDataKey(JUKU_PROGRESS_KEY), JSON.stringify(store)) } catch {}
}

const DIFF_LABEL: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: '★', color: '#4ade80', bg: '#F0FDF4' },
  2: { label: '★★', color: '#f0c040', bg: '#FFFBEB' },
  3: { label: '★★★', color: '#f87171', bg: '#FEF2F2' },
}

// ─────────────────────────────────────
// 選択肢を自動生成（単位変換用）
// ─────────────────────────────────────
function buildChoices(problem: Problem): string[] | null {
  if (problem.diagramType !== 'slide') return null
  if (problem.choices) return [...problem.choices].sort(() => Math.random() - 0.5)
  const num = parseFloat(problem.answer)
  if (isNaN(num)) return null
  const fmt = (v: number) => {
    if (v >= 100000) return Math.round(v).toLocaleString('en').replace(/,/g, '')
    if (Number.isInteger(v)) return v.toString()
    return parseFloat(v.toFixed(2)).toString()
  }
  const wrongs = [0.1, 10, 100]
    .map(f => fmt(num * f))
    .filter(s => s !== problem.answer)
  const all = [problem.answer, ...wrongs.slice(0, 3)]
  return all.sort(() => Math.random() - 0.5)
}

// ─────────────────────────────────────
// SVG: スライド図（単位変換）
// ─────────────────────────────────────
function SlideRulerDiagram({ spec }: { spec: Record<string, unknown> }) {
  const units = spec.units as string[] ?? ['km', 'm', 'cm', 'mm']
  const fromUnit = spec.from as string
  const toUnit = spec.to as string
  const direction = spec.direction as string ?? 'down'
  const fromIdx = units.indexOf(fromUnit)
  const toIdx = units.indexOf(toUnit)

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <p className="text-[10px] font-bold mb-1" style={{ color: '#6B5A52' }}>
        {direction === 'down' ? '▼ 小さい単位へ（数字が大きくなる）' : '▲ 大きい単位へ（数字が小さくなる）'}
      </p>
      <div className="flex items-center gap-0">
        {units.map((unit, i) => {
          const isFrom = unit === fromUnit
          const isTo = unit === toUnit
          const lo = Math.min(fromIdx, toIdx), hi = Math.max(fromIdx, toIdx)
          const inRange = lo <= i && i <= hi
          return (
            <React.Fragment key={unit}>
              <div
                className="w-14 h-10 rounded-lg flex items-center justify-center font-black text-sm transition-all"
                style={{
                  background: isFrom ? '#FFC83D' : isTo ? '#00e5c3' : inRange ? '#DBF6F0' : '#FFFFFF',
                  border: `2.5px solid ${isFrom || isTo ? '#3A2E2A' : '#C4B8AE'}`,
                  boxShadow: isFrom || isTo ? '2px 2px 0 0 #3A2E2A' : 'none',
                  color: '#3A2E2A',
                  transform: isFrom || isTo ? 'scale(1.08)' : 'scale(1)',
                }}>
                {unit}
              </div>
              {i < units.length - 1 && (
                <div className="flex flex-col items-center w-5">
                  <span className="text-[9px] font-bold" style={{ color: '#6B5A52' }}>
                    {direction === 'down' ? '×10' : '÷10'}
                  </span>
                  <span style={{ color: '#C4B8AE', fontSize: 10 }}>→</span>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
      {fromUnit && toUnit && (
        <div className="flex items-center gap-4 mt-2">
          <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
            style={{ background: '#FFC83D', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
            {fromUnit}
          </span>
          <span className="text-[11px]" style={{ color: '#6B5A52' }}>→</span>
          <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
            style={{ background: '#00e5c3', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
            {toUnit}
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────
// SVG: 点線図（植木算）🌳 emoji版
// ─────────────────────────────────────
function DotLineDiagram({ spec }: { spec: Record<string, unknown> }) {
  const type = spec.type as string

  // 円形
  if (type === 'circle' || type === 'circle-add' || type === 'circle-reverse') {
    const total = spec.totalLength as number
    const interval = spec.interval as number ?? spec.oldInterval as number
    const flags = spec.flags as number
    const count = flags ?? (total && interval ? Math.round(total / interval) : 8)
    const display = Math.min(count, 20)
    const radius = 50
    const cx = 68, cy = 68
    const dots = Array.from({ length: display }, (_, i) => {
      const angle = (2 * Math.PI * i) / display - Math.PI / 2
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
    })
    return (
      <svg viewBox="0 0 136 136" className="w-36 h-36 mx-auto">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#C4B8AE" strokeWidth="1.5" strokeDasharray="4 3" />
        {dots.map((d, i) => (
          <text key={i} x={d.x} y={d.y + 6} textAnchor="middle" fontSize="14" style={{ userSelect: 'none' }}>🌳</text>
        ))}
        {count > 20 && (
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10" fill="#6B5A52" fontWeight="bold">
            計{count}本
          </text>
        )}
      </svg>
    )
  }

  // 正方形（方陣算）
  if (type === 'square' || type === 'hollow-square' || type === 'square-reverse') {
    const side = (spec.perSide as number) ?? (spec.side as number) ?? 5
    const spacing = 22
    const offset = 12
    const positions: { x: number; y: number }[] = []
    for (let i = 0; i < side; i++) positions.push({ x: offset + i * spacing, y: offset })
    for (let i = 1; i < side; i++) positions.push({ x: offset + (side - 1) * spacing, y: offset + i * spacing })
    for (let i = side - 2; i >= 0; i--) positions.push({ x: offset + i * spacing, y: offset + (side - 1) * spacing })
    for (let i = side - 2; i >= 1; i--) positions.push({ x: offset, y: offset + i * spacing })
    const svgSize = offset * 2 + (side - 1) * spacing
    return (
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-40 h-40 mx-auto">
        {type === 'hollow-square' && (
          <rect
            x={offset + spacing} y={offset + spacing}
            width={(side - 3) * spacing} height={(side - 3) * spacing}
            fill="rgba(200,200,200,0.15)" stroke="#C4B8AE" strokeDasharray="3 3" strokeWidth="1" />
        )}
        {positions.map((p, i) => (
          <text key={i} x={p.x} y={p.y + 6} textAnchor="middle" fontSize="13" style={{ userSelect: 'none' }}>🌳</text>
        ))}
      </svg>
    )
  }

  // 直線（両端あり / 両端なし / 片端 / LCM / 比較）
  const total = spec.totalLength as number ?? 20
  const interval = spec.interval as number ?? 4
  const treesFromSpec = spec.trees as number
  const treeCount = treesFromSpec ?? (
    type === 'line-none' ? Math.round(total / interval) - 1 :
    type === 'line-left' ? Math.round(total / interval) :
    Math.round(total / interval) + 1
  )
  const display = Math.min(treeCount, 11)
  const groundY = 64
  const svgW = 220
  const margin = 16
  const spacing = display > 1 ? (svgW - margin * 2) / (display - 1) : 0
  const dots = Array.from({ length: display }, (_, i) => ({ x: margin + i * spacing }))

  const leftHasTree = type !== 'line-none'
  const rightHasTree = type === 'line-both' || type === 'compare'

  return (
    <svg viewBox={`0 0 ${svgW} 90`} className="w-full max-w-[240px] mx-auto">
      {/* 地面ライン */}
      <line x1={margin - 4} y1={groundY} x2={svgW - margin + 4} y2={groundY}
        stroke="#C4B8AE" strokeWidth="1.5" />
      {/* 木（emoji） */}
      {dots.map((d, i) => {
        const isLeft = i === 0
        const isRight = i === display - 1
        const show =
          type === 'line-both' ? true :
          type === 'line-none' ? (!isLeft && !isRight) :
          type === 'line-left' ? !isRight :
          true
        if (!show) return null
        return (
          <text key={i} x={d.x} y={groundY - 2} textAnchor="middle"
            fontSize={display <= 8 ? '16' : '13'} style={{ userSelect: 'none' }}>
            🌳
          </text>
        )
      })}
      {/* 端点マーカー（木がない端） */}
      {type === 'line-none' && (
        <>
          <circle cx={margin} cy={groundY} r={3} fill="#C4B8AE" />
          <circle cx={svgW - margin} cy={groundY} r={3} fill="#C4B8AE" />
        </>
      )}
      {type === 'line-left' && (
        <circle cx={svgW - margin} cy={groundY} r={3} fill="#C4B8AE" />
      )}
      {/* 間隔ラベル */}
      {display >= 2 && interval > 0 && (
        <>
          <line x1={dots[0].x} y1={groundY + 10} x2={dots[1].x} y2={groundY + 10}
            stroke="#f0c040" strokeWidth="1.5"
            markerStart="url(#arr)" markerEnd="url(#arr)" />
          <text x={(dots[0].x + dots[1].x) / 2} y={groundY + 22}
            textAnchor="middle" fontSize="9" fill="#6B5A52" fontWeight="bold">
            {interval}m
          </text>
        </>
      )}
      {/* 本数ラベル */}
      <text x={margin} y="12" fontSize="9" fill="#6B5A52" fontWeight="bold">
        🌳×{treeCount}{display < treeCount ? `（表示:${display}）` : ''}
      </text>
    </svg>
  )
}

// ─────────────────────────────────────
// 図レンダラー
// ─────────────────────────────────────
function DiagramRenderer({ type, spec }: { type: DiagramType; spec: Record<string, unknown> }) {
  if (type === 'none') return null
  return (
    <div className="rounded-2xl p-4 flex flex-col items-center"
      style={{ background: '#FFF6E5', border: '2.5px solid #3A2E2A', minHeight: 80 }}>
      <p className="text-[10px] font-black mb-2" style={{ color: '#6B5A52' }}>
        {type === 'slide' ? '📐 スライド図' : type === 'dot-line' ? '🌳 植木のイメージ' : '📊 図'}
      </p>
      {type === 'slide' && <SlideRulerDiagram spec={spec} />}
      {type === 'dot-line' && <DotLineDiagram spec={spec} />}
    </div>
  )
}

// ─────────────────────────────────────
// 問題ソルバー
// ─────────────────────────────────────
function ProblemSolver({
  problem, unitColor, onSolved, onSkip, onNext, isLast,
}: {
  problem: Problem
  unitColor: string
  onSolved: (id: string) => void
  onSkip: () => void
  onNext: () => void
  isLast: boolean
}) {
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  // 選択肢（slideのみ、初回マウント時に固定）
  const [choices] = useState<string[] | null>(() => buildChoices(problem))

  const isChoice = choices !== null
  const diff = DIFF_LABEL[problem.difficulty]
  const visibleHints = problem.hints.slice(0, wrongCount)
  const maxHints = problem.hints.length

  function triggerWrong() {
    const next = Math.min(wrongCount + 1, maxHints)
    setWrongCount(next)
    setWrongFlash(true)
    setSelectedChoice(null)
    setTimeout(() => setWrongFlash(false), 700)
  }

  function checkText() {
    const norm = (s: string) => s.trim().replace(/,/g, '').replace(/，/g, '')
    if (norm(input) === norm(problem.answer)) {
      setSolved(true)
      onSolved(problem.id)
    } else {
      setInput('')
      triggerWrong()
    }
  }

  function checkChoice(val: string) {
    setSelectedChoice(val)
    setTimeout(() => {
      if (val === problem.answer) {
        setSolved(true)
        onSolved(problem.id)
      } else {
        triggerWrong()
      }
    }, 150)
  }

  return (
    <div className="space-y-4">
      {/* 難易度・タイトル */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: diff.bg, border: `2px solid ${diff.color}`, color: diff.color }}>
          {diff.label}
        </span>
        <span className="text-[11px] font-bold" style={{ color: '#6B5A52' }}>{problem.title}</span>
      </div>

      {/* 問題文 */}
      <div className={`rounded-[18px] p-4 transition-all duration-150 ${wrongFlash ? 'scale-[0.99]' : ''}`}
        style={{
          background: '#FFFFFF',
          border: `3px solid ${wrongFlash ? '#FF6F9C' : '#3A2E2A'}`,
          boxShadow: `4px 4px 0 0 ${wrongFlash ? '#FF6F9C' : '#3A2E2A'}`,
        }}>
        <p className="font-bold text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#3A2E2A' }}>
          {problem.problemText}
        </p>
      </div>

      {/* 図 */}
      {problem.diagramType !== 'none' && (
        <DiagramRenderer type={problem.diagramType} spec={problem.diagramSpec} />
      )}

      {/* 答え入力エリア */}
      {!solved && (
        isChoice ? (
          /* 選択式（単位変換） */
          <div className="grid grid-cols-2 gap-2">
            {choices!.map(c => {
              const isSelected = selectedChoice === c
              const isWrong = isSelected && wrongFlash
              return (
                <button key={c} onClick={() => !selectedChoice && checkChoice(c)}
                  className="py-3 rounded-2xl font-black text-base transition-all"
                  style={{
                    background: isWrong ? '#FFE3EE' : isSelected ? '#DBF6F0' : '#FFFFFF',
                    border: `2.5px solid ${isWrong ? '#FF6F9C' : isSelected ? '#2BA39A' : '#3A2E2A'}`,
                    boxShadow: `2px 2px 0 0 ${isWrong ? '#FF6F9C' : '#3A2E2A'}`,
                    color: '#3A2E2A',
                  }}>
                  {c}
                  {problem.answerUnit && (
                    <span className="text-sm font-bold ml-1" style={{ color: '#6B5A52' }}>
                      {problem.answerUnit}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          /* テキスト入力式 */
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text" inputMode="decimal"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && input && checkText()}
                placeholder="こたえを入力"
                className="flex-1 rounded-2xl px-4 py-3 font-bold text-base text-center outline-none transition-all"
                style={{
                  background: '#FFF6E5',
                  border: `2.5px solid ${wrongFlash ? '#FF6F9C' : '#3A2E2A'}`,
                  boxShadow: `2px 2px 0 0 ${wrongFlash ? '#FF6F9C' : '#3A2E2A'}`,
                  color: '#3A2E2A',
                }}
              />
              {problem.answerUnit && (
                <span className="font-black text-sm" style={{ color: '#6B5A52' }}>{problem.answerUnit}</span>
              )}
            </div>
            <button onClick={checkText} disabled={!input}
              className="w-full py-3 rounded-full font-black text-base transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: unitColor, border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A', color: '#3A2E2A' }}>
              こたえあわせ →
            </button>
          </div>
        )
      )}

      {/* まちがいフィードバック */}
      {wrongFlash && (
        <div className="rounded-2xl px-4 py-2.5 text-center animate-pulse"
          style={{ background: '#FFE3EE', border: '2px solid #FF6F9C' }}>
          <p className="text-xs font-black" style={{ color: '#FF6F9C' }}>
            {wrongCount === 1 ? 'ちがうよ！ヒント1が出たよ👇' :
             wrongCount === 2 ? 'もう1回！ヒント2も出たよ👇' :
             'もう少し！全部のヒントを見てみよう👇'}
          </p>
        </div>
      )}

      {/* 正解 */}
      {solved && (
        <div className="rounded-[18px] p-4 space-y-3"
          style={{ background: '#DBF6F0', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-lg" style={{ color: '#2BA39A' }}>せいかい！</span>
          </div>
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>
            {problem.explanationText}
          </p>
          <button onClick={onNext}
            className="w-full py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            {isLast ? '単元をおわる 🏁' : 'つぎの問題 →'}
          </button>
        </div>
      )}

      {/* ヒント（まちがえた回数分だけ表示） */}
      {visibleHints.length > 0 && !solved && (
        <div className="space-y-2">
          <p className="text-[11px] font-black" style={{ color: '#6B5A52' }}>
            💡 ヒント（{visibleHints.length}/{maxHints}）
          </p>
          {visibleHints.map(hint => (
            <div key={hint.step} className="rounded-2xl px-4 py-3"
              style={{ background: '#FFF1B8', border: '2px solid #3A2E2A' }}>
              <p className="text-[10px] font-black mb-1" style={{ color: '#C99700' }}>
                ヒント{hint.step}
              </p>
              <p className="text-xs font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>
                {hint.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* まだヒントがない場合の案内 */}
      {visibleHints.length === 0 && !solved && (
        <p className="text-center text-[10px] font-bold" style={{ color: '#B0A49C' }}>
          まちがえるとヒントが出るよ
        </p>
      )}

      {/* とばすボタン */}
      {!solved && (
        <button onClick={onSkip}
          className="w-full py-2 rounded-full font-bold text-xs transition-all hover:opacity-70"
          style={{ background: 'transparent', border: '1.5px dashed #C4B8AE', color: '#B0A49C' }}>
          わからない、とばす →
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────
// メインページ
// ─────────────────────────────────────
export default function JukuUnitPage() {
  const params = useParams()
  const unitId = params.unitId as string
  const unit = JUKU_UNITS.find(u => u.id === unitId)

  const [phase, setPhase] = useState<Phase>('unit-intro')
  const [selectedDiff, setSelectedDiff] = useState<1 | 2 | 3>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [skippedIds, setSkippedIds] = useState<string[]>([])

  useEffect(() => {
    if (!unit) return
    const store = loadProgress()
    setSolvedIds(store[unit.id]?.solvedIds ?? [])
  }, [unit])

  const handleSolved = useCallback((id: string) => {
    if (!unit) return
    setSolvedIds(prev => prev.includes(id) ? prev : [...prev, id])
    saveUnitProgress(unit.id, id, unit.problems.length)
  }, [unit])

  const handleSkip = useCallback(() => {
    if (!unit) return
    const prob = filteredProblems()[problemIndex]
    if (prob) setSkippedIds(prev => prev.includes(prob.id) ? prev : [...prev, prob.id])
    goNextProblem()
  }, [unit, problemIndex, selectedDiff]) // eslint-disable-line

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF6E5' }}>
        <div className="text-center">
          <p className="font-bold mb-4" style={{ color: '#6B5A52' }}>単元が見つかりません</p>
          <Link href="/apps/juku" className="font-black underline" style={{ color: '#FF6F9C' }}>もどる</Link>
        </div>
      </div>
    )
  }

  function filteredProblems() {
    return unit!.problems.filter(p => p.difficulty === selectedDiff)
  }

  function goNextProblem() {
    const list = filteredProblems()
    if (problemIndex < list.length - 1) {
      setProblemIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setPhase('problem-list')
      setProblemIndex(0)
    }
  }

  const currentProblem = filteredProblems()[problemIndex]
  const totalSolved = solvedIds.length
  const totalProblems = unit.problems.length
  const pct = totalProblems > 0 ? Math.round(totalSolved / totalProblems * 100) : 0

  return (
    <div className="min-h-screen pb-24"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}>
      {/* ヘッダー */}
      <div className="px-4 pt-6 pb-2">
        <Link href="/apps/juku" className="inline-flex items-center gap-1 text-sm font-bold mb-3"
          style={{ color: '#6B5A52' }}>
          ← 単元一覧にもどる
        </Link>
        <div className="rounded-[22px] p-4 flex items-center gap-3"
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: unit.color + '33', border: '2.5px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A' }}>
            {unit.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>第{unit.order}単元</p>
            <h1 className="font-black text-lg leading-tight" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
              {unit.title}
            </h1>
            {totalProblems > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: unit.color }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{totalSolved}/{totalProblems}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* 単元イントロ */}
        {phase === 'unit-intro' && (
          <>
            <div className="rounded-[22px] p-5 space-y-3"
              style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
              <h2 className="font-black text-base" style={{ color: '#3A2E2A' }}>🎯 この単元のポイント</h2>
              <p className="text-sm font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>{unit.coreConcept}</p>
              <div className="rounded-2xl p-3" style={{ background: '#FFF6E5', border: '2px solid #C4B8AE' }}>
                <p className="text-xs font-bold leading-relaxed whitespace-pre-wrap" style={{ color: '#6B5A52' }}>
                  {unit.approachText}
                </p>
              </div>
            </div>
            <button onClick={() => setPhase('problem-list')}
              className="w-full py-4 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
              style={{ background: unit.color, border: '3px solid #3A2E2A', boxShadow: '5px 5px 0 0 #3A2E2A', color: '#3A2E2A' }}>
              問題をとく →
            </button>
          </>
        )}

        {/* 問題一覧 */}
        {phase === 'problem-list' && (
          <>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(d => {
                const dl = DIFF_LABEL[d]
                const list = unit.problems.filter(p => p.difficulty === d)
                const solved = list.filter(p => solvedIds.includes(p.id)).length
                return (
                  <button key={d}
                    onClick={() => { setSelectedDiff(d); setProblemIndex(0) }}
                    className="flex-1 rounded-2xl py-2.5 px-2 text-center font-black text-xs transition-all"
                    style={{
                      background: selectedDiff === d ? dl.bg : '#FFFFFF',
                      border: `2.5px solid ${selectedDiff === d ? dl.color : '#C4B8AE'}`,
                      boxShadow: selectedDiff === d ? `2px 2px 0 0 ${dl.color}` : 'none',
                      color: selectedDiff === d ? dl.color : '#6B5A52',
                    }}>
                    {dl.label}<br />
                    <span style={{ fontSize: 9, fontWeight: 700 }}>{solved}/{list.length}</span>
                  </button>
                )
              })}
            </div>

            <div className="space-y-2">
              {filteredProblems().map((p, i) => {
                const isSolved = solvedIds.includes(p.id)
                const isSkipped = skippedIds.includes(p.id)
                return (
                  <button key={p.id}
                    onClick={() => { setProblemIndex(i); setPhase('solving') }}
                    className="w-full text-left rounded-[18px] px-4 py-3 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                    style={{
                      background: isSolved ? '#DBF6F0' : '#FFFFFF',
                      border: '2.5px solid #3A2E2A',
                      boxShadow: '2px 2px 0 0 #3A2E2A',
                    }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs"
                      style={{
                        background: isSolved ? '#2BA39A' : isSkipped ? '#FFF1B8' : unit.color + '33',
                        border: '2px solid #3A2E2A', color: '#3A2E2A',
                      }}>
                      {isSolved ? '✓' : isSkipped ? '→' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs truncate" style={{ color: '#3A2E2A' }}>{p.title}</p>
                      <p className="text-[10px] font-bold truncate" style={{ color: '#6B5A52' }}>
                        {p.problemText.replace(/\n/g, ' ').slice(0, 32)}…
                      </p>
                    </div>
                    <span style={{ color: '#6B5A52', fontSize: 14 }}>›</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* 問題解答 */}
        {phase === 'solving' && currentProblem && (
          <>
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPhase('problem-list')}
                className="text-xs font-bold" style={{ color: '#6B5A52' }}>
                ← 問題一覧
              </button>
              <span className="text-xs font-bold" style={{ color: '#6B5A52' }}>
                {problemIndex + 1} / {filteredProblems().length}
              </span>
            </div>
            <ProblemSolver
              key={currentProblem.id}
              problem={currentProblem}
              unitColor={unit.color}
              onSolved={handleSolved}
              onSkip={handleSkip}
              onNext={goNextProblem}
              isLast={problemIndex === filteredProblems().length - 1}
            />
          </>
        )}
      </div>
    </div>
  )
}
