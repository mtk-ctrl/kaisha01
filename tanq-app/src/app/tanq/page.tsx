import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'TANQストーリー — TANQ',
  description: 'タンキューといっしょに、科学のふしぎをストーリーでさがしにいく。クイズにこたえて、アイテムをぜんぶあつめよう！',
}

/* ── Static data ── */

const UNITS = [
  {
    num: 'UNIT 01',
    emoji: '🌱',
    title: '光と影のひみつ',
    desc: 'たねの中にはなにがあるの？ 水と日光がなぜひつよう？',
    done: 5,
    bg: '#DBF6F0',
    rot: '-1deg',
    href: '/lab',
  },
  {
    num: 'UNIT 02',
    emoji: '☁️',
    title: '水のへんしん',
    desc: '水はどこへいくの？ 雲や雨との関係を探ろう。',
    done: 3,
    bg: '#FFE3EE',
    rot: '0.9deg',
    href: '/lab',
  },
  {
    num: 'UNIT 03',
    emoji: '🧲',
    title: 'じしゃくのふしぎ',
    desc: 'くっつくものとくっつかないもの。なぜ？の謎にせまる。',
    done: 1,
    bg: '#EFE8FF',
    rot: '-1.3deg',
    href: '/lab',
  },
  {
    num: 'UNIT 04',
    emoji: '💨',
    title: '空気のはたらき',
    desc: '目にみえない空気が、こんなにすごいちからをもっていた！',
    done: 0,
    bg: '#FFF6E5',
    rot: '1.1deg',
    href: '/lab',
  },
  {
    num: 'UNIT 05',
    emoji: '🦋',
    title: '生きものとかんきょう',
    desc: '生きものはなぜそこにすんでいるの？ 環境との深いつながり。',
    done: 0,
    bg: '#DBF6F0',
    rot: '-0.7deg',
    href: '/lab',
  },
]

function StarSVG({ fill, size = 16 }: { fill: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill={fill} stroke="#3A2E2A" strokeWidth="1.2"/>
    </svg>
  )
}

function ProgressDots({ done }: { done: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.75rem' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 10, height: 10,
            borderRadius: '50%',
            background: i < done ? '#4ECDC4' : '#D6CFC8',
            border: '2px solid #3A2E2A',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function TanqPage() {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--ink)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ════════ SUBHERO ════════ */}
      <section style={{
        background: 'var(--lav-bg)',
        position: 'relative', zIndex: 1,
        padding: '6rem 1.5rem 4rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* decorative */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '8%', left: '5%', opacity: 0.45 }}><StarSVG fill="#B197FC" size={36} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '20%', right: '6%', opacity: 0.4 }}><StarSVG fill="#FFC83D" size={28} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '6%', left: '10%', opacity: 0.35 }}>
          <svg viewBox="0 0 24 24" width={28} height={28}><path d="M12 4.5c-2 -3 -8 -2 -8 3 c0 5 8 10 8 10 s8 -5 8 -10 c0 -5 -6 -6 -8 -3 z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>

        <div className="animate-float-sticker" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
          <Image src="/tanquu/surprised.png" alt="タンキュー" width={200} height={200} unoptimized />
        </div>

        <div style={{ display: 'block', fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
          <StarSVG fill="#B197FC" size={16} />
          <span style={{ verticalAlign: 'middle', marginLeft: 4 }}>TANQ STORY</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 56px)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
          ふしぎを <span style={{ color: 'var(--pink)' }}>ぼうけん</span> しよう
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, maxWidth: '30em', margin: '0 auto' }}>
          タンキューといっしょに、<ruby>科学<rt>かがく</rt></ruby>のふしぎをストーリーでさがしにいく。<br/>
          クイズにこたえて、アイテムをぜんぶあつめよう！
        </p>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 34px)', color: 'var(--ink)', textAlign: 'center', marginBottom: '2.5rem' }}>
            あそびかた
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem' }}>
            {/* Step 1 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 220px', maxWidth: 280, textAlign: 'center', transform: 'rotate(-1deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 42, color: '#FFC83D', lineHeight: 1 }}>01</div>
              <div style={{ margin: '0.75rem 0' }}>
                <svg viewBox="0 0 80 80" width={60} height={60} style={{ display: 'inline-block' }}>
                  <rect x="15" y="14" width="50" height="52" rx="6" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="3.5"/>
                  <path d="M40 14 V 66" stroke="#3A2E2A" strokeWidth="3.5"/>
                  <path d="M22 28 L 32 28 M22 36 L 32 36 M22 44 L 32 44 M48 28 L 58 28 M48 36 L 58 36" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, color: 'var(--ink)', marginBottom: '0.75rem' }}>
                ストーリーを よむ
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                タンキューがでてくるおはなしをぽちっぽちっとよみすすめる。音声つきだから字がよめなくてもOK！
              </p>
            </div>

            {/* arrow */}
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4rem', opacity: 0.6 }}>
              <svg viewBox="0 0 120 60" width={80} height={40} aria-hidden="true">
                <path d="M10 30 Q 50 5, 90 30 T 110 30" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round"/>
                <path d="M100 22 L 112 30 L 100 38" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 220px', maxWidth: 280, textAlign: 'center', transform: 'rotate(0.8deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 42, color: '#FF6F9C', lineHeight: 1 }}>02</div>
              <div style={{ margin: '0.75rem 0' }}>
                <svg viewBox="0 0 80 80" width={60} height={60} style={{ display: 'inline-block' }}>
                  <circle cx="40" cy="40" r="28" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="3.5"/>
                  <text x="40" y="52" textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize="34" fill="#FFFFFF">?</text>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, color: 'var(--ink)', marginBottom: '0.75rem' }}>
                クイズに こたえる
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                おはなしのとちゅうで、ふしぎがでてくる！4たくクイズにこたえて先へすすもう。まちがえてもなんどもちょうせんOK。
              </p>
            </div>

            {/* arrow */}
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4rem', opacity: 0.6 }}>
              <svg viewBox="0 0 120 60" width={80} height={40} aria-hidden="true">
                <path d="M10 30 Q 50 55, 90 30 T 110 30" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round"/>
                <path d="M100 22 L 112 30 L 100 38" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 220px', maxWidth: 280, textAlign: 'center', transform: 'rotate(-0.9deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 42, color: '#4ECDC4', lineHeight: 1 }}>03</div>
              <div style={{ margin: '0.75rem 0' }}>
                <svg viewBox="0 0 80 80" width={60} height={60} style={{ display: 'inline-block' }}>
                  <rect x="14" y="18" width="52" height="44" rx="6" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="3.5"/>
                  <circle cx="28" cy="38" r="6" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="2.5"/>
                  <circle cx="42" cy="38" r="6" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="2.5"/>
                  <circle cx="56" cy="38" r="6" fill="#B197FC" stroke="#3A2E2A" strokeWidth="2.5"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, color: 'var(--ink)', marginBottom: '0.75rem' }}>
                アイテムを あつめる
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                Unitをクリアするたびに、ひみつのアイテムがもらえる！コレクションボックスでみんなのアイテムをみよう。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STORY UNITS ════════ */}
      <section style={{ background: 'var(--mint-bg)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem 5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              <StarSVG fill="#FFC83D" size={16} />
              SEASON 1
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--ink)' }}>
              5つの <span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2px solid #3A2E2A' }}>ふしぎ ストーリー</span>
            </h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--ink-soft)', fontSize: 15 }}>
              毎週すこしずつ、ふしぎをときあかしていこう。
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {UNITS.map((unit) => (
              <Link
                key={unit.num}
                href={unit.href}
                className="card-sticker"
                style={{
                  background: unit.bg,
                  borderRadius: 'var(--radius-card)',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  display: 'block',
                  transform: `rotate(${unit.rot})`,
                }}
              >
                <span style={{
                  display: 'inline-block',
                  background: '#3A2E2A', color: '#FFF6E5',
                  fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-fredoka)',
                  padding: '2px 10px', borderRadius: 9999,
                  marginBottom: '0.75rem',
                }}>
                  {unit.num}
                </span>
                <div style={{ fontSize: 44, marginBottom: '0.5rem' }}>{unit.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                  {unit.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>{unit.desc}</p>
                <ProgressDots done={unit.done} />
              </Link>
            ))}

            {/* Coming soon card */}
            <div
              style={{
                background: '#F0EFEC',
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
                border: '3px solid #3A2E2A',
                boxShadow: '4px 4px 0 0 #3A2E2A',
                transform: 'rotate(0.4deg)',
                opacity: 0.65,
              }}
            >
              <span style={{
                display: 'inline-block',
                background: '#6B5A52', color: '#FFF6E5',
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-fredoka)',
                padding: '2px 10px', borderRadius: 9999,
                marginBottom: '0.75rem',
              }}>
                UNIT 06+
              </span>
              <div style={{ fontSize: 44, marginBottom: '0.5rem' }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                もうすぐ 公開！
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>
                Season 2が もうすぐ スタート。<br/>たのしみに まっててね！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem 5rem' }}>
        <div className="max-w-2xl mx-auto">
          <div
            className="card-sticker"
            style={{
              background: 'var(--cream-deep)',
              borderRadius: 'var(--radius-card)',
              padding: '3rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* corner decos */}
            <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: -10 }}>
              <svg viewBox="0 0 60 60" width={52} height={52}><path d="M30 5l6 18h19l-15 11 6 18-16-11-16 11 6-18-15-11h19z" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="3" strokeLinejoin="round"/></svg>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', top: -8, right: -8 }}>
              <svg viewBox="0 0 60 60" width={48} height={48}><path d="M30 8C20 -2 0 4 0 22 c0 18 30 32 30 32 s30 -14 30 -32 c0 -18 -20 -24 -30 -14z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="3"/></svg>
            </div>

            <span style={{ fontFamily: 'var(--font-hachi)', fontSize: 15, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.5rem' }}>
              いまはじめよう
            </span>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: 'var(--ink)', marginBottom: '1rem', lineHeight: 1.2 }}>
              タンキューと <span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2.5px solid #3A2E2A' }}>ぼうけん</span> しよう！
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '2rem' }}>
              Unit 1はとうろくなしですぐあそべるよ。<br/>
              つづきがきになったら、むりょうとうろくしてね。
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
              <Link
                href="/lab"
                className="btn-sticker btn-yellow"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, padding: '13px 30px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <span>Unit 1をためす</span>
                <svg viewBox="0 0 24 24" width={16} height={16}><path d="M5 12h14M13 6l6 6-6 6" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </Link>
              <Link
                href="/register"
                className="btn-sticker btn-white"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 16, padding: '13px 30px', textDecoration: 'none' }}
              >
                むりょうとうろく
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
