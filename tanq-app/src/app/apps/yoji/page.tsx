'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  YOJI_LEVEL_META,
  getYojiQuestionsForLevel,
  type YojiQuestion,
} from '@/data/yojiData'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle, getUsageHint } from '@/lib/idiomQuiz'
import { Furigana } from '@/components/Furigana'
import { playCorrect, playWrong } from '@/lib/audio'

const STORAGE_KEY = 'tanq_yoji_v1'

interface YojiSave {
  levelStars: Record<number, 0 | 1 | 2 | 3>
}

function loadSave(): YojiSave {
  if (typeof window === 'undefined') return { levelStars: {} }
  try {
    const raw = localStorage.getItem(getDataKey(STORAGE_KEY))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { levelStars: {} }
}

function writeSave(save: YojiSave) {
  localStorage.setItem(getDataKey(STORAGE_KEY), JSON.stringify(save))
}

function calcStars(wrong: number): 0 | 1 | 2 | 3 {
  if (wrong === 0) return 3
  if (wrong === 1) return 2
  if (wrong === 2) return 1
  return 0
}

function shuffleChoices(q: YojiQuestion): YojiQuestion {
  const indexed = q.choices.map((c, i) => ({ c, isAnswer: i === q.answer }))
  const shuffled = shuffle(indexed)
  return {
    ...q,
    choices: shuffled.map(({ c }) => c) as [string, string, string, string],
    answer: shuffled.findIndex(({ isAnswer }) => isAnswer) as 0 | 1 | 2 | 3,
  }
}

type View = 'map' | 'quiz' | 'result'

interface QuizState {
  level: number
  questions: YojiQuestion[]
  current: number
  selected: number | null
  confirmed: boolean
  attempt: 0 | 1            // 0=1回目, 1=ヒントを見て再挑戦中
  firstWrong: number | null // 1回目にまちがえた選択肢（再選択不可にする）
  wrong: number
  answers: { correct: boolean; q: YojiQuestion }[]
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
    '超かんたん': '#22c55e',
    'かんたん':   '#84cc16',
    'ふつう':     '#3b82f6',
    'ちょいむず': '#f59e0b',
    'むずかしい': '#f97316',
    'かなりむず': '#ef4444',
    'ちょう難しい': '#dc2626',
    '最難関':     '#7c3aed',
  }
  return map[difficulty] ?? '#6b7280'
}

export default function YojiPage() {
  const [view, setView] = useState<View>('map')
  const [save, setSave] = useState<YojiSave>({ levelStars: {} })
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [isTester, setIsTester] = useState(false)

  useEffect(() => {
    setSave(loadSave())
    setIsTester(localStorage.getItem('tanq-lab-auth') === 'tester')
  }, [])

  const persistSave = useCallback((next: YojiSave) => {
    setSave(next)
    writeSave(next)
  }, [])

  const maxUnlocked = (() => {
    if (isTester) return 20
    let max = 1
    for (let lv = 1; lv <= 20; lv++) {
      if ((save.levelStars[lv] ?? 0) >= 1) max = lv + 1
      else break
    }
    return Math.min(max, 20)
  })()

  const finishedRef = useRef(false)

  const startLevel = useCallback((level: number) => {
    const questions = getYojiQuestionsForLevel(level)
    const shuffled = shuffle(questions).map(shuffleChoices)
    finishedRef.current = false
    setQuiz({ level, questions: shuffled, current: 0, selected: null, confirmed: false, attempt: 0, firstWrong: null, wrong: 0, answers: [] })
    setView('quiz')
  }, [])

  const select = useCallback((idx: number) => {
    setQuiz(q => {
      if (!q || q.confirmed || idx === q.firstWrong) return q
      return { ...q, selected: idx }
    })
  }, [])

  const confirm = useCallback(() => {
    if (!quiz || quiz.selected === null || quiz.confirmed) return
    const question = quiz.questions[quiz.current]
    const correct = quiz.selected === question.answer
    if (correct) playCorrect()
    else playWrong()

    if (quiz.attempt === 0 && !correct) {
      // 1回目のまちがい: 答えは見せず、ヒントを出してもう一度考えてもらう。
      // スコア・⭐は初回解答で確定（再挑戦で水増ししない）
      setQuiz({
        ...quiz,
        attempt: 1,
        firstWrong: quiz.selected,
        selected: null,
        wrong: quiz.wrong + 1,
        answers: [...quiz.answers, { correct: false, q: question }],
      })
      return
    }
    // 初回正解 or 再挑戦の答え合わせ（記録は初回分のみ）
    setQuiz({
      ...quiz,
      confirmed: true,
      answers: quiz.attempt === 0 ? [...quiz.answers, { correct: true, q: question }] : quiz.answers,
    })
  }, [quiz])

  const next = useCallback(() => {
    setQuiz(q => {
      if (!q) return q
      return { ...q, current: q.current + 1, confirmed: false, selected: null, attempt: 0, firstWrong: null }
    })
  }, [])

  useEffect(() => {
    if (!quiz) return
    if (quiz.current >= quiz.questions.length) {
      if (finishedRef.current) return // persistSave 再実行時に saveScore を二重送信しない
      finishedRef.current = true
      const stars = calcStars(quiz.wrong)
      const prev = save.levelStars[quiz.level] ?? 0
      if (stars > prev) {
        const next = { ...save, levelStars: { ...save.levelStars, [quiz.level]: stars } }
        persistSave(next)
      }
      saveScore('yoji', quiz.questions.length - quiz.wrong, quiz.questions.length, `Lv${quiz.level}`)
      setView('result')
    }
  }, [quiz, save, persistSave])

  // ─── MAP ────────────────────────────────────────────────────────────────────
  if (view === 'map') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/lab" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#7c3aed', textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
            ← ラボにもどる
          </Link>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📝</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>四字熟語</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>故事・受験頻出 全20レベル</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
            {[
              { label: 'クリア済み', value: Object.values(save.levelStars).filter(s => s >= 1).length, unit: 'Lv' },
              { label: '★3ゲット', value: Object.values(save.levelStars).filter(s => s === 3).length, unit: 'Lv' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '12px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#7c3aed' }}>{value}<span style={{ fontSize: '13px', color: '#9ca3af' }}>{unit}</span></div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {YOJI_LEVEL_META.map(meta => {
              const stars = (save.levelStars[meta.level] ?? 0) as 0 | 1 | 2 | 3
              const locked = meta.level > maxUnlocked
              const cleared = stars >= 1
              return (
                <button
                  key={meta.level}
                  onClick={() => !locked && startLevel(meta.level)}
                  disabled={locked}
                  style={{
                    background: 'white',
                    border: cleared ? `2px solid ${difficultyColor(meta.difficulty)}` : '2px solid #e5e7eb',
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
                  <div style={{ fontSize: '13px', fontWeight: '600', color: locked ? '#9ca3af' : '#1e1b4b', marginBottom: '4px' }}>{meta.title}</div>
                  <span style={{ fontSize: '10px', background: difficultyColor(meta.difficulty) + '22', color: difficultyColor(meta.difficulty), padding: '2px 6px', borderRadius: '999px', fontWeight: '600' }}>
                    {meta.difficulty}
                  </span>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {getYojiQuestionsForLevel(meta.level).length}問
                  </div>
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>バッジ</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { emoji: '🌸', label: 'はじめの一歩', lv: 1 },
                { emoji: '📝', label: '5レベル制覇', lv: 5 },
                { emoji: '📚', label: '10レベル制覇', lv: 10 },
                { emoji: '💎', label: '15レベル制覇', lv: 15 },
                { emoji: '🏆', label: '四字熟語マスター', lv: 20 },
              ].map(b => {
                const earned = (save.levelStars[b.lv] ?? 0) >= 1
                return (
                  <div key={b.lv} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: earned ? '#f3e8ff' : '#f3f4f6', borderRadius: '999px', padding: '4px 10px', opacity: earned ? 1 : 0.4 }}>
                    <span style={{ fontSize: '16px' }}>{b.emoji}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: earned ? '#5b21b6' : '#9ca3af' }}>{b.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── QUIZ ───────────────────────────────────────────────────────────────────
  if (view === 'quiz' && quiz && quiz.current < quiz.questions.length) {
    const q = quiz.questions[quiz.current]
    const meta = YOJI_LEVEL_META[quiz.level - 1]
    const total = quiz.questions.length
    const progress = quiz.current / total

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button onClick={() => setView('map')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '14px' }}>← もどる</button>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{meta.emoji} Lv {quiz.level} · {meta.title}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{quiz.current + 1}/{total}</div>
          </div>

          <div style={{ background: '#e9d5ff', borderRadius: '999px', height: '6px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1)', borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              四字熟語
            </div>
            <p style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e1b4b', margin: 0, lineHeight: 1.8 }}><Furigana text={q.furigana ?? q.q} /></p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {q.choices.map((choice, i) => {
              const isFirstWrong = i === quiz.firstWrong
              let bg = 'white'
              let border = '2px solid #e5e7eb'
              let color = '#1e1b4b'

              if (quiz.confirmed) {
                if (i === q.answer) { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#15803d' }
                else if ((i === quiz.selected || isFirstWrong) && i !== q.answer) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#b91c1c' }
              } else if (isFirstWrong) {
                bg = '#fef2f2'; border = '2px dashed #fca5a5'; color = '#9ca3af'
              } else if (quiz.selected === i) {
                bg = '#ede9fe'; border = '2px solid #8b5cf6'; color = '#5b21b6'
              }

              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={quiz.confirmed || isFirstWrong}
                  style={{ background: bg, border, borderRadius: '14px', padding: '14px 16px', textAlign: 'left', cursor: quiz.confirmed || isFirstWrong ? 'default' : 'pointer', color, fontSize: '15px', fontWeight: '500', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px', opacity: !quiz.confirmed && isFirstWrong ? 0.6 : 1 }}
                >
                  <span style={{ fontSize: '13px', color: '#9ca3af', minWidth: '20px' }}>{'①②③④'[i]}</span>
                  {choice}
                  {quiz.confirmed && i === q.answer && <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 'bold' }}>○</span>}
                  {((quiz.confirmed && i === quiz.selected) || isFirstWrong) && i !== q.answer && <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 'bold' }}>×</span>}
                </button>
              )
            })}
          </div>

          {/* 1回目のまちがい: 答えは見せず、使われる場面のヒントで再挑戦 */}
          {!quiz.confirmed && quiz.attempt === 1 && (
            <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#ca8a04', fontWeight: '600', marginBottom: '4px' }}>💡 ヒント</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#713f12', lineHeight: 1.6 }}>{getUsageHint(q.explain)}</p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#a16207', fontWeight: '600' }}>もういちど えらんでみよう！</p>
            </div>
          )}

          {quiz.confirmed && (
            <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600', marginBottom: '4px' }}>{quiz.firstWrong !== null ? '解説（おぼえちゃおう！）' : '解説'}</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#3730a3', lineHeight: 1.6 }}>{q.explain}</p>
              {quiz.firstWrong !== null && (
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>まちがえてもだいじょうぶ。つぎに出たら、もうとけるね！</p>
              )}
            </div>
          )}

          {!quiz.confirmed ? (
            <button
              onClick={confirm}
              disabled={quiz.selected === null}
              style={{ width: '100%', background: quiz.selected === null ? '#e5e7eb' : 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: quiz.selected === null ? '#9ca3af' : 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: quiz.selected === null ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
            >
              {quiz.attempt === 1 ? 'もういちど こたえる' : 'こたえる'}
            </button>
          ) : (
            <button
              onClick={next}
              style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {quiz.current + 1 < total ? 'つぎへ →' : '結果を見る'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── RESULT ─────────────────────────────────────────────────────────────────
  if (view === 'result' && quiz) {
    const total = quiz.questions.length
    const correct = total - quiz.wrong
    const stars = calcStars(quiz.wrong)
    const passed = stars >= 1
    const meta = YOJI_LEVEL_META[quiz.level - 1]

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>{passed ? (stars === 3 ? '🎉' : '🌟') : '😢'}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '4px' }}>
              {passed ? (stars === 3 ? 'かんぺき！' : 'クリア！') : 'もう一度チャレンジ！'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Lv {quiz.level} · {meta.title}</div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {correct}<span style={{ fontSize: '18px', color: '#6b7280' }}>/{total}</span>
            </div>
            <div style={{ marginBottom: '8px' }}><StarDisplay stars={stars} /></div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {stars === 3 ? '間違いゼロ！完璧です！' : stars === 2 ? '惜しい！あと少し！' : stars === 1 ? 'クリア！もっと練習しよう' : 'まちがえた言葉をふりかえれば、つぎはきっとクリア！'}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>問題の振り返り</div>
            {quiz.answers.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: i < quiz.answers.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', flexShrink: 0, color: a.correct ? '#22c55e' : '#ef4444' }}>{a.correct ? '○' : '×'}</span>
                <div>
                  <div style={{ fontSize: '13px', color: '#374151' }}>{a.q.q}</div>
                  {!a.correct && (
                    <>
                      <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', marginTop: '2px' }}>
                        正解: {a.q.choices[a.q.answer]}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', lineHeight: 1.5 }}>
                        {a.q.explain}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => startLevel(quiz.level)}
              style={{ width: '100%', background: 'white', border: '2px solid #8b5cf6', color: '#7c3aed', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              もう一度 Lv {quiz.level}
            </button>
            {passed && quiz.level < 20 && (
              <button
                onClick={() => startLevel(quiz.level + 1)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                次のレベルへ Lv {quiz.level + 1} →
              </button>
            )}
            {quiz.level === 20 && passed && (
              <div style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 'bold', fontSize: '16px', padding: '8px' }}>🏆 全レベルクリア！四字熟語マスター！</div>
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
