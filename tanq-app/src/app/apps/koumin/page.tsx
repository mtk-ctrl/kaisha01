'use client'

// 中学受験 社会〈公民〉— 憲法・人権・三権・地方自治・経済・国際
// - 4択＋ならべかえ（orderLabel が示す向き）。1回目の不正解は答えを見せず「考える足場」ヒント→再挑戦
// - スコア・⭐は初回解答のみで確定（再挑戦で水増ししない）
// - 正解時も一行の豆知識で定着強化。解説は「なぜ」の因果を語る（例: なぜ二院制か）
// - 政治的中立: 制度の事実に限定し、特定政党・政治家の評価や政策の善悪には踏み込まない

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  KOUMIN_LEVEL_META,
  KOUMIN_UNIT_MAP,
  KOUMIN_TOTAL,
  getKouminQuestionsForLevel,
  type KouminQuestion,
} from '@/data/kouminData'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'
import { Furigana } from '@/components/Furigana'
import { playCorrect, playWrong } from '@/lib/audio'

const STORAGE_KEY = 'tanq_koumin_v1'
const MAX_LEVEL = KOUMIN_LEVEL_META.length

interface KouminSave {
  levelStars: Record<number, 0 | 1 | 2 | 3>
}

function loadSave(): KouminSave {
  if (typeof window === 'undefined') return { levelStars: {} }
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEY))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { levelStars: {} }
}

function writeSave(save: KouminSave) {
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
  src: KouminQuestion
  choices: string[]
  answer: number
  displayItems: string[]
}

function prepare(q: KouminQuestion): PreparedQuestion {
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
  // order: 正しい順と完全一致しない並びになるまでシャッフル
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
  selected: number | null
  picked: number[]
  confirmed: boolean
  attempt: 0 | 1
  firstWrong: number | null
  secondCorrect: boolean
  wrong: number
  answers: { correct: boolean; q: KouminQuestion }[]
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

export default function KouminPage() {
  const [view, setView] = useState<View>('map')
  const [save, setSave] = useState<KouminSave>({ levelStars: {} })
  const [play, setPlay] = useState<PlayState | null>(null)
  const [isTester, setIsTester] = useState(false)

  useEffect(() => {
    setSave(loadSave())
    setIsTester(localStorage.getItem('tanq-lab-auth') === 'tester')
  }, [])

  const persistSave = useCallback((next: KouminSave) => {
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
    const questions = shuffle(getKouminQuestionsForLevel(level)).map(prepare)
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
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = calcStars(play.wrong)
      const prev = save.levelStars[play.level] ?? 0
      if (stars > prev) {
        persistSave({ ...save, levelStars: { ...save.levelStars, [play.level]: stars } })
      }
      saveScore('koumin', play.questions.length - play.wrong, play.questions.length, `Lv${play.level}`)
      setView('result')
    }
  }, [play, save, persistSave])

  // ─── MAP ────────────────────────────────────────────────────────────────────
  if (view === 'map') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/juken" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#be185d', textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
            ← 中学受験ハブにもどる
          </Link>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚖️</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#831843', margin: '0 0 4px' }}>中学受験 社会〈公民〉</h1>
            <p style={{ color: '#be185d', fontSize: '14px', margin: 0 }}>憲法・人権・三権・地方自治・経済・国際｜全{MAX_LEVEL}レベル・{KOUMIN_TOTAL}問</p>
          </div>

          {/* 公民 単元マップ */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#be185d', marginBottom: '10px' }}>🗺️ 公民 単元マップ</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {KOUMIN_UNIT_MAP.map(unit => (
                <span key={unit.name} style={{
                  fontSize: '11px', fontWeight: '600', padding: '4px 9px', borderRadius: '999px',
                  background: unit.implemented ? '#fce7f3' : '#f3f4f6',
                  color: unit.implemented ? '#be185d' : '#9ca3af',
                  border: unit.implemented ? '1px solid #f472b6' : '1px dashed #d1d5db',
                }}>
                  {unit.name}{unit.implemented ? '' : '（近日公開）'}
                </span>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#94a3b8' }}>憲法から地方自治・経済・国際まで、公民の全体をきわめよう！</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
            {[
              { label: 'クリア済み', value: Object.values(save.levelStars).filter(s => s >= 1).length, unit: 'Lv' },
              { label: '★3ゲット', value: Object.values(save.levelStars).filter(s => s === 3).length, unit: 'Lv' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '12px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#db2777' }}>{value}<span style={{ fontSize: '13px', color: '#9ca3af' }}>{unit}</span></div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {KOUMIN_LEVEL_META.map(meta => {
              const stars = (save.levelStars[meta.level] ?? 0) as 0 | 1 | 2 | 3
              const locked = meta.level > maxUnlocked
              const cleared = stars >= 1
              const count = getKouminQuestionsForLevel(meta.level).length
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
                  <div style={{ fontSize: '13px', fontWeight: '600', color: locked ? '#9ca3af' : '#831843', marginBottom: '2px' }}>{meta.title}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{meta.theme}</div>
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
                { emoji: '📜', label: '憲法の一歩', lv: 1 },
                { emoji: '🕊️', label: '人権マスター', lv: 2 },
                { emoji: '🏛️', label: '三権分立マスター', lv: 4 },
                { emoji: '🏆', label: '公民マスター', lv: 7 },
              ].map(b => {
                const earned = (save.levelStars[b.lv] ?? 0) >= 1
                return (
                  <div key={b.lv} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: earned ? '#fce7f3' : '#f3f4f6', borderRadius: '999px', padding: '4px 10px', opacity: earned ? 1 : 0.4 }}>
                    <span style={{ fontSize: '16px' }}>{b.emoji}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: earned ? '#be185d' : '#9ca3af' }}>{b.label}</span>
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
    const meta = KOUMIN_LEVEL_META[play.level - 1]
    const total = play.questions.length
    const progress = play.current / total
    const canConfirm = q.type === 'choice' ? play.selected !== null : play.picked.length === q.items.length

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button onClick={() => setView('map')} style={{ background: 'none', border: 'none', color: '#be185d', cursor: 'pointer', fontSize: '14px' }}>← もどる</button>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{meta.emoji} Lv {play.level} · {meta.title}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{play.current + 1}/{total}</div>
          </div>

          <div style={{ background: '#fbcfe8', borderRadius: '999px', height: '6px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, #ec4899, #be185d)', borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '22px 24px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#be185d', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {q.type === 'order' ? `🔢 ならべかえ（${q.orderLabel.replace(/\{([^|]+)\|[^}]+\}/g, '$1')}）` : `${meta.emoji} ${meta.title}`}
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
                  bg = '#fce7f3'; border = '2px solid #ec4899'; color = '#be185d'
                }

                return (
                  <button
                    key={i}
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
              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px', fontWeight: '600' }}>
                <Furigana text={q.orderLabel} /> の順に、カードを 1 → 2 → 3 → 4 とタップしよう
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pq.displayItems.map((item, i) => {
                  const pos = play.picked.indexOf(i)
                  const pickedAt = pos >= 0 ? pos + 1 : null
                  const correctPos = play.confirmed && pos >= 0 ? q.items[pos] === item : null
                  let bg = 'white'
                  let border = '2px solid #e7e5e4'
                  let color = '#1c1917'
                  if (play.confirmed) {
                    if (correctPos === true) { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#15803d' }
                    else { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#b91c1c' }
                  } else if (pickedAt !== null) {
                    bg = '#fce7f3'; border = '2px solid #ec4899'; color = '#be185d'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => pickOrder(i)}
                      disabled={play.confirmed}
                      style={{ background: bg, border, borderRadius: '14px', padding: '13px 16px', textAlign: 'left', cursor: play.confirmed ? 'default' : 'pointer', color, fontSize: '14px', fontWeight: '500', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: 1.7 }}
                    >
                      <span style={{
                        minWidth: '26px', height: '26px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: pickedAt !== null ? '#ec4899' : '#f5f5f4',
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
                  style={{ marginTop: '8px', background: 'none', border: 'none', color: '#be185d', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                  ならべなおす
                </button>
              )}
            </div>
          )}

          {/* 1回目のまちがい: 答えは見せず、考える足場ヒントで再挑戦 */}
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
              {play.firstWrong === null && play.attempt === 0 ? (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>🔍 豆知識</div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#14532d', lineHeight: 1.8 }}><Furigana text={q.fact} /></p>
                </div>
              ) : (
                <div style={{ background: '#fdf2f8', border: '1px solid #f9a8d4', borderRadius: '14px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: '#be185d', fontWeight: '600', marginBottom: '4px' }}>
                    {play.secondCorrect ? '✨ 再挑戦で正解！しくみをおさえよう' : '📖 なぜ？がわかる解説'}
                  </div>
                  {q.type === 'order' && (
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#831843', fontWeight: '600', lineHeight: 1.9 }}>
                      正しい順番: {q.items.map((it, i) => (
                        <span key={i}>{i > 0 && ' → '}<Furigana text={it} /></span>
                      ))}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: '14px', color: '#831843', lineHeight: 1.8 }}><Furigana text={q.explain} /></p>
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#be185d', fontWeight: '600' }}>まちがえてもだいじょうぶ。「なぜ」でおぼえれば、つぎはとける！</p>
                </div>
              )}
            </div>
          )}

          {!play.confirmed ? (
            <button
              onClick={confirm}
              disabled={!canConfirm}
              style={{ width: '100%', background: !canConfirm ? '#e7e5e4' : 'linear-gradient(135deg, #ec4899, #be185d)', color: !canConfirm ? '#9ca3af' : 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: !canConfirm ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
            >
              {play.attempt === 1 ? 'もういちど こたえる' : 'こたえる'}
            </button>
          ) : (
            <button
              onClick={next}
              style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
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
    const meta = KOUMIN_LEVEL_META[play.level - 1]

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              {stars === 3 ? '間違いゼロ！完璧です！' : stars === 2 ? '惜しい！あと少し！' : stars === 1 ? 'クリア！「なぜ」をふりかえって★3を目指そう' : 'まちがえた問題の「なぜ」をふりかえれば、つぎはきっとクリア！'}
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
              style={{ width: '100%', background: 'white', border: '2px solid #ec4899', color: '#be185d', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              もう一度 Lv {play.level}
            </button>
            {passed && play.level < MAX_LEVEL && (
              <button
                onClick={() => startLevel(play.level + 1)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                次のレベルへ Lv {play.level + 1} →
              </button>
            )}
            {play.level === MAX_LEVEL && passed && (
              <div style={{ textAlign: 'center', color: '#be185d', fontWeight: 'bold', fontSize: '16px', padding: '8px' }}>🏆 公民マスター！これで社会の地理・歴史・公民がそろったね！</div>
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
