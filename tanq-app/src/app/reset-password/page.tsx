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

  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-corp-teal opacity-20 blur-3xl rounded-full scale-150" />
              <Image src="/tanquu/sad.png" alt="TANQuu" width={100} height={100} className="relative z-10 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]" />
            </div>
            <h1 className="text-3xl font-black mb-2">パスワードをリセット</h1>
            <p className="text-corp-muted text-sm">登録したメールアドレスにリセットリンクを送ります</p>
          </div>

          {sent ? (
            <div className="glass-card-bright rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-black mb-3 text-corp-teal">メールを送信しました！</h2>
              <p className="text-corp-muted text-sm leading-relaxed mb-6">
                <strong className="text-corp-text">{email}</strong> にリセットリンクを送りました。<br />
                メールが届かない場合は迷惑メールフォルダを確認してください。
              </p>
              <Link href="/register" className="text-corp-teal text-sm hover:underline">← ログインページへ戻る</Link>
            </div>
          ) : (
            <div className="glass-card-bright rounded-3xl p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                    保護者のメールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    placeholder="parent@example.com"
                    className="corp-input"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center py-2 px-4 rounded-xl bg-red-400/10 border border-red-400/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full btn-glow-teal text-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? '送信中...' : 'リセットメールを送る'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <Link href="/register" className="text-corp-muted text-sm hover:text-corp-teal transition-colors">
                  ← ログインページへ戻る
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
