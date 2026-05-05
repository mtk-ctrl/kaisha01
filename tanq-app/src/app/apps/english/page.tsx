'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'

type QuestionFormat = 'en2jp' | 'jp2en'

interface WordEntry {
  emoji: string
  japanese: string
  english: string
  category: string
  tip: string
  sentence: string   // 例文（英語）
  sentenceJP: string // 例文（和訳）
}

const WORDS: WordEntry[] = [
  { emoji: '🍎', japanese: 'リンゴ', english: 'apple', category: 'くだもの', tip: '"アップル"と読む。ニュートンがリンゴを見て重力を発見した話は有名！Apple社のロゴもリンゴ🍏', sentence: 'I eat an apple every day.', sentenceJP: '私は毎日リンゴを食べます。' },
  { emoji: '🐕', japanese: 'イヌ', english: 'dog', category: 'どうぶつ', tip: '"ドッグ"と読む。「It\'s raining cats and dogs（土砂降り）」という慣用句があるよ！', sentence: 'My dog loves to run in the park.', sentenceJP: '私のイヌは公園を走るのが大好きです。' },
  { emoji: '🐱', japanese: 'ネコ', english: 'cat', category: 'どうぶつ', tip: '"キャット"と読む。英語でネコの鳴き声は「meow（ミャオ）」と書くよ🐾', sentence: 'The cat is sleeping on the sofa.', sentenceJP: 'ネコはソファの上で寝ています。' },
  { emoji: '📚', japanese: 'ほん', english: 'book', category: 'もの', tip: '"ブック"と読む。1冊・2冊は one book / two books。複数形は -s をつけよう📖', sentence: 'She reads a book before bed.', sentenceJP: '彼女は寝る前に本を読みます。' },
  { emoji: '✏️', japanese: 'えんぴつ', english: 'pencil', category: 'もの', tip: '"ペンスル"と読む。pen（ペン）との違いは消せること。stationery（文房具）の仲間！', sentence: 'Please write with a pencil.', sentenceJP: 'えんぴつで書いてください。' },
  { emoji: '🌸', japanese: 'はな', english: 'flower', category: 'しぜん', tip: '"フラワー"と読む。日本の桜は英語で「cherry blossom（チェリーブロッサム）」と言うよ🌸', sentence: 'The flowers in the garden are beautiful.', sentenceJP: '庭の花は美しいです。' },
  { emoji: '🌙', japanese: 'つき', english: 'moon', category: 'そら', tip: '"ムーン"と読む。月曜日は Monday — Moon\'s day（月の日）が語源！', sentence: 'The moon is bright tonight.', sentenceJP: '今夜は月が明るい。' },
  { emoji: '☀️', japanese: 'たいよう', english: 'sun', category: 'そら', tip: '"サン"と読む。日曜日は Sunday — Sun\'s day（太陽の日）。sunshine = 日光 ☀️', sentence: 'The sun rises in the east.', sentenceJP: '太陽は東から昇ります。' },
  { emoji: '🌊', japanese: 'うみ', english: 'sea', category: 'しぜん', tip: '"スィー"と読む。海の水は saltwater（塩水）。ocean（オーシャン）はより大きな海域だよ🌊', sentence: 'We swim in the sea every summer.', sentenceJP: '私たちは毎年夏に海で泳ぎます。' },
  { emoji: '⛰️', japanese: 'やま', english: 'mountain', category: 'しぜん', tip: '"マウンテン"と読む。富士山は Mount Fuji！mountain climbing = 登山🏔️', sentence: 'Mount Fuji is a famous mountain.', sentenceJP: '富士山は有名な山です。' },
  { emoji: '🍙', japanese: 'おにぎり', english: 'rice ball', category: 'たべもの', tip: '"ライスボール"と読む。最近では onigiri がそのまま英語になってきてるよ🍙', sentence: 'I made a rice ball for lunch.', sentenceJP: '昼食におにぎりを作りました。' },
  { emoji: '🚗', japanese: 'くるま', english: 'car', category: 'のりもの', tip: '"カー"と読む。automobile（オートモービル）とも言う。ドライブは go for a drive！', sentence: 'We went to the park by car.', sentenceJP: '私たちは車で公園に行きました。' },
  { emoji: '✈️', japanese: 'ひこうき', english: 'airplane', category: 'のりもの', tip: '"エアプレイン"と読む。aeroplane（英）= airplane（米）。空港は airport🛫', sentence: 'The airplane flew over the clouds.', sentenceJP: 'ひこうきは雲の上を飛んだ。' },
  { emoji: '🏠', japanese: 'いえ', english: 'house', category: 'たてもの', tip: '"ハウス"と読む。house は建物、home は「家（場所+気持ち）」。Home is where the heart is💙', sentence: 'My house has a big garden.', sentenceJP: '私の家には大きな庭があります。' },
  { emoji: '🎒', japanese: 'ランドセル', english: 'backpack', category: 'もの', tip: '"バックパック"と読む。ランドセルは日本独特！海外では backpack（リュック）と呼ぶよ🎒', sentence: 'I put my books in my backpack.', sentenceJP: '私はリュックに本を入れました。' },
  { emoji: '🍊', japanese: 'みかん', english: 'orange', category: 'くだもの', tip: '"オレンジ"と読む。色のオレンジも同じ単語！The sky turned orange（空がオレンジ色になった）🍊', sentence: 'An orange is sweet and juicy.', sentenceJP: 'みかんは甘くてジューシーです。' },
  { emoji: '🐟', japanese: 'さかな', english: 'fish', category: 'どうぶつ', tip: '"フィッシュ"と読む。fish は単複同形が多い（1 fish, 2 fish）。フィッシュ&チップスは英国の名物！', sentence: 'There are many fish in the river.', sentenceJP: '川にはたくさんの魚がいます。' },
  { emoji: '⭐', japanese: 'ほし', english: 'star', category: 'そら', tip: '"スター"と読む。Twinkle twinkle little star🎵 お気に入りの歌で英語を覚えよう！', sentence: 'I can see many stars at night.', sentenceJP: '夜には星がたくさん見えます。' },
  { emoji: '🌈', japanese: 'にじ', english: 'rainbow', category: 'そら', tip: '"レインボー"と読む。rain（雨）＋bow（弓）＝ rainbow。なぜ虹が見えるか知ってる？光の屈折！', sentence: 'A rainbow appeared after the rain.', sentenceJP: '雨の後ににじが現れました。' },
  { emoji: '🎵', japanese: 'おんがく', english: 'music', category: 'こうい', tip: '"ミュージック"と読む。musician（音楽家）、musical（ミュージカル）など仲間の言葉もたくさん！', sentence: 'I love listening to music.', sentenceJP: '私は音楽を聴くのが大好きです。' },
  { emoji: '🏃', japanese: 'はしる', english: 'run', category: 'こうい', tip: '"ラン"と読む。run は多義語！プログラムを「実行する」もrun（run a program）と言うよ💻', sentence: 'She runs five kilometers every morning.', sentenceJP: '彼女は毎朝5キロ走ります。' },
  { emoji: '😊', japanese: 'うれしい', english: 'happy', category: 'きもち', tip: '"ハッピー"と読む。Happy birthday！Happy New Year！お祝いの定番表現だよ😊', sentence: 'I am very happy today!', sentenceJP: '今日はとてもうれしいです！' },
  { emoji: '😢', japanese: 'かなしい', english: 'sad', category: 'きもち', tip: '"サッド"と読む。I\'m sad.（かなしいな）、Don\'t be sad!（かなしまないで）と使えるよ', sentence: 'He looked sad after losing the game.', sentenceJP: '彼は試合に負けた後かなしそうにしていた。' },
  { emoji: '🔴', japanese: 'あかい', english: 'red', category: 'いろ', tip: '"レッド"と読む。red card（レッドカード）、red carpet（レッドカーペット）日常でよく見るね！', sentence: 'The traffic light is red.', sentenceJP: '信号が赤です。' },
  { emoji: '💙', japanese: 'あおい', english: 'blue', category: 'いろ', tip: '"ブルー"と読む。"I\'m feeling blue"は「気分が落ち込んでいる」という慣用句。色と気持ちは関係あるね', sentence: 'The sky is blue on a sunny day.', sentenceJP: '晴れた日は空が青いです。' },
  { emoji: '💚', japanese: 'みどり', english: 'green', category: 'いろ', tip: '"グリーン"と読む。"go green"（エコにする）と環境にも使う！Green energy = 再生可能エネルギー', sentence: 'The grass is green in spring.', sentenceJP: '春には草が緑色です。' },
  { emoji: '🎂', japanese: 'ケーキ', english: 'cake', category: 'たべもの', tip: '"ケイク"と読む。piece of cake は「超かんたん」の意味もあるよ😄 It\'s a piece of cake!', sentence: 'We ate cake at the birthday party.', sentenceJP: '誕生日パーティーでケーキを食べました。' },
  { emoji: '🍕', japanese: 'ピザ', english: 'pizza', category: 'たべもの', tip: '"ピーツァ"と読む。イタリア語から来た言葉！英語では pizza parlor（ピザ屋）と言うよ🍕', sentence: 'Pizza is popular all over the world.', sentenceJP: 'ピザは世界中で人気があります。' },
  { emoji: '👾', japanese: 'ゲーム', english: 'game', category: 'あそび', tip: '"ゲイム"と読む。video game、board game、card game — 色々なゲームがあるね。Let\'s play a game!🎮', sentence: 'Let\'s play a game together.', sentenceJP: '一緒にゲームをしましょう。' },
  { emoji: '🏊', japanese: 'およぐ', english: 'swim', category: 'こうい', tip: '"スウィム"と読む。swimmer（水泳選手）、swimming pool（プール）。「泳げる」は I can swim!🏊', sentence: 'I can swim very fast.', sentenceJP: '私はとても速く泳げます。' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(fmt: QuestionFormat, correct: WordEntry, pool: WordEntry[]): string[] {
  if (fmt === 'jp2en') {
    const others = shuffle(pool.filter(w => w.english !== correct.english)).slice(0, 3).map(w => w.english)
    return shuffle([correct.english, ...others])
  }
  const others = shuffle(pool.filter(w => w.japanese !== correct.japanese)).slice(0, 3).map(w => w.japanese)
  return shuffle([correct.japanese, ...others])
}

// ── SRS ──
const SRS_KEY = 'tanq_english_srs_v1'
const STREAK_KEY = 'tanq_english_streak_v1'
const SESSION_SIZE = 10

interface ItemState { b: 0 | 1 | 2; c: number; s: number; ok: number; t: number }
type SRSStore = Record<string, ItemState>

function loadSRS(): SRSStore {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || '{}') } catch { return {} }
}
function saveSRS(store: SRSStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SRS_KEY, JSON.stringify(store))
}
function getStreakCount(): number {
  if (typeof window === 'undefined') return 0
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"n":0}').n } catch { return 0 }
}
function recordStudy(): number {
  if (typeof window === 'undefined') return 0
  const today = new Date().toISOString().slice(0, 10)
  try {
    const d = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"n":0,"d":""}')
    if (d.d === today) return d.n
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const n = d.d === y ? d.n + 1 : 1
    localStorage.setItem(STREAK_KEY, JSON.stringify({ n, d: today }))
    return n
  } catch { return 1 }
}

function globalStats(store: SRSStore) {
  let mastered = 0, learning = 0, newCount = 0
  for (const w of WORDS) {
    const s = store[w.english]
    if (!s || s.b === 0) newCount++
    else if (s.b === 1) learning++
    else mastered++
  }
  return { mastered, learning, newCount, total: WORDS.length }
}

function buildSession(store: SRSStore, mode: 'normal' | 'weak'): WordEntry[] {
  if (mode === 'weak') {
    const weak = WORDS.filter(w => !store[w.english] || store[w.english].b < 2)
    return shuffle(weak.length >= 3 ? weak : WORDS).slice(0, SESSION_SIZE)
  }
  const now = Date.now()
  const overdue = WORDS.filter(w => store[w.english]?.b === 2 && now - store[w.english].t > 7 * 86400000)
  const learning = WORDS.filter(w => store[w.english]?.b === 1)
  const newItems = WORDS.filter(w => !store[w.english] || store[w.english].b === 0)
  return shuffle([
    ...shuffle(overdue).slice(0, 2),
    ...shuffle(learning).slice(0, 6),
    ...shuffle(newItems),
  ]).slice(0, SESSION_SIZE)
}

function applySRS(store: SRSStore, key: string, correct: boolean, ms: number): {
  store: SRSStore; change: 'mastered' | 'advance' | 'same' | 'regress'
} {
  const old = store[key] || { b: 0, c: 0, s: 0, ok: 0, t: 0 }
  const fast = ms < 2500
  let b = old.b as number, c = old.c
  if (correct && fast) {
    c = old.c + 1
    if (b === 0) b = 1
    else if (b === 1 && c >= 3) b = 2
  } else if (correct && !fast) {
    c = Math.min(old.c + 1, 2)
    if (b === 2) b = 1
  } else {
    c = 0
    if (b === 2) b = 1
  }
  const entry: ItemState = { b: b as 0 | 1 | 2, c, s: old.s + 1, ok: old.ok + (correct ? 1 : 0), t: Date.now() }
  const newStore = { ...store, [key]: entry }
  let change: 'mastered' | 'advance' | 'same' | 'regress' = 'same'
  if (b > old.b) change = b === 2 ? 'mastered' : 'advance'
  else if (b < old.b) change = 'regress'
  return { store: newStore, change }
}

interface Question { fmt: QuestionFormat; word: WordEntry; correct: string; choices: string[] }

function makeQuestion(word: WordEntry): Question {
  const fmt: QuestionFormat = Math.random() < 0.5 ? 'jp2en' : 'en2jp'
  return { fmt, word, correct: fmt === 'jp2en' ? word.english : word.japanese, choices: makeChoices(fmt, word, WORDS) }
}

type Phase = 'home' | 'playing' | 'result'

export default function EnglishQuiz() {
  const [phase, setPhase] = useState<Phase>('home')
  const [mode, setMode] = useState<'normal' | 'weak'>('normal')
  const [store, setStore] = useState<SRSStore>({})
  const [streak, setStreak] = useState(0)

  const [questions, setQuestions] = useState<Question[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [lastMs, setLastMs] = useState(0)
  const [lastChange, setLastChange] = useState<'mastered' | 'advance' | 'same' | 'regress'>('same')
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionMastered, setSessionMastered] = useState(0)
  const [sessionWeak, setSessionWeak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)
  const qStartRef = useRef<number>(Date.now())

  useEffect(() => {
    setStore(loadSRS())
    setStreak(getStreakCount())
  }, [])

  useEffect(() => {
    if (phase === 'playing') qStartRef.current = Date.now()
  }, [qIdx, phase])

  const startGame = useCallback((m: 'normal' | 'weak' = mode) => {
    const currentStore = loadSRS()
    setStore(currentStore)
    const items = buildSession(currentStore, m)
    setQuestions(items.map(makeQuestion))
    setQIdx(0)
    setSelected(null)
    setSessionCorrect(0)
    setSessionMastered(0)
    setSessionWeak(0)
    qStartRef.current = Date.now()
    setMode(m)
    setPhase('playing')
  }, [mode])

  function choose(c: string) {
    if (selected !== null) return
    const ms = Date.now() - qStartRef.current
    setLastMs(ms)
    setSelected(c)
    const q = questions[qIdx]
    const correct = c === q.correct
    if (correct) setSessionCorrect(n => n + 1)
    else setSessionWeak(n => n + 1)
    const { store: newStore, change } = applySRS(store, q.word.english, correct, ms)
    setStore(newStore)
    saveSRS(newStore)
    setLastChange(change)
    if (change === 'mastered') setSessionMastered(n => n + 1)
  }

  function goNext() {
    if (qIdx + 1 >= questions.length) {
      const ns = recordStudy()
      setFinalStreak(ns)
      setStreak(ns)
      setPhase('result')
      return
    }
    setQIdx(i => i + 1)
    setSelected(null)
  }

  const stats = globalStats(store)
  const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0

  // ── HOME ──
  if (phase === 'home') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center px-6 py-16 pt-20">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f87171] text-sm transition-colors">← ラボに戻る</Link>

        {streak > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#f0c040]/15 border border-[#f0c040]/30 px-3 py-1.5 rounded-full">
            <span>🔥</span>
            <span className="font-black text-[#f0c040] text-sm">{streak}日連続</span>
          </div>
        )}

        <div className="text-5xl mb-2 mt-4">🌍</div>
        <h1 className="text-3xl font-black mb-1 text-[#f87171]">英語クイズ</h1>
        <p className="text-[#94a3c4] text-xs mb-8 text-center">英語→日本語 ＆ 日本語→英語の2方向で練習。間隔反復で効率的に覚えよう！</p>

        {/* Overall progress */}
        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-5 border border-white/10">
          <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
            <span>全{stats.total}単語の習得状況</span>
            <span className="text-[#f87171]">{masteredPct}% 習得済み</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700 bg-[#f87171]" style={{ width: `${masteredPct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-black text-xl text-[#f87171]">{stats.mastered}</div>
              <div className="text-[#94a3c4] text-[10px]">⭐ 習得済み</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#60a5fa]">{stats.learning}</div>
              <div className="text-[#94a3c4] text-[10px]">📚 学習中</div>
            </div>
            <div>
              <div className="font-black text-xl text-[#e8f0fe]">{stats.newCount}</div>
              <div className="text-[#94a3c4] text-[10px]">🆕 未学習</div>
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="flex w-full max-w-sm gap-3 mb-5">
          {(['normal', 'weak'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === m ? 'text-[#050b14] bg-[#f87171]' : 'text-[#94a3c4] bg-white/5 border border-white/10 hover:border-white/20'}`}>
              {m === 'normal' ? '📚 通常モード' : '💪 苦手集中'}
            </button>
          ))}
        </div>

        <button onClick={() => startGame(mode)}
          className="w-full max-w-sm py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: '#f87171', boxShadow: '0 0 30px rgba(248,113,113,0.4)' }}>
          Let&apos;s go！（{SESSION_SIZE}問）
        </button>
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result') {
    const total = questions.length
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const rank = acc >= 90 ? '🏆 Perfect!' : acc >= 70 ? '🥇 Excellent!' : acc >= 50 ? '🥈 Good job!' : '🥉 Try again!'
    const newStats = globalStats(store)
    const newPct = newStats.total > 0 ? Math.round((newStats.mastered / newStats.total) * 100) : 0
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="text-5xl mb-2">{rank.split(' ')[0]}</div>
        <h2 className="text-2xl font-black mb-3 text-[#f87171]">{rank.split(' ').slice(1).join(' ')}</h2>

        {finalStreak > 0 && (
          <div className="flex items-center gap-2 bg-[#f0c040]/15 border border-[#f0c040]/30 px-4 py-2 rounded-full mb-4">
            <span>🔥</span>
            <span className="font-black text-[#f0c040]">{finalStreak}日連続達成！</span>
          </div>
        )}

        <div className="text-7xl font-black text-[#f87171] mb-1">{acc}%</div>
        <p className="text-[#94a3c4] text-sm mb-6">{total}問中 {sessionCorrect}問正解</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-5">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#f87171] mb-1">⭐ {sessionMastered}</div>
            <div className="text-[#94a3c4] text-xs">新規習得</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#4ade80] mb-1">{sessionCorrect}</div>
            <div className="text-[#94a3c4] text-xs">正解数</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-center">
            <div className="text-2xl font-black text-[#f87171] mb-1">{sessionWeak}</div>
            <div className="text-[#94a3c4] text-xs">要復習</div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex justify-between text-xs text-[#94a3c4] mb-2">
            <span>全単語の累計習得状況</span>
            <span className="text-[#f87171]">{newPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#f87171]" style={{ width: `${newPct}%` }} />
          </div>
          <p className="text-xs text-[#94a3c4] mt-2">習得済み {newStats.mastered}/{newStats.total}単語</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={() => startGame(mode)}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f87171] transition-all hover:scale-[1.02]">もう一回！</button>
          {sessionWeak > 0 && (
            <button onClick={() => startGame('weak')}
              className="w-full py-4 rounded-2xl font-bold text-base border border-[#f87171]/50 text-[#f87171] hover:bg-[#f87171]/10 transition-all">
              💪 苦手 {sessionWeak}問を集中練習
            </button>
          )}
          <button onClick={() => setPhase('home')}
            className="w-full py-4 rounded-2xl font-bold text-base border border-white/20 text-[#94a3c4] hover:text-white transition-all">
            ホームに戻る
          </button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-base border border-white/10 text-[#94a3c4] hover:text-[#f87171] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  // ── PLAYING ──
  const q = questions[qIdx]
  if (!q) return null
  const isCorrect = selected === q.correct
  const isFast = lastMs > 0 && lastMs < 1500
  const isSlow = lastMs > 2500
  const changeColor = lastChange === 'mastered' ? '#f0c040' : lastChange === 'advance' ? '#4ade80' : lastChange === 'regress' ? '#f87171' : '#8892b0'
  const changeMsg = lastChange === 'mastered' ? '⭐ 習得！' : lastChange === 'advance' ? '📈 いい調子！' : lastChange === 'regress' ? '📉 要復習' : null

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm z-10">
        <button onClick={() => setPhase('home')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{qIdx + 1} / {questions.length}</span>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-[#4ade80]">○ {sessionCorrect}</span>
          <span className="text-[#f87171]">✗ {sessionWeak}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10 z-10">
        <div className="h-full transition-all duration-500 bg-[#f87171]" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
      </div>

      <div className="w-full max-w-sm text-center">
        {/* Format badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/40">
          {q.fmt === 'jp2en' ? '日本語 → English' : 'English → 日本語'}
        </div>

        {/* Question */}
        {q.fmt === 'jp2en' ? (
          <>
            <div className="text-[7rem] leading-none mb-2 select-none">{q.word.emoji}</div>
            <p className="text-2xl font-black mb-1">{q.word.japanese}</p>
            <p className="text-[#94a3c4] text-xs mb-2">{q.word.category}</p>
            <p className="text-[#94a3c4] text-xs mb-5 italic">"{q.word.sentence}"</p>
          </>
        ) : (
          <>
            <div className="text-[7rem] leading-none mb-2 select-none">{q.word.emoji}</div>
            <p className="text-3xl font-black text-[#f87171] mb-1">{q.word.english}</p>
            <p className="text-[#94a3c4] text-xs mb-2">{q.word.category}</p>
            <p className="text-[#94a3c4] text-xs mb-5 italic">"{q.word.sentence}"</p>
          </>
        )}

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {q.choices.map((c) => {
            const isCor = c === q.correct
            const isSel = c === selected
            let bg = 'rgba(255,255,255,0.07)'
            let border = 'rgba(255,255,255,0.15)'
            let text = '#e8f0fe'
            if (selected !== null) {
              if (isCor) { bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; text = '#4ade80' }
              else if (isSel) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; text = '#f87171' }
            }
            return (
              <button key={c} onClick={() => choose(c)} disabled={selected !== null}
                className="py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}>
                {c}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold" style={{ color: isFast && isCorrect ? '#f0c040' : 'transparent' }}>
                {isCorrect && isFast ? '⚡ 速い！' : isCorrect && isSlow ? '🤔 ゆっくり' : ''}
              </span>
              {changeMsg && (
                <span className="text-sm font-bold" style={{ color: changeColor }}>{changeMsg}</span>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4 text-left border"
              style={{
                background: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.1)',
                borderColor: isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)',
              }}>
              <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                {isCorrect
                  ? `✓ 正解！「${q.word.japanese}」 = "${q.word.english}"`
                  : `✗ 正解は「${q.correct}」`}
              </p>
              <p className="text-[#e8f0fe] text-sm leading-relaxed mb-2">{q.word.tip}</p>
              <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <p className="text-[#94a3c4] text-xs italic">"{q.word.sentence}"</p>
                <p className="text-[#e8f0fe] text-xs mt-0.5">{q.word.sentenceJP}</p>
              </div>
            </div>

            <button onClick={goNext}
              className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
              style={{ background: '#f87171', boxShadow: '0 0 25px rgba(248,113,113,0.35)' }}>
              {qIdx + 1 < questions.length ? '次の問題 →' : '結果を見る！'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
