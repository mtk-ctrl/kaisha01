import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const PLANS = [
  {
    name: '無料',
    price: '¥0',
    period: '',
    color: '#4ade80',
    badge: null,
    features: [
      'TANQ App Unit 1〜2',
      '計算チャレンジ（基本）',
      '漢字クイズ 小1〜小2',
      '学習履歴（30日分）',
    ],
    disabled: ['全Unit（Unit 3〜5）', '保護者レポート', '広告なし'],
    cta: '無料で始める',
    href: '/register',
    highlight: false,
  },
  {
    name: 'TANQ Plus',
    price: '¥980',
    period: '/月',
    color: '#00e5c3',
    badge: '人気 No.1',
    features: [
      'TANQ App 全Unit（Season 1完全版）',
      '計算チャレンジ 全難易度',
      '漢字クイズ 小1〜小6',
      '学習履歴（無制限）',
      '保護者向け成績レポート',
      '広告なし',
    ],
    disabled: [],
    cta: '14日間無料で試す',
    href: '/register?plan=plus',
    highlight: true,
  },
  {
    name: 'TANQ Family',
    price: '¥1,480',
    period: '/月',
    color: '#c4a8ff',
    badge: 'お得！',
    features: [
      'Plus の全機能',
      '3人まで同時利用',
      '保護者ダッシュボード',
      'きょうだいそれぞれの学習データ',
      '優先サポート',
    ],
    disabled: [],
    cta: '14日間無料で試す',
    href: '/register?plan=family',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="bg-corp-navy text-corp-text font-sans overflow-x-hidden">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-corp-forest opacity-30 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-corp-lavender opacity-20 blur-[100px]" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      <main className="relative z-10 px-6 py-40">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-corp-teal text-xs uppercase tracking-[0.3em] font-semibold mb-4">Pricing</p>
            <h1 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-gradient">シンプルな料金体系</span>
            </h1>
            <p className="text-corp-muted text-lg max-w-xl mx-auto leading-relaxed">
              まずは無料で体験。気に入ったらいつでもアップグレード。
              14日間の無料トライアル付き。
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 ${plan.highlight ? 'glass-card-bright ring-2 ring-corp-teal/40' : 'glass-card'}`}
              >
                {/* Top band */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }} />

                <div className="p-8 flex flex-col flex-1">
                  {/* Badge */}
                  {plan.badge && (
                    <span
                      className="inline-block self-start text-xs px-3 py-1 rounded-full font-bold mb-4"
                      style={{ background: `${plan.color}25`, color: plan.color, border: `1px solid ${plan.color}40` }}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <h2 className="text-2xl font-black mb-2" style={{ color: plan.color }}>{plan.name}</h2>
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-5xl font-black text-corp-text">{plan.price}</span>
                    <span className="text-corp-muted text-lg mb-1">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-corp-text">
                        <span style={{ color: plan.color }} className="mt-0.5 text-base leading-none">✓</span>
                        {f}
                      </li>
                    ))}
                    {plan.disabled.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-corp-muted line-through opacity-50">
                        <span className="mt-0.5 text-base leading-none">✗</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className="mt-auto flex items-center justify-center w-full py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02]"
                    style={
                      plan.highlight
                        ? { background: plan.color, color: '#050b14', boxShadow: `0 0 30px ${plan.color}40` }
                        : { border: `2px solid ${plan.color}50`, color: plan.color }
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* B2B section */}
          <div className="glass-card-bright rounded-3xl p-10 lg:p-14 text-center">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-3xl font-black mb-4">
              <span className="text-gradient-gold">学校・塾・学童向け</span>
            </h2>
            <p className="text-corp-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              スクールライセンスなら、クラス全員で使えてさらにお得。
              授業用投影モード・管理者ダッシュボード付き。
              まずはお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-10 py-4 rounded-full btn-glow-teal text-lg font-bold"
              >
                スクールプランを問い合わせる →
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 rounded-full border border-corp-muted/30 text-corp-muted font-semibold text-lg hover:border-corp-teal/40 hover:text-corp-teal transition-all"
              >
                資料を請求する
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
