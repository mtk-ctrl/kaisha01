import type { Metadata, Viewport } from 'next'
import { Zen_Maru_Gothic, Hachi_Maru_Pop, Fredoka } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const zenMaru = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-zen',
  display: 'swap',
})

const hachiMaru = Hachi_Maru_Pop({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-hachi',
  display: 'swap',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
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
  // ピンチズームを許可（WCAG 1.4.4 準拠）。弱視の子・保護者が拡大できるよう maximumScale は制限しない
  maximumScale: 5,
  userScalable: true,
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${zenMaru.variable} ${hachiMaru.variable} ${fredoka.variable}`}
    >
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
