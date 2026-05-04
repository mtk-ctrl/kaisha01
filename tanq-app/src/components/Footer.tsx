import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#050b14] border-t border-white/10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-black tracking-wider text-gradient mb-5">TANQ</div>
            <p className="text-corp-muted text-sm leading-relaxed max-w-xs mb-6">
              AIで小学生〜高校生に「考える喜び」を届ける教育テクノロジー企業です。
              福岡から、日本中の子どもたちへ。
            </p>
            <p className="text-corp-muted text-xs">
              📍 福岡県福岡市
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-corp-text font-semibold mb-5 text-sm tracking-wide">プロダクト</h4>
            <ul className="space-y-3">
              {[
                { href: '/tanq',      label: 'TANQ App を体験' },
                { href: '/register',  label: '無料登録' },
                { href: '/#app',      label: 'アプリ概要' },
                { href: '/lab',       label: 'アプリラボ 🔒' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-corp-muted hover:text-corp-teal transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-corp-text font-semibold mb-5 text-sm tracking-wide">会社情報</h4>
            <ul className="space-y-3">
              {[
                { href: '/#about',   label: '会社概要' },
                { href: '/contact',  label: 'お問い合わせ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-corp-muted hover:text-corp-teal transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-corp-muted text-xs">© 2026 TANQ Inc. All rights reserved.</p>
          <p className="text-corp-muted text-xs">
            <span className="text-corp-teal">contact@tanq.jp</span>
            {' '}| 福岡県福岡市
          </p>
        </div>
      </div>
    </footer>
  )
}
