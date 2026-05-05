'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

interface WordEntry {
  emoji: string
  japanese: string
  english: string
  hint: string
}

const WORDS: WordEntry[] = [
  { emoji: '🍎', japanese: 'リンゴ', english: 'apple', hint: 'くだもの' },
  { emoji: '🐕', japanese: 'イヌ', english: 'dog', hint: 'どうぶつ' },
  { emoji: '🐱', japanese: 'ネコ', english: 'cat', hint: 'どうぶつ' },
  { emoji: '📚', japanese: 'ほん', english: 'book', hint: 'もの' },
  { emoji: '✏️', japanese: 'えんぴつ', english: 'pencil', hint: 'もの' },
  { emoji: '🌸', japanese: 'はな', english: 'flower', hint: 'しぜん' },
  { emoji: '🌙', japanese: 'つき', english: 'moon', hint: 'そら' },
  { emoji: '☀️', japanese: 'たいよう', english: 'sun', hint: 'そら' },
  { emoji: '🌊', japanese: 'うみ', english: 'sea', hint: 'しぜん' },
  { emoji: '⛰️', japanese: 'やま', english: 'mountain', hint: 'しぜん' },
  { emoji: '🍙', japanese: 'おにぎり', english: 'rice ball', hint: 'たべもの' },
  { emoji: '🚗', japanese: 'くるま', english: 'car', hint: 'のりもの' },
  { emoji: '✈️', japanese: 'ひこうき', english: 'airplane', hint: 'のりもの' },
  { emoji: '🏠', japanese: 'いえ', english: 'house', hint: 'たてもの' },
  { emoji: '🎒', japanese: 'ランドセル', english: 'backpack', hint: 'もの' },
  { emoji: '🍊', japanese: 'みかん', english: 'orange', hint: 'くだもの' },
  { emoji: '🐟', japanese: 'さかな', english: 'fish', hint: 'どうぶつ' },
  { emoji: '⭐', japanese: 'ほし', english: 'star', hint: 'そら' },
  { emoji: '🌈', japanese: 'にじ', english: 'rainbow', hint: 'そら' },
  { emoji: '🎵', japanese: 'おんがく', english: 'music', hint: 'こうい' },
  { emoji: '🏃', japanese: 'はしる', english: 'run', hint: 'こうい' },
  { emoji: '😊', japanese: 'うれしい', english: 'happy', hint: 'きもち' },
  { emoji: '😢', japanese: 'かなしい', english: 'sad', hint: 'きもち' },
  { emoji: '🔴', japanese: 'あかい', english: 'red', hint: 'いろ' },
  { emoji: '💙', japanese: 'あおい', english: 'blue', hint: 'いろ' },
  { emoji: '💚', japanese: 'みどり', english: 'green', hint: 'いろ' },
  { emoji: '🎂', japanese: 'ケーキ', english: 'cake', hint: 'たべもの' },
  { emoji: '🍕', japanese: 'ピザ', english: 'pizza', hint: 'たべもの' },
  { emoji: '👾', japanese: 'ゲーム', english: 'game', hint: 'あそび' },
  { emoji: '🏊', japanese: 'およぐ', english: 'swim', hint: 'こうい' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(correct: WordEntry, pool: WordEntry[]): string[] {
  const others = shuffle(pool.filter((w) => w.english !== correct.english)).slice(0, 3)
  return shuffle([correct.english, ...others.map((o) => o.english)])
}

const TOTAL = 10

export default function EnglishQuiz() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [queue, setQueue] = useState<WordEntry[]>([])
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback(() => {
    const q = shuffle(WORDS).slice(0, TOTAL)
    setQueue(q)
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setChoices(makeChoices(q[0], WORDS))
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    if (c === queue[index].english) setScore((s) => s + 1)
    else setMiss((m) => m + 1)

    setTimeout(() => {
      if (index + 1 >= TOTAL) { setPhase('result'); return }
      const next = index + 1
      setIndex(next)
      setChoices(makeChoices(queue[next], WORDS))
      setSelected(null)
    }, 900)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f87171] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-4xl font-black mb-2 text-[#f87171]">英語クイズ</h1>
        <p className="text-[#94a3c4] mb-6 max-w-xs leading-relaxed">
          絵を見て英語を選ぼう！<br />TANQuu も英語を勉強中だよ👀<br />全10問に挑戦！
        </p>
        <button
          onClick={startGame}
          className="px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]"
          style={{ background: '#f87171', boxShadow: '0 0 40px rgba(248,113,113,0.4)' }}
        >
          Let&apos;s go！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 Perfect!' : score >= 7 ? '🥇 Excellent!' : score >= 5 ? '🥈 Good job!' : '🥉 Try again!'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#f87171]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">英語クイズ {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-[#4ade80]">{score}</div>
            <div className="text-[#94a3c4] text-sm mt-1">正解</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-[#f87171]">{miss}</div>
            <div className="text-[#94a3c4] text-sm mt-1">まちがい</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={startGame} className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f87171] hover:scale-[1.02] transition-all">もう一回！</button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#f87171] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const current = queue[index]

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <button onClick={() => setPhase('intro')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{index + 1} / {TOTAL}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div className="h-full transition-all duration-500 bg-[#f87171]" style={{ width: `${(index / TOTAL) * 100}%` }} />
      </div>

      <div className="text-center">
        <p className="text-[#94a3c4] text-xs mb-4 uppercase tracking-widest">英語でなんていう？</p>
        <div className="text-[9rem] leading-none mb-2">{current.emoji}</div>
        <p className="text-2xl font-black mb-1">{current.japanese}</p>
        <p className="text-[#94a3c4] text-sm mb-8">{current.hint}</p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {choices.map((c) => {
            const isCorrect = c === current.english
            const isSelected = c === selected
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let text = '#e8f0fe'
            if (selected !== null) {
              if (isCorrect) { bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; text = '#4ade80' }
              else if (isSelected) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            }
            return (
              <button
                key={c}
                onClick={() => choose(c)}
                disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
