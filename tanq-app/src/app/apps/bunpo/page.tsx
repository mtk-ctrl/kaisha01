'use client'

// 国語〈文法・敬語〉— 中学受験の文法・敬語をレベル別にとく
// 学習設計は確立パターンを踏襲:
//   1回目不正解 → 答えを見せず「見分け方の足場」ヒント → 再挑戦（誤答は無効化）
//   → 答え合わせで「正解＋理由」の解説
// スコアは初回解答のみで確定（再挑戦で水増ししない）・全文ふりがな

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { BUNPO_LEVELS, type BunpoLevel } from '@/data/bunpoData'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'
import { Furigana } from '@/components/Furigana'
import { playCorrect, playWrong } from '@/lib/audio'

const PURPLE = '#7C5CD6'
const PURPLE_DARK = '#5B3FB8'

// 出題用: 選択肢シャッフル済みの設問
interface PreparedQuestion {
  level: BunpoLevel
  qIndex: number
  choices: string[]
  answer: number
}

function prepareLevel(level: BunpoLevel): PreparedQuestion[] {
  return level.questions.map((q, qi) => {
    const indexed = q.choices.map((c, i) => ({ c, isAnswer: i === q.answer }))
    const shuffled = shuffle(indexed)
    return {
      level,
      qIndex: qi,
      choices: shuffled.map(({ c }) => c),
      answer: shuffled.findIndex(({ isAnswer }) => isAnswer),
    }
  })
}

type View = 'home' | 'play' | 'result'

interface PlayState {
  levelIndex: number
  questions: PreparedQuestion[]
  current: number
  selected: number | null
  confirmed: boolean
  attempt: 0 | 1            // 0=1回目, 1=足場ヒントを見て再挑戦中
  firstWrong: number | null // 1回目にまちがえた選択肢（再選択不可）
  secondCorrect: boolean
  wrong: number
}

export default function BunpoPage() {
  const [view, setView] = useState<View>('home')
  const [play, setPlay] = useState<PlayState | null>(null)
  const finishedRef = useRef(false)

  const startLevel = useCallback((levelIndex: number) => {
    const level = BUNPO_LEVELS[levelIndex]
    finishedRef.current = false
    setPlay({
      levelIndex, questions: prepareLevel(level), current: 0,
      selected: null, confirmed: false, attempt: 0, firstWrong: null,
      secondCorrect: false, wrong: 0,
    })
    setView('play')
  }, [])

  const select = useCallback((idx: number) => {
    setPlay(p => {
      if (!p || p.confirmed || idx === p.firstWrong) return p
      return { ...p, selected: idx }
    })
  }, [])

  const confirm = useCallback(() => {
    if (!play || play.confirmed || play.selected === null) return
    const pq = play.questions[play.current]
    const correct = play.selected === pq.answer

    if (correct) playCorrect()
    else playWrong()

    if (play.attempt === 0 && !correct) {
      // 1回目のまちがい: 答えは見せず「見分け方の足場」ヒントで再挑戦
      setPlay({
        ...play,
        attempt: 1,
        firstWrong: play.selected,
        selected: null,
        wrong: play.wrong + 1,
      })
      return
    }
    setPlay({
      ...play,
      confirmed: true,
      secondCorrect: play.attempt === 1 && correct,
    })
  }, [play])

  const next = useCallback(() => {
    setPlay(p => p ? {
      ...p, current: p.current + 1,
      selected: null, confirmed: false, attempt: 0, firstWrong: null, secondCorrect: false,
    } : p)
  }, [])

  useEffect(() => {
    if (!play) return
    if (play.current >= play.questions.length) {
      if (finishedRef.current) return
      finishedRef.current = true
      const level = BUNPO_LEVELS[play.levelIndex]
      saveScore('bunpo', play.questions.length - play.wrong, play.questions.length, level.title)
      setView('result')
    }
  }, [play])

  // ─── HOME ───────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/juken" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: PURPLE_DARK, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
            ← 中学受験ハブにもどる
          </Link>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🙇</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E1A6E', margin: '0 0 6px' }}>国語〈文法・敬語〉</h1>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
              敬語・品詞・文の組み立てを、見分け方からしっかり身につけよう。<br />
              まちがえても、答えはすぐ出さず「考える足場」で もう一度ちょうせん！
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {BUNPO_LEVELS.map((lv, i) => (
              <button
                key={lv.id}
                className="bp-level"
                onClick={() => startLevel(i)}
                style={{ background: 'white', border: `2px solid ${PURPLE}`, borderRadius: '16px', padding: '16px', textAlign: 'left', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{lv.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>レベル{i + 1}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E1A6E', marginBottom: '2px' }}>{lv.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6 }}><Furigana text={lv.sub} /></div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: PURPLE }}>{lv.questions.length}問</div>
                    <div style={{ fontSize: '12px', color: PURPLE_DARK }}>はじめる →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px', background: 'white', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: PURPLE_DARK, marginBottom: '4px' }}>🙇 敬語のコツ</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: 1.8 }}>
              「だれの動作か」で見分けよう。<b>相手</b>の動作を高めるのが<b>尊敬語</b>、<b>自分</b>の動作をへりくだるのが<b>謙譲語</b>、ていねいに言うのが<b>丁寧語</b>だよ。
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── PLAY ───────────────────────────────────────────────────────────────────
  if (view === 'play' && play && play.current < play.questions.length) {
    const pq = play.questions[play.current]
    const q = pq.level.questions[pq.qIndex]
    const level = BUNPO_LEVELS[play.levelIndex]
    const total = play.questions.length

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: PURPLE_DARK, cursor: 'pointer', fontSize: '14px' }}>← もどる</button>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>{level.emoji} {level.title}</span>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>{play.current + 1}/{total}</div>
          </div>

          <div style={{ background: '#DDD3F5', borderRadius: '999px', height: '6px', marginBottom: '16px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(play.current / total) * 100}%`, background: `linear-gradient(90deg, ${PURPLE}, ${PURPLE_DARK})`, borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>

          {/* 設問 */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '18px 20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: PURPLE, fontWeight: 600, marginBottom: '8px' }}>{q.type}</div>
            <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1F2937', margin: 0, lineHeight: 2.0 }}><Furigana text={q.q} /></p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {pq.choices.map((choice, i) => {
              const isFirstWrong = i === play.firstWrong
              let bg = 'white', border = '2px solid #E5E7EB', color = '#1F2937'
              if (play.confirmed) {
                if (i === pq.answer) { bg = '#DCFCE7'; border = '2px solid #22C55E'; color = '#15803D' }
                else if ((i === play.selected || isFirstWrong) && i !== pq.answer) { bg = '#FEE2E2'; border = '2px solid #EF4444'; color = '#B91C1C' }
              } else if (isFirstWrong) {
                bg = '#FEF2F2'; border = '2px dashed #FCA5A5'; color = '#9CA3AF'
              } else if (play.selected === i) {
                bg = '#EFE8FF'; border = `2px solid ${PURPLE}`; color = PURPLE_DARK
              }
              return (
                <button
                  key={i}
                  className="bp-choice"
                  onClick={() => select(i)}
                  disabled={play.confirmed || isFirstWrong}
                  style={{ background: bg, border, borderRadius: '14px', padding: '12px 16px', textAlign: 'left', cursor: play.confirmed || isFirstWrong ? 'default' : 'pointer', color, fontSize: '15px', fontWeight: 500, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '10px', opacity: !play.confirmed && isFirstWrong ? 0.6 : 1, lineHeight: 1.7 }}
                >
                  <span style={{ fontSize: '13px', color: '#9CA3AF', minWidth: '20px' }}>{'①②③④'[i]}</span>
                  <span style={{ flex: 1 }}><Furigana text={choice} /></span>
                  {play.confirmed && i === pq.answer && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>○</span>}
                  {((play.confirmed && i === play.selected) || isFirstWrong) && i !== pq.answer && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>×</span>}
                </button>
              )
            })}
          </div>

          {/* 1回目のまちがい: 答えを見せず「見分け方の足場」 */}
          {!play.confirmed && play.attempt === 1 && (
            <div style={{ background: '#FEFCE8', border: '1px solid #FDE047', borderRadius: '14px', padding: '14px 16px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#CA8A04', fontWeight: 600, marginBottom: '4px' }}>💡 ヒント（見分け方）</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#713F12', lineHeight: 1.9 }}><Furigana text={q.hint} /></p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#A16207', fontWeight: 600 }}>もういちど えらんでみよう！</p>
            </div>
          )}

          {/* 答え合わせ: 解説（正解＋理由） */}
          {play.confirmed && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ background: play.firstWrong === null ? '#F0FDF4' : '#FFFBEB', border: play.firstWrong === null ? '1px solid #86EFAC' : '1px solid #FCD34D', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: play.firstWrong === null ? '#16A34A' : '#B45309', fontWeight: 600, marginBottom: '4px' }}>
                  {play.firstWrong === null ? '⭕ 正解！' : play.secondCorrect ? '✨ 再挑戦で正解！' : '📖 答えと理由をたしかめよう'}
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: play.firstWrong === null ? '#14532D' : '#78350F', lineHeight: 1.9 }}><Furigana text={q.explain} /></p>
                {play.firstWrong !== null && !play.secondCorrect && (
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#B45309', fontWeight: 600 }}>まちがえても だいじょうぶ。見分け方をおぼえれば、つぎは自分で解けるよ！</p>
                )}
              </div>
            </div>
          )}

          {!play.confirmed ? (
            <button
              onClick={confirm}
              disabled={play.selected === null}
              style={{ width: '100%', background: play.selected === null ? '#E5E7EB' : `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, color: play.selected === null ? '#9CA3AF' : 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: play.selected === null ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
            >
              {play.attempt === 1 ? 'もういちど こたえる' : 'こたえる'}
            </button>
          ) : (
            <button
              onClick={next}
              style={{ width: '100%', background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
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
    const level = BUNPO_LEVELS[play.levelIndex]
    const great = play.wrong <= 1

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>{great ? '🎉' : '🙇'}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>
              {great ? 'すごい！文法名人だ！' : 'おつかれさま！'}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>レベル{play.levelIndex + 1}・{level.title}</div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {correct}<span style={{ fontSize: '18px', color: '#6B7280' }}>/{total}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
              {great ? '見分け方がしっかり身についてきているよ。' : 'まちがえた問題も、見分け方の足場を思い出せばだいじょうぶ。'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => startLevel(play.levelIndex)}
              style={{ width: '100%', background: 'white', border: `2px solid ${PURPLE}`, color: PURPLE_DARK, borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              もう一度 レベル{play.levelIndex + 1}
            </button>
            {play.levelIndex + 1 < BUNPO_LEVELS.length && (
              <button onClick={() => startLevel(play.levelIndex + 1)}
                style={{ width: '100%', background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                レベル{play.levelIndex + 2}「{BUNPO_LEVELS[play.levelIndex + 1].title}」へ →
              </button>
            )}
            <button onClick={() => setView('home')}
              style={{ width: '100%', background: '#F3F4F6', border: 'none', color: '#374151', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              レベルえらびにもどる
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
