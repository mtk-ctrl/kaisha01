'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const TESTER_PIN = '2026'
const SESSION_KEY = 'tanq-lab-auth'

export default function TesterPage() {
  const router = useRouter()
  const [name, setName]   = useState('')
  const [pin, setPin]     = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === TESTER_PIN && name.trim()) {
      localStorage.setItem(SESSION_KEY, 'tester')
      localStorage.setItem('tanq-tester-name', name.trim())
      router.push('/lab')
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d2248] text-[#e8f0fe] font-sans flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00e5c3] opacity-10 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#c4a8ff] opacity-8 blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[#00e5c3] opacity-20 blur-3xl rounded-full scale-150" />
            <Image src="/tanquu/happy.png" alt="TANQuu" width={90} height={90} className="relative z-10 drop-shadow-[0_0_30px_rgba(0,229,195,0.4)]" />
          </div>
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-[#00e5c3] to-[#c4a8ff] bg-clip-text text-transparent">テスター入口</h1>
          <p className="text-[#94a3c4] text-sm">お名前とテスターコードを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className={`bg-white/5 border border-white/15 rounded-2xl p-8 space-y-4 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
          <div>
            <label className="block text-xs text-[#94a3c4] font-bold uppercase tracking-wider mb-2">お名前（ニックネームでOK）</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(false) }}
              placeholder="例：たろう"
              autoFocus
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[#e8f0fe] text-lg font-bold outline-none focus:border-[#00e5c3] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#94a3c4] font-bold uppercase tracking-wider mb-2">テスターコード（4桁）</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false) }}
              placeholder="○○○○"
              maxLength={4}
              inputMode="numeric"
              className={`w-full bg-white/8 border rounded-xl px-4 py-3 text-[#e8f0fe] text-center text-2xl tracking-widest font-black outline-none focus:border-[#00e5c3] transition-colors ${error ? 'border-[#f87171]/60' : 'border-white/15'}`}
              required
            />
            {error && <p className="text-[#f87171] text-xs text-center mt-2">お名前またはコードが正しくありません</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-black text-[#050b14] text-base mt-2"
            style={{ background: 'linear-gradient(135deg, #00e5c3, #c4a8ff)' }}
          >
            テスターとして入る →
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/lab" className="text-[#94a3c4] text-sm hover:text-[#c4a8ff]">← ラボに戻る</a>
        </p>
      </div>

      <style jsx>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  )
}
