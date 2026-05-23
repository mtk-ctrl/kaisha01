'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: 'var(--cream)' }}>
      <Navbar />

      <main className="pt-20 pb-24 px-4 flex flex-col items-center">

        {/* ── Page Header ── */}
        <div className="text-center mt-10 mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest"
            style={{
              background: 'var(--lav-bg)',
              border: '2.5px solid var(--ink)',
              boxShadow: 'var(--shadow-soft)',
              color: 'var(--ink)',
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z"
                fill="#B197FC" stroke="#3A2E2A" strokeWidth="1.2" />
            </svg>
            TESTERS
          </div>

          <Image
            src="/tanquu/happy.png"
            alt="タンキュー"
            width={120}
            height={120}
            unoptimized
            className="mx-auto mb-4 drop-shadow-md"
          />

          <h1
            className="text-4xl font-black mb-3"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
          >
            テスター <span style={{ color: 'var(--pink)' }}>入口</span>
          </h1>
          <p className="text-base font-bold leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            招待を受けた方は、お名前と コードで 入場できます。<br />
            すべての アプリ・全レベルが かいほうされます！
          </p>
        </div>

        {/* ── Main Form Card ── */}
        <div
          className={`card-sticker w-full max-w-md p-8 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
          style={{ background: 'var(--lav-bg)' }}
        >
          <h2
            className="text-2xl font-black text-center mb-1"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
          >
            テスターとして 入場
          </h2>
          <p className="text-sm font-bold text-center mb-6" style={{ color: 'var(--ink-soft)' }}>
            招待メールに 記載されている<br />
            コードを 入力してください
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-black mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
              >
                お名前 / ニックネーム<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(false) }}
                placeholder="例: たんきゅう"
                autoFocus
                required
                className="sticker-input w-full px-4 py-3 text-base font-bold outline-none focus:translate-x-0 placeholder:font-normal"
                style={{ color: 'var(--ink)' }}
              />
            </div>

            {/* PIN */}
            <div>
              <label
                className="block text-sm font-black mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
              >
                テスターコード<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false) }}
                placeholder="例: 2026"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                className="sticker-input w-full px-4 py-3 text-center text-xl font-black outline-none"
                style={{
                  color: 'var(--ink)',
                  letterSpacing: '0.2em',
                  fontFamily: "'Fredoka', monospace",
                  borderColor: error ? 'var(--pink)' : undefined,
                  boxShadow: error ? '3px 3px 0 0 var(--pink)' : undefined,
                }}
              />
              {error && (
                <p className="text-sm font-bold text-center mt-2" style={{ color: 'var(--pink)' }}>
                  お名前またはコードが正しくありません
                </p>
              )}
            </div>

            {/* Hint box */}
            <div
              className="flex gap-3 items-start rounded-xl p-4"
              style={{
                background: '#FFFFFF',
                border: '2.5px solid var(--ink)',
                borderRadius: '14px',
                boxShadow: '2px 2px 0 0 var(--ink)',
              }}
            >
              <span className="text-xl leading-none mt-0.5">💡</span>
              <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--ink)' }}>
                テスターの方は、登録なしで すべてのアプリと テスト機能をお試しいただけます。
                フィードバックは{' '}
                <Link href="/contact" className="font-black underline" style={{ color: 'var(--ink)' }}>
                  おといあわせ
                </Link>{' '}
                から送ってね！
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-sticker btn-yellow w-full py-4 text-base font-black"
              style={{ fontFamily: 'var(--font-zen)' }}
            >
              入る →
            </button>
          </form>
        </div>

        {/* ── Hint Card (mint bg) ── */}
        <div
          className="card-sticker w-full max-w-md mt-6 px-6 py-5 flex items-center gap-3"
          style={{ background: 'var(--mint-bg)' }}
        >
          <span className="text-2xl">💬</span>
          <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--ink)' }}>
            フィードバックは{' '}
            <Link href="/contact" className="font-black underline" style={{ color: 'var(--ink)' }}>
              おといあわせ
            </Link>{' '}
            から送ってね！
          </p>
        </div>

        {/* ── Fallback Card ── */}
        <div
          className="card-sticker w-full max-w-md mt-4 px-6 py-5 text-center"
          style={{ background: 'var(--cream-deep)' }}
        >
          <p className="text-sm font-black mb-3" style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>
            テスターコードをお持ちでない方
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="btn-sticker btn-white px-5 py-2 text-sm font-black"
            >
              登録する
            </Link>
            <Link
              href="/lab?trial=1"
              className="btn-sticker btn-white px-5 py-2 text-sm font-black"
            >
              体験だけする
            </Link>
          </div>
        </div>

      </main>

      <Footer />

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
