'use client'

// 国語〈読解〉ためしてみる版（Phase B プロトタイプ）
// - AI生成オリジナル文のみ（市販文章の転載は著作権リスクのため禁止）
// - 学習設計は歴史で確立したパターンを踏襲:
//   1回目不正解 → 答えを見せず「本文にもどる足場」ヒント → 再挑戦（誤答は無効化）
//   → 答え合わせで解説＋本文の「根拠の文」をハイライト
// - スコアは初回解答のみで確定（再挑戦で水増ししない）
// - 終了画面の「おもしろかった？」3択は localStorage 保存のみ（家族テスト計測用・送信なし）

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { DOKKAI_STEPS, type DokkaiPassage } from '@/data/dokkaiData'
import { getDataKey } from '@/lib/storage'
import { saveScore } from '@/lib/scoreApi'
import { shuffle } from '@/lib/idiomQuiz'
import { Furigana } from '@/components/Furigana'
import { playCorrect, playWrong } from '@/lib/audio'

const FEEDBACK_KEY = 'tanq_dokkai_feedback_v1'
const PURPLE = '#7C5CD6'
const PURPLE_DARK = '#5B3FB8'

// 出題用: 選択肢シャッフル済みの設問
interface PreparedQuestion {
  passage: DokkaiPassage
  qIndexInPassage: number
  choices: string[]
  answer: number
}

function prepareStep(passages: readonly DokkaiPassage[]): PreparedQuestion[] {
  // 文章の順番は固定（やさしい順）。選択肢のみシャッフル
  const out: PreparedQuestion[] = []
  for (const passage of passages) {
    passage.questions.forEach((q, qi) => {
      const indexed = q.choices.map((c, i) => ({ c, isAnswer: i === q.answer }))
      const shuffled = shuffle(indexed)
      out.push({
        passage,
        qIndexInPassage: qi,
        choices: shuffled.map(({ c }) => c),
        answer: shuffled.findIndex(({ isAnswer }) => isAnswer),
      })
    })
  }
  return out
}

type View = 'home' | 'passages' | 'play' | 'result'

interface PlayState {
  step: 1 | 2 | 3 | 4
  passage: DokkaiPassage | null // ステップ4は1文章=1セットで解く（null=ステップ1〜3の通しプレイ）
  questions: PreparedQuestion[]
  current: number
  selected: number | null
  confirmed: boolean
  attempt: 0 | 1            // 0=1回目, 1=足場ヒントを見て再挑戦中
  firstWrong: number | null // 1回目にまちがえた選択肢（再選択不可）
  secondCorrect: boolean
  wrong: number
  answers: { correct: boolean }[]
}

interface Feedback { step: number; score: number; total: number; mood: string; at: string }

export default function DokkaiPage() {
  const [view, setView] = useState<View>('home')
  const [play, setPlay] = useState<PlayState | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const finishedRef = useRef(false)

  const startStep = useCallback((step: 1 | 2 | 3 | 4) => {
    // ステップ4（長文）は1文章=1セット。まず文章えらび画面へ
    if (step === 4) { setView('passages'); return }
    const meta = DOKKAI_STEPS[step - 1]
    finishedRef.current = false
    setMood(null)
    setPlay({
      step, passage: null, questions: prepareStep(meta.passages), current: 0,
      selected: null, confirmed: false, attempt: 0, firstWrong: null,
      secondCorrect: false, wrong: 0, answers: [],
    })
    setView('play')
  }, [])

  const startPassage = useCallback((passage: DokkaiPassage) => {
    finishedRef.current = false
    setMood(null)
    setPlay({
      step: 4, passage, questions: prepareStep([passage]), current: 0,
      selected: null, confirmed: false, attempt: 0, firstWrong: null,
      secondCorrect: false, wrong: 0, answers: [],
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
      // 1回目のまちがい: 答えは見せず「本文にもどる足場」ヒントで再挑戦
      setPlay({
        ...play,
        attempt: 1,
        firstWrong: play.selected,
        selected: null,
        wrong: play.wrong + 1,
        answers: [...play.answers, { correct: false }],
      })
      return
    }
    setPlay({
      ...play,
      confirmed: true,
      secondCorrect: play.attempt === 1 && correct,
      answers: play.attempt === 0 ? [...play.answers, { correct: true }] : play.answers,
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
      saveScore('dokkai', play.questions.length - play.wrong, play.questions.length,
        play.passage ? `長文「${play.passage.title ?? play.passage.id}」` : `ステップ${play.step}`)
      setView('result')
    }
  }, [play])

  const saveMood = useCallback((m: string) => {
    if (!play || mood) return
    setMood(m)
    try {
      const raw = localStorage.getItem(getDataKey(FEEDBACK_KEY))
      const list: Feedback[] = raw ? JSON.parse(raw) : []
      list.push({ step: play.step, score: play.questions.length - play.wrong, total: play.questions.length, mood: m, at: new Date().toISOString() })
      localStorage.setItem(getDataKey(FEEDBACK_KEY), JSON.stringify(list))
    } catch {}
  }, [play, mood])

  const protoBadge = (
    <span style={{ fontSize: '10px', fontWeight: 700, background: '#FDE68A', color: '#92400E', border: '1px solid #F59E0B', borderRadius: '999px', padding: '2px 8px' }}>
      ためしてみる版
    </span>
  )

  // ─── HOME ───────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/juken" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: PURPLE_DARK, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
            ← 中学受験ハブにもどる
          </Link>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📚</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E1A6E', margin: '0 0 6px' }}>国語〈読解〉</h1>
            <div style={{ marginBottom: '6px' }}>{protoBadge}</div>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
              文章を読んで、「本文のどこに書いてあるか」を見つける練習だよ。<br />
              文章はぜんぶ TANQ のオリジナル！
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DOKKAI_STEPS.map(meta => (
              <button
                key={meta.step}
                className="dk-step"
                onClick={() => startStep(meta.step as 1 | 2 | 3 | 4)}
                style={{ background: 'white', border: `2px solid ${PURPLE}`, borderRadius: '16px', padding: '16px', textAlign: 'left', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{meta.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>ステップ{meta.step}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E1A6E', marginBottom: '2px' }}>{meta.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6 }}><Furigana text={meta.sub} /></div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: PURPLE }}>
                      {meta.step === 4 ? `${meta.passages.length}文章` : `${meta.qTotal}問`}
                    </div>
                    <div style={{ fontSize: '12px', color: PURPLE_DARK }}>はじめる →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px', background: 'white', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: PURPLE_DARK, marginBottom: '4px' }}>📖 とき方のコツ</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: 1.8 }}>
              こたえは、かならず本文の中にあるよ。「なんとなく」ではなく、「本文のこの文に書いてある！」と指させたら正解だ。
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── PASSAGES（ステップ4: 文章えらび。1文章=1セット・4問） ─────────────────────
  if (view === 'passages') {
    const meta = DOKKAI_STEPS[3]
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: PURPLE_DARK, cursor: 'pointer', fontSize: '14px', marginBottom: '12px', padding: 0 }}>
            ← ステップえらびにもどる
          </button>
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '40px', marginBottom: '6px' }}>{meta.emoji}</div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E1A6E', margin: '0 0 6px' }}>ステップ4・長文読解</h1>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
              読みたい文章をえらぼう。1つの文章に4〜6問だよ。<br />
              ★の数がふえるほど、長くてむずかしくなるよ。
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {meta.passages.map(passage => (
              <button
                key={passage.id}
                className="dk-passage"
                onClick={() => startPassage(passage)}
                style={{ background: 'white', border: `2px solid ${PURPLE}`, borderRadius: '16px', padding: '16px', textAlign: 'left', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '26px' }}>{passage.kind === '物語' ? '📖' : '🔍'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, background: passage.kind === '物語' ? '#FFE3EE' : '#DBF6F0', color: passage.kind === '物語' ? '#BE3960' : '#0F766E', borderRadius: '999px', padding: '2px 8px' }}>
                        {passage.kind === '物語' ? 'ものがたり' : 'せつめい文'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>{passage.level ?? '★'}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2E1A6E' }}>{passage.title ?? '長文'}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: PURPLE }}>{passage.questions.length}問</div>
                    <div style={{ fontSize: '12px', color: PURPLE_DARK }}>よむ →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── PLAY ───────────────────────────────────────────────────────────────────
  if (view === 'play' && play && play.current < play.questions.length) {
    const pq = play.questions[play.current]
    const q = pq.passage.questions[pq.qIndexInPassage]
    const meta = DOKKAI_STEPS[play.step - 1]
    const total = play.questions.length
    const showEvidence = play.confirmed

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button onClick={() => setView(play.passage ? 'passages' : 'home')} style={{ background: 'none', border: 'none', color: PURPLE_DARK, cursor: 'pointer', fontSize: '14px' }}>← もどる</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>{meta.emoji} ステップ{play.step}{play.passage?.level ? ` ${play.passage.level}` : ''}</span>
              {protoBadge}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>{play.current + 1}/{total}</div>
          </div>

          <div style={{ background: '#DDD3F5', borderRadius: '999px', height: '6px', marginBottom: '16px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(play.current / total) * 100}%`, background: `linear-gradient(90deg, ${PURPLE}, ${PURPLE_DARK})`, borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>

          {/* 本文（答え合わせ後は根拠の文をハイライト） */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '18px 20px', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, background: pq.passage.kind === '物語' ? '#FFE3EE' : '#DBF6F0', color: pq.passage.kind === '物語' ? '#BE3960' : '#0F766E', borderRadius: '999px', padding: '2px 8px' }}>
                {pq.passage.kind === '物語' ? '📖 ものがたり' : '🔍 せつめい文'}
              </span>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>本文をよく読もう</span>
            </div>
            <div style={{ fontSize: '16px', color: '#1F2937', lineHeight: 2.1 }}>
              {pq.passage.sentences.map((s, i) => {
                const isEvidence = showEvidence && q.evidence.includes(i)
                const newPara = i > 0 && (pq.passage.paraBreaks ?? []).includes(i)
                return (
                  <span key={i}>
                    {newPara && <span style={{ display: 'block', height: '12px' }} />}
                    <span className={isEvidence ? 'dk-evidence' : undefined}
                      style={isEvidence ? { background: '#FEF08A', borderRadius: '4px', padding: '1px 2px', boxShadow: '0 0 0 1px #FACC15' } : undefined}>
                      <Furigana text={s} />
                    </span>
                  </span>
                )
              })}
            </div>
            {showEvidence && (
              <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#A16207', fontWeight: 600 }}>
                🖍️ 黄色いマーカーの文が、こたえの「根きょ」だよ
              </p>
            )}
          </div>

          {/* 設問 */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '16px 20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: PURPLE, fontWeight: 600, marginBottom: '6px' }}>
              {pq.passage.questions.length > 1 ? `もんだい ${pq.qIndexInPassage + 1}/${pq.passage.questions.length}・` : ''}{q.type}
            </div>
            <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1F2937', margin: 0, lineHeight: 1.9 }}><Furigana text={q.q} /></p>
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
                  className="dk-choice"
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

          {/* 1回目のまちがい: 答えを見せず「本文にもどる足場」 */}
          {!play.confirmed && play.attempt === 1 && (
            <div style={{ background: '#FEFCE8', border: '1px solid #FDE047', borderRadius: '14px', padding: '14px 16px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#CA8A04', fontWeight: 600, marginBottom: '4px' }}>💡 本文にもどってみよう</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#713F12', lineHeight: 1.9 }}><Furigana text={q.hint} /></p>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#A16207', fontWeight: 600 }}>もういちど えらんでみよう！</p>
            </div>
          )}

          {/* 答え合わせ: 解説（本文側の根拠ハイライトとセット） */}
          {play.confirmed && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ background: play.firstWrong === null ? '#F0FDF4' : '#FFFBEB', border: play.firstWrong === null ? '1px solid #86EFAC' : '1px solid #FCD34D', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: play.firstWrong === null ? '#16A34A' : '#B45309', fontWeight: 600, marginBottom: '4px' }}>
                  {play.firstWrong === null ? '⭕ 正解！根きょもチェック' : play.secondCorrect ? '✨ 再挑戦で正解！根きょをたしかめよう' : '📖 根きょをたしかめよう'}
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: play.firstWrong === null ? '#14532D' : '#78350F', lineHeight: 1.9 }}><Furigana text={q.explain} /></p>
                {/* 根拠の文をここにも引用（長文だと本文中の黄色マーカーが画面外で見つからないため） */}
                <div style={{ marginTop: '10px', background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#A16207', fontWeight: 700, marginBottom: '4px' }}>🖍️ 根きょの文（本文より）</div>
                  {q.evidence.map(i => (
                    <p key={i} style={{ margin: '2px 0', fontSize: '13px', color: '#713F12', lineHeight: 1.9 }}>
                      「<Furigana text={pq.passage.sentences[i]} />」
                    </p>
                  ))}
                </div>
                {play.firstWrong !== null && !play.secondCorrect && (
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#B45309', fontWeight: 600 }}>まちがえても だいじょうぶ。「本文のどこに書いてあるか」をさがすクセが、読解の力になるよ！</p>
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
    const meta = DOKKAI_STEPS[play.step - 1]
    const great = play.wrong <= 1

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F2FF 0%, #E9E0FB 100%)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>{great ? '🎉' : '📖'}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>
              {great ? 'すごい！根きょさがし名人だ！' : 'おつかれさま！'}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>
              {play.passage ? `長文読解 ${play.passage.level ?? ''}「${play.passage.title ?? '長文'}」` : `ステップ${play.step}・${meta.title}`}
            </div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {correct}<span style={{ fontSize: '18px', color: '#6B7280' }}>/{total}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
              {great ? '本文から根きょを見つける力がついてきているよ。' : 'まちがえた問題も、黄色いマーカーの文を思い出せばだいじょうぶ。'}
            </div>
          </div>

          {/* 家族テスト用の感想3択（localStorage のみ・送信なし） */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>このもんだい、おもしろかった？</div>
            {mood === null ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                {[
                  { m: 'fun', e: '😊', label: 'おもしろかった' },
                  { m: 'soso', e: '😐', label: 'ふつう' },
                  { m: 'boring', e: '😴', label: 'つまらなかった' },
                ].map(({ m, e, label }) => (
                  <button key={m} className="dk-mood" onClick={() => saveMood(m)}
                    style={{ background: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: '14px', padding: '10px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '26px' }}>{e}</span>
                    <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600 }}>{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '14px', color: PURPLE_DARK, fontWeight: 600 }}>おしえてくれてありがとう！✨</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {play.passage ? (
              <>
                <button onClick={() => startPassage(play.passage!)}
                  style={{ width: '100%', background: 'white', border: `2px solid ${PURPLE}`, color: PURPLE_DARK, borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  もう一度この文章
                </button>
                {(() => {
                  const passages = DOKKAI_STEPS[3].passages
                  const idx = passages.findIndex(p => p.id === play.passage!.id)
                  const nextPassage = passages[idx + 1]
                  if (!nextPassage) return null
                  return (
                    <button onClick={() => startPassage(nextPassage)}
                      style={{ width: '100%', background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                      つぎの文章「{nextPassage.title ?? '長文'}」へ →
                    </button>
                  )
                })()}
                <button onClick={() => setView('passages')}
                  style={{ width: '100%', background: '#F3F4F6', border: 'none', color: '#374151', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  文章えらびにもどる
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startStep(play.step)}
                  style={{ width: '100%', background: 'white', border: `2px solid ${PURPLE}`, color: PURPLE_DARK, borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  もう一度 ステップ{play.step}
                </button>
                {(() => {
                  // play.step は1始まり → 次ステップの0始まりindex（tuple範囲外も許すため配列として参照）
                  const nextMeta = (DOKKAI_STEPS as readonly { step: number; title: string }[])[play.step]
                  if (!nextMeta) return null
                  return (
                    <button onClick={() => startStep((play.step + 1) as 1 | 2 | 3 | 4)}
                      style={{ width: '100%', background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                      ステップ{play.step + 1}「{nextMeta.title}」へ →
                    </button>
                  )
                })()}
                <button onClick={() => setView('home')}
                  style={{ width: '100%', background: '#F3F4F6', border: 'none', color: '#374151', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                  ステップえらびにもどる
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
