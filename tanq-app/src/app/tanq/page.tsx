'use client'

import { useEffect, useReducer, useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Emotion, Unit, Step, ChoiceFeedback } from '@/data/types'
import ALL_UNITS from '@/data/units'

// ─── App-level state ──────────────────────────────────────────────

type AppMode = { mode: 'home' } | { mode: 'playing'; unit: Unit }

function loadCompleted(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('tanq-completed') ?? '[]') } catch { return [] }
}
function saveCompleted(ids: string[]) {
  localStorage.setItem('tanq-completed', JSON.stringify(ids))
}

// ─── Game state machine ───────────────────────────────────────────

type Phase =
  | { name: 'animating';    stepId: string; msgIdx: number }
  | { name: 'shown';        stepId: string; msgIdx: number }
  | { name: 'waiting';      stepId: string }
  | { name: 'fb_animating'; stepId: string; fb: ChoiceFeedback; msgIdx: number; nextStep: string | null }
  | { name: 'fb_shown';     stepId: string; fb: ChoiceFeedback; msgIdx: number; nextStep: string | null }
  | { name: 'collection' }

type GameState = { phase: Phase; emotion: Emotion }

type Action =
  | { type: 'ANIM_DONE' }
  | { type: 'TAP' }
  | { type: 'CHOICE'; choiceIdx: number }
  | { type: 'ADVANCE' }

function makeReducer(unit: Unit) {
  const getStep = (id: string): Step => unit.steps.find(s => s.id === id)!

  return function reducer(state: GameState, action: Action): GameState {
    const { phase } = state

    if (action.type === 'TAP') {
      if (phase.name === 'animating') {
        const step = getStep(phase.stepId)
        if (phase.msgIdx >= step.messages.length - 1)
          return { emotion: step.emotion, phase: { name: 'waiting', stepId: phase.stepId } }
        return { ...state, phase: { name: 'shown', stepId: phase.stepId, msgIdx: phase.msgIdx } }
      }
      if (phase.name === 'fb_animating')
        return { ...state, phase: { name: 'fb_shown', stepId: phase.stepId, fb: phase.fb, msgIdx: phase.msgIdx, nextStep: phase.nextStep } }
      if (phase.name === 'shown') {
        const step = getStep(phase.stepId)
        const next = phase.msgIdx + 1
        if (next < step.messages.length)
          return { emotion: step.emotion, phase: { name: 'animating', stepId: phase.stepId, msgIdx: next } }
        return { emotion: step.emotion, phase: { name: 'waiting', stepId: phase.stepId } }
      }
      if (phase.name === 'fb_shown') {
        const next = phase.msgIdx + 1
        if (next < phase.fb.messages.length)
          return { ...state, phase: { name: 'fb_animating', stepId: phase.stepId, fb: phase.fb, msgIdx: next, nextStep: phase.nextStep } }
        return state
      }
    }

    if (action.type === 'ANIM_DONE') {
      if (phase.name === 'animating') {
        const step = getStep(phase.stepId)
        if (phase.msgIdx >= step.messages.length - 1)
          return { emotion: step.emotion, phase: { name: 'waiting', stepId: phase.stepId } }
        return { ...state, phase: { name: 'shown', stepId: phase.stepId, msgIdx: phase.msgIdx } }
      }
      if (phase.name === 'fb_animating')
        return { ...state, phase: { name: 'fb_shown', stepId: phase.stepId, fb: phase.fb, msgIdx: phase.msgIdx, nextStep: phase.nextStep } }
    }

    if (action.type === 'CHOICE' && phase.name === 'waiting') {
      const step = getStep(phase.stepId)
      if (step.input.type !== 'choices') return state
      const choice = step.input.choices[action.choiceIdx]
      return { emotion: choice.feedback.emotion, phase: { name: 'fb_animating', stepId: phase.stepId, fb: choice.feedback, msgIdx: 0, nextStep: step.input.nextStep } }
    }

    if (action.type === 'ADVANCE') {
      if (phase.name === 'waiting') {
        const step = getStep(phase.stepId)
        if (step.input.type !== 'next') return state
        const next = step.input.nextStep
        if (!next) return { ...state, phase: { name: 'collection' } }
        const nextStep = getStep(next)
        return { emotion: nextStep.emotion, phase: { name: 'animating', stepId: next, msgIdx: 0 } }
      }
      if (phase.name === 'fb_shown') {
        if (!phase.nextStep) return { ...state, phase: { name: 'collection' } }
        const nextStep = getStep(phase.nextStep)
        return { emotion: nextStep.emotion, phase: { name: 'animating', stepId: phase.nextStep, msgIdx: 0 } }
      }
    }

    return state
  }
}

// ─── Emotion images ───────────────────────────────────────────────

const EMOTION_SRC: Record<Emotion, string> = {
  happy:       '/tanquu/happy.png',
  angry:       '/tanquu/angry.png',
  sad:         '/tanquu/sad.png',
  mischievous: '/tanquu/mischievous.png',
  surprised:   '/tanquu/surprised.png',
}

// ─── Visual components ─────────────────────────────────────────────

function DensityTank() {
  return (
    <div className="relative w-56 h-32 bg-blue-100 rounded-xl border-4 border-blue-300 mx-auto overflow-hidden pop-in">
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-blue-200/80 rounded-b-lg" />
      <div className="absolute text-2xl select-none" style={{ top: 12, left: 24 }}>🧊</div>
      <div className="absolute text-xs font-bold text-blue-800" style={{ top: 16, left: 54 }}>0.9</div>
      <div className="absolute text-xl select-none" style={{ top: 16, right: 32 }}>🪵</div>
      <div className="absolute text-xs font-bold text-blue-800" style={{ top: 20, right: 56 }}>0.5</div>
      <div className="absolute text-2xl select-none" style={{ bottom: 6, left: 24 }}>🪨</div>
      <div className="absolute text-xs font-bold text-gray-600" style={{ bottom: 28, left: 52 }}>2.7</div>
      <div className="absolute text-xl select-none" style={{ bottom: 8, right: 32 }}>🪙</div>
      <div className="absolute text-xs font-bold text-gray-600" style={{ bottom: 28, right: 52 }}>8.9</div>
      <div className="absolute text-xs font-bold text-blue-700" style={{ top: '40%', right: 8 }}>水 1.0</div>
    </div>
  )
}

function DissolveDemo() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 pop-in select-none">
      <span className="text-4xl">🍬</span>
      <span className="text-2xl text-tanquu-purple font-bold">＋</span>
      <span className="text-4xl">💧</span>
      <span className="text-2xl text-tanquu-purple font-bold">＝</span>
      <span className="text-4xl">🌊</span>
    </div>
  )
}

function StepVisual({ visual }: { visual?: string }) {
  if (!visual) return null
  if (visual === 'density-tank') return <div className="py-2"><DensityTank /></div>
  if (visual === 'dissolve-demo') return <div className="py-1"><DissolveDemo /></div>
  if (visual === 'celebration') return (
    <div className="flex justify-center gap-3 py-1 pop-in select-none">
      <span className="text-4xl">⭐</span><span className="text-4xl">✨</span><span className="text-4xl">⭐</span>
    </div>
  )
  // 絵文字のみ表示（ASCII文字だけの文字列はプレースホルダーとみなしてスキップ）
  if (/^[\w\-]+$/.test(visual)) return null
  return <div className="text-6xl text-center py-1 pop-in select-none">{visual}</div>
}

// ─── Shared UI ────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex gap-1 px-4 py-3">
      <span className="dot w-2.5 h-2.5 rounded-full bg-tanquu-purple" />
      <span className="dot w-2.5 h-2.5 rounded-full bg-tanquu-purple" />
      <span className="dot w-2.5 h-2.5 rounded-full bg-tanquu-purple" />
    </span>
  )
}

function Bubble({ text }: { text: string }) {
  return (
    <div
      className="pop-in bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm max-w-xs text-gray-700 text-xl leading-relaxed"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

// ─── Home screen ──────────────────────────────────────────────────

const SEASON_COLORS = [
  'border-purple-400 bg-purple-50',
  'border-blue-400 bg-blue-50',
  'border-green-400 bg-green-50',
  'border-orange-400 bg-orange-50',
  'border-pink-400 bg-pink-50',
]

function HomeScreen({ completed, onSelect }: { completed: string[]; onSelect: (u: Unit) => void }) {
  const total = ALL_UNITS.length
  const done = ALL_UNITS.filter(u => completed.includes(u.id)).length

  return (
    <div className="flex flex-col min-h-screen bg-tanquu-light max-w-sm mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-4 px-6">
        <div className="self-start mb-2">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-tanquu-purple transition-colors">
            ← ホームへ戻る
          </Link>
        </div>
        <Image src={EMOTION_SRC.happy} alt="TANQuu" width={100} height={100} className="drop-shadow-md pop-in" priority />
        <h1 className="text-3xl font-bold text-tanquu-purple mt-2">TANQ 理科</h1>
        <p className="text-gray-500 text-sm mt-1">シーズン1 — ひみつコレクション</p>
        {/* Progress */}
        <div className="flex items-center gap-2 mt-3">
          {ALL_UNITS.map((u, i) => (
            <span key={u.id} className={`text-lg ${completed.includes(u.id) ? 'opacity-100' : 'opacity-30'}`}>⭐</span>
          ))}
          <span className="text-sm text-gray-500 ml-1">{done}/{total} ゲット</span>
        </div>
      </div>

      {/* Unit list */}
      <div className="flex-1 px-4 pb-8 space-y-3">
        {ALL_UNITS.map((unit, i) => {
          const isDone = completed.includes(unit.id)
          return (
            <button
              key={unit.id}
              onClick={() => onSelect(unit)}
              className={`w-full text-left bg-white rounded-2xl shadow-sm border-l-4 px-5 py-4 flex items-center gap-4 active:scale-95 transition-transform ${SEASON_COLORS[i % SEASON_COLORS.length]}`}
            >
              <span className="text-3xl select-none">{unit.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Unit {i + 1}</p>
                <p className="text-gray-700 font-bold text-base leading-snug" dangerouslySetInnerHTML={{ __html: unit.hook }} />
              </div>
              <span className="text-xl flex-shrink-0">{isDone ? '✅' : '→'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Game screen ──────────────────────────────────────────────────

function getProgressIdx(steps: Step[], stepId: string): number {
  const contentSteps = steps.filter(s => s.id !== 'collection')
  return contentSteps.findIndex(s => s.id === stepId)
}

function GameScreen({ unit, onComplete, onHome }: { unit: Unit; onComplete: () => void; onHome: () => void }) {
  const reducer = useCallback(makeReducer(unit), [unit])
  const INIT: GameState = {
    emotion: unit.steps[0].emotion,
    phase: { name: 'animating', stepId: unit.steps[0].id, msgIdx: 0 },
  }
  const [state, dispatch] = useReducer(reducer, INIT)
  const { phase, emotion } = state

  const getStep = useCallback((id: string): Step => unit.steps.find(s => s.id === id)!, [unit])

  useEffect(() => {
    if (phase.name !== 'animating' && phase.name !== 'fb_animating') return
    const id = setTimeout(() => dispatch({ type: 'ANIM_DONE' }), 1000)
    return () => clearTimeout(id)
  }, [phase])

  const handleSkipAnim = useCallback(() => {
    if (phase.name === 'animating' || phase.name === 'fb_animating') dispatch({ type: 'TAP' })
  }, [phase])

  const handleTap = useCallback(() => dispatch({ type: 'TAP' }), [])
  const handleAdvance = useCallback(() => dispatch({ type: 'ADVANCE' }), [])

  // ── Collection screen ──
  if (phase.name === 'collection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center bg-tanquu-light max-w-sm mx-auto">
        <Image src={EMOTION_SRC.happy} alt="TANQuu" width={140} height={140} className="drop-shadow-md wobble" />
        <h2 className="text-3xl font-bold text-tanquu-purple pop-in">ひみつ ゲット！！🎉</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-sm text-left space-y-3 pop-in">
          <p className="font-bold text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: `🔬 ${unit.secretTitle}` }} />
          {unit.secretPoints.map((p, i) => (
            <p key={i} className="text-gray-700 text-base before:content-['✦_']" dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
        {/* Rin P1: もう一回 + ホームへ buttons */}
        <div className="flex gap-3 w-full max-w-sm pop-in">
          <button
            onClick={() => {
              onComplete()
              onHome()
            }}
            className="flex-1 bg-tanquu-purple text-white rounded-full py-4 text-base font-bold shadow active:opacity-80"
          >
            ホームへ
          </button>
          <button
            onClick={() => {
              onComplete()
              onHome()
            }}
            className="flex-1 bg-white border-2 border-tanquu-purple text-tanquu-purple rounded-full py-4 text-base font-bold shadow active:opacity-80"
          >
            もう一回 🔄
          </button>
        </div>
      </div>
    )
  }

  // ── Derive display state ──
  let displayMsg = ''
  let isAnimating = false
  let showTapHint = false
  let isFbLastMsg = false
  let currentStepId = ''

  if (phase.name === 'animating') { isAnimating = true; currentStepId = phase.stepId }
  else if (phase.name === 'shown') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[phase.msgIdx]
    showTapHint = phase.msgIdx < step.messages.length - 1
    currentStepId = phase.stepId
  }
  else if (phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[step.messages.length - 1]
    currentStepId = phase.stepId
  }
  else if (phase.name === 'fb_animating') { isAnimating = true; currentStepId = phase.stepId }
  else if (phase.name === 'fb_shown') {
    displayMsg = phase.fb.messages[phase.msgIdx]
    isFbLastMsg = phase.msgIdx >= phase.fb.messages.length - 1
    showTapHint = !isFbLastMsg
    currentStepId = phase.stepId
  }

  const currentStep = currentStepId ? getStep(currentStepId) : null
  const visual = currentStep?.visual
  const hasVisual = Boolean(visual)

  // Progress among content steps (excluding collection)
  const contentSteps = unit.steps.filter(s => s.id !== 'collection')
  const progressIdx = contentSteps.findIndex(s => s.id === currentStepId)

  const bubbleKey = (() => {
    if (phase.name === 'animating')    return `anim-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'fb_animating') return `fbanim-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'shown')        return `msg-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'fb_shown')     return `fbmsg-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'waiting') { const s = getStep(phase.stepId); return `msg-${phase.stepId}-${s.messages.length - 1}` }
    return 'none'
  })()

  // ── Bottom input ──
  let bottomInput: React.ReactNode = null

  if (phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    if (step.input.type === 'choices') {
      bottomInput = (
        <div className="flex flex-col gap-3 px-4 pb-6">
          {step.input.choices.map((c, i) => (
            <button
              key={c.id}
              onClick={() => dispatch({ type: 'CHOICE', choiceIdx: i })}
              className="w-full bg-white border-2 border-tanquu-purple text-gray-700 rounded-2xl px-4 py-4 text-base font-medium active:bg-tanquu-light transition-colors shadow-sm text-left"
              dangerouslySetInnerHTML={{ __html: c.label }}
            />
          ))}
        </div>
      )
    } else {
      bottomInput = (
        <div className="flex justify-center pb-8">
          <button onClick={handleAdvance} className="bg-tanquu-purple text-white rounded-full px-10 py-4 text-lg font-bold shadow active:opacity-80 transition-opacity">
            次へ →
          </button>
        </div>
      )
    }
  } else if (isFbLastMsg) {
    bottomInput = (
      <div className="flex justify-center pb-8">
        <button onClick={handleAdvance} className="bg-tanquu-purple text-white rounded-full px-10 py-4 text-lg font-bold shadow active:opacity-80 transition-opacity">
          次へ →
        </button>
      </div>
    )
  } else if (showTapHint) {
    bottomInput = (
      <div className="flex justify-center pb-6">
        <button
          onClick={handleTap}
          className="tap-hint bg-white border-2 border-tanquu-purple text-tanquu-purple rounded-full px-10 py-4 text-lg font-bold shadow-sm active:bg-tanquu-light transition-colors"
        >
          つぎへ →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-tanquu-light max-w-sm mx-auto pb-8" onClick={handleSkipAnim}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-1">
        <button onClick={onHome} className="text-tanquu-purple font-bold text-sm px-2 py-1 rounded-lg active:bg-tanquu-light">
          ← ホーム
        </button>
        <span className="ml-auto text-tanquu-purple font-bold text-sm">{unit.emoji} Unit {ALL_UNITS.findIndex(u => u.id === unit.id) + 1}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center py-1">
        {contentSteps.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i <= progressIdx ? 'bg-tanquu-purple' : 'bg-gray-300'}`} />
        ))}
      </div>

      {/* TANQuu */}
      <div className="flex justify-center pt-1 pb-1">
        <Image
          key={emotion}
          src={EMOTION_SRC[emotion]}
          alt={`TANQuu ${emotion}`}
          width={hasVisual ? 110 : 170}
          height={hasVisual ? 110 : 170}
          className={`drop-shadow-md ${emotion === 'happy' ? 'wobble' : 'pop-in'}`}
          priority
        />
      </div>

      {/* Step visual */}
      {visual && <StepVisual key={currentStepId} visual={visual} />}

      {/* Bubble */}
      <div className="px-4 py-2">
        <div key={bubbleKey} className="flex items-start gap-2 pop-in">
          {isAnimating ? <TypingDots /> : <Bubble text={displayMsg} />}
        </div>
      </div>

      <div className="mt-8">{bottomInput}</div>
    </div>
  )
}

// ─── Root page ─────────────────────────────────────────────────────

export default function TanqPage() {
  const [appMode, setAppMode] = useState<AppMode>({ mode: 'home' })
  const [completed, setCompleted] = useState<string[]>(loadCompleted)

  const handleSelect = (unit: Unit) => setAppMode({ mode: 'playing', unit })
  const handleComplete = useCallback((unitId: string) => {
    setCompleted(prev => {
      if (prev.includes(unitId)) return prev
      const next = [...prev, unitId]
      saveCompleted(next)
      return next
    })
  }, [])
  const handleHome = useCallback(() => setAppMode({ mode: 'home' }), [])

  if (appMode.mode === 'home') {
    return <HomeScreen completed={completed} onSelect={handleSelect} />
  }

  return (
    <GameScreen
      key={appMode.unit.id}
      unit={appMode.unit}
      onComplete={() => handleComplete(appMode.unit.id)}
      onHome={handleHome}
    />
  )
}
