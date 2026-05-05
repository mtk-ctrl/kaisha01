'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const LAB_PASSWORD = process.env.NEXT_PUBLIC_LAB_PASSWORD || 'tanq2026'
const SESSION_KEY = 'tanq-lab-auth'

const APPS = [
  {
    id: 'tanq',
    name: 'TANQ App',
    subtitle: '理科探究ゲーム',
    description:
      'TANQuu と一緒に科学の「ウソみたいなホント」を発見する探究学習ゲーム。Unit 1〜5（密度・溶解・光散乱・光合成・磁力）実装済み。',
    emoji: '🔬',
    color: '#00e5c3',
    url: '/tanq',
    external: false,
    badge: 'Season 1 完了',
    badgeColor: '#00e5c3',
    units: ['密度・浮力', '溶解', '光散乱', '光合成', '磁力'],
    mascot: '/tanquu/happy.png',
  },
  {
    id: 'youti',
    name: '幼稚マスター',
    subtitle: '幼児向け学習アプリ',
    description:
      '幼児〜低学年向けの楽しい学習アプリ。遊びながら基礎的な概念を身につける。',
    emoji: '🌟',
    color: '#f0c040',
    url: 'https://ukun-cre.github.io/youti_master_v1/',
    external: true,
    badge: 'Live',
    badgeColor: '#4ade80',
    units: [],
    mascot: null,
  },
  {
    id: 'math',
    name: '計算チャレンジ',
    subtitle: '計算スピードゲーム',
    description:
      '制限時間内にできるだけ多くの計算問題を解こう！たし算・ひき算・かけ算・わり算に挑戦。',
    emoji: '🔢',
    color: '#60a5fa',
    url: '/apps/math',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['たし算', 'ひき算', 'かけ算', 'わり算'],
    mascot: null,
  },
  {
    id: 'kanji',
    name: '漢字クイズ',
    subtitle: '漢字読み方4択クイズ',
    description:
      '小学校で習う漢字の読み方を4択で答えよう。学年別（小1〜小6）。毎回ランダム出題！',
    emoji: '📖',
    color: '#c4a8ff',
    url: '/apps/kanji',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['小1', '小2', '小3', '小4', '小5', '小6'],
    mascot: null,
  },
  {
    id: 'clock',
    name: '時計チャレンジ',
    subtitle: 'アナログ時計クイズ',
    description:
      'アナログ時計の針を見て時刻を読もう！何時何分かを4択で答えるクイズ。全10問！',
    emoji: '🕐',
    color: '#f0c040',
    url: '/apps/clock',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['時刻よみ'],
    mascot: null,
  },
  {
    id: 'english',
    name: '英語クイズ',
    subtitle: '英単語4択クイズ',
    description:
      '絵（emoji）を見て英語を選ぼう！TANQuu と一緒に英単語を覚えよう。全30語からランダム出題。',
    emoji: '🌍',
    color: '#f87171',
    url: '/apps/english',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['動物', '食べ物', '乗り物', '自然', '色'],
    mascot: null,
  },
  {
    id: 'shapes',
    name: '図形クイズ',
    subtitle: '形・角・辺クイズ',
    description:
      '三角形から星形まで！図形の名前・角の数・辺の数を答えよう。全10問ランダム出題。',
    emoji: '🔷',
    color: '#c4a8ff',
    url: '/apps/shapes',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['三角形', '四角形', '五角形', '六角形', '円'],
    mascot: null,
  },
  {
    id: 'coding',
    name: 'プログラミング思考',
    subtitle: 'コマンド順番並べゲーム',
    description:
      'コマンドを正しい順番に並べてTANQuu をゴールまで導こう！論理的思考力を育てる全5ステージ。',
    emoji: '💻',
    color: '#4ade80',
    url: '/apps/coding',
    external: false,
    badge: 'New',
    badgeColor: '#f87171',
    units: ['順次処理', '条件分岐基礎'],
    mascot: null,
  },
]

/* ── Password gate ── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input,  setInput]  = useState('')
  const [error,  setError]  = useState(false)
  const [shake,  setShake]  = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === LAB_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Lock icon + TANQuu */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-corp-teal opacity-20 blur-3xl rounded-full scale-150" />
            <Image
              src="/tanquu/surprised.png"
              alt="TANQuu"
              width={120}
              height={120}
              className="relative z-10 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]"
            />
          </div>
          <p className="text-corp-teal text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            TANQ Lab
          </p>
          <h1 className="text-4xl font-black mb-3">
            <span className="text-gradient">アプリラボ</span>
          </h1>
          <p className="text-corp-muted text-sm leading-relaxed">
            パスワードを入力してアクセスしてください
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`glass-card-bright rounded-2xl p-8 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
          <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-3">
            パスワード
          </label>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="••••••••"
            className={`corp-input mb-2 ${error ? 'border-red-500/60' : ''}`}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-xs mb-4">パスワードが違います</p>
          )}
          {!error && <div className="mb-4" />}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full btn-glow-teal font-bold text-base"
          >
            入る →
          </button>
        </form>

        <p className="text-center text-corp-muted text-xs mt-6">
          <Link href="/" className="hover:text-corp-teal transition-colors">← ホームに戻る</Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}

/* ── App card ── */
function AppCard({ app }: { app: typeof APPS[0] }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300">
      {/* Header band */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${app.color}, transparent)` }}
      />

      <div className="p-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${app.color}18`, border: `1px solid ${app.color}30` }}
            >
              {app.mascot ? (
                <Image src={app.mascot} alt={app.name} width={40} height={40} className="drop-shadow-md" />
              ) : (
                <span>{app.emoji}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-corp-text">{app.name}</h2>
              <p className="text-corp-muted text-sm">{app.subtitle}</p>
            </div>
          </div>
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0"
            style={{ background: `${app.badgeColor}20`, color: app.badgeColor, border: `1px solid ${app.badgeColor}40` }}
          >
            {app.badge}
          </span>
        </div>

        {/* Description */}
        <p className="text-corp-muted text-sm leading-relaxed mb-6">
          {app.description}
        </p>

        {/* Units list */}
        {app.units.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {app.units.map((u) => (
              <span
                key={u}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: `${app.color}15`, color: app.color }}
              >
                {u}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        {app.external ? (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-lg transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: app.color,
              color: '#050b14',
              boxShadow: `0 0 0 0 ${app.color}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 35px ${app.color}60`
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            アプリを開く
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ) : (
          <Link
            href={app.url}
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-lg transition-all duration-200 hover:scale-[1.03]"
            style={{ background: app.color, color: '#050b14' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 35px ${app.color}60`
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            アプリを開く →
          </Link>
        )}
      </div>
    </div>
  )
}

/* ── Hub ── */
function AppHub() {
  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[20%] w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      <main className="relative z-10 px-6 py-32">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] font-semibold mb-4">
              TANQ Lab — 内部アクセス
            </p>
            <h1 className="text-5xl lg:text-6xl font-black mb-5">
              <span className="text-gradient">アプリラボ</span>
            </h1>
            <p className="text-corp-muted text-lg max-w-lg mx-auto leading-relaxed">
              理科探究・計算・漢字・英語・時計・図形・プログラミング…
              <br className="hidden sm:block" />
              全{APPS.length}アプリが使い放題！
            </p>
          </div>

          {/* App grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {APPS.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          {/* Footer note */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-corp-muted text-sm">
              このページはパスワード制の内部ラボです。
              新しいアプリは順次追加予定。
              <Link href="/" className="text-corp-teal hover:underline ml-1">← ホームへ</Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

/* ── Entry point ── */
export default function LabPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true)
    }
    setChecking(false)
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-corp-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-corp-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return unlocked ? <AppHub /> : <PasswordGate onUnlock={() => setUnlocked(true)} />
}
