'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LAB_PASSWORD = process.env.NEXT_PUBLIC_LAB_PASSWORD || 'tanq2026'
const SESSION_KEY = 'tanq-lab-auth'
const PROFILE_KEY = 'tanq_profile_v1'

interface Profile { name: string; grade: string; color: string }
const DEFAULT_PROFILE: Profile = { name: 'たんきゅう', grade: '小4', color: '#c4a8ff' }
const AVATAR_COLORS = ['#c4a8ff', '#00e5c3', '#f0c040', '#f87171', '#60a5fa']
const GRADES = ['小1', '小2', '小3', '小4', '小5', '小6', '中1', '中2', '中3']

function loadProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') } } catch { return DEFAULT_PROFILE }
}
function saveProfile(p: Profile) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
}

interface SRSItem { b: 0 | 1 | 2 }

function readSRS(key: string): SRSItem[] {
  if (typeof window === 'undefined') return []
  try { return Object.values(JSON.parse(localStorage.getItem(key) || '{}')) as SRSItem[] } catch { return [] }
}

function getStreak(key: string): number {
  if (typeof window === 'undefined') return 0
  try { return JSON.parse(localStorage.getItem(key) || '{"n":0}').n } catch { return 0 }
}

function computeStats() {
  const kanji = readSRS('tanq_kanji_srs_v1')
  const english = readSRS('tanq_english_srs_v1')
  const sum = (items: SRSItem[], b: number) => items.filter(x => x.b === b).length
  return {
    kanjiMastered: sum(kanji, 2), kanjiLearning: sum(kanji, 1), kanjiTotal: kanji.length,
    engMastered: sum(english, 2), engLearning: sum(english, 1), engTotal: english.length,
    streak: Math.max(getStreak('tanq_kanji_streak_v1'), getStreak('tanq_english_streak_v1')),
  }
}

const APPS = [
  { id: 'tanq',    name: 'TANQ理科',     emoji: '🔬', color: '#00e5c3', url: '/tanq',         badge: 'Season 1' },
  { id: 'youti',   name: '幼稚マスター', emoji: '🌟', color: '#f0c040', url: 'https://ukun-cre.github.io/youti_master_v1/', badge: 'Live', external: true },
  { id: 'math',    name: '計算',          emoji: '🔢', color: '#60a5fa', url: '/apps/math',    badge: '速さで勝負' },
  { id: 'kanji',   name: '漢字',          emoji: '📖', color: '#c4a8ff', url: '/apps/kanji',  badge: '330字' },
  { id: 'clock',   name: '時計',          emoji: '🕐', color: '#f0c040', url: '/apps/clock',  badge: '時間計算' },
  { id: 'english', name: '英語',          emoji: '🌍', color: '#f87171', url: '/apps/english', badge: '120語' },
  { id: 'shapes',  name: '図形',          emoji: '🔷', color: '#c4a8ff', url: '/apps/shapes', badge: '8図形' },
  { id: 'coding',  name: 'プログラミング', emoji: '💻', color: '#4ade80', url: '/apps/coding', badge: '5ステージ' },
]

type Tab = 'home' | 'apps' | 'records' | 'settings'

// ─────────────────────────────────────────
// PasswordGate
// ─────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === LAB_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true); setShake(true); setInput('')
      setTimeout(() => setShake(false), 500)
    }
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
          <p className="text-[#94a3c4] text-sm">パスワードを入力してください</p>
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
function HomeTab({ profile, stats, onNav }: {
  profile: Profile
  stats: ReturnType<typeof computeStats>
  onNav: (tab: Tab) => void
}) {
  const totalMastered = stats.kanjiMastered + stats.engMastered
  const totalLearning = stats.kanjiLearning + stats.engLearning

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-[#e8f0fe] text-sm">今日の学習</h2>
          <button onClick={() => onNav('apps')} className="text-[#94a3c4] text-xs hover:text-[#c4a8ff]">全アプリ →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { app: APPS.find(a => a.id === 'kanji')!, prog: stats.kanjiTotal > 0 ? Math.round(stats.kanjiMastered / stats.kanjiTotal * 100) : 0, desc: `${stats.kanjiMastered}/${stats.kanjiTotal}字 習得` },
            { app: APPS.find(a => a.id === 'english')!, prog: stats.engTotal > 0 ? Math.round(stats.engMastered / stats.engTotal * 100) : 0, desc: `${stats.engMastered}/${stats.engTotal}語 習得` },
          ].map(({ app, prog, desc }) => (
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

      {/* Quick access */}
      <div>
        <h2 className="font-black text-[#e8f0fe] text-sm mb-3">クイックアクセス</h2>
        <div className="grid grid-cols-4 gap-2">
          {APPS.slice(0, 4).map((app) => (
            <Link key={app.id} href={app.external ? '#' : app.url}
              className="flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 px-2 hover:border-white/20 transition-all">
              <span className="text-2xl">{app.emoji}</span>
              <span className="text-[#94a3c4] text-[10px] text-center leading-tight">{app.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// AppsTab
// ─────────────────────────────────────────
function AppsTab({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const appStats: Record<string, { mastered: number; total: number }> = {
    kanji: { mastered: stats.kanjiMastered, total: stats.kanjiTotal },
    english: { mastered: stats.engMastered, total: stats.engTotal },
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="font-black text-[#e8f0fe] text-lg mb-1">アプリ一覧</h2>
      <p className="text-[#94a3c4] text-xs mb-5">全{APPS.length}アプリ使い放題</p>
      <div className="grid grid-cols-2 gap-3">
        {APPS.map((app) => {
          const s = appStats[app.id]
          const pct = s && s.total > 0 ? Math.round(s.mastered / s.total * 100) : null
          const cardClass = "bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] block"
          const inner = (
            <>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{app.emoji}</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${app.color}20`, color: app.color, border: `1px solid ${app.color}40` }}>
                  {app.badge}
                </span>
              </div>
              <div className="font-black text-[#e8f0fe] text-sm mb-1">{app.name}</div>
              {pct !== null ? (
                <>
                  <div className="text-[#94a3c4] text-[10px] mb-2">{s!.mastered}/{s!.total}語 習得</div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: app.color }} />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: app.color }} />
                  <span className="text-[#94a3c4] text-[10px]">開く →</span>
                </div>
              )}
            </>
          )
          return app.external ? (
            <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer" className={cardClass}>{inner}</a>
          ) : (
            <Link key={app.id} href={app.url} className={cardClass}>{inner}</Link>
          )
        })}
      </div>
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
    { id: 'apps', label: 'アプリ', icon: '🎮' },
    { id: 'records', label: 'きろく', icon: '📊' },
    { id: 'settings', label: 'せってい', icon: '⚙️' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex max-w-lg mx-auto">
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
function AppHub() {
  const [tab, setTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [stats, setStats] = useState(computeStats())

  useEffect(() => {
    setProfile(loadProfile())
    setStats(computeStats())
  }, [])

  const refreshStats = useCallback(() => setStats(computeStats()), [])

  // Refresh stats when returning to records tab
  useEffect(() => {
    if (tab === 'records' || tab === 'home') refreshStats()
  }, [tab, refreshStats])

  return (
    <div className="min-h-screen bg-[#0a1628] text-[#e8f0fe] font-sans pb-20">
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

      {/* Tab content */}
      {tab === 'home' && <HomeTab profile={profile} stats={stats} onNav={setTab} />}
      {tab === 'apps' && <AppsTab stats={stats} />}
      {tab === 'records' && <RecordsTab stats={stats} />}
      {tab === 'settings' && <SettingsTab profile={profile} onSave={(p) => { setProfile(p); saveProfile(p) }} />}

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}

// ─────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────
export default function LabPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true)
    setChecking(false)
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c4a8ff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return unlocked ? <AppHub /> : <PasswordGate onUnlock={() => setUnlocked(true)} />
}
