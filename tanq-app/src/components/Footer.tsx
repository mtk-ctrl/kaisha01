import Link from 'next/link'

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="#FFC83D" stroke="#3A2E2A" strokeWidth="2.5" />
      <path
        d="M14 17l3 3 9-9"
        stroke="#3A2E2A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

const footerLinks = [
  { href: '/lab',      label: 'アプリ' },
  { href: '/tanq',     label: 'ストーリー' },
  { href: '/pricing',  label: '料金' },
  { href: '/register', label: '登録' },
  { href: '/login',    label: 'ログイン' },
  { href: '/tester',   label: 'テスター' },
  { href: '/contact',  label: 'お問い合わせ' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: '#FFEBC9',
        borderTop: '2.5px solid #3A2E2A',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Brand row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ filter: 'drop-shadow(2px 2px 0 #3A2E2A)' }}>
            <LogoMark size={28} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-fredoka), sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#3A2E2A',
              lineHeight: 1,
            }}
          >
            TANQ Inc.
          </span>
          <span
            style={{
              fontSize: '13px',
              color: '#6B5A52',
              fontWeight: 600,
            }}
          >
            探究する子どもたちのために。
          </span>
        </div>

        {/* Links row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '4px',
            marginBottom: '28px',
          }}
        >
          {footerLinks.map(({ href, label }, i) => (
            <span key={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Link
                href={href}
                className="text-ink hover:text-pink transition-colors duration-150"
                style={{
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {label}
              </Link>
              {i < footerLinks.length - 1 && (
                <span style={{ color: '#6B5A52', fontSize: '13px', userSelect: 'none' }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#6B5A52',
            borderTop: '1.5px dashed rgba(58, 46, 42, 0.2)',
            paddingTop: '20px',
          }}
        >
          © 2026 TANQ Inc. — Made with ♥ in 福岡
        </div>

      </div>
    </footer>
  )
}
