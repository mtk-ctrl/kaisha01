import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── Legacy colors (keep for backward compat) ──
        tanquu: {
          purple: '#b39ddb',
          light:  '#ede7f6',
          bubble: '#f3e5f5',
        },
        corp: {
          navy:        '#0d2248',
          'navy-mid':  '#162d5a',
          teal:        '#00e5c3',
          'teal-glow': '#00f0d0',
          lavender:    '#c4a8ff',
          forest:      '#1a5a48',
          gold:        '#f0c040',
          text:        '#e8f0fe',
          muted:       '#94a3c4',
        },
        // ── Fantasy / Sticker palette ──
        cream: '#FFF6E5',
        'cream-deep': '#FFEBC9',
        'mint-bg': '#DBF6F0',
        'pink-bg': '#FFE3EE',
        'lav-bg': '#EFE8FF',
        yellow: {
          DEFAULT: '#FFC83D',
          soft: '#FFE39A',
        },
        pink: {
          DEFAULT: '#FF6F9C',
          soft: '#FFC0DA',
          bg: '#FFE3EE',
        },
        mint: {
          DEFAULT: '#4ECDC4',
          soft: '#9DEDDE',
          bg: '#DBF6F0',
        },
        lavender: {
          DEFAULT: '#B197FC',
          soft: '#D9C7FF',
          bg: '#EFE8FF',
        },
        ink: {
          DEFAULT: '#3A2E2A',
          soft: '#6B5A52',
        },
      },
      fontFamily: {
        round:   ['"Hiragino Maru Gothic ProN"', '"M PLUS Rounded 1c"', 'sans-serif'],
        sans:    ['Inter', '"Noto Sans JP"', 'sans-serif'],
        zen:     ['var(--font-zen)', '"Hiragino Maru Gothic ProN"', '"M PLUS Rounded 1c"', 'sans-serif'],
        hachi:   ['var(--font-hachi)', 'cursive'],
        fredoka: ['var(--font-fredoka)', 'sans-serif'],
      },
      animation: {
        // Legacy
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 10s ease-in-out infinite',
        'glow-pulse':     'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'fade-up':        'fadeUp 0.8s ease forwards',
        'spin-slow':      'spin 20s linear infinite',
        // Sticker style
        'float-sticker':  'floatSticker 5s ease-in-out infinite',
        'halo-spin':      'haloSpin 22s linear infinite',
        'drift':          'drift 18s ease-in-out infinite',
      },
      keyframes: {
        // Legacy
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':       { opacity: '1',   transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Sticker style
        floatSticker: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-14px)' },
        },
        haloSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%':       { transform: 'translateX(30px)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      boxShadow: {
        'glow-teal':    '0 0 30px rgba(0, 229, 195, 0.4)',
        'glow-lavender':'0 0 30px rgba(196, 168, 255, 0.4)',
        'glow-gold':    '0 0 30px rgba(240, 192, 64, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config
