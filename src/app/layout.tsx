import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HistoryCard - AI驱动的历史学习平台',
  description: '通过AI生成的互动学习卡片探索历史事件、文明和传奇人物。从古代帝国到现代革命。',
  keywords: ['历史学习', '历史知识', '古代文明', 'AI教育', '历史卡片', '互动学习'],
  authors: [{ name: 'HistoryCard Team' }],
  creator: 'HistoryCard Team',
  publisher: 'HistoryCard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'HistoryCard - AI驱动的历史学习平台',
    description: '通过AI生成的互动学习卡片探索历史事件、文明和传奇人物。从古代帝国到现代革命。',
    url: 'https://history-card.vercel.app',
    siteName: 'HistoryCard',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HistoryCard - AI驱动的历史学习平台',
    description: '通过AI生成的互动学习卡片探索历史事件、文明和传奇人物。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}