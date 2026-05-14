'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getAnonClient } from '@/lib/supabase'

const APPS = ['理科のはなし', '漢字', '計算', '英語', '時計', '図形', 'プログラミング', 'まだ遊んでいない']
const AGAIN = ['ぜひ使いたい！', 'まあ使ってもいい', '正直微妙…'] as const

export default function FeedbackPage() {
  const [fav, setFav]       = useState('')
  const [quit, setQuit]     = useState<'なかった' | 'あった' | ''>('')
  const [quitNote, setQuitNote] = useState('')
  const [again, setAgain]   = useState('')
  const [memo, setMemo]     = useState('')
  const [grade, setGrade]   = useState('')
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const canSubmit = fav && quit && again

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const supabase = getAnonClient()
      const { error: dbErr } = await supabase.from('feedback').insert({
        fav_app:    fav,
        quit_note:  quit === 'あった' ? quitNote || 'あった（詳細なし）' : 'なかった',
        again,
        memo,
        grade,
      })
      if (dbErr) throw dbErr
      setDone(true)
    } catch {
      setError('送信に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0d1f44] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <Image src="/tanquu/happy.png" alt="TANQuu" width={120} height={120} className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]" />
          <h1 className="text-3xl font-black text-white mb-3">ありがとう！！</h1>
          <p className="text-[#94a3c4] leading-relaxed">
            みんなの感想がTANQをもっと楽しくするよ。<br />
            また使ってみてね🎉
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1f44] text-white font-sans px-6 py-12">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Image src="/tanquu/happy.png" alt="TANQuu" width={80} height={80} className="mx-auto mb-4 drop-shadow-[0_0_20px_rgba(196,168,255,0.5)]" />
          <h1 className="text-2xl font-black mb-2">TANQの感想を教えて！</h1>
          <p className="text-[#94a3c4] text-sm">3問だけ！1分で終わるよ😊</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Q0 学年（任意） */}
          <div>
            <p className="font-bold mb-3 text-[#c4a8ff] text-sm uppercase tracking-wide">学年（任意）</p>
            <div className="flex flex-wrap gap-2">
              {['小1','小2','小3','小4','小5','小6','中学生','おとな'].map(g => (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  className="px-4 py-2 rounded-full text-sm font-bold border transition-all"
                  style={grade === g
                    ? { background: '#c4a8ff', color: '#0d1f44', borderColor: '#c4a8ff' }
                    : { background: 'transparent', color: '#94a3c4', borderColor: '#ffffff20' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Q1 */}
          <div>
            <p className="font-black mb-1">① どのアプリが一番たのしかった？</p>
            <p className="text-[#94a3c4] text-xs mb-3">※ひとつだけえらんでね</p>
            <div className="grid grid-cols-2 gap-2">
              {APPS.map(a => (
                <button key={a} type="button" onClick={() => setFav(a)}
                  className="py-3 px-4 rounded-2xl text-sm font-bold border transition-all text-left"
                  style={fav === a
                    ? { background: '#00e5c320', borderColor: '#00e5c3', color: '#00e5c3' }
                    : { background: '#ffffff08', borderColor: '#ffffff15', color: '#94a3c4' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <p className="font-black mb-1">② とちゅうでやめたくなった？</p>
            <div className="flex gap-3 mb-3">
              {(['なかった', 'あった'] as const).map(v => (
                <button key={v} type="button" onClick={() => setQuit(v)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all"
                  style={quit === v
                    ? { background: '#f0c04020', borderColor: '#f0c040', color: '#f0c040' }
                    : { background: '#ffffff08', borderColor: '#ffffff15', color: '#94a3c4' }}>
                  {v}
                </button>
              ))}
            </div>
            {quit === 'あった' && (
              <textarea
                value={quitNote}
                onChange={e => setQuitNote(e.target.value)}
                placeholder="どのばめんでやめたくなった？（教えてくれると助かる！）"
                rows={2}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3c4] outline-none focus:border-[#c4a8ff] resize-none transition-colors"
              />
            )}
          </div>

          {/* Q3 */}
          <div>
            <p className="font-black mb-3">③ またつかいたい？</p>
            <div className="space-y-2">
              {AGAIN.map(v => (
                <button key={v} type="button" onClick={() => setAgain(v)}
                  className="w-full py-3 px-4 rounded-2xl text-sm font-bold border transition-all text-left"
                  style={again === v
                    ? { background: '#c4a8ff20', borderColor: '#c4a8ff', color: '#c4a8ff' }
                    : { background: '#ffffff08', borderColor: '#ffffff15', color: '#94a3c4' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 自由記述 */}
          <div>
            <p className="font-black mb-2">なんでも一言！（任意）</p>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="おもしろかった、むずかしかった、こうしてほしい…なんでもOK！"
              rows={3}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3c4] outline-none focus:border-[#c4a8ff] resize-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center py-2 px-4 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>
          )}

          <button type="submit" disabled={!canSubmit || loading}
            className="w-full py-4 rounded-full text-lg font-black text-[#050b14] transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #00e5c3, #c4a8ff)', boxShadow: canSubmit ? '0 0 30px rgba(0,229,195,0.3)' : 'none' }}>
            {loading ? '送信中...' : '送信する 🎉'}
          </button>

          <p className="text-center text-[#94a3c4] text-xs">
            個人情報は収集しません。感想だけ教えてね！
          </p>
        </form>
      </div>
    </div>
  )
}
