'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { JUKU_UNITS, Problem, DiagramType } from '@/data/jukuData'
import { getDataKey } from '@/lib/storage'

const JUKU_PROGRESS_KEY = 'tanq_juku_progress_v1'

type Phase = 'unit-intro' | 'problem-list' | 'solving' | 'answered'

type ProgressStore = Record<string, { cleared: number; total: number; solvedIds: string[] }>

function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(JUKU_PROGRESS_KEY)) || '{}') } catch { return {} }
}

function saveUnitProgress(unitId: string, solvedId: string, total: number) {
  if (typeof window === 'undefined') return
  const store = loadProgress()
  const cur = store[unitId] || { cleared: 0, total, solvedIds: [] }
  if (!cur.solvedIds.includes(solvedId)) {
    cur.solvedIds.push(solvedId)
  }
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
// SVG Diagrams
// ─────────────────────────────────────

function SlideRulerDiagram({ spec, highlight }: { spec: Record<string, unknown>; highlight?: boolean }) {
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
          const inRange = fromIdx <= i && i <= toIdx || toIdx <= i && i <= fromIdx
          return (
            <React.Fragment key={unit}>
              <div
                className="w-14 h-10 rounded-lg flex items-center justify-center font-black text-sm transition-all"
                style={{
                  background: isFrom ? '#FFC83D' : isTo ? '#00e5c3' : inRange && highlight ? '#DBF6F0' : '#FFFFFF',
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
    </div>
  )
}

function DotLineDiagram({ spec }: { spec: Record<string, unknown> }) {
  const type = spec.type as string

  if (type === 'circle') {
    const total = spec.totalLength as number
    const interval = spec.interval as number
    const count = total && interval ? Math.round(total / interval) : (spec.flags as number ?? 8)
    const radius = 52
    const cx = 70, cy = 70
    const dots = Array.from({ length: Math.min(count, 24) }, (_, i) => {
      const angle = (2 * Math.PI * i) / Math.min(count, 24) - Math.PI / 2
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
    })
    return (
      <svg viewBox="0 0 140 140" className="w-36 h-36 mx-auto">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#C4B8AE" strokeWidth="1.5" strokeDasharray="4 3" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={5} fill="#4ade80" stroke="#3A2E2A" strokeWidth="1.5" />
        ))}
        {count > 24 && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="#6B5A52" fontWeight="bold">{count}本</text>}
      </svg>
    )
  }

  if (type === 'square' || type === 'hollow-square') {
    const side = spec.perSide as number ?? spec.side as number ?? 5
    const spacing = 20
    const offset = 10
    const positions: { x: number; y: number }[] = []
    for (let i = 0; i < side; i++) positions.push({ x: offset + i * spacing, y: offset })
    for (let i = 1; i < side; i++) positions.push({ x: offset + (side - 1) * spacing, y: offset + i * spacing })
    for (let i = side - 2; i >= 0; i--) positions.push({ x: offset + i * spacing, y: offset + (side - 1) * spacing })
    for (let i = side - 2; i >= 1; i--) positions.push({ x: offset, y: offset + i * spacing })
    const svgSize = offset * 2 + (side - 1) * spacing
    return (
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-36 h-36 mx-auto">
        {positions.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} fill="#4ade80" stroke="#3A2E2A" strokeWidth="1.5" />
        ))}
        {type === 'hollow-square' && (
          <rect x={offset + spacing} y={offset + spacing} width={(side - 3) * spacing} height={(side - 3) * spacing}
            fill="rgba(200,200,200,0.2)" stroke="#C4B8AE" strokeDasharray="3 3" strokeWidth="1" />
        )}
      </svg>
    )
  }

  // Default: line-both / line-none / line-left
  const total = spec.totalLength as number ?? 20
  const interval = spec.interval as number ?? 4
  const trees = spec.trees as number ?? Math.round(total / interval) + 1
  const treeType = type === 'line-none' ? 'none' : type === 'line-left' ? 'left' : 'both'
  const count = Math.min(trees, 12)
  const spacing = 180 / (count - 1 || 1)
  const dotY = 40
  const dots = Array.from({ length: count }, (_, i) => ({ x: 10 + i * spacing }))

  return (
    <svg viewBox="0 0 200 80" className="w-full max-w-[220px] mx-auto">
      <line x1="10" y1={dotY} x2="190" y2={dotY} stroke="#C4B8AE" strokeWidth="2" />
      {dots.map((d, i) => {
        const isEnd = i === 0 || i === count - 1
        const filled = (treeType === 'both') ||
          (treeType === 'left' && i === 0) ||
          (treeType === 'none' && !isEnd)
        if (!filled && treeType === 'none' && isEnd) return null
        return (
          <circle key={i} cx={d.x} cy={dotY} r={isEnd ? 7 : 5}
            fill={filled ? '#4ade80' : '#FFFFFF'}
            stroke="#3A2E2A" strokeWidth="1.5" />
        )
      })}
      {/* Gap label */}
      {count >= 2 && (
        <>
          <line x1={dots[0].x} y1={dotY + 14} x2={dots[1].x} y2={dotY + 14} stroke="#f0c040" strokeWidth="1.5" />
          <text x={(dots[0].x + dots[1].x) / 2} y={dotY + 24} textAnchor="middle" fontSize="8" fill="#6B5A52" fontWeight="bold">
            {interval}m
          </text>
        </>
      )}
      <text x="10" y="15" fontSize="8" fill="#6B5A52">🌳 ×{count}{count < trees ? `(/${trees})` : ''}</text>
    </svg>
  )
}

function DiagramRenderer({
  type, spec, revealStep,
}: {
  type: DiagramType
  spec: Record<string, unknown>
  revealStep: number
}) {
  if (type === 'none') return null

  return (
    <div className="rounded-2xl p-4 flex flex-col items-center"
      style={{ background: '#FFF6E5', border: '2.5px solid #3A2E2A', minHeight: 100 }}>
      <p className="text-[10px] font-black mb-2" style={{ color: '#6B5A52' }}>
        {type === 'slide' ? '📐 スライド図' : type === 'dot-line' ? '🌳 図で確認' : '📊 図'}
      </p>
      {type === 'slide' && <SlideRulerDiagram spec={spec} highlight={revealStep >= 1} />}
      {type === 'dot-line' && <DotLineDiagram spec={spec} />}
    </div>
  )
}

// ─────────────────────────────────────
// Problem Solver
// ─────────────────────────────────────

function ProblemSolver({
  problem,
  unitColor,
  onSolved,
  onNext,
  isLast,
}: {
  problem: Problem
  unitColor: string
  onSolved: (id: string) => void
  onNext: () => void
  isLast: boolean
}) {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<'answering' | 'correct' | 'wrong'>('answering')
  const [openHints, setOpenHints] = useState<number[]>([])
  const [revealStep, setRevealStep] = useState(0)

  const diff = DIFF_LABEL[problem.difficulty]

  function checkAnswer() {
    const norm = (s: string) => s.trim().replace(/,/g, '').replace(/，/g, '')
    if (norm(input) === norm(problem.answer)) {
      setPhase('correct')
      onSolved(problem.id)
    } else {
      setPhase('wrong')
    }
  }

  function openHint(step: number) {
    if (!openHints.includes(step)) {
      setOpenHints(prev => [...prev, step])
      setRevealStep(step)
    }
  }

  function retry() {
    setPhase('answering')
    setInput('')
  }

  return (
    <div className="space-y-4">
      {/* Problem header */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: diff.bg, border: `2px solid ${diff.color}`, color: diff.color }}>
          {diff.label}
        </span>
        <span className="text-[11px] font-bold" style={{ color: '#6B5A52' }}>{problem.title}</span>
      </div>

      {/* Problem text */}
      <div className="rounded-[18px] p-4"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <p className="font-bold text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#3A2E2A' }}>
          {problem.problemText}
        </p>
      </div>

      {/* Diagram */}
      {problem.diagramType !== 'none' && (
        <DiagramRenderer type={problem.diagramType} spec={problem.diagramSpec} revealStep={revealStep} />
      )}

      {/* Answer input */}
      {phase === 'answering' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input && checkAnswer()}
              placeholder="こたえを入力"
              className="flex-1 rounded-2xl px-4 py-3 font-bold text-base text-center outline-none"
              style={{
                background: '#FFF6E5',
                border: '2.5px solid #3A2E2A',
                boxShadow: '2px 2px 0 0 #3A2E2A',
                color: '#3A2E2A',
              }}
            />
            {problem.answerUnit && (
              <span className="font-black text-sm" style={{ color: '#6B5A52' }}>{problem.answerUnit}</span>
            )}
          </div>
          <button
            onClick={checkAnswer}
            disabled={!input}
            className="w-full py-3 rounded-full font-black text-base transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: unitColor, border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            こたえあわせ →
          </button>
        </div>
      )}

      {/* Correct */}
      {phase === 'correct' && (
        <div className="rounded-[18px] p-4 space-y-3"
          style={{ background: '#DBF6F0', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-lg" style={{ color: '#2BA39A' }}>せいかい！</span>
          </div>
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>
            {problem.explanationText}
          </p>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            {isLast ? '単元をおわる 🏁' : 'つぎの問題 →'}
          </button>
        </div>
      )}

      {/* Wrong */}
      {phase === 'wrong' && (
        <div className="rounded-[18px] p-4 space-y-3"
          style={{ background: '#FFE3EE', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
          <p className="font-black text-sm" style={{ color: '#FF6F9C' }}>
            ちがうよ。ヒントを見てもう1度チャレンジしよう！
          </p>
          <button
            onClick={retry}
            className="w-full py-2.5 rounded-full font-black text-sm"
            style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', color: '#3A2E2A' }}>
            もう1度 →
          </button>
        </div>
      )}

      {/* Hints */}
      <div className="space-y-2">
        <p className="text-[11px] font-black" style={{ color: '#6B5A52' }}>ヒント</p>
        {problem.hints.map(hint => {
          const isOpen = openHints.includes(hint.step)
          return (
            <div key={hint.step}>
              {!isOpen ? (
                <button
                  onClick={() => openHint(hint.step)}
                  className="w-full text-left rounded-2xl px-4 py-2.5 font-bold text-xs transition-all hover:-translate-y-0.5"
                  style={{ background: '#FFF6E5', border: '2px solid #C4B8AE', color: '#6B5A52' }}>
                  ヒント{hint.step}を見る（少しだけ教えてもらう）
                </button>
              ) : (
                <div className="rounded-2xl px-4 py-3"
                  style={{ background: '#FFF1B8', border: '2px solid #3A2E2A' }}>
                  <p className="text-[10px] font-black mb-1" style={{ color: '#C99700' }}>ヒント{hint.step}</p>
                  <p className="text-xs font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>{hint.text}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────
// Main page
// ─────────────────────────────────────

export default function JukuUnitPage() {
  const params = useParams()
  const unitId = params.unitId as string
  const unit = JUKU_UNITS.find(u => u.id === unitId)

  const [phase, setPhase] = useState<Phase>('unit-intro')
  const [selectedDiff, setSelectedDiff] = useState<1 | 2 | 3>(1)
  const [problemIndex, setProblemIndex] = useState(0)
  const [solvedIds, setSolvedIds] = useState<string[]>([])

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

  const filteredProblems = unit.problems.filter(p => p.difficulty === selectedDiff)
  const currentProblem = filteredProblems[problemIndex]

  function goNextProblem() {
    if (problemIndex < filteredProblems.length - 1) {
      setProblemIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setPhase('problem-list')
      setProblemIndex(0)
    }
  }

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
      {/* Header */}
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
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: unit.color }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{totalSolved}/{totalProblems}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Unit intro */}
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
            <button
              onClick={() => setPhase('problem-list')}
              className="w-full py-4 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
              style={{ background: unit.color, border: '3px solid #3A2E2A', boxShadow: '5px 5px 0 0 #3A2E2A', color: '#3A2E2A' }}>
              問題をとく →
            </button>
          </>
        )}

        {/* Problem list */}
        {phase === 'problem-list' && (
          <>
            {/* Difficulty selector */}
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(d => {
                const dl = DIFF_LABEL[d]
                const count = unit.problems.filter(p => p.difficulty === d).length
                const solved = unit.problems.filter(p => p.difficulty === d && solvedIds.includes(p.id)).length
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
                    <span style={{ fontSize: 9, fontWeight: 700 }}>{solved}/{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Problem cards */}
            <div className="space-y-2">
              {filteredProblems.map((p, i) => {
                const solved = solvedIds.includes(p.id)
                return (
                  <button key={p.id}
                    onClick={() => { setProblemIndex(i); setPhase('solving') }}
                    className="w-full text-left rounded-[18px] px-4 py-3 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                    style={{
                      background: solved ? '#DBF6F0' : '#FFFFFF',
                      border: '2.5px solid #3A2E2A',
                      boxShadow: '2px 2px 0 0 #3A2E2A',
                    }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs"
                      style={{ background: solved ? '#2BA39A' : unit.color + '33', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
                      {solved ? '✓' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs truncate" style={{ color: '#3A2E2A' }}>{p.title}</p>
                      <p className="text-[10px] font-bold truncate" style={{ color: '#6B5A52' }}>
                        {p.problemText.slice(0, 30)}…
                      </p>
                    </div>
                    <span style={{ color: '#6B5A52', fontSize: 14 }}>›</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Solving */}
        {phase === 'solving' && currentProblem && (
          <>
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPhase('problem-list')}
                className="text-xs font-bold" style={{ color: '#6B5A52' }}>
                ← 問題一覧
              </button>
              <span className="text-xs font-bold" style={{ color: '#6B5A52' }}>
                {problemIndex + 1} / {filteredProblems.length}
              </span>
            </div>
            <ProblemSolver
              key={currentProblem.id}
              problem={currentProblem}
              unitColor={unit.color}
              onSolved={handleSolved}
              onNext={goNextProblem}
              isLast={problemIndex === filteredProblems.length - 1}
            />
          </>
        )}
      </div>
    </div>
  )
}
