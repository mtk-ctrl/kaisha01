'use client'

// 中学受験 歴史〈旧石器〜現代（通史ぜんぶ）〉
// - 4択＋ならべかえ（年代整序）。1回目の不正解は答えを見せず「考える足場」ヒント→再挑戦
// - スコア・⭐は初回解答のみで確定（再挑戦で水増ししない）
// - 正解時も一行の豆知識で定着強化。解説は「なぜ」の因果を語る
// - 旧石器〜現代の通史を完成。近現代は政治的に中立な記述（戦争の評価に踏み込まず事実ベース）

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  REKISHI_LEVEL_META,
  REKISHI_TIMELINE,
  REKISHI_TOTAL,
  getRekishiQuestionsForLevel,
  type RekishiQuestion,
} from '@/data/rekishiData'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'
import { Furigana } from '@/components/Furigana'
import { playCorrect, playWrong } from '@/lib/audio'

const STORAGE_KEY = 'tanq_rekishi_v1'
const MAX_LEVEL = REKISHI_LEVEL_META.length

interface RekishiSave {
  levelStars: Record<number, 0 | 1 | 2 | 3>
}

function loadSave(): RekishiSave {
  if (typeof window === 'undefined') return { levelStars: {} }
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEY))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { levelStars: {} }
}

function writeSave(save: RekishiSave) {
  localStorage.setItem(getDataKey(STORAGE_KEY), JSON.stringify(save))
}

function calcStars(wrong: number): 0 | 1 | 2 | 3 {
  if (wrong === 0) return 3
  if (wrong === 1) return 2
  if (wrong <= 3) return 1
  return 0
}

// 出題用に整えた問題。choice は選択肢シャッフル済み、order は表示順シャッフル済み
interface PreparedQuestion {
  src: RekishiQuestion
  choices: string[]        // choice: シャッフル済み選択肢
  answer: number           // choice: シャッフル後の正解 index
  displayItems: string[]   // order: シャッフル済み表示
}

function prepare(q: RekishiQuestion): PreparedQuestion {
  if (q.type === 'choice') {
    const indexed = q.choices.map((c, i) => ({ c, isAnswer: i === q.answer }))
    const shuffled = shuffle(indexed)
    return {
      src: q,
      choices: shuffled.map(({ c }) => c),
      answer: shuffled.findIndex(({ isAnswer }) => isAnswer),
      displayItems: [],
    }
  }
  // order: 正しい順と完全一致しない並びになるまでシャッフル（最大10回で十分）
  let items = shuffle([...q.items])
  for (let i = 0; i < 10 && items.every((it, idx) => it === q.items[idx]); i++) {
    items = shuffle([...q.items])
  }
  return { src: q, choices: [], answer: -1, displayItems: items }
}

type View = 'map' | 'play' | 'result'

interface PlayState {
  level: number
  questions: PreparedQuestion[]
  current: number
  selected: number | null      // choice: 選択中の選択肢
  picked: number[]             // order: 選んだ displayItems の index 列
  confirmed: boolean
  attempt: 0 | 1               // 0=1回目, 1=ヒントを見て再挑戦中
  firstWrong: number | null    // choice: 1回目にまちがえた選択肢（再選択不可）
  secondCorrect: boolean       // 再挑戦で正解できたか（表示用。スコアには入れない）
  wrong: number
  answers: { correct: boolean; q: RekishiQuestion }[]
}

function StarDisplay({ stars }: { stars: 0 | 1 | 2 | 3 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} style={{ color: i <= stars ? '#f59e0b' : '#d1d5db', fontSize: '14px' }}>★</span>
      ))}
    </span>
  )
}

function difficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    'ふつう': '#3b82f6',
    'ちょいむず': '#f59e0b',
    'むずかしい': '#f97316',
    'かなりむず': '#ef4444',
  }
  return map[difficulty] ?? '#6b7280'
}

export default function RekishiPage() {
  const [view, setView] = useState<View>('map')
  const [save, setSave] = useState<RekishiSave>({ levelStars: {} })
  const [play, setPlay] = useState<PlayState | null>(null)
  const [isTester, setIsTester] = useState(false)

  useEffect(() => {
    setSave(loadSave())
    setIsTester(localStorage.getItem('tanq-lab-auth') === 'tester')
  }, [])

  const persistSave = useCallback((next: RekishiSave) => {
    setSave(next)
    writeSave(next)
  }, [])

  const maxUnlocked = (() => {
    if (isTester) return MAX_LEVEL
    let max = 1
    for (let lv = 1; lv <= MAX_LEVEL; lv++) {
      if ((save.levelStars[lv] ?? 0) >= 1) max = lv + 1
      else break
    }
    return Math.min(max, MAX_LEVEL)
  })()

  const finishedRef = useRef(false)

  const startLevel = useCallback((level: number) => {
    const questions = shuffle(getRekishiQuestionsForLevel(level)).map(prepare)
    finishedRef.current = false
    setPlay({
      level, questions, current: 0,
      selected: null, picked: [], confirmed: false,
      attempt: 0, firstWrong: null, secondCorrect: false,
      wrong: 0, answers: [],
    })
    setView('play')
  }, [])

  const select = useCallback((idx: number) => {
    setPlay(p => {
      if (!p || p.confirmed || idx === p.firstWrong) return p
      return { ...p, selected: idx }
    })
  }, [])

  const pickOrder = useCallback((idx: number) => {
    setPlay(p => {
      if (!p || p.confirmed) return p
      if (p.picked.includes(idx)) {
        return { ...p, picked: p.picked.filter(i => i !== idx) }
      }
      if (p.picked.length >= 4) return p
      return { ...p, picked: [...p.picked, idx] }
    })
  }, [])

  const confirm = useCallback(() => {
    if (!play || play.confirmed) return
    const pq = play.questions[play.current]
    const q = pq.src

    let correct: boolean
    if (q.type === 'choice') {
      if (play.selected === null) return
      correct = play.selected === pq.answer
    } else {
      if (play.picked.length !== q.items.length) return
      correct = play.picked.every((dispIdx, pos) => pq.displayItems[dispIdx] === q.items[pos])
    }

    if (correct) playCorrect()
    else playWrong()

    if (play.attempt === 0 && !correct) {
      // 1回目のまちがい: 答えは見せず、ヒントを出してもう一度考えてもらう。
      // スコア・⭐は初回解答で確定（再挑戦で水増ししない）
      setPlay({
        ...play,
        attempt: 1,
        firstWrong: q.type === 'choice' ? play.selected : null,
        selected: null,
        picked: [],
        wrong: play.wrong + 1,
        answers: [...play.answers, { correct: false, q }],
      })
      return
    }
    // 初回正解 or 再挑戦の答え合わせ（記録は初回分のみ）
    setPlay({
      ...play,
      confirmed: true,
      secondCorrect: play.attempt === 1 && correct,
      answers: play.attempt === 0 ? [...play.answers, { correct: true, q }] : play.answers,
    })
  }, [play])

  const next = useCallback(() => {
    setPlay(p => {
      if (!p) return p
      return {
        ...p, current: p.current + 1,
        confirmed: false, selected: null, picked: [],
        attempt: 0, firstWrong: null, secondCorrect: false,
      }
    })
  }, [])

  useEffect(() => {
    if (!play) return
    if (play.current >= play.questions.length) {
      if (finishedRef.current) return // persistSave 再実行時に saveScore を二重送信しない
      finishedRef.current = true
      const stars = calcStars(play.wrong)
      const prev = save.levelStars[play.level] ?? 0
      if (stars > prev) {
        persistSave({ ...save, levelStars: { ...save.levelStars, [play.level]: stars } })
      }
      saveScore('rekishi', play.questions.length - play.wrong, play.questions.length, `Lv${play.level}`)
      setView('result')
    }
  }, [play, save, persistSave])

  // ─── MAP ────────────────────────────────────────────────────────────────────
  if (view === 'map') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf8ef 0%, #f3e8d3 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/juken" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#92400e', textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
            ← 中学受験ハブにもどる
          </Link>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏛️</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#451a03', margin: '0 0 4px' }}>中学受験 社会〈歴史〉旧石器〜現代（通史ぜんぶ）</h1>
            <p style={{ color: '#78716c', fontSize: '14px', margin: 0 }}>旧石器〜現代｜全{MAX_LEVEL}レベル・{REKISHI_TOTAL}問</p>
          </div>

          {/* 通史タイムライン（旧石器〜現代まですべて公開＝通史完成） */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '10px' }}>📜 日本の歴史 全体マップ</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {REKISHI_TIMELINE.map((era, i) => (
                <span key={era.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', padding: '4px 9px', borderRadius: '999px',
                    background: era.implemented ? '#fef3c7' : '#f3f4f6',
                    color: era.implemented ? '#92400e' : '#9ca3af',
                    border: era.implemented ? '1px solid #f59e0b' : '1px dashed #d1d5db',
                  }}>
                    {era.name}
                  </span>
                  {i < REKISHI_TIMELINE.length - 1 && <span style={{ color: '#d6d3d1', fontSize: '10px' }}>▶</span>}
                </span>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#a8a29e' }}>旧石器から現代まで通史がぜんぶそろいました。一気にきわめよう！</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
            {[
              { label: 'クリア済み', value: Object.values(save.levelStars).filter(s => s >= 1).length, unit: 'Lv' },
              { label: '★3ゲット', value: Object.values(save.levelStars).filter(s => s === 3).length, unit: 'Lv' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '12px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#b45309' }}>{value}<span style={{ fontSize: '13px', color: '#9ca3af' }}>{unit}</span></div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {REKISHI_LEVEL_META.map(meta => {
              const stars = (save.levelStars[meta.level] ?? 0) as 0 | 1 | 2 | 3
              const locked = meta.level > maxUnlocked
              const cleared = stars >= 1
              const count = getRekishiQuestionsForLevel(meta.level).length
              return (
                <button
                  key={meta.level}
                  onClick={() => !locked && startLevel(meta.level)}
                  disabled={locked}
                  style={{
                    background: 'white',
                    border: cleared ? `2px solid ${meta.color}` : '2px solid #e7e5e4',
                    borderRadius: '16px',
                    padding: '14px 12px',
                    textAlign: 'left',
                    cursor: locked ? 'not-allowed' : 'pointer',
                    opacity: locked ? 0.5 : 1,
                    transition: 'transform 0.1s',
                    boxShadow: cleared ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                  onMouseOver={e => { if (!locked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '22px' }}>{locked ? '🔒' : meta.emoji}</span>
                    {cleared && <StarDisplay stars={stars} />}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Lv {meta.level}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: locked ? '#9ca3af' : '#451a03', marginBottom: '2px' }}>{meta.title}</div>
                  <div style={{ fontSize: '10px', color: '#a8a29e', marginBottom: '4px' }}>{meta.era}</div>
                  <span style={{ fontSize: '10px', background: difficultyColor(meta.difficulty) + '22', color: difficultyColor(meta.difficulty), padding: '2px 6px', borderRadius: '999px', fontWeight: '600' }}>
                    {meta.difficulty}
                  </span>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{count}問</div>
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: '20px', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>バッジ</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { emoji: '🏺', label: 'れきしの一歩', lv: 1 },
                { emoji: '🎎', label: '平安まで制覇', lv: 5 },
                { emoji: '⚔️', label: '鎌倉武士の世', lv: 7 },
                { emoji: '🏵️', label: '室町文化マスター', lv: 9 },
                { emoji: '🔥', label: '戦国到達', lv: 10 },
                { emoji: '🏯', label: '天下統一・安土桃山', lv: 12 },
                { emoji: '🏰', label: '江戸幕府成立', lv: 13 },
                { emoji: '⚓', label: '江戸の終わりへ', lv: 15 },
                { emoji: '🎌', label: '明治維新', lv: 17 },
                { emoji: '⚖️', label: '立憲国家・日清日露', lv: 18 },
                { emoji: '🕊️', label: '終戦', lv: 19 },
                { emoji: '🌅', label: '戦後復興', lv: 20 },
                { emoji: '🏆', label: '通史マスター', lv: 21 },
              ].map(b => {
                const earned = (save.levelStars[b.lv] ?? 0) >= 1
                return (
                  <div key={b.lv} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: earned ? '#fef3c7' : '#f3f4f6', borderRadius: '999px', padding: '4px 10px', opacity: earned ? 1 : 0.4 }}>
                    <span style={{ fontSize: '16px' }}>{b.emoji}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: earned ? '#92400e' : '#9ca3af' }}>{b.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── PLAY ───────────────────────────────────────────────────────────────────
  if (view === 'play' && play && play.current < play.questions.length) {
    const pq = play.questions[play.current]
    const q = pq.src
    const meta = REKISHI_LEVEL_META[play.level - 1]
    const total = play.questions.length
    const progress = play.current / total
    const canConfirm = q.type === 'choice' ? play.selected !== null : play.picked.length === q.items.length

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf8ef 0%, #f3e8d3 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button onClick={() => setView('map')} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', fontSize: '14px' }}>← もどる</button>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{meta.emoji} Lv {play.level} · {meta.title}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{play.current + 1}/{total}</div>
          </div>

          <div style={{ background: '#fde68a', borderRadius: '999px', height: '6px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, #d97706, #92400e)', borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '22px 24px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {q.type === 'order' ? '⏳ ならべかえ（年代順）' : `${meta.emoji} ${meta.title}`}
            </div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1c1917', margin: 0, lineHeight: 1.9 }}><Furigana text={q.q} /></p>
          </div>

          {q.type === 'choice' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {pq.choices.map((choice, i) => {
                const isFirstWrong = i === play.firstWrong
                let bg = 'white'
                let border = '2px solid #e7e5e4'
                let color = '#1c1917'

                if (play.confirmed) {
                  if (i === pq.answer) { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#15803d' }
                  else if ((i === play.selected || isFirstWrong) && i !== pq.answer) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#b91c1c' }
                } else if (isFirstWrong) {
                  bg = '#fef2f2'; border = '2px dashed #fca5a5'; color = '#9ca3af'
                } else if (play.selected === i) {
                  bg = '#fef3c7'; border = '2px solid #d97706'; color = '#92400e'
                }

                return (
                  <button
                    key={i}
                    className="rk-choice"
                    onClick={() => select(i)}
                    disabled={play.confirmed || isFirstWrong}
                    style={{ background: bg, border, borderRadius: '14px', padding: '13px 16px', textAlign: 'left', cursor: play.confirmed || isFirstWrong ? 'default' : 'pointer', color, fontSize: '15px', fontWeight: '500', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px', opacity: !play.confirmed && isFirstWrong ? 0.6 : 1, lineHeight: 1.7 }}
                  >
                    <span style={{ fontSize: '13px', color: '#9ca3af', minWidth: '20px' }}>{'①②③④'[i]}</span>
                    <span style={{ flex: 1 }}><Furigana text={choice} /></span>
                    {play.confirmed && i === pq.answer && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>○</span>}
                    {((play.confirmed && i === play.selected) || isFirstWrong) && i !== pq.answer && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>×</span>}
                  </button>
                )
              })}
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#78716c', margin: '0 0 8px', fontWeight: '600' }}>
                古い → 新しい の順に、カードを 1 → 2 → 3 → 4 とタップしよう
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pq.displayItems.map((item, i) => {
                  const pos = play.picked.indexOf(i)
                  const pickedAt = pos >= 0 ? pos + 1 : null
                  // 答え合わせ後: 自分の並び位置が正解と一致するかで色分け
                  const correctPos = play.confirmed && pos >= 0 ? q.items[pos] === item : null
                  let bg = 'white'
                  let border = '2px solid #e7e5e4'
                  let color = '#1c1917'
                  if (play.confirmed) {
                    if (correctPos === true) { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#15803d' }
                    else { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#b91c1c' }
                  } else if (pickedAt !== null) {
                    bg = '#fef3c7'; border = '2px solid #d97706'; color = '#92400e'
                  }
                  return (
                    <button
                      key={i}
                      className="rk-order-item"
                      onClick={() => pickOrder(i)}
                      disabled={play.confirmed}
                      style={{ background: bg, border, borderRadius: '14px', padding: '13px 16px', textAlign: 'left', cursor: play.confirmed ? 'default' : 'pointer', color, fontSize: '14px', fontWeight: '500', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: 1.7 }}
                    >
                      <span style={{
                        minWidth: '26px', height: '26px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: pickedAt !== null ? '#d97706' : '#f5f5f4',
                        color: pickedAt !== null ? 'white' : '#a8a29e',
                        fontSize: '14px', fontWeight: 'bold', flexShrink: 0,
                      }}>
                        {pickedAt ?? '·'}
                      </span>
                      <span style={{ flex: 1 }}><Furigana text={item} /></span>
                    </button>
                  )
                })}
              </div>
              {!play.confirmed && play.picked.length > 0 && (
                <button onClick={() => setPlay(p => p ? { ...p, picked: [] } : p)}
                  style={{ marginTop: '8px', background: 'none', border: 'none', color: '#92400e', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                  ならべなおす
                </button>
              )}
            </div>
          )}

          {/* 1回目のまちがい: 答えは見せず、時代の文脈ヒントで再挑戦 */}
          {!play.confirmed && play.attempt === 1 && (
            <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#ca8a04', fontWeight: '600', marginBottom: '4px' }}>💡 考えるヒント</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#713f12', lineHeight: 1.8 }}><Furigana text={q.hint} /></p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#a16207', fontWeight: '600' }}>
                {q.type === 'order' ? 'もういちど ならべてみよう！' : 'もういちど えらんでみよう！'}
              </p>
            </div>
          )}

          {play.confirmed && (
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 初回正解: 豆知識でテンポよく定着。まちがい後: 正しい答え＋流れの解説 */}
              {play.firstWrong === null && play.attempt === 0 ? (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>🔍 豆知識</div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#14532d', lineHeight: 1.8 }}><Furigana text={q.fact} /></p>
                </div>
              ) : (
                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '14px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: '#b45309', fontWeight: '600', marginBottom: '4px' }}>
                    {play.secondCorrect ? '✨ 再挑戦で正解！流れをおさえよう' : '📖 流れがわかる解説'}
                  </div>
                  {q.type === 'order' && (
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#92400e', fontWeight: '600', lineHeight: 1.9 }}>
                      正しい順番: {q.items.map((it, i) => (
                        <span key={i}>{i > 0 && ' → '}<Furigana text={it} /></span>
                      ))}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: '14px', color: '#78350f', lineHeight: 1.8 }}><Furigana text={q.explain} /></p>
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#b45309', fontWeight: '600' }}>まちがえてもだいじょうぶ。「流れ」でおぼえれば、つぎはとける！</p>
                </div>
              )}
            </div>
          )}

          {!play.confirmed ? (
            <button
              onClick={confirm}
              disabled={!canConfirm}
              style={{ width: '100%', background: !canConfirm ? '#e7e5e4' : 'linear-gradient(135deg, #d97706, #92400e)', color: !canConfirm ? '#9ca3af' : 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: !canConfirm ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
            >
              {play.attempt === 1 ? 'もういちど こたえる' : 'こたえる'}
            </button>
          ) : (
            <button
              onClick={next}
              style={{ width: '100%', background: 'linear-gradient(135deg, #d97706, #92400e)', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {play.current + 1 < total ? 'つぎへ →' : '結果を見る'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── RESULT ─────────────────────────────────────────────────────────────────
  if (view === 'result' && play) {
    const total = play.questions.length
    const correct = total - play.wrong
    const stars = calcStars(play.wrong)
    const passed = stars >= 1
    const meta = REKISHI_LEVEL_META[play.level - 1]

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf8ef 0%, #f3e8d3 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>{passed ? (stars === 3 ? '🎉' : '🌟') : '😢'}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1c1917', marginBottom: '4px' }}>
              {passed ? (stars === 3 ? 'かんぺき！' : 'クリア！') : 'もう一度チャレンジ！'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Lv {play.level} · {meta.title}</div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {correct}<span style={{ fontSize: '18px', color: '#6b7280' }}>/{total}</span>
            </div>
            <div style={{ marginBottom: '8px' }}><StarDisplay stars={stars} /></div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {stars === 3 ? '間違いゼロ！完璧です！' : stars === 2 ? '惜しい！あと少し！' : stars === 1 ? 'クリア！流れをふりかえって★3を目指そう' : 'まちがえた問題の「流れ」をふりかえれば、つぎはきっとクリア！'}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>問題の振り返り</div>
            {play.answers.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: i < play.answers.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', flexShrink: 0, color: a.correct ? '#22c55e' : '#ef4444' }}>{a.correct ? '○' : '×'}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}><Furigana text={a.q.q} /></div>
                  {!a.correct && (
                    <>
                      <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', marginTop: '2px', lineHeight: 1.7 }}>
                        正解: {a.q.type === 'choice'
                          ? <Furigana text={a.q.choices[a.q.answer]} />
                          : a.q.items.map((it, j) => <span key={j}>{j > 0 && ' → '}<Furigana text={it} /></span>)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', lineHeight: 1.6 }}>
                        <Furigana text={a.q.explain} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => startLevel(play.level)}
              style={{ width: '100%', background: 'white', border: '2px solid #d97706', color: '#b45309', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              もう一度 Lv {play.level}
            </button>
            {passed && play.level < MAX_LEVEL && (
              <button
                onClick={() => startLevel(play.level + 1)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #d97706, #92400e)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                次のレベルへ Lv {play.level + 1} →
              </button>
            )}
            {play.level === MAX_LEVEL && passed && (
              <div style={{ textAlign: 'center', color: '#b45309', fontWeight: 'bold', fontSize: '16px', padding: '8px' }}>🏆 通史をぜんぶ制覇！旧石器から現代まで、日本の歴史をきわめたね！</div>
            )}
            <button
              onClick={() => setView('map')}
              style={{ width: '100%', background: '#f3f4f6', border: 'none', color: '#374151', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              レベルマップにもどる
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
