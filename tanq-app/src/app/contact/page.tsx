'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SUBJECTS = [
  'TANQ Appについて',
  'ご利用料金・プランについて',
  '学校・教育機関向けのご相談',
  '取材・メディアのお問い合わせ',
  '採用について',
  'その他',
]

const CONTACT_INFO = [
  { icon: '📍', label: '所在地', value: '福岡県福岡市中央区' },
  { icon: '✉️', label: 'メール', value: 'contact@tanq.jp' },
  { icon: '🕐', label: '対応時間', value: '平日 10:00〜18:00' },
  { icon: '🌐', label: 'アプリURL', value: 'tanq.jp' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    name:    '',
    email:   '',
    subject: '',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-8 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      <main className="relative z-10 min-h-screen px-6 py-32">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Contact</p>
            <h1 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-gradient">お問い合わせ</span>
            </h1>
            <p className="text-corp-muted text-lg max-w-xl mx-auto leading-relaxed">
              TANQに関するご質問・ご相談は、下記フォームよりお気軽にどうぞ。
              通常2営業日以内にご回答いたします。
            </p>
          </div>

          {submitted ? (
            /* ── Success ── */
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-corp-teal opacity-20 blur-3xl rounded-full scale-150" />
                <Image
                  src="/tanquu/happy.png"
                  alt="TANQuu"
                  width={160}
                  height={160}
                  className="relative z-10 drop-shadow-[0_0_40px_rgba(0,229,195,0.5)] animate-float"
                />
              </div>
              <h2 className="text-3xl font-black mb-4 text-gradient">送信完了！</h2>
              <p className="text-corp-muted text-lg mb-8 leading-relaxed">
                お問い合わせありがとうございます。<br />
                2営業日以内にご返信いたします。
              </p>
              <Link href="/" className="inline-block px-10 py-4 rounded-full btn-glow-teal text-lg font-bold">
                ホームへ戻る
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-12">

              {/* Left: info panel */}
              <div className="lg:col-span-2 space-y-6">

                {/* Company info card */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-xl font-black mb-6 text-corp-text">TANQ Inc.</h2>
                  <div className="space-y-5">
                    {CONTACT_INFO.map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                        <div>
                          <p className="text-corp-muted text-xs uppercase tracking-wider mb-1 font-semibold">{label}</p>
                          <p className="text-corp-text text-sm font-medium">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mascot card */}
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-corp-lavender opacity-20 blur-2xl rounded-full scale-125" />
                    <Image
                      src="/tanquu/happy.png"
                      alt="TANQuu"
                      width={100}
                      height={100}
                      className="relative z-10 drop-shadow-[0_0_20px_rgba(196,168,255,0.5)]"
                    />
                  </div>
                  <p className="text-corp-muted text-sm leading-relaxed">
                    TANQuu がお問い合わせをお待ちしています。
                    どんな小さなご質問も、お気軽にどうぞ。
                  </p>
                </div>

                {/* Quick links */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-corp-text mb-4">よくあるご質問</h3>
                  <div className="space-y-2">
                    {[
                      '料金はかかりますか？',
                      'どの学年から使えますか？',
                      'スマートフォンでも使えますか？',
                    ].map((q) => (
                      <div key={q} className="flex items-center gap-2 text-sm text-corp-muted hover:text-corp-teal transition-colors cursor-pointer">
                        <span className="text-corp-teal text-xs">→</span>
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div className="lg:col-span-3">
                <div className="glass-card-bright rounded-3xl p-8 lg:p-10">
                  <h2 className="text-2xl font-black mb-8">メッセージを送る</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                          お名前 <span className="text-corp-teal">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="山田 太郎"
                          className="corp-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                          メールアドレス <span className="text-corp-teal">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className="corp-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                        件名 <span className="text-corp-teal">*</span>
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="corp-input"
                        required
                      >
                        <option value="" disabled>お問い合わせの種類を選択</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s} className="bg-[#0a1628]">{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                        メッセージ <span className="text-corp-teal">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="ご質問・ご要望をご記入ください"
                        rows={6}
                        className="corp-input resize-none"
                        required
                        minLength={10}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-full btn-glow-teal text-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          送信中...
                        </span>
                      ) : '送信する →'}
                    </button>

                    <p className="text-center text-xs text-corp-muted leading-relaxed">
                      お送りいただいた情報は
                      <Link href="#" className="text-corp-teal hover:underline mx-1">プライバシーポリシー</Link>
                      に基づいて適切に管理します。
                    </p>
                  </form>
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
