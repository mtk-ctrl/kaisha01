'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { STORAGE_KEYS } from '@/lib/storageKeys'

const ROWS = [
  { id: 'a',  name: 'あ行', items: [
    { hira: 'あ', roman: 'a' }, { hira: 'い', roman: 'i' }, { hira: 'う', roman: 'u' },
    { hira: 'え', roman: 'e' }, { hira: 'お', roman: 'o' },
  ]},
  { id: 'ka', name: 'か行', items: [
    { hira: 'か', roman: 'ka' }, { hira: 'き', roman: 'ki' }, { hira: 'く', roman: 'ku' },
    { hira: 'け', roman: 'ke' }, { hira: 'こ', roman: 'ko' },
  ]},
  { id: 'sa', name: 'さ行', items: [
    { hira: 'さ', roman: 'sa' }, { hira: 'し', roman: 'shi' }, { hira: 'す', roman: 'su' },
    { hira: 'せ', roman: 'se' }, { hira: 'そ', roman: 'so' },
  ]},
  { id: 'ta', name: 'た行', items: [
    { hira: 'た', roman: 'ta' }, { hira: 'ち', roman: 'chi' }, { hira: 'つ', roman: 'tsu' },
    { hira: 'て', roman: 'te' }, { hira: 'と', roman: 'to' },
  ]},
  { id: 'na', name: 'な行', items: [
    { hira: 'な', roman: 'na' }, { hira: 'に', roman: 'ni' }, { hira: 'ぬ', roman: 'nu' },
    { hira: 'ね', roman: 'ne' }, { hira: 'の', roman: 'no' },
  ]},
  { id: 'ha', name: 'は行', items: [
    { hira: 'は', roman: 'ha' }, { hira: 'ひ', roman: 'hi' }, { hira: 'ふ', roman: 'fu' },
    { hira: 'へ', roman: 'he' }, { hira: 'ほ', roman: 'ho' },
  ]},
  { id: 'ma', name: 'ま行', items: [
    { hira: 'ま', roman: 'ma' }, { hira: 'み', roman: 'mi' }, { hira: 'む', roman: 'mu' },
    { hira: 'め', roman: 'me' }, { hira: 'も', roman: 'mo' },
  ]},
  { id: 'ya', name: 'や行', items: [
    { hira: 'や', roman: 'ya' }, { hira: 'ゆ', roman: 'yu' }, { hira: 'よ', roman: 'yo' },
  ]},
  { id: 'ra', name: 'ら行', items: [
    { hira: 'ら', roman: 'ra' }, { hira: 'り', roman: 'ri' }, { hira: 'る', roman: 'ru' },
    { hira: 'れ', roman: 're' }, { hira: 'ろ', roman: 'ro' },
  ]},
  { id: 'wa', name: 'わ行', items: [
    { hira: 'わ', roman: 'wa' }, { hira: 'ん', roman: 'n' },
  ]},
]

const ALL_ITEMS = ROWS.flatMap(r => r.items)
const ALL_ROMAN = ALL_ITEMS.map(i => i.roman)
const ALL_HIRA  = ALL_ITEMS.map(i => i.hira)

type GameMode = 'hira2roman' | 'roman2hira'
type CaseMode = 'lower' | 'upper'
type Phase    = 'menu' | 'game' | 'result'

interface Question {
  hira: string
  roman: string
  choices: string[]
  mode: GameMode
}

interface LogEntry {
  q: Question
  correct: string
  chosen: string
  ok: boolean
}

interface RomajiRecord {
  mode: GameMode; caseMode: CaseMode; row: string; count: number
  correct: number; score: number; stars: number; maxCombo: number; date: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function applyCase(s: string, caseMode: CaseMode): string {
  return caseMode === 'upper' ? s.toUpperCase() : s
}

function buildQuestions(mode: GameMode, caseMode: CaseMode, row: string, count: number): Question[] {
  let pool = row === 'all' ? ALL_ITEMS : (ROWS.find(r => r.id === row)?.items ?? ALL_ITEMS)

  let src: typeof pool = []
  while (src.length < count) src = src.concat(shuffle([...pool]))
  src = src.slice(0, count)

  return src.map(item => {
    let choices: string[]
    if (mode === 'hira2roman') {
      const correct = applyCase(item.roman, caseMode)
      const distractors = shuffle(ALL_ROMAN.filter(r => r !== item.roman))
        .slice(0, 3)
        .map(r => applyCase(r, caseMode))
      choices = shuffle([correct, ...distractors])
    } else {
      const correct = item.hira
      const distractors = shuffle(ALL_HIRA.filter(h => h !== item.hira)).slice(0, 3)
      choices = shuffle([correct, ...distractors])
    }
    return { hira: item.hira, roman: item.roman, choices, mode }
  })
}

function getCorrect(q: Question, caseMode: CaseMode): string {
  return q.mode === 'roman2hira' ? q.hira : applyCase(q.roman, caseMode)
}

function saveRecord(data: Omit<RomajiRecord, 'date'>) {
  try {
    const key = getDataKey(STORAGE_KEYS.ROMAJI_RECORDS)
    const records: RomajiRecord[] = JSON.parse(localStorage.getItem(key) || '[]')
    records.unshift({ ...data, date: new Date().toLocaleDateString('ja-JP') })
    localStorage.setItem(key, JSON.stringify(records.slice(0, 30)))
  } catch {}
}

const MODE_LABEL: Record<GameMode, string> = {
  hira2roman: 'ひら→ローマじ',
  roman2hira: 'ローマじ→ひら',
}

export default function RomajiPage() {
  const [phase,    setPhase]    = useState<Phase>('menu')
  const [mode,     setMode]     = useState<GameMode>('hira2roman')
  const [caseMode, setCaseMode] = useState<CaseMode>('lower')
  const [row,      setRow]      = useState<string>('all')
  const [count,    setCount]    = useState<number>(10)

  const [questions,    setQuestions]    = useState<Question[]>([])
  const [idx,          setIdx]          = useState(0)
  const [score,        setScore]        = useState(0)
  const [combo,        setCombo]        = useState(0)
  const [maxCombo,     setMaxCombo]     = useState(0)
  const [log,          setLog]          = useState<LogEntry[]>([])
  const [chosen,       setChosen]       = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const startGame = useCallback(() => {
    const qs = buildQuestions(mode, caseMode, row, count)
    setQuestions(qs); setIdx(0); setScore(0); setCombo(0); setMaxCombo(0)
    setLog([]); setChosen(null); setShowFeedback(false); setPhase('game')
  }, [mode, caseMode, row, count])

  const handleAnswer = useCallback((c: string) => {
    if (chosen !== null) return
    const q = questions[idx]
    const correct = getCorrect(q, caseMode)
    const ok = c === correct

    setChosen(c); setShowFeedback(true)

    let newCombo = combo, newMaxCombo = maxCombo, newScore = score
    if (ok) {
      newCombo = combo + 1
      if (newCombo > maxCombo) newMaxCombo = newCombo
      newScore = score + 100 + Math.min(newCombo - 1, 5) * 20
      setCombo(newCombo); setMaxCombo(newMaxCombo); setScore(newScore)
    } else {
      setCombo(0)
    }
    setLog(prev => [...prev, { q, correct, chosen: c, ok }])
  }, [chosen, questions, idx, combo, maxCombo, score, caseMode])

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= questions.length) {
      const total = questions.length
      const correctCount = log.filter(l => l.ok).length
      const pct = correctCount / total
      const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1
      saveRecord({ mode, caseMode, row, count: total, correct: correctCount, score, stars, maxCombo })
      saveScore('romaji', correctCount, total, mode)
      setPhase('result')
    } else {
      setIdx(nextIdx); setChosen(null); setShowFeedback(false)
    }
  }, [idx, questions, log, mode, caseMode, row, score, maxCombo])

  // ── MENU ────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🔤 ローマじ れんしゅう</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">

          {/* モード */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの しゅるい</p>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'hira2roman', label: 'ひら→ローマじ' },
                { id: 'roman2hira', label: 'ローマじ→ひら' },
              ] as { id: GameMode; label: string }[]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === m.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 大文字・小文字 */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">
              もじの しゅるい
              <span className="ml-2 text-xs text-gray-400 font-normal">
                {caseMode === 'lower' ? '→ a, ka, shi …' : '→ A, KA, SHI …'}
              </span>
            </p>
            <div className="flex gap-2">
              {([
                { id: 'lower', label: '小文字（a）' },
                { id: 'upper', label: '大文字（A）' },
              ] as { id: CaseMode; label: string }[]).map(c => (
                <button
                  key={c.id}
                  onClick={() => setCaseMode(c.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${caseMode === c.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 行えらび */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">れんしゅうする行</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRow('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${row === 'all' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}
              >
                ぜんぶ
              </button>
              {ROWS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRow(r.id)}
                  className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${row === r.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* 問題数 */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 10, 15].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${count === n ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  // ── GAME ────────────────────────────────────────────────
  if (phase === 'game') {
    const q = questions[idx]
    const total = questions.length
    const correct = getCorrect(q, caseMode)
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen pb-20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setPhase('menu')} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{idx + 1} / {total}</span>
                <span>スコア: {score}</span>
                {combo >= 2 && <span className="text-orange-500 font-black">🔥 {combo}れんぞく</span>}
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            {q.mode === 'hira2roman' ? (
              <>
                <div className="text-6xl font-black text-blue-700 mb-3">{q.hira}</div>
                <p className="text-sm text-gray-500">この ひらがなを ローマじで かくと？</p>
              </>
            ) : (
              <>
                <div
                  className="text-5xl font-black mb-3"
                  style={{ fontFamily: 'monospace', color: '#4338ca', letterSpacing: '0.05em' }}
                >
                  {applyCase(q.roman, caseMode)}
                </div>
                <p className="text-sm text-gray-500">この ローマじは どの ひらがな？</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((c, i) => {
              let cls = 'w-full py-4 rounded-2xl font-black transition-all '
              const isRoman = q.mode === 'hira2roman'
              if (chosen === null) {
                cls += `${isRoman ? 'text-lg' : 'text-2xl'} bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg`
              } else if (c === correct) {
                cls += `${isRoman ? 'text-lg' : 'text-2xl'} bg-green-100 text-green-700 border-2 border-green-400`
              } else if (c === chosen && c !== correct) {
                cls += `${isRoman ? 'text-lg' : 'text-2xl'} bg-red-100 text-red-600 border-2 border-red-400`
              } else {
                cls += `${isRoman ? 'text-lg' : 'text-2xl'} bg-gray-100 text-gray-400`
              }
              return (
                <button
                  key={i}
                  className={cls}
                  style={isRoman ? { fontFamily: 'monospace' } : undefined}
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
              {q.mode === 'hira2roman' ? (
                <p className="text-sm font-bold text-gray-700">
                  「{q.hira}」→{' '}
                  <span className="text-green-600" style={{ fontFamily: 'monospace' }}>{correct}</span>
                </p>
              ) : (
                <p className="text-sm font-bold text-gray-700">
                  <span style={{ fontFamily: 'monospace' }}>{applyCase(q.roman, caseMode)}</span>
                  {' '}→ <span className="text-green-600">「{q.hira}」</span>
                </p>
              )}
              {combo >= 3 && chosen === correct && (
                <p className="text-orange-500 font-black mt-1">🔥 {combo}れんぞく！！</p>
              )}
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────
  const correctCount = log.filter(l => l.ok).length
  const total = questions.length
  const pct = correctCount / total
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1
  const emoji = stars === 3 ? '🎉' : stars === 2 ? '😄' : '😊'
  const title = stars === 3 ? 'かんぺき！すごい！！' : stars === 2 ? 'よくできました！' : 'またれんしゅうしよう！'

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🔤 けっか</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-black text-blue-600">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div>
              <div className="text-3xl font-black text-indigo-500">{score}</div>
              <div className="text-xs text-gray-500">てん</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500">{maxCombo}</div>
              <div className="text-xs text-gray-500">コンボ</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {MODE_LABEL[mode]} | {caseMode === 'lower' ? '小文字' : '大文字'} | {row === 'all' ? 'ぜんぶ' : ROWS.find(r => r.id === row)?.name ?? row} | {total}もん
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => {
            const qLabel = l.q.mode === 'hira2roman'
              ? `${l.q.hira} →？`
              : `${applyCase(l.q.roman, caseMode)} →？`
            return (
              <div key={i} className={`flex items-center gap-2 text-sm p-2 rounded-xl ${l.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                <span>{l.ok ? '⭕' : '❌'}</span>
                <span className="flex-1 text-gray-700">{qLabel}</span>
                <span className={`font-bold ${l.ok ? 'text-green-600' : 'text-red-500'}`} style={{ fontFamily: l.q.mode === 'roman2hira' ? undefined : 'monospace' }}>
                  {l.correct}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-blue-700 text-lg text-center bg-blue-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
