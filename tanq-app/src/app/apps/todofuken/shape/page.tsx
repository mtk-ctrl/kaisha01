'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { PREFECTURES, type Prefecture } from '@/data/todofukenData'
import { PREF_PATHS } from '@/data/todofukenPaths'
import { playCorrect, playWrong } from '@/lib/audio'

const PROGRESS_KEY = 'tanq_todofuken_progress_v1'
const Q_PER_ROUND = 10

function loadProgress() {
  if (typeof window === 'undefined') return { shapeMastered: [], capitalMastered: [], famousMastered: [] }
  try { return { shapeMastered: [], capitalMastered: [], famousMastered: [], ...JSON.parse(localStorage.getItem(getDataKey(PROGRESS_KEY)) || '{}') } }
  catch { return { shapeMastered: [], capitalMastered: [], famousMastered: [] } }
}

function saveShapeMastered(prefId: string) {
  if (typeof window === 'undefined') return
  const p = loadProgress()
  if (!p.shapeMastered.includes(prefId)) {
    p.shapeMastered = [...p.shapeMastered, prefId]
    try { localStorage.setItem(getDataKey(PROGRESS_KEY), JSON.stringify(p)) } catch {}
  }
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

interface Question { correct: Prefecture; choices: Prefecture[] }
interface WrongItem { emoji: string; label: string; correct: string; given: string }

// 10問を重複なしで生成
function buildQuestions(): Question[] {
  return shuffle(PREFECTURES).slice(0, Q_PER_ROUND).map(correct => {
    const distractors = shuffle(PREFECTURES.filter(p => p.id !== correct.id)).slice(0, 3)
    return { correct, choices: shuffle([correct, ...distractors]) }
  })
}

type Phase = 'quiz' | 'result'

export default function ShapeQuiz() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions())
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctHistory, setCorrectHistory] = useState<Record<string, number>>({})
  const [wrongAnswers, setWrongAnswers] = useState<WrongItem[]>([])

  function handleSelect(pref: Prefecture) {
    if (selected !== null) return
    const q = questions[qIndex]
    const correct = pref.id === q.correct.id
    setSelected(pref.id)
    setIsCorrect(correct)
    if (correct) {
      playCorrect()
      setScore(s => s + 1)
      setCorrectHistory(prev => {
        const next = { ...prev, [q.correct.id]: (prev[q.correct.id] ?? 0) + 1 }
        if (next[q.correct.id] >= 2) saveShapeMastered(q.correct.id)
        return next
      })
    } else {
      playWrong()
      setWrongAnswers(prev => [...prev, {
        emoji: q.correct.emoji,
        label: 'このかたちは？',
        correct: q.correct.name,
        given: pref.name,
      }])
    }
  }

  function handleNext() {
    if (qIndex + 1 >= Q_PER_ROUND) setPhase('result')
    else { setQIndex(i => i + 1); setSelected(null); setIsCorrect(null) }
  }

  function restart() {
    setQuestions(buildQuestions())
    setQIndex(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setCorrectHistory({})
    setWrongAnswers([])
    setPhase('quiz')
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="font-bold text-gray-800">🗾 かたちクイズ — 結果</h1>
          </div>
        </div>
        <div className="max-w-sm mx-auto px-4 pt-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center mb-4">
            <div className="text-5xl mb-3">{score >= 8 ? '🏆' : score >= 6 ? '⭐' : '🗾'}</div>
            <h2 className="text-2xl font-black text-gray-800 mb-1">{score}/{Q_PER_ROUND} せいかい！</h2>
            <p className="text-sm text-gray-500">
              {score >= 8 ? 'すごい！かたちはかせだ！' : score >= 5 ? 'がんばったね！' : 'もう一度チャレンジしよう！'}
            </p>
          </div>

          {wrongAnswers.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-4 mb-4">
              <p className="text-sm font-bold text-red-500 mb-3">❌ まちがえた問題（{wrongAnswers.length}問）</p>
              <div className="flex flex-col gap-2">
                {wrongAnswers.map((w, i) => (
                  <div key={i} className="bg-red-50 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-xl">{w.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-gray-800 text-sm">正解: {w.correct}</span>
                      <span className="text-xs text-red-400 ml-2">（{w.given} と答えた）</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={restart} className="bg-sky-500 text-white font-bold py-3 rounded-2xl">もう一度</button>
            <Link href="/apps/todofuken" className="bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-center block">メニューへ</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[qIndex]
  if (!q) return null
  const shapePath = PREF_PATHS[q.correct.id]?.shapePath ?? ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 pb-10">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="font-bold text-gray-800 flex-1">🗾 かたちクイズ</h1>
          <span className="text-sm text-gray-500">{qIndex + 1}/{Q_PER_ROUND}</span>
          <span className="text-sm font-bold text-sky-500">⭐ {score}</span>
        </div>
        <div className="h-1.5 bg-gray-100">
          <div className="h-full bg-sky-400 transition-all duration-300" style={{ width: `${(qIndex / Q_PER_ROUND) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <p className="text-center font-bold text-gray-700 mb-4 text-base">この かたちは どこの 都道府県？</p>

        <div className="bg-white rounded-3xl shadow-lg mb-4 flex items-center justify-center mx-auto"
          style={{ width: 240, height: 240 }}>
          <svg viewBox="0 0 300 300" style={{ width: 200, height: 200 }}>
            <path d={shapePath} fill="#93c5fd" stroke="#1e40af" strokeWidth="1.5" fillRule="evenodd" />
          </svg>
        </div>

        {/* 正解/不正解バナー */}
        {isCorrect !== null && (
          <div className={`mb-4 rounded-2xl py-3 px-4 text-center font-black text-lg ${
            isCorrect ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
          }`}>
            {isCorrect ? '⭕ せいかい！' : `❌ ざんねん… 正解は「${q.correct.name}」`}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map(pref => {
            const isCorrectPref = pref.id === q.correct.id
            const isSelectedPref = selected === pref.id
            let cls = 'bg-white border-2 border-gray-200'
            if (selected !== null) {
              if (isCorrectPref)     cls = 'bg-green-100 border-2 border-green-500'
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

        {selected !== null && (
          <button onClick={handleNext}
            className="mt-5 w-full bg-sky-500 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 transition-all">
            {qIndex + 1 >= Q_PER_ROUND ? '結果を見る 🏆' : 'つぎへ →'}
          </button>
        )}
      </div>
    </div>
  )
}
