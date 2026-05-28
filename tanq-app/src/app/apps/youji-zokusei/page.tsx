'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { saveScore } from '@/lib/scoreApi'
import { getDataKey } from '@/lib/storage'

interface StageAttr { label: string; color: string; bg: string }
interface StageItem { emoji: string; name: string; left: boolean; right: boolean }
interface Stage {
  id: number; name: string; difficulty: string; icon: string
  leftAttr: StageAttr; rightAttr: StageAttr; items: StageItem[]
}

const STAGES: Stage[] = [
  {
    id: 1, name: 'ステージ 1', difficulty: 'やさしい ⭐', icon: '🌸',
    leftAttr:  { label: 'あかい',    color: '#FF6464', bg: 'rgba(255,100,100,0.35)' },
    rightAttr: { label: 'まるい',    color: '#6496FF', bg: 'rgba(100,150,255,0.35)' },
    items: [
      { emoji: '🍎', name: 'りんご',          left: true,  right: true  },
      { emoji: '🍊', name: 'みかん',           left: false, right: true  },
      { emoji: '🚒', name: 'しょうぼうしゃ',   left: true,  right: false },
      { emoji: '📦', name: 'はこ',             left: false, right: false },
      { emoji: '🍓', name: 'いちご',           left: true,  right: false }, // ハート形で丸くない
      { emoji: '🏀', name: 'バスケットボール',  left: false, right: true  },
      { emoji: '🌹', name: 'バラ',             left: true,  right: false },
      { emoji: '📚', name: 'ほん',             left: false, right: false },
    ],
  },
  {
    id: 2, name: 'ステージ 2', difficulty: 'ふつう ⭐⭐', icon: '⚡',
    leftAttr:  { label: 'いきもの',   color: '#51CF66', bg: 'rgba(81,207,102,0.35)' },
    rightAttr: { label: 'みずにいる', color: '#339AF0', bg: 'rgba(51,154,240,0.35)' },
    items: [
      { emoji: '🐟', name: 'さかな',    left: true,  right: true  },
      { emoji: '🐱', name: 'ねこ',      left: true,  right: false },
      { emoji: '⛵', name: 'ヨット',    left: false, right: true  },
      { emoji: '🪨', name: 'いし',      left: false, right: false },
      { emoji: '🐙', name: 'たこ',      left: true,  right: true  },
      { emoji: '🦁', name: 'ライオン',  left: true,  right: false },
      { emoji: '🚤', name: 'ボート',    left: false, right: true  },
      { emoji: '🏠', name: 'いえ',      left: false, right: false },
    ],
  },
  {
    id: 3, name: 'ステージ 3', difficulty: 'むずかしい ⭐⭐⭐', icon: '🏆',
    leftAttr:  { label: 'のりもの',   color: '#FF922B', bg: 'rgba(255,146,43,0.35)' },
    rightAttr: { label: 'そらをとぶ', color: '#CC5DE8', bg: 'rgba(204,93,232,0.35)' },
    items: [
      { emoji: '✈️',  name: 'ひこうき',    left: true,  right: true  },
      { emoji: '🚗',  name: 'くるま',       left: true,  right: false },
      { emoji: '🦅',  name: 'わし',         left: false, right: true  },
      { emoji: '🏔️', name: 'やま',         left: false, right: false },
      { emoji: '🚁',  name: 'ヘリコプター', left: true,  right: true  },
      { emoji: '🚢',  name: 'ふね',         left: true,  right: false },
      { emoji: '🦋',  name: 'ちょうちょ',   left: false, right: true  },
      { emoji: '🌳',  name: 'き',           left: false, right: false },
    ],
  },
]

type Zone = 'left' | 'both' | 'right' | 'neither'
type View = 'menu' | 'game' | 'result'

interface RecordEntry { stars: number; score: number; maxCombo: number }
type Records = Record<number, RecordEntry>

const RECORD_KEY = 'tanq_zokusei_records_v1'

function getCorrectZone(item: StageItem): Zone {
  if (item.left && item.right) return 'both'
  if (item.left) return 'left'
  if (item.right) return 'right'
  return 'neither'
}

function zoneDesc(zone: Zone, stage: Stage): string {
  if (zone === 'both')    return `${stage.leftAttr.label}で ${stage.rightAttr.label}`
  if (zone === 'left')    return `${stage.leftAttr.label}だけ`
  if (zone === 'right')   return `${stage.rightAttr.label}だけ`
  return 'どちらでもない'
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'; u.rate = 0.88; u.pitch = 1.1
  window.speechSynthesis.speak(u)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function loadRecords(): Records {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(getDataKey(RECORD_KEY)) || '{}') } catch { return {} }
}

function saveRecordEntry(stageIdx: number, score: number, stars: number, maxCombo: number) {
  const rec = loadRecords()
  const prev = rec[stageIdx]
  if (!prev || score > prev.score) {
    rec[stageIdx] = { stars, score, maxCombo }
    localStorage.setItem(getDataKey(RECORD_KEY), JSON.stringify(rec))
  }
}

// ─── ベン図 SVG ───────────────────────────────────────────────────
// SVGマスクで4ゾーンを正確にハイライト
function VennDiagram({ stage, highlightZone }: { stage: Stage; highlightZone: Zone | null }) {
  const W = 300, H = 164
  const r = 63
  const lx = 110, rx = 190, cy = 82

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
      <defs>
        {/* 左だけ = 左円 から 右円 を引いた領域 */}
        <mask id="vd-left-only">
          <rect width={W} height={H} fill="white" />
          <circle cx={rx} cy={cy} r={r} fill="black" />
        </mask>
        {/* 右だけ = 右円 から 左円 を引いた領域 */}
        <mask id="vd-right-only">
          <rect width={W} height={H} fill="white" />
          <circle cx={lx} cy={cy} r={r} fill="black" />
        </mask>
        {/* りょうほう = 左円 ∩ 右円 */}
        <clipPath id="vd-both-clip">
          <circle cx={rx} cy={cy} r={r} />
        </clipPath>
        {/* どちらでもない = 両円の外 */}
        <mask id="vd-neither">
          <rect width={W} height={H} fill="white" />
          <circle cx={lx} cy={cy} r={r} fill="black" />
          <circle cx={rx} cy={cy} r={r} fill="black" />
        </mask>
      </defs>

      {/* ゾーン塗り（正解時のみ） */}
      {highlightZone === 'neither' && (
        <rect width={W} height={H} rx={12} fill="rgba(80,80,80,0.22)" mask="url(#vd-neither)" />
      )}
      {highlightZone === 'left' && (
        <circle cx={lx} cy={cy} r={r} fill={stage.leftAttr.bg} mask="url(#vd-left-only)" />
      )}
      {highlightZone === 'right' && (
        <circle cx={rx} cy={cy} r={r} fill={stage.rightAttr.bg} mask="url(#vd-right-only)" />
      )}
      {highlightZone === 'both' && (
        <circle cx={lx} cy={cy} r={r} fill="rgba(60,200,100,0.45)" clipPath="url(#vd-both-clip)" />
      )}

      {/* 円の輪郭（常に表示） */}
      <circle cx={lx} cy={cy} r={r} fill="none" stroke={stage.leftAttr.color} strokeWidth={2.5} />
      <circle cx={rx} cy={cy} r={r} fill="none" stroke={stage.rightAttr.color} strokeWidth={2.5} />

      {/* ゾーンラベル */}
      <text x={78}  y={cy + 5} textAnchor="middle" fontSize={11} fontWeight="700" fill={stage.leftAttr.color}  style={{ userSelect: 'none' }}>{stage.leftAttr.label}</text>
      <text x={150} y={cy + 5} textAnchor="middle" fontSize={10} fontWeight="700" fill="#555"                  style={{ userSelect: 'none' }}>りょうほう</text>
      <text x={222} y={cy + 5} textAnchor="middle" fontSize={11} fontWeight="700" fill={stage.rightAttr.color} style={{ userSelect: 'none' }}>{stage.rightAttr.label}</text>
      <text x={W - 6} y={H - 5} textAnchor="end"  fontSize={9}  fontWeight="600" fill="#888"                  style={{ userSelect: 'none' }}>どちらでもない</text>
    </svg>
  )
}

export default function YoujiZokuseiPage() {
  const [view, setView] = useState<View>('menu')
  const [records, setRecords] = useState<Records>({})
  const [stageIdx, setStageIdx] = useState(0)
  const [items, setItems] = useState<StageItem[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [chosenZone, setChosenZone] = useState<Zone | null>(null)
  // 次へボタン用：回答時のスコアを保持
  const [pendingNext, setPendingNext] = useState<{ score: number; combo: number; max: number; correct: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { setRecords(loadRecords()) }, [])

  function fireConfetti(big: boolean) {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const particles = Array.from({ length: big ? 120 : 60 }, () => {
      const angle = Math.random() * Math.PI * 2, speed = 3 + Math.random() * 8
      return { x: canvas.width / 2, y: canvas.height / 3, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4, r: Math.random() * 6 + 3, dy: 0.25, color: ['#FF6464','#FFD700','#51CF66','#339AF0','#CC5DE8'][Math.floor(Math.random()*5)], alpha: 1, rect: Math.random() < 0.5 }
    })
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height); let live = false
      for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.015; if (p.alpha > 0) { live = true; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); if (p.rect) ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); else { ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill() } ctx.restore() } }
      if (live) requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    draw()
  }

  function startStage(si: number) {
    const shuffled = shuffle([...STAGES[si].items])
    setStageIdx(si); setItems(shuffled); setQIdx(0); setScore(0); setCombo(0); setMaxCombo(0)
    setCorrectCount(0); setAnswered(false); setChosenZone(null); setPendingNext(null)
    setView('game')
    setTimeout(() => { speak(shuffled[0].name) }, 300)
  }

  function handleAnswer(zone: Zone) {
    if (answered) return
    setAnswered(true)
    const item = items[qIdx]
    const correct = getCorrectZone(item)
    const ok = zone === correct
    setChosenZone(zone)

    let newScore = score, newCombo = combo, newMax = maxCombo, newCorrect = correctCount
    if (ok) {
      newCombo = combo + 1; newMax = Math.max(maxCombo, newCombo); newCorrect = correctCount + 1
      const zoneBonus = zone === 'both' ? 1.5 : zone === 'neither' ? 1.2 : 1.0
      const comboMult = [1.0, 1.2, 1.5, 2.0, 3.0][Math.min(newCombo - 1, 4)]
      newScore = score + Math.round(100 * zoneBonus * comboMult)
      speak('せいかい')
      fireConfetti(false)
    } else {
      newCombo = 0
      speak('ざんねん')
    }
    setScore(newScore); setCombo(newCombo); setMaxCombo(newMax); setCorrectCount(newCorrect)
    // 自動遷移ではなく次へボタンで進む
    setPendingNext({ score: newScore, combo: newCombo, max: newMax, correct: newCorrect })
  }

  function handleNext() {
    if (!pendingNext) return
    const { score: s, combo: c, max: mx, correct: cor } = pendingNext
    const total = items.length
    const nextIdx = qIdx + 1
    if (nextIdx >= total) {
      const pct = cor / total
      const stars = pct >= 0.8 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0
      saveRecordEntry(stageIdx, s, stars, mx)
      saveScore('youji-zokusei', cor, total, `stage${stageIdx + 1}`)
      if (pct >= 0.8) fireConfetti(true)
      setRecords(loadRecords()); setView('result')
    } else {
      setQIdx(nextIdx); setAnswered(false); setChosenZone(null); setPendingNext(null)
      setTimeout(() => { speak(items[nextIdx].name) }, 200)
    }
  }

  const PURPLE = 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'

  if (view === 'menu') {
    const savedRec = loadRecords()
    return (
      <div className="min-h-screen" style={{ background: PURPLE }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: PURPLE }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">🏭 ぞくせい 仕分け工場</h1>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 mb-4 text-white text-sm font-bold">
            アイテムを4つのゾーンに仕分けよう！<br/>
            <span className="text-white/80 text-xs">どのなかまに はいるか かんがえてね</span>
          </div>
          <div className="space-y-3">
            {STAGES.map((stage, i) => {
              const rec = savedRec[i]
              const unlocked = i === 0 || !!savedRec[i - 1]
              return (
                <button key={stage.id}
                  onClick={() => unlocked && startStage(i)}
                  disabled={!unlocked}
                  className={`w-full rounded-2xl p-4 text-left flex items-center justify-between transition-all shadow-md ${unlocked ? 'bg-white hover:-translate-y-0.5 active:translate-y-0' : 'bg-white/40 cursor-not-allowed'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stage.icon}</span>
                    <div>
                      <div className="font-black text-gray-800">{stage.name}</div>
                      <div className="text-xs text-gray-500">{stage.difficulty}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        <span style={{ color: stage.leftAttr.color }}>● {stage.leftAttr.label}</span>
                        {' ／ '}
                        <span style={{ color: stage.rightAttr.color }}>● {stage.rightAttr.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {!unlocked ? <span className="text-2xl">🔒</span> :
                     rec ? <><div className="text-sm">{'⭐'.repeat(rec.stars)}{'☆'.repeat(3 - rec.stars)}</div><div className="text-xs text-gray-400">{rec.score}てん</div></> :
                     <span className="text-xs text-gray-400">まだ</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    const total = items.length
    const pct = correctCount / total
    const stars = pct >= 0.8 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0
    const stage = STAGES[stageIdx]
    const msg = pct === 1 ? '🎉 かんぺき！！！' : pct >= 0.8 ? '✨ すばらしい！！' : pct >= 0.6 ? '😊 よくできました！' : pct >= 0.4 ? '💪 がんばったね！' : '🔄 もういちど！'
    return (
      <div className="min-h-screen" style={{ background: PURPLE }}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
        <div className="max-w-md mx-auto px-4 pb-8">
          <div className="sticky top-0 z-10 flex items-center gap-3 py-4" style={{ background: PURPLE }}>
            <Link href="/lab" className="text-2xl font-bold text-white">←</Link>
            <h1 className="text-xl font-black text-white">けっか</h1>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4 text-center shadow-md">
            <div className="text-5xl mb-2">{pct >= 0.8 ? '🎊' : pct >= 0.6 ? '🌟' : '💪'}</div>
            <div className="font-black text-xl mb-1">{msg}</div>
            <div className="font-black text-4xl text-purple-500 my-2">{correctCount}<span className="text-2xl">/{total}</span></div>
            <div className="text-2xl mb-1">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
            <div className="text-sm text-gray-400">{score}てん ／ さいこう{maxCombo}コンボ</div>
            <div className="text-xs text-gray-400 mt-1">{stage.name}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => startStage(stageIdx)} className="flex-1 py-3 rounded-2xl font-black bg-white text-purple-600 shadow-md hover:-translate-y-0.5 transition-all">もう一回</button>
            <button onClick={() => setView('menu')} className="flex-1 py-3 rounded-2xl font-black bg-purple-800 text-white shadow-md hover:-translate-y-0.5 transition-all">ステージへ</button>
          </div>
        </div>
      </div>
    )
  }

  // ─── ゲーム画面 ───────────────────────────────────────────────
  const stage = STAGES[stageIdx]
  const item = items[qIdx]
  if (!item) return null
  const correctZone = getCorrectZone(item)
  const isCorrect = answered && chosenZone === correctZone

  return (
    <div className="min-h-screen" style={{ background: PURPLE }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"/>
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="sticky top-0 z-10 py-3" style={{ background: PURPLE }}>
          <div className="flex items-center justify-between">
            <button onClick={() => setView('menu')} className="text-white font-bold text-sm">← やめる</button>
            <span className="text-white font-black text-sm">{qIdx + 1}/{items.length}もん</span>
            <span className="text-white font-black text-sm">⭐ {score}</span>
          </div>
          {combo >= 2 && <div className="text-center mt-1"><span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-0.5 rounded-full">🔥 {combo}コンボ！</span></div>}
        </div>

        {/* アイテムカード */}
        <div className="bg-white rounded-3xl p-5 mb-3 text-center shadow-xl">
          <div className="text-7xl mb-2">{item.emoji}</div>
          <div className="font-black text-2xl text-gray-800">{item.name}</div>
          <p className="text-xs text-gray-400 mt-1">どのなかまに はいるかな？</p>
        </div>

        {/* ベン図 */}
        <div className="bg-white/90 rounded-2xl p-3 mb-3 flex flex-col items-center shadow">
          <p className="text-xs font-black text-gray-500 mb-1">ベン図でかくにんしよう</p>
          <VennDiagram stage={stage} highlightZone={answered ? correctZone : null} />
        </div>

        {/* 選択ボタン（回答後は押せない） */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {(['left', 'both', 'right', 'neither'] as Zone[]).map(zone => {
            const isCor   = answered && zone === correctZone
            const isWrong = answered && zone === chosenZone && zone !== correctZone
            let label = ''
            if (zone === 'left')    label = `${stage.leftAttr.label}だけ`
            if (zone === 'both')    label = `りょうほう`
            if (zone === 'right')   label = `${stage.rightAttr.label}だけ`
            if (zone === 'neither') label = 'どちらでもない'
            return (
              <button key={zone} onClick={() => handleAnswer(zone)} disabled={answered}
                className={`py-4 px-2 rounded-2xl font-black text-sm shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-default leading-tight
                  ${isCor ? 'bg-green-200 border-2 border-green-500' : isWrong ? 'bg-red-200 border-2 border-red-400' : 'bg-white'}`}>
                {zone === 'both'    && <div className="text-xs font-bold mb-1"><span style={{ color: stage.leftAttr.color }}>●</span>{' & '}<span style={{ color: stage.rightAttr.color }}>●</span></div>}
                {zone === 'left'    && <div className="text-xs font-bold mb-1"><span style={{ color: stage.leftAttr.color }}>●</span> のみ</div>}
                {zone === 'right'   && <div className="text-xs font-bold mb-1"><span style={{ color: stage.rightAttr.color }}>●</span> のみ</div>}
                {zone === 'neither' && <div className="text-xs mb-1">–</div>}
                {label}
                {isCor ? ' ✓' : ''}{isWrong ? ' ✗' : ''}
              </button>
            )
          })}
        </div>

        {/* フィードバック + 次へボタン */}
        {answered && (
          <>
            <div className={`rounded-2xl p-3 text-center font-black mb-3 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isCorrect
                ? `⭕ せいかい！ 「${zoneDesc(correctZone, stage)}」だね！`
                : `❌ ちがうよ！ こたえは「${zoneDesc(correctZone, stage)}」だよ！ ベン図をみてね 👆`}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-lg bg-yellow-400 text-yellow-900 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
              style={{ border: '3px solid rgba(0,0,0,0.15)' }}
            >
              {qIdx + 1 >= items.length ? 'けっかをみる 🎊' : 'つぎへ →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
