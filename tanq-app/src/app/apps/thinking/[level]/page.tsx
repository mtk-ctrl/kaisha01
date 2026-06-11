'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { THINKING_QUESTIONS, QUESTIONS_PER_LEVEL, UNLOCK_THRESHOLD } from '@/data/thinkingData'
import { BADGES, TYPE_TO_BADGE } from '@/data/thinkingBadges'
import {
  loadProgress, saveProgress, isLevelUnlocked,
  getLevelProgress, getLevelStars, recordLevelResult, updateStreak,
  type ThinkingProgress
} from '@/lib/thinkingProgress'
import { shuffle } from '@/lib/idiomQuiz'
import { saveScore } from '@/lib/scoreApi'

const SESSION_KEY = 'tanq-lab-auth'
const GUEST_FREE_LEVELS = 2

// 選択肢をシャッフルして正解位置を分散させる（データ上は常に先頭が正解のため必須）
function shuffleOptions<T extends { options: string[]; correctIndex: number }>(q: T): T {
  const order = shuffle(q.options.map((_, i) => i))
  return { ...q, options: order.map(i => q.options[i]), correctIndex: order.indexOf(q.correctIndex) }
}

// ─── 考え方の足場ヒント（問題タイプ別・答えは言わない）────
const TYPE_HINTS: Record<string, string> = {
  A1: 'ばめんを頭の中で絵にしてみよう。「同じかずずつ分ける」「ふえる」「へる」のどれかな？',
  A2: '文に出てくる数字に○をつけて、何がどうなったか、じゅんばんに追いかけてみよう。',
  A3: '答えを出すのに「本当にいる数字」はどれかな？いらない数字もまざっているよ。',
  A4: '式を声に出して読んで、「どんなお話の場面か」を想像してみよう。',
  B1: 'かげは太陽の反対がわにできるよ。太陽がどこにあるか、もう一度たしかめよう。',
  B2: '真上にカメラがあるつもりで、上から見たところを頭の中で想像してみよう。',
  B3: '見えない場所にも積み木がかくれていないかな？うしろや下も考えてみよう。',
  B4: '鏡は左右が反対に映るよ。鏡の前に立った自分を想像してみよう。',
  B5: 'その人になったつもりで、その場所から何が見えるか考えてみよう。',
  C1: '生き物は小さいすがたから大きいすがたへ育つよ。一番はじめのすがたはどれかな？',
  C2: 'じゅんばんを入れかえたら変にならないか、1つずつたしかめてみよう。',
  C3: '自然のできごとは「原因→結果」のじゅんばんで起きるよ。何が先に起きるかな？',
  C4: '今の様子は「手がかり」だよ。「何があればこうなるか」を逆から考えてみよう。',
  C5: 'このまま時間がたつと、どう変わっていくか想像してみよう。',
  D1: 'その体の特ちょうが「何の役に立つか」を考えてみよう。',
  D2: '「なぜ？」を「どういう仕組みでそうなる？」に言いかえて考えてみよう。',
  D3: 'そのルールが「なかったら、だれが困るか」を考えてみよう。',
  D4: '「もしなかったら」をじゅんばんに想像しよう。まず何が起きる？その次は？',
  E1: 'まず3つに共通することを見つけよう。それにあてはまらないのが仲間はずれだよ。',
  E2: '見た目・使い方・育ち方・住む場所…いろんな角度でくらべてみよう。',
  E3: '「どんな仲間に分けられるか」、グループの名前を考えてみよう。',
  F1: '答えからさかのぼって「その前はどうだった？」と考えてみよう。',
  F2: '答えを出すために「ぜったいに必要な情報」はどれか、えらび出そう。',
  F3: '答えを出すために「まだ足りない情報」はないか、たしかめてみよう。',
  G1: 'ならびを声に出して読んでみよう。「いくつずつ」変わっているかな？',
  G2: 'ふだんの生活とくらべて「ありえないこと」をさがそう。何もない場合もあるよ。',
  G3: '左のペアの関係を言葉にしてみよう。「〜は〜する場所」みたいにね。',
}
const DEFAULT_HINT = 'あわてなくて大丈夫。問題文をもう一度ゆっくり読んで、手がかりをさがしてみよう。'

function getUserType(): 'guest' | 'tester' | 'member' {
  if (typeof window === 'undefined') return 'guest'
  const v = localStorage.getItem(SESSION_KEY)
  if (v === 'member') return 'member'
  if (v === 'tester') return 'tester'
  return 'guest'
}

// ─── キャラクター（ネコ）──────────────────────────────────
type CatMood = 'normal' | 'happy' | 'excited' | 'dancing' | 'cheer' | 'celebrate'

function CatCharacter({ mood }: { mood: CatMood }) {
  const faces: Record<CatMood, string> = {
    normal:    '(=ↀᆺↀ=)',
    happy:     '(=^▽^=)♪',
    excited:   '(=^ω^=)✨',
    dancing:   '~(=^・ω・^)ノ☆',
    cheer:     '(=ↀᆺↀ=)ᕙ',
    celebrate: '(≧◡≦)✨🎉',
  }
  const colors: Record<CatMood, string> = {
    normal:    'text-gray-600',
    happy:     'text-orange-500',
    excited:   'text-pink-500',
    dancing:   'text-purple-500',
    cheer:     'text-blue-500',
    celebrate: 'text-yellow-500',
  }
  return (
    <div className={`text-center font-mono text-sm font-bold transition-all duration-300 ${colors[mood]}
      ${mood === 'dancing' ? 'animate-bounce' : ''}
      ${mood === 'celebrate' ? 'animate-pulse' : ''}
    `}>
      {faces[mood]}
    </div>
  )
}

// ─── ふりがな（ルビ）────────────────────────────────────────
function RubyText({ text }: { text: string }) {
  const parts = text.split(/\[([^|]+)\|([^\]]+)\]/g)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 0) return part || null
        if (i % 3 === 1) return (
          <ruby key={i}>
            {part}
            <rt className="text-[0.6em] text-gray-400">{parts[i + 1]}</rt>
          </ruby>
        )
        return null
      })}
    </>
  )
}

// ─── 花火 ────────────────────────────────────────────────
const EMOJIS = ['🎆', '🎇', '✨', '🎉', '⭐', '💫']

function Fireworks({ active }: { active: boolean }) {
  // マウント時に1回だけ位置を確定（レンダーごとに変わらないように）
  const particles = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      top:      `${5 + Math.random() * 60}%`,
      left:     `${5 + Math.random() * 90}%`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      delay:    `${Math.random() * 0.3}s`,
      emoji:    EMOJIS[i % EMOJIS.length],
    })),
  [])

  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-bounce"
          style={{
            top: p.top, left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: 0.9,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

// ─── バッジ取得通知 ───────────────────────────────────────
function BadgeToast({ badgeId, type, onDone }: { badgeId: string; type: 'silver' | 'gold'; onDone: () => void }) {
  const badge = BADGES.find(b => b.id === badgeId)
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    // onDone はインライン関数で毎レンダー変わるため ref 経由で呼ぶ（タイマーのリセットを防ぐ）
    const t = setTimeout(() => onDoneRef.current(), 2500)
    return () => clearTimeout(t)
  }, [])
  if (!badge) return null
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-center
      ${type === 'gold'
        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
      }`}
    >
      <div className="text-2xl">{badge.emoji}</div>
      <div className="font-bold text-sm">{type === 'gold' ? '🥇ゴールドバッジ！' : '🥈シルバーバッジ！'}</div>
      <div className="text-xs mt-0.5">{badge.name}をゲット！</div>
      <div className="flex justify-center mt-1 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-xs animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>✨</span>
        ))}
      </div>
    </div>
  )
}

// ─── レビュー画面（回答後の説明） ────────────────────────
function ReviewScreen({
  question,
  selectedIndex,
  firstTry,
  onNext,
  consecutiveCorrect,
}: {
  question: (typeof THINKING_QUESTIONS)[0]
  selectedIndex: number
  firstTry: boolean
  onNext: () => void
  consecutiveCorrect: number
}) {
  const correct = selectedIndex === question.correctIndex
  const streakMsg =
    consecutiveCorrect >= 10 ? '🏆 10問連続正解！天才！！'
    : consecutiveCorrect >= 5 ? '🎆 5問連続！すごい！'
    : consecutiveCorrect >= 3 ? '✨ 3問連続！ナイス！'
    : null

  const catMood: CatMood = consecutiveCorrect >= 5 ? 'dancing'
    : consecutiveCorrect >= 3 ? 'excited'
    : correct ? 'happy'
    : 'cheer'

  // 難易度に応じて説明の見せ方を変える
  const diffLabel = ['', '★☆☆', '★★☆', '★★★'][question.difficulty]

  return (
    <div className="flex flex-col h-full">
      {/* 正解・不正解バナー */}
      <div className={`px-4 py-4 text-center ${correct ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className={`text-2xl font-bold mb-1 ${correct ? 'text-green-600' : 'text-red-500'}`}>
          {correct ? (firstTry ? '✅ 正解！' : '💪 ヒントで正解！') : '惜しい！'}
        </div>
        {!firstTry && correct && (
          <div className="text-xs text-green-700">自分で考え直せたのがえらい！つぎは1回目でねらおう</div>
        )}
        <CatCharacter mood={catMood} />
        {streakMsg && (
          <div className="mt-2 text-sm font-bold text-purple-600 animate-pulse">{streakMsg}</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 問題の振り返り */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 font-medium mb-2">📌 もんだいのふりかえり</div>
          <div className="text-sm text-gray-700 leading-relaxed"><RubyText text={question.question} /></div>
        </div>

        {/* 答え比較 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-medium mb-2">こたえのかくにん</div>
          <div className={`flex items-center gap-2 p-2 rounded-xl text-sm
            ${correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          >
            <span>{correct ? '✅' : '❌'}</span>
            <span className="font-medium">あなたのこたえ：</span>
            <span><RubyText text={question.options[selectedIndex]} /></span>
          </div>
          {!correct && (
            <div className="flex items-center gap-2 p-2 rounded-xl text-sm bg-green-50 text-green-700">
              <span>⭕</span>
              <span className="font-medium">正しいこたえ：</span>
              <span><RubyText text={question.options[question.correctIndex]} /></span>
            </div>
          )}
        </div>

        {/* 説明文（難易度別） */}
        <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 font-bold text-sm">💡 なぜそうなるの？</span>
            <span className="text-xs text-blue-300">{diffLabel}</span>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed">
            <RubyText text={correct ? question.feedback.correct : question.feedback.incorrect} />
          </div>

          {/* ★★★のみ：思考ステップ表示 */}
          {question.difficulty === 3 && question.feedback.steps && (
            <div className="mt-3 space-y-1.5">
              <div className="text-xs text-blue-500 font-medium">🪜 考え方のステップ</div>
              {question.feedback.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="bg-blue-200 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span><RubyText text={step} /></span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-2 pb-6">
          <button
            onClick={onNext}
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-md"
          >
            わかった！　つぎへ →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── レベル結果画面 ───────────────────────────────────────
function LevelResultScreen({
  level,
  score,
  progress,
  newSilver,
  newGold,
  onRetry,
  onNext,
}: {
  level: number
  score: number
  progress: ThinkingProgress
  newSilver: string[]
  newGold: string[]
  onRetry: () => void
  onNext: () => void
}) {
  const cleared = score >= UNLOCK_THRESHOLD
  const stars = getLevelStars(score)
  const nextUnlocked = isLevelUnlocked(level + 1, progress)

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
      <div className="text-5xl">
        {score >= QUESTIONS_PER_LEVEL ? '🏆' : cleared ? '🎉' : '😿'}
      </div>

      <div>
        <div className={`text-2xl font-bold ${cleared ? 'text-green-600' : 'text-gray-500'}`}>
          {score}/{QUESTIONS_PER_LEVEL}問 正解！
        </div>
        <div className="text-3xl mt-2">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-200'}>⭐</span>
          ))}
        </div>
      </div>

      {score >= QUESTIONS_PER_LEVEL && (
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl px-6 py-3 w-full shadow-md">
          <div className="text-white font-bold text-lg">🎊 パーフェクト！</div>
          <div className="text-yellow-100 text-sm">5問全部正解！すごい！！</div>
        </div>
      )}

      {cleared ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-3">
          <div className="text-green-700 font-bold">
            {level < 20 && nextUnlocked ? `🔓 レベル${level + 1}がひらいたよ！` : 'クリア！'}
          </div>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3">
          <div className="text-orange-700 font-bold text-sm">
            あと{UNLOCK_THRESHOLD - score}問正解で次のレベルへ！
          </div>
        </div>
      )}

      {(newSilver.length > 0 || newGold.length > 0) && (
        <div className="bg-yellow-50 rounded-2xl p-3 w-full">
          <div className="text-sm font-bold text-yellow-700 mb-1">🏅 バッジゲット！</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {newGold.map(id => {
              const b = BADGES.find(x => x.id === id)
              return b ? (
                <span key={id} className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  🥇{b.name}
                </span>
              ) : null
            })}
            {newSilver.map(id => {
              const b = BADGES.find(x => x.id === id)
              return b ? (
                <span key={id} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  🥈{b.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRetry}
          className="w-full bg-white border-2 border-blue-300 text-blue-600 font-bold py-3 rounded-2xl active:scale-95 transition-all"
        >
          ← もう一度チャレンジ
        </button>
        {cleared && level < 20 && (
          <button
            onClick={onNext}
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            つぎのレベルへ →
          </button>
        )}
        <Link
          href="/apps/thinking"
          className="w-full text-center text-gray-400 text-sm py-2"
        >
          レベル一覧にもどる
        </Link>
      </div>
    </div>
  )
}

// ─── メインゲーム画面 ─────────────────────────────────────
type Phase = 'question' | 'review' | 'result'

export default function ThinkingGamePage() {
  const params = useParams()
  const router = useRouter()
  const level = Number(params.level)

  const [progress, setProgress] = useState<ThinkingProgress | null>(null)
  const [phase, setPhase] = useState<Phase>('question')
  const [questions, setQuestions] = useState<typeof THINKING_QUESTIONS>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [attempt, setAttempt] = useState<0 | 1>(0)              // 0=1回目, 1=ヒントを見て再挑戦中
  const [firstWrong, setFirstWrong] = useState<number | null>(null) // 1回目に選んだまちがいの選択肢
  const [correctIds, setCorrectIds] = useState<number[]>([])
  const [showFireworks, setShowFireworks] = useState(false)
  const [toasts, setToasts] = useState<{ id: string; type: 'silver' | 'gold' }[]>([])
  const [resultData, setResultData] = useState<{ newSilver: string[]; newGold: string[] }>({ newSilver: [], newGold: [] })

  useEffect(() => {
    const p = loadProgress()
    setProgress(p)
    // ゲストはLv2までのみ
    if (getUserType() === 'guest' && level > GUEST_FREE_LEVELS) {
      router.replace('/register')
      return
    }
    if (!isLevelUnlocked(level, p)) {
      router.replace('/apps/thinking')
      return
    }
    const qs = THINKING_QUESTIONS.filter(q => q.level === level).map(shuffleOptions)
    setQuestions(qs)
  }, [level, router])

  if (!progress || questions.length === 0) return null

  const q = questions[current]
  const consecutiveCorrect = progress.consecutiveCorrect

  function handleAnswer(idx: number) {
    if (selected !== null || !progress) return
    if (idx === firstWrong) return

    const correct = idx === q.correctIndex

    if (attempt === 0) {
      // スコア・ストリークは初回解答のみで記録する（再挑戦で水増ししない）
      const updatedProgress = updateStreak(correct, progress)
      setProgress(updatedProgress)
      saveProgress(updatedProgress)

      if (correct) {
        setCorrectIds(ids => [...ids, q.id])
        if (updatedProgress.consecutiveCorrect >= 5) {
          setShowFireworks(true)
          setTimeout(() => setShowFireworks(false), 1500)
        }
        setSelected(idx)
        setPhase('review')
      } else {
        // 1回目のまちがい: 答えは見せず、考え方のヒントを出してもう一度考えてもらう
        setFirstWrong(idx)
        setAttempt(1)
      }
      return
    }

    // 2回目: 記録は変えず、答え合わせと考え方の確認だけ行う
    setSelected(idx)
    setPhase('review')
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAttempt(0)
      setFirstWrong(null)
      setPhase('question')
    } else {
      if (!progress) return
      // レベル終了
      const { updated, newSilver, newGold } = recordLevelResult(level, correctIds, progress)
      setProgress(updated)
      saveProgress(updated)
      saveScore('thinking', correctIds.length, questions.length, `lv${level}`)
      setResultData({ newSilver, newGold })

      // バッジトースト
      const allToasts = [
        ...newGold.map(id => ({ id, type: 'gold' as const })),
        ...newSilver.filter(id => !newGold.includes(id)).map(id => ({ id, type: 'silver' as const })),
      ]
      if (allToasts.length > 0) {
        setToasts(allToasts)
      }

      if (correctIds.length >= UNLOCK_THRESHOLD) {
        setShowFireworks(true)
        setTimeout(() => setShowFireworks(false), 2000)
      }

      setPhase('result')
    }
  }

  function handleRetry() {
    const p = loadProgress()
    setProgress(p)
    // 選択肢の並びを覚えてしまわないよう再シャッフル
    setQuestions(THINKING_QUESTIONS.filter(q2 => q2.level === level).map(shuffleOptions))
    setCurrent(0)
    setSelected(null)
    setAttempt(0)
    setFirstWrong(null)
    setCorrectIds([])
    setPhase('question')
  }

  function handleNextLevel() {
    router.push(`/apps/thinking/${level + 1}`)
  }

  const score = correctIds.length

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* 花火 */}
      <Fireworks active={showFireworks} />

      {/* バッジトースト */}
      {toasts.length > 0 && (
        <BadgeToast
          badgeId={toasts[0].id}
          type={toasts[0].type}
          onDone={() => setToasts(t => t.slice(1))}
        />
      )}

      {/* ヘッダー */}
      {phase !== 'result' && (
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 shrink-0">
          <Link href="/apps/thinking" className="text-gray-400 text-lg">←</Link>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-700">レベル {level}</div>
            <div className="text-xs text-gray-400">
              {UNLOCK_THRESHOLD}問正解でクリア
            </div>
          </div>
          {/* 進捗インジケーター */}
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">
              ✓ <span className="font-bold text-green-600">{score}</span> / {QUESTIONS_PER_LEVEL}問正解
            </div>
            <div className="flex gap-1">
              {questions.map((_, i) => {
                // review フェーズ中は current 問も回答済みとして色を出す
                const answered = i < current || (phase === 'review' && i === current)
                const isCorrect = answered && correctIds.includes(questions[i].id)
                return (
                  <div
                    key={i}
                    className={`w-4 h-2 rounded-full transition-all
                      ${answered ? (isCorrect ? 'bg-green-400' : 'bg-red-300')
                        : i === current ? 'bg-blue-400'
                        : 'bg-gray-200'}`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        {phase === 'question' && (
          <QuestionScreen
            question={q}
            questionIndex={current}
            total={questions.length}
            onAnswer={handleAnswer}
            hint={attempt === 1 ? (TYPE_HINTS[q.type] ?? DEFAULT_HINT) : null}
            disabledIndex={firstWrong}
          />
        )}
        {phase === 'review' && selected !== null && (
          <ReviewScreen
            question={q}
            selectedIndex={selected}
            firstTry={attempt === 0}
            onNext={handleNext}
            consecutiveCorrect={consecutiveCorrect}
          />
        )}
        {phase === 'result' && progress && (
          <LevelResultScreen
            level={level}
            score={score}
            progress={progress}
            newSilver={resultData.newSilver}
            newGold={resultData.newGold}
            onRetry={handleRetry}
            onNext={handleNextLevel}
          />
        )}
      </div>
    </div>
  )
}

// ─── 問題画面 ─────────────────────────────────────────────
function QuestionScreen({
  question, questionIndex, total, onAnswer, hint, disabledIndex,
}: {
  question: (typeof THINKING_QUESTIONS)[0]
  questionIndex: number
  total: number
  onAnswer: (idx: number) => void
  hint: string | null
  disabledIndex: number | null
}) {
  const diffColors: Record<number, string> = {
    1: 'bg-green-100 text-green-600',
    2: 'bg-yellow-100 text-yellow-600',
    3: 'bg-red-100 text-red-600',
  }
  const diffLabel = ['', '★☆☆ かんたん', '★★☆ ふつう', '★★★ むずかしい'][question.difficulty]

  return (
    <div className="flex flex-col h-full">
      {/* 問題番号・難易度 */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <span className="text-sm font-bold text-gray-500">{questionIndex + 1} / {total}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[question.difficulty]}`}>
          {diffLabel}
        </span>
      </div>

      {/* 問題文 */}
      <div className="px-4 pb-3 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-base leading-relaxed text-gray-800 font-medium">
            <RubyText text={question.question} />
          </div>
        </div>

        {/* 1回目まちがい後の「考え方の足場」ヒント */}
        {hint && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="text-amber-700 font-bold text-sm mb-1">💭 おしい！もういちど考えてみよう</div>
            <div className="text-sm text-gray-700 leading-relaxed">{hint}</div>
          </div>
        )}

        {/* 選択肢 */}
        <div className="space-y-3 pb-4">
          {question.options.map((opt, i) => {
            const isDisabled = i === disabledIndex
            return (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                disabled={isDisabled}
                className={`w-full text-left rounded-2xl px-4 py-4
                  text-sm font-medium transition-all duration-150 shadow-sm
                  ${isDisabled
                    ? 'bg-gray-100 border-2 border-gray-200 text-gray-300 line-through cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 text-gray-700 active:scale-95 hover:border-blue-300 hover:bg-blue-50'}`}
              >
                <span className={`inline-block w-6 h-6 rounded-full text-xs font-bold text-center leading-6 mr-2 shrink-0
                  ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                  {isDisabled ? '×' : ['ア', 'イ', 'ウ', 'エ'][i]}
                </span>
                <RubyText text={opt} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
