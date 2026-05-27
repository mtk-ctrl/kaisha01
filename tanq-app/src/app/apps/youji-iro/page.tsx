'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

// ===== データ =====

interface ColorItem {
  id: string
  name: string
  hex: string
  speech: string
}

interface ShapeItem {
  id: string
  name: string
  speech: string
  svgBody: (hex: string) => string
}

const COLORS: ColorItem[] = [
  { id: 'red',      name: 'あか',     hex: '#ef4444', speech: 'あか' },
  { id: 'blue',     name: 'あお',     hex: '#3b82f6', speech: 'あお' },
  { id: 'yellow',   name: 'きいろ',   hex: '#facc15', speech: 'きいろ' },
  { id: 'green',    name: 'みどり',   hex: '#22c55e', speech: 'みどり' },
  { id: 'orange',   name: 'オレンジ', hex: '#f97316', speech: 'オレンジ' },
  { id: 'pink',     name: 'ピンク',   hex: '#ec4899', speech: 'ピンク' },
  { id: 'purple',   name: 'むらさき', hex: '#a855f7', speech: 'むらさき' },
  { id: 'white',    name: 'しろ',     hex: '#f1f5f9', speech: 'しろ' },
  { id: 'black',    name: 'くろ',     hex: '#1e293b', speech: 'くろ' },
  { id: 'brown',    name: 'ちゃいろ', hex: '#92400e', speech: 'ちゃいろ' },
]

const SHAPES: ShapeItem[] = [
  {
    id: 'circle',
    name: 'まる（えん）',
    speech: 'まる',
    svgBody: (c) => `<circle cx="100" cy="100" r="80" fill="${c}"/>`,
  },
  {
    id: 'square',
    name: 'しかく（せいほうけい）',
    speech: 'しかく',
    svgBody: (c) => `<rect x="20" y="20" width="160" height="160" rx="10" fill="${c}"/>`,
  },
  {
    id: 'triangle',
    name: 'さんかく（さんかっけい）',
    speech: 'さんかく',
    svgBody: (c) => `<polygon points="100,12 188,185 12,185" fill="${c}"/>`,
  },
  {
    id: 'star',
    name: 'ほし（スター）',
    speech: 'ほし',
    svgBody: (c) =>
      `<polygon points="100,10 122,75 192,75 137,116 158,182 100,142 42,182 63,116 8,75 78,75" fill="${c}"/>`,
  },
  {
    id: 'heart',
    name: 'ハート（こころ）',
    speech: 'ハート',
    svgBody: (c) =>
      `<path d="M100 170 C60 145 20 110 20 75 C20 45 40 20 70 20 C85 20 100 35 100 35 C100 35 115 20 130 20 C160 20 180 45 180 75 C180 110 140 145 100 170Z" fill="${c}"/>`,
  },
  {
    id: 'diamond',
    name: 'ひし形（ダイヤ）',
    speech: 'ひしがた',
    svgBody: (c) => `<polygon points="100,10 190,100 100,190 10,100" fill="${c}"/>`,
  },
  {
    id: 'rectangle',
    name: 'ちょうほうけい（よこしかく）',
    speech: 'ちょうほうけい',
    svgBody: (c) => `<rect x="10" y="55" width="180" height="100" rx="8" fill="${c}"/>`,
  },
  {
    id: 'oval',
    name: 'たまご形（だえん）',
    speech: 'だえん',
    svgBody: (c) => `<ellipse cx="100" cy="100" rx="85" ry="60" fill="${c}"/>`,
  },
]

// ===== 型 =====

type GameMode = 'iro' | 'katachi' | 'mix'
type Phase = 'menu' | 'game' | 'result'

interface IroQuestion {
  type: 'iro'
  color: ColorItem
  shape: ShapeItem
  correctId: string
  choices: ColorItem[]
}

interface KatachiQuestion {
  type: 'katachi'
  color: ColorItem
  shape: ShapeItem
  correctId: string
  choices: ShapeItem[]
}

type Question = IroQuestion | KatachiQuestion

interface LogEntry {
  q: Question
  chosenId: string
  ok: boolean
}

interface IroRecord {
  mode: GameMode
  count: number
  correct: number
  score: number
  stars: number
  date: string
}

const RECORD_KEY = 'tanq_iro_records_v1'

function saveRecord(data: Omit<IroRecord, 'date'>) {
  try {
    const key = getDataKey(RECORD_KEY)
    const records: IroRecord[] = JSON.parse(localStorage.getItem(key) || '[]')
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') })
    localStorage.setItem(key, JSON.stringify(records.slice(0, 30)))
  } catch {}
}

// ===== ユーティリティ =====

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

function buildQuestions(mode: GameMode, count: number): Question[] {
  const qs: Question[] = []
  for (let i = 0; i < count; i++) {
    const useIro = mode === 'iro' || (mode === 'mix' && i % 2 === 0)
    if (useIro) {
      const color = pick(COLORS)
      const shape = pick(SHAPES)
      const distractors = shuffle(COLORS.filter((c) => c.id !== color.id)).slice(0, 3)
      qs.push({
        type: 'iro',
        color,
        shape,
        correctId: color.id,
        choices: shuffle([color, ...distractors]),
      })
    } else {
      const shape = pick(SHAPES)
      const color = pick(COLORS)
      const distractors = shuffle(SHAPES.filter((s) => s.id !== shape.id)).slice(0, 3)
      qs.push({
        type: 'katachi',
        color,
        shape,
        correctId: shape.id,
        choices: shuffle([shape, ...distractors]),
      })
    }
  }
  return qs
}

function getCorrectId(q: Question): string {
  return q.correctId
}

export default function IroPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [mode, setMode] = useState<GameMode>('iro')
  const [count, setCount] = useState<number>(10)

  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])

  const [chosenId, setChosenId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const startGame = useCallback(() => {
    const qs = buildQuestions(mode, count)
    setQuestions(qs)
    setIdx(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setLog([])
    setChosenId(null)
    setShowFeedback(false)
    setPhase('game')
    const q = qs[0]
    if (q) {
      speak(q.type === 'iro' ? 'この かたちは なにいろですか？' : 'この かたちの なまえは なんですか？')
    }
  }, [mode, count])

  const handleAnswer = useCallback(
    (cid: string) => {
      if (chosenId !== null) return
      const q = questions[idx]
      const correct = getCorrectId(q)
      const ok = cid === correct

      setChosenId(cid)
      setShowFeedback(true)

      let newCombo = combo
      let newMaxCombo = maxCombo
      let newScore = score

      if (ok) {
        newCombo = combo + 1
        if (newCombo > maxCombo) newMaxCombo = newCombo
        const comboBonus = Math.min(newCombo - 1, 5) * 20
        newScore = score + 100 + comboBonus
        setCombo(newCombo)
        setMaxCombo(newMaxCombo)
        setScore(newScore)

        const answerSpeech =
          q.type === 'iro' ? q.color.speech : q.shape.speech
        speak(
          newCombo >= 3
            ? 'すごい！' + newCombo + 'れんぞく！'
            : 'せいかい！' + answerSpeech + '！',
        )
      } else {
        setCombo(0)
        newCombo = 0
        const correctSpeech =
          q.type === 'iro'
            ? COLORS.find((c) => c.id === correct)?.speech ?? correct
            : SHAPES.find((s) => s.id === correct)?.speech ?? correct
        speak('ざんねん。' + correctSpeech + ' だよ！')
      }

      setLog((prev) => [...prev, { q, chosenId: cid, ok }])
    },
    [chosenId, questions, idx, combo, maxCombo, score],
  )

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= questions.length) {
      const total = questions.length
      const correctCount = log.filter((l) => l.ok).length
      const pct = correctCount / total
      let stars = 1
      if (pct >= 0.9) stars = 3
      else if (pct >= 0.65) stars = 2

      saveRecord({ mode, count: total, correct: correctCount, score, stars })
      saveScore('youji-iro', correctCount, total, mode)

      speak(stars === 3 ? 'かんぺき！すごいね！' : 'よくがんばりました！')
      setPhase('result')
    } else {
      setIdx(nextIdx)
      setChosenId(null)
      setShowFeedback(false)
      const q = questions[nextIdx]
      speak(q.type === 'iro' ? 'この かたちは なにいろですか？' : 'この かたちの なまえは なんですか？')
    }
  }, [idx, questions, log, mode, score])

  // ===== MENU =====
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🎨 いろと かたち</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの しゅるい</p>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'iro',     label: '🎨 いろ' },
                { id: 'katachi', label: '🔷 かたち' },
                { id: 'mix',     label: '🌈 まぜまぜ' },
              ] as { id: GameMode; label: string }[]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    mode === m.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    count === n ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  // ===== GAME =====
  if (phase === 'game') {
    const q = questions[idx]
    const total = questions.length
    const correctId = getCorrectId(q)
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                window.speechSynthesis?.cancel()
                setPhase('menu')
              }}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{idx + 1} / {total}</span>
                <span>スコア: {score}</span>
                {combo >= 2 && <span className="text-orange-500 font-black">🔥 {combo}れんぞく</span>}
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ec4899, #a855f7)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {q.type === 'iro' ? 'この かたちは なにいろ？' : 'この かたちは なあに？'}
            </p>
            {/* Shape SVG display */}
            <div className="flex justify-center">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                dangerouslySetInnerHTML={{ __html: q.shape.svgBody(q.color.hex) }}
              />
            </div>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            {q.type === 'iro'
              ? (q.choices as ColorItem[]).map((c) => {
                  let btnClass =
                    'w-full py-3 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2 '
                  if (chosenId === null) {
                    btnClass += 'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
                  } else if (c.id === correctId) {
                    btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
                  } else if (c.id === chosenId && c.id !== correctId) {
                    btnClass += 'bg-red-100 text-red-600 border-2 border-red-400'
                  } else {
                    btnClass += 'bg-gray-100 text-gray-400'
                  }
                  return (
                    <button
                      key={c.id}
                      className={btnClass}
                      onClick={() => handleAnswer(c.id)}
                      disabled={chosenId !== null}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ background: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  )
                })
              : (q.choices as ShapeItem[]).map((s) => {
                  let btnClass =
                    'w-full py-3 rounded-2xl text-sm font-bold transition-all '
                  if (chosenId === null) {
                    btnClass += 'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
                  } else if (s.id === correctId) {
                    btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
                  } else if (s.id === chosenId && s.id !== correctId) {
                    btnClass += 'bg-red-100 text-red-600 border-2 border-red-400'
                  } else {
                    btnClass += 'bg-gray-100 text-gray-400'
                  }
                  return (
                    <button
                      key={s.id}
                      className={btnClass}
                      onClick={() => handleAnswer(s.id)}
                      disabled={chosenId !== null}
                    >
                      {s.name}
                    </button>
                  )
                })}
          </div>

          {/* Feedback */}
          {showFeedback && chosenId !== null && (
            <div
              className={`rounded-2xl p-4 text-center ${
                chosenId === correctId ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="text-3xl mb-1">{chosenId === correctId ? '⭕' : '❌'}</div>
              {q.type === 'iro' ? (
                <p className="text-sm font-bold text-gray-700">
                  {chosenId === correctId
                    ? `せいかい！「${q.color.name}」だよ！`
                    : `せいかいは「${q.color.name}」だよ！`}
                </p>
              ) : (
                <p className="text-sm font-bold text-gray-700">
                  {chosenId === correctId
                    ? `せいかい！「${q.shape.name}」だよ！`
                    : `せいかいは「${q.shape.name}」だよ！`}
                </p>
              )}
              {combo >= 3 && chosenId === correctId && (
                <p className="text-orange-500 font-black mt-1">🔥 {combo}れんぞく！！</p>
              )}
              {/* Mini shape replay */}
              <div className="flex justify-center my-2">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  width="70"
                  height="70"
                  dangerouslySetInnerHTML={{ __html: q.shape.svgBody(q.color.hex) }}
                />
              </div>
              <button
                onClick={nextQuestion}
                className="mt-1 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ===== RESULT =====
  const correctCount = log.filter((l) => l.ok).length
  const total = questions.length
  const pct = correctCount / total
  let stars = 1
  if (pct >= 0.9) stars = 3
  else if (pct >= 0.65) stars = 2
  let emoji = '😊'
  let title = 'よくがんばりました！'
  if (stars === 3) { emoji = '🌈'; title = 'かんぺき！すごい！！' }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！' }

  const modeLabel: Record<GameMode, string> = {
    iro: '🎨いろ',
    katachi: '🔷かたち',
    mix: '🌈まぜまぜ',
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🎨 けっか</h1>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-black text-pink-600">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-500">{score}</div>
              <div className="text-xs text-gray-500">てん</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500">{maxCombo}</div>
              <div className="text-xs text-gray-500">コンボ</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{modeLabel[mode]} | {total}もん</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => {
            const qLabel =
              l.q.type === 'iro'
                ? `${l.q.shape.name} → いろは？`
                : `なにいろかの ${l.q.shape.name} → かたちは？`
            const ans =
              l.q.type === 'iro' ? l.q.color.name : l.q.shape.name
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm p-2 rounded-xl ${
                  l.ok ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <span>{l.ok ? '⭕' : '❌'}</span>
                <span className="flex-1 text-gray-700 text-xs">{qLabel}</span>
                <span className={`font-bold text-xs ${l.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {ans}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-pink-700 text-lg text-center bg-pink-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
