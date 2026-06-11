'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ── Static data ── */

const FREE_FEATURES = [
  '計算チャレンジ（全レベル・無制限）',
  '漢字マスター（小1〜小6 1026字）',
  'かんがえる力ジム（思考力）',
  '算数文章題・九九・都道府県など',
  '就学前アプリ 全8本',
]

const FREE_DISABLED = [
  'TANQ理科（ストーリー型学習）',
  '中学受験 理科・英語ボキャブラリー',
  '時計・慣用句・四字熟語・図形など',
]

const PREMIUM_FEATURES = [
  '全25本のアプリ完全解放',
  'TANQ理科（ストーリー型・全Unit）',
  '理科・英語・時計・図形・プログラミング',
  '慣用句・四字熟語・国語〈ことば〉',
  '中学受験 算数（特殊算・順次公開）',
  '学習バッジ・進捗記録（無制限）',
]

const FAQ_ITEMS = [
  {
    q: '現在はどういう状態ですか？',
    a: 'TANQは現在テスト中（招待制）です。全アプリが無料でご利用いただけます。料金プランは近日公開予定です。ご登録はメールアドレスだけで完了します。',
  },
  {
    q: '子どもがアプリの中で課金してしまわない？',
    a: 'ご安心ください。アプリ内に課金導線は一切ありません。広告もなく、お子さまが誤って課金することはありません。',
  },
  {
    q: 'スマホでも使えますか？',
    a: 'はい。スマホ・タブレット・PCのブラウザ全てに対応しています。アプリのインストールは不要です。',
  },
  {
    q: 'データはどのくらい保存されますか？',
    a: '登録ユーザーは漢字・英語などの学習状況がアカウントに紐付けて記録されます。未登録のゲスト体験はお使いの端末のみに保存されます。',
  },
]

function StarSVG({ fill, size = 16 }: { fill: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill={fill} stroke="#3A2E2A" strokeWidth="1.2"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, borderRadius: '50%',
      background: '#4ECDC4', border: '2px solid #3A2E2A',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" width={12} height={12}>
        <path d="M5 12l5 5 9-11" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function CrossIcon() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, borderRadius: '50%',
      background: '#E0D8D0', border: '2px solid #3A2E2A',
      flexShrink: 0,
      opacity: 0.5,
    }}>
      <span style={{ fontSize: 10, fontWeight: 900, color: '#3A2E2A', lineHeight: 1 }}>✕</span>
    </span>
  )
}

export default function PricingPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIdx(prev => prev === i ? null : i)

  return (
    <div style={{ background: 'var(--cream)', color: 'var(--ink)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ════════ SUBHERO ════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem 3rem', textAlign: 'center', background: 'var(--lav-bg)', overflow: 'hidden' }}>
        {/* decorative stars */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.5 }}><StarSVG fill="#FFC83D" size={32} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '15%', right: '6%', opacity: 0.4 }}><StarSVG fill="#FF6F9C" size={24} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '8%', left: '8%', opacity: 0.35 }}><StarSVG fill="#4ECDC4" size={28} /></div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Image src="/tanquu/happy.png" alt="タンキュー" width={120} height={120} unoptimized />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '1rem' }}>
          <StarSVG fill="#FFC83D" size={16} />
          PRICING
        </div>
        <h1 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 52px)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
          シンプルな <span style={{ color: 'var(--pink)' }}>りょうきん</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '28em', margin: '0 auto 1.25rem' }}>
          まずは <strong>むりょう</strong> でたいけん。<br/>
          きにいったら登録するだけ — 今なら全アプリ無料。
        </p>
        <div style={{
          display: 'inline-block',
          background: '#FFF1B8',
          border: '2.5px solid #3A2E2A',
          borderRadius: 9999,
          padding: '6px 20px',
          fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 13,
          color: 'var(--ink)',
          boxShadow: '3px 3px 0 0 #3A2E2A',
        }}>
          🧪 テスト公開中 — 料金プランは近日リリース予定
        </div>
      </section>

      {/* ════════ PLAN CARDS ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

          {/* FREE plan */}
          <div
            className="card-sticker"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              padding: '2rem',
              transform: 'rotate(-0.8deg)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 24, color: 'var(--ink)', marginBottom: '0.25rem' }}>むりょう</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: '1.25rem' }}>ためしてみたい人に</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 52, color: 'var(--ink)', lineHeight: 1 }}>¥0</span>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flex: 1 }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-zen)' }}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
              {FREE_DISABLED.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 14, color: 'var(--ink-soft)', opacity: 0.5, textDecoration: 'line-through', fontFamily: 'var(--font-zen)' }}>
                  <CrossIcon />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="btn-sticker btn-white"
              style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, padding: '12px 20px', textDecoration: 'none' }}
            >
              むりょうで はじめる →
            </Link>
          </div>

          {/* PREMIUM plan */}
          <div
            className="card-sticker"
            style={{
              background: 'var(--lav-bg)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem',
              transform: 'rotate(0.7deg)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '3.5px solid #3A2E2A',
            }}
          >
            {/* Badge */}
            <div style={{
              position: 'absolute', top: -16, right: 24,
              background: '#FFC83D',
              border: '3px solid #3A2E2A',
              borderRadius: 9999,
              padding: '4px 16px',
              fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 14,
              color: 'var(--ink)',
              boxShadow: '3px 3px 0 0 #3A2E2A',
            }}>
              おすすめ ⭐
            </div>

            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 24, color: 'var(--ink)', marginBottom: '0.25rem' }}>TANQ Premium</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: '1.25rem' }}>毎日たくさんあそびたい人に</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>準備中</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: '1rem' }}>今はテスト中のため全機能無料でご利用いただけます</p>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flex: 1 }}>
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-zen)', fontWeight: f.startsWith('ぜんアプリ') ? 700 : 400 }}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="btn-sticker btn-yellow"
              style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, padding: '12px 20px', textDecoration: 'none' }}
            >
              むりょう登録で全部使う →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ B2B ════════ */}
      <section style={{ background: 'var(--mint-bg)', position: 'relative', zIndex: 1, padding: '3rem 1.5rem' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="card-sticker"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: '0.75rem' }}>🏫</div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--ink)', marginBottom: '0.75rem' }}>
              がっこう・じゅく・学童むけ
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '32em', margin: '0 auto 1.75rem' }}>
              学校・塾・学童での導入についてはお気軽にご相談ください。<br/>
              スクールプランの詳細は準備中です。まずはお問い合わせください。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
              <Link
                href="/contact"
                className="btn-sticker btn-yellow"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 15, padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span>スクールプランを聞く</span>
                <svg viewBox="0 0 24 24" width={16} height={16}><path d="M5 12h14M13 6l6 6-6 6" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </Link>
              <Link
                href="/contact"
                className="btn-sticker btn-white"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 15, padding: '12px 28px', textDecoration: 'none' }}
              >
                資料を請求する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem 5rem' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              <StarSVG fill="#4ECDC4" size={16} />
              FAQ
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--ink)' }}>
              よくある しつもん
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="card-sticker"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  transform: i % 2 === 0 ? 'rotate(-0.4deg)' : 'rotate(0.3deg)',
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={openIdx === i}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none',
                    padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', flex: 1, lineHeight: 1.5 }}>
                    {item.q}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28,
                    border: '2.5px solid #3A2E2A',
                    borderRadius: '50%',
                    fontWeight: 900, fontSize: 18, color: 'var(--ink)',
                    background: openIdx === i ? '#FFC83D' : 'transparent',
                    transition: 'background 0.2s',
                    lineHeight: 1,
                  }}>
                    {openIdx === i ? '−' : '+'}
                  </span>
                </button>
                {openIdx === i && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem',
                    fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8,
                    borderTop: '2px solid var(--cream-deep)',
                    paddingTop: '1rem',
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
