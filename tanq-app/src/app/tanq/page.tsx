'use client'

import { useEffect, useReducer, useCallback } from 'react'
import Image from 'next/image'
import unit1, { type Emotion, type Step, type ChoiceFeedback } from '@/data/unit1'

// ─── State machine ────────────────────────────────────────────────

type Phase =
  | { name: 'animating';    stepId: string; msgIdx: number }
  | { name: 'shown';        stepId: string; msgIdx: number }
  | { name: 'waiting';      stepId: string }
  | { name: 'fb_animating'; stepId: string; fb: ChoiceFeedback; msgIdx: number; nextStep: string | null }
  | { name: 'fb_shown';     stepId: string; fb: ChoiceFeedback; msgIdx: number; nextStep: string | null }
  | { name: 'collection' }

type State = { phase: Phase; emotion: Emotion }

type Action =
  | { type: 'ANIM_DONE' }
  | { type: 'TAP' }
  | { type: 'CHOICE'; choiceIdx: number }
  | { type: 'ADVANCE' }

function getStep(id: string): Step {
  return unit1.steps.find((s) => s.id === id)!
}

function reducer(state: State, action: Action): State {
  const { phase } = state

  if (action.type === 'TAP') {
    // Skip typing animation → show message immediately
    if (phase.name === 'animating') {
      return { ...state, phase: { name: 'shown', stepId: phase.stepId, msgIdx: phase.msgIdx } }
    }
    if (phase.name === 'fb_animating') {
      return { ...state, phase: { name: 'fb_shown', stepId: phase.stepId, fb: phase.fb, msgIdx: phase.msgIdx, nextStep: phase.nextStep } }
    }
    // Advance to next message (or to waiting when last message)
    if (phase.name === 'shown') {
      const step = getStep(phase.stepId)
      const nextIdx = phase.msgIdx + 1
      if (nextIdx < step.messages.length) {
        return { emotion: step.emotion, phase: { name: 'animating', stepId: phase.stepId, msgIdx: nextIdx } }
      }
      return { emotion: step.emotion, phase: { name: 'waiting', stepId: phase.stepId } }
    }
    if (phase.name === 'fb_shown') {
      const nextIdx = phase.msgIdx + 1
      if (nextIdx < phase.fb.messages.length) {
        return { ...state, phase: { name: 'fb_animating', stepId: phase.stepId, fb: phase.fb, msgIdx: nextIdx, nextStep: phase.nextStep } }
      }
      return state // last fb message: ADVANCE button handles next
    }
  }

  if (action.type === 'ANIM_DONE') {
    if (phase.name === 'animating') {
      return { ...state, phase: { name: 'shown', stepId: phase.stepId, msgIdx: phase.msgIdx } }
    }
    if (phase.name === 'fb_animating') {
      return { ...state, phase: { name: 'fb_shown', stepId: phase.stepId, fb: phase.fb, msgIdx: phase.msgIdx, nextStep: phase.nextStep } }
    }
  }

  if (action.type === 'CHOICE' && phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    if (step.input.type !== 'choices') return state
    const choice = step.input.choices[action.choiceIdx]
    return {
      emotion: choice.feedback.emotion,
      phase: { name: 'fb_animating', stepId: phase.stepId, fb: choice.feedback, msgIdx: 0, nextStep: step.input.nextStep },
    }
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

// ─── Emotion image map ─────────────────────────────────────────────

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
      {/* Water fill */}
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-blue-200/80 rounded-b-lg" />
      {/* Floating items */}
      <div className="absolute text-3xl select-none" style={{ top: 14, left: 28 }}>🧊</div>
      <div className="absolute text-2xl select-none" style={{ top: 18, right: 36 }}>🪵</div>
      {/* Sinking items */}
      <div className="absolute text-2xl select-none" style={{ bottom: 6, left: 28 }}>🪨</div>
      <div className="absolute text-xl select-none" style={{ bottom: 8, right: 32 }}>🪙</div>
      {/* Label */}
      <div className="absolute text-xs font-bold text-blue-700" style={{ top: '42%', right: 8 }}>水 1.0</div>
    </div>
  )
}

function StepVisual({ visual }: { visual?: string }) {
  if (visual === 'hook-emoji') {
    return <div className="text-7xl text-center py-1 pop-in select-none">💩</div>
  }
  if (visual === 'density-tank') {
    return <div className="py-2"><DensityTank /></div>
  }
  if (visual === 'ice-emoji') {
    return <div className="text-6xl text-center py-1 pop-in select-none">🧊</div>
  }
  if (visual === 'celebration') {
    return (
      <div className="flex justify-center gap-3 py-1 pop-in select-none">
        <span className="text-4xl">⭐</span>
        <span className="text-4xl">✨</span>
        <span className="text-4xl">⭐</span>
      </div>
    )
  }
  return null
}

// ─── UI components ─────────────────────────────────────────────────

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

const STEP_ORDER = ['hook', 'density_intro', 'ice_question', 'logic_intro']

function ProgressDots({ stepId }: { stepId: string }) {
  const idx = STEP_ORDER.indexOf(stepId)
  return (
    <div className="flex gap-2 justify-center py-1">
      {STEP_ORDER.map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            i <= idx ? 'bg-tanquu-purple' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────

const FIRST_STEP = unit1.steps[0]
const INIT: State = {
  emotion: FIRST_STEP.emotion,
  phase: { name: 'animating', stepId: FIRST_STEP.id, msgIdx: 0 },
}

export default function TanqPage() {
  const [state, dispatch] = useReducer(reducer, INIT)
  const { phase, emotion } = state

  // Auto-advance typing animation → show message
  useEffect(() => {
    if (phase.name !== 'animating' && phase.name !== 'fb_animating') return
    const id = setTimeout(() => dispatch({ type: 'ANIM_DONE' }), 1000)
    return () => clearTimeout(id)
  }, [phase])

  const handleSkipAnim = useCallback(() => {
    if (phase.name === 'animating' || phase.name === 'fb_animating') {
      dispatch({ type: 'TAP' })
    }
  }, [phase])

  const handleTap = useCallback(() => dispatch({ type: 'TAP' }), [])
  const handleAdvance = useCallback(() => dispatch({ type: 'ADVANCE' }), [])

  // ── Collection screen ──
  if (phase.name === 'collection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center bg-tanquu-light">
        <Image src={EMOTION_SRC.happy} alt="TANQuu" width={160} height={160} className="drop-shadow-md wobble" />
        <h2 className="text-3xl font-bold text-tanquu-purple pop-in">ひみつ ゲット！！🎉</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-sm text-left space-y-3 pop-in">
          <p
            className="font-bold text-gray-500 text-sm"
            dangerouslySetInnerHTML={{ __html: `🔬 ${unit1.secretTitle}` }}
          />
          {unit1.secretPoints.map((p, i) => (
            <p
              key={i}
              className="text-gray-700 text-base before:content-['✦_']"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>
        <p className="text-tanquu-purple text-sm pop-in">コレクションに追加されたよ！</p>
      </div>
    )
  }

  // ── Derive display state ──
  let displayMsg = ''
  let isAnimating = false
  let showTapHint = false
  let isFbLastMsg = false
  let currentStepId = ''

  if (phase.name === 'animating') {
    isAnimating = true
    currentStepId = phase.stepId
  } else if (phase.name === 'shown') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[phase.msgIdx]
    showTapHint = phase.msgIdx < step.messages.length - 1
    currentStepId = phase.stepId
  } else if (phase.name === 'waiting') {
    const step = getStep(phase.stepId)
    displayMsg = step.messages[step.messages.length - 1]
    currentStepId = phase.stepId
  } else if (phase.name === 'fb_animating') {
    isAnimating = true
    currentStepId = phase.stepId
  } else if (phase.name === 'fb_shown') {
    displayMsg = phase.fb.messages[phase.msgIdx]
    isFbLastMsg = phase.msgIdx >= phase.fb.messages.length - 1
    showTapHint = !isFbLastMsg
    currentStepId = phase.stepId
  }

  const currentStep = currentStepId ? getStep(currentStepId) : null
  const visual = currentStep?.visual
  const hasVisual = Boolean(visual)

  // Unique key per bubble state for pop-in re-animation
  const bubbleKey = (() => {
    if (phase.name === 'animating')    return `anim-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'fb_animating') return `fbanim-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'shown')        return `msg-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'fb_shown')     return `fbmsg-${phase.stepId}-${phase.msgIdx}`
    if (phase.name === 'waiting') {
      const step = getStep(phase.stepId)
      return `msg-${phase.stepId}-${step.messages.length - 1}`
    }
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
          <button
            onClick={handleAdvance}
            className="bg-tanquu-purple text-white rounded-full px-10 py-4 text-lg font-bold shadow active:opacity-80 transition-opacity"
          >
            次へ →
          </button>
        </div>
      )
    }
  } else if (isFbLastMsg) {
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
  } else if (showTapHint) {
    bottomInput = (
      <div className="flex justify-center pb-4">
        <button
          onClick={handleTap}
          className="tap-hint text-tanquu-purple text-3xl px-8 py-2"
          aria-label="次のメッセージへ"
        >
          ▼
        </button>
      </div>
    )
  }

  // ── Render ──
  return (
    <div
      className="flex flex-col min-h-screen bg-tanquu-light max-w-sm mx-auto"
      onClick={handleSkipAnim}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-1">
        <span className="text-tanquu-purple font-bold text-xl">🐱 TANQuu</span>
        <span className="ml-auto text-sm text-gray-400">ひみつ ★☆☆☆☆</span>
      </div>

      {/* Progress dots */}
      <ProgressDots stepId={currentStepId} />

      {/* TANQuu character — smaller when visual is shown */}
      <div className="flex justify-center pt-1 pb-1">
        <Image
          key={emotion}
          src={EMOTION_SRC[emotion]}
          alt={`TANQuu ${emotion}`}
          width={hasVisual ? 120 : 180}
          height={hasVisual ? 120 : 180}
          className={`drop-shadow-md ${emotion === 'happy' ? 'wobble' : 'pop-in'}`}
          priority
        />
      </div>

      {/* Step visual (emoji or experiment component) */}
      {visual && <StepVisual key={currentStepId} visual={visual} />}

      {/* Speech bubble */}
      <div className="flex-1 px-4 py-2">
        <div key={bubbleKey} className="flex items-start gap-2 pop-in">
          {isAnimating ? <TypingDots /> : <Bubble text={displayMsg} />}
        </div>
      </div>

      {/* Bottom input (tap hint / choices / next button) */}
      <div className="mt-auto">{bottomInput}</div>
    </div>
  )
}
