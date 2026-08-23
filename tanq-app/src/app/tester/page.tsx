'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SESSION_KEY = 'tanq-lab-auth'
const NAME_KEY = 'tanq-tester-name'
const RECENT_KEY = 'tanq-tester-recent-names-v2'

function loadRecentNames(): string[] {
  try {
    const old = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as unknown
    return Array.isArray(old) ? old.filter((v): v is string => typeof v === 'string').slice(0, 8) : []
  } catch { return [] }
}

function rememberName(name: string) {
  const names = loadRecentNames().filter(v => v !== name)
  localStorage.setItem(RECENT_KEY, JSON.stringify([name, ...names].slice(0, 8)))
}

export default function TesterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/tester/session').then(async r => {
      if (!r.ok) return
      const data = await r.json()
      if (data?.authenticated && typeof data.name === 'string') {
        const allowedNames = Array.isArray(data.allowedNames) ? data.allowedNames.filter((v: unknown): v is string => typeof v === 'string').slice(0, 8) : [data.name]
        setSessionActive(true); setName(data.name); setRecent(allowedNames)
        localStorage.setItem(SESSION_KEY, 'tester'); localStorage.setItem(NAME_KEY, data.name); rememberName(data.name)
      }
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const recentNames = loadRecentNames()
      const res = await fetch('/api/tester/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), code: pin, recentNames }) })
      if (!res.ok) { setError(res.status === 429 ? '試行回数が多すぎます。しばらく待ってください' : res.status === 503 ? '一時的に利用できません' : 'お名前またはコードが正しくありません'); setPin(''); return }
      const data = await res.json(); const active = data.name as string
      localStorage.setItem(SESSION_KEY, 'tester'); localStorage.setItem(NAME_KEY, active); rememberName(active)
      router.push('/lab')
    } catch { setError('通信に失敗しました') } finally { setBusy(false) }
  }

  async function quickSwitch(nextName: string) {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/tester/switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nextName }) })
      if (!res.ok) {
        if (res.status === 401) setSessionActive(false)
        setError(res.status === 403 ? 'このIDは現在のセッションでは切り替えできません。コードを再入力してください' : 'セッションの期限が切れました。コードを再入力してください')
        return
      }
      const data = await res.json(); localStorage.setItem(SESSION_KEY, 'tester'); localStorage.setItem(NAME_KEY, data.name); rememberName(data.name); router.push('/lab')
    } catch { setError('切り替えに失敗しました') } finally { setBusy(false) }
  }

  return <div className="min-h-screen font-sans" style={{ background: 'var(--cream)' }}>
    <Navbar />
    <main className="pt-24 pb-24 px-4 flex flex-col items-center">
      <div className="text-center mt-8 mb-8"><div className="inline-flex px-4 py-1.5 rounded-full font-bold text-xs" style={{ background: 'var(--lav-bg)', border: '2.5px solid var(--ink)' }}>TESTERS</div><h1 className="text-4xl font-black mt-5" style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>テスター <span style={{ color: 'var(--pink)' }}>入口</span></h1></div>
      {sessionActive && recent.length > 0 && <div className="card-sticker w-full max-w-md p-6 mb-5" style={{ background: 'var(--mint-bg)' }}><h2 className="font-black mb-3">最近のテスト用IDへ切り替え</h2><div className="flex flex-wrap gap-2">{recent.map(n => <button key={n} disabled={busy} onClick={() => quickSwitch(n)} className="btn-sticker btn-white px-4 py-2 text-sm font-black">{n}</button>)}</div><p className="text-xs mt-3 font-bold">有効なセッション中はコードの再入力なしで切り替えられます。</p></div>}
      <div className="card-sticker w-full max-w-md p-8" style={{ background: 'var(--lav-bg)' }}>
        <h2 className="text-2xl font-black text-center mb-6">テスターとして 入場</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-black mb-2">お名前 / ニックネーム *</label><input value={name} onChange={e => { setName(e.target.value); setError('') }} required maxLength={40} className="sticker-input w-full px-4 py-3 font-bold outline-none" /></div>
          <div><label className="block text-sm font-black mb-2">テスターコード *</label><input type="password" value={pin} onChange={e => { setPin(e.target.value); setError('') }} required maxLength={64} className="sticker-input w-full px-4 py-3 text-center text-xl font-black outline-none" />{error && <p className="text-sm font-bold text-center mt-2" style={{ color: 'var(--pink)' }}>{error}</p>}</div>
          <button disabled={busy} type="submit" className="btn-sticker btn-yellow w-full py-4 text-base font-black">{busy ? '確認中…' : '入る →'}</button>
        </form>
      </div>
      <div className="card-sticker w-full max-w-md mt-5 px-6 py-5 text-center" style={{ background: 'var(--cream-deep)' }}><p className="text-sm font-black mb-3">テスターコードをお持ちでない方</p><div className="flex justify-center gap-3"><Link href="/register" className="btn-sticker btn-white px-5 py-2 text-sm font-black">登録する</Link><Link href="/lab?trial=1" className="btn-sticker btn-white px-5 py-2 text-sm font-black">体験だけする</Link></div></div>
    </main><Footer />
  </div>
}
