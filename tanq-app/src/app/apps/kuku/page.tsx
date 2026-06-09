'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { saveScore } from '@/lib/scoreApi'
import { getDataKey } from '@/lib/storage'

interface KukuQuestion { a: number; b: number; ans: number; choices: number[] }

const DANS = [2,3,4,5,6,7,8,9]
const ALL_KUKU: Omit<KukuQuestion, 'choices'>[] = DANS.flatMap(a =>
  Array.from({ length: 9 }, (_, i) => ({ a, b: i + 1, ans: a * (i + 1) }))
)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function makeChoices4(a: number, b: number): number[] {
  const correct = a * b
  // ありがちなまちがい（段ずれ・かける数ずれ）を優先して選択肢に入れる
  const cand: number[] = []
  if (b + 1 <= 9) cand.push(a * (b + 1))
  if (b - 1 >= 1) cand.push(a * (b - 1))
  if (a + 1 <= 9) cand.push((a + 1) * b)
  if (a - 1 >= 2) cand.push((a - 1) * b)
  const near = shuffle(Array.from(new Set(cand)).filter(v => v !== correct)).slice(0, 2)
  const pool = Array.from(new Set(ALL_KUKU.map(q => q.ans))).filter(v => v !== correct && !near.includes(v))
  const rest = shuffle(pool).slice(0, 3 - near.length)
  return shuffle([correct, ...near, ...rest])
}

function buildQuestions(pool: typeof ALL_KUKU, count: number): KukuQuestion[] {
  let qs: typeof ALL_KUKU = []
  while (qs.length < count) qs = qs.concat(shuffle([...pool]))
  return qs.slice(0, count).map(q => ({ ...q, choices: makeChoices4(q.a, q.b) }))
}

// 間違いの「原因」を推測して、答えを見せずに考える足場になるヒントを返す
function getKukuHint(a: number, b: number, chosen: number): string {
  if (chosen === a * (b + 1) || chosen === a * (b - 1))
    return `おしい！だんが 1つ ずれてるかも。${a}のだんを「${a}いち が ${a}…」と じゅんに となえてみよう！`
  if (chosen === (a + 1) * b || chosen === (a - 1) * b)
    return `それは ${chosen === (a + 1) * b ? a + 1 : a - 1}のだんの こたえかも。いまは ${a}のだんだよ！`
  if (b >= 2) return `${a}×${b - 1} の こたえに ${a} を たすと わかるよ！`
  return `${a}×1 は ${a} のままだよ！`
}

// 答えを見せるときに「なぜそうなるか」につながる説明を返す
function kukuExplain(a: number, b: number): string {
  const base = b >= 2 ? `${a}×${b - 1}＝${a * (b - 1)} に ${a}を たすと ${a * b}` : `${a}×1 は ${a} のまま`
  const swap = a !== b ? `。${b}×${a} も おなじ ${a * b} だよ` : ''
  return `${base}${swap}！`
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'; u.rate = 0.9; u.pitch = 1.1
  window.speechSynthesis.speak(u)
}

interface RecordEntry {
  type: 'practice' | 'attack'; dan: number | 'all'
  total: number; correct: number; score: number; stars: number; maxCombo: number
  elapsed: number; date: string
}

const RECORD_KEY = 'tanq_kuku_records_v1'

function loadRecords(): RecordEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(getDataKey(RECORD_KEY)) || '[]') } catch { return [] }
}

function saveRecordEntry(entry: Omit<RecordEntry, 'date'>) {
  try {
    const records = loadRecords()
    records.unshift({ ...entry, date: new Date().toLocaleDateString('ja-JP') })
    localStorage.setItem(getDataKey(RECORD_KEY), JSON.stringify(records.slice(0, 30)))
  } catch { /* 保存失敗でゲームを止めない */ }
}

type View = 'menu' | 'setup-practice' | 'setup-attack' | 'game' | 'result'

export default function KukuPage() {
  const [view, setView] = useState<View>('menu')
  const [selectedDan, setSelectedDan] = useState<number | 'all'>('all')
  const [practiceCount, setPracticeCount] = useState(18)
  const [isAttack, setIsAttack] = useState(false)

  const [questions, setQuestions] = useState<KukuQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [log, setLog] = useState<{ ok: boolean; q: KukuQuestion }[]>([])
  const [answered, setAnswered] = useState(false)
  const [chosenIdx, setChosenIdx] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [attempt, setAttempt] = useState(0) // いまの問題で何回まちがえたか
  const [wrongIdx, setWrongIdx] = useState<number | null>(null) // 1回目にまちがえた選択肢
  const [hint, setHint] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function fireConfetti(big: boolean) {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const particles = Array.from({ length: big ? 120 : 50 }, () => {
      const angle = Math.random() * Math.PI * 2, speed = 3 + Math.random() * 8
      return { x: canvas.width / 2, y: canvas.height / 3, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4, r: Math.random() * 6 + 3, dy: 0.25, color: ['#f59e0b','#fbbf24','#FF6B6B','#4ECDC4','#a855f7'][Math.floor(Math.random()*5)], alpha: 1, rect: Math.random() < 0.5 }
    })
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height); let live = false
      for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.015; if (p.alpha > 0) { live = true; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); if (p.rect) ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); else { ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill() } ctx.restore() } }
      if (live) requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    draw()
  }

  function stopTimer() { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  const startPractice = useCallback(() => {
    const pool = selectedDan === 'all' ? ALL_KUKU : ALL_KUKU.filter(q => q.a === selectedDan)
    const qs = buildQuestions(pool, practiceCount)
    setQuestions(qs); setIdx(0); setScore(0); setCombo(0); setMaxCombo(0)
    setLog([]); setAnswered(false); setChosenIdx(null); setElapsed(0); setShowFeedback(false)
    setAttempt(0); setWrongIdx(null); setHint(null)
    setIsAttack(false); setView('game')
    setTimeout(() => speak(`${qs[0].a} かける ${qs[0].b} は？`), 300)
  }, [selectedDan, practiceCount])

  const startAttack = useCallback(() => {
    const qs = shuffle([...ALL_KUKU]).map(q => ({ ...q, choices: makeChoices4(q.a, q.b) }))
    setQuestions(qs); setIdx(0); setScore(0); setCombo(0); setMaxCombo(0)
    setLog([]); setAnswered(false); setChosenIdx(null); setElapsed(0); setShowFeedback(false)
    setAttempt(0); setWrongIdx(null); setHint(null)
    setIsAttack(true); setView('game')
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => setElapsed((Date.now() - startTimeRef.current) / 1000), 100)
    setTimeout(() => speak(`${qs[0].a} かける ${qs[0].b} は？`), 300)
  }, [])

  useEffect(() => () => stopTimer(), [])

  const handleAnswer = useCallback((chosen: number, ci: number) => {
    if (answered || ci === wrongIdx) return
    const q = questions[idx]
    if (!q) return
    const ok = chosen === q.ans
    const firstTry = attempt === 0

    // れんしゅうモードの1回目のまちがい: 答えは見せず、ヒントでもう一度考えさせる
    if (!ok && firstTry && !isAttack) {
      setAttempt(1); setWrongIdx(ci)
      setHint(getKukuHint(q.a, q.b, chosen))
      // 記録・コンボは初回解答で確定（ヒント後の正解で水増ししない）
      setLog(l => [...l, { ok: false, q }])
      setCombo(0)
      speak('おしい！もういちど かんがえてみよう')
      return
    }

    setAnswered(true); setChosenIdx(ci); setShowFeedback(true); setHint(null)
    // 2回目の解答（ヒント後）はすでに log に「まちがい」として記録済み
    const newLog = firstTry ? [...log, { ok, q }] : log
    const newCombo = ok && firstTry ? combo + 1 : 0
    const newMax = Math.max(maxCombo, newCombo)
    const comboBonus = ok && firstTry ? Math.min(combo, 9) * 10 : 0
    const newScore = score + (ok && firstTry ? 100 + comboBonus : 0)
    if (firstTry) setLog(newLog)
    setCombo(newCombo); setMaxCombo(newMax); setScore(newScore)
    if (ok) {
      if (firstTry) {
        if (newCombo >= 3) speak(`${newCombo}れんぞく！すごい！`)
        else speak('せいかい！')
        fireConfetti(false)
      } else {
        speak('せいかい！よく きづいたね！')
      }
    } else {
      speak(`${q.a} かける ${q.b} は ${q.ans}`)
    }

    // まちがえたときは答えと説明を読む時間をしっかりとる
    const delay = ok ? 900 : isAttack ? 1500 : 2400
    setTimeout(() => {
      const nextIdx = idx + 1
      if (nextIdx >= questions.length) {
        // Done
        stopTimer()
        const finalElapsed = isAttack ? (Date.now() - startTimeRef.current) / 1000 : 0
        setElapsed(finalElapsed)
        const correct = newLog.filter(l => l.ok).length
        const total = questions.length
        const pct = correct / total
        const stars = pct >= 0.95 ? 3 : pct >= 0.75 ? 2 : 1
        saveRecordEntry({ type: isAttack ? 'attack' : 'practice', dan: selectedDan, total, correct, score: newScore, stars, maxCombo: newMax, elapsed: finalElapsed })
        saveScore('kuku', correct, total, isAttack ? `attack-${Math.floor(finalElapsed)}s` : `dan${selectedDan}`)
        if (stars === 3) fireConfetti(true)
        setView('result')
      } else {
        setIdx(nextIdx); setAnswered(false); setChosenIdx(null); setShowFeedback(false)
        setAttempt(0); setWrongIdx(null); setHint(null)
        setTimeout(() => speak(`${questions[nextIdx].a} かける ${questions[nextIdx].b} は？`), 100)
      }
    }, delay)
  }, [answered, questions, idx, log, combo, maxCombo, score, isAttack, selectedDan, attempt, wrongIdx])

  const YELLOW = 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'

  if (view === 'menu') {
    return (
      <div className="min-h-screen" style={{ background: YELLOW }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: YELLOW }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">✖️ 九九マスター</h1>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-4 shadow-md text-center">
            <div className="text-6xl mb-3">🔢</div>
            <p className="font-black text-gray-700 text-lg mb-1">2〜9のだん ぜんぶで72もん</p>
            <p className="text-gray-400 text-sm">れんしゅうモードとタイムアタックで九九をマスターしよう！</p>
          </div>

          <div className="space-y-3">
            <button onClick={() => setView('setup-practice')}
              className="w-full rounded-2xl p-5 bg-white shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-4">
              <span className="text-4xl">📘</span>
              <div>
                <div className="font-black text-gray-800 text-lg">れんしゅうモード</div>
                <div className="text-sm text-gray-500">だんと もんすうを えらんで じっくり れんしゅう</div>
              </div>
              <span className="ml-auto text-gray-300 text-2xl">›</span>
            </button>
            <button onClick={() => setView('setup-attack')}
              className="w-full rounded-2xl p-5 bg-white shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-4">
              <span className="text-4xl">⚡</span>
              <div>
                <div className="font-black text-gray-800 text-lg">タイムアタック</div>
                <div className="text-sm text-gray-500">72もんを できるだけ はやく！タイムきろくに ちょうせん</div>
              </div>
              <span className="ml-auto text-gray-300 text-2xl">›</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'setup-practice') {
    return (
      <div className="min-h-screen" style={{ background: YELLOW }}>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: YELLOW }}>
            <button onClick={() => setView('menu')} className="text-2xl font-bold text-white">←</button>
            <h1 className="text-xl font-black text-white">📘 れんしゅうモード</h1>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
            <p className="font-black text-xs text-gray-400 mb-3">だんを えらぼう</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setSelectedDan('all')}
                className={`py-2 rounded-xl font-black text-sm transition-all ${selectedDan === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'}`}>
                ぜんぶ
              </button>
              {DANS.map(d => (
                <button key={d} onClick={() => setSelectedDan(d)}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${selectedDan === d ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'}`}>
                  {d}のだん
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
            <p className="font-black text-xs text-gray-400 mb-3">もんすう</p>
            <div className="flex gap-2">
              {[9, 18, 27].map(n => (
                <button key={n} onClick={() => setPracticeCount(n)}
                  className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${practiceCount === n ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'}`}>
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <button onClick={startPractice}
            className="w-full py-4 rounded-2xl font-black text-lg bg-white text-yellow-600 shadow-lg hover:-translate-y-0.5 transition-all">
            スタート！📘
          </button>
        </div>
      </div>
    )
  }

  if (view === 'setup-attack') {
    return (
      <div className="min-h-screen" style={{ background: YELLOW }}>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: YELLOW }}>
            <button onClick={() => setView('menu')} className="text-2xl font-bold text-white">←</button>
            <h1 className="text-xl font-black text-white">⚡ タイムアタック</h1>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-4 shadow-md text-center">
            <div className="text-5xl mb-3">⏱️</div>
            <p className="font-black text-gray-700 text-xl mb-1">72もんに ちょうせん！</p>
            <p className="text-gray-400 text-sm">2〜9のだんを シャッフルして だすよ。<br/>どれだけ はやく ぜんもん せいかい できるかな？</p>
          </div>

          <button onClick={startAttack}
            className="w-full py-4 rounded-2xl font-black text-lg bg-white text-yellow-600 shadow-lg hover:-translate-y-0.5 transition-all">
            スタート！⚡
          </button>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    const correct = log.filter(l => l.ok).length
    const total = questions.length
    const pct = correct / total
    const stars = pct >= 0.95 ? 3 : pct >= 0.75 ? 2 : 1
    const msg = stars === 3 ? '🎉 かんぺき！！' : stars === 2 ? '😄 よくできました！' : '💪 もっとれんしゅうしよう！'
    const misses = log.filter(l => !l.ok)
    return (
      <div className="min-h-screen" style={{ background: YELLOW }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: YELLOW }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">けっか</h1>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-4 text-center shadow-md">
            <div className="text-5xl mb-2">{stars === 3 ? '🎊' : stars === 2 ? '🌟' : '💪'}</div>
            <div className="font-black text-xl mb-1">{msg}</div>
            <div className="font-black text-4xl text-yellow-500 my-2">{correct}<span className="text-2xl">/{total}</span></div>
            <div className="text-2xl mb-1">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
            <div className="text-sm text-gray-400">{score}てん ／ さいこう{maxCombo}コンボ</div>
            {isAttack && <div className="font-black text-2xl text-yellow-500 mt-2">⏱ {elapsed.toFixed(1)}s</div>}
          </div>

          {misses.length > 0 && (
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
              <p className="font-black text-sm text-gray-500 mb-2">まちがえた もんだい</p>
              <div className="flex flex-wrap gap-2">
                {misses.map((l, i) => (
                  <span key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 text-sm font-bold text-gray-700">
                    {l.q.a}×{l.q.b}=<span className="text-green-500">{l.q.ans}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={isAttack ? startAttack : startPractice}
              className="flex-1 py-3 rounded-2xl font-black bg-white text-yellow-600 shadow-md hover:-translate-y-0.5 transition-all">
              もう一回
            </button>
            <Link href="/lab"
              className="flex-1 py-3 rounded-2xl font-black bg-yellow-700 text-white text-center shadow-md hover:-translate-y-0.5 transition-all">
              おわる
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Game view
  const q = questions[idx]
  if (!q) return null

  return (
    <div className="min-h-screen" style={{ background: YELLOW }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="sticky top-0 z-10 py-3" style={{ background: YELLOW }}>
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => { stopTimer(); setView('menu') }} className="text-white font-bold text-sm">← やめる</button>
            <span className="text-white font-black text-sm">{idx + 1}/{questions.length}</span>
            <div className="text-white font-black text-sm flex gap-3">
              {isAttack && <span>⏱ {elapsed.toFixed(1)}s</span>}
              <span>⭐ {score}</span>
            </div>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(idx / questions.length) * 100}%` }}/>
          </div>
          {combo >= 3 && <div className="text-center mt-1"><span className="bg-red-500 text-white text-xs font-black px-3 py-0.5 rounded-full">🔥 {combo}れんぞく！</span></div>}
        </div>

        {/* Equation */}
        <div className="bg-white rounded-3xl p-8 mb-6 text-center shadow-md">
          <div className="font-black text-gray-400 text-sm mb-2">
            {selectedDan !== 'all' && !isAttack ? `${selectedDan}のだん` : '九九'}
          </div>
          <div className="font-black text-6xl text-gray-800">
            {q.a} × {q.b}
          </div>
          <div className="font-black text-4xl text-yellow-500 mt-2">= ?</div>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((c, i) => {
            const isCor = answered && c === q.ans
            const isWrong = (answered && i === chosenIdx && c !== q.ans) || i === wrongIdx
            return (
              <button key={i} onClick={() => handleAnswer(c, i)} disabled={answered || i === wrongIdx}
                className={`py-5 rounded-2xl font-black text-3xl shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-default
                  ${isCor ? 'bg-green-200 border-2 border-green-500 text-green-700' : isWrong ? 'bg-red-200 border-2 border-red-400 text-red-700 opacity-60' : 'bg-white text-gray-800'}`}>
                {c}
              </button>
            )
          })}
        </div>

        {!answered && hint !== null && (
          <div className="mt-4 rounded-2xl p-4 text-center bg-orange-100 text-orange-700">
            <div className="font-black text-base">🤔 おしい！</div>
            <div className="font-bold text-sm mt-1">{hint}</div>
            <div className="font-black text-sm mt-1">もういちど えらんでみよう！</div>
          </div>
        )}

        {showFeedback && (
          <div className={`mt-4 rounded-2xl p-4 text-center ${chosenIdx !== null && q.choices[chosenIdx] === q.ans ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {chosenIdx !== null && q.choices[chosenIdx] === q.ans ? (
              <div className="font-black text-lg">
                {attempt === 0
                  ? `⭕ せいかい！${combo >= 3 ? ` 🔥 ${combo}れんぞく！！` : ''}`
                  : '⭕ せいかい！よく きづいたね！'}
              </div>
            ) : (
              <>
                <div className="font-black text-lg">❌ {q.a} × {q.b} = {q.ans} だよ！</div>
                <div className="font-bold text-sm mt-1">{kukuExplain(q.a, q.b)}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
