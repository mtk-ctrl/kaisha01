'use client'

import React, { useState, useEffect, useRef } from 'react'
import { findPos } from './MazeGame'

// ─── Types ────────────────────────────────────────────────────────────────────

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type TileColor = '🔴' | '🔵' | '🟡' | '🟢'

// Rule: "if you step on color X, go direction D"
interface Rule {
  color: TileColor
  dir: Dir
}

interface RuleSet {
  rules: Rule[]
  label: string // human-readable label
}

interface ConditionalPuzzle {
  id: number
  title: string
  // Grid cells: '#'=wall, '.'=path, 'S'=start, 'G'=goal, or emoji tile color
  grid: string[][]
  choices: RuleSet[]
  correctChoice: number // index into choices
  hint: string
}

// ─── Direction helpers ────────────────────────────────────────────────────────

const DELTAS: Record<Dir, [number, number]> = {
  UP: [-1, 0], DOWN: [1, 0], LEFT: [0, -1], RIGHT: [0, 1],
}

const DIR_JP: Record<Dir, string> = {
  UP: 'うえへ',
  DOWN: 'したへ',
  LEFT: 'ひだりへ',
  RIGHT: 'みぎへ',
}

function applyRules(rules: Rule[], cell: string): Dir | null {
  for (const rule of rules) {
    if (cell === rule.color) return rule.dir
  }
  return null
}

// Simulate robot with conditional rules; returns path and whether it reached G
function simulateConditional(
  grid: string[][],
  rules: Rule[],
  maxSteps = 30
): [number, number][] {
  let [r, c] = findPos(grid, 'S')
  const path: [number, number][] = [[r, c]]
  // default movement: keep going right (overridden by rules)
  let defaultDir: Dir = 'RIGHT'

  for (let step = 0; step < maxSteps; step++) {
    const cell = grid[r][c]
    const ruleDir = applyRules(rules, cell)
    if (ruleDir) defaultDir = ruleDir

    const [dr, dc] = DELTAS[defaultDir]
    const nr = r + dr
    const nc = c + dc

    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) break
    if (grid[nr][nc] === '#') break
    r = nr; c = nc
    path.push([r, c])

    if (grid[r][c] === 'G') break
  }
  return path
}

// ─── Puzzle data ──────────────────────────────────────────────────────────────

const CONDITIONAL_PUZZLES: ConditionalPuzzle[] = [
  {
    id: 1,
    title: 'みちわかれ',
    // Grid: S goes right, hits 🔴, then route depends on rules
    // correct: 🔴→みぎ → robot goes right to G
    // Layout: S . 🔴 . G (all in row 1)
    grid: [
      ['#', '#', '#', '#', '#'],
      ['S', '.', '🔴', '.', 'G'],
      ['#', '#', '#', '#', '#'],
    ],
    choices: [
      {
        label: '🔴に来たら → みぎへ',
        rules: [{ color: '🔴', dir: 'RIGHT' }],
      },
      {
        label: '🔴に来たら → したへ',
        rules: [{ color: '🔴', dir: 'DOWN' }],
      },
      {
        label: '🔴に来たら → うえへ',
        rules: [{ color: '🔴', dir: 'UP' }],
      },
      {
        label: '🔴に来たら → ひだりへ',
        rules: [{ color: '🔴', dir: 'LEFT' }],
      },
    ],
    correctChoice: 0,
    hint: '🔴のますでどちらに曲がればゴールに行ける？',
  },
  {
    id: 2,
    title: '2色の分岐',
    // S → right until 🔴 at (1,2), then DOWN to reach row 3, then 🔵 at (3,2) → RIGHT to G(3,4)
    grid: [
      ['#', '#', '#', '#', '#'],
      ['S', '.', '🔴', '#', '#'],
      ['#', '#', '.', '#', '#'],
      ['#', '#', '🔵', '.', 'G'],
    ],
    choices: [
      {
        label: '🔴に来たら → したへ　🔵に来たら → みぎへ',
        rules: [{ color: '🔴', dir: 'DOWN' }, { color: '🔵', dir: 'RIGHT' }],
      },
      {
        label: '🔴に来たら → みぎへ　🔵に来たら → したへ',
        rules: [{ color: '🔴', dir: 'RIGHT' }, { color: '🔵', dir: 'DOWN' }],
      },
      {
        label: '🔴に来たら → したへ　🔵に来たら → うえへ',
        rules: [{ color: '🔴', dir: 'DOWN' }, { color: '🔵', dir: 'UP' }],
      },
      {
        label: '🔴に来たら → うえへ　🔵に来たら → みぎへ',
        rules: [{ color: '🔴', dir: 'UP' }, { color: '🔵', dir: 'RIGHT' }],
      },
    ],
    correctChoice: 0,
    hint: '🔴で曲がって、🔵でまた曲がろう',
  },
  {
    id: 3,
    title: 'うえへ曲がる',
    // S(2,0) → right to 🟡(2,2), UP → (0,2)=G
    grid: [
      ['#', '#', 'G', '#'],
      ['#', '#', '.', '#'],
      ['S', '.', '🟡', '#'],
      ['#', '#', '#', '#'],
    ],
    choices: [
      {
        label: '🟡に来たら → うえへ',
        rules: [{ color: '🟡', dir: 'UP' }],
      },
      {
        label: '🟡に来たら → みぎへ',
        rules: [{ color: '🟡', dir: 'RIGHT' }],
      },
      {
        label: '🟡に来たら → したへ',
        rules: [{ color: '🟡', dir: 'DOWN' }],
      },
      {
        label: '🟡に来たら → ひだりへ',
        rules: [{ color: '🟡', dir: 'LEFT' }],
      },
    ],
    correctChoice: 0,
    hint: '🟡で上に曲がるとゴールに行けるよ',
  },
  {
    id: 4,
    title: '3色チャレンジ',
    // S(0,0) right → 🔴(0,2) down → 🔵(2,2) right → 🟡(2,4) up → G(0,4)
    grid: [
      ['S', '.', '🔴', '#', 'G'],
      ['#', '#', '.', '#', '.'],
      ['#', '#', '🔵', '.', '🟡'],
    ],
    choices: [
      {
        label: '🔴に来たら → したへ　🔵に来たら → みぎへ　🟡に来たら → うえへ',
        rules: [
          { color: '🔴', dir: 'DOWN' },
          { color: '🔵', dir: 'RIGHT' },
          { color: '🟡', dir: 'UP' },
        ],
      },
      {
        label: '🔴に来たら → みぎへ　🔵に来たら → したへ　🟡に来たら → ひだりへ',
        rules: [
          { color: '🔴', dir: 'RIGHT' },
          { color: '🔵', dir: 'DOWN' },
          { color: '🟡', dir: 'LEFT' },
        ],
      },
      {
        label: '🔴に来たら → したへ　🔵に来たら → うえへ　🟡に来たら → みぎへ',
        rules: [
          { color: '🔴', dir: 'DOWN' },
          { color: '🔵', dir: 'UP' },
          { color: '🟡', dir: 'RIGHT' },
        ],
      },
      {
        label: '🔴に来たら → うえへ　🔵に来たら → みぎへ　🟡に来たら → したへ',
        rules: [
          { color: '🔴', dir: 'UP' },
          { color: '🔵', dir: 'RIGHT' },
          { color: '🟡', dir: 'DOWN' },
        ],
      },
    ],
    correctChoice: 0,
    hint: '3つの色それぞれで方向が変わるよ',
  },
  {
    id: 5,
    title: 'わかれ道②',
    // S(1,0) right → 🔴(1,2) down → (3,2) right → G(3,4)
    grid: [
      ['#', '#', '#', '#', '#'],
      ['S', '.', '🔴', '#', '#'],
      ['#', '#', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    choices: [
      {
        label: '🔴に来たら → みぎへ',
        rules: [{ color: '🔴', dir: 'RIGHT' }],
      },
      {
        label: '🔴に来たら → したへ',
        rules: [{ color: '🔴', dir: 'DOWN' }],
      },
      {
        label: '🔴に来たら → うえへ',
        rules: [{ color: '🔴', dir: 'UP' }],
      },
      {
        label: '🔴に来たら → ひだりへ',
        rules: [{ color: '🔴', dir: 'LEFT' }],
      },
    ],
    correctChoice: 1,
    hint: '🔴でどちらに曲がる？',
  },
  {
    id: 6,
    title: 'ゴールはどこ？',
    // S(0,0) right → 🔵(0,3) depending on rules hits G(2,3)
    // Correct: 🔵→したへ → (1,3) then (2,3)=G
    grid: [
      ['S', '.', '.', '🔵', '#'],
      ['#', '#', '#', '.', '#'],
      ['#', '#', '#', 'G', '#'],
    ],
    choices: [
      {
        label: '🔵に来たら → みぎへ',
        rules: [{ color: '🔵', dir: 'RIGHT' }],
      },
      {
        label: '🔵に来たら → うえへ',
        rules: [{ color: '🔵', dir: 'UP' }],
      },
      {
        label: '🔵に来たら → したへ',
        rules: [{ color: '🔵', dir: 'DOWN' }],
      },
      {
        label: '🔵に来たら → ひだりへ',
        rules: [{ color: '🔵', dir: 'LEFT' }],
      },
    ],
    correctChoice: 2,
    hint: '🔵でしたへ進むとゴールに行けるよ',
  },
]

// ─── Style helpers ────────────────────────────────────────────────────────────

const CELL = 52

const TILE_COLORS: Record<string, string> = {
  '🔴': '#f87171',
  '🔵': '#60a5fa',
  '🟡': '#fbbf24',
  '🟢': '#4ade80',
}

function MazeGrid({
  grid,
  robotPos,
}: {
  grid: string[][]
  robotPos: [number, number]
}) {
  const [goalR, goalC] = findPos(grid, 'G')
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, ${CELL}px)`,
        gap: '2px',
        background: '#162d5a',
        padding: '4px',
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isRobot = robotPos[0] === r && robotPos[1] === c
          const isWall = cell === '#'
          const isGoal = r === goalR && c === goalC && !isRobot
          const isStart = cell === 'S' && !isRobot
          const isTile = Object.keys(TILE_COLORS).includes(cell) && !isRobot
          return (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center rounded-xl"
              style={{
                width: CELL,
                height: CELL,
                background: isWall
                  ? '#0a1a38'
                  : isTile
                  ? `${TILE_COLORS[cell]}22`
                  : 'rgba(255,255,255,0.05)',
                fontSize: 24,
                border: isTile ? `1px solid ${TILE_COLORS[cell]}66` : undefined,
              }}
            >
              {isWall
                ? '🧱'
                : isRobot
                ? '🤖'
                : isGoal
                ? '⭐'
                : isStart
                ? '🚩'
                : isTile
                ? cell
                : ''}
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConditionalGame({
  onComplete,
  onQuit,
}: {
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  const puzzles = CONDITIONAL_PUZZLES
  const total = puzzles.length

  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [result, setResult] = useState<'idle' | 'animating' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)
  const [animPath, setAnimPath] = useState<[number, number][]>([])
  const [animStep, setAnimStep] = useState(0)
  const [resultsLog, setResultsLog] = useState<boolean[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const puzzle = puzzles[puzzleIdx]
  const [goalR, goalC] = findPos(puzzle.grid, 'G')

  const currentPos: [number, number] =
    animPath.length > 0 && animStep > 0
      ? animPath[Math.min(animStep, animPath.length - 1)]
      : findPos(puzzle.grid, 'S')

  function selectChoice(idx: number) {
    if (result !== 'idle') return
    setSelectedChoice(idx)
    setResult('animating')

    const rules = puzzle.choices[idx].rules
    const path = simulateConditional(puzzle.grid, rules)
    setAnimPath(path)
    setAnimStep(0)

    let step = 0
    intervalRef.current = setInterval(() => {
      step++
      setAnimStep(step)
      if (step >= path.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const [fr, fc] = path[path.length - 1]
        const correct = fr === goalR && fc === goalC
        setResult(correct ? 'correct' : 'wrong')
        if (correct) setScore((s) => s + 1)
        setResultsLog((prev) => [...prev, correct])
      }
    }, 380)
  }

  function next() {
    const nextIdx = puzzleIdx + 1
    if (nextIdx >= total) {
      onComplete(score)
      return
    }
    setPuzzleIdx(nextIdx)
    setSelectedChoice(null)
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  function retry() {
    setSelectedChoice(null)
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-5 py-3 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={onQuit} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#4ade80]">もんだい {puzzleIdx + 1} / {total}</span>
        <span className="text-sm font-bold text-[#4ade80]">せいかい: {score}</span>
      </div>

      <div className="mt-16 mb-3 text-center px-4">
        <div className="text-4xl mb-1">🔀</div>
        <h2 className="text-lg font-black text-[#4ade80]">{puzzle.title}</h2>
        <p className="text-[#94a3c4] text-xs mt-1">ヒント: {puzzle.hint}</p>
        <p className="text-[#f0c040] text-xs mt-1">ルールを選んでロボットを動かそう！</p>
      </div>

      <MazeGrid grid={puzzle.grid} robotPos={currentPos} />

      {/* Result display */}
      {result === 'correct' && (
        <div className="my-4 flex flex-col items-center">
          <span className="text-7xl animate-bounce">○</span>
          <span className="text-[#4ade80] font-black text-lg">ゴール！すごい！</span>
        </div>
      )}
      {result === 'wrong' && (
        <div className="my-4 flex flex-col items-center">
          <span className="text-7xl text-[#f87171]">×</span>
          <span className="text-[#f87171] font-black text-lg">ゴールに着かなかった…</span>
        </div>
      )}
      {result === 'animating' && (
        <div className="my-2">
          <span className="text-[#f0c040] font-bold text-sm">▶ じっこう中…</span>
        </div>
      )}

      {/* Choices */}
      {result === 'idle' && (
        <div className="mt-4 w-full max-w-sm flex flex-col gap-3">
          {puzzle.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => selectChoice(i)}
              className="w-full px-4 py-4 rounded-2xl font-bold text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#e8f0fe',
              }}
            >
              <span className="text-[#94a3c4] mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* After result: show highlighted choices */}
      {(result === 'correct' || result === 'wrong') && selectedChoice !== null && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          {puzzle.choices.map((choice, i) => {
            const isSelected = i === selectedChoice
            const isCorrChoice = i === puzzle.correctChoice
            return (
              <div
                key={i}
                className="w-full px-4 py-4 rounded-2xl font-bold text-sm text-left"
                style={{
                  background: isCorrChoice
                    ? 'rgba(74,222,128,0.15)'
                    : isSelected
                    ? 'rgba(248,113,113,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    isCorrChoice
                      ? '#4ade80'
                      : isSelected
                      ? '#f87171'
                      : 'rgba(255,255,255,0.1)'
                  }`,
                  color: isCorrChoice ? '#4ade80' : isSelected ? '#f87171' : '#94a3c4',
                }}
              >
                <span className="mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
                {choice.label}
                {isCorrChoice && ' ✓'}
              </div>
            )
          })}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-5 flex flex-col gap-3 w-full max-w-sm">
        {result === 'correct' && (
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#4ade80] hover:scale-[1.02] transition-all"
          >
            {puzzleIdx + 1 < total ? '次のもんだい →' : '結果を見る！'}
          </button>
        )}
        {result === 'wrong' && (
          <button
            onClick={retry}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] hover:scale-[1.02] transition-all"
            style={{ background: '#f0c040' }}
          >
            もう一回！
          </button>
        )}
      </div>

      {resultsLog.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-xs">
          {resultsLog.map((ok, i) => (
            <span
              key={i}
              className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-black"
              style={{ background: ok ? '#4ade8033' : '#f8717133', color: ok ? '#4ade80' : '#f87171', border: `1px solid ${ok ? '#4ade80' : '#f87171'}66` }}
            >
              {ok ? '○' : '×'}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
