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
]

const FEATURED_APPS = [
  { emoji: '🧩', name: 'かんがえる力ジム', target: '小4〜小6', badge: '100問 / 25バッジ', color: '#6366f1', desc: '場面想像・空間把握・因果推論を25種のトレーニングで鍛える。20レベル・バッジコレクション付き' },
  { emoji: '📖', name: '漢字マスター',      target: '小1〜小6', badge: '全学年対応',       color: '#c4a8ff', desc: '全学年の漢字をSRS（間隔反復）で効率よく定着。読み・書き・意味をまとめて学ぶ' },
  { emoji: '🌍', name: '英語ボキャブラリー', target: '小3〜小6', badge: '275語',           color: '#f87171', desc: '英→日・日→英の4択クイズ。音声発音つき。SRSで無理なく積み上げる' },
  { emoji: '🔢', name: '計算チャレンジ',    target: '小2〜小6', badge: 'タイムアタック',   color: '#60a5fa', desc: '足し算から分数まで。タイムアタック形式で計算スピードと正確さを同時に鍛える' },
  { emoji: '📐', name: '算数文章題',        target: '小1〜小3', badge: '文章から立式',     color: '#f0a050', desc: '文章を読んで式を選ぶ4択。「どの計算を使うか」を判断する力を育てる' },
  { emoji: '💻', name: 'プログラミング',    target: '小3〜小6', badge: '5ステージ',        color: '#4ade80', desc: 'コマンドを順番に並べてキャラクターをゴールへ。論理的思考の最初の一歩' },
  { emoji: '🕐', name: '時計・時間計算',    target: '小2〜小4', badge: '分・時間計算',     color: '#f0c040', desc: 'アナログ時計の読み方から「〇時間〇分後」の計算まで。つまずきがちな単元を丁寧に' },
  { emoji: '✖️', name: '九九マスター',      target: '小2〜小4', badge: '2〜9の段',         color: '#f59e0b', desc: '九九を何度でも繰り返す。完全マスターするまで諦めないシンプル設計' },
]

const HOW_STEPS = [
  {
    num: '01',
    emoji: '🔓',
    title: '登録なしで今すぐ体験',
    desc: '「まず試してみる」ボタンで即スタート。かんがえる力ジム・漢字・計算のLv1-2が登録不要で体験できます。',
    color: '#00e5c3',
  },
  {
    num: '02',
    emoji: '📝',
    title: '気に入ったら無料登録',
    desc: 'メールアドレスだけで30秒登録。全アプリ・全レベルが解放され、進捗・バッジがずっと保存されます。',
    color: '#c4a8ff',
  },
  {
    num: '03',
    emoji: '🎯',
    title: '毎日続けてレベルアップ',
    desc: 'バッジを集めながら少しずつ進める。連続学習記録・SRS（間隔反復）で、無理なく力がついていきます。',
    color: '#f0c040',
  },
]

const TARGET_KIDS = [
  { emoji: '🧩', text: '算数の文章題で式が選べない' },
  { emoji: '📖', text: '漢字をなかなか覚えられない' },
  { emoji: '💭', text: '考える力・論理的思考を伸ばしたい' },
  { emoji: '🌍', text: '英単語を増やしたい' },
  { emoji: '⏰', text: '時計の読み方・時間計算が苦手' },
  { emoji: '💻', text: 'プログラミングに興味がある' },
]

const VALUES = [
  { name: 'Curiosity First', jp: '好奇心を殺さない',   icon: '🌱', desc: 'それがすべての起点。正解を急がせず、考える楽しさを大切にする。',     color: '#4ade80' },
  { name: 'Honest Impact',   jp: '誠実な影響',         icon: '💎', desc: '子どものためになることだけをやる。ビジネスの都合で妥協しない。',     color: '#00e5c3' },
  { name: 'Simplicity',      jp: 'シンプルに',         icon: '⚡', desc: '複雑な学習をシンプルな体験に変える。子どもが一人で使いこなせるUI。', color: '#c4a8ff' },
  { name: 'Long Game',       jp: '長期視点',           icon: '🌳', desc: '目先のテスト対策ではなく、一生使える思考力と学習習慣を育てる。',     color: '#f0c040' },
]

const COMPANY_INFO = [
  ['社名',     'TANQ Inc.（タンク）'],
  ['設立',     '2026年5月'],
  ['所在地',   '福岡県福岡市'],
  ['事業内容', '小学生向け教育テクノロジー'],
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
            style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.dur }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-40 flex flex-col lg:flex-row items-center gap-16">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-corp-teal/30 bg-corp-teal/10 text-corp-teal text-sm mb-10 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-corp-teal animate-pulse" />
              小学生向け学習アプリラボ
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
              <span className="text-white">漢字・計算・英語・</span>
              <br />
              <span className="text-gradient">思考力。</span>
              <br />
              <span className="text-white text-4xl lg:text-5xl font-bold">全部ゲームで育てよう。</span>
            </h1>

            <p className="text-lg text-corp-muted mb-10 max-w-lg leading-relaxed">
              TANQラボは、小学生が楽しみながら学べる10種以上のアプリが揃った学習プラットフォームです。
              バッジを集めながら、考える力・語彙力・計算力を毎日5分で積み上げる。
            </p>

            {/* 3 entry paths */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/lab?trial=1"
                className="px-8 py-4 rounded-full btn-glow-teal text-base font-bold text-center"
              >
                登録なしで試してみる →
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 rounded-full border border-corp-teal/30 text-corp-teal font-semibold text-base hover:bg-corp-teal/10 transition-all text-center"
              >
                無料で登録する
              </Link>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <p className="text-corp-muted text-xs">登録不要・3秒で開始</p>
              <span className="text-corp-muted/40 text-xs">|</span>
              <Link href="/tester" className="text-corp-muted text-xs hover:text-corp-teal transition-colors">
                🧪 テスターの方はこちら
              </Link>
            </div>
          </div>

          {/* TANQuu mascot */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 rounded-full bg-corp-lavender opacity-20 blur-3xl scale-125 animate-glow-pulse" />
            <Image
              src="/tanquu/happy.png"
              alt="TANQuu"
              width={320}
              height={320}
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

      {/* ════════ APPS ════════ */}
      <section id="app" className="bg-[#0f2855] py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Apps</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 tracking-tight">10種以上のアプリが揃ってる</h2>
            <p className="text-corp-muted text-lg max-w-2xl mx-auto leading-relaxed">
              ひとつのアカウントで全部使える。学年・目的に合わせて自由に選んでOK。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_APPS.map((app) => (
              <div
                key={app.name}
                className="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 hover:border-white/15"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{app.emoji}</span>
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                    style={{ background: `${app.color}20`, color: app.color, border: `1px solid ${app.color}40` }}
                  >
                    {app.badge}
                  </span>
                </div>
                <h3 className="font-black text-sm mb-1 text-[#e8f0fe] leading-tight">{app.name}</h3>
                <div className="text-[10px] font-bold mb-2.5" style={{ color: app.color }}>
                  📘 {app.target}
                </div>
                <p className="text-corp-muted text-xs leading-relaxed">{app.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/lab?trial=1"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-glow-teal text-base font-bold"
            >
              全部のアプリを見てみる →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="relative bg-corp-navy py-28 px-6 overflow-hidden">
        <WaveUp />

        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-25 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-5">はじめかたは、かんたん3ステップ</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_STEPS.map((step) => (
              <div
                key={step.num}
                className="glass-card rounded-2xl p-8 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black" style={{ color: step.color }}>{step.num}</span>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <h3 className="text-lg font-black mb-3" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-corp-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* 3 entry paths — visual separation */}
          <div className="mt-14 grid md:grid-cols-3 gap-4">
            <Link
              href="/lab?trial=1"
              className="glass-card rounded-2xl p-6 text-center border border-corp-teal/30 hover:border-corp-teal/60 transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-3">🔓</div>
              <div className="font-black text-[#e8f0fe] mb-1">登録なしで体験</div>
              <div className="text-corp-muted text-xs">一部アプリをすぐ体験できます</div>
              <div className="mt-3 text-corp-teal text-sm font-bold group-hover:translate-x-1 transition-transform inline-block">試してみる →</div>
            </Link>
            <Link
              href="/register"
              className="glass-card rounded-2xl p-6 text-center border border-corp-lavender/30 hover:border-corp-lavender/60 transition-all hover:-translate-y-1 group"
              style={{ background: 'rgba(196,168,255,0.05)' }}
            >
              <div className="text-3xl mb-3">📝</div>
              <div className="font-black text-[#e8f0fe] mb-1">無料で登録する</div>
              <div className="text-corp-muted text-xs">全アプリ解放・進捗が保存される</div>
              <div className="mt-3 text-corp-lavender text-sm font-bold group-hover:translate-x-1 transition-transform inline-block" style={{ color: '#c4a8ff' }}>登録する →</div>
            </Link>
            <Link
              href="/tester"
              className="glass-card rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 group opacity-80"
            >
              <div className="text-3xl mb-3">🧪</div>
              <div className="font-black text-[#e8f0fe] mb-1">テスターとして入る</div>
              <div className="text-corp-muted text-xs">招待を受けた方。名前とコードで入場</div>
              <div className="mt-3 text-corp-muted text-sm font-bold group-hover:translate-x-1 transition-transform inline-block">テスター入口 →</div>
            </Link>
          </div>
        </div>

        <WaveDown />
      </section>

      {/* ════════ WHO IT'S FOR ════════ */}
      <section className="bg-[#0f2855] py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Who It's For</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">こんな子に向いてます</h2>
            <p className="text-corp-muted text-lg">「苦手」も「興味」も、TANQラボならアプリが見つかります。</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TARGET_KIDS.map((item) => (
              <div
                key={item.text}
                className="glass-card rounded-2xl p-5 flex items-center gap-3 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <span className="text-sm font-semibold text-[#e8f0fe] leading-tight">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-corp-teal/20">
            <div className="text-5xl shrink-0">👨‍👩‍👧</div>
            <div>
              <p className="font-black text-[#e8f0fe] text-lg mb-2">保護者の方へ</p>
              <p className="text-corp-muted text-sm leading-relaxed">
                TANQラボは広告なし・課金誘導なし。子どもが一人でも安全に使えるシンプルな設計です。
                まずは無料で体験してから、登録するかどうか決めてください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MISSION ════════ */}
      <section className="relative bg-corp-navy py-28 px-6 overflow-hidden">
        <WaveUp />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#1a4a3a] opacity-20 blur-[120px]" />
          <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-corp-lavender opacity-10 blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-6 font-semibold">Mission</p>
          <blockquote className="text-3xl lg:text-5xl font-bold leading-snug mb-8">
            <span className="text-gradient-green">&ldquo;すべての子どもの中に、</span>
            <br />
            <span className="text-white">生まれながらにして探究者がいる。&rdquo;</span>
          </blockquote>
          <p className="text-corp-muted text-lg leading-relaxed max-w-2xl mx-auto">
            TANQは、AIを使ってすべての子どもが「考える喜び」を発見できる学習体験を創ります。
            目先のテスト対策だけでなく、一生使える思考力と学習習慣を育てる。
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-16">
            {VALUES.map((v) => (
              <div key={v.name} className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-black text-sm mb-0.5" style={{ color: v.color }}>{v.name}</h3>
                <p className="text-corp-muted text-[10px] mb-3 tracking-wide">{v.jp}</p>
                <p className="text-corp-muted text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <WaveDown />
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="bg-[#0f2855] py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-bright rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-corp-forest/30 via-transparent to-corp-lavender/20 pointer-events-none rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-corp-teal opacity-10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <Image src="/tanquu/happy.png" alt="TANQuu" width={100} height={100} className="drop-shadow-[0_0_30px_rgba(196,168,255,0.5)]" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-5">
                <span className="text-gradient">さあ、今日から始めよう。</span>
              </h2>
              <p className="text-corp-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                登録不要でいくつかのアプリが体験できます。気に入ったら、無料登録で全部解放。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link href="/lab?trial=1" className="px-10 py-4 rounded-full btn-glow-teal text-lg font-bold">
                  登録なしで試してみる →
                </Link>
                <Link href="/register" className="px-10 py-4 rounded-full border border-corp-teal/30 text-corp-teal font-semibold text-lg hover:bg-corp-teal/10 transition-all">
                  無料で登録する
                </Link>
              </div>
              <Link href="/tester" className="text-corp-muted text-sm hover:text-corp-teal transition-colors">
                🧪 テスターの方はこちら
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" className="relative bg-corp-navy py-28 px-6 overflow-hidden">
        <WaveUp />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] mb-4 font-semibold">About</p>
            <h2 className="text-4xl lg:text-5xl font-black">会社概要</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
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
                <Image src="/tanquu/happy.png" alt="TANQuu" width={64} height={64} className="drop-shadow-[0_0_15px_rgba(196,168,255,0.6)]" />
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
