'use client'

import React, { useState } from 'react'
import { Dir, findPos, simulatePath } from './MazeGame'

// ─── Debug puzzle data ────────────────────────────────────────────────────────

interface DebugPuzzle {
  id: number
  title: string
  grid: string[][]
  // brokenProgram: commands shown to the user (1-2 are wrong)
  brokenProgram: Dir[]
  // correctProgram: the actually correct commands
  correctProgram: Dir[]
  hint: string
}

const DEBUG_PUZZLES: DebugPuzzle[] = [
  {
    id: 1,
    title: 'はじめのバグ',
    grid: [
      ['.', '.', '.'],
      ['S', '.', 'G'],
      ['.', '.', '.'],
    ],
    // correct: RIGHT RIGHT
    // broken: DOWN RIGHT (first is wrong)
    brokenProgram: ['DOWN', 'RIGHT'],
    correctProgram: ['RIGHT', 'RIGHT'],
    hint: '2回みぎに進むはずだよ',
  },
  {
    id: 2,
    title: 'かどのバグ',
    grid: [
      ['S', '.', '.'],
      ['.', '#', '.'],
      ['.', '.', 'G'],
    ],
    // correct: RIGHT RIGHT DOWN DOWN
    // broken: RIGHT LEFT DOWN DOWN (2nd is wrong)
    brokenProgram: ['RIGHT', 'LEFT', 'DOWN', 'DOWN'],
    correctProgram: ['RIGHT', 'RIGHT', 'DOWN', 'DOWN'],
    hint: '2番目のコマンドがまちがってる！',
  },
  {
    id: 3,
    title: 'まわり道のバグ',
    grid: [
      ['S', '#', '.'],
      ['.', '#', '.'],
      ['.', '.', 'G'],
    ],
    // correct: DOWN DOWN RIGHT RIGHT UP UP
    // broken: DOWN UP RIGHT RIGHT UP UP (2nd is wrong)
    brokenProgram: ['DOWN', 'UP', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    correctProgram: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    hint: '2番目を直してみよう',
  },
  {
    id: 4,
    title: 'ジグザグのバグ',
    grid: [
      ['S', '.', '#'],
      ['#', '.', '.'],
      ['#', '#', 'G'],
    ],
    // correct: RIGHT DOWN RIGHT DOWN
    // broken: RIGHT DOWN LEFT DOWN (3rd is wrong)
    brokenProgram: ['RIGHT', 'DOWN', 'LEFT', 'DOWN'],
    correctProgram: ['RIGHT', 'DOWN', 'RIGHT', 'DOWN'],
    hint: '3番目のコマンドを変えよう',
  },
  {
    id: 5,
    title: 'むずかしい迷路のバグ',
    grid: [
      ['S', '.', '.', '.'],
      ['#', '#', '#', '.'],
      ['.', '.', '#', '.'],
      ['.', '.', '.', 'G'],
    ],
    // correct: RIGHT RIGHT RIGHT DOWN DOWN DOWN
    // broken: RIGHT RIGHT DOWN DOWN DOWN DOWN (3rd is wrong)
    brokenProgram: ['RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN', 'DOWN'],
    correctProgram: ['RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN'],
    hint: '3番目をみぎに変えよう',
  },
  {
    id: 6,
    title: 'Lみちのバグ',
    grid: [
      ['S', '#', '#', '#'],
      ['.', '#', '#', '#'],
      ['.', '#', '#', '#'],
      ['.', '.', '.', 'G'],
    ],
    // correct: DOWN DOWN DOWN RIGHT RIGHT RIGHT
    // broken: DOWN DOWN DOWN RIGHT LEFT RIGHT (5th is wrong)
    brokenProgram: ['DOWN', 'DOWN', 'DOWN', 'RIGHT', 'LEFT', 'RIGHT'],
    correctProgram: ['DOWN', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT'],
    hint: '5番目のコマンドを直そう',
  },
  {
    id: 7,
    title: 'かいだんのバグ',
    grid: [
      ['S', '.', '#', '#', '#'],
      ['#', '.', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    // correct: RIGHT DOWN RIGHT DOWN RIGHT RIGHT
    // broken: RIGHT DOWN LEFT DOWN RIGHT RIGHT (3rd is wrong)
    brokenProgram: ['RIGHT', 'DOWN', 'LEFT', 'DOWN', 'RIGHT', 'RIGHT'],
    correctProgram: ['RIGHT', 'DOWN', 'RIGHT', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '3番目をみぎに直そう',
  },
  {
    id: 8,
    title: 'コの字のバグ',
    grid: [
      ['S', '#', '#', 'G'],
      ['.', '#', '#', '.'],
      ['.', '.', '.', '.'],
    ],
    // correct: DOWN DOWN RIGHT RIGHT RIGHT UP UP
    // broken: DOWN DOWN RIGHT LEFT RIGHT UP UP (4th is wrong)
    brokenProgram: ['DOWN', 'DOWN', 'RIGHT', 'LEFT', 'RIGHT', 'UP', 'UP'],
    correctProgram: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    hint: '4番目をみぎに変えよう',
  },
]

// ─── Style helpers ────────────────────────────────────────────────────────────
const CELL = 50

const DIR_COLORS: Record<Dir, string> = {
  UP: '#60a5fa',
  DOWN: '#fb923c',
  LEFT: '#c084fc',
  RIGHT: '#4ade80',
}

const DIR_ARROW: Record<Dir, string> = {
  UP: '↑',
  DOWN: '↓',
  LEFT: '←',
  RIGHT: '→',
}

const ALL_DIRS: Dir[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']

function cycleDir(d: Dir): Dir {
  const i = ALL_DIRS.indexOf(d)
  return ALL_DIRS[(i + 1) % ALL_DIRS.length]
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
        background: '#FFFFFF',
        padding: '4px',
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isRobot = robotPos[0] === r && robotPos[1] === c
          const isWall = cell === '#'
          const isGoal = r === goalR && c === goalC && !isRobot
          const isStart = cell === 'S' && !isRobot
          return (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center rounded-xl"
              style={{
                width: CELL,
                height: CELL,
                background: isWall ? '#D4C4B8' : 'rgba(58,46,42,0.06)',
                fontSize: 24,
              }}
            >
              {isWall ? '🧱' : isRobot ? '🤖' : isGoal ? '⭐' : isStart ? '🚩' : ''}
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DebugGame({
  onComplete,
  onQuit,
}: {
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  const puzzles = DEBUG_PUZZLES
  const total = puzzles.length

  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [userCmds, setUserCmds] = useState<Dir[]>(() => [...puzzles[0].brokenProgram])
  const [changedIndices, setChangedIndices] = useState<Set<number>>(new Set())
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)
  const [animPath, setAnimPath] = useState<[number, number][]>([])
  const [animStep, setAnimStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [resultsLog, setResultsLog] = useState<boolean[]>([])

  const puzzle = puzzles[puzzleIdx]
  const [goalR, goalC] = findPos(puzzle.grid, 'G')

  const currentPos: [number, number] =
    animPath.length > 0 && animStep > 0
      ? animPath[Math.min(animStep, animPath.length - 1)]
      : findPos(puzzle.grid, 'S')

  function tapChip(i: number) {
    if (result !== 'idle' || isRunning) return
    setUserCmds((prev) => {
      const next = [...prev]
      next[i] = cycleDir(next[i])
      return next
    })
    setChangedIndices((prev) => {
      const next = new Set(prev)
      next.add(i)
      return next
    })
  }

  function runProgram() {
    if (isRunning) return
    const path = simulatePath(puzzle.grid, userCmds)
    setAnimPath(path)
    setAnimStep(0)
    setIsRunning(true)

    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimStep(step)
      if (step >= path.length) {
        clearInterval(interval)
        const [fr, fc] = path[path.length - 1]
        const correct = fr === goalR && fc === goalC
        setResult(correct ? 'correct' : 'wrong')
        setIsRunning(false)
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
    setUserCmds([...puzzles[nextIdx].brokenProgram])
    setChangedIndices(new Set())
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  function reset() {
    setUserCmds([...puzzle.brokenProgram])
    setChangedIndices(new Set())
    setResult('idle')
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-5 py-3 flex items-center justify-between bg-[#FFF6E5]/90 backdrop-blur-sm z-10">
        <button onClick={onQuit} className="text-[#6B5A52] hover:opacity-70 text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#16a34a]">もんだい {puzzleIdx + 1} / {total}</span>
        <span className="text-sm font-bold text-[#16a34a]">せいかい: {score}</span>
      </div>

      <div className="mt-16 mb-2 text-center px-4">
        <h2 className="text-lg font-black text-[#16a34a]">{puzzle.title}</h2>
        <p className="text-[#6B5A52] text-xs mt-1">ヒント: {puzzle.hint}</p>
        <p className="text-[#f0c040] text-xs mt-1">コマンドをタップして直そう！</p>
      </div>

      <MazeGrid grid={puzzle.grid} robotPos={currentPos} />

      {/* Broken program chips */}
      <div className="mt-4 px-4 w-full max-w-sm">
        <p className="text-[#6B5A52] text-xs mb-2 text-center">プログラム（バグがある！）</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {userCmds.map((d, i) => {
            const changed = changedIndices.has(i)
            return (
              <button
                key={i}
                onClick={() => tapChip(i)}
                disabled={result !== 'idle' || isRunning}
                className="px-4 py-2 rounded-xl font-black text-base transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
                style={{
                  background: changed ? '#f0c04033' : `${DIR_COLORS[d]}22`,
                  border: `2px solid ${changed ? '#f0c040' : DIR_COLORS[d]}`,
                  color: changed ? '#f0c040' : DIR_COLORS[d],
                  boxShadow: changed ? '0 0 8px rgba(240,192,64,0.4)' : undefined,
                }}
                title="タップで変える"
              >
                {DIR_ARROW[d]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result display */}
      {result === 'correct' && (
        <div className="my-4 flex flex-col items-center">
          <span className="text-7xl animate-bounce">○</span>
          <span className="text-[#16a34a] font-black text-lg">バグ修正！すごい！</span>
        </div>
      )}
      {result === 'wrong' && (
        <div className="my-4 flex flex-col items-center">
          <span className="text-7xl text-[#f87171]">×</span>
          <span className="text-[#f87171] font-black text-lg">まだバグがあるよ！</span>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex flex-col gap-3 w-full max-w-xs">
        {result === 'idle' && (
          <button
            onClick={runProgram}
            disabled={isRunning}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: '#4ade80', boxShadow: '4px 4px 0 0 #3A2E2A', border: '2.5px solid #3A2E2A' }}
          >
            {isRunning ? '▶ じっこう中…' : '▶ じっこうする！'}
          </button>
        )}
        {result === 'correct' && (
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] bg-[#4ade80] hover:scale-[1.02] transition-all"
          >
            {puzzleIdx + 1 < total ? '次のもんだい →' : '結果を見る！'}
          </button>
        )}
        {result === 'wrong' && (
          <button
            onClick={reset}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] hover:scale-[1.02] transition-all"
            style={{ background: '#f0c040' }}
          >
            リセット
          </button>
        )}
      </div>

      {resultsLog.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-xs">
          {resultsLog.map((ok, i) => (
            <span
              key={i}
              className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-black"
              style={{ background: ok ? '#4ade8033' : '#f8717133', color: ok ? '#16a34a' : '#dc2626', border: `1px solid ${ok ? '#4ade80' : '#f87171'}66` }}
            >
              {ok ? '○' : '×'}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
