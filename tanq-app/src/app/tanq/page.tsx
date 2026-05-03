'use client'

import { useEffect, useReducer, useCallback } from 'react'
import Image from 'next/image'
import unit1, { type Emotion, type Step, type ChoiceFeedback } from '@/data/unit1'

// ─── State machine ────────────────────────────────────────────────

type Phase =
  | { name: 'typing'; stepId: string; msgIdx: number }
  | { name: 'waiting'; stepId: string }
  | { name: 'feedback'; stepId: string; fb: ChoiceFeedback; msgIdx: number; nextStep: string | null }
  | { name: 'collection' }

type State = { phase: Phase; emotion: Emotion }

type Action =
  | { type: 'NEXT_MSG' }
  | { type: 'CHOICE'; choiceIdx: number }
  | { type: 'ADVANCE' }

function getStep(id: string): Step {
  return unit1.steps.find((s) => s.id === id)!
}

function reducer(state: State, action: Action): State {
  const { phase } = state

  if (action.type === 'NEXT_MSG' && phase.name === 'typing') {
    const step = getStep(phase.stepId)
    const next = phase.msgIdx + 1
    if (next < step.messages.length) {
      return { ...state, phase: { ...phase, msgIdx: next } }
    }
    return { emotion: step.emotion, phase: { name: 'waiting', stepId: phase.stepId } }
  }

  if (action.type === 'NEXT_MSG' && phase.name === 'feedback') {
    const next = phase.msgIdx + 1
    if (next < phase.fb.messages.length) {
      return { ...state, phase: { ...phase, msgIdx: next } }
    }
    // all feedback messages shown → show "次へ" by going to waiting-like state
    return { emotion: phase.fb.emotion, phase: { name: 'feedback', ...phase, msgIdx: phase.fb.messages.length } }
  }

  if (action.type === 'CHOICE' && phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    if (step.input.type !== 'choices') return state
    const choice = step.input.choices[action.choiceIdx]
    return {
      emotion: choice.feedback.emotion,
      phase: { name: 'feedback', stepId: phase.stepId, fb: choice.feedback, msgIdx: 0, nextStep: step.input.nextStep },
    }
  }

  if (action.type === 'ADVANCE') {
    if (phase.name === 'waiting') {
      const step = getStep(phase.stepId)
      if (step.input.type !== 'next') return state
      const next = step.input.nextStep
      if (!next) return { ...state, phase: { name: 'collection' } }
      const nextStep = getStep(next)
      return { emotion: nextStep.emotion, phase: { name: 'typing', stepId: next, msgIdx: 0 } }
    }
    if (phase.name === 'feedback') {
      if (!phase.nextStep) return { ...state, phase: { name: 'collection' } }
      const nextStep = getStep(phase.nextStep)
      return { emotion: nextStep.emotion, phase: { name: 'typing', stepId: phase.nextStep, msgIdx: 0 } }
    }
  }

  return state
}

// ─── Emotion image map ─────────────────────────────────────────────

const EMOTION_SRC: Record<Emotion, string> = {
  happy:      '/tanquu/happy.png',
  angry:      '/tanquu/angry.png',
  sad:        '/tanquu/sad.png',
  mischievous:'/tanquu/mischievous.png',
  surprised:  '/tanquu/surprised.png',
}

// ─── Components ───────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex gap-1 px-4 py-2">
      <span className="dot w-2 h-2 rounded-full bg-tanquu-purple" />
      <span className="dot w-2 h-2 rounded-full bg-tanquu-purple" />
      <span className="dot w-2 h-2 rounded-full bg-tanquu-purple" />
    </span>
  )
}

function Bubble({ text }: { text: string }) {
  return (
    <div className="pop-in bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm max-w-xs text-gray-700 text-lg leading-relaxed">
      {text}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────

const FIRST_STEP = unit1.steps[0]
const INIT: State = {
  emotion: FIRST_STEP.emotion,
  phase: { name: 'typing', stepId: FIRST_STEP.id, msgIdx: 0 },
}

export default function TanqPage() {
  const [state, dispatch] = useReducer(reducer, INIT)
  const { phase, emotion } = state

  // Auto-advance typing phases
  useEffect(() => {
    if (phase.name !== 'typing' && phase.name !== 'feedback') return
    if (phase.name === 'feedback' && phase.msgIdx >= phase.fb.messages.length) return

    const id = setTimeout(() => dispatch({ type: 'NEXT_MSG' }), 900)
    return () => clearTimeout(id)
  }, [phase])

  const handleChoice = useCallback((idx: number) => dispatch({ type: 'CHOICE', choiceIdx: idx }), [])
  const handleAdvance = useCallback(() => dispatch({ type: 'ADVANCE' }), [])

  // ── Collection screen ──
  if (phase.name === 'collection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">
        <Image src={EMOTION_SRC.happy} alt="TANQuu" width={160} height={160} className="drop-shadow-md" />
        <h2 className="text-2xl font-bold text-tanquu-purple">ひみつ ゲット！！🎉</h2>
        <div className="bg-white rounded-2xl shadow p-5 w-full max-w-sm text-left space-y-2">
          <p className="font-bold text-gray-600 text-sm">🔬 {unit1.secretTitle}</p>
          {unit1.secretPoints.map((p) => (
            <p key={p} className="text-gray-700 text-base before:content-['✦_']">{p}</p>
          ))}
        </div>
        <p className="text-tanquu-purple text-sm">コレクションに追加されたよ！</p>
      </div>
    )
  }

  // ── Derive current displayed message ──
  let displayMsg = ''
  let isTyping = false

  if (phase.name === 'typing') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[phase.msgIdx]
    isTyping = true
  } else if (phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[step.messages.length - 1]
  } else if (phase.name === 'feedback') {
    if (phase.msgIdx < phase.fb.messages.length) {
      displayMsg = phase.fb.messages[phase.msgIdx]
      isTyping = true
    } else {
      displayMsg = phase.fb.messages[phase.fb.messages.length - 1]
    }
  }

  // ── Derive bottom input ──
  let bottomInput: React.ReactNode = null

  if (phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    if (step.input.type === 'choices') {
      bottomInput = (
        <div className="flex flex-col gap-3 px-4 pb-6">
          {step.input.choices.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleChoice(i)}
              className="w-full bg-white border-2 border-tanquu-purple text-gray-700 rounded-2xl px-4 py-4 text-base font-medium active:bg-tanquu-light transition-colors shadow-sm text-left"
            >
              {c.label}
            </button>
          ))}
        </div>
      )
    } else {
      bottomInput = (
        <div className="flex justify-center pb-8">
          <button
            onClick={handleAdvance}
            className="bg-tanquu-purple text-white rounded-full px-10 py-4 text-lg font-bold shadow active:opacity-80 transition-opacity"
          >
            次へ →
          </button>
        </div>
      )
    }
  } else if (phase.name === 'feedback' && phase.msgIdx >= phase.fb.messages.length) {
    bottomInput = (
      <div className="flex justify-center pb-8">
        <button
          onClick={handleAdvance}
          className="bg-tanquu-purple text-white rounded-full px-10 py-4 text-lg font-bold shadow active:opacity-80 transition-opacity"
        >
          次へ →
        </button>
      </div>
    )
  }

  // ── Render ──
  return (
    <div className="flex flex-col min-h-screen bg-tanquu-light max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className="text-tanquu-purple font-bold text-xl">🐱 TANQuu</span>
        <span className="ml-auto text-sm text-gray-400">ひみつ ★☆☆☆☆</span>
      </div>

      {/* Character */}
      <div className="flex justify-center pt-2 pb-1">
        <Image
          key={emotion}
          src={EMOTION_SRC[emotion]}
          alt={`TANQuu ${emotion}`}
          width={180}
          height={180}
          className="drop-shadow-md pop-in"
          priority
        />
      </div>

      {/* Speech bubble */}
      <div className="flex-1 px-4 py-2">
        <div className="flex items-start gap-2">
          <div key={displayMsg} className="pop-in">
            {isTyping && !displayMsg ? <TypingDots /> : <Bubble text={displayMsg} />}
          </div>
        </div>
      </div>

      {/* Bottom input */}
      <div className="mt-auto">{bottomInput}</div>
    </div>
  )
}
