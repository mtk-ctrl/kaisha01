import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScienceDomains from './ScienceDomains'

export const metadata: Metadata = {
  title: 'TANQ 理科 — 4つのふしぎのせかい',
  description: 'タンキューといっしょに科学のふしぎを探検しよう。いきもの・てんき・ものの変化・ちからの4領域・260問。',
}

function StarSVG({ fill, size = 16 }: { fill: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 1.5l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" fill={fill} stroke="#3A2E2A" strokeWidth="1.2"/>
    </svg>
  )
}

export default function TanqPage() {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--ink)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section style={{
        background: 'var(--lav-bg)',
        position: 'relative', zIndex: 1,
        padding: '6rem 1.5rem 4rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '8%',  left: '5%',  opacity: 0.45 }}><StarSVG fill="#B197FC" size={36} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '20%', right: '6%', opacity: 0.4  }}><StarSVG fill="#FFC83D" size={28} /></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '6%', left: '10%', opacity: 0.35 }}>
          <svg viewBox="0 0 24 24" width={28} height={28}><path d="M12 4.5c-2-3-8-2-8 3c0 5 8 10 8 10s8-5 8-10c0-5-6-6-8-3z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '35%', left: '3%', opacity: 0.3 }}>
          <svg viewBox="0 0 24 24" width={22} height={22}><circle cx="12" cy="12" r="9" fill="#4ECDC4" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '20%', right: '4%', opacity: 0.35 }}>
          <svg viewBox="0 0 24 24" width={26} height={26}><rect x="4" y="4" width="16" height="16" rx="3" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="1.5"/></svg>
        </div>

        <div className="animate-float-sticker" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
          <Image src="/tanquu/surprised.png" alt="タンキュー" width={200} height={200} unoptimized />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
          <StarSVG fill="#B197FC" size={16} />
          <span>TANQ 理科</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 54px)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
          <ruby>科学<rt>かがく</rt></ruby>の <span style={{ color: 'var(--pink)' }}>ふしぎ</span> を<br/>
          さがしにいこう
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, maxWidth: '28em', margin: '0 auto 2rem' }}>
          タンキューといっしょに、4つのせかいで<ruby>科学<rt>かがく</rt></ruby>のふしぎを<ruby>発見<rt>はっけん</rt></ruby>しよう。<br/>
          クイズにこたえるたびに、どんどんかしこくなれるよ！
        </p>

      </section>

      {/* ════════ TANQ びっくり はっけん！ ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem 3rem' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-block', background: '#FF6F9C', color: '#fff', fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 12, letterSpacing: '0.15em', padding: '4px 14px', borderRadius: 99, border: '2px solid #3A2E2A', marginBottom: '0.75rem' }}>
              タンキューの びっくり はっけん！
            </div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(20px, 3.5vw, 32px)', color: 'var(--ink)', lineHeight: 1.25 }}>
              「えっ、そうなの！？」な<br/><span style={{ color: 'var(--pink)' }}>科学のびっくり</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                q: 'うんこは水に浮く？',
                emoji: '💩',
                a: '浮く！ うんこには脂肪分が多くて、水よりも軽いからプカプカするよ。お腹の調子がいいとき・悪いときで浮き方が変わるんだって！',
                color: '#FFF1B8',
                accent: '#C99700',
              },
              {
                q: '氷はなぜ水に浮くの？',
                emoji: '🧊',
                a: '水は凍ると体積が約9%も増えて軽くなるから！だから北極の氷も海に浮いてるんだよ。ほとんどの物は固体の方が重いのに、水は特別なんだ。',
                color: '#E0F0FF',
                accent: '#0ea5e9',
              },
              {
                q: 'なぜ空は青いの？',
                emoji: '🌤️',
                a: '太陽の光はいろんな色が混ざってる。青い光は一番散らばりやすいから、空全体が青く見える！夕方に赤くなるのも同じ理由だよ。',
                color: '#DBF6F0',
                accent: '#0d9488',
              },
              {
                q: '電子レンジで卵を温めたら？',
                emoji: '🥚',
                a: '爆発する！ 中で水蒸気がふくらんで、殻が割れるほどの圧力になるよ。絶対やらないでね！（ゆでたまごもNG）',
                color: '#FFE3EE',
                accent: '#FF6F9C',
              },
              {
                q: 'くしゃみのスピードは？',
                emoji: '🤧',
                a: '時速約160km！ 新幹線の半分くらいのスピードだよ。しかも1回で10万個以上のウイルスが飛び出すから、必ず口をふさごうね。',
                color: '#EFE8FF',
                accent: '#8b5cf6',
              },
              {
                q: 'バナナは木になる？',
                emoji: '🍌',
                a: '木じゃなくて草！ バナナは世界最大の「草」の仲間なんだ。幹のように見える部分は葉っぱが重なったもの。抜こうと思えば引き抜けるよ。',
                color: '#DFF6CF',
                accent: '#22c55e',
              },
            ].map(({ q, emoji, a, color, accent }) => (
              <div
                key={q}
                className="card-sticker"
                style={{ background: color, borderRadius: 'var(--radius-card)', padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 32 }}>{emoji}</span>
                  <p style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 15, color: 'var(--ink)', lineHeight: 1.3, margin: 0 }}>
                    {q}
                  </p>
                </div>
                <div style={{ height: 2, background: accent, borderRadius: 1, marginBottom: '0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.75, margin: 0 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════ 4 DOMAINS ════════ */}
      <section style={{ background: 'var(--mint-bg)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem 5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--ink)', marginBottom: '0.5rem' }}>
              4つの <span style={{ background: '#FFC83D', padding: '0 8px', borderRadius: 6, border: '2px solid #3A2E2A' }}>ふしぎのせかい</span>
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>どのせかいのふしぎを先にみつけにいく？</p>
          </div>
          <ScienceDomains />
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{ background: 'var(--cream)', position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--ink)', textAlign: 'center', marginBottom: '2.5rem' }}>
            あそびかた
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem' }}>
            {/* Step 1 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 200px', maxWidth: 260, textAlign: 'center', transform: 'rotate(-1deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 40, color: '#FFC83D', lineHeight: 1 }}>01</div>
              <div style={{ margin: '0.75rem 0', fontSize: 48 }}>🌍</div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 15, color: 'var(--ink)', marginBottom: '0.5rem' }}>
                せかいを えらぶ
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                いきもの・てんき・ものの変化・ちから の4つから、きょうのふしぎを選ぼう。
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '3.5rem', opacity: 0.5 }}>
              <svg viewBox="0 0 80 40" width={60} height={30} aria-hidden="true">
                <path d="M5 20 Q 35 5, 65 20" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M56 14 L 67 20 L 56 26" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 200px', maxWidth: 260, textAlign: 'center', transform: 'rotate(0.8deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 40, color: '#FF6F9C', lineHeight: 1 }}>02</div>
              <div style={{ margin: '0.75rem 0', fontSize: 48 }}>🧠</div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 15, color: 'var(--ink)', marginBottom: '0.5rem' }}>
                クイズに こたえる
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                4択クイズにこたえよう。まちがえてもOK。解説をよんで、ふしぎのなぞをとこう。
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '3.5rem', opacity: 0.5 }}>
              <svg viewBox="0 0 80 40" width={60} height={30} aria-hidden="true">
                <path d="M5 20 Q 35 35, 65 20" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M56 14 L 67 20 L 56 26" fill="none" stroke="#3A2E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-card)', padding: '2rem 1.5rem', flex: '1 1 200px', maxWidth: 260, textAlign: 'center', transform: 'rotate(-0.9deg)' }}>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 40, color: '#4ECDC4', lineHeight: 1 }}>03</div>
              <div style={{ margin: '0.75rem 0', fontSize: 48 }}>⭐</div>
              <h3 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 15, color: 'var(--ink)', marginBottom: '0.5rem' }}>
                くりかえして おぼえる
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                まちがえた問題はまたでてくる。3回正解したら「おぼえた！」になるよ。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS STRIP ════════ */}
      <section style={{ background: 'var(--lav-bg)', position: 'relative', zIndex: 1, padding: '2.5rem 1.5rem' }}>
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          {[
            { num: '260', label: '問題数', emoji: '📝' },
            { num: '4',   label: '領域',   emoji: '🌐' },
            { num: '3',   label: 'レベル', emoji: '🎯' },
            { num: '∞',  label: 'くりかえし', emoji: '🔄' },
          ].map(({ num, label, emoji }) => (
            <div key={label} className="card-sticker" style={{ background: '#FFFFFF', borderRadius: 20, padding: '1.25rem 1.75rem', textAlign: 'center', minWidth: 110 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
              <div style={{ fontFamily: 'var(--font-fredoka)', fontWeight: 700, fontSize: 32, color: 'var(--ink)', lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
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
            <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: -10 }}>
              <svg viewBox="0 0 60 60" width={52} height={52}><path d="M30 5l6 18h19l-15 11 6 18-16-11-16 11 6-18-15-11h19z" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="3" strokeLinejoin="round"/></svg>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', top: -8, right: -8 }}>
              <svg viewBox="0 0 60 60" width={48} height={48}><path d="M30 8C20-2 0 4 0 22c0 18 30 32 30 32s30-14 30-32c0-18-20-24-30-14z" fill="#FF6F9C" stroke="#3A2E2A" strokeWidth="3"/></svg>
            </div>

            <div style={{ fontSize: 56, marginBottom: '0.75rem' }}>🔬</div>
            <h2 style={{ fontFamily: 'var(--font-zen)', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 36px)', color: 'var(--ink)', marginBottom: '1rem', lineHeight: 1.2 }}>
              タンキューと <span style={{ background: '#FFC83D', padding: '0 6px', borderRadius: 6, border: '2.5px solid #3A2E2A' }}>ふしぎ</span> をみつけよう！
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '2rem' }}>
              4つのせかいで<ruby>科学<rt>かがく</rt></ruby>のふしぎを<ruby>発見<rt>はっけん</rt></ruby>しよう。
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
              <Link
                href="/lab"
                className="btn-sticker btn-white"
                style={{ fontFamily: 'var(--font-zen)', fontWeight: 700, fontSize: 16, padding: '13px 28px', textDecoration: 'none' }}
              >
                ← ラボにもどる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
