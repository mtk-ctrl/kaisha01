'use client'

import React, { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'

// ============================================================
// ひらがな どっちかな？  — 115問フルデータ
// ============================================================
interface QuizItem {
  correct: string
  wrong: string
  speech: string
}

const QUIZ_DATA: QuizItem[] = [
  /* ── おう vs おお（長音） ── */
  { correct: 'おうえん',     wrong: 'おおえん',     speech: 'おうえん、どっちかな？' },
  { correct: 'おとうさん',   wrong: 'おとおさん',   speech: 'おとうさん、どっちかな？' },
  { correct: 'おとうと',     wrong: 'おとおと',     speech: 'おとうと（弟）、どっちかな？' },
  { correct: 'こうえん',     wrong: 'こおえん',     speech: 'こうえん（公園）、どっちかな？' },
  { correct: 'とうふ',       wrong: 'とおふ',       speech: 'とうふ、どっちかな？' },
  { correct: 'どうぶつ',     wrong: 'どおぶつ',     speech: 'どうぶつ（動物）、どっちかな？' },
  { correct: 'こうもり',     wrong: 'こおもり',     speech: 'こうもり、どっちかな？' },
  { correct: 'もうふ',       wrong: 'もおふ',       speech: 'もうふ（毛布）、どっちかな？' },
  { correct: 'ろうそく',     wrong: 'ろおそく',     speech: 'ろうそく、どっちかな？' },
  { correct: 'ほうき',       wrong: 'ほおき',       speech: 'ほうき、どっちかな？' },
  { correct: 'ほうれんそう', wrong: 'ほおれんそう', speech: 'ほうれんそう、どっちかな？' },
  { correct: 'りょうり',     wrong: 'りょおり',     speech: 'りょうり（料理）、どっちかな？' },
  { correct: 'おうさま',     wrong: 'おおさま',     speech: 'おうさま（王様）、どっちかな？' },
  { correct: 'こうちょう',   wrong: 'こおちょう',   speech: 'こうちょう（校長）、どっちかな？' },
  { correct: 'どうぞ',       wrong: 'どおぞ',       speech: 'どうぞ、どっちかな？' },
  { correct: 'どうも',       wrong: 'どおも',       speech: 'どうも、どっちかな？' },
  { correct: 'とうもろこし', wrong: 'とおもろこし', speech: 'とうもろこし、どっちかな？' },
  { correct: 'もうすぐ',     wrong: 'もおすぐ',     speech: 'もうすぐ、どっちかな？' },
  { correct: 'こうこう',     wrong: 'こおこお',     speech: 'こうこう（高校）、どっちかな？' },
  { correct: 'どうろ',       wrong: 'どおろ',       speech: 'どうろ（道路）、どっちかな？' },
  /* ── おお vs おう（おおが正解の語） ── */
  { correct: 'おおきい',     wrong: 'おうきい',     speech: 'おおきい（大きい）、どっちかな？' },
  { correct: 'おおかみ',     wrong: 'おうかみ',     speech: 'おおかみ（狼）、どっちかな？' },
  { correct: 'おおい',       wrong: 'おうい',       speech: 'おおい（多い）、どっちかな？' },
  { correct: 'とおい',       wrong: 'とうい',       speech: 'とおい（遠い）、どっちかな？' },
  { correct: 'とおる',       wrong: 'とうる',       speech: 'とおる（通る）、どっちかな？' },
  { correct: 'おおぞら',     wrong: 'おうぞら',     speech: 'おおぞら（大空）、どっちかな？' },
  { correct: 'こおり',       wrong: 'こうり',       speech: 'こおり（氷）、どっちかな？' },
  { correct: 'とおく',       wrong: 'とうく',       speech: 'とおく（遠く）、どっちかな？' },
  { correct: 'おおや',       wrong: 'おうや',       speech: 'おおや（大家）、どっちかな？' },
  { correct: 'とおか',       wrong: 'とうか',       speech: 'とおか（十日）、どっちかな？' },
  /* ── えい vs ええ（長音） ── */
  { correct: 'えいが',       wrong: 'ええが',       speech: 'えいが（映画）、どっちかな？' },
  { correct: 'えいご',       wrong: 'ええご',       speech: 'えいご（英語）、どっちかな？' },
  { correct: 'えいきょう',   wrong: 'ええきょう',   speech: 'えいきょう（影響）、どっちかな？' },
  { correct: 'せんせい',     wrong: 'せんせえ',     speech: 'せんせい（先生）、どっちかな？' },
  { correct: 'おねえさん',   wrong: 'おねいさん',   speech: 'おねえさん、どっちかな？' },
  { correct: 'けいさん',     wrong: 'けえさん',     speech: 'けいさん（計算）、どっちかな？' },
  { correct: 'めいわく',     wrong: 'めえわく',     speech: 'めいわく（迷惑）、どっちかな？' },
  { correct: 'とけい',       wrong: 'とけえ',       speech: 'とけい（時計）、どっちかな？' },
  { correct: 'えいゆう',     wrong: 'ええゆう',     speech: 'えいゆう（英雄）、どっちかな？' },
  { correct: 'おおぜい',     wrong: 'おおぜえ',     speech: 'おおぜい（大勢）、どっちかな？' },
  /* ── ず vs づ ── */
  { correct: 'つづく',       wrong: 'つずく',       speech: 'つづく（続く）、どっちかな？' },
  { correct: 'こづかい',     wrong: 'こずかい',     speech: 'こづかい（小遣い）、どっちかな？' },
  { correct: 'かたづける',   wrong: 'かたずける',   speech: 'かたづける（片付ける）、どっちかな？' },
  { correct: 'つづき',       wrong: 'つずき',       speech: 'つづき（続き）、どっちかな？' },
  { correct: 'ちかづく',     wrong: 'ちかずく',     speech: 'ちかづく（近づく）、どっちかな？' },
  { correct: 'こづつみ',     wrong: 'こずつみ',     speech: 'こづつみ（小包）、どっちかな？' },
  { correct: 'てつづき',     wrong: 'てつずき',     speech: 'てつづき（手続き）、どっちかな？' },
  { correct: 'みずうみ',     wrong: 'みづうみ',     speech: 'みずうみ（湖）、どっちかな？' },
  { correct: 'かたづけ',     wrong: 'かたずけ',     speech: 'かたづけ（片付け）、どっちかな？' },
  { correct: 'みちづれ',     wrong: 'みちずれ',     speech: 'みちづれ（道連れ）、どっちかな？' },
  /* ── じ vs ぢ ── */
  { correct: 'はなぢ',       wrong: 'はなじ',       speech: 'はなぢ（鼻血）、どっちかな？' },
  { correct: 'ちぢむ',       wrong: 'ちじむ',       speech: 'ちぢむ（縮む）、どっちかな？' },
  { correct: 'こぢんまり',   wrong: 'こじんまり',   speech: 'こぢんまり、どっちかな？' },
  { correct: 'ちぢれる',     wrong: 'ちじれる',     speech: 'ちぢれる（縮れる）、どっちかな？' },
  { correct: 'ちかぢか',     wrong: 'ちかじか',     speech: 'ちかぢか（近々）、どっちかな？' },
  /* ── 促音（っ）あり vs なし ── */
  { correct: 'きって',       wrong: 'きて',         speech: 'きって（切手）、どっちかな？' },
  { correct: 'きっぷ',       wrong: 'きぷ',         speech: 'きっぷ（切符）、どっちかな？' },
  { correct: 'いっぱい',     wrong: 'いぱい',       speech: 'いっぱい、どっちかな？' },
  { correct: 'ざっし',       wrong: 'ざし',         speech: 'ざっし（雑誌）、どっちかな？' },
  { correct: 'ちょっと',     wrong: 'ちょと',       speech: 'ちょっと、どっちかな？' },
  { correct: 'もっと',       wrong: 'もと',         speech: 'もっと、どっちかな？' },
  { correct: 'ずっと',       wrong: 'ずと',         speech: 'ずっと、どっちかな？' },
  { correct: 'きっと',       wrong: 'きと',         speech: 'きっと、どっちかな？' },
  { correct: 'はっきり',     wrong: 'はきり',       speech: 'はっきり、どっちかな？' },
  { correct: 'やっぱり',     wrong: 'やぱり',       speech: 'やっぱり、どっちかな？' },
  { correct: 'いっしょ',     wrong: 'いしょ',       speech: 'いっしょ（一緒）、どっちかな？' },
  { correct: 'まっすぐ',     wrong: 'ますぐ',       speech: 'まっすぐ、どっちかな？' },
  { correct: 'べっそう',     wrong: 'べそう',       speech: 'べっそう（別荘）、どっちかな？' },
  { correct: 'けっして',     wrong: 'けして',       speech: 'けっして（決して）、どっちかな？' },
  { correct: 'はっぱ',       wrong: 'はぱ',         speech: 'はっぱ（葉っぱ）、どっちかな？' },
  { correct: 'ろっぽんぎ',   wrong: 'ろぽんぎ',     speech: 'ろっぽんぎ（六本木）、どっちかな？' },
  { correct: 'さっか',       wrong: 'さか',         speech: 'さっか（作家）、どっちかな？' },
  { correct: 'ほっかいどう', wrong: 'ほかいどう',   speech: 'ほっかいどう（北海道）、どっちかな？' },
  { correct: 'まって',       wrong: 'まて',         speech: 'まって（待って）、どっちかな？' },
  { correct: 'いって',       wrong: 'いて',         speech: 'いって（行って）、どっちかな？' },
  /* ── 拗音（小さいゃゅょ）vs 大文字（やゆよ） ── */
  { correct: 'しゃかい',     wrong: 'しやかい',     speech: 'しゃかい（社会）、どっちかな？' },
  { correct: 'じゅぎょう',   wrong: 'じゆぎょう',   speech: 'じゅぎょう（授業）、どっちかな？' },
  { correct: 'きょうしつ',   wrong: 'きよしつ',     speech: 'きょうしつ（教室）、どっちかな？' },
  { correct: 'ちょうちょ',   wrong: 'ちよちよ',     speech: 'ちょうちょ（蝶々）、どっちかな？' },
  { correct: 'りょこう',     wrong: 'りよこう',     speech: 'りょこう（旅行）、どっちかな？' },
  { correct: 'びょういん',   wrong: 'びよういん',   speech: 'びょういん（病院）、どっちかな？' },
  { correct: 'にゅうがく',   wrong: 'にゆうがく',   speech: 'にゅうがく（入学）、どっちかな？' },
  { correct: 'しゅくだい',   wrong: 'しゆくだい',   speech: 'しゅくだい（宿題）、どっちかな？' },
  { correct: 'きゃく',       wrong: 'きやく',       speech: 'きゃく（客）、どっちかな？' },
  { correct: 'ぎゅうにゅう', wrong: 'ぎゆうにゆう', speech: 'ぎゅうにゅう（牛乳）、どっちかな？' },
  { correct: 'しょうがく',   wrong: 'しよがく',     speech: 'しょうがく（小学）、どっちかな？' },
  { correct: 'ちゅうがく',   wrong: 'ちゆうがく',   speech: 'ちゅうがく（中学）、どっちかな？' },
  { correct: 'きゅうしょく', wrong: 'きゆうしよく', speech: 'きゅうしょく（給食）、どっちかな？' },
  { correct: 'じゃんけん',   wrong: 'じやんけん',   speech: 'じゃんけん、どっちかな？' },
  { correct: 'おちゃ',       wrong: 'おちや',       speech: 'おちゃ（お茶）、どっちかな？' },
  /* ── は（助詞）vs わ ── */
  { correct: 'わたしは',     wrong: 'わたしわ',     speech: 'わたしは（わたしは〜）、どっちかな？' },
  { correct: 'きょうは',     wrong: 'きょうわ',     speech: 'きょうは（今日は）、どっちかな？' },
  { correct: 'ともだちは',   wrong: 'ともだちわ',   speech: 'ともだちは（友達は）、どっちかな？' },
  /* ── へ（助詞）vs え ── */
  { correct: 'がっこうへ',   wrong: 'がっこうえ',   speech: 'がっこうへ（学校へ）、どっちかな？' },
  { correct: 'うちへ',       wrong: 'うちえ',       speech: 'うちへ（家へ）、どっちかな？' },
  /* ── を（助詞）vs お ── */
  { correct: 'ほんを',       wrong: 'ほんお',       speech: 'ほんを（本を）、どっちかな？' },
  { correct: 'みずを',       wrong: 'みずお',       speech: 'みずを（水を）、どっちかな？' },
  /* ── おかあさん / おにいさん型（長音 あ行） ── */
  { correct: 'おかあさん',   wrong: 'おかーさん',   speech: 'おかあさん、どっちかな？' },
  { correct: 'おにいさん',   wrong: 'おにーさん',   speech: 'おにいさん、どっちかな？' },
  { correct: 'おじいさん',   wrong: 'おじーさん',   speech: 'おじいさん、どっちかな？' },
  { correct: 'おばあさん',   wrong: 'おばーさん',   speech: 'おばあさん、どっちかな？' },
]

const HIRAGANA_BEST_KEY = 'tanq_hiragana_best_v1'

interface HiraganaBest {
  best: number
  stickers: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    u.pitch = 1.2
    window.speechSynthesis.speak(u)
  } catch {}
}

function loadBest(): HiraganaBest {
  try {
    const key = getDataKey(HIRAGANA_BEST_KEY)
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as HiraganaBest) : { best: 0, stickers: 0 }
  } catch {
    return { best: 0, stickers: 0 }
  }
}

function saveBest(correct: number, total: number) {
  try {
    const key = getDataKey(HIRAGANA_BEST_KEY)
    const prev = loadBest()
    const pct = correct / total
    const newBest = correct > prev.best ? correct : prev.best
    const newStickers = pct >= 0.8 ? prev.stickers + 1 : prev.stickers
    localStorage.setItem(key, JSON.stringify({ best: newBest, stickers: newStickers }))
  } catch {}
}

interface Question {
  item: QuizItem
  choices: [string, string]
}

interface LogEntry {
  question: Question
  chosen: string
  ok: boolean
}

type Phase = 'menu' | 'game' | 'result'

function fireConfetti(canvas: HTMLCanvasElement, big: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const n = big ? 100 : 40
  interface Particle {
    x: number; y: number; vx: number; vy: number
    r: number; dy: number; color: string; alpha: number; shape: 'rect' | 'circle'
  }
  const COLORS = ['#FF6B9D', '#FFD700', '#4ECDC4', '#A855F7', '#FF8C42', '#c4a8ff']
  const particles: Particle[] = []
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 8
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      r: Math.random() * 6 + 3,
      dy: 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    })
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let active = false
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += p.dy
      p.vx *= 0.99
      p.alpha -= 0.014
      if (p.alpha > 0) {
        active = true
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        if (p.shape === 'rect') {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    })
    if (active) requestAnimationFrame(animate)
    else ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  animate()
}

export default function HiraganaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase, setPhase] = useState<Phase>('menu')
  const [count, setCount] = useState<number>(5)
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const [chosen, setChosen] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [best, setBest] = useState<HiraganaBest>(() => {
    if (typeof window !== 'undefined') return loadBest()
    return { best: 0, stickers: 0 }
  })

  const startGame = useCallback(() => {
    const pool = shuffle([...QUIZ_DATA]).slice(0, count)
    const qs: Question[] = pool.map(item => ({
      item,
      choices: shuffle([item.correct, item.wrong]) as [string, string],
    }))
    setQuestions(qs)
    setIdx(0)
    setLog([])
    setChosen(null)
    setShowFeedback(false)
    setPhase('game')
    setTimeout(() => speak(qs[0].item.speech), 200)
  }, [count])

  const handleAnswer = useCallback((c: string) => {
    if (chosen !== null) return
    const q = questions[idx]
    const ok = c === q.item.correct
    setChosen(c)
    setShowFeedback(true)
    if (ok) {
      speak('せいかい！')
      if (canvasRef.current) fireConfetti(canvasRef.current, false)
    } else {
      speak(`こたえは「${q.item.correct}」だよ！`)
    }
    setLog(prev => [...prev, { question: q, chosen: c, ok }])
  }, [chosen, questions, idx])

  const nextQuestion = useCallback(() => {
    const nextIdx = idx + 1
    if (nextIdx >= questions.length) {
      const correctCount = log.filter(l => l.ok).length
      const total = questions.length
      const pct = correctCount / total
      saveBest(correctCount, total)
      setBest(loadBest())
      saveScore('youji-hiragana', correctCount, total, 'no5')
      if (pct >= 0.8 && canvasRef.current) fireConfetti(canvasRef.current, true)
      speak(
        pct === 1
          ? 'かんぺき！すごいね！'
          : pct >= 0.8
          ? 'よくできました！おめでとう！'
          : 'またれんしゅうしてね！'
      )
      setPhase('result')
    } else {
      setIdx(nextIdx)
      setChosen(null)
      setShowFeedback(false)
      setTimeout(() => speak(questions[nextIdx].item.speech), 200)
    }
  }, [idx, questions, log])

  // ── MENU ──────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="bg-gradient-to-b from-purple-100 to-indigo-50 min-h-screen pb-20">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/lab" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="text-lg font-bold text-gray-800 flex-1">🈳 ひらがな どっちかな？</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {/* 記録 */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex justify-around text-center">
            <div>
              <div className="text-2xl font-black text-purple-600">{best.best}</div>
              <div className="text-xs text-gray-500">さいこう せいかい</div>
            </div>
            <div>
              <div className="text-2xl">{'🌟'.repeat(Math.min(best.stickers, 10))}{best.stickers > 10 ? `+${best.stickers - 10}` : ''}</div>
              <div className="text-xs text-gray-500">シール ({best.stickers}まい)</div>
            </div>
          </div>

          {/* もんだいの かず */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-bold text-gray-600 mb-3">もんだいの かず</p>
            <div className="flex gap-3">
              {[5, 7, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    count === n
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #c4a8ff, #a78bfa)' }}
          >
            スタート！
          </button>
        </div>
      </div>
    )
  }

  // ── GAME ──────────────────────────────────────────────────
  if (phase === 'game') {
    const q = questions[idx]
    const total = questions.length
    const pct = (idx / total) * 100

    return (
      <div className="bg-gradient-to-b from-purple-100 to-indigo-50 min-h-screen pb-20">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => { window.speechSynthesis?.cancel(); setPhase('menu') }}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{idx + 1} / {total}</span>
                <span>⭐ {log.filter(l => l.ok).length}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c4a8ff, #a78bfa)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {/* 問題カード */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">どっちが ただしい かな？</p>
            <button
              onClick={() => speak(q.item.speech)}
              className="text-4xl mb-2 hover:scale-110 transition-transform"
              title="もういちど きく"
            >
              🔊
            </button>
            <p className="text-xs text-gray-400 mt-1">タップして もういちど きこう</p>
          </div>

          {/* 2択ボタン */}
          <div className="flex flex-col gap-3">
            {q.choices.map((c, i) => {
              let btnClass =
                'w-full py-5 rounded-2xl text-2xl font-black transition-all '
              if (chosen === null) {
                btnClass +=
                  'bg-white shadow-md text-gray-700 active:scale-95 hover:shadow-lg'
              } else if (c === q.item.correct) {
                btnClass +=
                  'bg-green-100 text-green-700 border-2 border-green-400'
              } else if (c === chosen && c !== q.item.correct) {
                btnClass +=
                  'bg-red-100 text-red-600 border-2 border-red-400'
              } else {
                btnClass += 'bg-gray-100 text-gray-400'
              }
              return (
                <button
                  key={i}
                  className={btnClass}
                  onClick={() => handleAnswer(c)}
                  disabled={chosen !== null}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {/* フィードバック */}
          {showFeedback && chosen !== null && (
            <div
              className={`rounded-2xl p-4 text-center ${
                chosen === q.item.correct ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="text-3xl mb-1">
                {chosen === q.item.correct ? '⭕' : '❌'}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {chosen === q.item.correct
                  ? `せいかい！「${q.item.correct}」だよ！`
                  : `こたえは「${q.item.correct}」だよ！`}
              </p>
              <button
                onClick={nextQuestion}
                className="mt-3 px-8 py-2 rounded-full font-black text-white text-sm active:scale-95"
                style={{ background: 'linear-gradient(135deg, #c4a8ff, #a78bfa)' }}
              >
                つぎへ →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────
  const correctCount = log.filter(l => l.ok).length
  const total = questions.length
  const pctResult = correctCount / total
  const stars = pctResult === 1 ? 3 : pctResult >= 0.7 ? 2 : 1
  const emoji =
    stars === 3 ? '🎉' : stars === 2 ? '😄' : '😊'
  const title =
    stars === 3
      ? 'かんぺき！すごい！！'
      : stars === 2
      ? 'よくできました！'
      : 'またれんしゅうしよう！'

  return (
    <div className="bg-gradient-to-b from-purple-100 to-indigo-50 min-h-screen pb-20">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-1">🈳 けっか</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{title}</h2>
          <div className="text-3xl mb-4">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-black text-purple-600">
                {correctCount}/{total}
              </div>
              <div className="text-xs text-gray-500">せいかい</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-500">
                {best.stickers}
              </div>
              <div className="text-xs text-gray-500">シール</div>
            </div>
          </div>
          {pctResult >= 0.8 && (
            <p className="text-sm text-yellow-600 font-bold mt-3">
              🌟 シールを もらったよ！
            </p>
          )}
        </div>

        {/* 問題ごとの結果 */}
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
          {log.map((l, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm p-2 rounded-xl ${
                l.ok ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span>{l.ok ? '✓' : '✗'}</span>
              <span className="flex-1 text-gray-700 text-xs">
                {l.question.item.correct} / {l.question.item.wrong}
              </span>
              <span
                className={`font-bold text-xs ${
                  l.ok ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {l.question.item.correct}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #c4a8ff, #a78bfa)' }}
          >
            もういちど
          </button>
          <Link
            href="/lab"
            className="flex-1 py-4 rounded-2xl font-black text-purple-700 text-lg text-center bg-purple-100 active:scale-95"
          >
            もどる
          </Link>
        </div>
      </div>
    </div>
  )
}
