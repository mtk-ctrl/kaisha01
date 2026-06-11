'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { PREFECTURES, CAPITAL_DIFFERS_PREFS, type Prefecture } from '@/data/todofukenData'
import { playCorrect, playWrong } from '@/lib/audio'
import { saveScore } from '@/lib/scoreApi'

const PROGRESS_KEY = 'tanq_todofuken_progress_v1'
const Q_PER_ROUND = 10

// 東京は「東京市」にならないため除外
const NON_TOKYO = PREFECTURES.filter(p => p.id !== 'tokyo')
const DIFFERS_NON_TOKYO = CAPITAL_DIFFERS_PREFS.filter(p => p.id !== 'tokyo')

type Mode = 'menu' | 'quiz' | 'result'
type QuizMode = 'differs' | 'all'

function loadProgress() {
  if (typeof window === 'undefined') return { shapeMastered: [], capitalMastered: [], famousMastered: [] }
  try { return { shapeMastered: [], capitalMastered: [], famousMastered: [], ...JSON.parse(localStorage.getItem(getDataKey(PROGRESS_KEY)) || '{}') } }
  catch { return { shapeMastered: [], capitalMastered: [], famousMastered: [] } }
}

function saveCapitalMastered(prefId: string) {
  if (typeof window === 'undefined') return
  const p = loadProgress()
  if (!p.capitalMastered.includes(prefId)) {
    p.capitalMastered = [...p.capitalMastered, prefId]
    try { localStorage.setItem(getDataKey(PROGRESS_KEY), JSON.stringify(p)) } catch {}
  }
}

// Fisher-Yates（sort(random)は偏るため使わない）
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface ChoiceInfo { capital: string; kana: string }
interface Question { pref: Prefecture; choices: ChoiceInfo[] }
interface WrongItem { emoji: string; label: string; correct: string; given: string }

function buildQuestions(mode: QuizMode): Question[] {
  const pool = mode === 'differs' ? DIFFERS_NON_TOKYO : NON_TOKYO
  return shuffle(pool).slice(0, Q_PER_ROUND).map(pref => {
    const wrong = shuffle(
      NON_TOKYO.filter(p => p.id !== pref.id).map(p => ({ capital: p.capital, kana: p.capitalKana }))
    ).slice(0, 3)
    const correct: ChoiceInfo = { capital: pref.capital, kana: pref.capitalKana }
    return { pref, choices: shuffle([correct, ...wrong]) }
  })
}

export default function CapitalQuiz() {
  const [mode, setMode]       = useState<Mode>('menu')
  const [quizMode, setQuizMode] = useState<QuizMode>('differs')
  const [questions, setQuestions] = useState<Question[]>([])
  const [qIndex, setQIndex]   = useState(0)
  const [score, setScore]     = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctHistory, setCorrectHistory] = useState<Record<string, number>>({})
  const [wrongAnswers, setWrongAnswers] = useState<WrongItem[]>([])
  // 0=1回目, 1=ヒントを見て再挑戦中（スコア・マスター記録は1回目のみ）
  const [attempt, setAttempt] = useState<0 | 1>(0)
  const [firstWrong, setFirstWrong] = useState<string | null>(null)

  function startQuiz(qm: QuizMode) {
    setQuizMode(qm)
    setQuestions(buildQuestions(qm))
    setQIndex(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setCorrectHistory({})
    setWrongAnswers([])
    setAttempt(0)
    setFirstWrong(null)
    setMode('quiz')
  }

  function handleSelect(capital: string) {
    if (selected !== null) return
    if (capital === firstWrong) return
    const q = questions[qIndex]
    const correct = capital === q.pref.capital
    if (correct) {
      playCorrect()
      setSelected(capital)
      setIsCorrect(true)
      if (attempt === 0) {
        setScore(s => s + 1)
        setCorrectHistory(prev => {
          const next = { ...prev, [q.pref.id]: (prev[q.pref.id] ?? 0) + 1 }
          if (next[q.pref.id] >= 2) saveCapitalMastered(q.pref.id)
          return next
        })
      }
      return
    }
    playWrong()
    if (attempt === 0) {
      // 1回目のまちがい: 答えは見せず、頭文字ヒントで再挑戦してもらう
      setAttempt(1)
      setFirstWrong(capital)
      setWrongAnswers(prev => [...prev, {
        emoji: q.pref.emoji,
        label: q.pref.name,
        correct: `${q.pref.capital}市`,
        given: `${capital}市`,
      }])
      return
    }
    // 2回目: 答え合わせと解説を見せる
    setSelected(capital)
    setIsCorrect(false)
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) {
      saveScore('todofuken-capital', score, questions.length, quizMode)
      setMode('result')
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
      setIsCorrect(null)
      setAttempt(0)
      setFirstWrong(null)
    }
  }

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="font-bold text-gray-800">🏛️ 県庁所在地チャレンジ</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pt-6">
          <p className="text-center text-gray-500 text-sm mb-6">モードを えらんでね</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => startQuiz('differs')}
              className="bg-white rounded-2xl shadow p-5 flex items-center gap-4 active:scale-95 transition-all text-left">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="font-bold text-gray-800">まぎらわしい {DIFFERS_NON_TOKYO.length} 県</div>
                <div className="text-xs text-gray-500 mt-0.5">県名と県庁所在地が ちがう県だけ</div>
                <div className="text-xs text-gray-400 mt-1">例: 神奈川→横浜、愛知→名古屋</div>
              </div>
              <div className="ml-auto text-gray-400">→</div>
            </button>
            <button onClick={() => startQuiz('all')}
              className="bg-white rounded-2xl shadow p-5 flex items-center gap-4 active:scale-95 transition-all text-left">
              <div className="text-3xl">🗾</div>
              <div>
                <div className="font-bold text-gray-800">全 {NON_TOKYO.length} 道府県</div>
                <div className="text-xs text-gray-500 mt-0.5">すべての県庁所在地を確認（東京を除く）</div>
              </div>
              <div className="ml-auto text-gray-400">→</div>
            </button>
          </div>
          <div className="mt-5 bg-purple-50 rounded-2xl p-3">
            <p className="text-xs text-purple-600 text-center leading-relaxed">
              まずは「まぎらわしい{DIFFERS_NON_TOKYO.length}県」を完璧にしよう！<br />
              入試でよく出るポイントだよ 📝
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'result') {
    const total = questions.length
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="font-bold text-gray-800">🏛️ 県庁所在地 — 結果</h1>
          </div>
        </div>
        <div className="max-w-sm mx-auto px-4 pt-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center mb-4">
            <div className="text-5xl mb-3">{score >= total * 0.8 ? '🏆' : score >= total * 0.6 ? '⭐' : '🏛️'}</div>
            <h2 className="text-2xl font-black text-gray-800 mb-1">{score}/{total} せいかい！</h2>
            <p className="text-sm text-gray-500">{score >= total * 0.8 ? '県庁所在地マスター！' : 'もう一度チャレンジ！'}</p>
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
            <button onClick={() => startQuiz(quizMode)} className="bg-purple-500 text-white font-bold py-3 rounded-2xl">もう一度</button>
            <button onClick={() => setMode('menu')} className="bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl">モードを変える</button>
            <Link href="/apps/todofuken" className="text-gray-400 text-sm py-2 block text-center">メニューへ</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[qIndex]
  if (!q) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 pb-10">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/apps/todofuken" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="font-bold text-gray-800 flex-1">🏛️ 県庁所在地</h1>
          <span className="text-sm text-gray-500">{qIndex + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-purple-500">⭐ {score}</span>
        </div>
        <div className="h-1.5 bg-gray-100">
          <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-3">県庁所在地は どこ？</p>
          <div className="text-5xl mb-2">{q.pref.emoji}</div>
          <p className="text-2xl font-black text-gray-800">{q.pref.name}</p>
          <p className="text-sm text-gray-400 mt-1">{q.pref.kana} · {q.pref.region}</p>
        </div>

        {/* 1回目のまちがい: 答えは見せず、頭文字ヒントで再挑戦 */}
        {attempt === 1 && selected === null && (
          <div className="mb-4 rounded-2xl py-3 px-4 bg-yellow-100 border-2 border-yellow-400">
            <p className="font-black text-yellow-700 text-sm">💡 ヒント: 「<span className="text-lg">{q.pref.capitalKana[0]}</span>」ではじまる市だよ！</p>
            <p className="text-xs text-yellow-600 mt-1">もういちど えらんでみよう（さっきのは えらべないよ）</p>
          </div>
        )}

        {/* 正解/不正解バナー + 解説 */}
        {isCorrect !== null && (
          <div className={`mb-4 rounded-2xl overflow-hidden shadow-sm border-2 ${isCorrect ? 'border-green-400' : 'border-red-400'}`}>
            <div className={`py-3 px-4 text-center font-black text-lg ${
              isCorrect ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
            }`}>
              {isCorrect ? '⭕ せいかい！' : `❌ ざんねん… 正解は「${q.pref.capital}市」`}
            </div>
            <div className="bg-purple-50 px-4 py-3">
              <p className="text-xs font-bold text-purple-700 mb-1">💡 おぼえよう！</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold">{q.pref.name}</span>（{q.pref.region}地方）の県庁所在地は <span className="font-bold">{q.pref.capital}市</span>（{q.pref.capitalKana}）。
                {q.pref.capitalDiffers && ' 県名と所在地の名前がちがう、まちがえやすい県だよ！'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map(({ capital, kana }) => {
            const isCorrectChoice  = capital === q.pref.capital
            const isSelectedChoice = selected === capital
            const isFirstWrong     = capital === firstWrong
            let cls = 'bg-white border-2 border-gray-200'
            if (selected !== null) {
              if (isCorrectChoice)       cls = 'bg-green-100 border-2 border-green-500'
              else if (isSelectedChoice || isFirstWrong) cls = 'bg-red-100 border-2 border-red-400'
            } else if (isFirstWrong) {
              cls = 'bg-gray-100 border-2 border-gray-200 opacity-40'
            }
            return (
              <button key={capital} onClick={() => handleSelect(capital)} disabled={isFirstWrong && selected === null}
                className={`${cls} rounded-2xl py-4 px-3 text-center transition-all active:scale-95 shadow-sm`}>
                <span className="block font-bold text-gray-800 text-base">{capital}市</span>
                <span className="block text-xs text-gray-500 mt-0.5">{kana}</span>
              </button>
            )
          })}
        </div>

        {/* 次へボタン（回答後に表示） */}
        {selected !== null && (
          <button onClick={handleNext}
            className="mt-5 w-full bg-purple-500 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 transition-all">
            {qIndex + 1 >= questions.length ? '結果を見る 🏆' : 'つぎへ →'}
          </button>
        )}
      </div>
    </div>
  )
}
