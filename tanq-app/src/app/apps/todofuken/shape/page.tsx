'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { PREFECTURES, type Prefecture } from '@/data/todofukenData'
import { PREF_PATHS } from '@/data/todofukenPaths'
import { playCorrect, playWrong } from '@/lib/audio'

const PROGRESS_KEY = 'tanq_todofuken_progress_v1'
const Q_PER_ROUND = 10

type TodofukenProgress = { shapeMastered: string[]; capitalMastered: string[]; famousMastered: string[] }

function loadProgress(): TodofukenProgress {
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

function makeQuestion(): Question {
  const correct = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)]
  const distractors = shuffle(PREFECTURES.filter(p => p.id !== correct.id)).slice(0, 3)
  return { correct, choices: shuffle([correct, ...distractors]) }
}

type Phase = 'quiz' | 'result'

export default function ShapeQuiz() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<Question | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [correctHistory, setCorrectHistory] = useState<Record<string, number>>({})

  const nextQ = useCallback(() => {
    setQuestion(makeQuestion())
    setSelected(null)
  }, [])

  useEffect(() => { nextQ() }, [nextQ])

  function handleSelect(pref: Prefecture) {
    if (selected !== null || !question) return
    setSelected(pref.id)
    const isCorrect = pref.id === question.correct.id
    if (isCorrect) {
      playCorrect()
      setScore(s => s + 1)
      setCorrectHistory(prev => {
        const next = { ...prev, [question.correct.id]: (prev[question.correct.id] ?? 0) + 1 }
        if (next[question.correct.id] >= 2) saveShapeMastered(question.correct.id)
        return next
      })
    } else {
      playWrong()
    }
    setTimeout(() => {
      if (qIndex + 1 >= Q_PER_ROUND) {
        setPhase('result')
      } else {
        setQIndex(i => i + 1)
        nextQ()
      }
    }, 1200)
  }

  function restart() {
    setPhase('quiz')
    setQIndex(0)
    setScore(0)
    setSelected(null)
    nextQ()
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-3">{score >= 8 ? '🏆' : score >= 6 ? '⭐' : '🗾'}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">{score}/{Q_PER_ROUND} せいかい！</h2>
          <p className="text-sm text-gray-500 mb-6">
            {score >= 8 ? 'すごい！かたちはかせだ！' : score >= 5 ? 'がんばったね！' : 'もう一度チャレンジしよう！'}
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={restart} className="bg-sky-500 text-white font-bold py-3 rounded-2xl">もう一度</button>
            <Link href="/apps/todofuken" className="bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-center block">メニューへ</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null
  const shapePath = PREF_PATHS[question.correct.id]?.shapePath ?? ''

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

        {/* Shape */}
        <div className="bg-white rounded-3xl shadow-lg mb-6 flex items-center justify-center mx-auto"
          style={{ width: 240, height: 240 }}>
          <svg viewBox="0 0 300 300" style={{ width: 200, height: 200 }}>
            <path d={shapePath} fill="#93c5fd" stroke="#1e40af" strokeWidth="1.5" fillRule="evenodd" />
          </svg>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3">
          {question.choices.map(pref => {
            const isCorrectPref = pref.id === question.correct.id
            const isSelected = selected === pref.id
            let cls = 'bg-white border-2 border-gray-200'
            if (selected !== null) {
              if (isCorrectPref)    cls = 'bg-green-100 border-2 border-green-500'
              else if (isSelected)  cls = 'bg-red-100 border-2 border-red-400'
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

        {selected !== null && selected !== question.correct.id && (
          <div className="mt-4 bg-sky-50 border border-sky-200 rounded-2xl p-3 text-center">
            <p className="text-sm text-sky-700 font-medium">
              正解は <span className="font-black">{question.correct.name}（{question.correct.kana}）</span>！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
