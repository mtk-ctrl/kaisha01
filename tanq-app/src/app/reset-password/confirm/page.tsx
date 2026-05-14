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
    if (!code) { setError('リンクが無効です。もう一度パスワードリセットを行ってください。'); return }
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
      setTimeout(() => router.push('/register'), 3000)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-corp-teal opacity-20 blur-3xl rounded-full scale-150" />
          <Image src="/tanquu/happy.png" alt="TANQuu" width={100} height={100} className="relative z-10 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]" />
        </div>
        <h1 className="text-3xl font-black mb-2">新しいパスワードを設定</h1>
        <p className="text-corp-muted text-sm">8文字以上のパスワードを入力してください</p>
      </div>

      {done ? (
        <div className="glass-card-bright rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-black mb-3 text-corp-teal">パスワードを更新しました！</h2>
          <p className="text-corp-muted text-sm">3秒後にログインページへ移動します…</p>
        </div>
      ) : error && !ready ? (
        <div className="glass-card-bright rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <Link href="/reset-password" className="px-8 py-3 rounded-full btn-glow-teal font-bold">
            もう一度リセットする
          </Link>
        </div>
      ) : !ready ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-corp-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card-bright rounded-3xl p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                新しいパスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="8文字以上"
                className="corp-input"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-xs text-corp-muted font-semibold uppercase tracking-wider mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(null) }}
                placeholder="もう一度入力"
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
              {loading ? '更新中...' : 'パスワードを更新する'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function ResetPasswordConfirmPage() {
  return (
    <div className="min-h-screen bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-20 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-10 blur-[110px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-corp-teal border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ConfirmForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
