'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAnonClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = getAnonClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password/confirm`,
    })
    setLoading(false)
    if (error) {
      setError('送信に失敗しました。メールアドレスを確認してください。')
    } else {
      setSent(true)
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

      <main className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="inline-block mb-4" style={{ animation: 'floatSticker 5s ease-in-out infinite' }}>
              <Image src="/tanquu/sad.png" alt="タンキュー" width={120} height={120} unoptimized />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-zen)' }}>
              パスワードを<span style={{ color: 'var(--pink)' }}>リセット</span>
            </h1>
            <p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>
              登録したメールアドレスに リセットリンクを送ります
            </p>
          </div>

          {sent ? (
            <div className="text-center p-8 rounded-[22px]"
              style={{ background: '#fff', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-black mb-3" style={{ color: 'var(--mint)', fontFamily: 'var(--font-zen)' }}>
                メールを送信しました！
              </h2>
              <p className="text-sm font-bold leading-relaxed mb-6" style={{ color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>{email}</strong> にリセットリンクを送りました。<br />
                メールが届かない場合は迷惑メールフォルダを確認してください。
              </p>
              <Link href="/login"
                className="btn-sticker btn-yellow inline-block px-6 py-2 text-sm font-black">
                ← ログインページへ
              </Link>
            </div>
          ) : (
            <div className="p-8 rounded-[22px]"
              style={{ background: '#fff', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-black mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>
                    保護者のメールアドレス
                    <span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    placeholder="parent@example.com"
                    className="sticker-input w-full px-4 py-3 text-base outline-none"
                    style={{ color: 'var(--ink)' }}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-sm font-bold text-center py-2 px-4 rounded-xl"
                    style={{ background: '#FFE3EE', border: '2px solid var(--pink)', color: 'var(--pink)' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sticker btn-yellow w-full py-3 text-base font-black disabled:opacity-60"
                  style={{ borderRadius: '9999px' }}
                >
                  {loading ? '送信中...' : 'リセットメールを送る 📨'}
                </button>
              </form>

              <div className="mt-6 pt-5 text-center"
                style={{ borderTop: '2px dashed rgba(58,46,42,0.15)' }}>
                <Link href="/login"
                  className="text-sm font-bold hover:underline"
                  style={{ color: 'var(--ink-soft)' }}>
                  ← ログインへ戻る
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
