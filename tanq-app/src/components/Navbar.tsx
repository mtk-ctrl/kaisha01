'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/lab',      label: 'アプリ' },
  { href: '/tanq',     label: 'ストーリー' },
  { href: '/pricing',  label: 'りょうきん' },
  { href: '/contact',  label: 'おといあわせ' },
]

function LogoMark({ size = 32 }: { size?: number }) {
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authType, setAuthType] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setAuthType(localStorage.getItem('tanq-lab-auth'))
  }, [])

  async function handleLogout() {
    if (authType === 'member') {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    localStorage.removeItem('tanq-lab-auth')
    localStorage.removeItem('tanq-tester-name')
    setAuthType(null)
    setMenuOpen(false)
    router.push('/')
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '2.5px solid #3A2E2A',
        height: '64px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            filter: 'drop-shadow(2px 2px 0 #3A2E2A)',
          }}
        >
          <LogoMark size={32} />
          <span
            style={{
              fontFamily: 'var(--font-fredoka), sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              letterSpacing: '0.04em',
              color: '#3A2E2A',
              lineHeight: 1,
            }}
          >
            TANQ
          </span>
          <span
            style={{
              fontFamily: 'var(--font-hachi), cursive',
              fontSize: '11px',
              color: '#6B5A52',
              marginTop: '2px',
              lineHeight: 1,
            }}
          >
            タンク
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontWeight: 700,
                fontSize: '14px',
                color: isActive(href) ? '#FF6F9C' : '#3A2E2A',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#FF6F9C'
              }}
              onMouseLeave={(e) => {
                if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#3A2E2A'
              }}
            >
              {label}
            </Link>
          ))}

          {authType ? (
            /* ログアウト */
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-zen), sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                color: '#3A2E2A',
                background: '#ffffff',
                border: '2.5px solid #3A2E2A',
                borderRadius: '9999px',
                padding: '0.45em 1.2em',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                cursor: 'pointer',
                transition: 'transform 0.12s ease, box-shadow 0.12s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translate(-2px,-2px)'
                el.style.boxShadow = '5px 5px 0 0 #3A2E2A'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = ''
                el.style.boxShadow = '3px 3px 0 0 #3A2E2A'
              }}
            >
              ログアウト
            </button>
          ) : (
            <>
              {/* ログイン */}
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-zen), sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#3A2E2A',
                  background: '#ffffff',
                  border: '2.5px solid #3A2E2A',
                  borderRadius: '9999px',
                  padding: '0.45em 1.2em',
                  boxShadow: '3px 3px 0 0 #3A2E2A',
                  textDecoration: 'none',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translate(-2px,-2px)'
                  el.style.boxShadow = '5px 5px 0 0 #3A2E2A'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = ''
                  el.style.boxShadow = '3px 3px 0 0 #3A2E2A'
                }}
              >
                ログイン
              </Link>

              {/* はじめる */}
              <Link
                href="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-zen), sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#3A2E2A',
                  background: '#FFC83D',
                  border: '2.5px solid #3A2E2A',
                  borderRadius: '9999px',
                  padding: '0.45em 1.2em',
                  boxShadow: '3px 3px 0 0 #3A2E2A',
                  textDecoration: 'none',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translate(-2px,-2px)'
                  el.style.boxShadow = '5px 5px 0 0 #3A2E2A'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = ''
                  el.style.boxShadow = '3px 3px 0 0 #3A2E2A'
                }}
              >
                はじめる →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            width: '44px',
            height: '44px',
            padding: '10px 8px',
            background: '#FFC83D',
            border: '2.5px solid #3A2E2A',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 0 #3A2E2A',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: '#3A2E2A',
              borderRadius: '2px',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: '#3A2E2A',
              borderRadius: '2px',
              transition: 'opacity 0.2s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '100%',
              height: '3px',
              background: '#3A2E2A',
              borderRadius: '2px',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: '#FFF6E5',
            borderBottom: '3px solid #3A2E2A',
            boxShadow: '0 8px 0 0 #3A2E2A',
            padding: '20px 24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 16px',
                fontWeight: 700,
                fontSize: '16px',
                color: isActive(href) ? '#FF6F9C' : '#3A2E2A',
                textDecoration: 'none',
                background: '#ffffff',
                border: '2.5px solid #3A2E2A',
                borderRadius: '14px',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                textAlign: 'center',
              }}
            >
              {label}
            </Link>
          ))}
          {authType ? (
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                fontWeight: 700,
                fontSize: '16px',
                color: '#3A2E2A',
                background: '#ffffff',
                border: '2.5px solid #3A2E2A',
                borderRadius: '14px',
                boxShadow: '3px 3px 0 0 #3A2E2A',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              ログアウト
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#3A2E2A',
                  textDecoration: 'none',
                  background: '#ffffff',
                  border: '2.5px solid #3A2E2A',
                  borderRadius: '14px',
                  boxShadow: '3px 3px 0 0 #3A2E2A',
                  textAlign: 'center',
                }}
              >
                ログイン
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#3A2E2A',
                  textDecoration: 'none',
                  background: '#FFC83D',
                  border: '2.5px solid #3A2E2A',
                  borderRadius: '14px',
                  boxShadow: '3px 3px 0 0 #3A2E2A',
                  textAlign: 'center',
                }}
              >
                はじめる →
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
