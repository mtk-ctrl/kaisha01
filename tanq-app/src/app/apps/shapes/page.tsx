'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { playCorrect, playWrong } from '@/lib/audio'
import { saveScore } from '@/lib/scoreApi'

interface ShapeQuestion {
  type: 'name' | 'corners' | 'sides'
  shape: Shape
  question: string
  correct: string
  choices: string[]
  explanation: string
  rotation: number // かど・へんの数え問題は向きを変えて出す（向きが変わっても図形は同じ、を体感させる）
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
    description: 'ペンタゴン（米国防省）の形',
    explanation: '五角形は辺が5本、角が5つ。アメリカの国防総省（ペンタゴン）の建物もこの形！',
  },
  {
    name: 'hexagon', japanese: 'ろっかくけい（六角形）', corners: 6, sides: 6,
    svgPath: 'M50,5 L90,27 L90,73 L50,95 L10,73 L10,27 Z', color: '#c4a8ff',
    description: 'ハチの巣のような形',
    explanation: '六角形は辺が6本、角が6つ。ハチの巣がこの形なのは、同じ面積で材料が一番少なくてすむから！',
  },
  {
    name: 'circle', japanese: 'えん（円）', corners: 0, sides: 0,
    svgPath: '', color: '#00e5c3',
    description: 'まんまるの形',
    explanation: '円は角も直線の辺もない。中心から端までの距離（半径）がどこも同じ！コンパスで書けるよ。',
  },
  {
    name: 'rhombus', japanese: 'ひし形', corners: 4, sides: 4,
    svgPath: 'M50,5 L95,50 L50,95 L5,50 Z', color: '#fb923c',
    description: '4本の辺がぜんぶ同じ長さ',
    explanation: 'ひし形は4本の辺がすべて同じ長さ。正方形をななめに傾けた形！トランプのダイヤ♦もこれ。',
  },
  {
    // 星形の輪郭はとんがり5つ＋へこみ5つで頂点10・辺10。数え問題には出さない（NAME_ONLY）
    name: 'star', japanese: 'ほし（星形）', corners: 10, sides: 10,
    svgPath: 'M50,5 L61,35 L95,35 L68,57 L79,91 L50,70 L21,91 L32,57 L5,35 L39,35 Z', color: '#fbbf24',
    description: '5つのとんがりがある',
    explanation: '星形（五芒星）はとんがりが5つ。へこんだ角もあわせると、かどは全部で10個あるよ。世界中の国旗にも使われている形！',
  },
  {
    name: 'octagon', japanese: 'はっかくけい（八角形）', corners: 8, sides: 8,
    svgPath: 'M50,5 L75,15 L95,40 L95,60 L75,85 L50,95 L25,85 L5,60 L5,40 L25,15 Z', color: '#ff7043',
    description: 'STOPサインの形',
    explanation: '八角形は辺が8本、角が8つ。道路の一時停止サイン（STOP標識）はこの形だよ！',
  },
  {
    name: 'trapezoid', japanese: 'だいけい（台形）', corners: 4, sides: 4,
    svgPath: 'M20,75 L80,75 L65,25 L35,25 Z', color: '#26c6da',
    description: '1組の辺が平行な四角形',
    explanation: '台形は向かい合う1組の辺だけが平行な四角形。台形のケーキやバケツの形がこれだよ！',
  },
  {
    name: 'oval', japanese: 'だえん（楕円）', corners: 0, sides: 0,
    svgPath: '', color: '#ef9a9a',
    description: 'たまご型のまるい形',
    explanation: '楕円（だえん）は円を横か縦に引き伸ばした形。たまごや地球の軌道もこの形だよ！',
  },
  {
    name: 'parallelogram', japanese: 'へいこうしへんけい（平行四辺形）', corners: 4, sides: 4,
    svgPath: 'M25,75 L90,75 L75,25 L10,25 Z', color: '#66bb6a',
    description: '斜めに傾いた四角形',
    explanation: '平行四辺形は向かい合う2組の辺がそれぞれ平行で同じ長さ。長方形を斜めに押した形だよ！',
  },
  {
    name: 'right triangle', japanese: 'ちょっかくさんかくけい（直角三角形）', corners: 3, sides: 3,
    svgPath: 'M15,85 L85,85 L15,15 Z', color: '#ffa726',
    description: '直角（90°）がある三角形',
    explanation: '直角三角形は1つの角がちょうど90°。定規やスロープの形がこれ。ピタゴラスの定理で有名！',
  },
  {
    name: 'heptagon', japanese: 'ななかくけい（七角形）', corners: 7, sides: 7,
    svgPath: 'M50,5 L82,20 L95,55 L80,88 L50,95 L20,88 L5,55 L18,20 Z', color: '#29b6f6',
    description: 'コインに使われる形',
    explanation: '七角形は辺が7本、角が7つ。正七角形はすべての辺と角が等しく、硬貨（コイン）にも使われるよ！',
  },
  {
    name: 'cross', japanese: 'じゅうじ形（十字形）', corners: 12, sides: 12,
    svgPath: 'M35,5 L65,5 L65,35 L95,35 L95,65 L65,65 L65,95 L35,95 L35,65 L5,65 L5,35 L35,35 Z', color: '#ec407a',
    description: '十字（＋）の形',
    explanation: '十字形（プラス形）は12本の辺と12個の角がある図形。足し算の「＋」記号もこの形だよ！',
  },
]

const TOTAL = SHAPES.length

const SHAPES_BEST_KEY = 'tanq_shapes_best_v1'

function loadShapesBest(): number {
  if (typeof window === 'undefined') return 0
  try { return JSON.parse(localStorage.getItem(getDataKey(SHAPES_BEST_KEY)) || '{"best":0}').best } catch { return 0 }
}
function saveShapesBest(score: number) {
  if (typeof window === 'undefined') return
  if (score > loadShapesBest()) {
    try { localStorage.setItem(getDataKey(SHAPES_BEST_KEY), JSON.stringify({ best: score })) } catch {}
  }
}

function shuffle<T>(arr: T[]): T[] {
  // Fisher-Yates（sort(random)は偏るため使わない）
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// なまえ問題のみ出す図形（円・楕円はかど/へんがなく、星形はへこみ角を含め数えると10になり紛らわしい）
const NAME_ONLY = ['circle', 'oval', 'star']

function makeQuestion(shape: Shape): ShapeQuestion {
  const types: ShapeQuestion['type'][] = NAME_ONLY.includes(shape.name)
    ? ['name']
    : ['name', 'corners', 'sides']
  const type = types[Math.floor(Math.random() * types.length)]
  // 数え問題は向きをランダムに変えて出す（向きが変わっても かど・へんの数は同じ）
  // なまえ問題は回転させない（正方形を45°回すとひし形に見える等、答えが曖昧になるため）
  const rotation = type === 'name' ? 0 : Math.floor(Math.random() * 360)

  if (type === 'name') {
    const correct = shape.japanese
    const others = shuffle(SHAPES.filter((s) => s.japanese !== shape.japanese)).slice(0, 3).map((s) => s.japanese)
    return {
      type, shape, question: 'この図形のなまえは？', correct,
      choices: shuffle([correct, ...others]),
      explanation: shape.explanation,
      rotation,
    }
  }
  if (type === 'corners') {
    const correct = `${shape.corners}個`
    const opts = shuffle([0, 3, 4, 5, 6, 7, 8, 10, 12].filter((n) => n !== shape.corners)).slice(0, 3).map((n) => `${n}個`)
    return {
      type, shape, question: 'かどは何個ある？', correct,
      choices: shuffle([correct, ...opts]),
      explanation: shape.explanation,
      rotation,
    }
  }
  const correct = `${shape.sides}本`
  const opts = shuffle([1, 3, 4, 5, 6, 7, 8, 10, 12].filter((n) => n !== shape.sides)).slice(0, 3).map((n) => `${n}本`)
  return {
    type, shape, question: 'へんは何本ある？', correct,
    choices: shuffle([correct, ...opts]),
    explanation: shape.explanation,
    rotation,
  }
}

// 1回目のまちがいで出す「考える足場」ヒント（答えそのものは見せない）
function getHint(q: ShapeQuestion): string {
  if (q.type === 'name') return 'かど（とんがり）の数を ゆびで かぞえてみよう。かどが ない形は、まるい なかまだよ！'
  if (q.type === 'corners') return 'とんがっている ところを、1つずつ ゆびで さしながら かぞえてみよう。'
  return 'まっすぐな線（へん）を、1本ずつ なぞって かぞえてみよう。かどの数と へんの数は おなじに なるよ！'
}

function ShapeSVG({ shape, size = 100, rotation = 0 }: { shape: Shape; size?: number; rotation?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg" style={{ overflow: 'visible' }}>
      <g transform={rotation ? `rotate(${rotation} 50 50)` : undefined}>
        {shape.name === 'circle'
          ? <circle cx="50" cy="50" r="45" fill={shape.color} opacity="0.9" />
          : shape.name === 'oval'
          ? <ellipse cx="50" cy="50" rx="45" ry="30" fill={shape.color} opacity="0.9" />
          : <path d={shape.svgPath} fill={shape.color} opacity="0.9" />
        }
      </g>
    </svg>
  )
}

export default function ShapesQuiz() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [queue, setQueue] = useState<ShapeQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<0 | 1>(0)               // 0=1回目, 1=ヒントを見て再挑戦中
  const [firstWrong, setFirstWrong] = useState<string | null>(null) // 1回目にまちがえた選択肢
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback(() => {
    setQueue(shuffle(SHAPES).map(makeQuestion))
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setAttempt(0)
    setFirstWrong(null)
    setShowExplanation(false)
    setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase === 'result') {
      saveShapesBest(score)
      saveScore('shapes', score, TOTAL)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function choose(c: string) {
    if (selected !== null || c === firstWrong) return
    const correct = c === queue[index].correct
    if (correct) playCorrect(); else playWrong()

    if (attempt === 0) {
      // スコアは初回解答のみで記録する（再挑戦で水増ししない）
      if (correct) {
        setSelected(c)
        setScore((s) => s + 1)
        setShowExplanation(true)
      } else {
        // 1回目のまちがい: 答えは見せず、ヒントを出してもう一度考えてもらう
        setMiss((m) => m + 1)
        setFirstWrong(c)
        setAttempt(1)
      }
      return
    }

    // 2回目: 記録は変えず、答え合わせと解説の確認だけ行う
    setSelected(c)
    setShowExplanation(true)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    setIndex((i) => i + 1)
    setSelected(null)
    setAttempt(0)
    setFirstWrong(null)
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
        <h1 className="text-4xl font-black mb-2 text-[#c4a8ff]">図形トレーニング</h1>
        <p className="text-[#94a3c4] mb-2 max-w-xs leading-relaxed">
          図形を見てなまえ・角の数・辺の数を答えよう！<br />全{TOTAL}問。まちがえてもヒントが出るからだいじょうぶ！
        </p>
        <button onClick={startGame} className="mt-6 px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]" style={{ background: '#c4a8ff', boxShadow: '0 0 40px rgba(196,168,255,0.4)' }}>
          スタート！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 14 ? '🏆 図形マスター！' : score >= 10 ? '🥇 すごい！' : score >= 6 ? '🥈 よくできた' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#c4a8ff]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">図形トレーニング {TOTAL}問</p>
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
  const solvedFirstTry = attempt === 0
  const isRetrying = attempt === 1 && selected === null

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
        <div className="flex justify-center mb-3"><ShapeSVG shape={q.shape} size={110} rotation={q.rotation} /></div>
        {q.type === 'name' && <p className="text-[#94a3c4] text-xs mb-5">{q.shape.description}</p>}

        {/* 選択肢 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {q.choices.map((c) => {
            const isCor = c === q.correct
            const isSel = c === selected
            const isFirstWrong = c === firstWrong
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let text = '#e8f0fe'
            let opacity = 1
            if (selected !== null) {
              if (isCor) { bg = 'rgba(196,168,255,0.25)'; border = '#c4a8ff'; text = '#c4a8ff' }
              else if (isSel || isFirstWrong) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            } else if (isFirstWrong) {
              // 1回目にまちがえた選択肢は消して、残りからもう一度考えてもらう
              bg = 'rgba(248,113,113,0.12)'; border = '#f87171'; text = '#f87171'; opacity = 0.45
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null || isFirstWrong}
                className="py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] disabled:cursor-default disabled:hover:scale-100"
                style={{ background: bg, border: `2px solid ${border}`, color: text, opacity }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* 1回目のまちがい: 答えは見せずヒントで再挑戦 */}
        {isRetrying && (
          <div className="rounded-2xl p-4 mb-5 text-left bg-[#fbbf24]/15 border border-[#fbbf24]/50">
            <p className="font-black text-sm mb-1 text-[#fbbf24]">💡 ヒント</p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{getHint(q)}</p>
            <p className="text-[#94a3c4] text-xs mt-1.5">もういちど えらんでみよう！</p>
          </div>
        )}

        {/* 解説カード */}
        {showExplanation && (
          <div className={`rounded-2xl p-4 mb-5 text-left transition-all ${isCorrect ? 'bg-[#c4a8ff]/15 border border-[#c4a8ff]/40' : 'bg-[#f87171]/15 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#c4a8ff' : '#f87171' }}>
              {isCorrect ? (solvedFirstTry ? '✓ 正解！' : '✓ できた！') : `おしい！正解は「${q.correct}」だよ`}
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
