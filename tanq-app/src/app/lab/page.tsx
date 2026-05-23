'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { KANJI_DATA } from '@/data/kanjiData'
import { WORDS } from '@/data/englishData'
import { getDataKey } from '@/lib/storage'

// アプリが提供する全体数（SRS済み数ではなく全データ数）
const TOTAL_KANJI = Object.values(KANJI_DATA).reduce((sum, arr) => sum + arr.length, 0)
const TOTAL_ENGLISH = WORDS.length

const LAB_PASSWORD = process.env.NEXT_PUBLIC_LAB_PASSWORD || 'tanq2026'
const SESSION_KEY = 'tanq-lab-auth'
const GUEST_VALUE = 'guest'
const TESTER_VALUE = 'tester'
const MEMBER_VALUE = 'member'
const PROFILE_KEY = 'tanq_profile_v1'

type UserType = 'guest' | 'tester' | 'member'

function canAccessApp(appId: string, userType: UserType): boolean {
  if (userType === 'tester') return true
  if (userType === 'member') return appId !== 'tanq'
  // ゲスト: 内製基本アプリ + 幼稚園外部アプリ + 思考力（Lv1-2のみ・制限はアプリ側で制御）
  return appId === 'math' || appId === 'kanji' || appId === 'word-math' || appId === 'kuku' || appId === 'todofuken' || appId === 'thinking' || appId === 'thinking-youji' || appId.startsWith('youji-')
}

function lockLabel(appId: string, userType: UserType): string | null {
  if (canAccessApp(appId, userType)) return null
  if (userType === 'member' && appId === 'tanq') return '近日公開'
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

interface SRSItem { b: 0 | 1 | 2 }

function readSRS(key: string): SRSItem[] {
  if (typeof window === 'undefined') return []
  try { return Object.values(JSON.parse(localStorage.getItem(getDataKey(key)) || '{}')) as SRSItem[] } catch { return [] }
}

function getStreak(key: string): number {
  if (typeof window === 'undefined') return 0
  try { return JSON.parse(localStorage.getItem(getDataKey(key)) || '{"n":0}').n } catch { return 0 }
}

function computeStats() {
  const kanji = readSRS('tanq_kanji_srs_v1')
  const english = readSRS('tanq_english_srs_v1')
  const sum = (items: SRSItem[], b: number) => items.filter(x => x.b === b).length
  return {
    kanjiMastered: sum(kanji, 2), kanjiLearning: sum(kanji, 1), kanjiTotal: TOTAL_KANJI,
    engMastered: sum(english, 2), engLearning: sum(english, 1), engTotal: TOTAL_ENGLISH,
    streak: Math.max(getStreak('tanq_kanji_streak_v1'), getStreak('tanq_english_streak_v1')),
  }
}

type AppAudience = 'shougakusei' | 'youji'
const _YB = '/youji/apps'  // public/youji/apps/ に内製コピー済み

// targetAge: カードに表示する対象年齢チップ
const APPS: {
  id: string; name: string; emoji: string; color: string; url: string;
  badge: string; audience: AppAudience; targetAge: string
}[] = [
  // ── 📘 小学生向け（内製アプリ・学年別カリキュラム）──────────
  { id: 'tanq',         name: 'TANQ理科',        emoji: '🔬', color: '#00e5c3', url: '/tanq',          badge: 'Season 1',         audience: 'shougakusei', targetAge: '小4〜小6' },
  { id: 'math',         name: '計算チャレンジ',   emoji: '🔢', color: '#60a5fa', url: '/apps/math',      badge: 'タイムアタック',   audience: 'shougakusei', targetAge: '小2〜小6' },
  { id: 'kanji',        name: '漢字マスター',      emoji: '📖', color: '#c4a8ff', url: '/apps/kanji',     badge: `${TOTAL_KANJI}字`, audience: 'shougakusei', targetAge: '小1〜小6' },
  { id: 'clock',        name: '時計・時間計算',    emoji: '🕐', color: '#f0c040', url: '/apps/clock',     badge: '分・時間計算',     audience: 'shougakusei', targetAge: '小2〜小4' },
  { id: 'english',      name: '英語ボキャブラリー', emoji: '🌍', color: '#f87171', url: '/apps/english',   badge: `${TOTAL_ENGLISH}語`, audience: 'shougakusei', targetAge: '小3〜小6' },
  { id: 'thinking',     name: 'かんがえる力ジム',   emoji: '🧩', color: '#6366f1', url: '/apps/thinking',  badge: '100問 / 25バッジ', audience: 'shougakusei', targetAge: '小4〜小6' },
  { id: 'word-math',    name: '算数文章題',        emoji: '📐', color: '#f0a050', url: '/apps/word-math', badge: '文章から立式',     audience: 'shougakusei', targetAge: '小1〜小3' },
  { id: 'shapes',       name: '図形トレーニング',  emoji: '🔷', color: '#a78bfa', url: '/apps/shapes',    badge: '8図形',            audience: 'shougakusei', targetAge: '小3〜小5' },
  { id: 'coding',       name: 'プログラミング',    emoji: '💻', color: '#4ade80', url: '/apps/coding',    badge: '5ステージ',        audience: 'shougakusei', targetAge: '小3〜小6' },
  { id: 'youji-zokusei', name: 'ぞくせい仕分け工場', emoji: '🏭', color: '#94a3b4', url: `${_YB}/zokusei/`, badge: 'ベン図・分類',    audience: 'shougakusei', targetAge: '小1〜小3' },
  { id: 'kuku',          name: '九九マスター',      emoji: '✖️', color: '#f59e0b', url: `${_YB}/kuku/`,    badge: '2〜9の段',        audience: 'shougakusei', targetAge: '小2〜小4' },
  { id: 'todofuken',     name: '都道府県マスター',  emoji: '🗾', color: '#0ea5e9', url: `${_YB}/todofuken/`, badge: '47都道府県',      audience: 'shougakusei', targetAge: '小4〜小6' },
  // ── 🌱 就学前向け（ひらがな・絵・音声で遊びながら学ぶ）──────
  { id: 'youji-katakana',  name: 'カタカナ れんしゅう',  emoji: '🔡', color: '#d946ef', url: `${_YB}/katakana/`,   badge: 'ア〜ン 46字',     audience: 'youji', targetAge: '5〜6才' },
  { id: 'youji-iro',       name: 'いろと かたち',         emoji: '🌈', color: '#ec4899', url: `${_YB}/iro-katachi/`, badge: '10色・8かたち',   audience: 'youji', targetAge: '3〜5才' },
  { id: 'youji-kanji',    name: 'はじめての かんじ',   emoji: '📚', color: '#f87171', url: `${_YB}/kanji/`,    badge: 'にちじょうご80字', audience: 'youji', targetAge: '4〜6才' },
  { id: 'youji-math',     name: 'たべものと かずあそび', emoji: '🍎', color: '#f0a050', url: `${_YB}/math/`,     badge: '20まで',          audience: 'youji', targetAge: '3〜6才' },
  { id: 'youji-juucombo', name: '10に なる かずを さがせ！', emoji: '🔟', color: '#60a5fa', url: `${_YB}/juucombo/`, badge: 'たして10',      audience: 'youji', targetAge: '5〜6才' },
  { id: 'youji-hiragana', name: 'にたもじ どっち？', emoji: '🔤', color: '#c4a8ff', url: `${_YB}/no5/`,      badge: 'おう/づ/ぢ識別',  audience: 'shougakusei', targetAge: '小1〜小2' },
  { id: 'youji-clock',    name: 'なんじ かな？',        emoji: '🕑', color: '#4ade80', url: `${_YB}/clock/`,    badge: '何時・何時半',     audience: 'youji', targetAge: '4〜6才' },
  { id: 'youji-animals',  name: 'どうぶつ さんすう',    emoji: '🐾', color: '#fb923c', url: `${_YB}/animals/`,  badge: 'たし引き20まで',   audience: 'youji', targetAge: '4〜6才' },
  { id: 'thinking-youji', name: 'ようちえん かんがえるジム', emoji: '🐰', color: '#f472b6', url: '/apps/thinking-youji', badge: '50もん / 10バッジ', audience: 'youji', targetAge: '3〜6才' },
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
  stats: ReturnType<typeof computeStats>,
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
        prog: stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0,
        desc: `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得`,
      },
    ]
  }
  return [
    {
      app: APPS.find(a => a.id === 'kanji')!,
      prog: stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0,
      desc: `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得`,
    },
    {
      app: APPS.find(a => a.id === 'english')!,
      prog: stats.engTotal > 0 ? Math.round(stats.engMastered / stats.engTotal * 100) : 0,
      desc: `${stats.engMastered}/${stats.engTotal}語 習得`,
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
function HomeTab({ profile, stats, userType }: {
  profile: Profile
  stats: ReturnType<typeof computeStats>
  userType: UserType
}) {
  const totalMastered = stats.kanjiMastered + stats.engMastered
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
    const isStatic = app.url.startsWith('/youji/')
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

    return isStatic
      ? <a href={app.url} className={cardClass} style={cardStyle}>{cardContent}</a>
      : <Link href={app.url} className={cardClass} style={cardStyle}>{cardContent}</Link>
  }

  const shougakuseiApps = APPS.filter(a => a.audience === 'shougakusei')
  const youjiApps = APPS.filter(a => a.audience === 'youji')
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
            { num: totalMastered, label: 'マスター', bg: '#DBF6F0', numColor: '#2BA39A' },
            { num: totalLearning, label: '学習中', bg: '#FFF1B8', numColor: '#C99700' },
          ].map(({ num, label, bg, numColor }) => (
            <div key={label} className="rounded-2xl px-3 py-2 text-center min-w-[72px]"
              style={{ background: bg, border: '2.5px solid #3A2E2A' }}>
              <div className="font-black text-xl leading-none" style={{ color: numColor, fontFamily: 'var(--font-zen)' }}>{num}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: '#6B5A52' }}>{label}</div>
            </div>
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
            <span className="text-2xl">⭐</span>きょうの おすすめ
          </h3>
          <p className="text-xs font-bold" style={{ color: '#6B5A52' }}>{profile.name} さんに ぴったりの {recs.length}つ</p>
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
            const isStatic = app.url.startsWith('/youji/')
            return isStatic
              ? <a key={app.id} href={app.url} className={cls} style={sty}>{cardContent}</a>
              : <Link key={app.id} href={app.url} className={cls} style={sty}>{cardContent}</Link>
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
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
            {youjiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// RecordsTab — sticker style
// ─────────────────────────────────────────
function RecordsTab({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const items = [
    { label: '漢字', emoji: '📖', color: '#B197FC', bg: '#EFE8FF', mastered: stats.kanjiMastered, learning: stats.kanjiLearning, total: stats.kanjiTotal },
    { label: '英語', emoji: '🌍', color: '#f87171', bg: '#FFD9D3', mastered: stats.engMastered, learning: stats.engLearning, total: stats.engTotal },
  ]
  const totalMastered = stats.kanjiMastered + stats.engMastered

  return (
    <div className="px-4 pt-5 pb-4">
      <h2 className="font-black text-2xl mb-1" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>わたしの記録</h2>
      <p className="text-xs font-bold mb-5" style={{ color: '#6B5A52' }}>学習の積み重ねを確認しよう</p>

      {/* Total summary */}
      <div className="rounded-[22px] p-5 mb-5 text-center"
        style={{ background: '#FFF1B8', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
        <div className="text-5xl font-black mb-1" style={{ color: '#FF6F9C', fontFamily: 'var(--font-zen)' }}>{totalMastered}</div>
        <div className="font-black text-sm mb-0.5" style={{ color: '#3A2E2A' }}>語・問題 習得済み</div>
        {stats.streak > 0 && (
          <div className="font-bold text-sm mt-2" style={{ color: '#C99700' }}>🔥 {stats.streak}日連続学習中！</div>
        )}
        {totalMastered === 0 && (
          <p className="text-xs mt-2 font-bold" style={{ color: '#6B5A52' }}>まだ学習していないよ。アプリから始めよう！</p>
        )}
      </div>

      {/* Per-app breakdown */}
      <div className="space-y-3 mb-5">
        {items.map(({ label, emoji, color, bg, mastered, learning, total }) => {
          const pct = total > 0 ? Math.round(mastered / total * 100) : 0
          return (
            <div key={label} className="rounded-[22px] p-4"
              style={{ background: bg, border: '3px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>{label}</span>
                </div>
                <span className="font-black text-sm" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(58,46,42,0.15)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold" style={{ color: '#6B5A52' }}>
                <span>⭐ 習得 {mastered}語</span>
                <span>📚 学習中 {learning}語</span>
                <span>全{total}語</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* SRS explanation */}
      <div className="rounded-[22px] p-4" style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
        <p className="text-xs leading-relaxed font-bold" style={{ color: '#6B5A52' }}>
          <span className="font-black" style={{ color: '#B197FC' }}>習得の仕組み</span>: 同じ問題に3回連続・2.5秒以内で正解すると「習得」に！習得した語は7日後に確認問題として出題されるよ。
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// SettingsTab — sticker style
// ─────────────────────────────────────────
function SettingsTab({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
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

      <div className="mt-6 pt-4 text-center" style={{ borderTop: '2px dashed rgba(58,46,42,0.2)' }}>
        <Link href="/" className="text-sm font-bold hover:underline" style={{ color: '#6B5A52' }}>← コーポレートサイトへ</Link>
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
function AppHub({ userType }: { userType: UserType }) {
  const [tab, setTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [stats, setStats] = useState(computeStats())

  useEffect(() => {
    setProfile(loadProfile(userType))
    setStats(computeStats())
  }, [userType])

  const refreshStats = useCallback(() => setStats(computeStats()), [])

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
          <span className="font-black text-base" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>🔬 TANQ ラボ</span>
          <div className="flex items-center gap-2">
            {stats.streak > 0 && (
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
        {tab === 'home' && <HomeTab profile={profile} stats={stats} userType={userType} />}
        {tab === 'records' && <RecordsTab stats={stats} />}
        {tab === 'settings' && <SettingsTab profile={profile} onSave={(p) => { setProfile(p); saveProfile(p) }} />}

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
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved === MEMBER_VALUE) { setUserType('member'); setUnlocked(true) }
    else if (saved === TESTER_VALUE) { setUserType('tester'); setUnlocked(true) }
    else if (saved === GUEST_VALUE) { setUserType('guest'); setUnlocked(true) }
    setChecking(false)
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

  return unlocked
    ? <AppHub userType={userType} />
    : <PasswordGate onUnlock={handleUnlock} />
}
