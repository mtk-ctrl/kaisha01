'use client'

import React, { useState, useEffect, useRef } from 'react'

// ─── Pattern puzzle data ──────────────────────────────────────────────────────

interface PatternChoice {
  label: string
  correct: boolean
  // sequence this choice generates (for animation)
  generates: string[]
}

interface PatternPuzzle {
  id: number
  sequence: string[]
  question: string
  choices: PatternChoice[]
}

const PATTERNS: PatternPuzzle[] = [
  {
    id: 1,
    sequence: ['🌸', '🌸', '🌸', '⭐', '🌸', '🌸', '🌸', '⭐'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '🌸を3こ・⭐を1こ　→　2回くりかえす',
        correct: true,
        generates: ['🌸', '🌸', '🌸', '⭐', '🌸', '🌸', '🌸', '⭐'],
      },
      {
        label: '🌸を2こ・⭐を1こ　→　2回くりかえす',
        correct: false,
        generates: ['🌸', '🌸', '⭐', '🌸', '🌸', '⭐'],
      },
      {
        label: '🌸を3こ・⭐を2こ　→　2回くりかえす',
        correct: false,
        generates: ['🌸', '🌸', '🌸', '⭐', '⭐', '🌸', '🌸', '🌸', '⭐', '⭐'],
      },
      {
        label: '🌸を3こ　→　3回くりかえす',
        correct: false,
        generates: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸'],
      },
    ],
  },
  {
    id: 2,
    sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '🔵'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '🔴を1こ・🔵を1こ　→　3回くりかえす',
        correct: true,
        generates: ['🔴', '🔵', '🔴', '🔵', '🔴', '🔵'],
      },
      {
        label: '🔴を2こ・🔵を1こ　→　2回くりかえす',
        correct: false,
        generates: ['🔴', '🔴', '🔵', '🔴', '🔴', '🔵'],
      },
      {
        label: '🔴を1こ・🔵を2こ　→　2回くりかえす',
        correct: false,
        generates: ['🔴', '🔵', '🔵', '🔴', '🔵', '🔵'],
      },
      {
        label: '🔴を3こ・🔵を3こ　→　1回くりかえす',
        correct: false,
        generates: ['🔴', '🔴', '🔴', '🔵', '🔵', '🔵'],
      },
    ],
  },
  {
    id: 3,
    sequence: ['🐱', '🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🐶'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '🐱を1こ・🐶を1こ　→　4回くりかえす',
        correct: true,
        generates: ['🐱', '🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🐶'],
      },
      {
        label: '🐱を2こ・🐶を2こ　→　2回くりかえす',
        correct: false,
        generates: ['🐱', '🐱', '🐶', '🐶', '🐱', '🐱', '🐶', '🐶'],
      },
      {
        label: '🐱を1こ・🐶を2こ　→　4回くりかえす',
        correct: false,
        generates: ['🐱', '🐶', '🐶', '🐱', '🐶', '🐶', '🐱', '🐶', '🐶', '🐱', '🐶', '🐶'],
      },
      {
        label: '🐶を1こ・🐱を1こ　→　4回くりかえす',
        correct: false,
        generates: ['🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🐶', '🐱'],
      },
    ],
  },
  {
    id: 4,
    sequence: ['⭐', '🌙', '🌙', '⭐', '🌙', '🌙', '⭐', '🌙', '🌙'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '⭐を1こ・🌙を2こ　→　3回くりかえす',
        correct: true,
        generates: ['⭐', '🌙', '🌙', '⭐', '🌙', '🌙', '⭐', '🌙', '🌙'],
      },
      {
        label: '⭐を2こ・🌙を1こ　→　3回くりかえす',
        correct: false,
        generates: ['⭐', '⭐', '🌙', '⭐', '⭐', '🌙', '⭐', '⭐', '🌙'],
      },
      {
        label: '⭐を1こ・🌙を3こ　→　3回くりかえす',
        correct: false,
        generates: ['⭐', '🌙', '🌙', '🌙', '⭐', '🌙', '🌙', '🌙', '⭐', '🌙', '🌙', '🌙'],
      },
      {
        label: '⭐を1こ・🌙を2こ　→　2回くりかえす',
        correct: false,
        generates: ['⭐', '🌙', '🌙', '⭐', '🌙', '🌙'],
      },
    ],
  },
  {
    id: 5,
    sequence: ['🍎', '🍊', '🍋', '🍎', '🍊', '🍋'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '🍎・🍊・🍋　→　2回くりかえす',
        correct: true,
        generates: ['🍎', '🍊', '🍋', '🍎', '🍊', '🍋'],
      },
      {
        label: '🍎・🍊・🍋　→　3回くりかえす',
        correct: false,
        generates: ['🍎', '🍊', '🍋', '🍎', '🍊', '🍋', '🍎', '🍊', '🍋'],
      },
      {
        label: '🍎・🍋・🍊　→　2回くりかえす',
        correct: false,
        generates: ['🍎', '🍋', '🍊', '🍎', '🍋', '🍊'],
      },
      {
        label: '🍊・🍎・🍋　→　2回くりかえす',
        correct: false,
        generates: ['🍊', '🍎', '🍋', '🍊', '🍎', '🍋'],
      },
    ],
  },
  {
    id: 6,
    sequence: ['🌟', '🌟', '💫', '🌟', '🌟', '💫', '🌟', '🌟', '💫'],
    question: 'このならびを作るプログラムはどれ？',
    choices: [
      {
        label: '🌟を2こ・💫を1こ　→　3回くりかえす',
        correct: true,
        generates: ['🌟', '🌟', '💫', '🌟', '🌟', '💫', '🌟', '🌟', '💫'],
      },
      {
        label: '🌟を1こ・💫を2こ　→　3回くりかえす',
        correct: false,
        generates: ['🌟', '💫', '💫', '🌟', '💫', '💫', '🌟', '💫', '💫'],
      },
      {
        label: '🌟を3こ・💫を1こ　→　3回くりかえす',
        correct: false,
        generates: ['🌟', '🌟', '🌟', '💫', '🌟', '🌟', '🌟', '💫', '🌟', '🌟', '🌟', '💫'],
      },
      {
        label: '🌟を2こ・💫を1こ　→　2回くりかえす',
        correct: false,
        generates: ['🌟', '🌟', '💫', '🌟', '🌟', '💫'],
      },
    ],
  },
]

// ─── Animation component ───────────────────────────────────────────────────────

function SequenceDisplay({ items, highlight }: { items: string[]; highlight: number }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-3xl transition-all duration-200"
          style={{
            opacity: i <= highlight ? 1 : 0.25,
            transform: i === highlight ? 'scale(1.4)' : 'scale(1)',
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PatternGame({
  onComplete,
  onQuit,
}: {
  onComplete: (score: number) => void
  onQuit: () => void
}) {
  const puzzles = PATTERNS
  const total = puzzles.length

  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [result, setResult] = useState<'idle' | 'animating' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)
  const [animStep, setAnimStep] = useState(-1)
  const [resultsLog, setResultsLog] = useState<boolean[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const puzzle = puzzles[puzzleIdx]

  function selectChoice(idx: number) {
    if (result !== 'idle') return
    setSelectedChoice(idx)

    // Start animation
    setResult('animating')
    const seq = puzzle.choices[idx].generates
    setAnimStep(-1)
    let step = -1
    intervalRef.current = setInterval(() => {
      step++
      setAnimStep(step)
      if (step >= seq.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const correct = puzzle.choices[idx].correct
        setResult(correct ? 'correct' : 'wrong')
        if (correct) setScore((s) => s + 1)
        setResultsLog((prev) => [...prev, correct])
      }
    }, 300)
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
    setAnimStep(-1)
  }

  function retry() {
    setSelectedChoice(null)
    setResult('idle')
    setAnimStep(-1)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const animSequence =
    selectedChoice !== null && result !== 'idle'
      ? puzzle.choices[selectedChoice].generates
      : puzzle.sequence

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-5 py-3 flex items-center justify-between bg-[#FFF6E5]/90 backdrop-blur-sm z-10">
        <button onClick={onQuit} className="text-[#6B5A52] hover:opacity-70 text-sm transition-colors">← やめる</button>
        <span className="text-sm font-bold text-[#16a34a]">もんだい {puzzleIdx + 1} / {total}</span>
        <span className="text-sm font-bold text-[#16a34a]">せいかい: {score}</span>
      </div>

      <div className="mt-16 mb-4 text-center px-4">
        <div className="text-4xl mb-2">🔄</div>
        <h2 className="text-lg font-black text-[#16a34a]">{puzzle.question}</h2>
      </div>

      {/* Target sequence */}
      <div className="w-full max-w-sm bg-[#FFFFFF] rounded-2xl p-4 mb-4">
        <p className="text-[#6B5A52] text-xs mb-3 text-center">目標のならび</p>
        <SequenceDisplay
          items={result !== 'idle' ? animSequence : puzzle.sequence}
          highlight={result !== 'idle' ? animStep : puzzle.sequence.length - 1}
        />
      </div>

      {/* Result display */}
      {result === 'correct' && (
        <div className="mb-4 flex flex-col items-center">
          <span className="text-7xl animate-bounce">○</span>
          <span className="text-[#16a34a] font-black text-lg">せいかい！</span>
        </div>
      )}
      {result === 'wrong' && (
        <div className="mb-4 flex flex-col items-center">
          <span className="text-7xl text-[#f87171]">×</span>
          <span className="text-[#f87171] font-black text-lg">ちがうよ、もう一回！</span>
        </div>
      )}
      {result === 'animating' && (
        <div className="mb-4">
          <span className="text-[#f0c040] font-bold text-sm">▶ じっこう中…</span>
        </div>
      )}

      {/* Choices */}
      {result === 'idle' && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          {puzzle.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => selectChoice(i)}
              className="w-full px-4 py-4 rounded-2xl font-bold text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#3A2E2A',
              }}
            >
              <span className="text-[#6B5A52] mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* After animation: show answer state with highlighted choice */}
      {(result === 'correct' || result === 'wrong') && selectedChoice !== null && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          {puzzle.choices.map((choice, i) => {
            const isSelected = i === selectedChoice
            const isCorrChoice = choice.correct
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
                  color: isCorrChoice ? '#16a34a' : isSelected ? '#dc2626' : '#6B5A52',
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
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] bg-[#4ade80] hover:scale-[1.02] transition-all"
          >
            {puzzleIdx + 1 < total ? '次のもんだい →' : '結果を見る！'}
          </button>
        )}
        {result === 'wrong' && (
          <button
            onClick={retry}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] hover:scale-[1.02] transition-all"
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
