'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TOTALS, computeStats } from '@/lib/stats'
import { useStats } from '@/hooks/useStats'
import { createClient } from '@/lib/supabase/client'

const LAB_PASSWORD = process.env.NEXT_PUBLIC_LAB_PASSWORD || 'tanq2026'
const SESSION_KEY = 'tanq-lab-auth'
const GUEST_VALUE = 'guest'
const TESTER_VALUE = 'tester'
const MEMBER_VALUE = 'member'
const PROFILE_KEY = 'tanq_profile_v1'

type UserType = 'guest' | 'tester' | 'member'

function canAccessApp(appId: string, userType: UserType): boolean {
  if (userType === 'tester') return true
  if (userType === 'member') return true
  // ゲスト: APPS の guestAccess フラグで一元管理
  return APPS.find(a => a.id === appId)?.guestAccess ?? false
}

function lockLabel(appId: string, userType: UserType): string | null {
  if (canAccessApp(appId, userType)) return null
  return '登録して解放'
}

interface Profile { name: string; grade: string; color: string }
const DEFAULT_PROFILE: Profile = { name: 'たんきゅう', grade: '小4', color: '#c4a8ff' }
const AVATAR_COLORS = ['#c4a8ff', '#00e5c3', '#f0c040', '#f87171', '#60a5fa']
const GRADES = ['幼稚園', '小1', '小2', '小3', '小4', '小5', '小6', '中1', '中2', '中3']

function loadProfile(userType: UserType = 'member'): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    if (userType === 'tester') {
      const name = localStorage.getItem('tanq-tester-name') || 'テスター'
      return { ...DEFAULT_PROFILE, name }
    }
    if (userType === 'guest') {
      return { ...DEFAULT_PROFILE, name: 'ゲスト' }
    }
    // member
    const stored = localStorage.getItem(PROFILE_KEY)
    const saved = stored ? JSON.parse(stored) : {}
    return { ...DEFAULT_PROFILE, ...saved }
  } catch { return DEFAULT_PROFILE }
}
function saveProfile(p: Profile) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
}


type AppAudience = 'shougakusei' | 'youji' | 'chuugakujuken'

// targetAge: カードに表示する対象年齢チップ
// guestAccess: true = ゲストユーザーがアクセス可能（ここを見れば全アクセス制御が分かる）
const APPS: {
  id: string; name: string; emoji: string; color: string; url: string;
  badge: string; audience: AppAudience; targetAge: string; guestAccess: boolean
}[] = [
  // ── 📘 小学生向け（内製アプリ・学年別カリキュラム）──────────
  { id: 'tanq',         name: 'TANQ理科',        emoji: '🔬', color: '#00e5c3', url: '/tanq',          badge: 'ふしぎ探検',         audience: 'shougakusei',   targetAge: '小4〜小6', guestAccess: false },
  { id: 'juku',         name: '中学受験 算数①',  emoji: '🏆', color: '#FFC83D', url: '/apps/juku',     badge: '12単元｜図で考える', audience: 'chuugakujuken', targetAge: '小4〜中3', guestAccess: true  },
  { id: 'science',      name: '理科クイズ',       emoji: '⚗️', color: '#22c55e', url: '/apps/science',  badge: `${TOTALS.SCIENCE}問・4領域`, audience: 'shougakusei',   targetAge: '小4〜小6', guestAccess: false },
  { id: 'kanyo',        name: '慣用句クイズ',     emoji: '🗣️', color: '#f97316', url: '/apps/kanyo',    badge: `140問・20レベル`,   audience: 'chuugakujuken', targetAge: '小3〜小6', guestAccess: false },
  { id: 'yoji',         name: '四字熟語クイズ',   emoji: '📝', color: '#6366f1', url: '/apps/yoji',     badge: `140問・20レベル`,   audience: 'chuugakujuken', targetAge: '小4〜中3', guestAccess: false },
  { id: 'math',         name: '計算チャレンジ',   emoji: '🔢', color: '#60a5fa', url: '/apps/math',     badge: 'タイムアタック',     audience: 'shougakusei',   targetAge: '小2〜小6', guestAccess: true  },
  { id: 'kanji',        name: '漢字マスター',      emoji: '📖', color: '#c4a8ff', url: '/apps/kanji',    badge: `${TOTALS.KANJI}字`,  audience: 'shougakusei',   targetAge: '小1〜小6', guestAccess: true  },
  { id: 'clock',        name: '時計・時間計算',    emoji: '🕐', color: '#f0c040', url: '/apps/clock',    badge: '分・時間計算',       audience: 'shougakusei',   targetAge: '小2〜小4', guestAccess: false },
  { id: 'english',      name: '英語ボキャブラリー', emoji: '🌍', color: '#f87171', url: '/apps/english',  badge: `${TOTALS.ENGLISH}語`, audience: 'shougakusei',   targetAge: '小3〜小6', guestAccess: false },
  { id: 'thinking',     name: 'かんがえる力ジム',   emoji: '🧩', color: '#6366f1', url: '/apps/thinking', badge: '100問 / 25バッジ',  audience: 'shougakusei',   targetAge: '小4〜小6', guestAccess: true  },
  { id: 'word-math',    name: '算数文章題',        emoji: '📐', color: '#f0a050', url: '/apps/word-math', badge: '文章から立式',      audience: 'shougakusei',   targetAge: '小1〜小3', guestAccess: true  },
  { id: 'shapes',       name: '図形トレーニング',  emoji: '🔷', color: '#a78bfa', url: '/apps/shapes',   badge: '8図形',              audience: 'shougakusei',   targetAge: '小3〜小5', guestAccess: false },
  { id: 'coding',       name: 'プログラミング',    emoji: '💻', color: '#4ade80', url: '/apps/coding',   badge: '5チャプター',         audience: 'shougakusei',   targetAge: '小3〜小6', guestAccess: false },
  { id: 'youji-zokusei', name: 'ぞくせい仕分け工場', emoji: '🏭', color: '#94a3b4', url: '/apps/youji-zokusei', badge: 'ベン図・分類',   audience: 'shougakusei',   targetAge: '小1〜小3', guestAccess: true  },
  { id: 'kuku',          name: '九九マスター',      emoji: '✖️', color: '#f59e0b', url: '/apps/kuku',         badge: '2〜9の段',          audience: 'shougakusei',   targetAge: '小2〜小4', guestAccess: true  },
  { id: 'todofuken',     name: '都道府県マスター',  emoji: '🗾', color: '#0ea5e9', url: '/apps/todofuken', badge: '47都道府県',        audience: 'shougakusei',   targetAge: '小4〜小6', guestAccess: true  },
  // ── 🌱 就学前向け（ひらがな・絵・音声で遊びながら学ぶ）──────
  { id: 'youji-katakana',  name: 'カタカナ れんしゅう',       emoji: '🔡', color: '#d946ef', url: '/apps/youji-katakana', badge: 'ア〜ン 46字',      audience: 'youji', targetAge: '5〜6才', guestAccess: true },
  { id: 'youji-iro',       name: 'いろと かたち',              emoji: '🌈', color: '#ec4899', url: '/apps/youji-iro',       badge: '10色・8かたち',    audience: 'youji', targetAge: '3〜5才', guestAccess: true },
  { id: 'youji-kanji',     name: 'はじめての かんじ',          emoji: '📚', color: '#f87171', url: '/apps/youji-kanji',     badge: 'にちじょうご80字', audience: 'youji', targetAge: '4〜6才', guestAccess: true },
  { id: 'youji-math',      name: 'たべものと かずあそび',       emoji: '🍎', color: '#f0a050', url: '/apps/youji-math',      badge: '20まで',           audience: 'youji', targetAge: '3〜6才', guestAccess: true },
  { id: 'youji-juucombo',  name: '10に なる かずを さがせ！',  emoji: '🔟', color: '#60a5fa', url: '/apps/youji-juucombo',  badge: 'たして10',         audience: 'youji', targetAge: '5〜6才', guestAccess: true },
  { id: 'youji-hiragana',  name: 'にたもじ どっち？',          emoji: '🔤', color: '#c4a8ff', url: '/apps/youji-hiragana',  badge: 'おう/づ/ぢ識別',   audience: 'shougakusei', targetAge: '小1〜小2', guestAccess: true },
  { id: 'youji-clock',     name: 'なんじ かな？',              emoji: '🕑', color: '#4ade80', url: '/apps/youji-clock',     badge: '何時・何時半',     audience: 'youji', targetAge: '4〜6才', guestAccess: true },
  { id: 'youji-animals',   name: 'どうぶつ さんすう',           emoji: '🐾', color: '#fb923c', url: '/apps/youji-animals',  badge: 'たし引き20まで',   audience: 'youji', targetAge: '4〜6才', guestAccess: true },
  { id: 'thinking-youji',  name: 'ようちえん かんがえるジム',   emoji: '🐰', color: '#f472b6', url: '/apps/thinking-youji', badge: '50もん / 10バッジ', audience: 'youji', targetAge: '3〜6才', guestAccess: true },
]

// Pastel card color cycle for sticker style
const CARD_COLORS = [
  'bg-[#FFE3EE]', // pink-bg
  'bg-[#9DEDDE]', // mint-soft
  'bg-[#FFF1B8]', // yellow-soft
  'bg-[#D6ECFF]', // blue
  'bg-[#FFE0CC]', // orange
  'bg-[#DFF6CF]', // green
  'bg-[#EFE8FF]', // lav-bg
  'bg-[#FFD9D3]', // coral
]

function getCardColor(index: number): string {
  return CARD_COLORS[index % CARD_COLORS.length]
}

function getTodayRecommendations(
  profile: Profile,
  userType: UserType,
  stats: ReturnType<typeof computeStats> | NonNullable<ReturnType<typeof computeStats>>,
): { app: typeof APPS[number]; prog: number; desc: string }[] {
  if (profile.grade === '幼稚園') {
    return [
      { app: APPS.find(a => a.id === 'thinking-youji')!, prog: 0, desc: 'Lv1・Lv2が むりょうで たいけんできるよ' },
      { app: APPS.find(a => a.id === 'youji-math')!, prog: 0, desc: 'たべものと かずあそび' },
    ]
  }
  if (userType === 'guest') {
    return [
      { app: APPS.find(a => a.id === 'thinking')!, prog: 0, desc: 'Lv1・Lv2が体験できます' },
      {
        app: APPS.find(a => a.id === 'kanji')!,
        prog: stats && stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0,
        desc: stats ? `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得` : '0/0字 習得',
      },
    ]
  }
  return [
    {
      app: APPS.find(a => a.id === 'kanji')!,
      prog: stats && stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0,
      desc: stats ? `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得` : '0/0字 習得',
    },
    {
      app: APPS.find(a => a.id === 'english')!,
      prog: stats && stats.engTotal > 0 ? Math.round(stats.engMastered / stats.engTotal * 100) : 0,
      desc: stats ? `${stats.engMastered}/${stats.engTotal}語 習得` : '0/0語 習得',
    },
  ]
}

type Tab = 'home' | 'records' | 'settings'

// ─────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────
function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const ch = name ? name[0] : 'T'
  return (
    <div
      className="rounded-full flex items-center justify-center font-black select-none flex-shrink-0"
      style={{
        width: size, height: size,
        background: color,
        border: '3px solid #3A2E2A',
        boxShadow: '3px 3px 0 0 #3A2E2A',
        color: '#3A2E2A',
        fontSize: size * 0.4,
      }}
    >
      {ch}
    </div>
  )
}

// ─────────────────────────────────────────
// PasswordGate — sticker style
// ─────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: (type: UserType) => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('trial') === '1') {
      localStorage.setItem(SESSION_KEY, GUEST_VALUE)
      onUnlock('guest')
    }
  }, [onUnlock])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === LAB_PASSWORD) {
      localStorage.setItem(SESSION_KEY, MEMBER_VALUE)
      onUnlock('member')
    } else {
      setError(true); setShake(true); setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleGuestTrial() {
    localStorage.setItem(SESSION_KEY, GUEST_VALUE)
    onUnlock('guest')
  }

  return (
    <div className="min-h-screen font-sans flex items-center justify-center px-6 py-12"
      style={{ background: '#FFF6E5', backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)', backgroundSize: '22px 22px' }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 animate-bounce">
            <Image src="/tanquu/surprised.png" alt="タンキュー" width={100} height={100} unoptimized />
          </div>
          <h1 className="text-4xl font-black mb-2" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
            アプリラボ
          </h1>
          <p className="text-sm font-bold" style={{ color: '#6B5A52' }}>登録するともらえる パスワードを入れてね</p>
        </div>

        {/* Password card */}
        <form onSubmit={handleSubmit}
          className={`rounded-[22px] p-8 mb-4 ${shake ? '[animation:shake_0.4s_ease]' : ''}`}
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="パスワード"
            autoFocus
            className="w-full rounded-2xl px-4 py-3 text-center text-xl tracking-widest outline-none mb-2 font-bold"
            style={{
              border: `2.5px solid ${error ? '#FF6F9C' : '#3A2E2A'}`,
              background: '#FFF6E5',
              color: '#3A2E2A',
              boxShadow: '2px 2px 0 0 #3A2E2A',
            }}
          />
          {error && <p className="text-sm text-center mb-3 font-bold" style={{ color: '#FF6F9C' }}>パスワードがちがうよ</p>}
          {!error && <div className="mb-3" />}
          <button type="submit"
            className="w-full py-3.5 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            入る →
          </button>
        </form>

        {/* Guest trial */}
        <div className="rounded-[22px] p-6 mb-4"
          style={{ background: '#DBF6F0', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          <p className="text-center font-bold text-sm mb-1" style={{ color: '#3A2E2A' }}>パスワードなしで体験できます</p>
          <p className="text-center text-xs mb-3" style={{ color: '#6B5A52' }}>（計算・漢字・思考力が体験できます）</p>
          <button onClick={handleGuestTrial}
            className="w-full py-3 rounded-full font-black text-base transition-all hover:-translate-y-0.5"
            style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            まず試してみる →
          </button>
        </div>

        <div className="text-center space-y-2">
          <Link href="/register" className="block font-black text-sm hover:-translate-y-0.5 transition-transform" style={{ color: '#FF6F9C' }}>
            無料で登録する →
          </Link>
          <Link href="/tester" className="block text-xs font-bold hover:underline" style={{ color: '#6B5A52' }}>テスター入口</Link>
          <Link href="/" className="block text-sm font-bold hover:underline" style={{ color: '#6B5A52' }}>← ホームへ</Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// HomeTab — sticker style
// ─────────────────────────────────────────
function HomeTab({ profile, stats, userType, onTabChange }: {
  profile: Profile
  stats: NonNullable<ReturnType<typeof computeStats>>
  userType: UserType
  onTabChange: (t: Tab) => void
}) {
  const totalCleared = stats.kanjiMastered + stats.engMastered + stats.zokuseiStages + stats.codingCleared
  const totalLearning = stats.kanjiLearning + stats.engLearning
  const appStats: Record<string, { mastered: number; total: number }> = {
    kanji: { mastered: stats.kanjiMastered, total: stats.kanjiTotal },
    english: { mastered: stats.engMastered, total: stats.engTotal },
  }

  function SectionLabel({ emoji, label, sub }: { emoji: string; label: string; sub: string }) {
    return (
      <div className="mb-4 mt-6">
        <div className="cat-head flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="font-black text-xl flex items-center gap-2" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
            <span className="text-2xl">{emoji}</span>{label}
          </h3>
          <p className="text-xs font-bold" style={{ color: '#6B5A52' }}>{sub}</p>
        </div>
      </div>
    )
  }

  function AppCard({ app, index }: { app: typeof APPS[number]; index: number }) {
    const lock = lockLabel(app.id, userType)
    const s = appStats[app.id]
    const pct = s && s.total > 0 ? Math.round(s.mastered / s.total * 100) : null
    const bgColor = getCardColor(index)

    if (lock) {
      return (
        <div className={`relative rounded-[22px] p-4 opacity-70 ${bgColor}`}
          style={{ border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          {/* Lock badge */}
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-black"
            style={{ background: '#3A2E2A', color: '#FFF6E5' }}>
            🔒 {lock}
          </span>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl grayscale"
            style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A', transform: 'rotate(-3deg)' }}>
            {app.emoji}
          </div>
          <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-2"
            style={{ background: '#FFFFFF', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
            {app.targetAge}
          </span>
          <div className="font-black text-sm leading-tight mb-1" style={{ color: '#3A2E2A' }}>{app.name}</div>
          <div className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{app.badge}</div>
          {userType === 'guest' && lock === '登録して解放' && (
            <Link href="/register" className="block mt-2 text-[10px] font-black hover:underline" style={{ color: '#FF6F9C' }}>無料登録で解放 →</Link>
          )}
        </div>
      )
    }

    const cardContent = (
      <>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl"
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A', transform: 'rotate(-3deg)' }}>
          {app.emoji}
        </div>
        <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-2"
          style={{ background: '#FFFFFF', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
          {app.targetAge}
        </span>
        <div className="font-black text-sm leading-tight mb-0.5" style={{ color: '#3A2E2A' }}>{app.name}</div>
        <div className="text-[10px] font-bold mb-2" style={{ color: '#6B5A52' }}>{app.badge}</div>
        {pct !== null ? (
          <>
            <div className="text-[10px] mb-1" style={{ color: '#6B5A52' }}>{s!.mastered}/{s!.total} 習得</div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: app.color }} />
            </div>
          </>
        ) : (
          <div className="text-[10px] font-black" style={{ color: '#6B5A52' }}>あそぶ →</div>
        )}
      </>
    )

    const cardClass = `block rounded-[22px] p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${bgColor}`
    const cardStyle = { border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', textDecoration: 'none' }

    return <Link href={app.url} className={cardClass} style={cardStyle}>{cardContent}</Link>
  }

  const shougakuseiApps = APPS.filter(a => a.audience === 'shougakusei')
  const youjiApps = APPS.filter(a => a.audience === 'youji')
  const chuugakujukenApps = APPS.filter(a => a.audience === 'chuugakujuken')
  const isYoujiProfile = profile.grade === '幼稚園'

  // Recommendation cards
  const recs = getTodayRecommendations(profile, userType, stats)

  return (
    <div className="px-4 pb-4 pt-4">
      {/* Profile strip */}
      <div className="rounded-[26px] p-5 mb-5 flex items-center gap-4 flex-wrap"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        <Avatar name={profile.name} color={profile.color} size={56} />
        <div className="flex-1 min-w-[120px]">
          <p className="text-xs font-bold" style={{ color: '#6B5A52' }}>こんにちは！</p>
          <h3 className="font-black text-lg leading-tight" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
            {profile.name} さん{' '}
            <span className="text-xs font-bold" style={{ color: '#6B5A52' }}>／ {profile.grade}</span>
          </h3>
        </div>
        <div className="flex gap-3">
          {[
            { num: stats.streak, label: 'れんぞく日', bg: '#FFE3EE', numColor: '#FF6F9C' },
            { num: totalCleared, label: 'クリア', bg: '#DBF6F0', numColor: '#2BA39A' },
            { num: totalLearning, label: '学習中', bg: '#FFF1B8', numColor: '#C99700' },
          ].map(({ num, label, bg, numColor }) => (
            <button key={label}
              onClick={() => onTabChange('records')}
              className="rounded-2xl px-3 py-2 text-center min-w-[72px] transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: bg, border: '2.5px solid #3A2E2A' }}>
              <div className="font-black text-xl leading-none" style={{ color: numColor, fontFamily: 'var(--font-zen)' }}>{num}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: '#6B5A52' }}>{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Guest banner */}
      {userType === 'guest' && (
        <div className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
          style={{ background: '#FFF1B8', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          <div>
            <p className="font-black text-xs" style={{ color: '#3A2E2A' }}>👋 たいけん中</p>
            <p className="text-[10px] font-bold mt-0.5" style={{ color: '#6B5A52' }}>計算・漢字のL1〜L2が使えます</p>
          </div>
          <Link href="/register"
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all hover:-translate-y-0.5"
            style={{ background: '#FFC83D', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: '#3A2E2A' }}>
            全部使う →
          </Link>
        </div>
      )}
      {userType === 'tester' && (
        <div className="rounded-2xl px-4 py-3 mb-4"
          style={{ background: '#DBF6F0', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          <p className="font-black text-xs" style={{ color: '#2BA39A' }}>🔬 テスターモード — 全アプリ解放中</p>
        </div>
      )}

      {/* Today's recommendation */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h3 className="font-black text-xl flex items-center gap-2" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
            <span className="text-2xl">⭐</span>まずここから
          </h3>
          <p className="text-xs font-bold" style={{ color: '#6B5A52' }}>えらんだ {recs.length}つのアプリ</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recs.map(({ app, prog, desc }, i) => {
            const bgColor = i === 0 ? 'bg-[#DBF6F0]' : 'bg-[#EFE8FF]'
            const cardContent = (
              <>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl"
                  style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A', transform: 'rotate(-3deg)' }}>
                  {app.emoji}
                </div>
                <div className="font-black text-sm leading-tight mb-0.5" style={{ color: '#3A2E2A' }}>{app.name}</div>
                <div className="text-[10px] font-bold mb-2" style={{ color: '#6B5A52' }}>{desc}</div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.15)' }}>
                  <div className="h-full rounded-full" style={{ width: `${prog}%`, background: app.color }} />
                </div>
              </>
            )
            const cls = `block rounded-[22px] p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${bgColor}`
            const sty = { border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', textDecoration: 'none' }
            return <Link key={app.id} href={app.url} className={cls} style={sty}>{cardContent}</Link>
          })}
        </div>
      </div>

      {/* All apps sections */}
      {isYoujiProfile ? (
        <>
          <SectionLabel emoji="🌱" label="就学前（幼稚園・年長）" sub="3〜6才｜遊びながら学ぶ" />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {youjiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
          </div>
          <SectionLabel emoji="📘" label="小学生（小1〜小6）" sub="6〜12才｜学年別カリキュラム" />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {shougakuseiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
          </div>
        </>
      ) : (
        <>
          <SectionLabel emoji="📘" label="小学生（小1〜小6）" sub="6〜12才｜学年別カリキュラム" />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {shougakuseiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
          </div>
          <SectionLabel emoji="🌱" label="就学前（幼稚園・年長）" sub="3〜6才｜遊びながら学ぶ" />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {youjiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
          </div>
        </>
      )}
      {/* 中学受験セクション */}
      <SectionLabel emoji="🏆" label="中学受験" sub="小4〜中3｜算数・国語 入試対策" />
      {chuugakujukenApps.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {chuugakujukenApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// RecordsTab — sticker style
// ─────────────────────────────────────────
function BadgeChip({ emoji, label, color, earned }: { emoji: string; label: string; color: string; earned: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: 44 }}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all"
        style={earned
          ? { background: color, border: '2.5px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A' }
          : { background: '#E8E0D8', border: '2px dashed #C4B8AE' }}>
        <span style={{ filter: earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>{emoji}</span>
      </div>
      <span className="text-[9px] font-black text-center leading-tight" style={{ color: earned ? '#3A2E2A' : '#B0A49C', maxWidth: 44 }}>{label}</span>
    </div>
  )
}

function RecordsAppCard({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] p-4" style={{ background: bg, border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
      {children}
    </div>
  )
}

function SRSBar({ mastered, total, color }: { mastered: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round(mastered / total * 100) : 0
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: '#6B5A52' }}>
        <span>⭐ おぼえた {mastered}{total > 0 ? `/${total}` : ''}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function RecordsTab({ stats }: { stats: ReturnType<typeof computeStats> }) {
  if (!stats) return null

  const kanjiBadges = [
    { emoji: '🌱', label: 'めがでた', color: '#7BE8B0', earned: stats.kanjiMastered >= 5 },
    { emoji: '🔥', label: 'すごい', color: '#FB923C', earned: stats.kanjiMastered >= 20 },
    { emoji: '⭐', label: 'はかせ', color: '#F0C040', earned: stats.kanjiMastered >= 50 },
    { emoji: '👑', label: 'おう', color: '#B197FC', earned: stats.kanjiMastered >= 100 },
    { emoji: '🏆', label: 'ぜんぶ！', color: '#FF6F9C', earned: stats.kanjiMastered >= stats.kanjiTotal && stats.kanjiTotal > 0 },
  ]
  const engBadges = [
    { emoji: '🌱', label: 'はじめの\nいっぽ', color: '#7BE8B0', earned: stats.engMastered >= 5 },
    { emoji: '🔥', label: 'えいごずき', color: '#FB923C', earned: stats.engMastered >= 20 },
    { emoji: '⭐', label: 'はかせ', color: '#F0C040', earned: stats.engMastered >= 50 },
    { emoji: '👑', label: 'えいごおう', color: '#B197FC', earned: stats.engMastered >= 100 },
    { emoji: '🏆', label: 'ぜんぶ！', color: '#FF6F9C', earned: stats.engMastered >= stats.engTotal && stats.engTotal > 0 },
  ]
  const wmBadges = stats.wmByGrade.map(({ grade, done }) => ({
    emoji: grade === '小1' ? '📘' : grade === '小2' ? '📗' : '📕',
    label: `${grade}マスター`,
    color: grade === '小1' ? '#60A5FA' : grade === '小2' ? '#4ADE80' : '#F87171',
    earned: done,
  }))
  const codingBadges = [
    { emoji: '🖥️', label: 'はじめて', color: '#4ADE80', earned: stats.codingCleared >= 3 },
    { emoji: '💡', label: 'プログラマー', color: '#60A5FA', earned: stats.codingCleared >= 6 },
    { emoji: '🏆', label: 'ぜんぶクリア', color: '#FF6F9C', earned: stats.codingCleared >= TOTALS.CODING },
  ]
  const mathBadges = [
    { emoji: '🥉', label: 'かんたん\nクリア', color: '#7BE8B0', earned: stats.mathBest.easy >= 10 },
    { emoji: '🥈', label: 'ふつう\nクリア', color: '#F0C040', earned: stats.mathBest.normal >= 10 },
    { emoji: '🥇', label: 'むずかしい\nクリア', color: '#FB923C', earned: stats.mathBest.hard >= 10 },
  ]
  const clockBadges = [
    { emoji: '★', label: 'ちょうど', color: '#4ADE80', earned: stats.clockBest.jidou >= 7 },
    { emoji: '★★', label: '30ぷん', color: '#F0C040', earned: stats.clockBest.sanjuppun >= 7 },
    { emoji: '★★★', label: 'ぜんぶ', color: '#B197FC', earned: stats.clockBest.all >= 7 },
  ]
  const shapesBadges = [
    { emoji: '🔷', label: 'ずけい\nはかせ', color: '#60A5FA', earned: stats.shapesBest >= 10 },
    { emoji: '🏆', label: 'マスター', color: '#FF6F9C', earned: stats.shapesBest >= 14 },
  ]
  const DOMAIN_COLORS_REC: Record<string, string> = { '生物': '#22c55e', '地学': '#0ea5e9', '化学': '#f59e0b', '物理': '#8b5cf6' }
  const scienceBadges = [
    { emoji: '🌱', label: 'さいしょの\n一歩', color: '#7BE8B0', earned: stats.scienceMastered >= 5 },
    { emoji: '⚗️', label: 'かがくずき', color: '#f59e0b', earned: stats.scienceMastered >= 30 },
    { emoji: '🔬', label: 'りかはかせ', color: '#0ea5e9', earned: stats.scienceMastered >= 80 },
    { emoji: '🏆', label: 'ぜんぶ！', color: '#FF6F9C', earned: stats.scienceMastered >= stats.scienceTotal && stats.scienceTotal > 0 },
  ]

  const hiraganaBadges = [
    { emoji: '🌸', label: 'はじめての\n一歩', color: '#ec4899', earned: stats.hiraganaBest >= 3 },
    { emoji: '🔤', label: 'かんぺき', color: '#6366f1', earned: stats.hiraganaBest >= 7 },
    { emoji: '⭐', label: 'ひらがな\nはかせ', color: '#f59e0b', earned: stats.hiraganaStickers >= 5 },
  ]
  const juucombosBadges = [
    { emoji: '🔢', label: 'はじめて', color: '#22c55e', earned: stats.juucombosBest >= 5 },
    { emoji: '⭐', label: 'じゅう\nはかせ', color: '#f59e0b', earned: stats.juucombosBest >= 10 },
  ]
  const mathYoujiBadges = [
    { emoji: '🍎', label: 'はじめての\n一歩', color: '#f97316', earned: stats.mathYoujiBest >= 50 },
    { emoji: '⭐', label: 'さんすう\nはかせ', color: '#f59e0b', earned: stats.mathYoujiBest >= 90 },
  ]
  const iroBadges = [
    { emoji: '🌈', label: 'いろはかせ', color: '#8b5cf6', earned: stats.iroCount >= 1 },
    { emoji: '⭐⭐⭐', label: 'さいこう\n3つ星', color: '#f59e0b', earned: stats.iroMaxStars >= 3 },
  ]
  const youjiKanjiBadges = [
    { emoji: '🈳', label: 'はじめての\n一歩', color: '#ef4444', earned: stats.youjiKanjiCount >= 1 },
    { emoji: '⭐⭐⭐', label: 'さいこう\n3つ星', color: '#f59e0b', earned: stats.youjiKanjiMaxStars >= 3 },
  ]
  const kukuBadges = [
    { emoji: '✕', label: 'はじめて', color: '#f59e0b', earned: stats.kukuCount >= 1 },
    { emoji: '🏃', label: 'アタック\nせいこう', color: '#3b82f6', earned: stats.kukuBestAttack > 0 },
    { emoji: '⭐', label: 'くくはかせ', color: '#f59e0b', earned: stats.kukuMaxStars >= 3 },
  ]
  const clockYoujiBadges = [
    { emoji: '🕐', label: 'はじめての\n一歩', color: '#4ade80', earned: stats.clockYoujiLevels >= 1 },
    { emoji: '⭐', label: '4ステージ', color: '#f59e0b', earned: stats.clockYoujiLevels >= 4 },
    { emoji: '🏆', label: 'ぜんぶ\nクリア', color: '#FF6F9C', earned: stats.clockYoujiLevels >= 8 },
  ]
  const zokuseiiBadges = [
    { emoji: '🃏', label: 'はじめての\n一歩', color: '#a855f7', earned: stats.zokuseiStages >= 1 },
    { emoji: '⭐', label: '3ステージ', color: '#f59e0b', earned: stats.zokuseiStages >= 3 },
    { emoji: '🔬', label: 'サイエンス\nクリア', color: '#1c7ed6', earned: stats.zokuseiStages >= 5 },
    { emoji: '🏆', label: 'ぜんぶ\nクリア', color: '#7c3aed', earned: stats.zokuseiStages >= 6 },
  ]

  const allBadges = [...kanjiBadges, ...engBadges, ...wmBadges, ...scienceBadges, ...codingBadges, ...mathBadges, ...clockBadges, ...shapesBadges, ...hiraganaBadges, ...juucombosBadges, ...mathYoujiBadges, ...iroBadges, ...youjiKanjiBadges, ...kukuBadges, ...clockYoujiBadges, ...zokuseiiBadges]
  const earnedCount = allBadges.filter(b => b.earned).length

  const hasKanji = stats.kanjiMastered > 0
  const hasEng = stats.engMastered > 0
  const hasWm = stats.wmByGrade.some(g => g.mastered > 0)
  const hasScience = stats.scienceMastered > 0
  const hasThinking = stats.thinkingMaxLevel > 0
  const hasYouji = stats.youjiMaxLevel > 0
  const hasCoding = stats.codingCleared > 0
  const hasMath = stats.mathBest.easy > 0 || stats.mathBest.normal > 0 || stats.mathBest.hard > 0
  const hasClock = stats.clockBest.jidou > 0 || stats.clockBest.sanjuppun > 0 || stats.clockBest.all > 0
  const hasShapes = stats.shapesBest > 0
  const hasKatakana = stats.katakanaCount > 0
  const hasAnimals = stats.animalsBest > 0
  const hasHiragana = stats.hiraganaBest > 0
  const hasJuucombo = stats.juucombosBest > 0
  const hasMathYouji = stats.mathYoujiBest > 0
  const hasIro = stats.iroCount > 0
  const hasYoujiKanji = stats.youjiKanjiCount > 0
  const hasKuku = stats.kukuCount > 0
  const hasClockYouji = stats.clockYoujiLevels > 0
  const hasZokusei = stats.zokuseiStages > 0

  const hasAny = hasKanji || hasEng || hasWm || hasScience || hasThinking || hasYouji ||
    hasCoding || hasMath || hasClock || hasShapes || hasKatakana || hasAnimals ||
    hasHiragana || hasJuucombo || hasMathYouji || hasIro || hasYoujiKanji || hasKuku ||
    hasClockYouji || hasZokusei || stats.kokugoCleared > 0 || stats.kanyoCleared > 0 || stats.yojiCleared > 0

  return (
    <div className="px-4 pt-5 pb-6">
      <h2 className="font-black text-2xl mb-1" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>わたしの記録</h2>
      <p className="text-xs font-bold mb-4" style={{ color: '#6B5A52' }}>がんばりのあしあとを見てみよう！</p>

      {/* Summary bar */}
      <div className="rounded-[18px] p-4 mb-5 flex items-center justify-around"
        style={{ background: '#FFF1B8', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        <div className="text-center">
          <div className="text-4xl font-black" style={{ color: '#FF6F9C', fontFamily: 'var(--font-zen)' }}>{earnedCount}</div>
          <div className="text-xs font-black" style={{ color: '#3A2E2A' }}>🏅 バッジ</div>
        </div>
        {stats.streak > 0 && (
          <div className="text-center">
            <div className="text-4xl font-black" style={{ color: '#FB923C', fontFamily: 'var(--font-zen)' }}>{stats.streak}</div>
            <div className="text-xs font-black" style={{ color: '#3A2E2A' }}>🔥 にちれんぞく</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-4xl font-black" style={{ color: '#B197FC', fontFamily: 'var(--font-zen)' }}>{stats.kanjiMastered + stats.engMastered}</div>
          <div className="text-xs font-black" style={{ color: '#3A2E2A' }}>⭐ おぼえた</div>
        </div>
      </div>

      {!hasAny && (
        <div className="rounded-[22px] p-6 text-center" style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
          <div className="text-4xl mb-3">🌱</div>
          <p className="font-black text-sm mb-1" style={{ color: '#3A2E2A' }}>まだ記録がないよ</p>
          <p className="text-xs" style={{ color: '#6B5A52' }}>アプリで遊ぶと、ここにあしあとが残るよ！</p>
        </div>
      )}

      <div className="space-y-3">
        {/* 漢字マスター */}
        {hasKanji && (
        <RecordsAppCard bg="#EFE8FF">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📖</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>漢字マスター</span>
          </div>
          {hasKanji && <SRSBar mastered={stats.kanjiMastered} total={stats.kanjiTotal} color="#B197FC" />}
          <div className="flex gap-2 flex-wrap mt-2">
            {kanjiBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 英語 */}
        {hasEng && (
        <RecordsAppCard bg="#FFD9D3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌍</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>えいごボキャブラリー</span>
          </div>
          {hasEng && <SRSBar mastered={stats.engMastered} total={stats.engTotal} color="#F87171" />}
          <div className="flex gap-2 flex-wrap mt-2">
            {engBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 算数文章題 */}
        {hasWm && (
        <RecordsAppCard bg="#FFF1B8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📐</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>さんすう文章題</span>
          </div>
          {hasWm && (
            <div className="space-y-1 mb-3">
              {stats.wmByGrade.map(({ grade, mastered, total }) => {
                const pct = total > 0 ? Math.round(mastered / total * 100) : 0
                const color = grade === '小1' ? '#60A5FA' : grade === '小2' ? '#4ADE80' : '#F87171'
                return (
                  <div key={grade} className="flex items-center gap-2">
                    <span className="text-[10px] font-black w-6" style={{ color: '#3A2E2A' }}>{grade}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{mastered}/{total}</span>
                  </div>
                )
              })}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {wmBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 理科クイズ */}
        {hasScience && (
        <RecordsAppCard bg="#DFF6CF">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚗️</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>理科クイズ</span>
          </div>
          {hasScience && (
            <div className="space-y-1 mb-3">
              {stats.scienceByDomain.map(({ domain, mastered, total }) => {
                const pct = total > 0 ? Math.round(mastered / total * 100) : 0
                return (
                  <div key={domain} className="flex items-center gap-2">
                    <span className="text-[10px] font-black w-6" style={{ color: '#3A2E2A' }}>{domain}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DOMAIN_COLORS_REC[domain] }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{mastered}/{total}</span>
                  </div>
                )
              })}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {scienceBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 国語クイズ */}
        {stats.kokugoCleared > 0 && (
        <RecordsAppCard bg="#EDE9FE">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📖</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>国語クイズ</span>
          </div>
          {stats.kokugoCleared > 0 && (
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black" style={{ color: '#3A2E2A' }}>クリア</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round(stats.kokugoCleared / stats.kokugoTotal * 100)}%`, background: '#8b5cf6' }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{stats.kokugoCleared}/{stats.kokugoTotal}Lv</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              { emoji: '🌸', label: 'はじめの\n一歩', color: '#ec4899', earned: stats.kokugoCleared >= 1 },
              { emoji: '📗', label: '5Lv制覇', color: '#22c55e', earned: stats.kokugoCleared >= 5 },
              { emoji: '📘', label: '10Lv制覇', color: '#3b82f6', earned: stats.kokugoCleared >= 10 },
              { emoji: '📙', label: '15Lv制覇', color: '#f97316', earned: stats.kokugoCleared >= 15 },
              { emoji: '🏆', label: '国語\nマスター', color: '#7c3aed', earned: stats.kokugoCleared >= 20 },
            ].map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 慣用句クイズ */}
        {stats.kanyoCleared > 0 && (
        <RecordsAppCard bg="#FFF1E6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🗣️</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>慣用句クイズ</span>
          </div>
          {stats.kanyoCleared > 0 && (
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black" style={{ color: '#3A2E2A' }}>クリア</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round(stats.kanyoCleared / stats.kanyoTotal * 100)}%`, background: '#f97316' }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{stats.kanyoCleared}/{stats.kanyoTotal}Lv</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              { emoji: '🌸', label: 'はじめの\n一歩', color: '#ec4899', earned: stats.kanyoCleared >= 1 },
              { emoji: '🗣️', label: '5Lv制覇', color: '#f97316', earned: stats.kanyoCleared >= 5 },
              { emoji: '📗', label: '10Lv制覇', color: '#22c55e', earned: stats.kanyoCleared >= 10 },
              { emoji: '🔥', label: '15Lv制覇', color: '#ef4444', earned: stats.kanyoCleared >= 15 },
              { emoji: '🏆', label: '慣用句\nマスター', color: '#ea580c', earned: stats.kanyoCleared >= 20 },
            ].map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 四字熟語クイズ */}
        {stats.yojiCleared > 0 && (
        <RecordsAppCard bg="#EEF2FF">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📝</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>四字熟語クイズ</span>
          </div>
          {stats.yojiCleared > 0 && (
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black" style={{ color: '#3A2E2A' }}>クリア</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round(stats.yojiCleared / stats.yojiTotal * 100)}%`, background: '#6366f1' }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#6B5A52' }}>{stats.yojiCleared}/{stats.yojiTotal}Lv</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              { emoji: '🌸', label: 'はじめの\n一歩', color: '#ec4899', earned: stats.yojiCleared >= 1 },
              { emoji: '📝', label: '5Lv制覇', color: '#6366f1', earned: stats.yojiCleared >= 5 },
              { emoji: '📚', label: '10Lv制覇', color: '#3b82f6', earned: stats.yojiCleared >= 10 },
              { emoji: '💎', label: '15Lv制覇', color: '#7c3aed', earned: stats.yojiCleared >= 15 },
              { emoji: '🏆', label: '四字熟語\nマスター', color: '#4f46e5', earned: stats.yojiCleared >= 20 },
            ].map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* かんがえる力ジム */}
        {hasThinking && (
        <RecordsAppCard bg="#D6ECFF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🧩</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>かんがえる力ジム</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-black" style={{ color: '#3A2E2A' }}>
                <span>🏁 Lv{stats.thinkingMaxLevel} まで クリア！</span>
                <span>🏅 バッジ {stats.thinkingBadgeCount}こ</span>
              </div>
        </RecordsAppCard>
        )}

        {/* ようちえんかんがえるジム */}
        {hasYouji && (
        <RecordsAppCard bg="#FFE3EE">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🐰</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ようちえんかんがえるジム</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-black" style={{ color: '#3A2E2A' }}>
                <span>🏁 Lv{stats.youjiMaxLevel} まで クリア！</span>
                <span>🏅 バッジ {stats.youjiBadgeCount}こ</span>
              </div>
        </RecordsAppCard>
        )}

        {/* カタカナれんしゅう */}
        {hasKatakana && (
        <RecordsAppCard bg="#F0E8FF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔡</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>カタカナ れんしゅう</span>
          </div>
          {hasKatakana && (
            <div className="flex items-center gap-3 text-sm font-black" style={{ color: '#3A2E2A' }}>
              <span>🎮 {stats.katakanaCount}かい あそんだ</span>
              <span>{'⭐'.repeat(stats.katakanaMaxStars)}{'☆'.repeat(3 - stats.katakanaMaxStars)}</span>
            </div>
          )}
        </RecordsAppCard>
        )}

        {/* どうぶつさんすう */}
        {hasAnimals && (
        <RecordsAppCard bg="#FFF0D6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🐾</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>どうぶつ さんすう</span>
          </div>
          {hasAnimals && (
            <div className="flex items-center gap-3 text-sm font-black" style={{ color: '#3A2E2A' }}>
              <span>⭐ さいこうスコア {stats.animalsBest}%</span>
            </div>
          )}
        </RecordsAppCard>
        )}

        {/* プログラミング */}
        {hasCoding && (
        <RecordsAppCard bg="#DFF6CF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💻</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>プログラミング</span>
          </div>
          {hasCoding && (
            <div className="mb-2">
              <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: '#6B5A52' }}>
                <span>クリア: {stats.codingCleared}ステージ</span>
                <span>/ {TOTALS.CODING}</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(58,46,42,0.12)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(stats.codingCleared / TOTALS.CODING * 100)}%`, background: '#4ADE80' }} />
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {codingBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 計算チャレンジ */}
        {hasMath && (
        <RecordsAppCard bg="#FFE0CC">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔢</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>計算チャレンジ</span>
          </div>
          {hasMath && (
            <div className="flex gap-3 mb-2 text-[11px] font-bold" style={{ color: '#6B5A52' }}>
              {stats.mathBest.easy > 0 && <span>かんたん: さいこう{stats.mathBest.easy}もん</span>}
              {stats.mathBest.normal > 0 && <span>ふつう: {stats.mathBest.normal}もん</span>}
              {stats.mathBest.hard > 0 && <span>むずかしい: {stats.mathBest.hard}もん</span>}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {mathBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 時計 */}
        {hasClock && (
        <RecordsAppCard bg="#9DEDDE">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🕐</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>時計・時間計算</span>
          </div>
          {hasClock && (
            <div className="flex gap-3 mb-2 text-[11px] font-bold" style={{ color: '#6B5A52' }}>
              {stats.clockBest.jidou > 0 && <span>ちょうど: {stats.clockBest.jidou}/10</span>}
              {stats.clockBest.sanjuppun > 0 && <span>30分: {stats.clockBest.sanjuppun}/10</span>}
              {stats.clockBest.all > 0 && <span>ぜんぶ: {stats.clockBest.all}/10</span>}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {clockBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* 図形 */}
        {hasShapes && (
        <RecordsAppCard bg="#E8F4FF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔷</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>図形トレーニング</span>
          </div>
          {hasShapes && (
            <p className="text-[11px] font-bold mb-2" style={{ color: '#6B5A52' }}>さいこう: {stats.shapesBest}/15もん</p>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {shapesBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* ひらがなスペル */}
        {hasHiragana && (
        <RecordsAppCard bg="#FFF0F8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔤</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ひらがな スペル</span>
          </div>
          {hasHiragana && (
            <div className="flex items-center gap-3 text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>
              <span>⭐ さいこう {stats.hiraganaBest}もん</span>
              {stats.hiraganaStickers > 0 && <span>🌸 シール {stats.hiraganaStickers}まい</span>}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {hiraganaBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* じゅうコンボ */}
        {hasJuucombo && (
        <RecordsAppCard bg="#F0FFF4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔟</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>じゅうコンボ</span>
          </div>
          {hasJuucombo && (
            <p className="text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>⭐ さいこう {stats.juucombosBest}もん せいかい</p>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {juucombosBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* ようじさんすう */}
        {hasMathYouji && (
        <RecordsAppCard bg="#FFF7ED">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🍎</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ようじ さんすう</span>
          </div>
          {hasMathYouji && (
            <p className="text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>⭐ さいこう {stats.mathYoujiBest}%</p>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {mathYoujiBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* いろとかたち */}
        {hasIro && (
        <RecordsAppCard bg="#F5F3FF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌈</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>いろと かたち</span>
          </div>
          {hasIro && (
            <div className="flex items-center gap-3 text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>
              <span>🎮 {stats.iroCount}かい あそんだ</span>
              <span>{'⭐'.repeat(stats.iroMaxStars)}{'☆'.repeat(3 - stats.iroMaxStars)}</span>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {iroBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* ようじかんじ */}
        {hasYoujiKanji && (
        <RecordsAppCard bg="#FFF1F1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🈳</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ようじ かんじ</span>
          </div>
          {hasYoujiKanji && (
            <div className="flex items-center gap-3 text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>
              <span>🎮 {stats.youjiKanjiCount}かい あそんだ</span>
              <span>{'⭐'.repeat(stats.youjiKanjiMaxStars)}{'☆'.repeat(3 - stats.youjiKanjiMaxStars)}</span>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {youjiKanjiBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* くくれんしゅう */}
        {hasKuku && (
        <RecordsAppCard bg="#FFFBEB">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✕</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>くく れんしゅう</span>
          </div>
          {hasKuku && (
            <div className="flex flex-wrap gap-3 text-[11px] font-bold mb-2" style={{ color: '#6B5A52' }}>
              <span>🎮 {stats.kukuCount}かい あそんだ</span>
              {stats.kukuBestAttack > 0 && <span>🏃 タイムアタック さいこう {stats.kukuBestAttack}秒</span>}
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {kukuBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* ようじとけい */}
        {hasClockYouji && (
        <RecordsAppCard bg="#F0FFF8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🕐</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ようじ とけい</span>
          </div>
          {hasClockYouji && (
            <div className="flex items-center gap-3 text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>
              <span>🏁 {stats.clockYoujiLevels}/8ステージ クリア</span>
              <span>{'⭐'.repeat(Math.min(stats.clockYoujiMaxStars, 3))}{'☆'.repeat(Math.max(0, 3 - stats.clockYoujiMaxStars))}</span>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {clockYoujiBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}

        {/* ぞくせいかるた */}
        {hasZokusei && (
        <RecordsAppCard bg="#FAF0FF">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🃏</span>
            <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>ぞくせい かるた</span>
          </div>
          {hasZokusei && (
            <div className="flex items-center gap-3 text-sm font-black mb-2" style={{ color: '#3A2E2A' }}>
              <span>🏁 {stats.zokuseiStages}/6ステージ クリア</span>
              <span>{'⭐'.repeat(Math.min(stats.zokuseiMaxStars, 3))}{'☆'.repeat(Math.max(0, 3 - stats.zokuseiMaxStars))}</span>
            </div>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {zokuseiiBadges.map(b => <BadgeChip key={b.label} {...b} />)}
          </div>
        </RecordsAppCard>
        )}
      </div>

      {/* SRS explanation */}
      <div className="mt-4 rounded-[18px] p-4" style={{ background: '#FFFFFF', border: '2px solid #3A2E2A', boxShadow: '2px 2px 0 0 #3A2E2A' }}>
        <p className="text-xs leading-relaxed font-bold" style={{ color: '#6B5A52' }}>
          <span className="font-black" style={{ color: '#B197FC' }}>⭐ おぼえたって何？</span><br />
          漢字・英語・文章題は、同じ問題に正解すると少しずつ「おぼえた」に近づくよ。3回正解すると「おぼえた！」になるんだ。
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// SettingsTab — sticker style
// ─────────────────────────────────────────
function SettingsTab({ profile, onSave, userType, onLogout }: { profile: Profile; onSave: (p: Profile) => void; userType: UserType; onLogout: () => void }) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveProfile(draft)
    onSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <h2 className="font-black text-2xl mb-1" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>せってい</h2>
      <p className="text-xs font-bold mb-6" style={{ color: '#6B5A52' }}>プロフィールを自分らしくしよう</p>

      {/* Avatar preview */}
      <div className="flex justify-center mb-6">
        <Avatar name={draft.name} color={draft.color} size={80} />
      </div>

      {/* Color picker */}
      <div className="rounded-[22px] p-5 mb-4" style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
        <label className="block text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#6B5A52' }}>カラー</label>
        <div className="flex gap-3 justify-center">
          {AVATAR_COLORS.map((c) => (
            <button key={c} onClick={() => setDraft({ ...draft, color: c })}
              className="w-10 h-10 rounded-full transition-all hover:scale-110"
              style={{
                background: c,
                border: draft.color === c ? `3px solid #3A2E2A` : '3px solid transparent',
                boxShadow: draft.color === c ? '3px 3px 0 0 #3A2E2A' : 'none',
              }} />
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#6B5A52' }}>なまえ</label>
        <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={10}
          className="w-full rounded-2xl px-4 py-3 text-lg font-bold outline-none"
          style={{
            background: '#FFF6E5',
            border: '2.5px solid #3A2E2A',
            boxShadow: '2px 2px 0 0 #3A2E2A',
            color: '#3A2E2A',
          }}
          placeholder="なまえを入れてね" />
      </div>

      {/* Grade */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#6B5A52' }}>学年</label>
        <div className="grid grid-cols-3 gap-2">
          {GRADES.map((g) => (
            <button key={g} onClick={() => setDraft({ ...draft, grade: g })}
              className="py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
              style={draft.grade === g
                ? { background: draft.color, color: '#3A2E2A', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }
                : { background: '#FFFFFF', color: '#6B5A52', border: '2px solid #3A2E2A' }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className="w-full py-4 rounded-full font-black text-lg transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
        style={{
          background: saved ? '#4ade80' : draft.color,
          border: '3px solid #3A2E2A',
          boxShadow: '6px 6px 0 0 #3A2E2A',
          color: '#3A2E2A',
        }}>
        {saved ? '✓ 保存しました！' : '保存する'}
      </button>

      {/* Logout / account switch */}
      <div className="mt-6 pt-4 flex flex-col gap-3" style={{ borderTop: '2px dashed rgba(58,46,42,0.2)' }}>
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
          style={{ background: '#FFE3EE', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', color: '#3A2E2A' }}
        >
          {userType === 'tester' ? '← テスター入口に戻る' : 'ログアウト'}
        </button>
        <Link
          href="/"
          className="w-full py-3 rounded-2xl font-bold text-sm text-center transition-all hover:-translate-y-0.5"
          style={{ background: '#FFFFFF', border: '2px solid #3A2E2A', color: '#6B5A52' }}
        >
          トップページへ
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// BottomNav — sticker style
// ─────────────────────────────────────────
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'records', label: 'きろく', icon: '📊' },
    { id: 'settings', label: 'せってい', icon: '⚙️' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: '#FFF6E5', borderTop: '3px solid #3A2E2A' }}>
      <div className="flex max-w-md mx-auto">
        {items.map(({ id, label, icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-all"
            style={{ color: tab === id ? '#FF6F9C' : '#6B5A52' }}>
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[10px] font-black leading-none">{label}</span>
            {tab === id && (
              <div className="w-4 h-1 rounded-full mt-0.5" style={{ background: '#FF6F9C', border: '1.5px solid #3A2E2A' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// AppHub (main dashboard) — sticker style
// ─────────────────────────────────────────
function AppHub({ userType, onLogout }: { userType: UserType; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const { stats, refresh: refreshStats } = useStats()

  useEffect(() => {
    setProfile(loadProfile(userType))
    refreshStats()
  }, [userType, refreshStats])

  useEffect(() => {
    if (tab === 'records' || tab === 'home') refreshStats()
  }, [tab, refreshStats])

  return (
    <div className="min-h-screen font-sans"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        color: '#3A2E2A',
      }}>
      <div className="min-h-screen max-w-md mx-auto pb-20 relative" style={{ borderLeft: '1px solid rgba(58,46,42,0.08)', borderRight: '1px solid rgba(58,46,42,0.08)' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(255,246,229,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '3px solid #3A2E2A',
          }}>
          <Link href="/" className="font-black text-base hover:opacity-70 transition-opacity" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>🔬 TANQ ラボ</Link>
          <div className="flex items-center gap-2">
            {stats && stats.streak > 0 && (
              <span className="text-sm font-black px-2 py-1 rounded-full" style={{ background: '#FFF1B8', border: '2px solid #3A2E2A', color: '#C99700' }}>
                🔥{stats.streak}
              </span>
            )}
            <button onClick={() => setTab('settings')}>
              <Avatar name={profile.name} color={profile.color} size={36} />
            </button>
          </div>
        </div>

        {/* Tab content */}
        {tab === 'home' && stats && <HomeTab profile={profile} stats={stats} userType={userType} onTabChange={setTab} />}
        {tab === 'records' && stats && <RecordsTab stats={stats} />}
        {tab === 'settings' && <SettingsTab profile={profile} onSave={(p) => { setProfile(p); saveProfile(p) }} userType={userType} onLogout={onLogout} />}

        <BottomNav tab={tab} onChange={setTab} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────
export default function LabPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)
  const [userType, setUserType] = useState<UserType>('guest')

  useEffect(() => {
    async function init() {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved === MEMBER_VALUE) {
        // Supabaseセッションを検証してトークン期限切れを検出する
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          localStorage.removeItem(SESSION_KEY)
          setChecking(false)
          return
        }
        setUserType('member')
        setUnlocked(true)
      } else if (saved === TESTER_VALUE) {
        setUserType('tester')
        setUnlocked(true)
      } else if (saved === GUEST_VALUE) {
        setUserType('guest')
        setUnlocked(true)
      }
      setChecking(false)
    }
    init()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF6E5' }}>
        <div className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '3px solid #3A2E2A', borderTopColor: '#FFC83D' }} />
      </div>
    )
  }

  function handleUnlock(type: UserType) {
    setUserType(type)
    setUnlocked(true)
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('tanq-tester-name')
    setUnlocked(false)
    setUserType('guest')
    // テスターは /tester へ、それ以外は同ページ（PasswordGate を表示）
    if (userType === 'tester') {
      window.location.href = '/tester'
    }
  }

  return unlocked
    ? <AppHub userType={userType} onLogout={handleLogout} />
    : <PasswordGate onUnlock={handleUnlock} />
}
