import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'OrderPilot', template: '%s · OrderPilot' },
  description: 'Real-time order management for delivery restaurants. Every order from Uber Eats, Deliveroo, Just Eat, and direct channels — one live kitchen dashboard.',
  openGraph: {
    title: 'OrderPilot',
    description: 'Real-time order management for delivery restaurants.',
    url: 'https://orderpilot.online',
    siteName: 'OrderPilot',
  },
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
