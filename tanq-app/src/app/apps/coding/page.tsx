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
