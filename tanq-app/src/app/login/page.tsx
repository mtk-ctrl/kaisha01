'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setApiError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error ?? 'ログインに失敗しました')
        return
      }
      localStorage.setItem('tanq-lab-auth', 'member')
      router.push('/lab')
    } catch {
      setApiError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const pageStyle: React.CSSProperties = {
    background: '#FFF6E5',
    backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
    backgroundSize: '22px 22px',
    color: '#3A2E2A',
    minHeight: '100vh',
  }

  return (
    <div className="font-sans overflow-x-hidden" style={pageStyle}>
      <Navbar />

      {/* Subhero */}
      <section className="text-center px-6 py-14 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 900px 400px at 50% -10%, rgba(78,205,196,0.22), transparent 60%)' }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs tracking-widest mb-4"
          style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', letterSpacing: '0.15em' }}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
            <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="1.2"/>
          </svg>
          LOG IN
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight" style={{ fontFamily: 'var(--font-zen)' }}>
          おかえりなさい！{' '}
          <span style={{ display: 'inline-block', transform: 'rotate(-8deg)' }}>👋</span>
        </h1>
        <p className="text-base font-bold leading-relaxed" style={{ color: '#6B5A52', maxWidth: 480, margin: '0 auto' }}>
          つづきから あそぼう。<br />
          メールと パスワードで ログイン してね。
        </p>
      </section>

      <main className="px-4 pb-24 pt-2">
        <div className="w-full max-w-lg mx-auto">

          {/* Login form card */}
          <div className="rounded-[32px] px-8 py-10 relative mb-6"
            style={{ background: '#FFF1B8', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
            {/* Decorative dot */}
            <div className="absolute -top-3.5 right-8 w-7 h-7 rounded-full"
              style={{ background: '#FF6F9C', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }} />

            {/* Mascot */}
            <div className="text-center -mt-20 mb-2">
              <div style={{ display: 'inline-block', animation: 'float 5s ease-in-out infinite' }}>
                <Image src="/tanquu/mischievous.png" alt="タンキュー" width={100} height={100} unoptimized />
              </div>
            </div>

            <h2 className="text-2xl font-black text-center mb-1" style={{ fontFamily: 'var(--font-zen)' }}>ログイン</h2>
            <p className="text-sm text-center font-bold mb-6" style={{ color: '#6B5A52' }}>
              アカウントを お持ちの方はこちら
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-black mb-1.5" style={{ color: '#3A2E2A' }}>
                  メールアドレス<span style={{ color: '#FF6F9C' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '2.5px solid #3A2E2A',
                    boxShadow: '2px 2px 0 0 #3A2E2A',
                    color: '#3A2E2A',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black" style={{ color: '#3A2E2A' }}>
                    パスワード<span style={{ color: '#FF6F9C' }}>*</span>
                  </label>
                  <Link href="/reset-password"
                    className="text-[11px] font-bold hover:underline"
                    style={{ color: '#6B5A52', textDecorationColor: '#4ECDC4' }}>
                    パスワードを わすれた方
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '2.5px solid #3A2E2A',
                    boxShadow: '2px 2px 0 0 #3A2E2A',
                    color: '#3A2E2A',
                  }}
                />
              </div>

              {/* API error */}
              {apiError && (
                <div className="rounded-2xl px-4 py-3 text-sm font-bold text-center"
                  style={{ background: '#FFE3EE', border: '2.5px solid #FF6F9C', color: '#FF6F9C' }}>
                  {apiError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full font-black text-lg transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A', color: '#3A2E2A' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    ログイン中...
                  </span>
                ) : '🚪 ログインする'}
              </button>
            </form>

            {/* Bottom link */}
            <p className="text-center text-xs font-bold mt-5" style={{ color: '#6B5A52' }}>
              まだ アカウントが ない方は{' '}
              <Link href="/register" className="font-black hover:underline" style={{ color: '#3A2E2A' }}>
                むりょう とうろく
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="text-center mb-5">
            <span className="text-xs font-black tracking-widest" style={{ color: '#6B5A52' }}>
              ─── または ───
            </span>
          </div>

          {/* Alternative entry cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Trial card */}
            <Link href="/lab?trial=1"
              className="rounded-[22px] p-5 flex items-center gap-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: '#EFE8FF',
                border: '3px solid #3A2E2A',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                textDecoration: 'none',
                color: '#3A2E2A',
              }}>
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <div className="font-black text-sm mb-0.5" style={{ color: '#3A2E2A' }}>
                  とりあえず体験する
                </div>
                <div className="text-[11px] font-bold" style={{ color: '#6B5A52' }}>
                  登録なしで すぐ あそぶ
                </div>
              </div>
            </Link>

            {/* Tester card */}
            <Link href="/tester"
              className="rounded-[22px] p-5 flex items-center gap-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: '#FFE3EE',
                border: '3px solid #3A2E2A',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                textDecoration: 'none',
                color: '#3A2E2A',
              }}>
              <div className="text-3xl flex-shrink-0">🧪</div>
              <div>
                <div className="font-black text-sm mb-0.5" style={{ color: '#3A2E2A' }}>
                  テスター入口
                </div>
                <div className="text-[11px] font-bold" style={{ color: '#6B5A52' }}>
                  招待コードを お持ちの方
                </div>
              </div>
            </Link>
          </div>

        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  )
}
