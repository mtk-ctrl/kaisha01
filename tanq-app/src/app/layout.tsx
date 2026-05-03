import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TANQ — TANQuu とひみつを探ろう',
  description: '科学のウソみたいなホント、一緒に発見しよう',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-tanquu-light">{children}</body>
    </html>
  )
}
