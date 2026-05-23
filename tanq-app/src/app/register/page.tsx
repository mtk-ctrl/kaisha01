'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const GRADES = [
  '小学1年生', '小学2年生', '小学3年生', '小学4年生',
  '小学5年生', '小学6年生', '中学1年生', '中学2年生',
  '中学3年生', '高校1年生', '高校2年生', '高校3年生',
]

const MODES = [
  { id: 'spark',  label: 'Spark Mode',  emoji: '✨', desc: '遊び感覚で科学を発見',     color: '#FFC83D', bg: '#FFF1B8' },
  { id: 'deep',   label: 'Deep Mode',   emoji: '🔬', desc: '本格的な科学的思考力',     color: '#4ECDC4', bg: '#DBF6F0' },
  { id: 'wonder', label: 'Wonder Mode', emoji: '🌟', desc: 'はじめての探究体験',       color: '#B197FC', bg: '#EFE8FF' },
]

export default function RegisterPage() {
  const [selectedMode, setSelectedMode] = useState<string>('')
  const [submitted,    setSubmitted]    = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [apiError,     setApiError]     = useState<string | null>(null)
  const [form, setForm] = useState({
    parentEmail:  '',
    password:     '',
    childName:    '',
    grade:        '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setApiError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.parentEmail,
          password: form.password,
          childName: form.childName,
          grade: form.grade,
          mode: selectedMode || 'spark',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.error ?? '登録に失敗しました'); return }
      setSubmitted(true)
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
        style={{ background: 'radial-gradient(ellipse 900px 400px at 50% -10%, rgba(255,224,156,0.55), transparent 60%)' }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs tracking-widest mb-4"
          style={{ background: '#FFFFFF', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A', letterSpacing: '0.15em' }}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
            <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="1.2"/>
          </svg>
          SIGN UP
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight" style={{ fontFamily: 'var(--font-zen)' }}>
          30びょうで{' '}
          <span style={{ background: 'linear-gradient(transparent 65%, #FFE39A 65%)', padding: '0 4px' }}>スタート</span>
          ！
        </h1>
        <p className="text-base font-bold leading-relaxed" style={{ color: '#6B5A52', maxWidth: 480, margin: '0 auto' }}>
          メールアドレスだけで かんたん とうろく。<br />
          ぜんアプリ 14日間 むりょうで ためせます。
        </p>
      </section>

      <main className="px-4 pb-24 pt-2">
        <div className="w-full max-w-lg mx-auto">

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center py-16">
              <div className="mb-6 inline-block" style={{ animation: 'float 5s ease-in-out infinite' }}>
                <Image src="/tanquu/happy.png" alt="タンキュー" width={160} height={160} unoptimized />
              </div>
              <div className="rounded-[28px] p-8 text-center"
                style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
                <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'var(--font-zen)' }}>🎉 登録完了！</h2>
                <p className="text-sm font-bold mb-6 leading-relaxed" style={{ color: '#6B5A52' }}>
                  TANQへようこそ！アプリラボで全アプリを遊んでみよう。
                </p>
                <Link href="/lab"
                  className="inline-block px-10 py-4 rounded-full font-black text-lg transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ background: '#FFC83D', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A', color: '#3A2E2A', textDecoration: 'none' }}>
                  アプリラボに入る 🔑
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Season 1 free banner */}
              <div className="rounded-[22px] px-5 py-4 mb-5 flex items-center gap-4"
                style={{
                  background: '#FFF1B8',
                  border: '3px solid #3A2E2A',
                  boxShadow: '3px 3px 0 0 #3A2E2A',
                  transform: 'rotate(-0.5deg)',
                }}>
                <div className="text-3xl flex-shrink-0">🎁</div>
                <div>
                  <p className="font-black text-sm mb-0.5" style={{ color: '#3A2E2A' }}>いま とうろくすると</p>
                  <p className="text-xs font-bold leading-relaxed" style={{ color: '#6B5A52' }}>
                    TANQ ストーリー Season 1 が{' '}
                    <strong style={{ color: '#FF6F9C' }}>むりょう</strong>
                    に！<br />
                    さんすう・かんじ・えいご... ぜんぶ あそべます。
                  </p>
                </div>
              </div>

              {/* Form card */}
              <div className="rounded-[32px] px-8 py-10 relative"
                style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
                {/* Decorative dot */}
                <div className="absolute -top-3.5 right-8 w-7 h-7 rounded-full"
                  style={{ background: '#FFC83D', border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }} />

                {/* Mascot */}
                <div className="text-center -mt-20 mb-2">
                  <div style={{ display: 'inline-block', animation: 'float 5s ease-in-out infinite' }}>
                    <Image src="/tanquu/happy.png" alt="タンキュー" width={100} height={100} unoptimized />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-center mb-2" style={{ fontFamily: 'var(--font-zen)' }}>むりょう とうろく</h2>
                <p className="text-sm text-center font-bold mb-6 leading-relaxed" style={{ color: '#6B5A52' }}>
                  ぜんアプリ 14日間 ためし放題。<br />
                  クレジットカード <strong style={{ color: '#3A2E2A' }}>不要</strong>。
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Child name */}
                  <div>
                    <label className="block text-xs font-black mb-1.5" style={{ color: '#3A2E2A' }}>
                      おなまえ（ニックネームOK）<span style={{ color: '#FF6F9C' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={form.childName}
                      onChange={handleChange}
                      placeholder="たんきゅう"
                      required
                      className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                      style={{
                        background: '#FFF6E5',
                        border: '2.5px solid #3A2E2A',
                        boxShadow: '2px 2px 0 0 #3A2E2A',
                        color: '#3A2E2A',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-black mb-1.5" style={{ color: '#3A2E2A' }}>
                      メールアドレス<span style={{ color: '#FF6F9C' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={form.parentEmail}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                      style={{
                        background: '#FFF6E5',
                        border: '2.5px solid #3A2E2A',
                        boxShadow: '2px 2px 0 0 #3A2E2A',
                        color: '#3A2E2A',
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-black mb-1.5" style={{ color: '#3A2E2A' }}>
                      パスワード<span style={{ color: '#FF6F9C' }}>*</span>{' '}
                      <span className="font-bold text-[10px]" style={{ color: '#6B5A52' }}>（8文字以上）</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                      style={{
                        background: '#FFF6E5',
                        border: '2.5px solid #3A2E2A',
                        boxShadow: '2px 2px 0 0 #3A2E2A',
                        color: '#3A2E2A',
                      }}
                    />
                  </div>

                  {/* Grade select */}
                  <div>
                    <label className="block text-xs font-black mb-1.5" style={{ color: '#3A2E2A' }}>
                      学年
                    </label>
                    <select
                      name="grade"
                      value={form.grade}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all"
                      style={{
                        background: '#FFF6E5',
                        border: '2.5px solid #3A2E2A',
                        boxShadow: '2px 2px 0 0 #3A2E2A',
                        color: form.grade ? '#3A2E2A' : '#6B5A52',
                      }}
                    >
                      <option value="" disabled>学年を選択</option>
                      <option value="幼児">ようじ</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mode selection */}
                  <div>
                    <label className="block text-xs font-black mb-2" style={{ color: '#3A2E2A' }}>
                      興味のあるモード
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {MODES.map((mode) => (
                        <button
                          type="button"
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className="rounded-2xl p-3 text-center transition-all hover:-translate-y-0.5"
                          style={selectedMode === mode.id
                            ? { background: mode.bg, border: `2.5px solid #3A2E2A`, boxShadow: '3px 3px 0 0 #3A2E2A' }
                            : { background: '#FFF6E5', border: '2px solid #3A2E2A' }}>
                          <div className="text-2xl mb-1">{mode.emoji}</div>
                          <div className="text-[10px] font-black" style={{ color: selectedMode === mode.id ? '#3A2E2A' : '#6B5A52' }}>
                            {mode.label}
                          </div>
                          <div className="text-[9px] font-bold mt-0.5" style={{ color: '#6B5A52' }}>{mode.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-bold leading-relaxed" style={{ color: '#6B5A52' }}>
                      <Link href="/terms" className="font-black hover:underline" style={{ color: '#3A2E2A' }}>利用規約</Link>
                      {' '}と{' '}
                      <Link href="/privacy" className="font-black hover:underline" style={{ color: '#3A2E2A' }}>プライバシーポリシー</Link>
                      {' '}に同意します
                    </span>
                  </label>

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
                        登録中...
                      </span>
                    ) : '🚀 むりょうで はじめる'}
                  </button>
                </form>

                {/* Trust badges */}
                <div className="flex justify-center flex-wrap gap-3 mt-5">
                  {[
                    { icon: '🚫', label: '広告なし' },
                    { icon: '✓', label: 'いつでも解約OK' },
                    { icon: '🔒', label: 'SSL暗号化' },
                  ].map(({ icon, label }) => (
                    <span key={label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                      style={{ background: '#DBF6F0', border: '2px solid #3A2E2A', color: '#3A2E2A' }}>
                      <span>{icon}</span>{label}
                    </span>
                  ))}
                </div>

                {/* Bottom links */}
                <p className="text-center text-xs font-bold mt-5" style={{ color: '#6B5A52' }}>
                  すでに アカウントを お持ちの方は{' '}
                  <Link href="/login" className="font-black hover:underline" style={{ color: '#3A2E2A' }}>ログイン</Link>
                </p>
                <p className="text-center text-xs font-bold mt-2" style={{ color: '#6B5A52' }}>
                  まず試したい方は{' '}
                  <Link href="/lab?trial=1" className="font-black hover:underline" style={{ color: '#4ECDC4' }}>登録なしで体験 →</Link>
                </p>
              </div>
            </>
          )}
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
