'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

interface ShapeQuestion {
  type: 'name' | 'corners' | 'sides'
  shape: Shape
  question: string
  correct: string
  choices: string[]
  explanation: string
}

interface Shape {
  name: string
  japanese: string
  corners: number
  sides: number
  svgPath: string
  color: string
  description: string
  explanation: string
}

const SHAPES: Shape[] = [
  {
    name: 'triangle', japanese: 'さんかくけい（三角形）', corners: 3, sides: 3,
    svgPath: 'M50,10 L90,85 L10,85 Z', color: '#f87171',
    description: 'とんがった形',
    explanation: '三角形は3本の直線で囲まれた図形。角（かど）が3つ、辺（へん）も3本あるよ！',
  },
  {
    name: 'square', japanese: 'せいほうけい（正方形）', corners: 4, sides: 4,
    svgPath: 'M15,15 L85,15 L85,85 L15,85 Z', color: '#60a5fa',
    description: '全ての辺が同じ長さ',
    explanation: '正方形は4本の辺がすべて同じ長さで、4つの角がすべて直角（90°）の四角形だよ！',
  },
  {
    name: 'rectangle', japanese: 'ちょうほうけい（長方形）', corners: 4, sides: 4,
    svgPath: 'M10,25 L90,25 L90,75 L10,75 Z', color: '#4ade80',
    description: '向かい合う辺が同じ長さ',
    explanation: '長方形は向かい合う2辺ずつが同じ長さで、全部の角が直角。ノートや教科書もこの形！',
  },
  {
    name: 'pentagon', japanese: 'ごかくけい（五角形）', corners: 5, sides: 5,
    svgPath: 'M50,8 L92,38 L75,85 L25,85 L8,38 Z', color: '#f0c040',
    description: '5つの角がある形',
    explanation: '五角形は辺が5本、角が5つ。アメリカの国防総省（ペンタゴン）の建物もこの形！',
  },
  {
    name: 'hexagon', japanese: 'ろっかくけい（六角形）', corners: 6, sides: 6,
    svgPath: 'M50,5 L90,27 L90,73 L50,95 L10,73 L10,27 Z', color: '#c4a8ff',
    description: 'ハチの巣のような形',
    explanation: '六角形は辺が6本、角が6つ。ハチの巣がこの形なのは、同じ面積で材料が一番少なくてすむから！',
  },
  {
    name: 'circle', japanese: 'えん（円）', corners: 0, sides: 1,
    svgPath: '', color: '#00e5c3',
    description: 'まんまるの形',
    explanation: '円は角も直線の辺もない。中心から端までの距離（半径）がどこも同じ！コンパスで書けるよ。',
  },
  {
    name: 'rhombus', japanese: 'ひし形', corners: 4, sides: 4,
    svgPath: 'M50,5 L95,50 L50,95 L5,50 Z', color: '#fb923c',
    description: '4辺が同じ長さのひし形',
    explanation: 'ひし形は4本の辺がすべて同じ長さ。正方形をななめに傾けた形！トランプのダイヤ♦もこれ。',
  },
  {
    name: 'star', japanese: 'ほし（星形）', corners: 5, sides: 5,
    svgPath: 'M50,5 L61,35 L95,35 L68,57 L79,91 L50,70 L21,91 L32,57 L5,35 L39,35 Z', color: '#fbbf24',
    description: '5つのとんがりがある',
    explanation: '星形（五芒星）はとんがりが5つ。星の形は世界中の国旗にも使われているよ！',
  },
]

const TOTAL = SHAPES.length  // 8問（図形の数に合わせる）

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeQuestion(shape: Shape): ShapeQuestion {
  const types: ShapeQuestion['type'][] = shape.name === 'circle'
    ? ['name', 'name']
    : ['name', 'corners', 'sides']
  const type = types[Math.floor(Math.random() * types.length)]

  if (type === 'name') {
    const correct = shape.japanese
    const others = shuffle(SHAPES.filter((s) => s.japanese !== shape.japanese)).slice(0, 3).map((s) => s.japanese)
    return {
      type, shape, question: 'この図形のなまえは？', correct,
      choices: shuffle([correct, ...others]),
      explanation: shape.explanation,
    }
  }
  if (type === 'corners') {
    const correct = `${shape.corners}個`
    const opts = shuffle([0, 3, 4, 5, 6, 8].filter((n) => n !== shape.corners)).slice(0, 3).map((n) => `${n}個`)
    return {
      type, shape, question: 'かどは何個ある？', correct,
      choices: shuffle([correct, ...opts]),
      explanation: shape.explanation,
    }
  }
  const correct = `${shape.sides}本`
  const opts = shuffle([1, 3, 4, 5, 6, 8].filter((n) => n !== shape.sides)).slice(0, 3).map((n) => `${n}本`)
  return {
    type, shape, question: 'へんは何本ある？', correct,
    choices: shuffle([correct, ...opts]),
    explanation: shape.explanation,
  }
}

function ShapeSVG({ shape, size = 100 }: { shape: Shape; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg">
      {shape.name === 'circle'
        ? <circle cx="50" cy="50" r="45" fill={shape.color} opacity="0.9" />
        : <path d={shape.svgPath} fill={shape.color} opacity="0.9" />
      }
    </svg>
  )
}

export default function ShapesQuiz() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [queue, setQueue] = useState<ShapeQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback(() => {
    setQueue(shuffle(SHAPES).map(makeQuestion))
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setShowExplanation(false)
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    if (c === queue[index].correct) setScore((s) => s + 1)
    else setMiss((m) => m + 1)
    setShowExplanation(true)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowExplanation(false)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#c4a8ff] text-sm transition-colors">← ラボに戻る</Link>
        <div className="mb-4">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <path d="M50,8 L92,38 L75,85 L25,85 L8,38 Z" fill="#c4a8ff" opacity="0.9" />
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-2 text-[#c4a8ff]">図形クイズ</h1>
        <p className="text-[#94a3c4] mb-2 max-w-xs leading-relaxed">
          図形を見てなまえ・角の数・辺の数を答えよう！<br />全{TOTAL}問。正解後には解説もあるよ。
        </p>
        <button onClick={startGame} className="mt-6 px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]" style={{ background: '#c4a8ff', boxShadow: '0 0 40px rgba(196,168,255,0.4)' }}>
          スタート！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 7 ? '🏆 図形マスター！' : score >= 5 ? '🥇 すごい！' : score >= 3 ? '🥈 よくできた' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#c4a8ff]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">図形クイズ {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center"><div className="text-5xl font-black text-[#4ade80]">{score}</div><div className="text-[#94a3c4] text-sm mt-1">正解</div></div>
          <div className="text-center"><div className="text-5xl font-black text-[#f87171]">{miss}</div><div className="text-[#94a3c4] text-sm mt-1">まちがい</div></div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={startGame} className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#c4a8ff] hover:scale-[1.02] transition-all">もう一回！</button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#c4a8ff] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const q = queue[index]
  if (!q) return null

  const isCorrect = selected === q.correct

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm">
        <button onClick={() => setPhase('intro')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{index + 1} / {TOTAL}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div className="h-full transition-all duration-500 bg-[#c4a8ff]" style={{ width: `${(index / TOTAL) * 100}%` }} />
      </div>

      <div className="w-full max-w-sm text-center">
        <p className="text-[#94a3c4] text-sm mb-4 tracking-widest uppercase">{q.question}</p>
        <div className="flex justify-center mb-3"><ShapeSVG shape={q.shape} size={110} /></div>
        <p className="text-[#94a3c4] text-xs mb-5">{q.shape.description}</p>

        {/* 選択肢 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {q.choices.map((c) => {
            const isCor = c === q.correct
            const isSel = c === selected
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let text = '#e8f0fe'
            if (selected !== null) {
              if (isCor) { bg = 'rgba(196,168,255,0.25)'; border = '#c4a8ff'; text = '#c4a8ff' }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* 解説カード */}
        {showExplanation && (
          <div className={`rounded-2xl p-4 mb-5 text-left transition-all ${isCorrect ? 'bg-[#c4a8ff]/15 border border-[#c4a8ff]/40' : 'bg-[#f87171]/15 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#c4a8ff' : '#f87171' }}>
              {isCorrect ? '✓ 正解！' : `✗ 正解は「${q.correct}」だよ`}
            </p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={goNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: '#c4a8ff', boxShadow: '0 0 25px rgba(196,168,255,0.35)' }}>
            {index + 1 < TOTAL ? '次の問題 →' : '結果を見る！'}
          </button>
        )}
      </div>
    </div>
  )
}
