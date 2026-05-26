'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { SCIENCE_QUESTIONS } from '@/data/scienceData'
import type { ScienceDomain, ScienceLevel } from '@/data/scienceData'
import { playCorrect, playWrong } from '@/lib/audio'
import { getDataKey } from '@/lib/storage'

// ── SRS ──────────────────────────────────────────────
const SRS_KEY = 'tanq_science_srs_v1'
const SESSION_SIZE = 10

interface SRSItem { b: 0 | 1 | 2; c: number; t: number }
type SRSStore = Record<string, SRSItem>

function loadSRS(): SRSStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(SRS_KEY)) || '{}') } catch { return {} }
}
function saveSRS(store: SRSStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getDataKey(SRS_KEY), JSON.stringify(store))
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildSession(
  domain: ScienceDomain,
  level: ScienceLevel,
  store: SRSStore,
): typeof SCIENCE_QUESTIONS {
  const pool = SCIENCE_QUESTIONS.filter(q => q.domain === domain && q.level === level)
  const unmastered = pool.filter(q => !store[q.id] || store[q.id].b < 2)
  const review = pool.filter(q => store[q.id]?.b === 2)
  const base = unmastered.length >= 3 ? unmastered : pool
  const withReview = [...shuffle(base), ...shuffle(review).slice(0, 2)]
  return shuffle(withReview).slice(0, SESSION_SIZE)
}

function domainStats(domain: ScienceDomain, level: ScienceLevel, store: SRSStore) {
  const pool = SCIENCE_QUESTIONS.filter(q => q.domain === domain && q.level === level)
  const mastered = pool.filter(q => store[q.id]?.b === 2).length
  return { mastered, total: pool.length }
}

// ── 定数 ──────────────────────────────────────────────
const DOMAIN_COLORS: Record<ScienceDomain, string> = {
  '生物': '#22c55e',
  '地学': '#0ea5e9',
  '化学': '#f59e0b',
  '物理': '#8b5cf6',
}
const DOMAIN_BG: Record<ScienceDomain, string> = {
  '生物': '#DFF6CF',
  '地学': '#D6ECFF',
  '化学': '#FFF1B8',
  '物理': '#EFE8FF',
}
const DOMAIN_EMOJI: Record<ScienceDomain, string> = {
  '生物': '🌿',
  '地学': '🌍',
  '化学': '⚗️',
  '物理': '⚡',
}
const LEVEL_LABEL: Record<ScienceLevel, string> = { 1: '基礎', 2: '標準', 3: '発展' }
const LEVEL_COLOR: Record<ScienceLevel, string> = {
  1: '#22c55e',
  2: '#f59e0b',
  3: '#f87171',
}
const DOMAINS: ScienceDomain[] = ['生物', '地学', '化学', '物理']
const LEVELS: ScienceLevel[] = [1, 2, 3]

// ── View types ──────────────────────────────────────
type View = 'top' | 'domain' | 'quiz' | 'result'

interface QuizState {
  questions: typeof SCIENCE_QUESTIONS
  current: number
  selected: number | null
  confirmed: boolean
  score: number
  answers: { correct: boolean; q: typeof SCIENCE_QUESTIONS[number] }[]
}

// ── コンポーネント ──────────────────────────────────────

function TopView({
  onSelect,
  store,
}: {
  onSelect: (d: ScienceDomain) => void
  store: SRSStore
}) {
  const totalMastered = SCIENCE_QUESTIONS.filter(q => store[q.id]?.b === 2).length
  const totalQ = SCIENCE_QUESTIONS.length

  return (
    <div className="px-4 pt-6 pb-8">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/lab" className="text-2xl">←</Link>
        <h1 className="font-black text-2xl" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
          🔬 理科クイズ
        </h1>
      </div>
      {/* 総合進捗 */}
      <div className="rounded-[22px] p-4 mb-6"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        <p className="text-xs font-black mb-1" style={{ color: '#6B5A52' }}>⭐ 全体のおぼえた</p>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-black" style={{ color: '#22c55e', fontFamily: 'var(--font-zen)' }}>{totalMastered}</span>
          <span className="text-sm font-bold mb-1" style={{ color: '#6B5A52' }}>/ {totalQ}問</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(totalMastered / totalQ * 100)}%`, background: '#22c55e' }} />
        </div>
      </div>

      {/* 領域カード */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {DOMAINS.map(domain => {
          const allStats = LEVELS.map(lv => domainStats(domain, lv, store))
          const mastered = allStats.reduce((s, x) => s + x.mastered, 0)
          const total = allStats.reduce((s, x) => s + x.total, 0)
          const pct = total > 0 ? Math.round(mastered / total * 100) : 0
          return (
            <button
              key={domain}
              onClick={() => onSelect(domain)}
              className="rounded-[22px] p-4 text-left transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              style={{ background: DOMAIN_BG[domain], border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}
            >
              <div className="text-3xl mb-2">{DOMAIN_EMOJI[domain]}</div>
              <div className="font-black text-sm mb-1" style={{ color: '#3A2E2A' }}>{domain}</div>
              <div className="text-[10px] font-bold mb-2" style={{ color: '#6B5A52' }}>{mastered}/{total}問 おぼえた</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DOMAIN_COLORS[domain] }} />
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-xs font-bold text-center" style={{ color: '#B0A49C' }}>中学受験対応 · 小4〜小6 · 全{totalQ}問</p>
    </div>
  )
}

function DomainView({
  domain,
  store,
  onStart,
  onBack,
}: {
  domain: ScienceDomain
  store: SRSStore
  onStart: (d: ScienceDomain, lv: ScienceLevel) => void
  onBack: () => void
}) {
  return (
    <div className="px-4 pt-6 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-2xl">←</button>
        <h2 className="font-black text-2xl" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
          {DOMAIN_EMOJI[domain]} {domain}
        </h2>
      </div>

      <div className="space-y-3">
        {LEVELS.map(lv => {
          const { mastered, total } = domainStats(domain, lv, store)
          const pct = total > 0 ? Math.round(mastered / total * 100) : 0
          const allMastered = mastered === total
          return (
            <button
              key={lv}
              onClick={() => onStart(domain, lv)}
              className="w-full rounded-[22px] p-5 text-left transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              style={{ background: DOMAIN_BG[domain], border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block text-xs font-black px-2 py-1 rounded-full"
                    style={{ background: LEVEL_COLOR[lv], color: '#FFFFFF', border: '2px solid #3A2E2A' }}>
                    {LEVEL_LABEL[lv]}
                  </span>
                  <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>
                    {lv === 1 ? '小4レベル' : lv === 2 ? '小5レベル' : '小6レベル（入試）'}
                  </span>
                </div>
                {allMastered && <span className="text-lg">🏆</span>}
              </div>
              <div className="flex justify-between text-[11px] font-bold mb-2" style={{ color: '#6B5A52' }}>
                <span>⭐ おぼえた {mastered}/{total}問</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: DOMAIN_COLORS[domain] }} />
              </div>
              <p className="text-[10px] font-bold mt-2" style={{ color: '#6B5A52' }}>
                {lv === 1 ? '昆虫・気象・状態変化・電流の基本' : lv === 2 ? '食物連鎖・地層・水溶液・てこ・浮力' : 'ヒトのからだ・火山・気体・滑車・電磁気'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuizView({
  state,
  domain,
  onSelect,
  onConfirm,
  onNext,
}: {
  state: QuizState
  domain: ScienceDomain
  onSelect: (i: number) => void
  onConfirm: () => void
  onNext: () => void
}) {
  const q = state.questions[state.current]
  const isLast = state.current === state.questions.length - 1
  const color = DOMAIN_COLORS[domain]

  // 選択肢をランダム順に並べるため、初回レンダリング時にシャッフル済みインデックスを生成
  const [shuffledIndices] = useState<number[]>(() => shuffle([0, 1, 2, 3]))

  const choiceLabels = ['A', 'B', 'C', 'D']

  return (
    <div className="px-4 pt-4 pb-8">
      {/* 進捗バー */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.round((state.current) / state.questions.length * 100)}%`, background: color }} />
        </div>
        <span className="text-xs font-black shrink-0" style={{ color: '#6B5A52' }}>
          {state.current + 1}/{state.questions.length}
        </span>
      </div>

      {/* 領域・レベルバッジ */}
      <div className="flex gap-2 mb-4">
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: DOMAIN_BG[domain], border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
          {DOMAIN_EMOJI[domain]} {domain}
        </span>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: LEVEL_COLOR[q.level], color: '#FFFFFF', border: '2px solid #3A2E2A' }}>
          {LEVEL_LABEL[q.level]}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#F3EDE8', border: '2px solid #C4B8AE', color: '#6B5A52' }}>
          {q.unit}
        </span>
      </div>

      {/* 問題文 */}
      <div className="rounded-[22px] p-5 mb-4"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <p className="font-black text-base leading-relaxed" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
          {q.q}
        </p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2 mb-4">
        {shuffledIndices.map((origIdx, pos) => {
          const label = choiceLabels[pos]
          const isSelected = state.selected === origIdx
          const isCorrect = origIdx === q.answer
          let bg = '#FFFFFF'
          let border = '2.5px solid #3A2E2A'
          let shadow = '3px 3px 0 0 #3A2E2A'
          if (state.confirmed) {
            if (isCorrect) { bg = '#DFF6CF'; border = `2.5px solid ${DOMAIN_COLORS['生物']}`; shadow = '3px 3px 0 0 #22c55e' }
            else if (isSelected) { bg = '#FFE3EE'; border = '2.5px solid #FF6F9C'; shadow = '3px 3px 0 0 #FF6F9C' }
          } else if (isSelected) {
            bg = DOMAIN_BG[domain]; border = `2.5px solid ${color}`; shadow = `3px 3px 0 0 ${color}`
          }
          return (
            <button
              key={origIdx}
              onClick={() => !state.confirmed && onSelect(origIdx)}
              className="w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-default"
              style={{ background: bg, border, boxShadow: shadow }}
              disabled={state.confirmed}
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{ background: isSelected || (state.confirmed && isCorrect) ? color : '#F3EDE8', color: isSelected || (state.confirmed && isCorrect) ? '#FFFFFF' : '#6B5A52', border: '1.5px solid #3A2E2A' }}>
                {label}
              </span>
              <span className="font-bold text-sm leading-snug" style={{ color: '#3A2E2A' }}>{q.choices[origIdx]}</span>
              {state.confirmed && isCorrect && <span className="ml-auto text-lg font-black" style={{ color: '#22c55e' }}>○</span>}
              {state.confirmed && isSelected && !isCorrect && <span className="ml-auto text-lg font-black" style={{ color: '#FF6F9C' }}>×</span>}
            </button>
          )
        })}
      </div>

      {/* 解説パネル（回答確認後） */}
      {state.confirmed && (
        <div className="rounded-[22px] p-4 mb-4 animate-[fadeIn_0.3s_ease]"
          style={{ background: state.selected === q.answer ? '#DFF6CF' : '#FFE3EE', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          <p className="font-black text-sm mb-1" style={{ color: '#3A2E2A' }}>
            {state.selected === q.answer ? '🎉 せいかい！' : `💡 正解は「${q.choices[q.answer]}」`}
          </p>
          <p className="text-xs font-bold leading-relaxed" style={{ color: '#3A2E2A' }}>{q.explain}</p>
        </div>
      )}

      {/* ボタン */}
      {!state.confirmed ? (
        <button
          onClick={onConfirm}
          disabled={state.selected === null}
          className="w-full py-4 rounded-full font-black text-base transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: state.selected !== null ? '#FFC83D' : '#E8E0D8', border: '3px solid #3A2E2A', boxShadow: state.selected !== null ? '6px 6px 0 0 #3A2E2A' : 'none', color: '#3A2E2A' }}>
          こたえる
        </button>
      ) : (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
          style={{ background: color, border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A', color: '#FFFFFF' }}>
          {isLast ? '結果を見る →' : 'つぎへ →'}
        </button>
      )}
    </div>
  )
}

function ResultView({
  state,
  domain,
  level,
  onRetry,
  onBack,
}: {
  state: QuizState
  domain: ScienceDomain
  level: ScienceLevel
  onRetry: () => void
  onBack: () => void
}) {
  const pct = Math.round(state.score / state.questions.length * 100)
  const color = DOMAIN_COLORS[domain]
  const msg = pct === 100 ? '🏆 パーフェクト！' : pct >= 80 ? '🎉 すごい！' : pct >= 60 ? '👍 いい感じ！' : '💪 もう一回チャレンジ！'

  return (
    <div className="px-4 pt-6 pb-8">
      <h2 className="font-black text-2xl mb-1" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>結果</h2>
      <p className="text-xs font-bold mb-5" style={{ color: '#6B5A52' }}>{DOMAIN_EMOJI[domain]} {domain} · {LEVEL_LABEL[level]}</p>

      {/* スコア */}
      <div className="rounded-[22px] p-6 mb-5 text-center"
        style={{ background: DOMAIN_BG[domain], border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        <p className="font-black text-5xl mb-1" style={{ color, fontFamily: 'var(--font-zen)' }}>
          {state.score}<span className="text-2xl">/{state.questions.length}</span>
        </p>
        <p className="font-black text-lg" style={{ color: '#3A2E2A' }}>{msg}</p>
        <div className="mt-3 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      {/* 問題ごとの結果 */}
      <div className="space-y-2 mb-6">
        {state.answers.map(({ correct, q }, i) => (
          <div key={i} className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{ background: correct ? '#DFF6CF' : '#FFE3EE', border: '2.5px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A' }}>
            <span className="text-lg font-black shrink-0 mt-0.5" style={{ color: correct ? '#22c55e' : '#FF6F9C' }}>{correct ? '○' : '×'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black leading-snug" style={{ color: '#3A2E2A' }}>{q.q}</p>
              {!correct && (
                <p className="text-[10px] font-bold mt-0.5" style={{ color: '#6B5A52' }}>
                  正解: {q.choices[q.answer]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button onClick={onRetry}
          className="w-full py-4 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
          style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A', color: '#3A2E2A' }}>
          もう一回 →
        </button>
        <button onClick={onBack}
          className="w-full py-3 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: '#3A2E2A' }}>
          ← 領域えらびに戻る
        </button>
      </div>
    </div>
  )
}

// ── メインページ ──────────────────────────────────────
export default function SciencePage() {
  const [view, setView] = useState<View>('top')
  const [selectedDomain, setSelectedDomain] = useState<ScienceDomain>('生物')
  const [selectedLevel, setSelectedLevel] = useState<ScienceLevel>(1)
  const [store, setStore] = useState<SRSStore>({})
  const [quiz, setQuiz] = useState<QuizState | null>(null)

  useEffect(() => { setStore(loadSRS()) }, [])

  const handleDomainSelect = useCallback((d: ScienceDomain) => {
    setSelectedDomain(d)
    setView('domain')
  }, [])

  const handleStart = useCallback((d: ScienceDomain, lv: ScienceLevel) => {
    const currentStore = loadSRS()
    setStore(currentStore)
    setSelectedDomain(d)
    setSelectedLevel(lv)
    const qs = buildSession(d, lv, currentStore)
    setQuiz({
      questions: qs,
      current: 0,
      selected: null,
      confirmed: false,
      score: 0,
      answers: [],
    })
    setView('quiz')
  }, [])

  const handleSelect = useCallback((i: number) => {
    setQuiz(prev => prev ? { ...prev, selected: i } : prev)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!quiz || quiz.selected === null) return
    const q = quiz.questions[quiz.current]
    const correct = quiz.selected === q.answer

    if (correct) playCorrect(); else playWrong()

    // SRS更新
    const newStore = { ...store }
    const prev = newStore[q.id] || { b: 0, c: 0, t: 0 }
    const newC = correct ? prev.c + 1 : 0
    const newB: 0 | 1 | 2 = newC >= 3 ? 2 : newC >= 1 ? 1 : 0
    newStore[q.id] = { b: newB, c: newC, t: Date.now() }
    saveSRS(newStore)
    setStore(newStore)

    setQuiz(prev => prev ? { ...prev, confirmed: true, score: prev.score + (correct ? 1 : 0) } : prev)
  }, [quiz, store])

  const handleNext = useCallback(() => {
    if (!quiz) return
    const q = quiz.questions[quiz.current]
    const correct = quiz.selected === q.answer
    const newAnswers = [...quiz.answers, { correct, q }]

    if (quiz.current + 1 >= quiz.questions.length) {
      setQuiz(prev => prev ? { ...prev, answers: newAnswers } : prev)
      setView('result')
    } else {
      setQuiz(prev => prev ? {
        ...prev,
        current: prev.current + 1,
        selected: null,
        confirmed: false,
        answers: newAnswers,
      } : prev)
    }
  }, [quiz])

  const handleRetry = useCallback(() => {
    handleStart(selectedDomain, selectedLevel)
  }, [handleStart, selectedDomain, selectedLevel])

  return (
    <div className="min-h-screen font-sans"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        color: '#3A2E2A',
      }}>
      <div className="min-h-screen max-w-md mx-auto"
        style={{ borderLeft: '1px solid rgba(58,46,42,0.08)', borderRight: '1px solid rgba(58,46,42,0.08)' }}>
        {view === 'top' && <TopView onSelect={handleDomainSelect} store={store} />}
        {view === 'domain' && <DomainView domain={selectedDomain} store={store} onStart={handleStart} onBack={() => setView('top')} />}
        {view === 'quiz' && quiz && (
          <QuizView
            key={quiz.current}
            state={quiz}
            domain={selectedDomain}
            onSelect={handleSelect}
            onConfirm={handleConfirm}
            onNext={handleNext}
          />
        )}
        {view === 'result' && quiz && (
          <ResultView
            state={quiz}
            domain={selectedDomain}
            level={selectedLevel}
            onRetry={handleRetry}
            onBack={() => setView('domain')}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
