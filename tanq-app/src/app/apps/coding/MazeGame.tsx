'use client'

import React, { useState, useRef } from 'react'

export type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface MazePuzzle {
  id: number
  title: string
  grid: string[][]
  answer: Dir[]
  hint: string
}

// ─── Type1: Sequential maze puzzles (10 problems) ────────────────────────────
const TYPE1_PUZZLES: MazePuzzle[] = [
  {
    id: 1,
    title: 'はじめの一歩',
    grid: [
      ['.', '.', '.'],
      ['S', '.', 'G'],
      ['.', '.', '.'],
    ],
    answer: ['RIGHT', 'RIGHT'],
    hint: 'まっすぐ進もう',
  },
  {
    id: 2,
    title: 'かどを曲がれ',
    grid: [
      ['S', '.', '.'],
      ['.', '#', '.'],
      ['.', '.', 'G'],
    ],
    answer: ['RIGHT', 'RIGHT', 'DOWN', 'DOWN'],
    hint: 'みぎ→みぎ→した→した',
  },
  {
    id: 3,
    title: 'まわり道',
    grid: [
      ['S', '#', '.'],
      ['.', '#', '.'],
      ['.', '.', 'G'],
    ],
    answer: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    hint: 'かべをよけて遠回り',
  },
  {
    id: 4,
    title: 'ジグザグロード',
    grid: [
      ['S', '.', '#'],
      ['#', '.', '.'],
      ['#', '#', 'G'],
    ],
    answer: ['RIGHT', 'DOWN', 'RIGHT', 'DOWN'],
    hint: 'ジグザグに進もう',
  },
  {
    id: 5,
    title: 'むずかしい迷路',
    grid: [
      ['S', '.', '.', '.'],
      ['#', '#', '#', '.'],
      ['.', '.', '#', '.'],
      ['.', '.', '.', 'G'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN'],
    hint: '右→右→右→下→下→下',
  },
  {
    id: 7,
    title: 'L字のみち',
    grid: [
      ['S', '#', '#', '#'],
      ['.', '#', '#', '#'],
      ['.', '#', '#', '#'],
      ['.', '.', '.', 'G'],
    ],
    answer: ['DOWN', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT'],
    hint: '下に行ってから右へ',
  },
  {
    id: 9,
    title: 'かいだん',
    grid: [
      ['S', '.', '#', '#', '#'],
      ['#', '.', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    answer: ['RIGHT', 'DOWN', 'RIGHT', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '階段みたいにジグザグ',
  },
  {
    id: 10,
    title: 'コの字みち',
    grid: [
      ['S', '#', '#', 'G'],
      ['.', '#', '#', '.'],
      ['.', '.', '.', '.'],
    ],
    answer: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    hint: 'コの字を描くように進もう',
  },
  {
    id: 13,
    title: 'めいろのわな',
    grid: [
      ['S', '#', '#', '#', '#'],
      ['.', '#', '.', '.', '.'],
      ['.', '.', '.', '#', '.'],
      ['#', '#', '#', '#', 'G'],
    ],
    answer: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'UP', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN'],
    hint: '下→右→上→右→下とすすむ',
  },
  {
    id: 15,
    title: 'スパイ作戦',
    grid: [
      ['S', '#', '#', '#', '#'],
      ['.', '#', '.', '.', '.'],
      ['.', '.', '.', '#', '.'],
      ['#', '#', '#', '#', '.'],
      ['#', '#', '#', 'G', '.'],
    ],
    answer: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'UP', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN', 'LEFT'],
    hint: '上下左右を組み合わせて',
  },
]

// ─── Type2: Loop maze puzzles (8 problems) ────────────────────────────────────
export interface LoopCmd {
  dir: Dir
  count: number
}

export interface LoopMazePuzzle {
  id: number
  title: string
  grid: string[][]
  commandLimit: number
  hint: string
  // answer is used for verification reference only
  answer: LoopCmd[]
}

const TYPE2_PUZZLES: LoopMazePuzzle[] = [
  {
    id: 1,
    title: 'くりかえしの第一歩',
    // S at (0,0), G at (0,4) — need RIGHT×4, limit 3
    grid: [
      ['S', '.', '.', '.', 'G'],
    ],
    commandLimit: 3,
    answer: [{ dir: 'RIGHT', count: 4 }],
    hint: 'みぎを何回くりかえす？',
  },
  {
    id: 2,
    title: 'みちじゅん',
    // S(0,0) RIGHT×4 → (0,4) DOWN×2 → G(2,4), limit 4
    grid: [
      ['S', '.', '.', '.', '.'],
      ['#', '#', '#', '#', '.'],
      ['#', '#', '#', '#', 'G'],
    ],
    commandLimit: 4,
    answer: [{ dir: 'RIGHT', count: 4 }, { dir: 'DOWN', count: 2 }],
    hint: 'みぎ4回、した2回',
  },
  {
    id: 3,
    title: 'ながい廊下',
    // S(1,0) RIGHT×6 → G(1,6), limit 3
    grid: [
      ['#', '#', '#', '#', '#', '#', '#'],
      ['S', '.', '.', '.', '.', '.', 'G'],
      ['#', '#', '#', '#', '#', '#', '#'],
    ],
    commandLimit: 3,
    answer: [{ dir: 'RIGHT', count: 6 }],
    hint: 'みぎを6回！',
  },
  {
    id: 4,
    title: 'かいだんみち',
    // S(0,0) RIGHT×3→(0,3) DOWN×3→G(3,3), limit 4
    grid: [
      ['S', '.', '.', '.', '#'],
      ['#', '#', '#', '.', '#'],
      ['#', '#', '#', '.', '#'],
      ['#', '#', '#', 'G', '#'],
    ],
    commandLimit: 4,
    answer: [{ dir: 'RIGHT', count: 3 }, { dir: 'DOWN', count: 3 }],
    hint: 'みぎ3回・した3回',
  },
  {
    id: 5,
    title: 'ぐねぐねみち',
    // S(0,0) RIGHT×2→(0,2) DOWN×2→(2,2) RIGHT×2→G(2,4), limit 5
    grid: [
      ['S', '.', '.', '#', '#'],
      ['#', '#', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    commandLimit: 5,
    answer: [{ dir: 'RIGHT', count: 2 }, { dir: 'DOWN', count: 2 }, { dir: 'RIGHT', count: 2 }],
    hint: 'みぎ・した・みぎを使おう',
  },
  {
    id: 6,
    title: 'Uターン',
    // S(0,0) DOWN×3→(3,0) RIGHT×4→(3,4) UP×3→G(0,4), limit 5
    grid: [
      ['S', '#', '#', '#', 'G'],
      ['.', '#', '#', '#', '.'],
      ['.', '#', '#', '#', '.'],
      ['.', '.', '.', '.', '.'],
    ],
    commandLimit: 5,
    answer: [{ dir: 'DOWN', count: 3 }, { dir: 'RIGHT', count: 4 }, { dir: 'UP', count: 3 }],
    hint: 'した→みぎ→うえ',
  },
  {
    id: 7,
    title: 'しましまロード',
    // S(2,0) RIGHT×6→G(2,6), limit 3
    grid: [
      ['#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#'],
      ['S', '.', '.', '.', '.', '.', 'G'],
      ['#', '#', '#', '#', '#', '#', '#'],
    ],
    commandLimit: 3,
    answer: [{ dir: 'RIGHT', count: 6 }],
    hint: 'みぎに6回！',
  },
  {
    id: 8,
    title: 'スパイラルチャレンジ',
    // S(0,0) RIGHT×4→(0,4) DOWN×4→(4,4) LEFT×4→G(4,0), limit 5
    grid: [
      ['S', '.', '.', '.', '.'],
      ['#', '#', '#', '#', '.'],
      ['#', '#', '#', '#', '.'],
      ['#', '#', '#', '#', '.'],
      ['G', '.', '.', '.', '.'],
    ],
    commandLimit: 5,
    answer: [{ dir: 'RIGHT', count: 4 }, { dir: 'DOWN', count: 4 }, { dir: 'LEFT', count: 4 }],
    hint: 'みぎ・した・ひだり',
  },
]

// ─── Shared utilities ─────────────────────────────────────────────────────────

export function findPos(grid: string[][], char: string): [number, number] {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c] === char) return [r, c]
  return [0, 0]
}

const DELTAS: Record<Dir, [number, number]> = {
  UP: [-1, 0], DOWN: [1, 0], LEFT: [0, -1], RIGHT: [0, 1],
}

export function simulatePath(grid: string[][], cmds: Dir[]): [number, number][] {
  let [r, c] = findPos(grid, 'S')
  const path: [number, number][] = [[r, c]]
  for (const cmd of cmds) {
    const [dr, dc] = DELTAS[cmd]
    const nr = r + dr
    const nc = c + dc
    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) break
    if (grid[nr][nc] === '#') break
    r = nr; c = nc
    path.push([r, c])
  }
  return path
}

export function simulateLoopPath(grid: string[][], cmds: LoopCmd[]): [number, number][] {
  const expanded: Dir[] = []
  for (const { dir, count } of cmds) {
    for (let i = 0; i < count; i++) expanded.push(dir)
  }
  return simulatePath(grid, expanded)
}

// ─── Style helpers ────────────────────────────────────────────────────────────
const CELL = 52

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

const DIR_LABEL: Record<Dir, string> = {
  UP: 'うえ',
  DOWN: 'した',
  LEFT: 'ひだり',
  RIGHT: 'みぎ',
}

// ─── Grid renderer ────────────────────────────────────────────────────────────
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
          return (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: CELL,
                height: CELL,
                background: isWall ? '#0a1a38' : 'rgba(255,255,255,0.05)',
                fontSize: 26,
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

// ─── Type1: Sequential MazeGame ───────────────────────────────────────────────

function SequentialMazeGame({
  onComplete,
  onQuit,
}: {
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  const puzzles = TYPE1_PUZZLES
  const total = puzzles.length

  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [selected, setSelected] = useState<Dir[]>([])
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

  function addCmd(d: Dir) {
    if (result !== 'idle' || isRunning) return
    setSelected((prev) => [...prev, d])
  }

  function removeLastCmd() {
    if (result !== 'idle' || isRunning) return
    setSelected((prev) => prev.slice(0, -1))
  }

  function runProgram() {
    if (isRunning || selected.length === 0) return
    const path = simulatePath(puzzle.grid, selected)
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
    if (puzzleIdx + 1 >= total) {
      const finalScore = score
      onComplete(finalScore)
      return
    }
    setPuzzleIdx((i) => i + 1)
    setSelected([])
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  function reset() {
    setSelected([])
    setResult('idle')
    // keep animPath so robot stays at crash position
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-5 py-3 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={onQuit} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#4ade80]">もんだい {puzzleIdx + 1} / {total}</span>
        <span className="text-sm font-bold text-[#4ade80]">せいかい: {score}</span>
      </div>

      <div className="mt-16 mb-3 text-center">
        <h2 className="text-lg font-black text-[#4ade80]">{puzzle.title}</h2>
        <p className="text-[#94a3c4] text-xs mt-1">ヒント: {puzzle.hint}</p>
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
          <span className="text-[#f87171] font-black text-lg">もう一回やってみよう</span>
        </div>
      )}

      {/* Direction buttons */}
      {result === 'idle' && (
        <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs">
          {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as Dir[]).map((d) => (
            <button
              key={d}
              onClick={() => addCmd(d)}
              disabled={isRunning}
              className="py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.04] active:scale-95 disabled:opacity-40"
              style={{
                background: `${DIR_COLORS[d]}22`,
                border: `1px solid ${DIR_COLORS[d]}66`,
                color: DIR_COLORS[d],
              }}
            >
              {DIR_ARROW[d]} {DIR_LABEL[d]}
            </button>
          ))}
        </div>
      )}

      {/* Selected command chips + backspace */}
      {result === 'idle' && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-xs w-full min-h-[2.5rem]">
          {selected.map((d, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg text-sm font-bold"
              style={{
                background: `${DIR_COLORS[d]}33`,
                border: `1px solid ${DIR_COLORS[d]}88`,
                color: DIR_COLORS[d],
              }}
            >
              {DIR_ARROW[d]}
            </span>
          ))}
          {selected.length > 0 && (
            <button
              onClick={removeLastCmd}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3c4' }}
              title="さいごを消す"
            >
              ⌫ さいごを消す
            </button>
          )}
        </div>
      )}

      {/* Run / Next / Reset */}
      <div className="mt-4 flex flex-col gap-3 w-full max-w-xs">
        {result === 'idle' && selected.length > 0 && (
          <button
            onClick={runProgram}
            disabled={isRunning}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: '#4ade80', boxShadow: '0 0 30px rgba(74,222,128,0.35)' }}
          >
            {isRunning ? '▶ じっこう中…' : '▶ じっこうする！'}
          </button>
        )}
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
            onClick={reset}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] hover:scale-[1.02] transition-all"
            style={{ background: '#f0c040' }}
          >
            リセット
          </button>
        )}
      </div>

      {/* Results log chips */}
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

// ─── Type2: Loop MazeGame ─────────────────────────────────────────────────────

function LoopMazeGame({
  onComplete,
  onQuit,
}: {
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  const puzzles = TYPE2_PUZZLES
  const total = puzzles.length

  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [cmds, setCmds] = useState<LoopCmd[]>([])
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

  function addDir(d: Dir) {
    if (result !== 'idle' || isRunning) return
    if (cmds.length >= puzzle.commandLimit) return
    setCmds((prev) => [...prev, { dir: d, count: 1 }])
  }

  function setLastCount(count: number) {
    if (result !== 'idle' || isRunning || cmds.length === 0) return
    setCmds((prev) => {
      const next = [...prev]
      next[next.length - 1] = { ...next[next.length - 1], count }
      return next
    })
  }

  function removeLastCmd() {
    if (result !== 'idle' || isRunning) return
    setCmds((prev) => prev.slice(0, -1))
  }

  function runProgram() {
    if (isRunning || cmds.length === 0) return
    const path = simulateLoopPath(puzzle.grid, cmds)
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
    }, 350)
  }

  function next() {
    if (puzzleIdx + 1 >= total) {
      onComplete(score)
      return
    }
    setPuzzleIdx((i) => i + 1)
    setCmds([])
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  function reset() {
    setCmds([])
    setResult('idle')
  }

  const lastCmd = cmds.length > 0 ? cmds[cmds.length - 1] : null

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-5 py-3 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={onQuit} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#4ade80]">もんだい {puzzleIdx + 1} / {total}</span>
        <span className="text-sm font-bold text-[#4ade80]">せいかい: {score}</span>
      </div>

      <div className="mt-16 mb-1 text-center">
        <h2 className="text-lg font-black text-[#4ade80]">{puzzle.title}</h2>
        <p className="text-[#94a3c4] text-xs mt-0.5">ヒント: {puzzle.hint}</p>
        <p className="text-xs mt-1" style={{ color: cmds.length >= puzzle.commandLimit ? '#f87171' : '#94a3c4' }}>
          コマンド: {cmds.length} / {puzzle.commandLimit}
        </p>
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
          <span className="text-[#f87171] font-black text-lg">もう一回やってみよう</span>
        </div>
      )}

      {/* Direction buttons */}
      {result === 'idle' && (
        <div className="mt-3 grid grid-cols-2 gap-2 w-full max-w-xs">
          {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as Dir[]).map((d) => (
            <button
              key={d}
              onClick={() => addDir(d)}
              disabled={isRunning || cmds.length >= puzzle.commandLimit}
              className="py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.04] active:scale-95 disabled:opacity-40"
              style={{
                background: `${DIR_COLORS[d]}22`,
                border: `1px solid ${DIR_COLORS[d]}66`,
                color: DIR_COLORS[d],
              }}
            >
              {DIR_ARROW[d]} {DIR_LABEL[d]}
            </button>
          ))}
        </div>
      )}

      {/* Count multiplier for last command */}
      {result === 'idle' && lastCmd && (
        <div className="mt-2 flex gap-2 items-center">
          <span className="text-[#94a3c4] text-xs">×回数:</span>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => setLastCount(n)}
              disabled={isRunning}
              className="w-8 h-8 rounded-lg font-black text-sm transition-all hover:scale-110 disabled:opacity-40"
              style={{
                background: lastCmd.count === n ? DIR_COLORS[lastCmd.dir] : `${DIR_COLORS[lastCmd.dir]}33`,
                color: lastCmd.count === n ? '#050b14' : DIR_COLORS[lastCmd.dir],
                border: `1px solid ${DIR_COLORS[lastCmd.dir]}66`,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* Command chips */}
      {result === 'idle' && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-xs w-full min-h-[2.5rem]">
          {cmds.map((cmd, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg text-sm font-bold"
              style={{
                background: `${DIR_COLORS[cmd.dir]}33`,
                border: `1px solid ${DIR_COLORS[cmd.dir]}88`,
                color: DIR_COLORS[cmd.dir],
              }}
            >
              {DIR_ARROW[cmd.dir]}×{cmd.count}
            </span>
          ))}
          {cmds.length > 0 && (
            <button
              onClick={removeLastCmd}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3c4' }}
            >
              ⌫ さいごを消す
            </button>
          )}
        </div>
      )}

      {/* Run / Next / Reset */}
      <div className="mt-4 flex flex-col gap-3 w-full max-w-xs">
        {result === 'idle' && cmds.length > 0 && (
          <button
            onClick={runProgram}
            disabled={isRunning}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: '#4ade80', boxShadow: '0 0 30px rgba(74,222,128,0.35)' }}
          >
            {isRunning ? '▶ じっこう中…' : '▶ じっこうする！'}
          </button>
        )}
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
            onClick={reset}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] hover:scale-[1.02] transition-all"
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

// ─── Exported component ───────────────────────────────────────────────────────
export default function MazeGame({
  chapterIndex,
  onComplete,
  onQuit,
}: {
  chapterIndex: 0 | 1
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  if (chapterIndex === 0) {
    return <SequentialMazeGame onComplete={onComplete} onQuit={onQuit} />
  }
  return <LoopMazeGame onComplete={onComplete} onQuit={onQuit} />
}
