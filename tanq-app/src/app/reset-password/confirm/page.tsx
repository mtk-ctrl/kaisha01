'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAnonClient } from '@/lib/supabase'

function ConfirmForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError('リンクが無効です。もう一度パスワードリセットを行ってください。')
      return
    }
    const supabase = getAnonClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setError('リンクの有効期限が切れています。もう一度パスワードリセットを行ってください。')
      else setReady(true)
    })
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('パスワードが一致しません'); return }
    if (password.length < 8) { setError('パスワードは8文字以上にしてください'); return }
    setLoading(true)
    setError(null)
    const supabase = getAnonClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('パスワードの更新に失敗しました。もう一度お試しください。')
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '3px solid #3A2E2A',
    boxShadow: '6px 6px 0 0 #3A2E2A',
    borderRadius: '22px',
    padding: '2rem',
  }

  if (done) return (
    <div style={cardStyle} className="text-center w-full max-w-md">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-xl font-black mb-3" style={{ color: 'var(--mint)', fontFamily: 'var(--font-zen)' }}>
        パスワードを更新しました！
      </h2>
      <p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>
        3秒後にログインページへ移動します…
      </p>
    </div>
  )

  if (error && !ready) return (
    <div style={cardStyle} className="text-center w-full max-w-md">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-sm font-bold mb-6" style={{ color: 'var(--pink)' }}>{error}</p>
      <Link href="/reset-password" className="btn-sticker btn-yellow px-6 py-2 text-sm font-black"
        style={{ borderRadius: '9999px' }}>
        もう一度リセットする
      </Link>
    </div>
  )

  if (!ready) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 rounded-full animate-spin"
        style={{ border: '3px solid #3A2E2A', borderTopColor: '#FFC83D' }} />
    </div>
  )

  return (
    <div style={cardStyle} className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-black mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>
            新しいパスワード<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null) }}
            placeholder="8文字以上"
            className="sticker-input w-full px-4 py-3 text-base outline-none"
            required
            minLength={8}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-black mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>
            パスワード（確認）<span className="ml-1" style={{ color: 'var(--pink)' }}>*</span>
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(null) }}
            placeholder="もう一度入力"
            className="sticker-input w-full px-4 py-3 text-base outline-none"
            required
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
          {loading ? '更新中...' : 'パスワードを更新する ✓'}
        </button>
      </form>

      <div className="mt-6 pt-5 text-center"
        style={{ borderTop: '2px dashed rgba(58,46,42,0.15)' }}>
        <Link href="/login" className="text-sm font-bold hover:underline" style={{ color: 'var(--ink-soft)' }}>
          ← ログインへ戻る
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordConfirmPage() {
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
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-32 gap-8">
        <div className="text-center">
          <div className="inline-block mb-4" style={{ animation: 'floatSticker 5s ease-in-out infinite' }}>
            <Image src="/tanquu/happy.png" alt="タンキュー" width={120} height={120} unoptimized />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-zen)' }}>
            新しいパスワードを<span style={{ color: 'var(--pink)' }}>設定</span>
          </h1>
          <p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>
            8文字以上のパスワードを入力してください
          </p>
        </div>
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full animate-spin"
              style={{ border: '3px solid #3A2E2A', borderTopColor: '#FFC83D' }} />
          </div>
        }>
          <ConfirmForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
