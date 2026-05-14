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
  { id: 'spark',  label: 'Spark Mode',  emoji: '✨', desc: '遊び感覚で科学を発見',     color: '#f0c040' },
  { id: 'deep',   label: 'Deep Mode',   emoji: '🔬', desc: '本格的な科学的思考力',     color: '#00e5c3' },
  { id: 'wonder', label: 'Wonder Mode', emoji: '🌟', desc: 'はじめての探究体験',       color: '#c4a8ff' },
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

  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-5xl">

          {submitted ? (
            /* ── Success ── */
            <div className="text-center py-20">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-corp-teal opacity-20 blur-3xl rounded-full scale-150" />
                <Image src="/tanquu/happy.png" alt="TANQuu" width={180} height={180} className="relative z-10 drop-shadow-[0_0_40px_rgba(0,229,195,0.5)] animate-float" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-gradient">登録完了！</h2>
              <p className="text-corp-muted text-lg mb-8 max-w-md mx-auto leading-relaxed">
                TANQへようこそ！アプリラボで全アプリを遊んでみよう。
              </p>
              <Link href="/lab" className="inline-block px-10 py-4 rounded-full btn-glow-teal text-lg font-bold">
                アプリラボに入る 🔑
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left: mascot + copy */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-corp-lavender opacity-20 blur-3xl rounded-full scale-125 animate-glow-pulse" />
                  <Image
                    src="/tanquu/happy.png"
                    alt="TANQuu"
                    width={240}
                    height={240}
                    className="relative z-10 animate-float drop-shadow-[0_0_40px_rgba(196,168,255,0.5)]"
                  />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black mb-5 leading-tight">
                  <span className="text-gradient">探究の旅へ、</span>
                  <br />
                  <span className="text-white">ようこそ。</span>
                </h1>
                <p className="text-corp-muted leading-relaxed text-lg mb-6">
                  無料で登録して、TANQuu と一緒に「考える喜び」を体験しましょう。
                </p>
                <div className="space-y-3">
                  {['完全無料でスタート', 'お子さんの学年に合わせた体験', 'いつでも退会可能'].map((item) => (
                    <div key={item} className="flex items-center gap-3 justify-center lg:justify-start">
                      <span className="w-5 h-5 rounded-full bg-corp-teal/20 flex items-center justify-center text-corp-teal text-xs flex-shrink-0">✓</span>
                      <span className="text-corp-muted text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div className="glass-card-bright rounded-3xl p-8 lg:p-10">
                <h2 className="text-2xl font-black mb-8">
                  アカウントを作成
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Parent email */}
                  <div>
                    <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                      保護者のメールアドレス
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={form.parentEmail}
                      onChange={handleChange}
                      placeholder="parent@example.com"
                      className="corp-input"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider">
                        パスワード
                      </label>
                      <Link href="/reset-password" className="text-xs text-corp-teal hover:underline">
                        パスワードを忘れた方
                      </Link>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="8文字以上"
                      className="corp-input"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Child name + grade */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                        お子さんのお名前
                      </label>
                      <input
                        type="text"
                        name="childName"
                        value={form.childName}
                        onChange={handleChange}
                        placeholder="例：さくら"
                        className="corp-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                        学年
                      </label>
                      <select
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        className="corp-input"
                        required
                      >
                        <option value="" disabled>選択</option>
                        {GRADES.map((g) => (
                          <option key={g} value={g} className="bg-[#0a1628]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mode selection */}
                  <div>
                    <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-3">
                      興味のあるモード
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {MODES.map((mode) => (
                        <button
                          type="button"
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={`rounded-xl p-3 text-center border transition-all duration-200 ${
                            selectedMode === mode.id
                              ? 'border-opacity-60 bg-opacity-10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          style={
                            selectedMode === mode.id
                              ? { borderColor: mode.color, backgroundColor: `${mode.color}15` }
                              : {}
                          }
                        >
                          <div className="text-2xl mb-1">{mode.emoji}</div>
                          <div className="text-xs font-bold" style={{ color: selectedMode === mode.id ? mode.color : '#8892b0' }}>
                            {mode.label}
                          </div>
                          <div className="text-[10px] text-corp-muted mt-0.5">{mode.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* API error */}
                  {apiError && (
                    <p className="text-red-400 text-sm text-center py-2 px-4 rounded-xl bg-red-400/10 border border-red-400/20">
                      {apiError}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full btn-glow-teal text-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        登録中...
                      </span>
                    ) : '無料で始める →'}
                  </button>

                  <p className="text-center text-xs text-corp-muted leading-relaxed">
                    登録することで
                    <Link href="#" className="text-corp-teal hover:underline mx-1">利用規約</Link>
                    および
                    <Link href="#" className="text-corp-teal hover:underline mx-1">プライバシーポリシー</Link>
                    に同意したことになります。
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="text-corp-muted text-sm">
                    すでにアカウントをお持ちの方は
                    <Link href="/tanq" className="text-corp-teal hover:underline ml-1">こちら</Link>
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
