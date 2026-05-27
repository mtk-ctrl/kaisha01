'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { STORAGE_KEYS } from '@/lib/storageKeys'

const ANIMALS = [
  {
    name: 'ネコ', color: '#FF6B9D', bg: '#FFE5EF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="12,46 24,14 38,44" fill="#FFACC7"/>
      <polygon points="62,44 76,14 88,46" fill="#FFACC7"/>
      <polygon points="16,44 24,20 36,43" fill="#FF85A1"/>
      <polygon points="64,43 76,20 84,44" fill="#FF85A1"/>
      <circle cx="50" cy="58" r="35" fill="#FFD4E8"/>
      <ellipse cx="36" cy="54" rx="7" ry="8" fill="#222"/>
      <ellipse cx="64" cy="54" rx="7" ry="8" fill="#222"/>
      <circle cx="38" cy="51" r="2.5" fill="white"/>
      <circle cx="66" cy="51" r="2.5" fill="white"/>
      <ellipse cx="50" cy="65" rx="4" ry="3" fill="#FF85A1"/>
      <path d="M43,71 Q50,77 57,71" stroke="#FF85A1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="5" y1="61" x2="36" y2="65" stroke="#ddd" stroke-width="2"/>
      <line x1="5" y1="69" x2="36" y2="69" stroke="#ddd" stroke-width="2"/>
      <line x1="64" y1="65" x2="95" y2="61" stroke="#ddd" stroke-width="2"/>
      <line x1="64" y1="69" x2="95" y2="69" stroke="#ddd" stroke-width="2"/>
    </svg>`,
  },
  {
    name: 'イヌ', color: '#FF8C42', bg: '#FFF0E5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="17" cy="52" rx="15" ry="23" fill="#C97D1A" transform="rotate(-18,17,52)"/>
      <ellipse cx="83" cy="52" rx="15" ry="23" fill="#C97D1A" transform="rotate(18,83,52)"/>
      <circle cx="50" cy="50" r="33" fill="#F5B942"/>
      <ellipse cx="50" cy="62" rx="15" ry="11" fill="#F5DC80"/>
      <ellipse cx="50" cy="57" rx="8" ry="6" fill="#444"/>
      <circle cx="48" cy="55.5" r="2" fill="#666"/>
      <circle cx="37" cy="44" r="6.5" fill="#4a3010"/>
      <circle cx="63" cy="44" r="6.5" fill="#4a3010"/>
      <circle cx="38.5" cy="41.5" r="2.5" fill="white"/>
      <circle cx="64.5" cy="41.5" r="2.5" fill="white"/>
      <path d="M40,70 Q50,78 60,70" stroke="#b06820" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="37" cy="82" rx="7" ry="5" fill="#FF6B9D" opacity="0.5"/>
      <ellipse cx="63" cy="82" rx="7" ry="5" fill="#FF6B9D" opacity="0.5"/>
    </svg>`,
  },
  {
    name: 'ハムスター', color: '#D97706', bg: '#FFFBE5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="22" cy="20" r="16" fill="#FFD4A0"/>
      <circle cx="78" cy="20" r="16" fill="#FFD4A0"/>
      <circle cx="22" cy="20" r="9" fill="#FFB6C1"/>
      <circle cx="78" cy="20" r="9" fill="#FFB6C1"/>
      <ellipse cx="14" cy="64" rx="15" ry="12" fill="#FFE5B4"/>
      <ellipse cx="86" cy="64" rx="15" ry="12" fill="#FFE5B4"/>
      <ellipse cx="50" cy="58" rx="34" ry="30" fill="#FFEAA0"/>
      <circle cx="38" cy="50" r="7" fill="#222"/>
      <circle cx="62" cy="50" r="7" fill="#222"/>
      <circle cx="40" cy="47" r="2.5" fill="white"/>
      <circle cx="64" cy="47" r="2.5" fill="white"/>
      <ellipse cx="50" cy="62" rx="4" ry="3.5" fill="#FF9EC1"/>
      <path d="M44,68 Q50,74 56,68" stroke="#FF9EC1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="22" y1="64" x2="40" y2="66" stroke="#ddd" stroke-width="1.5"/>
      <line x1="22" y1="70" x2="40" y2="70" stroke="#ddd" stroke-width="1.5"/>
      <line x1="60" y1="66" x2="78" y2="64" stroke="#ddd" stroke-width="1.5"/>
      <line x1="60" y1="70" x2="78" y2="70" stroke="#ddd" stroke-width="1.5"/>
    </svg>`,
  },
  {
    name: 'ゾウ', color: '#A855F7', bg: '#F5E5FF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="9" cy="44" rx="14" ry="24" fill="#C084FC"/>
      <ellipse cx="91" cy="44" rx="14" ry="24" fill="#C084FC"/>
      <ellipse cx="9" cy="44" rx="8" ry="16" fill="#DDD6FE"/>
      <ellipse cx="91" cy="44" rx="8" ry="16" fill="#DDD6FE"/>
      <circle cx="50" cy="42" r="30" fill="#E9D5FF"/>
      <path d="M34,63 Q23,79 28,91 Q34,98 40,88 Q42,78 36,70" stroke="#C084FC" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="36" cy="33" r="6" fill="#333"/>
      <circle cx="64" cy="33" r="6" fill="#333"/>
      <circle cx="37.5" cy="30.5" r="2.5" fill="white"/>
      <circle cx="65.5" cy="30.5" r="2.5" fill="white"/>
      <path d="M40,52 Q50,58 60,52" stroke="#C084FC" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="36" cy="82" rx="6" ry="4" fill="#FF6B9D" opacity="0.4"/>
      <ellipse cx="64" cy="82" rx="6" ry="4" fill="#FF6B9D" opacity="0.4"/>
    </svg>`,
  },
  {
    name: 'キリン', color: '#0D9488', bg: '#E5FFFD',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="32" y="1" width="8" height="16" rx="4" fill="#78716C"/>
      <rect x="60" y="1" width="8" height="16" rx="4" fill="#78716C"/>
      <circle cx="36" cy="1" r="5.5" fill="#78716C"/>
      <circle cx="64" cy="1" r="5.5" fill="#78716C"/>
      <ellipse cx="50" cy="58" rx="29" ry="35" fill="#FDE68A"/>
      <ellipse cx="26" cy="40" rx="8" ry="6" fill="#92400E" opacity="0.5"/>
      <ellipse cx="70" cy="35" rx="6" ry="8" fill="#92400E" opacity="0.5"/>
      <ellipse cx="32" cy="62" rx="7" ry="5" fill="#92400E" opacity="0.5"/>
      <ellipse cx="68" cy="66" rx="6" ry="7" fill="#92400E" opacity="0.5"/>
      <ellipse cx="52" cy="28" rx="5" ry="6" fill="#92400E" opacity="0.5"/>
      <ellipse cx="36" cy="30" rx="6" ry="5" fill="#222"/>
      <ellipse cx="64" cy="30" rx="6" ry="5" fill="#222"/>
      <circle cx="37.5" cy="27.5" r="2.5" fill="white"/>
      <circle cx="65.5" cy="27.5" r="2.5" fill="white"/>
      <circle cx="43" cy="73" r="3.5" fill="#B45309"/>
      <circle cx="57" cy="73" r="3.5" fill="#B45309"/>
      <path d="M40,80 Q50,87 60,80" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
]

const CORRECT_MSGS = ['せいかい！', 'やったね！', 'すごい！', 'かんぺき！', 'ナイス！', 'さすが！', 'よくできた！']
const WRONG_MSGS   = ['おしい！もうすこし！', 'つぎはできる！', 'もういちどかんがえよう！']

type AnimalData = typeof ANIMALS[number]

interface QuestionData {
  type: 'add' | 'sub'
  subType?: 'difference' | 'leaving'
  a: number
  b: number
  answer: number
  animal1: AnimalData
  animal2?: AnimalData
  formula: string
  formulaSpeech: string
  questionText: string
  speechText: string
}

type Phase = 'menu' | 'game' | 'result'
type GameMode = 'add' | 'sub'
type AnswerType = '4' | 'input'

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function pickAnimal(exclude?: AnimalData | null): AnimalData {
  const pool = exclude ? ANIMALS.filter(a => a !== exclude) : ANIMALS
  return pool[Math.floor(Math.random() * pool.length)]
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

function makeQuestion(mode: GameMode, level: number): QuestionData {
  const max = level

  if (mode === 'add') {
    const answer = Math.floor(Math.random() * (max - 1)) + 2
    const a = Math.floor(Math.random() * (answer - 1)) + 1
    const b = answer - a
    const a1 = pickAnimal(null)
    const a2 = pickAnimal(a1)
    const tmpl = rand([
      { questionText: `${a1.name}が ${a}ひき、${a2.name}が ${b}ひきいます。\nあわせて なんひきですか？`, speechText: `${a1.name}が${a}ひき、${a2.name}が${b}ひき。あわせてなんひきですか？` },
      { questionText: `${a1.name}が ${a}ひきいます。\nそこへ ${a2.name}が ${b}ひき やってきました。\nぜんぶで なんひきですか？`, speechText: `${a1.name}が${a}ひき。${a2.name}が${b}ひきやってきました。ぜんぶでなんひきですか？` },
      { questionText: `${a1.name}のどうぶつえんに ${a}ひき、\n${a2.name}のどうぶつえんに ${b}ひきいます。\nあわせて なんひきですか？`, speechText: `${a1.name}のどうぶつえんに${a}ひき、${a2.name}のどうぶつえんに${b}ひき。あわせてなんひきですか？` },
    ])
    return { type: 'add', a, b, answer, animal1: a1, animal2: a2, formula: `${a1.name} ${a} ＋ ${a2.name} ${b} ＝ ${answer}`, formulaSpeech: `${a}たす${b}は${answer}`, questionText: tmpl.questionText, speechText: tmpl.speechText }
  } else {
    const useDiff = Math.random() < 0.4
    if (useDiff) {
      const aCount = Math.floor(Math.random() * (max - 1)) + 2
      const bCount = Math.floor(Math.random() * (aCount - 1)) + 1
      const answer = aCount - bCount
      const a1 = pickAnimal(null)
      const a2 = pickAnimal(a1)
      const tmpl = rand([
        { questionText: `${a1.name}が ${aCount}ひき、${a2.name}が ${bCount}ひきいます。\n${a1.name}は ${a2.name}より なんひきおおいですか？`, speechText: `${a1.name}が${aCount}ひき、${a2.name}が${bCount}ひき。${a1.name}は${a2.name}よりなんひきおおいですか？` },
        { questionText: `${a1.name}が ${aCount}ひき、${a2.name}が ${bCount}ひきいます。\nちがいは なんひきですか？`, speechText: `${a1.name}が${aCount}ひき、${a2.name}が${bCount}ひき。ちがいはなんひきですか？` },
      ])
      return { type: 'sub', subType: 'difference', a: aCount, b: bCount, answer, animal1: a1, animal2: a2, formula: `${a1.name} ${aCount} ー ${a2.name} ${bCount} ＝ ${answer}`, formulaSpeech: `${aCount}ひく${bCount}は${answer}`, questionText: tmpl.questionText, speechText: tmpl.speechText }
    } else {
      const total = Math.floor(Math.random() * (max - 1)) + 2
      const removed = Math.floor(Math.random() * (total - 1)) + 1
      const answer = total - removed
      const a1 = pickAnimal(null)
      const tmpl = rand([
        { questionText: `${a1.name}が ${total}ひきいます。\n${removed}ひきかえりました。\nのこりは なんひきですか？`, speechText: `${a1.name}が${total}ひき。${removed}ひきかえりました。のこりはなんひきですか？` },
        { questionText: `${a1.name}が ${total}ひきいます。\n${removed}ひきが にげてしまいました！\nのこりは なんひきですか？`, speechText: `${a1.name}が${total}ひき。${removed}ひきがにげてしまいました！のこりはなんひきですか？` },
      ])
      return { type: 'sub', subType: 'leaving', a: total, b: removed, answer, animal1: a1, formula: `${a1.name} ${total} ー ${removed} ＝ ${answer}`, formulaSpeech: `${total}ひく${removed}は${answer}`, questionText: tmpl.questionText, speechText: tmpl.speechText }
    }
  }
}

interface FireworkParticle {
  x: number; y: number; px?: number; py?: number
  vx: number; vy: number
  color: string; alpha: number; size: number; decay: number
  shape: 'circle' | 'rect' | 'line'
}

const FW_COLORS = ['#FF6B9D','#FFD700','#5B8DEF','#4ECDC4','#A855F7','#FF8C42','#FF4757','#00D2FF','#43E97B','#F9CA24']

function AnimalDisplay({ q }: { q: QuestionData }) {
  function AnimalGroup({ animal, count, leaving }: { animal: AnimalData; count: number; leaving?: number }) {
    const small = count > 10
    const staying = leaving !== undefined ? count - leaving : count
    return (
      <div className="flex flex-col items-center gap-1">
        {leaving !== undefined && (
          <div className="text-xs font-bold text-gray-600">{animal.name} {count}ひき</div>
        )}
        <div className={`flex flex-wrap justify-center gap-1 max-w-[160px]`}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`inline-block ${small ? 'w-8 h-8' : 'w-10 h-10'} ${leaving !== undefined && i >= staying ? 'opacity-25' : ''}`}
              dangerouslySetInnerHTML={{ __html: animal.svg }}
            />
          ))}
        </div>
        {leaving !== undefined && (
          <div className="text-xs font-bold text-orange-500">{leaving}ひき かえった 👋</div>
        )}
        {leaving === undefined && (
          <div className="text-xs font-bold" style={{ color: animal.color }}>{animal.name} {count}ひき</div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      {q.type === 'add' && q.animal2 && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <AnimalGroup animal={q.animal1} count={q.a} />
          <div className="text-2xl font-black text-gray-500">＋</div>
          <AnimalGroup animal={q.animal2} count={q.b} />
          <div className="text-2xl font-black text-gray-500">＝</div>
          <div className="text-4xl font-black text-gray-400">？</div>
        </div>
      )}
      {q.type === 'sub' && q.subType === 'difference' && q.animal2 && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <AnimalGroup animal={q.animal1} count={q.a} />
          <div className="text-2xl font-black text-gray-500">－</div>
          <AnimalGroup animal={q.animal2} count={q.b} />
          <div className="text-2xl font-black text-gray-500">＝</div>
          <div className="text-4xl font-black text-gray-400">？</div>
        </div>
      )}
      {q.type === 'sub' && q.subType === 'leaving' && (
        <div className="flex justify-center">
          <AnimalGroup animal={q.animal1} count={q.a} leaving={q.b} />
        </div>
      )}
    </div>
  )
}

function FireworksCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

function saveAnimalsBest(pct: number) {
  try {
    const key = getDataKey(STORAGE_KEYS.ANIMALS_BEST)
    const raw = localStorage.getItem(key)
    const current = raw ? (JSON.parse(raw) as { best: number }).best || 0 : 0
    if (pct > current) {
      localStorage.setItem(key, JSON.stringify({ best: pct }))
    }
  } catch {}
}

export default function AnimalsPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [mode, setMode] = useState<GameMode>('add')
  const [answerType, setAnswerType] = useState<AnswerType>('4')
  const [level, setLevel] = useState<number>(10)
  const [count, setCount] = useState<number>(5)

  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [current, setCurrent] = useState(0)
  const [scoreState, setScoreState] = useState(0)
  const [results, setResults] = useState<{ correct: boolean; formula: string }[]>([])
  const [numpadVal, setNumpadVal] = useState('')
  const [answered, setAnswered] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayOk, setOverlayOk] = useState(false)
  const [overlayFormula, setOverlayFormula] = useState('')
  const [streak, setStreakState] = useState(0)
  const [chosenVal, setChosenVal] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FireworkParticle[]>([])
  const animIdRef = useRef<number | null>(null)

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const fireworksBurst = useCallback((x: number, y: number, big: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const count2 = big ? 90 : 55
    const col1 = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)]
    const col2 = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)]
    const spd = big ? 6 : 3.5
    for (let i = 0; i < count2; i++) {
      const angle = (Math.PI * 2 / count2) * i + (Math.random() - 0.5) * 0.4
      const v = spd + Math.random() * spd
      particlesRef.current.push({
        x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        color: Math.random() < 0.5 ? col1 : col2,
        alpha: 1, size: (big ? 4 : 3) + Math.random() * 3,
        decay: 0.013 + Math.random() * 0.012, shape: Math.random() < 0.6 ? 'circle' : 'rect',
      })
    }
    for (let i = 0; i < (big ? 22 : 10); i++) {
      const angle = Math.random() * Math.PI * 2
      const v = (big ? 9 : 6) + Math.random() * 5
      particlesRef.current.push({
        x, y, px: x, py: y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        color: '#FFFDE7', alpha: 1, size: 2.5, decay: 0.025, shape: 'line',
      })
    }
  }, [])

  const fireworksTickRef = useRef<() => void>(() => {})

  useEffect(() => {
    fireworksTickRef.current = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        if (p.shape === 'line') { p.px = p.x; p.py = p.y }
        p.x += p.vx; p.y += p.vy
        p.vy += 0.11; p.vx *= 0.98
        p.alpha -= p.decay
        if (p.alpha <= 0) { particlesRef.current.splice(i, 1); continue }
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.strokeStyle = p.color
        if (p.shape === 'circle') {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()
        } else if (p.shape === 'rect') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.vx * 0.3)
          ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size); ctx.restore()
        } else {
          ctx.lineWidth = 2.5
          ctx.beginPath(); ctx.moveTo(p.px ?? p.x, p.py ?? p.y); ctx.lineTo(p.x, p.y); ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
      if (particlesRef.current.length > 0) animIdRef.current = requestAnimationFrame(fireworksTickRef.current)
      else animIdRef.current = null
    }
  })

  const fireworksFire = useCallback((n: number, big: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const x = canvas.width * (0.12 + Math.random() * 0.76)
        const y = canvas.height * (0.06 + Math.random() * 0.42)
        fireworksBurst(x, y, big)
      }, i * 240)
    }
    if (!animIdRef.current) animIdRef.current = requestAnimationFrame(fireworksTickRef.current)
  }, [fireworksBurst])

  const fireworksStop = useCallback(() => {
    particlesRef.current = []
    if (animIdRef.current) { cancelAnimationFrame(animIdRef.current); animIdRef.current = null }
    const canvas = canvasRef.current
    if (canvas) { const ctx = canvas.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height) }
  }, [])

  const startGame = useCallback(() => {
    const qs: QuestionData[] = []
    for (let i = 0; i < count; i++) qs.push(makeQuestion(mode, level))
    setQuestions(qs)
    setCurrent(0)
    setScoreState(0)
    setResults([])
    setNumpadVal('')
    setAnswered(false)
    setShowOverlay(false)
    setStreakState(0)
    setChosenVal(null)
    fireworksStop()
    setPhase('game')
    speak(qs[0].speechText)
  }, [mode, level, count, fireworksStop])

  const checkAnswer = useCallback((selected: number) => {
    if (answered) return
    setAnswered(true)
    const q = questions[current]
    const isOK = selected === q.answer
    setChosenVal(selected)

    if (isOK) {
      setScoreState(prev => prev + 1)
      fireworksFire(6, false)
    }

    setResults(prev => [...prev, { correct: isOK, formula: q.formula }])

    const newStreak = isOK ? streak + 1 : 0
    setStreakState(newStreak)

    setTimeout(() => {
      setOverlayOk(isOK)
      setOverlayFormula(q.formula)
      setShowOverlay(true)
      if (isOK) {
        const msg = rand(CORRECT_MSGS)
        const streakMsg = newStreak >= 3 ? `${newStreak}もんれんぞく！` : ''
        speak(streakMsg + msg + q.formulaSpeech)
      } else {
        speak(rand(WRONG_MSGS) + 'こたえは' + q.formulaSpeech)
      }
    }, 420)
  }, [answered, questions, current, streak, fireworksFire])

  const nextQuestion = useCallback(() => {
    const nextIdx = current + 1
    setShowOverlay(false)
    setChosenVal(null)
    if (nextIdx >= count) {
      const correctCount = results.filter(r => r.correct).length + (overlayOk ? 1 : 0)
      const total = count
      const pct = Math.round(correctCount / total * 100)
      const isPerfect = correctCount === total

      saveAnimalsBest(pct)
      saveScore('youji-animals', correctCount, total, `${mode}-${level}`)

      setPhase('result')

      if (isPerfect) {
        let cnt = 0
        const iv = setInterval(() => {
          fireworksFire(3, true)
          cnt++
          if (cnt >= 10) clearInterval(iv)
        }, 500)
        speak('すばらしい！ぜんもんせいかいです！おめでとう！')
      } else if (pct >= 80) {
        fireworksFire(8, true)
        speak('すごい！よくできました！おめでとう！')
      } else if (pct >= 50) {
        fireworksFire(4, false)
        speak('よくできました！またれんしゅうしてね！')
      } else {
        fireworksFire(2, false)
        speak('またれんしゅうしてね！')
      }
    } else {
      setCurrent(nextIdx)
      setAnswered(false)
      setNumpadVal('')
      speak(questions[nextIdx].speechText)
    }
  }, [current, count, results, overlayOk, mode, level, fireworksFire, questions])

  const numpadPress = useCallback((n: string) => {
    if (answered) return
    if (numpadVal.length >= 2) return
    setNumpadVal(prev => prev + n)
  }, [answered, numpadVal])

  const numpadDelete = useCallback(() => {
    if (answered) return
    setNumpadVal(prev => prev.slice(0, -1))
  }, [answered])

  const numpadConfirm = useCallback(() => {
    if (answered || !numpadVal) return
    checkAnswer(parseInt(numpadVal, 10))
  }, [answered, numpadVal, checkAnswer])

  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
        <FireworksCanvas canvasRef={canvasRef} />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🐾 どうぶつ さんすう</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-center gap-3 mb-3">
              {ANIMALS.map(a => (
                <div key={a.name} className="w-12 h-12" dangerouslySetInnerHTML={{ __html: a.svg }} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいのしゅるい</p>
            <div className="flex gap-3">
              {([{ id: 'add' as GameMode, label: 'たしざん ＋' }, { id: 'sub' as GameMode, label: 'ひきざん －' }]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${mode === m.id ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-700'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">こたえかた</p>
            <div className="flex gap-3">
              {([{ id: '4' as AnswerType, label: '4たくボタン' }, { id: 'input' as AnswerType, label: 'かずを おす' }]).map(a => (
                <button
                  key={a.id}
                  onClick={() => setAnswerType(a.id)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${answerType === a.id ? 'bg-yellow-400 text-white' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">かずの おおきさ</p>
            <div className="flex gap-3">
              {[10, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setLevel(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${level === n ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-700'}`}
                >
                  {n}いか
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいのかず</p>
            <div className="flex gap-3">
              {[5, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${count === n ? 'bg-yellow-400 text-white' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #fb923c, #f59e0b)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'game') {
    const q = questions[current]
    const pct = (current / count) * 100
    const max = level + 5

    const choices: number[] = []
    if (answerType === '4') {
      const wrongs = new Set<number>()
      let attempts = 0
      while (wrongs.size < 3 && attempts < 200) {
        attempts++
        const offset = Math.floor(Math.random() * 8) - 4
        const w = q.answer + (offset === 0 ? 1 : offset)
        if (w > 0 && w <= max && w !== q.answer) wrongs.add(w)
      }
      choices.push(...Array.from(wrongs).concat(q.answer).sort(() => Math.random() - 0.5))
    }

    return (
      <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
        <FireworksCanvas canvasRef={canvasRef} />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => { speak(''); fireworksStop(); setPhase('menu') }}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{current + 1} / {count}</span>
                <span>スコア: {scoreState}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #fb923c, #f59e0b)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-700 whitespace-pre-line mb-4 text-center leading-relaxed">{q.questionText}</p>
            <AnimalDisplay q={q} />
          </div>

          {answerType === '4' && (
            <div className="grid grid-cols-2 gap-3">
              {choices.map((val, i) => {
                let btnClass = 'w-full py-4 rounded-2xl text-2xl font-black transition-all '
                if (!answered) {
                  btnClass += 'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
                } else if (val === q.answer) {
                  btnClass += 'bg-green-100 text-green-700 border-2 border-green-400'
                } else if (val === chosenVal && val !== q.answer) {
                  btnClass += 'bg-red-100 text-red-600 border-2 border-red-400 opacity-70'
                } else {
                  btnClass += 'bg-gray-100 text-gray-400 opacity-50'
                }
                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => checkAnswer(val)}
                    disabled={answered}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          )}

          {answerType === 'input' && (
            <div className="bg-white rounded-2xl shadow-md p-4">
              <div className="text-4xl font-black text-center text-gray-700 mb-4 h-12 flex items-center justify-center">
                {numpadVal || '？'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['1','2','3','4','5','6','7','8','9'].map(n => (
                  <button
                    key={n}
                    onClick={() => numpadPress(n)}
                    disabled={answered}
                    className="py-3 rounded-xl text-xl font-black bg-orange-50 text-orange-700 active:scale-95 disabled:opacity-40"
                  >
                    {n}
                  </button>
                ))}
                <button onClick={numpadDelete} disabled={answered} className="py-3 rounded-xl text-xl font-black bg-gray-100 text-gray-600 active:scale-95 disabled:opacity-40">
                  ←
                </button>
                <button onClick={() => numpadPress('0')} disabled={answered} className="py-3 rounded-xl text-xl font-black bg-orange-50 text-orange-700 active:scale-95 disabled:opacity-40">
                  0
                </button>
                <button onClick={numpadConfirm} disabled={answered} className="py-3 rounded-xl text-xl font-black bg-orange-400 text-white active:scale-95 disabled:opacity-40">
                  ✓
                </button>
              </div>
            </div>
          )}

          {showOverlay && (
            <div className={`rounded-2xl p-5 text-center ${overlayOk ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-4xl font-black mb-2 ${overlayOk ? 'text-green-600' : 'text-red-500'}`}>
                {overlayOk ? '○' : '✕'}
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">{overlayFormula}</p>
              {streak >= 3 && overlayOk && (
                <p className="text-orange-500 font-black text-sm mb-2">🔥 {streak}もんれんぞく！</p>
              )}
              <button
                onClick={nextQuestion}
                className="mt-2 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #fb923c, #f59e0b)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // result phase
  const correctCount = results.filter(r => r.correct).length
  const total = count
  const pctResult = Math.round(correctCount / total * 100)
  const isPerfect = correctCount === total
  let title = 'れんしゅうしよう！', emoji = '💪'
  if (isPerfect) { title = '🎉 ぜんもんせいかい！！！ 🎉'; emoji = '🌈' }
  else if (pctResult >= 80) { title = '✨ すごい！！'; emoji = '😄' }
  else if (pctResult >= 50) { title = '👍 よくできました！'; emoji = '😊' }
  const stars = Math.round(pctResult / 100 * 3)

  return (
    <div className="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pb-20">
      <FireworksCanvas canvasRef={canvasRef} />
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🐾 けっか</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-lg font-black text-gray-800 mb-3">{title}</h2>
          <div className="text-3xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-black text-orange-500">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-500">{pctResult}%</div>
              <div className="text-xs text-gray-500">せいかいりつ</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm p-2 rounded-xl ${r.correct ? 'bg-green-50' : 'bg-red-50'}`}>
              <span className={`font-black ${r.correct ? 'text-green-600' : 'text-red-500'}`}>{r.correct ? '○' : '✕'}</span>
              <span className="text-gray-700 text-xs">{r.formula}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #fb923c, #f59e0b)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-orange-700 text-lg text-center bg-orange-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
