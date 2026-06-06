import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'TANQ — まなびのファンタジーラボ',
  description: 'あそびながら、かしこくなる。小学生向け学習アプリが25本以上そろった探究ラボ。登録なしですぐ体験できる。',
}

/* ── Static data ── */

const APPS = [
  { emoji: '🧩', name: 'かんがえるちからジム',  target: '小4〜小6', badge: '100問',    bg: '#FFE3EE', rot: '-1deg',  href: '/apps/thinking' },
  { emoji: '📖', name: 'かんじマスター',         target: '小1〜小6', badge: '1026字',   bg: '#DBF6F0', rot: '1.5deg', href: '/apps/kanji' },
  { emoji: '🌍', name: 'えいごボキャブラリー',   target: '小3〜小6', badge: '275語',    bg: '#FFF6E5', rot: '-0.8deg', href: '/apps/english' },
  { emoji: '🔢', name: 'けいさんチャレンジ',     target: '小2〜小6', badge: '∞もん',    bg: '#EFE8FF', rot: '1.2deg', href: '/apps/math' },
  { emoji: '📐', name: 'さんすうぶんしょうだい', target: '小1〜小3', badge: '立式',     bg: '#FFE3EE', rot: '-1.5deg', href: '/apps/word-math' },
  { emoji: '💻', name: 'プログラミング',         target: '小3〜小6', badge: '5ステージ', bg: '#DBF6F0', rot: '0.8deg', href: '/apps/coding' },
  { emoji: '🕐', name: 'とけい・じかんけいさん', target: '小2〜小4', badge: '分・時',   bg: '#EFE8FF', rot: '-1deg',  href: '/apps/clock' },
  { emoji: '✖️', name: 'くくマスター',           target: '小2〜小4', badge: '2〜9段',   bg: '#FFF6E5', rot: '1.3deg', href: '/apps/kuku' },
]

const HOW_STEPS = [
  {
    num: '01',
    color: '#FFC83D',
    icon: (
      <svg viewBox="0 0 80 80" width={60} height={60}>
        <rect x="15" y="32" width="50" height="38" rx="4" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="3.5"/>
        <path d="M25 32 V 22 a 15 15 0 0 1 30 0 V 32" fill="none" stroke="#3A2E2A" strokeWidth="3.5"/>
        <circle cx="40" cy="50" r="5" fill="#3A2E2A"/>
      </svg>
    ),
    title: 'とうろくなしで すぐあそぶ',
    desc: '「やってみる」ボタンをぽちっと。かんがえるちからジム・かんじ・けいさんなどが、とうろくしなくてもあそべるよ。',
  },
  {
    num: '02',
    color: '#FF6F9C',
    icon: (
      <svg viewBox="0 0 80 80" width={60} height={60}>
        <rect x="14" y="18" width="52" height="44" rx="6" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="3.5"/>
        <path d="M14 28 L 40 46 L 66 28" fill="none" stroke="#3A2E2A" strokeWidth="3"/>
        <circle cx="60" cy="60" r="10" fill="#FFFFFF" stroke="#3A2E2A" strokeWidth="2.5"/>
        <path d="M55 60 L 59 64 L 65 56" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'きにいったら むりょうとうろく',
    desc: 'メールアドレスだけで30びょうとうろく。ぜんぶのアプリ・ぜんレベルがひらいて、すすみぐあいがずっとのこるよ。',
  },
  {
    num: '03',
    color: '#4ECDC4',
    icon: (
      <svg viewBox="0 0 80 80" width={60} height={60}>
        <path d="M40 8 l 8 22 l 24 2 l -18 16 l 6 24 l -20 -12 l -20 12 l 6 -24 l -18 -16 l 24 -2 z" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="3.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'まいにちつづけて レベルアップ',
    desc: 'バッジをあつめながら、すこしずつすすめる。れんぞくがくしゅう・SRSで、むりなくちからがついていくよ。',
  },
]

const TARGET_KIDS = [
  { emoji: '🧩', text: 'さんすうのぶんしょうだいで、しきがえらべない', href: '/lab?trial=1' },
  { emoji: '📖', text: 'かんじがなかなかおぼえられない',               href: '/lab?trial=1' },
  { emoji: '💭', text: 'かんがえるちからをのばしたい',                 href: '/lab?trial=1' },
  { emoji: '🌍', text: 'えいたんごをふやしたい',                       href: '/lab?trial=1' },
  { emoji: '⏰', text: 'とけいのよみかたがにがて',                     href: '/lab?trial=1' },
  { emoji: '💻', text: 'プログラミングにきょうみがある',               href: '/lab?trial=1' },
]

const VALUES = [
  { icon: '🌱', name: 'Curiosity First', jp: '好奇心を 殺さない', desc: '正解を急がせず、考える楽しさを大切に。', bg: '#DBF6F0', rot: '-1deg' },
  { icon: '💎', name: 'Honest Impact',   jp: '誠実な えいきょう', desc: '子どものためになることだけをやる。',       bg: '#FFE3EE', rot: '1.5deg' },
  { icon: '⚡', name: 'Simplicity',      jp: 'シンプルに',        desc: '子どもが一人で使いこなせるUIを。',          bg: '#EFE8FF', rot: '-0.7deg' },
  { icon: '🌳', name: 'Long Game',       jp: '長期 してん',       desc: '一生使える思考力と学習習慣を育てる。',      bg: '#FFF6E5', rot: '1.2deg' },
]

const COMPANY_INFO = [
  ['社名',     'TANQ Inc.（タンク）'],
  ['設立',     '2026年5月'],
  ['所在地',   '福岡県福岡市'],
  ['事業内容', '小学生向け 教育テクノロジー'],
  ['ミッション','AIで考える喜びをすべての子どもに'],
]

const STATS = [
  { num: '25', sub: '+', label: 'アプリ' },
  { num: '1026', sub: '字', label: 'かんじ' },
  { num: '50', sub: 'こ+', label: 'バッジ' },
  { num: '5', sub: 'ふん', label: '1日のめやす' },
]

/* ── Star SVG ── */
function StarSVG({ fill, size = 24 }: { fill: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill={fill} stroke="#3A2E2A" strokeWidth="1.2"/>
    </svg>
  )
}

/* ── Cloud SVG ── */
function CloudSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 60" aria-hidden="true" style={{ display: 'block' }}>
      <ellipse cx="30" cy="40" rx="22" ry="18" fill="#FFFFFF" stroke="#3A2E2A" strokeWidth="2.5"/>
      <ellipse cx="60" cy="30" rx="28" ry="22" fill="#FFFFFF" stroke="#3A2E2A" strokeWidth="2.5"/>
      <ellipse cx="90" cy="40" rx="22" ry="18" fill="#FFFFFF" stroke="#3A2E2A" strokeWidth="2.5"/>
      <ellipse cx="60" cy="42" rx="40" ry="16" fill="#FFFFFF"/>
    </svg>
  )
}

/* ── Arrow SVG ── */
function ArrowRight() {
  return (
    <svg viewBox="0 0 120 60" width={80} height={40} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M10 30 Q 50 5, 90 30 T 110 30" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round"/>
      <path d="M100 22 L 112 30 L 100 38" fill="none" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Page ── */

export default function HomePage() {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--ink)', overflowX: 'hidden' }}>
      {/* Sky decoration */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', left: '5%', opacity: 0.18 }}>
          <StarSVG fill="#FFC83D" size={40} />
        </div>
        <div style={{ position: 'absolute', top: '15%', right: '8%', opacity: 0.15 }}>
          <StarSVG fill="#FF6F9C" size={32} />
        </div>
        <div style={{ position: 'absolute', top: '35%', left: '2%', opacity: 0.12 }}>
          <StarSVG fill="#4ECDC4" size={28} />
        </div>
        <div style={{ position: 'absolute', top: '55%', right: '4%', opacity: 0.14 }}>
          <StarSVG fill="#B197FC" size={36} />
        </div>
        <div style={{ position: 'absolute', top: '70%', left: '6%', opacity: 0.13 }}>
          <StarSVG fill="#FFC83D" size={24} />
        </div>
      </div>

      <Navbar />

      {/* ════════ HERO ════════ */}
      <section
        style={{ position: 'relative', zIndex: 1, paddingTop: '7rem', paddingBottom: '4rem', overflow: 'hidden' }}
      >
        {/* Rainbow arch */}
        <svg
          viewBox="0 0 600 300"
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '120%', maxWidth: 800, opacity: 0.18,
            pointerEvents: 'none',
          }}
        >
          <path d="M50 290 A250 250 0 0 1 550 290" fill="none" stroke="#FF6F9C" strokeWidth="22"/>
          <path d="M82 290 A218 218 0 0 1 518 290" fill="none" stroke="#FFC83D" strokeWidth="22"/>
          <path d="M114 290 A186 186 0 0 1 486 290" fill="none" stroke="#9DE36B" strokeWidth="22"/>
          <path d="M146 290 A154 154 0 0 1 454 290" fill="none" stroke="#4ECDC4" strokeWidth="22"/>
          <path d="M178 290 A122 122 0 0 1 422 290" fill="none" stroke="#B197FC" strokeWidth="22"/>
        </svg>

        {/* Floating clouds */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '12%', left: '-4%', width: 180, opacity: 0.7, animation: 'float-cloud-l 18s ease-in-out infinite' }}>
          <CloudSVG />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '22%', right: '-2%', width: 160, opacity: 0.6, animation: 'float-cloud-r 22s ease-in-out infinite' }}>
          <CloudSVG />
        </div>

        {/* Confetti */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { top: '10%', left: '6%',  w: 12, h: 8,  bg: '#FFC83D', rot: '20deg' },
            { top: '18%', left: '22%', w: 8,  h: 12, bg: '#FF6F9C', rot: '-15deg' },
            { top: '8%',  left: '42%', w: 10, h: 7,  bg: '#4ECDC4', rot: '35deg' },
            { top: '30%', left: '60%', w: 9,  h: 13, bg: '#B197FC', rot: '-25deg' },
            { top: '14%', left: '78%', w: 11, h: 7,  bg: '#FFC83D', rot: '10deg' },
            { top: '25%', left: '88%', w: 8,  h: 10, bg: '#FF6F9C', rot: '50deg' },
            { top: '40%', left: '12%', w: 10, h: 8,  bg: '#4ECDC4', rot: '-40deg' },
            { top: '50%', left: '95%', w: 9,  h: 11, bg: '#B197FC', rot: '30deg' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', top: c.top, left: c.left,
                width: c.w, height: c.h,
                background: c.bg,
                borderRadius: 2,
                transform: `rotate(${c.rot})`,
                border: '1.5px solid #3A2E2A',
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
            {/* Left: text */}
            <div style={{ flex: '1 1 340px', minWidth: 280 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#FFF6E5', border: '2.5px solid #3A2E2A',
                borderRadius: 9999, padding: '4px 14px',
                marginBottom: '1.5rem',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 13,
                color: 'var(--ink)',
              }}>
                <StarSVG fill="#FFC83D" size={16} />
                <span>しょうがくせいの まなびラボ</span>
              </div>

              {/* Hero title */}
              <h1 style={{
                fontFamily: 'var(--font-zen)',
                fontWeight: 900,
                fontSize: 'clamp(34px, 5.5vw, 68px)',
                lineHeight: 1.15,
                color: 'var(--ink)',
                marginBottom: '1.25rem',
              }}>
                <span style={{ display: 'block' }}>あそびながら、</span>
                <span style={{ display: 'block', color: 'var(--pink)', WebkitTextStroke: '0.5px #3A2E2A' }}>
                  かしこく
                </span>
                <span style={{ display: 'block' }}>なる</span>
                <span style={{ display: 'block', fontSize: 'clamp(16px, 2.5vw, 26px)', fontWeight: 700, color: 'var(--ink-soft)', marginTop: '0.5rem' }}>
                  ふしぎな まなびのラボへ ようこそ。
                </span>
              </h1>

              <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.75, marginBottom: '1.75rem', color: 'var(--ink-soft)' }}>
                <ruby>漢字<rt>かんじ</rt></ruby>・<ruby>計算<rt>けいさん</rt></ruby>・<ruby>英語<rt>えいご</rt></ruby>・<ruby>思考力<rt>しこうりょく</rt></ruby>。
                ぜんぶ<strong>ゲームで まなべる</strong>アプリが、ひとつの おうちにあつまっているよ。
                バッジをあつめながら、まいにち5ふんで パワーアップ！
              </p>

              {/* CTA: 体験ファースト → 登録サブ */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Link
                  href="/lab?trial=1"
                  className="btn-sticker btn-yellow"
                  style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, padding: '12px 28px' }}
                >
                  とりあえず やってみる →
                </Link>
                <Link
                  href="/register"
                  className="btn-sticker btn-white"
                  style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 16, padding: '12px 28px' }}
                >
                  むりょう とうろく
                </Link>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#4ECDC4', marginRight: 6, border: '1.5px solid #3A2E2A', verticalAlign: 'middle' }} />
                とうろくしなくても、すぐあそべるよ
              </p>
            </div>

            {/* Right: mascot */}
            <div style={{ flex: '0 0 auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Spinning halo */}
              <svg
                viewBox="0 0 400 400"
                aria-hidden="true"
                className="animate-halo-spin"
                style={{ position: 'absolute', width: 360, height: 360, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
              >
                <circle cx="200" cy="40" r="6" fill="#FFC83D"/>
                <circle cx="340" cy="120" r="5" fill="#FF6F9C"/>
                <circle cx="360" cy="280" r="7" fill="#4ECDC4"/>
                <circle cx="200" cy="360" r="5" fill="#B197FC"/>
                <circle cx="40" cy="280" r="6" fill="#FFC83D"/>
                <circle cx="60" cy="120" r="5" fill="#9DE36B"/>
              </svg>

              <div className="animate-float-sticker" style={{ position: 'relative', zIndex: 2 }}>
                <Image
                  src="/tanquu/happy.png"
                  alt="タンキュー"
                  width={320}
                  height={320}
                  unoptimized
                  priority
                />
              </div>

              {/* Speech bubble */}
              <div style={{
                position: 'absolute', bottom: -20, right: -10,
                background: '#FFF6E5',
                border: '3px solid #3A2E2A',
                borderRadius: 16,
                padding: '8px 14px',
                boxShadow: '4px 4px 0 0 #3A2E2A',
                fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 14,
                color: 'var(--ink)',
                zIndex: 3,
              }}>
                📚 きょうも まなぼ！
              </div>

              {/* Handwritten note — hidden on small screens where it clips */}
              <div
                className="hidden sm:block"
                style={{
                  position: 'absolute', top: -24, left: -40,
                  fontFamily: 'var(--font-hachi)', fontSize: 15,
                  color: 'var(--ink)', whiteSpace: 'nowrap',
                }}
              >
                ぼく、タンキュー！
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-4xl mx-auto px-6" style={{ marginTop: '3rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0',
            background: '#FFFFFF',
            border: '3px solid #3A2E2A',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-hard)',
            overflow: 'hidden',
          }}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: '1 0 120px',
                  textAlign: 'center',
                  padding: '1.25rem 1rem',
                  borderRight: i < STATS.length - 1 ? '2.5px solid #3A2E2A' : undefined,
                }}
              >
                <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', color: 'var(--ink)', lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: '0.55em', color: 'var(--ink-soft)' }}>{s.sub}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-zen)', fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ APPS ════════ */}
      <section
        id="apps"
        style={{ background: 'var(--mint-bg)', position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}
      >
        {/* Section head */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
            <StarSVG fill="#FF6F9C" size={16} />
            APPS
          </div>
          <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(26px, 4vw, 42px)', color: 'var(--ink)', lineHeight: 1.2 }}>
            25本の <span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2px solid #3A2E2A' }}>まなびアプリ</span>
          </h2>
          <p style={{ marginTop: '0.75rem', color: 'var(--ink-soft)', fontSize: 15 }}>
            まずは人気の8本をチェック！タップしたら、そのアプリへ直接ジャンプ。<strong>広告なし・課金誘導なし</strong>。登録なしでもすぐ遊べる。
          </p>
        </div>

        {/* App cards — all clickable */}
        <div className="max-w-6xl mx-auto" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}>
          {APPS.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              className="card-sticker"
              style={{
                background: app.bg,
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
                transform: `rotate(${app.rot})`,
                textDecoration: 'none',
                color: 'var(--ink)',
                display: 'block',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: '0.5rem' }}>{app.emoji}</div>
              <span style={{
                display: 'inline-block',
                background: '#3A2E2A', color: '#FFF6E5',
                fontSize: 11, fontWeight: 700,
                padding: '2px 10px', borderRadius: 9999,
                marginBottom: '0.5rem',
              }}>{app.target}</span>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, color: 'var(--ink)', margin: '0.25rem 0 0.5rem' }}>
                {app.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#FFFFFF', color: 'var(--ink)',
                  border: '2px solid #3A2E2A',
                  fontSize: 11, fontWeight: 700,
                  padding: '2px 10px', borderRadius: 9999,
                }}>{app.badge}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>あそぶ →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            href="/lab?trial=1"
            className="btn-sticker btn-yellow"
            style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, padding: '12px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span>ぜんぶのアプリをみてみる</span>
            <svg viewBox="0 0 24 24" width={18} height={18}><path d="M5 12h14M13 6l6 6-6 6" stroke="#3A2E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </Link>
        </div>
      </section>

      {/* ════════ WHO IT'S FOR ════════ */}
      <section style={{ background: 'var(--pink-bg)', position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              <svg viewBox="0 0 24 24" width={16} height={16}><path d="M12 4.5c-2 -3 -8 -2 -8 3 c0 5 8 10 8 10 s8 -5 8 -10 c0 -5 -6 -6 -8 -3 z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
              WHO IT&apos;S FOR
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 38px)', color: 'var(--ink)' }}>
              こんな きみに、ぴったり
            </h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--ink-soft)', fontSize: 15 }}>
              「にがて」も「きょうみ」も、TANQラボならぴったりのアプリがみつかるよ。
            </p>
          </div>

          {/* 課題カード — タップでラボへ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {TARGET_KIDS.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className="card-sticker"
                style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--ink)' }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
                <span style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.5, flex: 1 }}>{item.text}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>

          {/* Parent panel */}
          <div
            className="card-sticker"
            style={{
              marginTop: '2rem',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem 2rem',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem',
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 80 80" width={64} height={64}>
                <circle cx="28" cy="32" r="14" fill="#FFE39A" stroke="#3A2E2A" strokeWidth="3"/>
                <circle cx="52" cy="32" r="14" fill="#FFC0DA" stroke="#3A2E2A" strokeWidth="3"/>
                <circle cx="40" cy="56" r="11" fill="#A8DCFF" stroke="#3A2E2A" strokeWidth="3"/>
              </svg>
            </div>
            <div style={{ flex: '1 1 260px' }}>
              <span style={{
                display: 'inline-block', background: 'var(--lav-bg)', border: '2px solid #3A2E2A',
                borderRadius: 9999, padding: '2px 12px', fontSize: 12, fontWeight: 700, marginBottom: '0.5rem',
              }}>保護者の方へ</span>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', margin: '0 0 0.5rem' }}>
                広告なし・課金誘導なし。<br/>子どもが一人でも安全に使えるシンプル設計。
              </h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, margin: 0 }}>
                TANQラボは、お子さま自身がのめり込むことを最優先に設計されています。広告はなく、登録なしでも遊べる範囲を残しているので、まずは無料で体験してから、登録するかどうか決めてください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section
        id="how"
        style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}
      >
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              <StarSVG fill="#4ECDC4" size={16} />
              HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 38px)', color: 'var(--ink)', lineHeight: 1.2 }}>
              はじめかたは <span style={{ color: 'var(--pink)' }}>かんたん3ステップ</span>
            </h2>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem' }}>
            {HOW_STEPS.map((step, i) => (
              <>
                <div
                  key={step.num}
                  className="card-sticker"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-card)',
                    padding: '2rem 1.5rem',
                    flex: '1 1 220px',
                    maxWidth: 280,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 42, color: step.color, lineHeight: 1 }}>
                    {step.num}
                  </div>
                  <div style={{ margin: '0.75rem 0' }}>{step.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 16, color: 'var(--ink)', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div key={`arrow-${i}`} style={{ display: 'flex', alignItems: 'center', paddingTop: '4rem', opacity: 0.6 }}>
                    <ArrowRight />
                  </div>
                )}
              </>
            ))}
          </div>

          {/* HOW締めのCTA — 1ボタンだけ。詳細はFINAL CTAセクションへ */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link
              href="/lab?trial=1"
              className="btn-sticker btn-yellow"
              style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, padding: '14px 36px', display: 'inline-block' }}
            >
              まず やってみる →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section id="cta" style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '3rem 1.5rem' }}>
        <div className="max-w-3xl mx-auto">
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
            {/* Corner sticker decorations */}
            <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: -10 }}>
              <svg viewBox="0 0 60 60" width={52} height={52}><path d="M30 5l6 18h19l-15 11 6 18-16-11-16 11 6-18-15-11h19z" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="3" strokeLinejoin="round"/></svg>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', top: -8, right: -8 }}>
              <svg viewBox="0 0 60 60" width={48} height={48}><path d="M30 8C20 -2 0 4 0 22 c0 18 30 32 30 32 s30 -14 30 -32 c0 -18 -20 -24 -30 -14z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="3"/></svg>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', bottom: -8, left: -8 }}>
              <svg viewBox="0 0 60 60" width={48} height={48}><circle cx="30" cy="30" r="22" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="3"/><text x="30" y="38" textAnchor="middle" fontSize="22" fill="#3A2E2A">★</text></svg>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', bottom: -8, right: -8 }}>
              <svg viewBox="0 0 60 60" width={48} height={48}><circle cx="30" cy="30" r="22" fill="#B197FC" stroke="#3A2E2A" strokeWidth="3"/><circle cx="22" cy="28" r="3" fill="#3A2E2A"/><circle cx="38" cy="28" r="3" fill="#3A2E2A"/><path d="M22 36 Q 30 42 38 36" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Image src="/tanquu/mischievous.png" alt="タンキュー" width={140} height={140} unoptimized className="animate-float-sticker" />
            </div>

            <span style={{ fontFamily: 'var(--font-hachi)', fontSize: 15, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.5rem' }}>
              さあ、はじめよう
            </span>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 42px)', color: 'var(--ink)', marginBottom: '1rem', lineHeight: 1.2 }}>
              きょうから <span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2.5px solid #3A2E2A' }}>まなびのぼうけん</span> へ。
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '2rem' }}>
              とうろくしなくても、いくつかのアプリがすぐあそべる。<br/>
              きにいったら、むりょうとうろくでぜんぶひらこう！
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Link
                href="/lab?trial=1"
                className="btn-sticker btn-yellow"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 17, padding: '14px 32px' }}
              >
                とりあえず やってみる →
              </Link>
              <Link
                href="/register"
                className="btn-sticker btn-white"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 17, padding: '14px 32px' }}
              >
                むりょう とうろく
              </Link>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              登録ずみの方は <Link href="/login" style={{ color: 'var(--ink)', fontWeight: 700 }}>ログイン</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ════════ MISSION ════════ */}
      <section id="mission" style={{ background: 'var(--lav-bg)', position: 'relative', zIndex: 1, padding: '5rem 1.5rem', overflow: 'hidden' }}>
        {/* Decorative stars */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '8%', left: '4%' }}><StarSVG fill="#FFC83D" size={36} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '12%', right: '6%' }}><StarSVG fill="#FF6F9C" size={28} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '10%', left: '8%' }}>
          <svg viewBox="0 0 24 24" width={28} height={28}><path d="M12 4.5c-2 -3 -8 -2 -8 3 c0 5 8 10 8 10 s8 -5 8 -10 c0 -5 -6 -6 -8 -3 z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '14%', right: '5%' }}>
          <svg viewBox="0 0 24 24" width={24} height={24}><path d="M12 4.5c-2 -3 -8 -2 -8 3 c0 5 8 10 8 10 s8 -5 8 -10 c0 -5 -6 -6 -8 -3 z" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>

        <div className="max-w-4xl mx-auto" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '2rem' }}>
            <StarSVG fill="#B197FC" size={16} />
            MISSION
          </div>

          <blockquote style={{ margin: '0 0 1.5rem', padding: 0, border: 'none' }}>
            <p style={{
              fontFamily: 'var(--font-zen)',
              fontWeight: 900,
              fontSize: 'clamp(26px, 4vw, 48px)',
              lineHeight: 1.4,
              color: 'var(--ink)',
            }}>
              <span style={{ display: 'block' }}>すべての <span style={{ background: '#FF6F9C', color: '#fff', padding: '0 6px', borderRadius: 6, border: '2px solid #3A2E2A' }}>子ども</span>の中に、</span>
              <span style={{ display: 'block' }}>うまれながらの</span>
              <span style={{ display: 'block' }}><span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2px solid #3A2E2A' }}>探究者</span>が いる。</span>
            </p>
          </blockquote>

          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '36em', margin: '0 auto 3rem' }}>
            TANQは、AIを使ってすべての子どもが「考える喜び」を発見できる学習体験を創ります。<br/>
            目先のテスト対策だけでなく、一生使える思考力と学習習慣を育てる。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {VALUES.map((v) => (
              <div
                key={v.name}
                className="card-sticker"
                style={{
                  background: v.bg,
                  borderRadius: 'var(--radius-card)',
                  padding: '1.5rem 1.25rem',
                  textAlign: 'center',
                  transform: `rotate(${v.rot})`,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: '0.5rem' }}>{v.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: '0.25rem' }}>
                  {v.name}
                </h4>
                <p style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 12, color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>{v.jp}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" style={{ background: 'var(--mint-bg)', position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
              <StarSVG fill="#FFC83D" size={16} />
              ABOUT
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', color: 'var(--ink)' }}>
              会社について
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Table */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '1.75rem 2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {COMPANY_INFO.map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: '2px solid var(--cream-deep)' }}>
                      <td style={{ padding: '0.75rem 0', fontSize: 13, color: 'var(--ink-soft)', width: '7em', fontWeight: 700 }}>{label}</td>
                      <td style={{ padding: '0.75rem 0', fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Story */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', marginBottom: '1rem' }}>
                社名の由来
              </h3>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: '0.75rem', color: 'var(--ink)' }}>
                <strong>TANQ</strong> = <ruby>探究<rt>たんきゅう</rt></ruby>（Tankyū）
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                探究とは「答えのない問いに向き合い続けること」。受験でも、自由研究でも、その根っこにあるのは同じ知的な炎です。
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                10年後、日本中の子どもたちが「学ぶことが好き」と言える社会をつくる。TANQのAIは、すべての子どもに「個人専属のソクラテス」を届けます。
              </p>

              <div className="card-sticker" style={{ background: 'var(--cream)', borderRadius: 'var(--radius-card)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Image src="/tanquu/happy.png" alt="タンキュー" width={64} height={64} unoptimized />
                <div>
                  <p style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 14, color: 'var(--ink)' }}>
                    TANQuu <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--ink-soft)' }}>（タンキュー）</span>
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                    ラベンダー × 白の ちいさな こねこ。子どもの探究心を引き出すナビゲーター。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
