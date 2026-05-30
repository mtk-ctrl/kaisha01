'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type AppStat = { appId: string; label: string; sessions: number; questions: number; accuracy: number }
type Report = {
  generatedAt: string
  thisWeek: { questions: number; sessions: number; activeDays: number }
  lastWeek: { questions: number; sessions: number }
  deltaQuestions: number
  apps: AppStat[]
}

type Status = 'loading' | 'guest' | 'ready' | 'error'

export default function ReportPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem('tanq-lab-auth')
    if (auth !== 'member') {
      setStatus('guest')
      return
    }
    fetch('/api/report')
      .then(res => {
        if (res.status === 401) { setStatus('guest'); return null }
        if (!res.ok) { setStatus('error'); return null }
        return res.json()
      })
      .then(data => {
        if (data) { setReport(data); setStatus('ready') }
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: '#FFF6E5',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,42,0.06) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="px-4 pt-6 pb-4 max-w-xl mx-auto">
        <Link href="/lab" className="inline-flex items-center gap-1 text-sm font-bold mb-4" style={{ color: '#6B5A52' }}>
          ← ラボにもどる
        </Link>

        <div className="rounded-[26px] p-5 mb-5"
          style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '6px 6px 0 0 #3A2E2A' }}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <h1 className="font-black text-2xl leading-tight" style={{ color: '#3A2E2A', fontFamily: 'var(--font-zen)' }}>
                保護者レポート
              </h1>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#6B5A52' }}>
                お子さまの今週のがんばりと、先週からの伸び
              </p>
            </div>
          </div>
        </div>

        {status === 'loading' && (
          <p className="text-center text-sm font-bold py-12" style={{ color: '#6B5A52' }}>読み込み中…</p>
        )}

        {status === 'guest' && (
          <div className="rounded-[22px] p-6 text-center"
            style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
            <p className="text-3xl mb-2">🔐</p>
            <p className="font-black text-sm mb-1" style={{ color: '#3A2E2A' }}>保護者レポートはログインが必要です</p>
            <p className="text-xs mb-4" style={{ color: '#6B5A52' }}>
              ログインすると、お子さまの学習の記録がここに表示されます。
            </p>
            <Link href="/login" className="inline-block rounded-full px-5 py-2 text-sm font-black"
              style={{ background: '#FF6F9C', color: '#FFFFFF', border: '2px solid #3A2E2A' }}>
              ログイン
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-[22px] p-6 text-center"
            style={{ background: '#FFFFFF', border: '3px solid #3A2E2A' }}>
            <p className="text-3xl mb-2">😢</p>
            <p className="font-black text-sm" style={{ color: '#3A2E2A' }}>レポートを読み込めませんでした</p>
            <p className="text-xs mt-1" style={{ color: '#6B5A52' }}>時間をおいて、もう一度お試しください。</p>
          </div>
        )}

        {status === 'ready' && report && <ReportBody report={report} />}
      </div>
    </div>
  )
}

function ReportBody({ report }: { report: Report }) {
  const { thisWeek, deltaQuestions, apps } = report
  const noActivity = thisWeek.questions === 0 && report.lastWeek.questions === 0

  if (noActivity) {
    return (
      <div className="rounded-[22px] p-6 text-center"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <p className="text-3xl mb-2">🌱</p>
        <p className="font-black text-sm mb-1" style={{ color: '#3A2E2A' }}>まだ今週の記録がありません</p>
        <p className="text-xs" style={{ color: '#6B5A52' }}>
          アプリで遊ぶと、ここに学習のようすが表示されます。
        </p>
      </div>
    )
  }

  const deltaPositive = deltaQuestions > 0
  const deltaZero = deltaQuestions === 0

  return (
    <div className="space-y-4">
      {/* 今週のサマリー */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard bg="#EFE8FF" emoji="✏️" label="今週解いた問題" value={`${thisWeek.questions}問`} />
        <SummaryCard bg="#DFF6CF" emoji="📅" label="学習した日数" value={`${thisWeek.activeDays}日`} />
        <SummaryCard bg="#FFE3EE" emoji="🎯" label="取り組み回数" value={`${thisWeek.sessions}回`} />
      </div>

      {/* 先週比 */}
      <div className="rounded-[22px] p-5"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <p className="text-xs font-black mb-2" style={{ color: '#6B5A52' }}>先週とくらべて</p>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{deltaPositive ? '📈' : deltaZero ? '➡️' : '📉'}</span>
          <div>
            <p className="font-black text-lg leading-tight" style={{ color: deltaPositive ? '#2BA39A' : '#3A2E2A' }}>
              {deltaPositive ? `+${deltaQuestions}問 増えました！` : deltaZero ? '先週と同じペースです' : `${deltaQuestions}問`}
            </p>
            <p className="text-[11px] font-bold" style={{ color: '#6B5A52' }}>
              先週: {report.lastWeek.questions}問 → 今週: {thisWeek.questions}問
            </p>
          </div>
        </div>
        {deltaPositive && (
          <p className="text-[11px] font-bold mt-2 rounded-xl px-3 py-2" style={{ background: '#DBF6F0', color: '#2BA39A' }}>
            たくさんがんばっています。ぜひ「すごいね！」と声をかけてあげてください。
          </p>
        )}
      </div>

      {/* アプリ別 今週の活動 */}
      <div className="rounded-[22px] p-5"
        style={{ background: '#FFFFFF', border: '3px solid #3A2E2A', boxShadow: '4px 4px 0 0 #3A2E2A' }}>
        <p className="text-xs font-black mb-3" style={{ color: '#6B5A52' }}>今週よく取り組んだアプリ</p>
        {apps.length === 0 ? (
          <p className="text-xs" style={{ color: '#6B5A52' }}>今週はまだ記録がありません。</p>
        ) : (
          <div className="space-y-2.5">
            {apps.map(a => (
              <div key={a.appId} className="flex items-center justify-between gap-2">
                <span className="font-black text-sm" style={{ color: '#3A2E2A' }}>{a.label}</span>
                <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: '#6B5A52' }}>
                  {a.questions}問・正答{a.accuracy}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] font-bold" style={{ color: '#B0A49C' }}>
        ※ ログインして遊んだ記録をもとに集計しています（直近2週間）
      </p>
    </div>
  )
}

function SummaryCard({ bg, emoji, label, value }: { bg: string; emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-[20px] p-3 text-center"
      style={{ background: bg, border: '2.5px solid #3A2E2A', boxShadow: '3px 3px 0 0 #3A2E2A' }}>
      <div className="text-2xl mb-0.5">{emoji}</div>
      <div className="font-black text-base leading-none" style={{ color: '#3A2E2A' }}>{value}</div>
      <div className="text-[9px] font-bold mt-1 leading-tight" style={{ color: '#6B5A52' }}>{label}</div>
    </div>
  )
}
