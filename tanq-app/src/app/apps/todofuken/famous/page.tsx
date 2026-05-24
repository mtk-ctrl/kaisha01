'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { PREFECTURES, type Prefecture, type FamousItem } from '@/data/todofukenData'
import { playCorrect, playWrong } from '@/lib/audio'

const PROGRESS_KEY = 'tanq_todofuken_progress_v1'
const Q_PER_ROUND = 10

type Difficulty = 1 | 2 | 3
type Phase = 'menu' | 'quiz' | 'result'

function loadProgress() {
  if (typeof window === 'undefined') return { shapeMastered: [], capitalMastered: [], famousMastered: [] }
  try { return { shapeMastered: [], capitalMastered: [], famousMastered: [], ...JSON.parse(localStorage.getItem(getDataKey(PROGRESS_KEY)) || '{}') } }
  catch { return { shapeMastered: [], capitalMastered: [], famousMastered: [] } }
}

function saveFamousMastered(prefId: string) {
  if (typeof window === 'undefined') return
  const p = loadProgress()
  if (!p.famousMastered.includes(prefId)) {
    p.famousMastered = [...p.famousMastered, prefId]
    try { localStorage.setItem(getDataKey(PROGRESS_KEY), JSON.stringify(p)) } catch {}
  }
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

interface Question { pref: Prefecture; item: FamousItem; choices: Prefecture[] }
interface WrongItem { emoji: string; label: string; correct: string; given: string }

function buildQuestions(difficulty: Difficulty): Question[] {
  const pairs: { pref: Prefecture; item: FamousItem }[] = []
  for (const pref of PREFECTURES) {
    for (const item of pref.famous) {
      if (item.difficulty === difficulty) pairs.push({ pref, item })
    }
  }
  if (pairs.length === 0) return []
  return shuffle(pairs).slice(0, Q_PER_ROUND).map(({ pref, item }) => {
    const distractors = shuffle(PREFECTURES.filter(p => p.id !== pref.id)).slice(0, 3)
    return { pref, item, choices: shuffle([pref, ...distractors]) }
  })
}

const DIFF_CONFIG: Record<Difficulty, { label: string; desc: string; emoji: string; color: string }> = {
  1: { label: 'かんたん',     desc: '名物・特産品',          emoji: '🍱', color: '#4ade80' },
  2: { label: 'ふつう',       desc: '日本一・地形・産業',    emoji: '🏔️', color: '#f59e0b' },
  3: { label: 'むずかしい',   desc: '中学受験レベル',        emoji: '📝', color: '#f87171' },
}

export default function FamousQuiz() {
  const [phase, setPhase]   = useState<Phase>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>(1)
  const [questions, setQuestions]   = useState<Question[]>([])
  const [qIndex, setQIndex]   = useState(0)
  const [score, setScore]     = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctHistory, setCorrectHistory] = useState<Record<string, number>>({})
  const [wrongAnswers, setWrongAnswers] = useState<WrongItem[]>([])

  function startQuiz(diff: Difficulty) {
    const qs = buildQuestions(diff)
    if (qs.length === 0) return
    setDifficulty(diff)
    setQuestions(qs)
    setQIndex(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setCorrectHistory({})
    setWrongAnswers([])
    setPhase('quiz')
  }

  function handleSelect(pref: Prefecture) {
    if (selected !== null) return
    const q = questions[qIndex]
    setSelected(pref.id)
    const correct = pref.id === q.pref.id
    setIsCorrect(correct)
    if (correct) {
      playCorrect()
      setScore(s => s + 1)
      setCorrectHistory(prev => {
        const next = { ...prev, [q.pref.id]: (prev[q.pref.id] ?? 0) + 1 }
        if (next[q.pref.id] >= 2) saveFamousMastered(q.pref.id)
        return next
      })
    } else {
      playWrong()
      setWrongAnswers(prev => [...prev, {
        emoji: q.item.emoji,
        label: q.item.name,
        correct: q.pref.name,
        given: pref.name,
      }])
    }
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) setPhase('result')
    else { setQIndex(i => i + 1); setSelected(null); setIsCorrect(null) }
  }

  if (phase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="font-bold text-gray-800">🍱 めいぶつクイズ</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pt-6">
          <p className="text-center text-gray-500 text-sm mb-6">難易度を えらんでね</p>
          <div className="flex flex-col gap-4">
            {([1, 2, 3] as Difficulty[]).map(diff => {
              const c = DIFF_CONFIG[diff]
              const available = buildQuestions(diff).length > 0
              return (
                <button key={diff} onClick={() => available && startQuiz(diff)}
                  disabled={!available}
                  className={`rounded-2xl shadow p-5 flex items-center gap-4 transition-all text-left ${
                    available ? 'bg-white active:scale-95' : 'bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}>
                  <div className="text-3xl w-10 text-center">{c.emoji}</div>
                  <div>
                    <div className="font-bold text-gray-800">{c.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                    {!available && <div className="text-xs text-gray-400 mt-1">🔧 データ準備中</div>}
                  </div>
                  <div className="ml-auto text-gray-400">{available ? '→' : '🔒'}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const total = questions.length
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="font-bold text-gray-800">🍱 めいぶつクイズ — 結果</h1>
          </div>
        </div>
        <div className="max-w-sm mx-auto px-4 pt-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center mb-4">
            <div className="text-5xl mb-3">{score >= total * 0.8 ? '🏆' : score >= total * 0.6 ? '⭐' : '🍱'}</div>
            <h2 className="text-2xl font-black text-gray-800 mb-1">{score}/{total} せいかい！</h2>
            <p className="text-sm text-gray-500">{score >= total * 0.8 ? 'めいぶつはかせ！' : 'もう一度チャレンジ！'}</p>
          </div>

          {wrongAnswers.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-4 mb-4">
              <p className="text-sm font-bold text-red-500 mb-3">❌ まちがえた問題（{wrongAnswers.length}問）</p>
              <div className="flex flex-col gap-2">
                {wrongAnswers.map((w, i) => (
                  <div key={i} className="bg-red-50 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-xl">{w.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-gray-800 text-sm">{w.label}</span>
                      <span className="text-xs text-gray-500 mx-1">→</span>
                      <span className="font-bold text-green-700 text-sm">{w.correct}</span>
                      <span className="block text-xs text-red-400">（{w.given} と答えた）</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => startQuiz(difficulty)} className="bg-amber-500 text-white font-bold py-3 rounded-2xl">もう一度</button>
            <button onClick={() => setPhase('menu')} className="bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl">難易度を変える</button>
            <Link href="/apps/todofuken" className="text-gray-400 text-sm py-2 block text-center">メニューへ</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[qIndex]
  if (!q) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 pb-10">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="font-bold text-gray-800 flex-1">🍱 {DIFF_CONFIG[difficulty].label}</h1>
          <span className="text-sm text-gray-500">{qIndex + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-amber-500">⭐ {score}</span>
        </div>
        <div className="h-1.5 bg-gray-100">
          <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-2">これは どこの 都道府県の 名物？</p>
          <div className="text-6xl mb-2">{q.item.emoji}</div>
          <p className="text-base font-black text-gray-800 leading-snug break-words">{q.item.name}</p>
        </div>

        {/* 正解/不正解 + 解説パネル */}
        {isCorrect !== null && (
          <div className={`mb-4 rounded-2xl overflow-hidden shadow-sm border-2 ${
            isCorrect ? 'border-green-400' : 'border-red-400'
          }`}>
            <div className={`py-3 px-4 text-center font-black text-lg ${
              isCorrect ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
            }`}>
              {isCorrect ? '⭕ せいかい！' : `❌ ざんねん… 正解は「${q.pref.name}」`}
            </div>
            <div className="bg-amber-50 px-4 py-3">
              <p className="text-xs font-bold text-amber-700 mb-1">💡 おぼえよう！</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {q.item.note || `${q.pref.name}（${q.pref.kana}）は${q.pref.region}地方にある都道府県。${q.item.name}が有名な名物だよ！`}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-base">{q.pref.emoji}</span>
                <span className="text-xs text-gray-500 font-medium">{q.pref.name}（{q.pref.region}地方）</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map(pref => {
            const isCorrectPref = pref.id === q.pref.id
            const isSelectedPref = selected === pref.id
            let cls = 'bg-white border-2 border-gray-200'
            if (selected !== null) {
              if (isCorrectPref)    cls = 'bg-green-100 border-2 border-green-500'
              else if (isSelectedPref) cls = 'bg-red-100 border-2 border-red-400'
            }
            return (
              <button key={pref.id} onClick={() => handleSelect(pref)}
                className={`${cls} rounded-2xl py-4 px-3 font-bold text-gray-800 text-center transition-all active:scale-95 shadow-sm`}>
                {pref.name}
                <span className="block text-xs text-gray-500 font-normal mt-0.5">{pref.kana}</span>
              </button>
            )
          })}
        </div>

        {/* 次へボタン（回答後に表示） */}
        {selected !== null && (
          <button onClick={handleNext}
            className="mt-5 w-full bg-amber-500 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 transition-all">
            {qIndex + 1 >= questions.length ? '結果を見る 🏆' : 'つぎへ →'}
          </button>
        )}
      </div>
    </div>
  )
}
