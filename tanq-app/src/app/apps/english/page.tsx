'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'

interface WordEntry {
  emoji: string
  japanese: string
  english: string
  category: string
  tip: string
}

const WORDS: WordEntry[] = [
  { emoji: '🍎', japanese: 'リンゴ', english: 'apple', category: 'くだもの', tip: '"アップル"と読む。ニュートンがリンゴを見て重力を発見した話は有名！Apple社のロゴもリンゴだよ🍏' },
  { emoji: '🐕', japanese: 'イヌ', english: 'dog', category: 'どうぶつ', tip: '"ドッグ"と読む。「It\'s raining cats and dogs（土砂降り）」という慣用句があるよ！' },
  { emoji: '🐱', japanese: 'ネコ', english: 'cat', category: 'どうぶつ', tip: '"キャット"と読む。英語でネコの鳴き声は「meow（ミャオ）」と書くよ🐾' },
  { emoji: '📚', japanese: 'ほん', english: 'book', category: 'もの', tip: '"ブック"と読む。1冊・2冊は one book / two books。複数形は -s をつけよう📖' },
  { emoji: '✏️', japanese: 'えんぴつ', english: 'pencil', category: 'もの', tip: '"ペンスル"と読む。pen（ペン）との違いは消せること。stationery（文房具）の仲間！' },
  { emoji: '🌸', japanese: 'はな', english: 'flower', category: 'しぜん', tip: '"フラワー"と読む。日本の桜は英語で「cherry blossom（チェリーブロッサム）」と言うよ🌸' },
  { emoji: '🌙', japanese: 'つき', english: 'moon', category: 'そら', tip: '"ムーン"と読む。月曜日は Monday — Moon\'s day（月の日）が語源。宇宙飛行士は astronaut！' },
  { emoji: '☀️', japanese: 'たいよう', english: 'sun', category: 'そら', tip: '"サン"と読む。日曜日は Sunday — Sun\'s day（太陽の日）。sunshine = 日光 ☀️' },
  { emoji: '🌊', japanese: 'うみ', english: 'sea', category: 'しぜん', tip: '"スィー"と読む。海の水は saltwater（塩水）。ocean（オーシャン）はより大きな海域だよ🌊' },
  { emoji: '⛰️', japanese: 'やま', english: 'mountain', category: 'しぜん', tip: '"マウンテン"と読む。富士山は Mount Fuji！山に登ることは mountain climbing（登山）🏔️' },
  { emoji: '🍙', japanese: 'おにぎり', english: 'rice ball', category: 'たべもの', tip: '"ライス ボール"と読む。最近では onigiri がそのまま英語になってきてるよ🍙 日本食は世界へ！' },
  { emoji: '🚗', japanese: 'くるま', english: 'car', category: 'のりもの', tip: '"カー"と読む。automobile（オートモービル）とも言う。ドライブは go for a drive！' },
  { emoji: '✈️', japanese: 'ひこうき', english: 'airplane', category: 'のりもの', tip: '"エアプレイン"と読む。airlane（英）= airplane（米）。空港は airport（エアポート）🛫' },
  { emoji: '🏠', japanese: 'いえ', english: 'house', category: 'たてもの', tip: '"ハウス"と読む。house は建物、home は「家（場所+気持ち）」。Home is where the heart is💙' },
  { emoji: '🎒', japanese: 'ランドセル', english: 'backpack', category: 'もの', tip: '"バックパック"と読む。ランドセルは日本独特！海外ではただの backpack（リュック）と呼ぶよ🎒' },
  { emoji: '🍊', japanese: 'みかん', english: 'orange', category: 'くだもの', tip: '"オレンジ"と読む。色のオレンジも同じ単語！The sky turned orange（空がオレンジ色になった）🍊' },
  { emoji: '🐟', japanese: 'さかな', english: 'fish', category: 'どうぶつ', tip: '"フィッシュ"と読む。fish は単複同形が多い（1 fish, 2 fish）。フィッシュ&チップスは英国の名物！' },
  { emoji: '⭐', japanese: 'ほし', english: 'star', category: 'そら', tip: '"スター"と読む。Twinkle twinkle little star🎵 お気に入りの歌で英語を覚えよう！' },
  { emoji: '🌈', japanese: 'にじ', english: 'rainbow', category: 'そら', tip: '"レインボー"と読む。rain（雨）＋bow（弓）＝ rainbow。なぜ虹が7色に見えるか知ってる？光の屈折！' },
  { emoji: '🎵', japanese: 'おんがく', english: 'music', category: 'こうい', tip: '"ミュージック"と読む。musician（音楽家）、musical（ミュージカル）など仲間の言葉もたくさん！' },
  { emoji: '🏃', japanese: 'はしる', english: 'run', category: 'こうい', tip: '"ラン"と読む。run は多義語！プログラムを「実行する」もrun（run a program）と言うよ💻' },
  { emoji: '😊', japanese: 'うれしい', english: 'happy', category: 'きもち', tip: '"ハッピー"と読む。Happy birthday！Happy New Year！お祝いの定番表現だよ😊' },
  { emoji: '😢', japanese: 'かなしい', english: 'sad', category: 'きもち', tip: '"サッド"と読む。I\'m sad.（かなしいな）、Don\'t be sad!（かなしまないで）と使えるよ' },
  { emoji: '🔴', japanese: 'あかい', english: 'red', category: 'いろ', tip: '"レッド"と読む。red card（レッドカード）、red carpet（レッドカーペット）日常でよく見るね！' },
  { emoji: '💙', japanese: 'あおい', english: 'blue', category: 'いろ', tip: '"ブルー"と読む。"I\'m feeling blue"は「気分が落ち込んでいる」という慣用句。色と気持ちは関係あるね' },
  { emoji: '💚', japanese: 'みどり', english: 'green', category: 'いろ', tip: '"グリーン"と読む。"Green energy"（再生可能エネルギー）、"go green"（エコにする）と環境にも使う！' },
  { emoji: '🎂', japanese: 'ケーキ', english: 'cake', category: 'たべもの', tip: '"ケイク"と読む。「ケーキを食べる」は eat cake か have some cake。piece of cake は「超かんたん」の意味もあるよ😄' },
  { emoji: '🍕', japanese: 'ピザ', english: 'pizza', category: 'たべもの', tip: '"ピーツァ"と読む。イタリア語から来た言葉！英語では pizza parlor（ピザ屋）と言うよ🍕' },
  { emoji: '👾', japanese: 'ゲーム', english: 'game', category: 'あそび', tip: '"ゲイム"と読む。video game、board game、card game — 色々なゲームがあるね。Let\'s play a game!🎮' },
  { emoji: '🏊', japanese: 'およぐ', english: 'swim', category: 'こうい', tip: '"スウィム"と読む。swimmer（水泳選手）、swimming pool（プール）。「泳げる」は I can swim!🏊' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeChoices(correct: WordEntry, pool: WordEntry[]): string[] {
  const others = shuffle(pool.filter((w) => w.english !== correct.english)).slice(0, 3)
  return shuffle([correct.english, ...others.map((o) => o.english)])
}

const TOTAL = 10

export default function EnglishQuiz() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [queue, setQueue] = useState<WordEntry[]>([])
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)

  const startGame = useCallback(() => {
    const q = shuffle(WORDS).slice(0, TOTAL)
    setQueue(q)
    setIndex(0)
    setScore(0)
    setMiss(0)
    setSelected(null)
    setChoices(makeChoices(q[0], WORDS))
    setPhase('playing')
  }, [])

  function choose(c: string) {
    if (selected !== null) return
    setSelected(c)
    if (c === queue[index].english) setScore((s) => s + 1)
    else setMiss((m) => m + 1)
  }

  function goNext() {
    if (index + 1 >= TOTAL) { setPhase('result'); return }
    const next = index + 1
    setIndex(next)
    setChoices(makeChoices(queue[next], WORDS))
    setSelected(null)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <Link href="/lab" className="absolute top-6 left-6 text-[#94a3c4] hover:text-[#f87171] text-sm transition-colors">← ラボに戻る</Link>
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-4xl font-black mb-2 text-[#f87171]">英語クイズ</h1>
        <p className="text-[#94a3c4] mb-2 max-w-xs leading-relaxed">
          絵を見て英語を選ぼう！<br />正解したら豆知識もわかるよ👀
        </p>
        <p className="text-[#94a3c4] text-sm mb-6">全{TOTAL}問。解説付き！</p>
        <button onClick={startGame}
          className="px-12 py-5 rounded-2xl font-black text-xl text-[#050b14] transition-all hover:scale-[1.04]"
          style={{ background: '#f87171', boxShadow: '0 0 40px rgba(248,113,113,0.4)' }}>
          Let&apos;s go！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const rank = score >= 9 ? '🏆 Perfect!' : score >= 7 ? '🥇 Excellent!' : score >= 5 ? '🥈 Good job!' : '🥉 Try again!'
    return (
      <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{rank.split(' ')[0]}</div>
        <h2 className="text-3xl font-black mb-1 text-[#f87171]">{rank.split(' ').slice(1).join(' ')}</h2>
        <p className="text-[#94a3c4] mb-8">英語クイズ {TOTAL}問</p>
        <div className="flex gap-10 mb-10">
          <div className="text-center"><div className="text-5xl font-black text-[#4ade80]">{score}</div><div className="text-[#94a3c4] text-sm mt-1">正解</div></div>
          <div className="text-center"><div className="text-5xl font-black text-[#f87171]">{miss}</div><div className="text-[#94a3c4] text-sm mt-1">まちがい</div></div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={startGame} className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] bg-[#f87171] hover:scale-[1.02] transition-all">もう一回！</button>
          <Link href="/lab" className="w-full py-4 rounded-2xl font-bold text-lg border border-white/20 text-[#94a3c4] hover:text-[#f87171] transition-all text-center">ラボに戻る</Link>
        </div>
      </div>
    )
  }

  const current = queue[index]
  if (!current) return null
  const isCorrect = selected === current.english

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex flex-col items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-[#0d2248]/90 backdrop-blur-sm">
        <button onClick={() => setPhase('intro')} className="text-[#94a3c4] hover:text-white text-sm transition-colors">← やめる</button>
        <span className="text-sm text-[#94a3c4]">{index + 1} / {TOTAL}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-[#4ade80]">○ {score}</span>
          <span className="text-[#f87171]">✗ {miss}</span>
        </div>
      </div>
      <div className="fixed top-14 left-0 right-0 h-1.5 bg-white/10">
        <div className="h-full transition-all duration-500 bg-[#f87171]" style={{ width: `${(index / TOTAL) * 100}%` }} />
      </div>

      <div className="w-full max-w-sm text-center">
        <p className="text-[#94a3c4] text-xs mb-3 uppercase tracking-widest">英語でなんていう？</p>
        <div className="text-[8rem] leading-none mb-2">{current.emoji}</div>
        <p className="text-2xl font-black mb-1">{current.japanese}</p>
        <p className="text-[#94a3c4] text-xs mb-5">{current.category}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {choices.map((c) => {
            const isCor = c === current.english
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
                className="py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] disabled:cursor-default"
                style={{ background: bg, border: `2px solid ${border}`, color: text }}>
                {c}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={`rounded-2xl p-4 mb-4 text-left ${isCorrect ? 'bg-[#4ade80]/10 border border-[#4ade80]/40' : 'bg-[#f87171]/10 border border-[#f87171]/40'}`}>
            <p className="font-black text-sm mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
              {isCorrect ? `✓ 正解！「${current.english}」` : `✗ 正解は「${current.english}」だよ`}
            </p>
            <p className="text-[#e8f0fe] text-sm leading-relaxed">{current.tip}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={goNext}
            className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: '#f87171', boxShadow: '0 0 25px rgba(248,113,113,0.35)' }}>
            {index + 1 < TOTAL ? '次の問題 →' : '結果を見る！'}
          </button>
        )}
      </div>
    </div>
  )
}
