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
  return appId === 'math' || appId === 'kanji' || appId === 'word-math' || appId === 'kuku' || appId === 'todofuken' || appId === 'thinking' || appId.startsWith('youji-')
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
]

type Tab = 'home' | 'records' | 'settings'

// ─────────────────────────────────────────
// ExternalLinkModal
// ─────────────────────────────────────────
function ExternalLinkModal({ url, name, onConfirm, onCancel }: {
  url: string; name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm bg-[#0d1f3c] border border-white/20 rounded-3xl p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-4xl mb-3">🌐</div>
        <h3 className="text-lg font-black text-[#e8f0fe] mb-2">べつのサイトに移動します</h3>
        <p className="text-sm text-[#94a3c4] mb-2">
          <span className="font-bold text-[#f0c040]">「{name}」</span> は TANQラボの外のサービスです。
        </p>
        <p className="text-xs text-[#94a3c4] mb-5">もどるには、ブラウザの「←」ボタンを使ってね。</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-bold text-sm border border-white/20 text-[#94a3c4] hover:text-white transition-all">
            キャンセル
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-black text-sm text-[#050b14] transition-all hover:scale-[1.02]"
            style={{ background: '#f0c040' }}>
            移動する →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// PasswordGate
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
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1a5040] opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#c4a8ff] opacity-10 blur-[110px]" />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[#00e5c3] opacity-20 blur-3xl rounded-full scale-150" />
            <Image src="/tanquu/surprised.png" alt="TANQuu" width={100} height={100} className="relative z-10 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]" />
          </div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#00e5c3] to-[#c4a8ff] bg-clip-text text-transparent">アプリラボ</h1>
          <p className="text-[#94a3c4] text-sm">登録するともらえるパスワードを入力</p>
        </div>
        <form onSubmit={handleSubmit} className={`bg-white/5 border border-white/15 rounded-2xl p-8 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
          <input type="password" value={input} onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="パスワード" autoFocus
            className={`w-full bg-white/8 border rounded-xl px-4 py-3 text-[#e8f0fe] text-center text-xl tracking-widest outline-none focus:border-[#c4a8ff] transition-colors mb-2 ${error ? 'border-[#f87171]/60' : 'border-white/15'}`} />
          {error && <p className="text-[#f87171] text-xs text-center mb-3">パスワードが違います</p>}
          {!error && <div className="mb-3" />}
          <button type="submit" className="w-full py-3.5 rounded-xl font-black text-[#050b14] text-base" style={{ background: 'linear-gradient(135deg, #00e5c3, #c4a8ff)' }}>
            入る →
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-center text-[#94a3c4] text-xs mb-1">パスワードなしで体験できます</p>
          <p className="text-center text-[#94a3c4] text-[10px] mb-3">（計算・漢字・思考力トレーニングが体験できます）</p>
          <button
            onClick={handleGuestTrial}
            className="w-full py-3.5 rounded-xl font-black text-lg text-white border-2 border-[#c4a8ff]/50 hover:border-[#c4a8ff] hover:bg-[#c4a8ff]/10 transition-all"
          >
            まず試してみる →
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[#94a3c4] text-xs mb-1">パスワードをお持ちでない方</p>
          <Link href="/register" className="text-[#c4a8ff] text-sm font-bold hover:underline">無料で登録する →</Link>
        </div>

        <div className="mt-3 text-center">
          <Link href="/tester" className="text-[#94a3c4] text-xs hover:text-[#c4a8ff]">テスター入口</Link>
        </div>

        <p className="text-center mt-4"><Link href="/" className="text-[#94a3c4] text-sm hover:text-[#c4a8ff]">← ホームへ</Link></p>
      </div>
      <style jsx>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────
function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const ch = name ? name[0] : 'T'
  return (
    <div className="rounded-full flex items-center justify-center font-black select-none flex-shrink-0"
      style={{ width: size, height: size, background: `${color}30`, border: `2px solid ${color}60`, color, fontSize: size * 0.45 }}>
      {ch}
    </div>
  )
}

// ─────────────────────────────────────────
// HomeTab
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
      <div className="mb-3 mt-6">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">{emoji}</span>
          <span className="font-black text-[#e8f0fe] text-sm">{label}</span>
          <div className="h-px bg-white/12 flex-1" />
        </div>
        <p className="text-[10px] text-[#94a3c4] pl-6 font-bold">{sub}</p>
      </div>
    )
  }

  function AppCard({ app }: { app: typeof APPS[number] }) {
    const lock = lockLabel(app.id, userType)
    const s = appStats[app.id]
    const pct = s && s.total > 0 ? Math.round(s.mastered / s.total * 100) : null
    const isStatic = app.url.startsWith('/youji/')

    if (lock) {
      return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 opacity-60">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl grayscale">{app.emoji}</div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-[#94a3c4] border border-white/15">
              🔒 {lock}
            </span>
          </div>
          <div className="font-black text-[#94a3c4] text-sm mb-1">{app.name}</div>
          <div className="text-[#94a3c4] text-[10px]">{app.badge}</div>
          {userType === 'guest' && lock === '登録して解放' && (
            <Link href="/register" className="block mt-2 text-[10px] text-[#c4a8ff] font-bold hover:underline">無料登録で解放 →</Link>
          )}
        </div>
      )
    }

    const cardClass = "bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] block"
    const cardInner = (
      <>
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl">{app.emoji}</div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: `${app.color}20`, color: app.color, border: `1px solid ${app.color}40` }}>
            {app.badge}
          </span>
        </div>
        <div className="font-black text-[#e8f0fe] text-sm mb-0.5 leading-tight">{app.name}</div>
        {/* 年齢バッジ */}
        <div className="text-[9px] font-bold text-[#94a3c4] mb-1.5 flex items-center gap-1">
          <span style={{ color: app.audience === 'youji' ? '#fb923c' : '#60a5fa' }}>
            {app.audience === 'youji' ? '🌱' : '📘'}
          </span>
          {app.targetAge}
        </div>
        {pct !== null ? (
          <>
            <div className="text-[#94a3c4] text-[10px] mb-1.5">{s!.mastered}/{s!.total} 習得</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: app.color }} />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: app.color }} />
            <span className="text-[#94a3c4] text-[10px]">開く →</span>
          </div>
        )}
      </>
    )

    return isStatic
      ? <a href={app.url} className={cardClass}>{cardInner}</a>
      : <Link href={app.url} className={cardClass}>{cardInner}</Link>
  }

  const shougakuseiApps = APPS.filter(a => a.audience === 'shougakusei')
  const youjiApps = APPS.filter(a => a.audience === 'youji')
  // 幼稚園プロフィールなら幼稚園セクションを先に表示
  const isYoujiProfile = profile.grade === '幼稚園'

  return (
    <div className="px-4 pb-4 pt-6">
      {/* Profile header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar name={profile.name} color={profile.color} size={52} />
          <div>
            <p className="font-black text-[#e8f0fe] text-lg leading-tight">{profile.name}</p>
            <p className="text-[#94a3c4] text-xs">{profile.grade} | TANQ ラボ</p>
          </div>
        </div>
        {stats.streak > 0 && (
          <div className="flex items-center gap-1 bg-[#f0c040]/15 border border-[#f0c040]/30 px-3 py-2 rounded-full">
            <span className="text-lg">🔥</span>
            <div className="text-right">
              <div className="font-black text-[#f0c040] text-sm leading-none">{stats.streak}日</div>
              <div className="text-[#94a3c4] text-[10px]">連続</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '⭐ 習得', value: totalMastered, color: '#c4a8ff' },
          { label: '📚 学習中', value: totalLearning, color: '#60a5fa' },
          { label: '🔥 連続', value: stats.streak, color: '#f0c040', unit: '日' },
        ].map(({ label, value, color, unit }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
            <div className="font-black text-2xl" style={{ color }}>{value}{unit}</div>
            <div className="text-[#94a3c4] text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Today's recommended */}
      <div className="mb-2">
        <h2 className="font-black text-[#e8f0fe] text-sm mb-1">今日の学習</h2>
        <p className="text-[#94a3c4] text-[10px] mb-3 font-bold">
          {profile.grade === '幼稚園' ? '🌱 就学前向けのおすすめ' : `📘 ${profile.grade}向けのおすすめ`}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(userType === 'guest'
            ? [
                { app: APPS.find(a => a.id === 'thinking')!, prog: 0, desc: 'Lv1・Lv2が体験できます' },
                { app: APPS.find(a => a.id === 'kanji')!, prog: stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0, desc: `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得` },
              ]
            : [
                { app: APPS.find(a => a.id === 'kanji')!, prog: stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0, desc: `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得` },
                { app: APPS.find(a => a.id === 'english')!, prog: stats.engTotal > 0 ? Math.round(stats.engMastered / stats.engTotal * 100) : 0, desc: `${stats.engMastered}/${stats.engTotal}語 習得` },
              ]
          ).map(({ app, prog, desc }) => (
            <Link key={app.id} href={app.url}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="text-3xl mb-2">{app.emoji}</div>
              <div className="font-black text-[#e8f0fe] text-sm mb-0.5">{app.name}</div>
              <div className="text-[#94a3c4] text-[10px] mb-2">{desc}</div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${prog}%`, background: app.color }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Guest banner */}
      {userType === 'guest' && (
        <div className="mt-4 px-3 py-2.5 bg-[#f0c040]/10 border border-[#f0c040]/30 rounded-xl text-center">
          <p className="text-[#f0c040] text-xs font-bold">体験中: 計算・漢字・思考力トレーニング（Lv1〜2）が使えます</p>
          <Link href="/register" className="text-[#c4a8ff] text-[11px] hover:underline font-bold">無料登録で全アプリ解放 →</Link>
        </div>
      )}

      {/* All apps — プロフィールに応じて順番を切り替え */}
      {isYoujiProfile ? (
        <>
          <SectionLabel
            emoji="🌱"
            label="就学前（幼稚園・年長）"
            sub="3〜6才｜遊びながら学ぶ"
          />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {youjiApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
          <SectionLabel
            emoji="📘"
            label="小学生（小1〜小6）"
            sub="6〜12才｜学年別カリキュラム"
          />
          <div className="grid grid-cols-2 gap-3">
            {shougakuseiApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        </>
      ) : (
        <>
          <SectionLabel
            emoji="📘"
            label="小学生（小1〜小6）"
            sub="6〜12才｜学年別カリキュラム"
          />
          <div className="grid grid-cols-2 gap-3 mb-2">
            {shougakuseiApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
          <SectionLabel
            emoji="🌱"
            label="就学前（幼稚園・年長）"
            sub="3〜6才｜遊びながら学ぶ"
          />
          <div className="grid grid-cols-2 gap-3">
            {youjiApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        </>
      )}
    </div>
  )
}


// ─────────────────────────────────────────
// RecordsTab
// ─────────────────────────────────────────
function RecordsTab({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const items = [
    { label: '漢字', emoji: '📖', color: '#c4a8ff', mastered: stats.kanjiMastered, learning: stats.kanjiLearning, total: stats.kanjiTotal },
    { label: '英語', emoji: '🌍', color: '#f87171', mastered: stats.engMastered, learning: stats.engLearning, total: stats.engTotal },
  ]
  const totalMastered = stats.kanjiMastered + stats.engMastered

  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="font-black text-[#e8f0fe] text-lg mb-1">わたしの記録</h2>
      <p className="text-[#94a3c4] text-xs mb-5">学習の積み重ねを確認しよう</p>

      {/* Total summary */}
      <div className="bg-gradient-to-br from-[#c4a8ff]/15 to-[#00e5c3]/10 border border-white/15 rounded-2xl p-5 mb-5 text-center">
        <div className="text-5xl font-black text-[#c4a8ff] mb-1">{totalMastered}</div>
        <div className="text-[#e8f0fe] font-bold text-sm mb-0.5">語・問題 習得済み</div>
        {stats.streak > 0 && (
          <div className="text-[#f0c040] text-sm mt-2">🔥 {stats.streak}日連続学習中！</div>
        )}
        {totalMastered === 0 && (
          <p className="text-[#94a3c4] text-xs mt-2">まだ学習していないよ。アプリから始めよう！</p>
        )}
      </div>

      {/* Per-app breakdown */}
      <div className="space-y-3 mb-5">
        {items.map(({ label, emoji, color, mastered, learning, total }) => {
          const pct = total > 0 ? Math.round(mastered / total * 100) : 0
          return (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-black text-[#e8f0fe] text-sm">{label}</span>
                </div>
                <span className="font-black text-sm" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="flex justify-between text-[10px] text-[#94a3c4]">
                <span>⭐ 習得 {mastered}語</span>
                <span>📚 学習中 {learning}語</span>
                <span>全{total}語</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* SRS explanation */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
        <p className="text-[#94a3c4] text-xs leading-relaxed">
          <span className="text-[#c4a8ff] font-bold">習得の仕組み</span>: 同じ問題に3回連続・2.5秒以内で正解すると「習得」に！習得した語は7日後に確認問題として出題されるよ。
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// SettingsTab
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
    <div className="px-4 pt-6 pb-4">
      <h2 className="font-black text-[#e8f0fe] text-lg mb-1">せってい</h2>
      <p className="text-[#94a3c4] text-xs mb-6">プロフィールを自分らしくしよう</p>

      {/* Avatar preview */}
      <div className="flex justify-center mb-6">
        <Avatar name={draft.name} color={draft.color} size={80} />
      </div>

      {/* Color picker */}
      <div className="mb-6">
        <label className="block text-xs text-[#94a3c4] font-bold uppercase tracking-wider mb-3">カラー</label>
        <div className="flex gap-3 justify-center">
          {AVATAR_COLORS.map((c) => (
            <button key={c} onClick={() => setDraft({ ...draft, color: c })}
              className="w-10 h-10 rounded-full transition-all hover:scale-110"
              style={{ background: c, border: draft.color === c ? `3px solid white` : '3px solid transparent', boxShadow: draft.color === c ? `0 0 15px ${c}80` : 'none' }} />
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-5">
        <label className="block text-xs text-[#94a3c4] font-bold uppercase tracking-wider mb-2">なまえ</label>
        <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={10}
          className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[#e8f0fe] text-lg font-bold outline-none focus:border-[#c4a8ff] transition-colors"
          placeholder="なまえを入れてね" />
      </div>

      {/* Grade */}
      <div className="mb-8">
        <label className="block text-xs text-[#94a3c4] font-bold uppercase tracking-wider mb-2">学年</label>
        <div className="grid grid-cols-3 gap-2">
          {GRADES.map((g) => (
            <button key={g} onClick={() => setDraft({ ...draft, grade: g })}
              className="py-2.5 rounded-xl font-bold text-sm transition-all"
              style={draft.grade === g
                ? { background: draft.color, color: '#050b14' }
                : { background: 'rgba(255,255,255,0.06)', color: '#94a3c4', border: '1px solid rgba(255,255,255,0.1)' }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className="w-full py-4 rounded-2xl font-black text-lg text-[#050b14] transition-all hover:scale-[1.02]"
        style={{ background: saved ? '#4ade80' : draft.color, boxShadow: `0 0 25px ${draft.color}40` }}>
        {saved ? '✓ 保存しました！' : '保存する'}
      </button>

      <div className="mt-6 pt-4 border-t border-white/10">
        <Link href="/" className="block text-center text-[#94a3c4] text-sm hover:text-[#c4a8ff]">← コーポレートサイトへ</Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// BottomNav
// ─────────────────────────────────────────
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'records', label: 'きろく', icon: '📊' },
    { id: 'settings', label: 'せってい', icon: '⚙️' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex max-w-md mx-auto">
        {items.map(({ id, label, icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-all"
            style={{ color: tab === id ? '#c4a8ff' : '#94a3c4' }}>
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[10px] font-bold leading-none">{label}</span>
            {tab === id && <div className="w-4 h-0.5 rounded-full bg-[#c4a8ff] mt-0.5" />}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// AppHub (main dashboard)
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

  // Refresh stats when returning to records tab
  useEffect(() => {
    if (tab === 'records' || tab === 'home') refreshStats()
  }, [tab, refreshStats])

  return (
    <div className="min-h-screen bg-[#0a1628] text-[#e8f0fe] font-sans">
      <div className="min-h-screen max-w-md mx-auto pb-20 lg:border-x lg:border-white/8 relative">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <span className="font-black text-[#e8f0fe] text-base">🔬 TANQ ラボ</span>
        <div className="flex items-center gap-2">
          {stats.streak > 0 && (
            <span className="text-[#f0c040] text-sm font-bold">🔥{stats.streak}</span>
          )}
          <button onClick={() => setTab('settings')}>
            <Avatar name={profile.name} color={profile.color} size={32} />
          </button>
        </div>
      </div>

      {userType === 'guest' && (
        <div className="mx-4 mt-4 px-4 py-3 bg-[#f0c040]/10 border border-[#f0c040]/30 rounded-2xl flex items-center justify-between gap-3">
          <div>
            <p className="text-[#f0c040] text-xs font-bold">👋 体験中</p>
            <p className="text-[#94a3c4] text-[10px] mt-0.5">計算・漢字のL1〜L2が使えます</p>
          </div>
          <Link href="/register" className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-black text-[#050b14]" style={{ background: '#f0c040' }}>
            全部使う →
          </Link>
        </div>
      )}
      {userType === 'tester' && (
        <div className="mx-4 mt-4 px-4 py-3 bg-[#00e5c3]/10 border border-[#00e5c3]/30 rounded-2xl">
          <p className="text-[#00e5c3] text-xs font-bold">🔬 テスターモード — 全アプリ解放中</p>
        </div>
      )}

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
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c4a8ff] border-t-transparent rounded-full animate-spin" />
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
