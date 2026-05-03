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
      },
      fontFamily: {
        round: ['"Hiragino Maru Gothic ProN"', '"M PLUS Rounded 1c"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
