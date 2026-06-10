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
  // retry=1回目のまちがいで再挑戦中（答えは見せない） / reveal=2回目のまちがいで答え合わせ
  const [result, setResult] = useState<'idle' | 'animating' | 'correct' | 'retry' | 'reveal'>('idle')
  const [score, setScore] = useState(0)
  const [animStep, setAnimStep] = useState(-1)
  const [resultsLog, setResultsLog] = useState<boolean[]>([])
  const [attempt, setAttempt] = useState<0 | 1>(0)
  const [firstWrong, setFirstWrong] = useState<number | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string[] | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const puzzle = puzzles[puzzleIdx]

  function selectChoice(idx: number) {
    if (result !== 'idle' && result !== 'retry') return
    if (idx === firstWrong) return
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
        // スコア・成績ログは1回目の解答のみ記録（再挑戦で水増ししない）
        if (correct) {
          if (attempt === 0) {
            setScore((s) => s + 1)
            setResultsLog((prev) => [...prev, true])
          }
          setResult('correct')
        } else if (attempt === 0) {
          // 1回目のまちがい: 答えは見せず、自分のならびと目標をくらべて再挑戦
          setResultsLog((prev) => [...prev, false])
          setAttempt(1)
          setFirstWrong(idx)
          setLastGenerated(seq)
          setSelectedChoice(null)
          setResult('retry')
        } else {
          // 2回目のまちがい: 答え合わせ
          setResult('reveal')
        }
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
    setAttempt(0)
    setFirstWrong(null)
    setLastGenerated(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // 「きみのプログラムのならび」: アニメ中・答え合わせ中は選択中の choices、再挑戦中は直前のまちがい
  const userSequence =
    selectedChoice !== null && (result === 'animating' || result === 'correct' || result === 'reveal')
      ? puzzle.choices[selectedChoice].generates
      : lastGenerated

  // 目標とどこからちがうか（再挑戦の足場）
  function firstMismatch(a: string[], b: string[]): number {
    const n = Math.max(a.length, b.length)
    for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i
    return -1
  }
  const mismatchAt = lastGenerated ? firstMismatch(lastGenerated, puzzle.sequence) : -1

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
      <div className="w-full max-w-sm bg-[#FFFFFF] rounded-2xl p-4 mb-3">
        <p className="text-[#6B5A52] text-xs mb-3 text-center">目標のならび</p>
        <SequenceDisplay items={puzzle.sequence} highlight={puzzle.sequence.length - 1} />
      </div>

      {/* User's program output: 目標とくらべて「どこからちがうか」を考える足場 */}
      {result !== 'idle' && userSequence && (
        <div
          className="w-full max-w-sm bg-[#FFFFFF] rounded-2xl p-4 mb-3"
          style={{ border: result === 'retry' ? '2px solid #f0c040' : '1px solid rgba(58,46,42,0.1)' }}
        >
          <p className="text-[#6B5A52] text-xs mb-3 text-center">きみのプログラムが作ったならび</p>
          <SequenceDisplay
            items={userSequence}
            highlight={result === 'animating' ? animStep : userSequence.length - 1}
          />
        </div>
      )}

      {/* Result display */}
      {result === 'correct' && (
        <div className="mb-4 flex flex-col items-center">
          <span className="text-7xl animate-bounce">○</span>
          <span className="text-[#16a34a] font-black text-lg">せいかい！</span>
          {attempt === 1 && (
            <span className="text-[#6B5A52] text-xs mt-1">できたね！（スコアは1回目のこたえできまるよ）</span>
          )}
        </div>
      )}
      {result === 'retry' && (
        <div
          className="mb-4 w-full max-w-sm rounded-2xl px-4 py-3"
          style={{ background: '#FFF3C4', border: '2px solid #f0c040' }}
        >
          <p className="text-xs font-black mb-1" style={{ color: '#ca8a04' }}>💡 ヒント</p>
          <p className="text-sm font-bold text-[#3A2E2A] leading-relaxed">
            {mismatchAt >= 0
              ? `${mismatchAt + 1}ばんめから 目標とちがうよ。2つのならびをくらべて、べつのプログラムをえらんでみよう！`
              : 'ならびのながさがちがうよ。くりかえす回数を見なおしてみよう！'}
          </p>
        </div>
      )}
      {result === 'reveal' && (
        <div className="mb-4 flex flex-col items-center">
          <span className="text-[#f87171] font-black text-lg">ざんねん…正解はこれ！</span>
          <span className="text-[#6B5A52] text-xs mt-1">✓のプログラムが目標とおなじならびを作るよ</span>
        </div>
      )}
      {result === 'animating' && (
        <div className="mb-4">
          <span className="text-[#f0c040] font-bold text-sm">▶ じっこう中…</span>
        </div>
      )}

      {/* Choices（再挑戦中は1回目にまちがえた選択肢を消して、もう一度考えてもらう） */}
      {(result === 'idle' || result === 'retry') && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          {puzzle.choices.map((choice, i) => {
            const disabled = i === firstWrong
            return (
              <button
                key={i}
                onClick={() => selectChoice(i)}
                disabled={disabled}
                className="w-full px-4 py-4 rounded-2xl font-bold text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: disabled ? '1px solid #f87171' : '1px solid rgba(58,46,42,0.15)',
                  color: '#3A2E2A',
                }}
              >
                <span className="text-[#6B5A52] mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
                {choice.label}
                {disabled && ' ✗'}
              </button>
            )
          })}
        </div>
      )}

      {/* 答え合わせ: 正解の選択肢をハイライト */}
      {(result === 'correct' || result === 'reveal') && (
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
                      : 'rgba(58,46,42,0.1)'
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
        {(result === 'correct' || result === 'reveal') && (
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#3A2E2A] bg-[#4ade80] hover:scale-[1.02] transition-all"
          >
            {puzzleIdx + 1 < total ? '次のもんだい →' : '結果を見る！'}
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
