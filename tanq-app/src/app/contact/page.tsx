'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SUBJECTS = [
  'アプリについて',
  '料金・支払いについて',
  'テスターについて',
  'TANQ Appについて',
  'ご利用料金・プランについて',
  '学校・教育機関向けのご相談',
  '取材・メディアのお問い合わせ',
  '採用について',
  'その他',
]

const CONTACT_INFO = [
  { icon: '📧', label: 'メール',    value: 'contact@tanq.jp' },
  { icon: '📍', label: '場所',      value: '福岡県福岡市' },
  { icon: '⏰', label: '対応時間', value: '平日 9:00〜18:00' },
  { icon: '💬', label: 'FAQ',       value: 'よくある質問はFAQをご確認ください' },
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1200)
  }

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: 'var(--cream)' }}>
      <Navbar />

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Page kicker ── */}
          <div className="text-center mt-10 mb-12">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest"
              style={{
                background: 'var(--mint-bg)',
                border: '2.5px solid var(--ink)',
                boxShadow: 'var(--shadow-soft)',
                color: 'var(--ink)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z"
                  fill="#4ECDC4"
                  stroke="#3A2E2A"
                  strokeWidth="1.2"
                />
              </svg>
              CONTACT
            </div>
          </div>

          {submitted ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center py-12">
              <Image
                src="/tanquu/happy.png"
                alt="タンキュー"
                width={180}
                height={180}
                unoptimized
                className="mb-6 drop-shadow-md"
              />
              <h2
                className="text-4xl font-black mb-4"
                style={{ color: 'var(--pink)', fontFamily: 'var(--font-zen)' }}
              >
                送信しました！🎉
              </h2>
              <p
                className="text-base font-bold leading-relaxed mb-8 max-w-sm"
                style={{ color: 'var(--ink-soft)' }}
              >
                お問い合わせありがとうございます。<br />
                2営業日以内にご返信いたします。
              </p>
              <Link
                href="/"
                className="btn-sticker btn-yellow px-8 py-3 text-base font-black"
                style={{ fontFamily: 'var(--font-zen)' }}
              >
                ホームへ戻る →
              </Link>
            </div>
          ) : (
            /* ── Normal: 2-column layout ── */
            <div className="grid md:grid-cols-2 gap-8 items-start">

              {/* ── LEFT COLUMN ── */}
              <div className="space-y-6">
                {/* Heading + mascot */}
                <div className="text-center md:text-left">
                  <h1
                    className="text-4xl font-black mb-4"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                  >
                    <ruby>お問<rt>といあわ</rt></ruby>い合わせ
                  </h1>
                  <Image
                    src="/tanquu/surprised.png"
                    alt="タンキュー"
                    width={150}
                    height={150}
                    unoptimized
                    className="mx-auto md:mx-0 drop-shadow-md mb-4"
                  />
                  <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    TANQに関するご質問・ご相談は<br />
                    お気軽にどうぞ。通常{' '}
                    <strong style={{ color: 'var(--ink)' }}>2営業日以内</strong>{' '}
                    にご回答いたします。
                  </p>
                </div>

                {/* Contact info cards */}
                <div className="space-y-3">
                  {CONTACT_INFO.map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="card-sticker flex items-start gap-4 px-5 py-4"
                      style={{ background: '#FFFFFF' }}
                    >
                      <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-0.5"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          {label}
                        </p>
                        <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ card */}
                <div
                  className="card-sticker px-6 py-5"
                  style={{ background: '#FFF1B8', transform: 'rotate(0.6deg)' }}
                >
                  <p
                    className="text-sm font-black mb-2"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                  >
                    💬 よくある質問
                  </p>
                  <p className="text-xs font-semibold leading-relaxed mb-3" style={{ color: 'var(--ink-soft)' }}>
                    料金や使い方の質問は<br />FAQページもご覧ください。
                  </p>
                  <Link
                    href="/pricing#faq"
                    className="btn-sticker btn-white px-4 py-2 text-xs font-black inline-block"
                  >
                    まずはよくある質問を見る →
                  </Link>
                </div>
              </div>

              {/* ── RIGHT COLUMN: Form ── */}
              <div
                className="card-sticker p-7 md:p-8"
                style={{ background: '#FFFFFF' }}
              >
                <h2
                  className="text-2xl font-black mb-1"
                  style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                >
                  メッセージを送る
                </h2>
                <p className="text-sm font-bold mb-6" style={{ color: 'var(--ink-soft)' }}>
                  下記フォームに ご入力ください
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label
                      className="block text-sm font-black mb-2"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                    >
                      お名前<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="山田 太郎"
                      required
                      className="sticker-input w-full px-4 py-3 text-base font-bold outline-none placeholder:font-normal"
                      style={{ color: 'var(--ink)' }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-black mb-2"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                    >
                      メールアドレス<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="sticker-input w-full px-4 py-3 text-base font-bold outline-none placeholder:font-normal"
                      style={{ color: 'var(--ink)' }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      className="block text-sm font-black mb-2"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                    >
                      お問い合わせ種類<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="sticker-input w-full px-4 py-3 text-base font-bold outline-none"
                      style={{ color: form.subject ? 'var(--ink)' : 'var(--ink-soft)', background: 'white' }}
                    >
                      <option value="" disabled style={{ color: 'var(--ink-soft)' }}>
                        えらんでください
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ color: 'var(--ink)' }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block text-sm font-black mb-2"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}
                    >
                      メッセージ<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="ご質問・ご相談内容をお書きください..."
                      required
                      minLength={10}
                      rows={6}
                      className="sticker-input w-full px-4 py-3 text-base font-bold outline-none resize-none placeholder:font-normal"
                      style={{ color: 'var(--ink)', minHeight: '150px' }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-sticker btn-yellow w-full py-4 text-base font-black disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-zen)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        送信中...
                      </span>
                    ) : (
                      '送信する →'
                    )}
                  </button>

                  <p className="text-center text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
                    2営業日以内にご返信いたします
                  </p>
                </form>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
