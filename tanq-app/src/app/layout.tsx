import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TANQ — TANQuu とひみつを探ろう',
  description: '科学のウソみたいなホント、一緒に発見しよう',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-tanquu-light">{children}</body>
    </html>
  )
}
