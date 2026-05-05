'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

type Grade = '小1' | '小2' | '小3' | '小4' | '小5' | '小6'

interface KanjiEntry {
  kanji: string
  reading: string
  meaning: string
}

const KANJI_DATA: Record<Grade, KanjiEntry[]> = {
  '小1': [
    { kanji: '山', reading: 'やま', meaning: 'mountain' },
    { kanji: '川', reading: 'かわ', meaning: 'river' },
    { kanji: '田', reading: 'た', meaning: 'rice field' },
    { kanji: '日', reading: 'にち', meaning: 'sun / day' },
    { kanji: '月', reading: 'つき', meaning: 'moon / month' },
    { kanji: '火', reading: 'ひ', meaning: 'fire' },
    { kanji: '水', reading: 'みず', meaning: 'water' },
    { kanji: '木', reading: 'き', meaning: 'tree' },
    { kanji: '金', reading: 'きん', meaning: 'gold' },
    { kanji: '土', reading: 'つち', meaning: 'earth / soil' },
    { kanji: '花', reading: 'はな', meaning: 'flower' },
    { kanji: '空', reading: 'そら', meaning: 'sky' },
    { kanji: '犬', reading: 'いぬ', meaning: 'dog' },
    { kanji: '猫', reading: 'ねこ', meaning: 'cat' },
    { kanji: '人', reading: 'ひと', meaning: 'person' },
  ],
  '小2': [
    { kanji: '海', reading: 'うみ', meaning: 'sea' },
    { kanji: '岩', reading: 'いわ', meaning: 'rock' },
    { kanji: '星', reading: 'ほし', meaning: 'star' },
    { kanji: '風', reading: 'かぜ', meaning: 'wind' },
    { kanji: '雨', reading: 'あめ', meaning: 'rain' },
    { kanji: '雪', reading: 'ゆき', meaning: 'snow' },
    { kanji: '春', reading: 'はる', meaning: 'spring' },
    { kanji: '夏', reading: 'なつ', meaning: 'summer' },
    { kanji: '秋', reading: 'あき', meaning: 'autumn' },
    { kanji: '冬', reading: 'ふゆ', meaning: 'winter' },
    { kanji: '朝', reading: 'あさ', meaning: 'morning' },
    { kanji: '夜', reading: 'よる', meaning: 'night' },
    { kanji: '光', reading: 'ひかり', meaning: 'light' },
    { kanji: '色', reading: 'いろ', meaning: 'color' },
    { kanji: '声', reading: 'こえ', meaning: 'voice' },
  ],
  '小3': [
    { kanji: '島', reading: 'しま', meaning: 'island' },
    { kanji: '谷', reading: 'たに', meaning: 'valley' },
    { kanji: '港', reading: 'みなと', meaning: 'harbor' },
    { kanji: '橋', reading: 'はし', meaning: 'bridge' },
    { kanji: '坂', reading: 'さか', meaning: 'slope' },
    { kanji: '湖', reading: 'みずうみ', meaning: 'lake' },
    { kanji: '池', reading: 'いけ', meaning: 'pond' },
    { kanji: '森', reading: 'もり', meaning: 'forest' },
    { kanji: '畑', reading: 'はたけ', meaning: 'field' },
    { kanji: '薬', reading: 'くすり', meaning: 'medicine' },
    { kanji: '荷', reading: 'に', meaning: 'load / cargo' },
    { kanji: '悪', reading: 'わる', meaning: 'bad / evil' },
    { kanji: '急', reading: 'きゅう', meaning: 'sudden / hurry' },
    { kanji: '暗', reading: 'くら', meaning: 'dark' },
    { kanji: '温', reading: 'あたた', meaning: 'warm' },
  ],
  '小4': [
    { kanji: '航', reading: 'こう', meaning: 'navigate' },
    { kanji: '灯', reading: 'とう', meaning: 'lamp / light' },
    { kanji: '漁', reading: 'りょう', meaning: 'fishing' },
    { kanji: '縄', reading: 'なわ', meaning: 'rope' },
    { kanji: '陸', reading: 'りく', meaning: 'land' },
    { kanji: '菜', reading: 'な', meaning: 'vegetable' },
    { kanji: '倉', reading: 'くら', meaning: 'warehouse' },
    { kanji: '械', reading: 'かい', meaning: 'machine / tool' },
    { kanji: '熱', reading: 'ねつ', meaning: 'heat / fever' },
    { kanji: '塩', reading: 'しお', meaning: 'salt' },
    { kanji: '類', reading: 'るい', meaning: 'kind / type' },
    { kanji: '浴', reading: 'よく', meaning: 'bathe' },
    { kanji: '察', reading: 'さつ', meaning: 'observe / judge' },
    { kanji: '季', reading: 'き', meaning: 'season' },
    { kanji: '節', reading: 'せつ', meaning: 'season / joint' },
  ],
  '小5': [
    { kanji: '圧', reading: 'あつ', meaning: 'pressure' },
    { kanji: '移', reading: 'い', meaning: 'move / shift' },
    { kanji: '因', reading: 'いん', meaning: 'cause / reason' },
    { kanji: '営', reading: 'えい', meaning: 'operate / manage' },
    { kanji: '応', reading: 'おう', meaning: 'respond' },
    { kanji: '仮', reading: 'か', meaning: 'temporary / false' },
    { kanji: '価', reading: 'か', meaning: 'value / price' },
    { kanji: '快', reading: 'かい', meaning: 'pleasant / cheerful' },
    { kanji: '解', reading: 'かい', meaning: 'solve / dissolve' },
    { kanji: '格', reading: 'かく', meaning: 'status / rank' },
    { kanji: '確', reading: 'かく', meaning: 'certain / confirm' },
    { kanji: '額', reading: 'がく', meaning: 'amount / forehead' },
    { kanji: '刊', reading: 'かん', meaning: 'publish' },
    { kanji: '幹', reading: 'かん', meaning: 'trunk / main' },
    { kanji: '績', reading: 'せき', meaning: 'achievement' },
  ],
  '小6': [
    { kanji: '異', reading: 'い', meaning: 'different / strange' },
    { kanji: '遺', reading: 'い', meaning: 'leave behind' },
    { kanji: '域', reading: 'いき', meaning: 'area / domain' },
    { kanji: '宇', reading: 'う', meaning: 'universe / eaves' },
    { kanji: '映', reading: 'えい', meaning: 'reflect / project' },
    { kanji: '沿', reading: 'えん', meaning: 'along / follow' },
    { kanji: '我', reading: 'が', meaning: 'ego / self' },
    { kanji: '灰', reading: 'はい', meaning: 'ash / gray' },
    { kanji: '拡', reading: 'かく', meaning: 'expand / enlarge' },
    { kanji: '革', reading: 'かく', meaning: 'reform / leather' },
    { kanji: '閣', reading: 'かく', meaning: 'cabinet / tower' },
    { kanji: '割', reading: 'わり', meaning: 'divide / ratio' },
    { kanji: '株', reading: 'かぶ', meaning: 'stock / stump' },
    { kanji: '干', reading: 'ほ', meaning: 'dry / interfere' },
    { kanji: '巻', reading: 'まき', meaning: 'roll / volume' },
  ],
}

const GRADE_COLORS: Record<Grade, string> = {
  '小1': '#4ade80',
  '小2': '#34d399',
  '小3': '#60a5fa',
  '小4': '#c4a8ff',
  '小5': '#f0c040',
  '小6': '#f87171',
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(correct: KanjiEntry, pool: KanjiEntry[]): string[] {
  const others = shuffle(pool.filter((k) => k.reading !== correct.reading)).slice(0, 3)
  return shuffle([correct.reading, ...others.map((o) => o.reading)])
}

type Phase = 'select' | 'playing' | 'result'

export default function KanjiQuiz() {
  const [phase, setPhase] = useState<Phase>('select')
  const [grade, setGrade] = useState<Grade>('小3')
  const [queue, setQueue] = useState<KanjiEntry[]>([])
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const TOTAL = 10

  const loadChoices = useCallback((q: KanjiEntry[], idx: number, g: Grade) => {
    setChoices(makeChoices(q[idx], KANJI_DATA[g]))
    setSelected(null)
  }, [])

  const startQuiz = (g: Grade) => {
    const q = shuffle(KANJI_DATA[g]).slice(0, TOTAL)
    setGrade(g)
    setQueue(q)
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setChoices(makeChoices(q[0], KANJI_DATA[g]))
    setPhase('playing')
  }

  function choose(choice: string) {
    if (selected !== null) return
    setSelected(choice)
    if (choice === queue[index].reading) {
      setScore((s) => s + 1)
    } else {
      setMiss((m) => m + 1)
    }
    setTimeout(() => {
      if (index + 1 >= TOTAL) {
        setPhase('result')
      } else {
        const next = index + 1
        setIndex(next)
        loadChoices(queue, next, grade)
      }
    }, 900)
  }

  const color = GRADE_COLORS[grade]

  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
        <Link href="/lab" className="absolute top-6 left-6 text-[#8892b0] hover:text-[#c4a8ff] text-sm transition-colors">
          ← ラボに戻る
        </Link>
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-black mb-2 text-[#c4a8ff]">漢字クイズ</h1>
        <p className="text-[#8892b0] mb-10 text-center">学年を選んでスタート！<br />読み方を4択で答えよう</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-sm">
          {(Object.keys(KANJI_DATA) as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => startQuiz(g)}
              className="py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.05]"
              style={{ background: GRADE_COLORS[g], boxShadow: `0 0 20px ${GRADE_COLORS[g]}40` }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 完璧！' : score >= 7 ? '🥇 すごい！' : score >= 5 ? '🥈 よくできました' : '🥉 もう一回！'
    return (
      <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1" style={{ color }}>{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#8892b0] mb-8">{grade} の漢字 {TOTAL}問</p>

        <div className="flex gap-10 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-[#4ade80]">{score}</div>
            <div className="text-[#8892b0] text-sm mt-1">正解</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-[#f87171]">{miss}</div>
            <div className="text-[#8892b0] text-sm mt-1">まちがい</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => startQuiz(grade)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: color }}
          >
            もう一回！
          </button>
          <button
            onClick={() => setPhase('select')}
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#8892b0] hover:text-white hover:border-white/40 transition-all"
          >
            学年を変える
          </button>
          <Link
            href="/lab"
            className="w-full py-4 rounded-2xl font-bold text-lg border border-white/10 text-[#8892b0] hover:text-[#c4a8ff] transition-all text-center"
          >
            ラボに戻る
          </Link>
        </div>
      </div>
    )
  }

  const current = queue[index]
  const progress = ((index) / TOTAL) * 100

  return (
    <div className="min-h-screen bg-[#071628] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setPhase('select')}
          className="text-[#8892b0] hover:text-white text-sm transition-colors"
        >
          ← やめる
        </button>
        <span className="text-sm text-[#8892b0]">{index + 1} / {TOTAL}</span>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>

      {/* Question */}
      <div className="text-center">
        <p className="text-[#8892b0] text-sm mb-4 tracking-widest uppercase">{grade} — 読み方は？</p>

        <div
          className="text-[10rem] font-black leading-none mb-4 transition-all duration-200"
          style={{ color: selected ? (selected === current.reading ? '#4ade80' : '#f87171') : '#e8f0fe' }}
        >
          {current.kanji}
        </div>

        <p className="text-[#8892b0] text-xs mb-8">{current.meaning}</p>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {choices.map((c) => {
            const isCorrect = c === current.reading
            const isSelected = c === selected
            let bg = 'rgba(255,255,255,0.06)'
            let border = 'rgba(255,255,255,0.12)'
            let textColor = '#e8f0fe'
            if (selected !== null) {
              if (isCorrect) { bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; textColor = '#4ade80' }
              else if (isSelected) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; textColor = '#f87171' }
            }
            return (
              <button
                key={c}
                onClick={() => choose(c)}
                disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: textColor }}
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
