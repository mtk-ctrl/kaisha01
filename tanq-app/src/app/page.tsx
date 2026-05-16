import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ── Static data ── */

const PARTICLES = [
  { left: '4%',  size: 5,  delay: '0s',   dur: '18s' },
  { left: '9%',  size: 8,  delay: '3s',   dur: '24s' },
  { left: '16%', size: 4,  delay: '6s',   dur: '19s' },
  { left: '23%', size: 10, delay: '1s',   dur: '27s' },
  { left: '31%', size: 5,  delay: '4s',   dur: '21s' },
  { left: '38%', size: 7,  delay: '8s',   dur: '23s' },
  { left: '46%', size: 4,  delay: '2s',   dur: '17s' },
  { left: '53%', size: 9,  delay: '5s',   dur: '25s' },
  { left: '61%', size: 5,  delay: '9s',   dur: '20s' },
  { left: '68%', size: 6,  delay: '0.5s', dur: '22s' },
  { left: '76%', size: 4,  delay: '7s',   dur: '18s' },
  { left: '83%', size: 8,  delay: '3.5s', dur: '26s' },
  { left: '89%', size: 5,  delay: '11s',  dur: '19s' },
  { left: '94%', size: 6,  delay: '1.5s', dur: '21s' },
  { left: '12%', size: 3,  delay: '10s',  dur: '16s' },
  { left: '57%', size: 7,  delay: '6.5s', dur: '23s' },
  { left: '72%', size: 4,  delay: '13s',  dur: '20s' },
  { left: '42%', size: 6,  delay: '4.5s', dur: '28s' },
]

const MODES = [
  {
    title: 'Spark Mode',
    emoji: '✨',
    desc: '「うんちって水に浮く？」驚きのフックで楽しく学習スタート。遊び感覚で科学の世界へ。',
    color: '#f0c040',
    target: '小4〜 / 遊び感覚で',
  },
  {
    title: 'Deep Mode',
    emoji: '🔬',
    desc: '本格的な科学的思考で受験にも対応。論理的思考力と探究力を同時に育てる。',
    color: '#00e5c3',
    target: '中1〜 / 高モチベ向け',
  },
  {
    title: 'Wonder Mode',
    emoji: '🌟',
    desc: '小さな子どもの「なぜ？」を大切に育てる。はじめての探究体験を丁寧にデザイン。',
    color: '#c4a8ff',
    target: '小1〜 / はじめての探究',
  },
]

const LOOP_STEPS = [
  { num: '①', title: 'Spark',   icon: '✨', desc: 'TANQuu が「ウソみたいなホント」フックで会話をスタートさせる', color: '#f0c040' },
  { num: '②', title: 'Explore', icon: '🔍', desc: '答えを教えずに問いで引き出す。「どう思う？」が学びの鍵', color: '#00e5c3' },
  { num: '③', title: 'Discover',icon: '💡', desc: '子どもが自分で「そういうことか！」と発見する瞬間を演出', color: '#c4a8ff' },
  { num: '④', title: 'Connect', icon: '🔗', desc: '発見した概念を受験・日常の知識へ橋渡し', color: '#4ade80' },
  { num: '⑤', title: 'Prove',   icon: '🧠', desc: '「友達3人の論理、どれが正しい？」思考評価型UIで定着', color: '#f87171' },
  { num: '⑥', title: 'Map',     icon: '🗺️', desc: '発見を「秘密コレクション」に追加。学びが宝物になる', color: '#60a5fa' },
]

const VALUES = [
  { name: 'Curiosity First', jp: '好奇心を殺さない',   icon: '🌱', desc: 'それがすべての起点。好奇心の火を灯し続ける。',                   color: '#4ade80' },
  { name: 'Honest Impact',   jp: '誠実な影響',         icon: '💎', desc: '子どものためになることだけをやる。ビジネスの都合で妥協しない。', color: '#00e5c3' },
  { name: 'Simplicity',      jp: 'シンプルに',         icon: '⚡', desc: '複雑な学習をシンプルな体験に変える。',                         color: '#c4a8ff' },
  { name: 'Long Game',       jp: '長期視点',           icon: '🌳', desc: '目先のテスト対策ではなく、一生使える思考力を育てる。',           color: '#f0c040' },
]

const COMPANY_INFO = [
  ['社名',     'TANQ Inc.（タンク）'],
  ['設立',     '2026年5月'],
  ['所在地',   '福岡県福岡市'],
  ['事業内容', '小学生〜高校生向け教育テクノロジー'],
  ['代表',     'Jobs（AI CEO）'],
  ['ミッション','AIで考える喜びをすべての子どもに'],
]

/* ── Wave dividers ── */
function WaveDown() {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 24C960 27 1056 37 1152 42.7C1248 48 1344 48 1392 48L1440 48V80H0V0Z" fill="#0f2855"/>
    </svg>
  )
}

function WaveUp() {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 80L48 72C96 64 192 48 288 42.7C384 37 480 43 576 48C672 53 768 59 864 56C960 53 1056 43 1152 37.3C1248 32 1344 32 1392 32L1440 32V0H0V80Z" fill="#0f2855"/>
    </svg>
  )
}

/* ── Page ── */

export default function CorporateHome() {
  return (
    <div className="bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-aurora">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[20%] w-[600px] h-[600px] rounded-full bg-corp-forest opacity-40 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-corp-teal opacity-20 blur-[90px]" />
          <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-20 blur-[80px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none opacity-60" />

        {/* Rising particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle-orb"
            style={{
              left: p.left,
              width:  p.size,
              height: p.size,
              animationDelay:    p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-40 flex flex-col lg:flex-row items-center gap-16">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-corp-teal/30 bg-corp-teal/10 text-corp-teal text-sm mb-10 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-corp-teal animate-pulse" />
              AIで学ぶ喜びを、すべての子どもに
            </div>

            <h1 className="text-6xl lg:text-8xl font-black leading-[1.05] mb-8 tracking-tight">
              <span className="text-gradient">好奇心を、</span>
              <br />
              <span className="text-white">ちからに。</span>
            </h1>

            <p className="text-lg text-corp-muted mb-12 max-w-lg leading-relaxed">
              TANQは、AIを使って小学生〜高校生が「考える喜び」を発見できる学習プラットフォームです。
              受験にも対応しながら、一生使える思考力を育てます。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="px-9 py-4 rounded-full btn-glow-teal text-lg font-bold text-center">
                無料で始める →
              </Link>
              <Link href="/tanq" className="px-9 py-4 rounded-full border border-corp-teal/30 text-corp-teal font-semibold text-lg hover:bg-corp-teal/10 transition-all text-center">
                アプリを体験
              </Link>
            </div>
            {/* ── [TRIAL] ログインなし体験ボタン（テストデータ収集後に削除） */}
            <Link
              href="/lab?trial=1"
              className="inline-flex items-center gap-2 text-[#c4a8ff] font-bold text-base hover:text-white transition-colors mt-2"
            >
              🚀 登録なしで今すぐ体験する →
            </Link>
            {/* ── [TRIAL] END ── */}
          </div>

          {/* TANQuu mascot */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 rounded-full bg-corp-lavender opacity-20 blur-3xl scale-125 animate-glow-pulse" />
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-[15%]"
              style={{ background: 'radial-gradient(circle, #00e5c3, transparent 70%)' }}
            />
            <Image
              src="/tanquu/happy.png"
              alt="TANQuu"
              width={340}
              height={340}
              className="relative z-10 animate-float drop-shadow-[0_0_50px_rgba(196,168,255,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Wave to next section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20" fill="none">
            <path d="M0 80L48 70.7C96 61 192 43 288 37.3C384 32 480 37 576 42.7C672 48 768 53 864 50.7C960 48 1056 37 1152 32C1248 27 1344 27 1392 27L1440 27V80H0Z" fill="#0f2855"/>
          </svg>
        </div>
      </section>

      {/* ════════ MISSION ════════ */}
      <section className="bg-[#0f2855] py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-6 font-semibold">Mission</p>
          <blockquote className="text-3xl lg:text-5xl font-bold leading-snug mb-8">
            <span className="text-gradient-green">&ldquo;すべての子どもの中に、</span>
            <br />
            <span className="text-white">生まれながらにして探究者がいる。&rdquo;</span>
          </blockquote>
          <p className="text-corp-muted text-lg leading-relaxed max-w-2xl mx-auto">
            TANQは、AIを使ってすべての子どもが「考える喜び」を発見できる学習体験を創ります。
            受験という現実とも正面から向き合いながら、知的好奇心の炎を絶やさない。
          </p>
        </div>
      </section>

      {/* ════════ APP SHOWCASE ════════ */}
      <section id="app" className="relative bg-corp-navy py-32 px-6 overflow-hidden">
        <WaveUp />

        {/* Background accent */}
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-corp-forest opacity-30 blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Product</p>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">TANQ App</h2>
            <p className="text-corp-muted text-lg max-w-2xl mx-auto leading-relaxed">
              「ウソみたいなホント」から始まる、AIと一緒に考える探究の旅。
              答えを教えるのではなく、子どもが自分で発見する体験を設計しました。
            </p>
          </div>

          {/* Mode cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {MODES.map((mode) => (
              <div key={mode.title} className="glass-card rounded-2xl p-8 group hover:-translate-y-2 transition-all duration-300 hover:border-white/15">
                <div className="text-5xl mb-5">{mode.emoji}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: mode.color }}>{mode.title}</h3>
                <p className="text-corp-muted text-sm mb-5 leading-relaxed">{mode.desc}</p>
                <span
                  className="text-xs px-3 py-1.5 rounded-full border font-medium"
                  style={{ borderColor: `${mode.color}40`, color: mode.color }}
                >
                  {mode.target}
                </span>
              </div>
            ))}
          </div>

          {/* Unit 1 spotlight */}
          <div className="relative glass-card rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-corp-forest/20 via-transparent to-corp-lavender/10 rounded-3xl pointer-events-none" />
            <div className="flex-1 relative z-10">
              <div className="inline-block text-corp-teal text-xs uppercase tracking-widest mb-4 font-semibold">
                ✅ Unit 1 実装済み
              </div>
              <h3 className="text-4xl font-black mb-5">
                「うんちって<br />水に浮く？」
              </h3>
              <p className="text-corp-muted leading-relaxed mb-8 text-base">
                密度と浮力を、うんちというユニークな切り口から発見。
                TANQuu が驚きのフックで会話を始め、子どもが自分で「そういうことか！」と気づく瞬間を演出します。
              </p>
              <Link
                href="/tanq"
                className="inline-flex items-center gap-2 text-corp-teal hover:text-white transition-colors font-bold text-lg group"
              >
                実際に体験する
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-corp-lavender opacity-20 blur-3xl rounded-full" />
              <Image
                src="/tanquu/mischievous.png"
                alt="TANQuu mischievous"
                width={220}
                height={220}
                className="relative z-10 drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]"
              />
            </div>
          </div>
        </div>

        <WaveDown />
      </section>

      {/* ════════ EXPLORATION LOOP ════════ */}
      <section className="bg-[#0f2855] py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-5">探究ループ</h2>
            <p className="text-corp-muted text-lg max-w-xl mx-auto">
              6つのステップで、子どもが自分で「発見」する体験を設計
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOOP_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="glass-card rounded-2xl p-7 group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black" style={{ color: step.color }}>{step.num}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-corp-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ VALUES ════════ */}
      <section className="relative bg-corp-navy py-32 px-6 overflow-hidden">
        <WaveUp />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#1a4a3a] opacity-20 blur-[120px]" />
          <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-corp-lavender opacity-10 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Values</p>
            <h2 className="text-4xl lg:text-5xl font-black">わたしたちが大切にすること</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.name} className="glass-card rounded-2xl p-8 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="font-black text-lg mb-1" style={{ color: v.color }}>{v.name}</h3>
                <p className="text-corp-muted text-xs mb-4 tracking-wide">{v.jp}</p>
                <p className="text-corp-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <WaveDown />
      </section>

      {/* ════════ CTA ════════ */}
      <section className="bg-[#0f2855] py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-bright rounded-3xl p-14 lg:p-20 text-center relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-corp-forest/30 via-transparent to-corp-lavender/20 pointer-events-none rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-corp-teal opacity-10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-6 font-semibold">Get Started</p>
              <h2 className="text-4xl lg:text-6xl font-black mb-6">
                <span className="text-gradient">さあ、探究を<br />始めよう。</span>
              </h2>
              <p className="text-corp-muted text-lg mb-12 max-w-lg mx-auto leading-relaxed">
                TANQ Appは現在ベータ版を公開中。
                無料で体験できます。お子さんと一緒に、「発見する喜び」を体験してください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="px-10 py-4 rounded-full btn-glow-teal text-lg font-bold">
                  無料で登録する →
                </Link>
                <Link href="/contact" className="px-10 py-4 rounded-full border border-corp-muted/30 text-corp-muted font-semibold text-lg hover:border-corp-teal/40 hover:text-corp-teal transition-all">
                  お問い合わせ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ APP LAB CTA ════════ */}
      <section className="relative bg-corp-navy py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-corp-teal opacity-10 blur-[100px]" />
          <div className="absolute inset-0 grid-overlay opacity-30" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="glass-card-bright rounded-3xl p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-10 border border-corp-teal/30" style={{ boxShadow: '0 0 60px rgba(0,229,195,0.12), inset 0 0 40px rgba(0,229,195,0.05)' }}>
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-corp-teal/15 border border-corp-teal/30 text-corp-teal text-sm font-semibold mb-5 tracking-wide">
                <span className="text-lg">🔓</span> アプリラボ — すべてのアプリを体験
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                <span className="text-gradient">6つのアプリが</span>
                <br />
                <span className="text-white">まとめて遊べる！</span>
              </h2>
              <p className="text-corp-muted text-lg leading-relaxed mb-6">
                理科探究・計算・漢字・英語・時計・プログラミング思考…
                <br />
                TANQラボに入れば全部遊べるよ！
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lab"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-xl font-black text-[#050b14] transition-all hover:scale-[1.04]"
                  style={{ background: 'linear-gradient(135deg, #00e5c3, #c4a8ff)', boxShadow: '0 0 40px rgba(0,229,195,0.4)' }}
                >
                  🔑 アプリラボに入る
                  <span className="text-2xl">→</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl text-lg font-bold border-2 border-corp-teal/40 text-corp-teal hover:bg-corp-teal/10 transition-all"
                >
                  無料登録はこちら
                </Link>
              </div>
              {/* ── [TRIAL] ログインなし体験ボタン（テストデータ収集後に削除） */}
              <Link
                href="/lab?trial=1"
                className="inline-flex items-center gap-2 text-[#c4a8ff] font-bold text-sm hover:text-white transition-colors mt-1"
              >
                🚀 登録なしで今すぐ体験する →
              </Link>
              {/* ── [TRIAL] END ── */}
              <p className="text-corp-muted text-xs mt-2">パスワードは登録するともらえるよ ✨</p>
            </div>
            {/* Right — app icons grid */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: '🔬', label: '理科探究', color: '#00e5c3' },
                  { emoji: '🔢', label: '計算', color: '#60a5fa' },
                  { emoji: '📖', label: '漢字', color: '#c4a8ff' },
                  { emoji: '🌍', label: '英語', color: '#f87171' },
                  { emoji: '🕐', label: '時計', color: '#f0c040' },
                  { emoji: '💻', label: 'プログラミング', color: '#4ade80' },
                ].map(({ emoji, label, color }) => (
                  <div
                    key={label}
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[9px] font-semibold" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" className="relative bg-corp-navy py-32 px-6 overflow-hidden">
        <WaveUp />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">About</p>
            <h2 className="text-4xl lg:text-5xl font-black">会社概要</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Table */}
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <table className="w-full">
                <tbody>
                  {COMPANY_INFO.map(([label, value]) => (
                    <tr key={label} className="border-b border-white/8 last:border-0">
                      <td className="py-4 text-corp-muted text-sm w-32 shrink-0">{label}</td>
                      <td className="py-4 text-corp-text font-semibold text-sm">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Story */}
            <div>
              <h3 className="text-3xl font-black mb-6">
                <span className="text-gradient">社名の由来</span>
              </h3>
              <p className="text-corp-muted leading-relaxed mb-5 text-lg">
                <strong className="text-corp-teal font-bold">TANQ</strong> = 探究（たんきゅう / Tankyū）
              </p>
              <p className="text-corp-muted leading-relaxed mb-5">
                探究とは「答えのない問いに向き合い続けること」。
                受験でも、自由研究でも、その根っこにあるのは同じ知的な炎です。
              </p>
              <p className="text-corp-muted leading-relaxed mb-8">
                10年後、日本中の子どもたちが「学ぶことが好き」と言える社会をつくる。
                TANQのAIは、すべての子どもに「個人専属のソクラテス」を届けます。
              </p>

              <div className="flex items-center gap-4 p-5 glass-card rounded-xl">
                <Image
                  src="/tanquu/happy.png"
                  alt="TANQuu"
                  width={64}
                  height={64}
                  className="drop-shadow-[0_0_15px_rgba(196,168,255,0.6)]"
                />
                <div>
                  <p className="text-corp-text font-bold text-sm">TANQuu（タンキュー）</p>
                  <p className="text-corp-muted text-xs mt-1">ラベンダー×白の猫キャラクター。子どもの探究心を引き出すナビゲーター。</p>
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
