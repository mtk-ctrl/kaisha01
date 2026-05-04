export type Emotion = 'happy' | 'angry' | 'sad' | 'mischievous' | 'surprised'

export type ChoiceFeedback = {
  emotion: Emotion
  messages: string[]
}

export type Choice = {
  id: string
  label: string
  feedback: ChoiceFeedback
}

export type Step = {
  id: string
  emotion: Emotion
  visual?: string
  messages: string[]
  input:
    | { type: 'next'; nextStep: string | null }
    | { type: 'choices'; choices: Choice[]; nextStep: string | null }
}

export type Unit = {
  id: string
  title: string
  hook: string        // short question shown on home screen card
  emoji: string       // unit card emoji
  secretTitle: string
  secretPoints: string[]
  steps: Step[]
}
