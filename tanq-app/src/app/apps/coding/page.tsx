'use client'

import React, { useState } from 'react'
import Link from 'next/link'

/* ─────────────────────────────────────────
   プログラミング思考 — コマンド順番並べゲーム
   TANQuu をゴール ⭐ まで導くコマンドを順番に選ぶ
───────────────────────────────────────── */

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

interface Puzzle {
  id: number
  title: string
  grid: string[][] // '#' = wall, '.' = path, 'S' = start, 'G' = goal
  answer: Dir[]    // correct command sequence
  hint: string
}

const PUZZLES: Puzzle[] = [
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
  // ─── やさしい (ids 6–9) ───────────────────────────
  {
    id: 6,
    title: 'ながい一本道',
    // S(1,0) RIGHT×4 → G(1,4)
    grid: [
      ['#', '#', '#', '#', '#'],
      ['S', '.', '.', '.', 'G'],
      ['#', '#', '#', '#', '#'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'],
    hint: 'ひたすら右に進もう',
  },
  {
    id: 7,
    title: 'L字のみち',
    // S(0,0) DOWN×3 → (3,0) RIGHT×3 → G(3,3)
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
    id: 8,
    title: 'さかさまL',
    // S(0,0) RIGHT×3 → (0,3) DOWN×3 → G(3,3)
    grid: [
      ['S', '.', '.', '.'],
      ['#', '#', '#', '.'],
      ['#', '#', '#', '.'],
      ['#', '#', '#', 'G'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN'],
    hint: '右に行ってから下へ',
  },
  {
    id: 9,
    title: 'かいだん',
    // S(0,0) RIGHT→(0,1) DOWN→(1,1) RIGHT→(1,2) DOWN→(2,2) RIGHT×2→G(2,4)
    grid: [
      ['S', '.', '#', '#', '#'],
      ['#', '.', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    answer: ['RIGHT', 'DOWN', 'RIGHT', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '階段みたいにジグザグ',
  },
  // ─── ふつう (ids 10–14) ──────────────────────────
  {
    id: 10,
    title: 'コの字みち',
    // S(0,0) DOWN×2→(2,0) RIGHT×3→(2,3) UP×2→G(0,3)
    grid: [
      ['S', '#', '#', 'G'],
      ['.', '#', '#', '.'],
      ['.', '.', '.', '.'],
    ],
    answer: ['DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'UP', 'UP'],
    hint: 'コの字を描くように進もう',
  },
  {
    id: 11,
    title: 'しま越え',
    // S(0,0) RIGHT×2→(0,2) DOWN×2→(2,2) LEFT×2→(2,0) DOWN→(3,0) RIGHT×2→G(3,2)
    // path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)→(2,0)→(3,0)→(3,1)→(3,2)=G  9 steps
    grid: [
      ['S', '.', '.', '#', '#'],
      ['#', '#', '.', '#', '#'],
      ['.', '.', '.', '#', '#'],
      ['.', '.', 'G', '#', '#'],
    ],
    answer: ['RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'LEFT', 'LEFT', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '右→下→左→下と進もう',
  },
  {
    id: 12,
    title: 'ぐるっと一周',
    // S(0,4) DOWN×3→(3,4) LEFT×4→(3,0) UP×3→G(0,0)
    // path: (0,4)→(1,4)→(2,4)→(3,4)→(3,3)→(3,2)→(3,1)→(3,0)→(2,0)→(1,0)→(0,0)=G  10 steps
    grid: [
      ['G', '#', '#', '#', 'S'],
      ['.', '#', '.', '#', '.'],
      ['.', '#', '.', '#', '.'],
      ['.', '.', '.', '.', '.'],
    ],
    answer: ['DOWN', 'DOWN', 'DOWN', 'LEFT', 'LEFT', 'LEFT', 'LEFT', 'UP', 'UP', 'UP'],
    hint: 'ぐるっと外を回ろう',
  },
  {
    id: 13,
    title: 'めいろのわな',
    // S(0,0) DOWN×2→(2,0) RIGHT×2→(2,2) UP→(1,2) RIGHT×2→(1,4) DOWN×2→G(3,4)
    // path: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(1,2)→(1,3)→(1,4)→(2,4)→(3,4)=G  9 steps
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
    id: 14,
    title: 'たからさがし',
    // S(0,0) RIGHT×4→(0,4) DOWN→(1,4) LEFT×2→(1,2) DOWN×2→(3,2) RIGHT×2→G(3,4)
    // path: (0,0)→(0,1)→(0,2)→(0,3)→(0,4)→(1,4)→(1,3)→(1,2)→(2,2)→(3,2)→(3,3)→(3,4)=G  11 steps
    grid: [
      ['S', '.', '.', '.', '.'],
      ['#', '#', '.', '.', '.'],
      ['#', '#', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'LEFT', 'LEFT', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '右に進んで、もどって、下へ',
  },
  // ─── むずかしい (ids 15–18) ──────────────────────
  {
    id: 15,
    title: 'スパイ作戦',
    // S(0,0) DOWN×2→(2,0) RIGHT×2→(2,2) UP→(1,2) RIGHT×2→(1,4) DOWN×3→(4,4) LEFT→G(4,3)
    // path: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(1,2)→(1,3)→(1,4)→(2,4)→(3,4)→(4,4)→(4,3)=G  11 steps
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
  {
    id: 16,
    title: 'ドラゴンのすみか',
    // S(0,4) LEFT×4→(0,0) DOWN×2→(2,0) RIGHT×2→(2,2) DOWN×2→(4,2) RIGHT×2→G(4,4)
    // path: (0,4)→(0,3)→(0,2)→(0,1)→(0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(3,2)→(4,2)→(4,3)→(4,4)=G  12 steps
    grid: [
      ['.', '.', '.', '.', 'S'],
      ['.', '#', '#', '#', '#'],
      ['.', '.', '.', '#', '#'],
      ['#', '#', '.', '#', '#'],
      ['#', '#', '.', '.', 'G'],
    ],
    answer: ['LEFT', 'LEFT', 'LEFT', 'LEFT', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT'],
    hint: '左へ行って下へ、また右へ進め',
  },
  {
    id: 17,
    title: 'うずまき迷路',
    // 6x6 grid — spiral path inward to G(3,3)
    // S(0,0) RIGHT×4→(0,4) DOWN×4→(4,4) LEFT×4→(4,0) UP×2→(2,0) RIGHT×3→(2,3) DOWN→G(3,3)
    // Verify: (0,0)→(0,1)→(0,2)→(0,3)→(0,4): grid[0][1..4]='.'
    //         →(1,4)→(2,4)→(3,4)→(4,4): grid[1..4][4]='.'
    //         →(4,3)→(4,2)→(4,1)→(4,0): grid[4][0..3]='.'
    //         →(3,0)→(2,0): grid[3][0]='.' and grid[2][0]='.'
    //         →(2,1)→(2,2)→(2,3): grid[2][1..3]='.'
    //         →(3,3)=G  total: 4+4+4+2+3+1=18? Let me count moves: 4+4+4+2+3+1=18 steps
    // But grid[1][0] must be '#' to force spiral. Let me set up the grid:
    grid: [
      ['S', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '.', '#'],
      ['.', '.', '.', '.', '.', '#'],
      ['.', '#', '#', 'G', '.', '#'],
      ['.', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#', '#'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN', 'DOWN', 'LEFT', 'LEFT', 'LEFT', 'LEFT', 'UP', 'UP', 'RIGHT', 'RIGHT', 'RIGHT', 'DOWN'],
    hint: 'うずを描くように外から内へ',
  },
  {
    id: 18,
    title: 'もりのさんぽ道',
    // 5x6 grid — S(0,0) DOWN×4→(4,0) RIGHT×5→(4,5) UP×2→(2,5) LEFT×2→(2,3) UP→(1,3) RIGHT→G(1,4)
    // path: (0,0)→(1,0)→(2,0)→(3,0)→(4,0)→(4,1)→(4,2)→(4,3)→(4,4)→(4,5)→(3,5)→(2,5)→(2,4)→(2,3)→(1,3)→(1,4)=G  15 steps
    // grid[1][0]='.' grid[2][0]='.' grid[3][0]='.' grid[4][0..5]='.' grid[3][5]='.' grid[2][5]='.'
    // grid[2][4]='.' grid[2][3]='.' grid[1][3]='.' grid[1][4]=G
    grid: [
      ['S', '#', '#', '#', '#', '#'],
      ['.', '#', '#', '.', 'G', '#'],
      ['.', '#', '#', '.', '.', '.'],
      ['.', '#', '#', '#', '#', '.'],
      ['.', '.', '.', '.', '.', '.'],
    ],
    answer: ['DOWN', 'DOWN', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'UP', 'UP', 'LEFT', 'LEFT', 'UP', 'RIGHT'],
    hint: '下まで行って右に進み、上に戻ろう',
  },
  // ─── とても難しい (ids 19–20) ────────────────────
  {
    id: 19,
    title: 'ラビリンス・オメガ',
    // 6x6 grid — S(0,0) RIGHT×5→(0,5) DOWN×2→(2,5) LEFT×4→(2,1) DOWN×2→(4,1) RIGHT×4→(4,5) UP→G(3,5)
    // path: (0,0)→(0,1)→(0,2)→(0,3)→(0,4)→(0,5)→(1,5)→(2,5)→(2,4)→(2,3)→(2,2)→(2,1)→(3,1)→(4,1)→(4,2)→(4,3)→(4,4)→(4,5)→(3,5)=G  18 steps
    // Row 0: S . . . . .
    // Row 1: # # # # # .
    // Row 2: # . . . . .   ← all cols 1-5 are '.'
    // Row 3: # . # # # G
    // Row 4: # . . . . .   ← cols 1-5 are '.'
    // Row 5: # # # # # #
    grid: [
      ['S', '.', '.', '.', '.', '.'],
      ['#', '#', '#', '#', '#', '.'],
      ['#', '.', '.', '.', '.', '.'],
      ['#', '.', '#', '#', '#', 'G'],
      ['#', '.', '.', '.', '.', '.'],
      ['#', '#', '#', '#', '#', '#'],
    ],
    answer: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'LEFT', 'LEFT', 'LEFT', 'LEFT', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'UP'],
    hint: '右→下→左→下→右→上が鍵だ',
  },
  {
    id: 20,
    title: '伝説の最終迷路',
    // 6x6 grid — S(0,0) RIGHT×2→(0,2) DOWN×3→(3,2) RIGHT×2→(3,4) DOWN→(4,4) LEFT×4→(4,0) DOWN→(5,0) RIGHT×5→G(5,5)
    // path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(3,2)→(3,3)→(3,4)→(4,4)→(4,3)→(4,2)→(4,1)→(4,0)→(5,0)→(5,1)→(5,2)→(5,3)→(5,4)→(5,5)=G  18 steps
    // Verify grid cells on path are not '#':
    // (0,1)='.', (0,2)='.'  ✓
    // (1,2)='.', (2,2)='.', (3,2)='.'  ✓
    // (3,3)='.', (3,4)='.'  ✓
    // (4,4)='.', (4,3)='.', (4,2)='.', (4,1)='.', (4,0)='.'  ✓
    // (5,0)='.', (5,1..5)='.'  ✓; (5,5)=G  ✓
    grid: [
      ['S', '.', '.', '#', '#', '#'],
      ['#', '#', '.', '#', '#', '#'],
      ['#', '#', '.', '#', '#', '#'],
      ['#', '#', '.', '.', '.', '#'],
      ['.', '.', '.', '.', '.', '#'],
      ['.', '.', '.', '.', '.', 'G'],
    ],
    answer: ['RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'DOWN', 'LEFT', 'LEFT', 'LEFT', 'LEFT', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'],
    hint: '右→下×3→右→下→左→下→右の大作戦',
  },
]

const CMD_LABELS: Record<Dir, string> = {
  UP: '↑ 上に進む',
  DOWN: '↓ 下に進む',
  LEFT: '← 左に進む',
  RIGHT: '→ 右に進む',
}

const CMD_EMOJI: Record<Dir, string> = {
  UP: '⬆️',
  DOWN: '⬇️',
  LEFT: '⬅️',
  RIGHT: '➡️',
}

function findPos(grid: string[][], char: string): [number, number] {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c] === char) return [r, c]
  return [0, 0]
}

function simulatePath(grid: string[][], cmds: Dir[]): [number, number][] {
  let [r, c] = findPos(grid, 'S')
  const path: [number, number][] = [[r, c]]
  const deltas: Record<Dir, [number, number]> = {
    UP: [-1, 0], DOWN: [1, 0], LEFT: [0, -1], RIGHT: [0, 1],
  }
  for (const cmd of cmds) {
    const [dr, dc] = deltas[cmd]
    const nr = r + dr
    const nc = c + dc
    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) break
    if (grid[nr][nc] === '#') break
    r = nr; c = nc
    path.push([r, c])
  }
  return path
}

const CELL = 56

export default function CodingPuzzle() {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [selected, setSelected] = useState<Dir[]>([])
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'playing' | 'finished'>('intro')
  const [animPath, setAnimPath] = useState<[number, number][]>([])
  const [animStep, setAnimStep] = useState(0)

  const puzzle = PUZZLES[puzzleIdx]
  const [goalR, goalC] = findPos(puzzle.grid, 'G')
  const [startR, startC] = findPos(puzzle.grid, 'S')

  function addCmd(d: Dir) {
    if (result !== 'idle') return
    setSelected((prev) => [...prev, d])
  }

  function removeCmd(i: number) {
    if (result !== 'idle') return
    setSelected((prev) => prev.filter((_, idx) => idx !== i))
  }

  function runProgram() {
    const path = simulatePath(puzzle.grid, selected)
    setAnimPath(path)
    setAnimStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimStep(step)
      if (step >= path.length) {
        clearInterval(interval)
        const [fr, fc] = path[path.length - 1]
        if (fr === goalR && fc === goalC) {
          setResult('correct')
          setScore((s) => s + 1)
        } else {
          setResult('wrong')
        }
      }
    }, 400)
  }

  function next() {
    if (puzzleIdx + 1 >= PUZZLES.length) {
      setPhase('finished')
      return
    }
    setPuzzleIdx((i) => i + 1)
    setSelected([])
    setResult('idle')
    setAnimPath([])
    setAnimStep(0)
  }

  const currentPos = animPath.length > 0 && animStep > 0
    ? animPath[Math.min(animStep, animPath.length - 1)]
    : findPos(puzzle.grid, 'S')

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#4ade80] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">💻</div>
        <h1 className="text-4xl font-black mb-2 text-[#4ade80]">プログラミング思考</h1>
        <p className="text-[#94a3c4] mb-6 max-w-sm leading-relaxed">
          TANQuu を⭐ゴールまで導こう！<br />コマンドを正しい順番に並べて<br />プログラムを作れ！
        </p>
        <button
          onClick={() => setPhase('playing')}
          className="px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]"
          style={{ background: '#4ade80', boxShadow: '0 0 40px rgba(74,222,128,0.4)' }}
        >
          スタート！
        </button>
      </div>
    )
  }

  if (phase === 'finished') {
    const rank = score >= 4 ? '🏆 プログラミングマスター！' : score >= 3 ? '🥇 すごい！' : '🥈 よくできました！'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#4ade80]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">全{PUZZLES.length}問クリア</p>
        <div className="text-7xl font-black text-[#4ade80] mb-2">{score}</div>
        <div className="text-[#94a3c4] text-sm mb-10">/ {PUZZLES.length} 問 正解</div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => { setPuzzleIdx(0); setSelected([]); setResult('idle'); setAnimPath([]); setAnimStep(0); setScore(0); setPhase('playing') }}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#4ade80] hover:scale-[1.02] transition-all"
          >
            もう一回！
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#4ade80] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center py-20 px-4">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm">
        <button onClick={() => setPhase('intro')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#4ade80]">ステージ {puzzleIdx + 1} / {PUZZLES.length}</span>
        <span className="text-sm font-bold text-[#4ade80]">スコア: {score}</span>
      </div>

      <h2 className="text-xl font-black text-[#4ade80] mb-1 mt-4">{puzzle.title}</h2>
      <p className="text-[#94a3c4] text-xs mb-5">ヒント: {puzzle.hint}</p>

      {/* Grid */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${puzzle.grid[0].length}, ${CELL}px)`,
          gap: '2px',
          background: '#162d5a',
          padding: '4px',
        }}
      >
        {puzzle.grid.map((row, r) =>
          row.map((cell, c) => {
            const isRobot = currentPos[0] === r && currentPos[1] === c
            const isWall = cell === '#'
            const isGoal = cell === 'G'
            const isStart = cell === 'S' && !isRobot
            return (
              <div
                key={`${r}-${c}`}
                className="flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  width: CELL, height: CELL,
                  background: isWall ? '#0a1a38' : 'rgba(255,255,255,0.05)',
                  fontSize: 28,
                }}
              >
                {isWall ? '🧱' : isRobot ? '🤖' : isGoal ? '⭐' : isStart ? '🚩' : ''}
              </div>
            )
          })
        )}
      </div>

      {/* Result banner */}
      {result === 'correct' && (
        <div className="text-center mb-4 animate-bounce">
          <span className="text-2xl font-black text-[#4ade80]">✓ ゴール！すごい！</span>
        </div>
      )}
      {result === 'wrong' && (
        <div className="text-center mb-4">
          <span className="text-2xl font-black text-[#f87171]">✗ もう一回やってみよう</span>
        </div>
      )}

      {/* Command palette */}
      {result === 'idle' && (
        <div className="grid grid-cols-2 gap-2 mb-4 max-w-xs w-full">
          {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as Dir[]).map((d) => (
            <button
              key={d}
              onClick={() => addCmd(d)}
              className="py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.04] active:scale-95"
              style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
            >
              {CMD_EMOJI[d]} {CMD_LABELS[d]}
            </button>
          ))}
        </div>
      )}

      {/* Selected commands */}
      {selected.length > 0 && result === 'idle' && (
        <div className="flex flex-wrap gap-2 justify-center max-w-xs mb-4">
          {selected.map((d, i) => (
            <button
              key={i}
              onClick={() => removeCmd(i)}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:opacity-60"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              title="タップで削除"
            >
              {CMD_EMOJI[d]}
            </button>
          ))}
        </div>
      )}

      {/* Run / Next buttons */}
      {result === 'idle' && selected.length > 0 && (
        <button
          onClick={runProgram}
          className="px-10 py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.03]"
          style={{ background: '#4ade80', boxShadow: '0 0 30px rgba(74,222,128,0.35)' }}
        >
          ▶ じっこうする！
        </button>
      )}
      {result !== 'idle' && (
        <button
          onClick={result === 'wrong' ? () => { setSelected([]); setResult('idle'); setAnimPath([]); setAnimStep(0) } : next}
          className="px-10 py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.03] mt-2"
          style={{ background: result === 'correct' ? '#4ade80' : '#f0c040' }}
        >
          {result === 'correct' ? (puzzleIdx + 1 < PUZZLES.length ? '次のステージ →' : '結果を見る！') : 'リセット'}
        </button>
      )}
    </div>
  )
}
