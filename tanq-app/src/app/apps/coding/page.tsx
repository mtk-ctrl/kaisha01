'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import MazeGame from './MazeGame'
import DebugGame from './DebugGame'
import PatternGame from './PatternGame'
import ConditionalGame from './ConditionalGame'

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SCORES_KEY = 'tanq_coding_v2_chapter_scores'
const PROGRESS_KEY = 'tanq_coding_v2_progress'

function loadChapterScores(): (number | null)[] {
  if (typeof window === 'undefined') return [null, null, null, null, null]
  try {
    const raw = localStorage.getItem(getDataKey(SCORES_KEY))
    if (!raw) return [null, null, null, null, null]
    const arr = JSON.parse(raw) as (number | null)[]
    while (arr.length < 5) arr.push(null)
    return arr
  } catch {
    return [null, null, null, null, null]
  }
}

function saveChapterScore(chapterIdx: number, score: number) {
  if (typeof window === 'undefined') return
  const scores = loadChapterScores()
  scores[chapterIdx] = score
  try {
    localStorage.setItem(getDataKey(SCORES_KEY), JSON.stringify(scores))
  } catch {}
}

// ─── Chapter metadata ─────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    icon: '🗺️',
    name: 'コマンドならべ',
    concept: '順次処理',
    color: '#4ade80',
    total: 10,
    description: 'コマンドを正しい順番に並べてロボットをゴールへ！',
  },
  {
    icon: '🔄',
    name: 'くりかえし',
    concept: 'ループ',
    color: '#60a5fa',
    total: 8,
    description: '同じ動きを何回くりかえすか考えよう！',
  },
  {
    icon: '🐛',
    name: 'デバッグ',
    concept: 'バグ修正',
    color: '#f0c040',
    total: 8,
    description: 'まちがったプログラムを直してゴールへ導こう！',
  },
  {
    icon: '🔁',
    name: 'パターン',
    concept: 'パターン認識',
    color: '#c084fc',
    total: 6,
    description: 'ならびのルールを見つけてプログラムを選ぼう！',
  },
  {
    icon: '🔀',
    name: '条件分岐',
    concept: 'もし〜なら',
    color: '#fb923c',
    total: 6,
    description: 'ますの色によって動きが変わるルールを選ぼう！',
  },
] as const

// ─── Rank helpers ─────────────────────────────────────────────────────────────

function getRank(score: number, total: number): { label: string; emoji: string } {
  const ratio = total > 0 ? score / total : 0
  if (ratio >= 0.9) return { label: 'プログラミングマスター！', emoji: '🏆' }
  if (ratio >= 0.7) return { label: 'よくできました！', emoji: '🥇' }
  return { label: 'がんばったね！', emoji: '🥈' }
}

function getTotalRank(totalScore: number, totalProblems: number): { label: string; emoji: string } {
  return getRank(totalScore, totalProblems)
}

// ─── Chapter result screen ────────────────────────────────────────────────────

function ChapterResultScreen({
  chapterIdx,
  score,
  onNext,
  onMenu,
}: {
  chapterIdx: number
  score: number
  onNext: () => void
  onMenu: () => void
}) {
  const chapter = CHAPTERS[chapterIdx]
  const total = chapter.total
  const rank = getRank(score, total)

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-3">{rank.emoji}</div>
      <h2 className="text-3xl font-black mb-1" style={{ color: chapter.color }}>{chapter.name}</h2>
      <p className="text-[#94a3c4] text-sm mb-6">チャプター {chapterIdx + 1} 終了！</p>

      <div className="flex flex-col items-center mb-6">
        <span className="text-6xl font-black" style={{ color: chapter.color }}>{score}</span>
        <span className="text-[#94a3c4] text-sm">/ {total} 問 正解</span>
        <span className="mt-2 text-lg font-black text-[#e8f0fe]">{rank.label}</span>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {chapterIdx + 1 < CHAPTERS.length && (
          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] hover:scale-[1.02] transition-all"
            style={{ background: chapter.color, boxShadow: `0 0 30px ${chapter.color}44` }}
          >
            次のチャプター →
          </button>
        )}
        {chapterIdx + 1 >= CHAPTERS.length && (
          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] hover:scale-[1.02] transition-all"
            style={{ background: '#4ade80', boxShadow: '0 0 30px rgba(74,222,128,0.4)' }}
          >
            最終結果を見る！
          </button>
        )}
        <button
          onClick={onMenu}
          className="w-full py-3 rounded-2xl font-bold text-base border border-white/20 text-[#94a3c4] hover:text-[#4ade80] transition-all"
        >
          チャプター選択に戻る
        </button>
      </div>
    </div>
  )
}

// ─── All done screen ──────────────────────────────────────────────────────────

function AllDoneScreen({
  chapterScores,
  onRestart,
}: {
  chapterScores: (number | null)[]
  onRestart: () => void
}) {
  const totalProblems = CHAPTERS.reduce((sum, ch) => sum + ch.total, 0)
  const totalScore = chapterScores.reduce((sum: number, s) => sum + (s ?? 0), 0)
  const rank = getTotalRank(totalScore, totalProblems)

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
      <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#4ade80] text-sm transition-colors">← ラボに戻る</Link>

      <div className="text-6xl mb-3">{rank.emoji}</div>
      <h1 className="text-3xl font-black text-[#4ade80] mb-1">全チャプター完了！</h1>
      <p className="text-[#94a3c4] text-sm mb-6">{rank.label}</p>

      <div className="text-7xl font-black text-[#4ade80] mb-1">{totalScore}</div>
      <div className="text-[#94a3c4] text-sm mb-6">/ {totalProblems} 問 正解</div>

      {/* Per-chapter scores */}
      <div className="w-full max-w-sm bg-[#162d5a] rounded-2xl p-4 mb-6 flex flex-col gap-2">
        {CHAPTERS.map((ch, i) => {
          const s = chapterScores[i]
          return (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{ch.icon} {ch.name}</span>
              <span className="font-black" style={{ color: ch.color }}>
                {s != null ? `${s} / ${ch.total}` : '–'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#4ade80] hover:scale-[1.02] transition-all"
          style={{ boxShadow: '0 0 30px rgba(74,222,128,0.4)' }}
        >
          もう一回！
        </button>
        <Link
          href="/lab"
          className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#4ade80] transition-all text-center"
        >
          ラボに戻る
        </Link>
      </div>
    </div>
  )
}

// ─── Menu screen ──────────────────────────────────────────────────────────────

function MenuScreen({
  chapterScores,
  onPlay,
}: {
  chapterScores: (number | null)[]
  onPlay: (idx: number) => void
}) {
  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center py-16 px-4">
      <Link href="/lab" className="fixed top-4 left-4 text-[#94a3c4] hover:text-[#4ade80] text-sm transition-colors z-10">← ラボに戻る</Link>

      <div className="text-5xl mb-3 mt-4">💻</div>
      <h1 className="text-3xl font-black text-[#4ade80] mb-1">プログラミング思考</h1>
      <p className="text-[#94a3c4] text-sm mb-8 max-w-xs text-center">
        5つのチャプターでプログラミングの考え方を学ぼう！
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {CHAPTERS.map((ch, i) => {
          const score = chapterScores[i]
          const played = score != null
          const rank = played ? getRank(score, ch.total) : null

          return (
            <div
              key={i}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: '#162d5a', border: `1px solid ${ch.color}33` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ch.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base" style={{ color: ch.color }}>{ch.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${ch.color}22`, color: ch.color }}
                    >
                      {ch.concept}
                    </span>
                  </div>
                  <p className="text-[#94a3c4] text-xs mt-0.5">{ch.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#94a3c4]">
                  <span>{ch.total}もんだい</span>
                  {played && rank && (
                    <span className="font-bold" style={{ color: ch.color }}>
                      {rank.emoji} {score}/{ch.total}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onPlay(i)}
                  className="px-5 py-2 rounded-xl font-black text-sm text-[#050b14] hover:scale-[1.04] transition-all"
                  style={{ background: ch.color }}
                >
                  {played ? 'もう一回' : 'プレイ'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Phase = 'menu' | 'playing' | 'chapter_result' | 'all_done'

export default function CodingPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [currentChapter, setCurrentChapter] = useState(0)
  const [chapterScores, setChapterScores] = useState<(number | null)[]>([null, null, null, null, null])

  useEffect(() => {
    setChapterScores(loadChapterScores())
  }, [])

  function handlePlay(chapterIdx: number) {
    setCurrentChapter(chapterIdx)
    setPhase('playing')
  }

  function handleChapterComplete(score: number) {
    saveChapterScore(currentChapter, score)
    const updated = loadChapterScores()
    setChapterScores(updated)
    setPhase('chapter_result')
  }

  function handleNextChapter() {
    if (currentChapter + 1 >= CHAPTERS.length) {
      setPhase('all_done')
    } else {
      setCurrentChapter((i) => i + 1)
      setPhase('playing')
    }
  }

  function handleQuit() {
    setPhase('menu')
  }

  function handleRestart() {
    setChapterScores([null, null, null, null, null])
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(getDataKey(SCORES_KEY))
        localStorage.removeItem(getDataKey(PROGRESS_KEY))
      }
    } catch {}
    setPhase('menu')
  }

  if (phase === 'menu') {
    return (
      <MenuScreen
        chapterScores={chapterScores}
        onPlay={handlePlay}
      />
    )
  }

  if (phase === 'playing') {
    const gameProps = {
      onComplete: handleChapterComplete,
      onQuit: handleQuit,
    }

    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center py-20 px-4">
        {currentChapter === 0 && (
          <MazeGame chapterIndex={0} {...gameProps} />
        )}
        {currentChapter === 1 && (
          <MazeGame chapterIndex={1} {...gameProps} />
        )}
        {currentChapter === 2 && (
          <DebugGame {...gameProps} />
        )}
        {currentChapter === 3 && (
          <PatternGame {...gameProps} />
        )}
        {currentChapter === 4 && (
          <ConditionalGame {...gameProps} />
        )}
      </div>
    )
  }

  if (phase === 'chapter_result') {
    return (
      <ChapterResultScreen
        chapterIdx={currentChapter}
        score={chapterScores[currentChapter] ?? 0}
        onNext={handleNextChapter}
        onMenu={() => setPhase('menu')}
      />
    )
  }

  if (phase === 'all_done') {
    return (
      <AllDoneScreen
        chapterScores={chapterScores}
        onRestart={handleRestart}
      />
    )
  }

  return null
}
