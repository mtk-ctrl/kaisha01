'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/#app',     label: 'アプリ' },
  { href: '/pricing',  label: '料金' },
  { href: '/lab',      label: '🔑 ラボ' },
  { href: '/#about',   label: '会社について' },
  { href: '/contact',  label: 'お問い合わせ' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050b14]/90 backdrop-blur-2xl border-b border-[#00e5c3]/10 shadow-[0_4px_40px_rgba(0,229,195,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-2xl font-black tracking-wider text-gradient transition-opacity group-hover:opacity-80">
            TANQ
          </span>
          <span className="text-[10px] text-corp-muted font-light uppercase tracking-widest mt-1">Inc.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-corp-muted hover:text-corp-text transition-colors text-sm font-medium tracking-wide"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-full btn-glow-teal text-sm tracking-wide"
          >
            無料で始める
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-corp-muted hover:text-corp-text transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#050b14]/95 backdrop-blur-2xl border-t border-white/10 px-6 py-6 flex flex-col gap-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-corp-muted hover:text-corp-text transition-colors py-2 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/register"
            className="mt-3 px-6 py-3 rounded-full btn-glow-teal text-sm text-center"
            onClick={() => setMenuOpen(false)}
          >
            無料で始める
          </Link>
        </div>
      )}
    </nav>
  )
}
