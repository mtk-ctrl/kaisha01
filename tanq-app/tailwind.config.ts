import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        tanquu: {
          purple: '#b39ddb',
          light:  '#ede7f6',
          bubble: '#f3e5f5',
        },
        corp: {
          navy:        '#050b14',
          'navy-mid':  '#0a1628',
          teal:        '#00e5c3',
          'teal-glow': '#00f0d0',
          lavender:    '#c4a8ff',
          forest:      '#1a4a3a',
          gold:        '#f0c040',
          text:        '#e8f0fe',
          muted:       '#8892b0',
        },
      },
      fontFamily: {
        round: ['"Hiragino Maru Gothic ProN"', '"M PLUS Rounded 1c"', 'sans-serif'],
        sans:  ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 10s ease-in-out infinite',
        'glow-pulse':     'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'fade-up':        'fadeUp 0.8s ease forwards',
        'spin-slow':      'spin 20s linear infinite',
      },
      keyframes: {
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
