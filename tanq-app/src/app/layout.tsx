import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TANQ Inc. — 好奇心を、ちからに。',
  description: 'AIで小学生〜高校生に「考える喜び」を届ける教育テクノロジー企業。福岡発。',
  openGraph: {
    title: 'TANQ Inc. — 好奇心を、ちからに。',
    description: 'AIで小学生〜高校生に「考える喜び」を届ける教育テクノロジー企業。',
    siteName: 'TANQ Inc.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
