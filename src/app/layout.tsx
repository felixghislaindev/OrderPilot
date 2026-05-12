import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'OrderPilot',
  description: 'AI-powered operations dashboard for delivery restaurants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 text-zinc-50 antialiased font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  )
}
