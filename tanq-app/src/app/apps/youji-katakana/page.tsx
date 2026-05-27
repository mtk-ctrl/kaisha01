'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { STORAGE_KEYS } from '@/lib/storageKeys'

const ROWS = [
  { id: 'ア', name: 'ア行', kana: [
    { hira:'あ', kata:'ア' }, { hira:'い', kata:'イ' }, { hira:'う', kata:'ウ' },
    { hira:'え', kata:'エ' }, { hira:'お', kata:'オ' }
  ]},
  { id: 'カ', name: 'カ行', kana: [
    { hira:'か', kata:'カ' }, { hira:'き', kata:'キ' }, { hira:'く', kata:'ク' },
    { hira:'け', kata:'ケ' }, { hira:'こ', kata:'コ' }
  ]},
  { id: 'サ', name: 'サ行', kana: [
    { hira:'さ', kata:'サ' }, { hira:'し', kata:'シ' }, { hira:'す', kata:'ス' },
    { hira:'せ', kata:'セ' }, { hira:'そ', kata:'ソ' }
  ]},
  { id: 'タ', name: 'タ行', kana: [
    { hira:'た', kata:'タ' }, { hira:'ち', kata:'チ' }, { hira:'つ', kata:'ツ' },
    { hira:'て', kata:'テ' }, { hira:'と', kata:'ト' }
  ]},
  { id: 'ナ', name: 'ナ行', kana: [
    { hira:'な', kata:'ナ' }, { hira:'に', kata:'ニ' }, { hira:'ぬ', kata:'ヌ' },
    { hira:'ね', kata:'ネ' }, { hira:'の', kata:'ノ' }
  ]},
  { id: 'ハ', name: 'ハ行', kana: [
    { hira:'は', kata:'ハ' }, { hira:'ひ', kata:'ヒ' }, { hira:'ふ', kata:'フ' },
    { hira:'へ', kata:'ヘ' }, { hira:'ほ', kata:'ホ' }
  ]},
  { id: 'マ', name: 'マ行', kana: [
    { hira:'ま', kata:'マ' }, { hira:'み', kata:'ミ' }, { hira:'む', kata:'ム' },
    { hira:'め', kata:'メ' }, { hira:'も', kata:'モ' }
  ]},
  { id: 'ヤ行', name: 'ヤ行', kana: [
    { hira:'や', kata:'ヤ' }, { hira:'ゆ', kata:'ユ' }, { hira:'よ', kata:'ヨ' }
  ]},
  { id: 'ラ', name: 'ラ行', kana: [
    { hira:'ら', kata:'ラ' }, { hira:'り', kata:'リ' }, { hira:'る', kata:'ル' },
    { hira:'れ', kata:'レ' }, { hira:'ろ', kata:'ロ' }
  ]},
  { id: 'ワ', name: 'ワ行', kana: [
    { hira:'わ', kata:'ワ' }, { hira:'ん', kata:'ン' }
  ]},
]

const ALL_KATA = ROWS.flatMap(r => r.kana.map(k => k.kata))
const ALL_HIRA = ROWS.flatMap(r => r.kana.map(k => k.hira))

const WORD_DATA = [
  { kata:'アイスクリーム', hira:'あいすくりーむ', emoji:'🍦' },
  { kata:'アリ',           hira:'あり',          emoji:'🐜' },
  { kata:'イチゴ',         hira:'いちご',         emoji:'🍓' },
  { kata:'ウサギ',         hira:'うさぎ',         emoji:'🐰' },
  { kata:'エビ',           hira:'えび',           emoji:'🦐' },
  { kata:'オレンジ',       hira:'おれんじ',       emoji:'🍊' },
  { kata:'カメラ',         hira:'かめら',         emoji:'📷' },
  { kata:'キリン',         hira:'きりん',         emoji:'🦒' },
  { kata:'クッキー',       hira:'くっきー',       emoji:'🍪' },
  { kata:'ケーキ',         hira:'けーき',         emoji:'🎂' },
  { kata:'コアラ',         hira:'こあら',         emoji:'🐨' },
  { kata:'サッカー',       hira:'さっかー',       emoji:'⚽' },
  { kata:'スイカ',         hira:'すいか',         emoji:'🍉' },
  { kata:'スープ',         hira:'すーぷ',         emoji:'🍲' },
  { kata:'チーズ',         hira:'ちーず',         emoji:'🧀' },
  { kata:'チョコレート',   hira:'ちょこれーと',   emoji:'🍫' },
  { kata:'テレビ',         hira:'てれび',         emoji:'📺' },
  { kata:'トマト',         hira:'とまと',         emoji:'🍅' },
  { kata:'ナイフ',         hira:'ないふ',         emoji:'🔪' },
  { kata:'ノート',         hira:'のーと',         emoji:'📒' },
  { kata:'ハンバーガー',   hira:'はんばーがー',   emoji:'🍔' },
  { kata:'ピザ',           hira:'ぴざ',           emoji:'🍕' },
  { kata:'ピアノ',         hira:'ぴあの',         emoji:'🎹' },
  { kata:'フルーツ',       hira:'ふるーつ',       emoji:'🍎' },
  { kata:'ホットケーキ',   hira:'ほっとけーき',   emoji:'🥞' },
  { kata:'メダル',         hira:'めだる',         emoji:'🏅' },
  { kata:'メロン',         hira:'めろん',         emoji:'🍈' },
  { kata:'ヨーグルト',     hira:'よーぐると',     emoji:'🥛' },
  { kata:'ヨット',         hira:'よっと',         emoji:'⛵' },
  { kata:'ライオン',       hira:'らいおん',       emoji:'🦁' },
  { kata:'ラーメン',       hira:'らーめん',       emoji:'🍜' },
  { kata:'リボン',         hira:'りぼん',         emoji:'🎀' },
  { kata:'リンゴ',         hira:'りんご',         emoji:'🍎' },
  { kata:'レモン',         hira:'れもん',         emoji:'🍋' },
  { kata:'ロボット',       hira:'ろぼっと',       emoji:'🤖' },
  { kata:'ロケット',       hira:'ろけっと',       emoji:'🚀' },
  { kata:'ワニ',           hira:'わに',           emoji:'🐊' },
  { kata:'ワッフル',       hira:'わっふる',       emoji:'🧇' },
]

type GameMode = 'hira2kata' | 'kata2hira' | 'word'

interface KanaItem { hira: string; kata: string }
interface WordItem { kata: string; hira: string; emoji: string }

interface Question {
  type: GameMode
  hira?: string
  kata?: string
  emoji?: string
  choices: string[]
}

interface LogEntry {
  q: Question
  correct: string
  chosen: string
  ok: boolean
}

type Phase = 'menu' | 'game' | 'result'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'; u.rate = 0.88; u.pitch = 1.15
    window.speechSynthesis.speak(u)
  } catch {}
}

function buildQuestions(mode: GameMode, row: string, count: number): Question[] {
  if (mode === 'word') {
    return shuffle([...WORD_DATA]).slice(0, count).map(w => {
      const correct = w.kata
      const others = WORD_DATA.filter(x => x.kata !== correct).map(x => x.kata)
      const distractors = shuffle(others).slice(0, 3)
      return {
        type: 'word' as GameMode,
        kata: w.kata,
        hira: w.hira,
        emoji: w.emoji,
        choices: shuffle([correct, ...distractors]),
      }
    })
  }

  let pool: KanaItem[]
  if (row === 'all') {
    pool = ROWS.flatMap(r => r.kana)
  } else {
    const found = ROWS.find(r => r.id === row)
    pool = found ? [...found.kana] : ROWS.flatMap(r => r.kana)
  }

  let q: KanaItem[] = []
  while (q.length < count) {
    q = q.concat(shuffle([...pool]))
  }
  q = q.slice(0, count)

  return q.map(item => {
    let choices: string[]
    if (mode === 'hira2kata') {
      const correct = item.kata
      const distractors = shuffle(ALL_KATA.filter(k => k !== correct)).slice(0, 3)
      choices = shuffle([correct, ...distractors])
    } else {
      const correct = item.hira
      const distractors = shuffle(ALL_HIRA.filter(h => h !== correct)).slice(0, 3)
      choices = shuffle([correct, ...distractors])
    }
    return { type: mode, hira: item.hira, kata: item.kata, choices }
  })
}

function getCorrect(q: Question): string {
  return q.type === 'kata2hira' ? (q.hira ?? '') : (q.kata ?? '')
}

interface KatakanaRecord {
  mode: GameMode; row: string; count: number; correct: number
  score: number; stars: number; maxCombo: number; date: string
}

function saveRecord(data: Omit<KatakanaRecord, 'date'>) {
  try {
    const key = getDataKey(STORAGE_KEYS.KATAKANA_RECORDS)
    const records: KatakanaRecord[] = JSON.parse(localStorage.getItem(key) || '[]')
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') })
    localStorage.setItem(key, JSON.stringify(records.slice(0, 30)))
  } catch {}
}

export default function KatakanaPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [mode, setMode] = useState<GameMode>('hira2kata')
  const [row, setRow] = useState<string>('all')
  const [count, setCount] = useState<number>(10)

  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])

  const [chosen, setChosen] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const startGame = useCallback(() => {
    const qs = buildQuestions(mode, row, count)
    setQuestions(qs)
    setIdx(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setLog([])
    setChosen(null)
    setShowFeedback(false)
    setPhase('game')
    const q = qs[0]
    if (q) {
      if (q.type === 'word') speak(q.hira ?? '')
      else if (q.type === 'hira2kata') speak(q.hira ?? '')
      else speak(q.kata ?? '')
    }
  }, [mode, row, count])

  const handleAnswer = useCallback((c: string) => {
    if (chosen !== null) return
    const q = questions[idx]
    const correct = getCorrect(q)
    const ok = c === correct

    setChosen(c)
    setShowFeedback(true)

    let newCombo = combo
    let newMaxCombo = maxCombo
    let newScore = score
    if (ok) {
      newCombo = combo + 1
      if (newCombo > maxCombo) newMaxCombo = newCombo
      const base = 100
      const comboBonus = Math.min(newCombo - 1, 5) * 20
      newScore = score + base + comboBonus
      setCombo(newCombo)
      setMaxCombo(newMaxCombo)
      setScore(newScore)
      speak(newCombo >= 3 ? 'すごい！' + newCombo + 'れんぞく！' : 'せいかい！')
    } else {
      setCombo(0)
      newCombo = 0
      speak('ざんねん。せいかいは ' + correct)
    }

    setLog(prev => [...prev, { q, correct, chosen: c, ok }])
  }, [chosen, questions, idx, combo, maxCombo, score])

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= questions.length) {
      const total = questions.length
      const correctCount = log.filter(l => l.ok).length
      const pct = correctCount / total
      let stars = 1
      if (pct >= 0.9) stars = 3
      else if (pct >= 0.7) stars = 2

      saveRecord({ mode, row, count: total, correct: correctCount, score, stars, maxCombo })
      saveScore('youji-katakana', correctCount, total, mode)

      speak(stars === 3 ? 'かんぺき！すごいね！' : stars === 2 ? 'よくできました！' : 'またれんしゅうしよう！')
      setPhase('result')
    } else {
      setIdx(nextIdx)
      setChosen(null)
      setShowFeedback(false)
      const q = questions[nextIdx]
      if (q.type === 'word') speak(q.hira ?? '')
      else if (q.type === 'hira2kata') speak(q.hira ?? '')
      else speak(q.kata ?? '')
    }
  }, [idx, questions, log, mode, row, score, maxCombo])

  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-purple-50 to-pink-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🔡 カタカナ れんしゅう</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの しゅるい</p>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'hira2kata', label: 'ひら→カタ' },
                { id: 'kata2hira', label: 'カタ→よみ' },
                { id: 'word',      label: 'えことば' },
              ] as { id: GameMode; label: string }[]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === m.id ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode !== 'word' && (
            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-sm font-bold text-gray-600 mb-3">れんしゅうする行</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setRow('all')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${row === 'all' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}
                >
                  ぜんぶ
                </button>
                {ROWS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRow(r.id)}
                    className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${row === r.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 10, 15].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${count === n ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'}`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'game') {
    const q = questions[idx]
    const total = questions.length
    const correct = getCorrect(q)
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-purple-50 to-pink-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                speak('')
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
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            {q.type === 'word' ? (
              <>
                <div className="text-7xl mb-3">{q.emoji}</div>
                <p className="text-sm text-gray-500 mb-1">この えを カタカナで かくと？</p>
                <p className="text-xs text-gray-400">（ひらがな：{q.hira}）</p>
              </>
            ) : q.type === 'hira2kata' ? (
              <>
                <div className="text-6xl font-black text-purple-700 mb-3">{q.hira}</div>
                <p className="text-sm text-gray-500">この もじを カタカナに すると？</p>
              </>
            ) : (
              <>
                <div className="text-6xl font-black text-pink-600 mb-3">{q.kata}</div>
                <p className="text-sm text-gray-500">この カタカナの よみかたは？</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((c, i) => {
              let btnClass = 'w-full py-4 rounded-2xl text-xl font-black transition-all '
              if (chosen === null) {
                btnClass += 'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
              } else if (c === correct) {
                btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
              } else if (c === chosen && c !== correct) {
                btnClass += 'bg-red-100 text-red-600 border-2 border-red-400'
              } else {
                btnClass += 'bg-gray-100 text-gray-400'
              }
              return (
                <button
                  key={i}
                  className={btnClass}
                  onClick={() => handleAnswer(c)}
                  disabled={chosen !== null}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {showFeedback && chosen !== null && (
            <div className={`rounded-2xl p-4 text-center ${chosen === correct ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-3xl mb-1">{chosen === correct ? '⭕' : '❌'}</div>
              {q.type === 'word' && (
                <p className="text-sm font-bold text-gray-700">
                  {chosen === correct ? 'せいかい！' : '【せいかい】'}{q.emoji} ＝ <span className="text-green-600">{correct}</span>
                </p>
              )}
              {q.type === 'hira2kata' && (
                <p className="text-sm font-bold text-gray-700">
                  「{q.hira}」→ <span className="text-green-600">「{correct}」</span>
                </p>
              )}
              {q.type === 'kata2hira' && (
                <p className="text-sm font-bold text-gray-700">
                  「{q.kata}」＝ <span className="text-green-600">「{correct}」</span>
                </p>
              )}
              {combo >= 3 && chosen === correct && (
                <p className="text-orange-500 font-black mt-1">🔥 {combo}れんぞく！！</p>
              )}
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // result phase
  const correctCount = log.filter(l => l.ok).length
  const total = questions.length
  const pct = correctCount / total
  let stars = 1
  if (pct >= 0.9) stars = 3
  else if (pct >= 0.7) stars = 2
  let emoji = '😊', title = 'またれんしゅうしよう！'
  if (stars === 3) { emoji = '🎉'; title = 'かんぺき！すごい！！' }
  else if (stars === 2) { emoji = '😄'; title = 'よくできました！' }

  const modeLabel: Record<GameMode, string> = { hira2kata: 'ひら→カタ', kata2hira: 'カタ→よみ', word: 'えことば' }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-pink-50 min-h-screen pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🔡 けっか</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-black text-purple-600">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div>
              <div className="text-3xl font-black text-pink-500">{score}</div>
              <div className="text-xs text-gray-500">てん</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500">{maxCombo}</div>
              <div className="text-xs text-gray-500">コンボ</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{modeLabel[mode]} | {row === 'all' ? 'ぜんぶ' : row + '行'} | {total}もん</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => {
            let qStr = '', aStr = ''
            if (l.q.type === 'word') { qStr = (l.q.emoji ?? '') + ' ' + (l.q.hira ?? ''); aStr = l.correct }
            else if (l.q.type === 'hira2kata') { qStr = (l.q.hira ?? '') + '→?'; aStr = l.correct }
            else { qStr = (l.q.kata ?? '') + '→?'; aStr = l.correct }
            return (
              <div key={i} className={`flex items-center gap-2 text-sm p-2 rounded-xl ${l.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                <span>{l.ok ? '⭕' : '❌'}</span>
                <span className="flex-1 text-gray-700">{qStr}</span>
                <span className={`font-bold ${l.ok ? 'text-green-600' : 'text-red-500'}`}>{aStr}</span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-purple-700 text-lg text-center bg-purple-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
